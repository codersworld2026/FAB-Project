import type { Pack, PackContent } from '@/lib/types';
import type { ExportLesson, ExportSlide } from './types';

/**
 * Map a saved Pack (+ its structured PackContent) into the export view-model.
 * Section text is pulled from the generated lesson plan; the handful of fields
 * the generator doesn't emit are derived deterministically from the lesson's
 * own content so exports are complete and classroom-ready.
 */
export function buildExportLesson(pack: Pack): ExportLesson {
  const content = pack.content as PackContent;
  const topic = pack.topic;

  const objectives = content.overview.objectives ?? [];
  const sections = content.lessonPlan.sections ?? [];

  return {
    id: pack.id,
    title: topic,
    subject: pack.subject,
    examBoard: pack.exam_board,
    yearGroup: pack.course_level,
    topic,
    duration: pack.lesson_length ?? '60 minutes',
    ability: pack.ability_level,
    summary: content.overview.summary,
    learningObjectives: objectives,
    successCriteria: deriveSuccessCriteria(objectives, content),
    keyVocabulary: deriveKeyVocabulary(topic, objectives, content),
    timeline: sections.map((s) => ({
      title: s.title,
      durationMins: s.durationMins,
      detail: s.detail,
    })),
    starterActivity: findSection(sections, ['starter', 'recall', 'do now']),
    mainTeaching: findSection(sections, ['main', 'teach', 'introduc', 'explain']),
    guidedPractice: findSection(sections, ['guided', 'model', 'we do']),
    independentTask: findSection(sections, ['independent', 'practice', 'you do', 'task']),
    plenary: findSection(sections, ['plenary', 'exit', 'review', 'summary']),
    assessmentQuestions: content.assessment.questions ?? [],
    markScheme: content.markScheme ?? [],
    differentiation: (content.worksheets ?? []).map((w) => ({
      level: w.level,
      detail: w.intro?.trim() || `${w.level}-level tasks tailored to this group.`,
    })),
    resourcesNeeded: deriveResources(content),
    homework: deriveHomework(topic),
    teacherNotes: {
      misconceptions: content.teacherNotes.misconceptions ?? [],
      teachingPoints: content.teacherNotes.teachingPoints ?? [],
      safety: content.teacherNotes.safety,
    },
    worksheets: (content.worksheets ?? []).map((w) => ({
      level: w.level,
      title: w.title,
      intro: w.intro,
      questions: w.questions,
      answers: w.answers,
    })),
    slides: (content.slides ?? []).map<ExportSlide>((s) => ({
      title: s.title,
      bulletPoints: s.bullets,
      speakerNotes: s.teacherNotes,
    })),
  };
}

/* ------------------------------ derivations ------------------------------ */

/** "Describe X." → "I can describe X." */
function deriveSuccessCriteria(objectives: string[], content: PackContent): string[] {
  if (content.teacherNotes.teachingPoints?.length) {
    // Teaching points already read like success-style statements in many packs;
    // prefer objectives → "I can …" for a clean, pupil-facing checklist.
  }
  return objectives.map((o) => {
    const trimmed = o.trim().replace(/\.$/, '');
    const lead = trimmed.charAt(0).toLowerCase() + trimmed.slice(1);
    return `I can ${lead}.`;
  });
}

const STOPWORDS = new Set([
  'the', 'and', 'for', 'with', 'that', 'this', 'from', 'your', 'their', 'about',
  'using', 'into', 'when', 'what', 'how', 'why', 'key', 'ideas', 'behind',
  'understand', 'understanding', 'explain', 'describe', 'apply', 'analyse',
  'evaluate', 'correct', 'vocabulary', 'questions', 'exam', 'style', 'works',
  'lesson', 'pupils', 'students', 'will', 'able', 'able to', 'end',
]);

/** Pull a few salient terms from the lesson's own text for a vocab slide. */
function deriveKeyVocabulary(
  topic: string,
  objectives: string[],
  content: PackContent,
): string[] {
  const terms = new Map<string, string>();
  const add = (word: string) => {
    const clean = word.replace(/[^A-Za-z-]/g, '');
    const key = clean.toLowerCase();
    if (clean.length > 3 && !STOPWORDS.has(key) && !terms.has(key)) {
      terms.set(key, clean.charAt(0).toUpperCase() + clean.slice(1));
    }
  };

  // Topic words first (most relevant), then objectives + slide titles.
  topic.split(/\s+/).forEach(add);
  objectives.forEach((o) => o.split(/\s+/).forEach(add));
  (content.slides ?? []).forEach((s) => s.title.split(/\s+/).forEach(add));

  return Array.from(terms.values()).slice(0, 6);
}

function deriveResources(content: PackContent): string[] {
  const list = [
    'Projector or whiteboard for the slides',
    'Printed differentiated worksheets (Foundation, Standard, Mastery)',
    'Printed assessment and mark scheme',
    'Mini-whiteboards for quick checks for understanding',
  ];
  if (content.teacherNotes.safety) {
    list.push('Complete the relevant risk assessment (see teacher notes)');
  }
  return list;
}

function deriveHomework(topic: string): string {
  return `Consolidate today's learning on ${topic}: complete any unfinished worksheet questions and write a short paragraph summarising the three most important points from the lesson.`;
}

/** Return the detail of the first lesson-plan section matching a keyword. */
function findSection(
  sections: PackContent['lessonPlan']['sections'],
  keywords: string[],
): string {
  const match = sections.find((s) =>
    keywords.some((k) => s.title.toLowerCase().includes(k)),
  );
  return match?.detail ?? '';
}
