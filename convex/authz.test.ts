// @vitest-environment edge-runtime
/// <reference types="vite/client" />
import { convexTest, type TestConvex } from 'convex-test';
import { describe, expect, test } from 'vitest';
import schema from './schema';
import { api, internal } from './_generated/api';
import type { Id } from './_generated/dataModel';

// convex-test needs the module map so it can load every function file.
const modules = import.meta.glob('./**/*.ts');

/** A minimal Clerk-like identity; `subject` becomes profiles.clerk_id. */
function identity(subject: string) {
  return {
    subject,
    issuer: 'https://test.clerk.dev',
    name: `User ${subject}`,
    email: `${subject}@test.dev`,
  };
}

// Schema-aware test handle so `t.run` ctx knows our custom table indexes.
type T = TestConvex<typeof schema>;

async function membershipCount(t: T, userId: string): Promise<number> {
  return await t.run(async (ctx) => {
    const rows = await ctx.db
      .query('memberships')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();
    return rows.length;
  });
}

async function defaultOrgId(t: T, userId: string): Promise<Id<'organizations'> | null> {
  return await t.run(async (ctx) => {
    const m = await ctx.db
      .query('memberships')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first();
    return m?.organizationId ?? null;
  });
}

async function conceptIdBySlug(t: T, slug: string): Promise<Id<'concepts'> | null> {
  return await t.run(async (ctx) => {
    const c = await ctx.db
      .query('concepts')
      .withIndex('by_slug', (q) => q.eq('slug', slug))
      .unique();
    return c?._id ?? null;
  });
}

async function makePlatformAdmin(t: T, userId: string): Promise<void> {
  await t.run(async (ctx) => {
    const p = await ctx.db
      .query('profiles')
      .withIndex('by_clerk_id', (q) => q.eq('clerk_id', userId))
      .unique();
    if (p) await ctx.db.patch(p._id, { is_platform_admin: true });
  });
}

