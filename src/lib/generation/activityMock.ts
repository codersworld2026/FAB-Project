import type { ActivityItem, ActivitySheetContent } from '../types';

/**
 * Mock activity-sheet generator — produces complete, structured (placeholder)
 * content with zero AI cost, mirroring the lesson mock. The real Anthropic
 * generator will replace this behind the same shape. Content is generic and
 * clearly templated — NOT exam-accurate material.
 */
export interface ActivitySheetInput {
  title: string;
  subject: string;
  examBoard: string;
  courseLevel: string;
  topic: string;
  activityType: string;
  difficulty: string;
  notes: string;
}

const MINUTES: Record<string, number> = {
  Support: 10,
  Core: 15,
  Challenge: 20,
  'Mixed ability': 15,
};

export function buildMockActivitySheet(input: ActivitySheetInput): ActivitySheetContent {
  const { topic, activityType, difficulty } = input;
  const items = buildItems(topic, activityType);
  return {
    intro: `${activityType} on ${topic}. ${introFor(activityType)} Work carefully and use full sentences where asked.`,
    estimatedMinutes: MINUTES[difficulty] ?? 15,
    items,
    teacherNotes: `Differentiation: pitched for ${difficulty}. Encourage precise ${input.subject} vocabulary; circulate and address misconceptions about ${topic}.`,
  };
}

function introFor(type: string): string {
  if (type.startsWith('Gap-fill')) return 'Fill each gap with the correct key term.';
  if (type.startsWith('Matching')) return 'Match each term to the correct description.';
  if (type.startsWith('Labelling')) return 'Label each part and give its function.';
  if (type.startsWith('Retrieval')) return 'Answer from memory, then check.';
  if (type.startsWith('Revision checklist')) return 'Rate your confidence (R/A/G) for each point.';
  return 'Complete every question.';
}

function buildItems(topic: string, type: string): ActivityItem[] {
  const base: [string, string, number][] = [
    [`Define ${topic} in one sentence.`, `A clear, original one-sentence definition of ${topic}.`, 1],
    [`Identify two key terms linked to ${topic}.`, `Two correct, relevant key terms for ${topic}.`, 2],
    [`Describe how ${topic} works.`, `A step-by-step description of ${topic}.`, 3],
    [`Explain one factor that affects ${topic}.`, `One factor with a correct cause-and-effect explanation.`, 2],
    [`Give one real-world example of ${topic}.`, `A relevant everyday or biological example of ${topic}.`, 2],
    [`Apply your understanding of ${topic} to a new situation.`, `A reasoned application of ${topic} to an unfamiliar context.`, 4],
  ];

  // Light per-type reshaping of the first prompt so the sheet feels appropriate.
  if (type.startsWith('Gap-fill')) {
    base[0] = [`Complete: "${topic} is the process by which ______."`, `Correct completion describing ${topic}.`, 1];
  } else if (type.startsWith('Matching')) {
    base[0] = [`Match each key term about ${topic} to its description.`, `Each term correctly matched to its description.`, 3];
  } else if (type.startsWith('Labelling')) {
    base[0] = [`Label the diagram of ${topic} and state each part's function.`, `Each part correctly labelled with its function.`, 4];
  } else if (type.startsWith('Revision checklist')) {
    base[0] = [`Rate your confidence (R/A/G): I can describe ${topic}.`, `Self-assessment — no fixed answer.`, 0];
  } else if (type.startsWith('Exam-question')) {
    base[5] = [`Answer this exam-style question on ${topic} (6 marks).`, `A full, well-structured extended response on ${topic}.`, 6];
  }

  return base.map(([prompt, answer, marks]) => ({ prompt, answer, marks }));
}
