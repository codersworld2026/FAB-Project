import 'server-only';
import { fetchQuery } from 'convex/nextjs';
import { api } from '../../convex/_generated/api';
import type { Doc, Id } from '../../convex/_generated/dataModel';
import { getConvexToken } from './convexClient';
import { isPreviewMode } from './preview';
import type {
  SubjectView,
  YearStageView,
  TopicView,
  ConceptView,
  ConceptDetailView,
  ConceptResourceView,
  ConceptDetailBundle,
} from './types';

/**
 * Server-side curriculum data access. Mirrors the packs.ts pattern: wraps the
 * Convex curriculum resolvers behind app-layer view models, attaches the Clerk→
 * Convex token, and degrades to empty/null in preview mode (no backend keys).
 * Read-only — curriculum writes are platform-admin only and live in Convex.
 */

function toSubjectView(d: Doc<'subjects'>): SubjectView {
  return { id: d._id, slug: d.slug, name: d.name };
}

function toYearStageView(d: Doc<'yearStages'>): YearStageView {
  return { id: d._id, slug: d.slug, name: d.name, phase: d.phase, orderIndex: d.orderIndex };
}

function toTopicView(d: Doc<'topics'>): TopicView {
  return {
    id: d._id,
    subjectId: d.subjectId,
    yearStageId: d.yearStageId,
    title: d.title,
    description: d.description,
    orderIndex: d.orderIndex,
  };
}

function toConceptView(d: Doc<'concepts'>): ConceptView {
  return {
    id: d._id,
    slug: d.slug,
    title: d.title,
    shortDescription: d.shortDescription,
    difficultyLevel: d.difficultyLevel,
    orderIndex: d.orderIndex,
  };
}

function toConceptDetailView(d: Doc<'concepts'>): ConceptDetailView {
  return {
    ...toConceptView(d),
    subjectId: d.subjectId,
    yearStageId: d.yearStageId,
    topicId: d.topicId,
    detailedExplanation: d.detailedExplanation,
    priorLearningSummary: d.priorLearningSummary,
    nextLearningSummary: d.nextLearningSummary,
    commonMisconceptions: d.commonMisconceptions,
    keyVocabulary: d.keyVocabulary,
    lessonGuidance: d.lessonGuidance,
    assessmentGuidance: d.assessmentGuidance,
    practicalLinks: d.practicalLinks,
    abilitySuitability: d.abilitySuitability,
    scienceSkillsLinks: d.scienceSkillsLinks,
  };
}

function toResourceView(d: Doc<'resources'>): ConceptResourceView {
  return {
    id: d._id,
    title: d.title,
    summary: d.summary,
    resourceType: d.resourceType,
    abilityLevel: d.abilityLevel,
    status: d.status,
    created_at: new Date(d._creationTime).toISOString(),
  };
}

export async function listSubjects(): Promise<SubjectView[]> {
  if (isPreviewMode()) return [];
  const token = await getConvexToken();
  const rows = await fetchQuery(api.curriculum.listSubjects, {}, { token });
  return rows.map(toSubjectView);
}

export async function listYearStages(): Promise<YearStageView[]> {
  if (isPreviewMode()) return [];
  const token = await getConvexToken();
  const rows = await fetchQuery(api.curriculum.listYearStages, {}, { token });
  return rows.map(toYearStageView);
}

export async function listTopicsBySubject(
  subjectId: string,
  yearStageId?: string,
): Promise<TopicView[]> {
  if (isPreviewMode()) return [];
  const token = await getConvexToken();
  try {
    const rows = await fetchQuery(
      api.curriculum.listTopicsBySubject,
      {
        subjectId: subjectId as Id<'subjects'>,
        yearStageId: yearStageId ? (yearStageId as Id<'yearStages'>) : undefined,
      },
      { token },
    );
    return rows.map(toTopicView);
  } catch {
    return [];
  }
}

export async function listConceptsByTopic(topicId: string): Promise<ConceptView[]> {
  if (isPreviewMode()) return [];
  const token = await getConvexToken();
  try {
    const rows = await fetchQuery(
      api.curriculum.listConceptsByTopic,
      { topicId: topicId as Id<'topics'> },
      { token },
    );
    return rows.map(toConceptView);
  } catch {
    return [];
  }
}

export async function searchConcepts(
  query: string,
  subjectId?: string,
): Promise<ConceptView[]> {
  if (isPreviewMode() || !query.trim()) return [];
  const token = await getConvexToken();
  try {
    const rows = await fetchQuery(
      api.curriculum.searchConcepts,
      {
        query,
        subjectId: subjectId ? (subjectId as Id<'subjects'>) : undefined,
      },
      { token },
    );
    return rows.map(toConceptView);
  } catch {
    return [];
  }
}

/**
 * Composes everything the concept detail page needs in one server-side call:
 * the full concept, its subject/year-stage/topic names, the prior/next/related
 * concepts (as linkable views) and the resources for the user's active org.
 * Returns null for an unknown/unpublished concept or in preview mode.
 */
export async function getConceptDetail(conceptId: string): Promise<ConceptDetailBundle | null> {
  if (isPreviewMode()) return null;
  const token = await getConvexToken();
  const id = conceptId as Id<'concepts'>;

  try {
    const concept = await fetchQuery(api.curriculum.getConceptById, { conceptId: id }, { token });
    if (!concept) return null;

    const [context, prior, next, related, resources] = await Promise.all([
      fetchQuery(api.curriculum.getGenerationContext, { conceptId: id }, { token }),
      fetchQuery(api.curriculum.getPriorTreatment, { conceptId: id }, { token }),
      fetchQuery(api.curriculum.getNextTreatment, { conceptId: id }, { token }),
      fetchQuery(api.curriculum.getRelatedConcepts, { conceptId: id }, { token }),
      fetchQuery(api.resources.getResourcesForConcept, { conceptId: id }, { token }),
    ]);

    return {
      concept: toConceptDetailView(concept),
      subjectName: context?.subjectName ?? '',
      yearStageName: context?.yearStageName ?? '',
      topicTitle: context?.topicTitle ?? '',
      prior: prior.map(toConceptView),
      next: next.map(toConceptView),
      related: related.map(toConceptView),
      resources: resources.map(toResourceView),
    };
  } catch {
    return null;
  }
}
