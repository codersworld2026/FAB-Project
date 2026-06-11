import { v } from 'convex/values';
import { mutation } from './_generated/server';
import { requireMembership } from './authz';

// Lightweight org-scoped usage/audit log. The active organisation is resolved
// (and any supplied organizationId membership-checked) via requireMembership;
// events are stamped with the resolved org + the signed-in user.
export const logEvent = mutation({
  args: {
    eventType: v.string(),
    resourceId: v.optional(v.id('resources')),
    conceptId: v.optional(v.id('concepts')),
    metadata: v.optional(v.any()),
    organizationId: v.optional(v.id('organizations')),
  },
  handler: async (ctx, args) => {
    const { organizationId, userId } = await requireMembership(ctx, args.organizationId);
    return await ctx.db.insert('usageEvents', {
      organizationId,
      userId,
      resourceId: args.resourceId,
      conceptId: args.conceptId,
      eventType: args.eventType,
      timestamp: new Date().toISOString(),
      metadata: args.metadata,
    });
  },
});
