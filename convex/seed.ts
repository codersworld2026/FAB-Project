import { internalMutation } from './_generated/server';
import type { Id } from './_generated/dataModel';
import {
  upsertSubjectBySlug,
  upsertYearStageBySlug,
  upsertTopicByKey,
  upsertConceptBySlug,
  upsertEdgeByKey,
} from './curriculumAdmin';
import { SEED_YEAR_STAGES, SEED_VERTICALS } from './seedData';

/**
 * Seeds the Science proof verticals (Biology / Chemistry / Physics). No auth —
 * this is an internalMutation run by an operator:
 *   npx convex run seed:seedScienceProofVerticals
 *
 * Fully idempotent via stable-key upserts (subjects/yearStages/concepts by slug,
 * topics by subject+stage+title, edges by from+to+type), so re-running never
 * duplicates anything. Seeds only the proof verticals — no full-curriculum
 * expansion, no copyrighted material.
 */
export const seedScienceProofVerticals = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = new Date().toISOString();

    // 1) Real year stages (year-7..year-11). Foundation/Higher is NOT a year stage.
    const yearStageIdBySlug = new Map<string, Id<'yearStages'>>();
    for (const ys of SEED_YEAR_STAGES) {
      yearStageIdBySlug.set(ys.slug, await upsertYearStageBySlug(ctx, ys));
    }

    let subjects = 0;
    let topics = 0;
    let concepts = 0;
    let edges = 0;

    // 2) Each proof vertical: subject → home topic → concept chain → edges.
    for (const vertical of SEED_VERTICALS) {
      const subjectId = await upsertSubjectBySlug(ctx, vertical.subject);
      subjects++;

      const yearStageId = yearStageIdBySlug.get(vertical.topic.yearStageSlug);
      if (!yearStageId) {
        throw new Error(`Unknown year stage slug: ${vertical.topic.yearStageSlug}`);
      }

      const topicId = await upsertTopicByKey(ctx, {
        subjectId,
        yearStageId,
        title: vertical.topic.title,
        description: vertical.topic.description,
        orderIndex: vertical.topic.orderIndex,
      });
      topics++;

      // Concepts — all published, version managed by the upsert helper.
      const conceptIdBySlug = new Map<string, Id<'concepts'>>();
      for (const c of vertical.concepts) {
        const conceptId = await upsertConceptBySlug(ctx, {
          slug: c.slug,
          title: c.title,
          subjectId,
          yearStageId,
          topicId,
          orderIndex: c.orderIndex,
          shortDescription: c.shortDescription,
          detailedExplanation: c.detailedExplanation,
          priorLearningSummary: c.priorLearningSummary,
          nextLearningSummary: c.nextLearningSummary,
          commonMisconceptions: c.commonMisconceptions,
          keyVocabulary: c.keyVocabulary,
          lessonGuidance: c.lessonGuidance,
          assessmentGuidance: c.assessmentGuidance,
          practicalLinks: c.practicalLinks,
          difficultyLevel: c.difficultyLevel,
          abilitySuitability: c.abilitySuitability,
          scienceSkillsLinks: c.scienceSkillsLinks,
          status: 'published',
          lastEditedBy: 'seed',
          publishedAt: now,
        });
        conceptIdBySlug.set(c.slug, conceptId);
        concepts++;
      }

      // Edges: each consecutive pair A→B gets BOTH a `next` (B after A) and a
      // `prerequisite` (A required before B) — the canonical forward direction.
      const ordered = [...vertical.concepts].sort((a, b) => a.orderIndex - b.orderIndex);
      for (let i = 0; i < ordered.length - 1; i++) {
        const fromConceptId = conceptIdBySlug.get(ordered[i].slug);
        const toConceptId = conceptIdBySlug.get(ordered[i + 1].slug);
        if (!fromConceptId || !toConceptId) continue;
        await upsertEdgeByKey(ctx, { fromConceptId, toConceptId, edgeType: 'next' });
        await upsertEdgeByKey(ctx, { fromConceptId, toConceptId, edgeType: 'prerequisite' });
        edges += 2;
      }

      // A few `related` links within the vertical.
      for (const [aSlug, bSlug] of vertical.relatedPairs) {
        const fromConceptId = conceptIdBySlug.get(aSlug);
        const toConceptId = conceptIdBySlug.get(bSlug);
        if (!fromConceptId || !toConceptId) continue;
        await upsertEdgeByKey(ctx, { fromConceptId, toConceptId, edgeType: 'related' });
        edges++;
      }
    }

    return { yearStages: SEED_YEAR_STAGES.length, subjects, topics, concepts, edges };
  },
});
