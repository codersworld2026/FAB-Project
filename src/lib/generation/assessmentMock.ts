import type {
  AssessmentContent,
  AssessmentItem,
  AssessmentQuestionType,
} from '../types';

/**
 * Mock assessment generator — produces a complete, structured (placeholder)
 * quiz/test with a mark scheme at zero AI cost, mirroring the lesson and
 * activity-sheet mocks. The real Anthropic generator will replace this behind
 * the same shape. Content is generic and clearly templated — NOT exam-accurate
 * material and NOT a real Edexcel paper.
 */
export interface AssessmentInput {
  title: string;
  subject: string;
  examBoard: string;
  courseLevel: string;
  topic: string;
  assessmentType: string;
  difficulty: string;
  questionCount: number;
  notes: string;
}

/** Question mix per assessment format, cycled to reach the requested count. */
const PATTERNS: Record<string, AssessmentQuestionType[]> = {
  'Starter quiz': ['multiple-choice', 'multiple-choice', 'short-answer'],
  'Knowledge check': ['multiple-choice', 'short-answer', 'short-answer'],
  'Exit ticket': ['multiple-choice', 'short-answer'],
  'End-of-topic test': ['short-answer', 'multiple-choice', 'data', 'extended'],
  'Exam-style questions': ['short-answer', 'data', 'practical', 'extended'],
};

/** Varies repeated prompts so a longer paper doesn't read identically. */
const ASPECTS = [
  'structure',
  'function',
  'key processes',
  'factors affecting it',
  'importance',
  'adaptations',
];

export function buildMockAssessment(input: AssessmentInput): AssessmentContent {
  const { topic, assessmentType, difficulty, questionCount, notes } = input;
  const pattern = PATTERNS[assessmentType] ?? PATTERNS['Knowledge check'];

  const items: AssessmentItem[] = [];
  for (let i = 0; i < questionCount; i++) {
    const type = pattern[i % pattern.length];
    const aspect = ASPECTS[i % ASPECTS.length];
    items.push(buildQuestion(type, topic, aspect, i + 1));
  }

  const totalMarks = items.reduce((sum, q) => sum + q.marks, 0);

  return {
    intro: `${assessmentType} on ${topic}. Answer all ${questionCount} questions. Total: ${totalMarks} marks.`,
    totalMarks,
    estimatedMinutes: Math.max(10, Math.round(totalMarks * 1.2)),
    items,
    teacherNotes: `Pitched for ${difficulty}. ${
      notes ? `Teacher request: ${notes}. ` : ''
    }This is a templated draft — check every question and mark allocation against the specification before classroom use.`,
  };
}

function buildQuestion(
  type: AssessmentQuestionType,
  topic: string,
  aspect: string,
  number: number,
): AssessmentItem {
  switch (type) {
    case 'multiple-choice':
      return {
        number,
        type,
        prompt: `Which statement about the ${aspect} of ${topic} is correct?`,
        options: [
          `A correct statement about the ${aspect} of ${topic}.`,
          `A common misconception about ${topic}.`,
          `An unrelated biological fact.`,
          `A statement that is true of a different topic.`,
        ],
        marks: 1,
        markScheme: `A (1 mark) — the only accurate statement about the ${aspect} of ${topic}.`,
      };
    case 'short-answer':
      return {
        number,
        type,
        prompt: `Describe the ${aspect} of ${topic}.`,
        marks: 2,
        markScheme: `1 mark for a relevant point about the ${aspect} of ${topic}; 1 mark for correct supporting detail or use of key terminology.`,
      };
    case 'data':
      return {
        number,
        type,
        prompt: `The data provided relate to ${topic}. Describe the trend shown and suggest a biological explanation linked to its ${aspect}.`,
        marks: 4,
        markScheme: `2 marks: trend described and supported with figures from the data. 2 marks: a valid explanation linked to the ${aspect} of ${topic}.`,
      };
    case 'practical':
      return {
        number,
        type,
        prompt: `Describe a method to investigate the ${aspect} of ${topic}. Include one variable you would control.`,
        marks: 4,
        markScheme: `Logical, ordered method (2 marks); one correctly named control variable (1 mark); how a valid result is measured/recorded (1 mark).`,
      };
    case 'extended':
      return {
        number,
        type,
        prompt: `Explain the ${aspect} of ${topic} and why it is important. (6 marks)`,
        marks: 6,
        markScheme: `Level 3 (5–6 marks): a detailed, logically linked explanation using correct terminology. Level 2 (3–4 marks): some accurate, partly linked points. Level 1 (1–2 marks): simple, relevant statements. 0 marks: no relevant content.`,
      };
  }
}