describe('authz + multi-tenancy', () => {
  // A — Org isolation.
  test('A: a resource created under org A is not visible to a user in org B', async () => {
    const t = convexTest(schema, modules);
    await t.mutation(internal.seed.seedScienceProofVerticals, {});
    const conceptId = await conceptIdBySlug(t, 'cells');
    expect(conceptId).not.toBeNull();

    await t.withIdentity(identity('user-a')).mutation(api.profiles.ensureProfile, {});
    await t.withIdentity(identity('user-b')).mutation(api.profiles.ensureProfile, {});

    // User A creates a resource in their default (personal) org.
    await t.withIdentity(identity('user-a')).mutation(api.resources.create, {
      conceptId: conceptId!,
      resourceType: 'lesson',
      abilityLevel: 'core',
      title: 'A lesson',
      summary: 'summary',
      content: { body: 'x' },
    });

    const aResources = await t
      .withIdentity(identity('user-a'))
      .query(api.resources.getResourcesForConcept, { conceptId: conceptId! });
    const bResources = await t
      .withIdentity(identity('user-b'))
      .query(api.resources.getResourcesForConcept, { conceptId: conceptId! });

    expect(aResources).toHaveLength(1);
    expect(bResources).toHaveLength(0);
  });

  // B — Non-admin curriculum write rejected (org-owner does not qualify).
  test('B: a non-admin (even their own org owner) cannot write curriculum data', async () => {
    const t = convexTest(schema, modules);
    await t.withIdentity(identity('teacher')).mutation(api.profiles.ensureProfile, {});

    await expect(
      t
        .withIdentity(identity('teacher'))
        .mutation(api.curriculumAdmin.createSubject, { slug: 'rogue', name: 'Rogue' }),
    ).rejects.toThrow();

    // Only is_platform_admin === true unlocks it.
    await makePlatformAdmin(t, 'teacher');
    const id = await t
      .withIdentity(identity('teacher'))
      .mutation(api.curriculumAdmin.createSubject, { slug: 'extra', name: 'Extra' });
    expect(id).toBeTruthy();
  });

  // C — Existing-profile backfill, idempotent.
  test('C: ensureProfile backfills org + membership for a pre-orgs profile, idempotently', async () => {
    const t = convexTest(schema, modules);
    // A profile that exists BEFORE orgs/memberships (no membership).
    await t.run(async (ctx) => {
      await ctx.db.insert('profiles', {
        clerk_id: 'legacy-user',
        email: 'legacy@test.dev',
        role: 'teacher',
        updated_at: new Date().toISOString(),
      });
    });
    expect(await membershipCount(t, 'legacy-user')).toBe(0);

    await t.withIdentity(identity('legacy-user')).mutation(api.profiles.ensureProfile, {});
    expect(await membershipCount(t, 'legacy-user')).toBe(1);

    const orgId = await defaultOrgId(t, 'legacy-user');
    const orgType = await t.run(async (ctx) => (orgId ? (await ctx.db.get(orgId))?.type : null));
    expect(orgType).toBe('individual');

    // Re-running must not create a second org/membership.
    await t.withIdentity(identity('legacy-user')).mutation(api.profiles.ensureProfile, {});
    expect(await membershipCount(t, 'legacy-user')).toBe(1);
  });

  // D — Client-provided-org protection.
  test('D: passing another org’s id is rejected (membership checked, never trusted)', async () => {
    const t = convexTest(schema, modules);
    await t.mutation(internal.seed.seedScienceProofVerticals, {});
    const conceptId = await conceptIdBySlug(t, 'cells');

    await t.withIdentity(identity('user-a')).mutation(api.profiles.ensureProfile, {});
    await t.withIdentity(identity('user-b')).mutation(api.profiles.ensureProfile, {});
    const orgB = await defaultOrgId(t, 'user-b');
    expect(orgB).not.toBeNull();

    // User A may not READ org B's resources by supplying org B's id.
    await expect(
      t.withIdentity(identity('user-a')).query(api.resources.getResourcesForConcept, {
        conceptId: conceptId!,
        organizationId: orgB!,
      }),
    ).rejects.toThrow();

    // ...nor WRITE into org B.
    await expect(
      t.withIdentity(identity('user-a')).mutation(api.resources.create, {
        conceptId: conceptId!,
        resourceType: 'lesson',
        abilityLevel: 'core',
        title: 'x',
        summary: 'y',
        content: {},
        organizationId: orgB!,
      }),
    ).rejects.toThrow();
  });

  // E — Seed idempotency.
  test('E: running the seed twice does not duplicate curriculum data', async () => {
    const t = convexTest(schema, modules);
    await t.mutation(internal.seed.seedScienceProofVerticals, {});
    await t.mutation(internal.seed.seedScienceProofVerticals, {});

    const counts = await t.run(async (ctx) => ({
      subjects: (await ctx.db.query('subjects').collect()).length,
      yearStages: (await ctx.db.query('yearStages').collect()).length,
      topics: (await ctx.db.query('topics').collect()).length,
      concepts: (await ctx.db.query('concepts').collect()).length,
      edges: (await ctx.db.query('conceptEdges').collect()).length,
    }));
    expect(counts).toEqual({ subjects: 3, yearStages: 5, topics: 3, concepts: 14, edges: 28 });
  });

  // F — Edge direction is locked.
  test('F: concept-edge direction is locked (next/prior cannot be silently reversed)', async () => {
    const t = convexTest(schema, modules);
    await t.mutation(internal.seed.seedScienceProofVerticals, {});
    await t.withIdentity(identity('reader')).mutation(api.profiles.ensureProfile, {});

    const aId = await conceptIdBySlug(t, 'cells'); // A
    const bId = await conceptIdBySlug(t, 'specialised-cells'); // B, seeded as A → B

    const reader = t.withIdentity(identity('reader'));
    const next = await reader.query(api.curriculum.getNextTreatment, { conceptId: aId! });
    const prior = await reader.query(api.curriculum.getPriorTreatment, { conceptId: bId! });
    const reverseNext = await reader.query(api.curriculum.getNextTreatment, { conceptId: bId! });

    expect(next.map((c) => c.slug)).toContain('specialised-cells'); // next(A) ⊇ {B}
    expect(prior.map((c) => c.slug)).toContain('cells'); // prior(B) ⊇ {A}
    expect(reverseNext.map((c) => c.slug)).not.toContain('cells'); // next(B) ⊅ {A}
  });

  // G — Regression: a profile created before orgs existed crashes curriculum
  // reads with "no organisation membership" until ensureProfile backfills it.
  // This is the /dashboard/concepts crash; auth bootstrap now always calls
  // ensureProfile so existing-but-membership-less users are healed.
  test('G: ensureProfile backfill unblocks curriculum reads for a pre-orgs profile', async () => {
    const t = convexTest(schema, modules);
    await t.mutation(internal.seed.seedScienceProofVerticals, {});

    // Existing profile, NO membership (the state left by the earlier auth fix).
    await t.run(async (ctx) => {
      await ctx.db.insert('profiles', {
        clerk_id: 'preorg-user',
        email: 'preorg-user@test.dev',
        role: 'teacher',
        updated_at: new Date().toISOString(),
      });
    });

    const reader = t.withIdentity(identity('preorg-user'));

    // Before backfill: a curriculum read throws the membership error (the crash).
    await expect(reader.query(api.curriculum.listSubjects, {})).rejects.toThrow(
      /organisation membership/i,
    );

    // Auth bootstrap calls ensureProfile → creates personal org + owner membership.
    await reader.mutation(api.profiles.ensureProfile, {});
    expect(await membershipCount(t, 'preorg-user')).toBe(1);

    // After backfill: the same read now succeeds.
    const subjects = await reader.query(api.curriculum.listSubjects, {});
    expect(subjects.length).toBe(3);
  });
});
