import type {
  PackContent,
  Slide,
  Worksheet,
  WorksheetLevel,
} from '../types';
import type { GenerationInput, GenerationResult, PackGenerator } from './types';

/**
 * Mock generator — produces a complete, structured (placeholder) lesson pack
 * with zero AI cost. It demonstrates the full form → generate → save → view
 * loop. The real Anthropic generator implements the same interface and
 * replaces this once a key is provided. Content here is generic and clearly
 * templated — it is NOT exam-accurate material.
 */
class MockPackGenerator implements PackGenerator {
  readonly name = 'mock';

  async generate(input: GenerationInput): Promise<GenerationResult> {
    // Simulate generation latency so loading states are visible.
    await new Promise((r) => setTimeout(r, 1200));
    return { content: buildMockContent(input), usage: zeroUsage() };
  }
}

export const mockGenerator = new MockPackGenerator();

/** Synchronous mock content builder (also used to fill sample preview packs). */
export function buildMockContent(input: GenerationInput): PackContent {
  return buildContent(input);
}

function zeroUsage() {
  return { model: 'mock', inputTokens: 0, outputTokens: 0, costUsd: 0 };
}

function deriveObjectives(input: GenerationInput): string[] {
  const raw = input.learningObjectives
    .split(/[\n;.]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (raw.length >= 2) return raw.slice(0, 4);
  return [
    `Describe the key ideas behind ${input.topic}.`,
    `Explain how ${input.topic} works using correct ${input.subject} vocabulary.`,
    `Apply understanding of ${input.topic} to exam-style questions.`,
  ];
}

function buildContent(input: GenerationInput): PackContent {
  const { topic, subject, examBoard, courseLevel, abilityLevel } = input;
  const objectives = deriveObjectives(input);

  const slides: Slide[] = [
    {
      title: topic,
      bullets: [
        `${subject} · ${examBoard} ${courseLevel}`,
        `Ability: ${abilityLevel}`,
      ],
      teacherNotes: 'Title slide — welcome the class and share the big question.',
    },
    {
      title: 'Learning objectives',
      bullets: objectives,
      teacherNotes: 'Read objectives aloud; link to prior learning.',
    },
    {
      title: 'Starter',
      bullets: [
        `Quick recall: 3 things you already know about ${topic}.`,
        'Think–pair–share for 3 minutes.',
      ],
      teacherNotes: 'Circulate and note misconceptions to address later.',
    },
    {
      title: `What is ${topic}?`,
      bullets: [
        `A clear definition of ${topic}.`,
        'Key terms introduced with examples.',
        'Diagram or model to support understanding.',
      ],
    },
    {
      title: `How ${topic} works`,
      bullets: [
        'Step-by-step explanation.',
        'Worked example on the board.',
        'Check for understanding (mini whiteboards).',
      ],
    },
    {
      title: 'Guided & independent practice',
      bullets: [
        'Model question 1 together.',
        'Pupils attempt differentiated worksheet.',
        'Self/peer assess against the answers.',
      ],
      teacherNotes: 'Direct Foundation pupils to the scaffolded sheet.',
    },
    {
      title: 'Plenary',
      bullets: [
        'Exit ticket: one exam-style question.',
        `Summarise the three key points about ${topic}.`,
      ],
      teacherNotes: 'Use the assessment as the exit ticket if time allows.',
    },
  ];

  const worksheet = (
    level: WorksheetLevel,
    style: string,
    qs: string[],
  ): Worksheet => ({
    level,
    title: `${topic} — ${level} worksheet`,
    intro: `${style} Answer the questions below in full sentences.`,
    questions: qs.map((prompt, i) => ({ prompt, marks: i === qs.length - 1 ? 4 : 2 })),
    answers: qs.map(
      (_, i) => `Model answer ${i + 1}: a clear, original explanation relating to ${topic}.`,
    ),
  });

  const worksheets: Worksheet[] = [
    worksheet('Foundation', 'Scaffolded with sentence starters.', [
      `Define ${topic} in one sentence.`,
      `Label the key parts involved in ${topic}.`,
      `Give one everyday example of ${topic}.`,
      `Explain why ${topic} is important.`,
    ]),
    worksheet('Standard', 'Grade-appropriate practice.', [
      `Describe the process of ${topic}.`,
      `Explain two factors that affect ${topic}.`,
      `Compare ${topic} with a related process.`,
      `Apply your knowledge of ${topic} to a new situation.`,
    ]),
    worksheet('Mastery', 'Stretch and challenge.', [
      `Analyse how ${topic} links to wider ${subject} concepts.`,
      `Evaluate the evidence behind ${topic}.`,
      `Predict what happens to ${topic} when conditions change.`,
      `Construct an extended exam-style answer on ${topic}.`,
    ]),
  ];

  const assessmentQuestions = [
    { prompt: `State what is meant by ${topic}.`, marks: 1 },
    { prompt: `Describe how ${topic} occurs.`, marks: 3 },
    { prompt: `Explain one factor that affects ${topic}.`, marks: 2 },
    { prompt: `Apply your understanding of ${topic} to a new context.`, marks: 4 },
    { prompt: `Evaluate the importance of ${topic} in ${subject}.`, marks: 6 },
  ];

  return {
    overview: {
      summary: `A complete ${subject} lesson pack on "${topic}" for ${examBoard} ${courseLevel} (${abilityLevel}). Includes a timed lesson plan, slides, three differentiated worksheets, an assessment, a mark scheme and teacher notes.`,
      objectives,
    },
    lessonPlan: {
      sections: [
        { title: 'Starter', durationMins: 5, detail: `Recall task to surface prior knowledge of ${topic}.` },
        { title: 'Introduction', durationMins: 10, detail: `Introduce ${topic} and the lesson objectives.` },
        { title: 'Main teaching', durationMins: 15, detail: `Explain ${topic} with worked examples and checks for understanding.` },
        { title: 'Guided practice', durationMins: 10, detail: 'Model a question, then pupils attempt together.' },
        { title: 'Independent practice', durationMins: 15, detail: 'Pupils complete the differentiated worksheet for their level.' },
        { title: 'Plenary', durationMins: 5, detail: 'Exit-ticket assessment question and recap of key points.' },
      ],
    },
    slides,
    worksheets,
    assessment: { questions: assessmentQuestions },
    markScheme: assessmentQuestions.map((q, i) => ({
      questionRef: `Q${i + 1}`,
      answer: `Original mark scheme point(s) for "${q.prompt}" — award up to ${q.marks} mark(s) for accurate, relevant ${subject} content.`,
      marks: q.marks,
    })),
    teacherNotes: {
      misconceptions: [
        `Pupils often confuse ${topic} with a related idea — clarify the difference early.`,
        `Watch for vague language; insist on precise ${subject} vocabulary.`,
      ],
      teachingPoints: [
        'Use the worked example before independent practice.',
        'Direct pupils to the worksheet matching their ability level.',
      ],
      safety: `No practical hazards for this lesson on ${topic}. If running a related practical, complete a risk assessment first.`,
    },
  };
}
