import pptxgen from 'pptxgenjs';
import type { ExportLesson, PptxOptions } from './types';

/* Theme — purple/blue, teacher-friendly. */
const T = {
  violet: '7C3AED',
  violetDark: '5B21B6',
  fuchsia: 'C026D3',
  indigo: '4F46E5',
  cyan: '06B6D4',
  ink: '18181B',
  slate: '3F3F46',
  grey: '8B8B96',
  soft: 'F5F3FF',
  line: 'E9E5FF',
  white: 'FFFFFF',
};
const FONT = 'Arial'; // Office-safe; renders consistently in PowerPoint/Keynote.

/** Split a paragraph into a few short, slide-friendly bullet points. */
function splitPoints(text: string, max = 4): string[] {
  if (!text) return [];
  return text
    .split(/(?<=[.!?])\s+/)
    .map((p) => p.trim().replace(/\.$/, ''))
    .filter((p) => p.length > 0)
    .slice(0, max);
}

function clampBullets(items: string[], fallback: string, max = 5): string[] {
  const out = items.filter(Boolean).slice(0, max);
  return out.length ? out : [fallback];
}

export async function buildLessonPptx(
  lesson: ExportLesson,
  options: PptxOptions,
): Promise<Buffer> {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9'; // 10 x 5.625 in
  pptx.author = 'Lessons Generator';
  pptx.company = 'Lessons Generator';
  pptx.title = lesson.title;

  const footer = `${lesson.title} · ${lesson.subject} ${lesson.yearGroup}`;
  pptx.defineSlideMaster({
    title: 'LG',
    background: { color: T.white },
    objects: [
      { rect: { x: 0, y: 0, w: '100%', h: 0.16, fill: { color: T.violet } } },
      { rect: { x: 0, y: 5.46, w: '100%', h: 0.165, fill: { color: T.soft } } },
      {
        text: {
          text: footer,
          options: { x: 0.4, y: 5.4, w: 7.2, h: 0.25, fontSize: 9, color: T.grey, fontFace: FONT, align: 'left', valign: 'middle' },
        },
      },
    ],
    slideNumber: { x: 9.1, y: 5.4, w: 0.7, h: 0.25, fontSize: 9, color: T.grey, fontFace: FONT, align: 'right' },
  });

  // --- helpers -------------------------------------------------------------
  const round = pptx.ShapeType.roundRect;

  function contentSlide(opts: {
    eyebrow: string;
    title: string;
    bullets: string[];
    notes?: string;
    accent?: string;
  }) {
    const slide = pptx.addSlide({ masterName: 'LG' });
    const accent = opts.accent ?? T.violet;

    slide.addText(opts.eyebrow.toUpperCase(), {
      x: 0.55, y: 0.4, w: 9, h: 0.3, fontSize: 11, bold: true, color: accent, fontFace: FONT, charSpacing: 2,
    });
    slide.addText(opts.title, {
      x: 0.52, y: 0.66, w: 9, h: 0.8, fontSize: 30, bold: true, color: T.ink, fontFace: FONT,
    });
    slide.addShape(round, { x: 0.55, y: 1.5, w: 0.9, h: 0.07, fill: { color: accent }, rectRadius: 0.03 });

    // Card holding the bullets
    slide.addShape(round, {
      x: 0.5, y: 1.78, w: 9, h: 3.45, fill: { color: T.soft }, line: { color: T.line, width: 1 }, rectRadius: 0.12,
    });
    slide.addText(
      opts.bullets.map((b) => ({ text: b, options: { bullet: { code: '2022', indent: 18 }, breakLine: true } })),
      {
        x: 0.85, y: 2.0, w: 8.3, h: 3.0, fontSize: 17, color: T.slate, fontFace: FONT, valign: 'top',
        lineSpacingMultiple: 1.15, paraSpaceAfter: 9,
      },
    );

    if (opts.notes) slide.addNotes(opts.notes);
    return slide;
  }

  // --- 1. Title slide ------------------------------------------------------
  const title = pptx.addSlide();
  title.background = { color: T.violet };
  title.addShape(round, { x: -1, y: 3.6, w: 7, h: 6, fill: { color: T.violetDark }, rectRadius: 0.5, rotate: 12 });
  title.addShape(round, { x: 7.2, y: -2, w: 5, h: 5, fill: { color: T.fuchsia }, rectRadius: 0.5, rotate: 18 });
  title.addText('LESSON PACK', { x: 0.7, y: 1.5, w: 8.6, h: 0.4, fontSize: 13, bold: true, color: 'DDD6FE', fontFace: FONT, charSpacing: 3 });
  title.addText(lesson.title, { x: 0.7, y: 1.95, w: 8.6, h: 1.6, fontSize: 40, bold: true, color: T.white, fontFace: FONT, valign: 'top' });
  title.addText(
    [lesson.subject, lesson.examBoard, lesson.yearGroup, lesson.duration].filter(Boolean).join('   •   '),
    { x: 0.72, y: 3.7, w: 8.6, h: 0.5, fontSize: 15, color: 'EDE9FE', fontFace: FONT },
  );
  title.addNotes(lesson.summary);

  // --- 2. Objectives -------------------------------------------------------
  contentSlide({
    eyebrow: 'Learning objectives',
    title: 'What we will achieve today',
    bullets: clampBullets(lesson.learningObjectives, `Understand the key ideas of ${lesson.topic}.`),
    notes: lesson.successCriteria.length
      ? `Success criteria:\n${lesson.successCriteria.map((c) => `• ${c}`).join('\n')}`
      : undefined,
  });

  // --- 3. Big question / hook ---------------------------------------------
  if (options.includeStarter) {
    contentSlide({
      eyebrow: 'Big question',
      title: `Why does ${lesson.topic} matter?`,
      accent: T.cyan,
      bullets: clampBullets(
        [
          lesson.starterActivity || `What do you already know about ${lesson.topic}?`,
          'Discuss with your partner for two minutes.',
          'Be ready to share one idea with the class.',
        ],
        `What do you already know about ${lesson.topic}?`,
      ),
      notes: lesson.starterActivity || undefined,
    });
  }

  // --- 4. Key vocabulary ---------------------------------------------------
  contentSlide({
    eyebrow: 'Key vocabulary',
    title: "Words we'll use today",
    accent: T.indigo,
    bullets: clampBullets(lesson.keyVocabulary, lesson.topic, 6),
  });

  // --- 5. Teacher explanation ---------------------------------------------
  contentSlide({
    eyebrow: 'Teacher explanation',
    title: `Understanding ${lesson.topic}`,
    bullets: clampBullets(splitPoints(lesson.mainTeaching, 5), `Key concept: ${lesson.topic}.`),
    notes: lesson.mainTeaching || undefined,
  });

  // Detailed deck: fold in the generated teaching slides for richer content.
  if (options.deck === 'detailed') {
    lesson.slides.slice(0, 6).forEach((sl) => {
      contentSlide({
        eyebrow: 'Teaching',
        title: sl.title,
        bullets: clampBullets(sl.bulletPoints, sl.title),
        notes: sl.speakerNotes,
      });
    });
  }

  // --- 6. Worked example ---------------------------------------------------
  contentSlide({
    eyebrow: 'Worked example',
    title: "Let's work through it together",
    accent: T.fuchsia,
    bullets: clampBullets(splitPoints(lesson.guidedPractice, 5), 'Model an example question step by step.'),
    notes: lesson.guidedPractice || undefined,
  });

  // --- 7. Class activity ---------------------------------------------------
  contentSlide({
    eyebrow: 'Class activity',
    title: 'Your turn — together',
    accent: T.cyan,
    bullets: clampBullets(
      splitPoints(lesson.guidedPractice || lesson.independentTask, 4),
      'Work in pairs to attempt the next example.',
    ),
  });

  // --- 8. Independent task -------------------------------------------------
  contentSlide({
    eyebrow: 'Independent task',
    title: 'On your own',
    bullets: clampBullets(
      splitPoints(lesson.independentTask, 4),
      'Complete the worksheet for your level (Foundation, Standard or Mastery).',
    ),
    notes: lesson.independentTask || undefined,
  });

  // --- 9. Assessment questions --------------------------------------------
  if (options.includeAssessment && lesson.assessmentQuestions.length) {
    contentSlide({
      eyebrow: 'Check your understanding',
      title: 'Quick assessment',
      accent: T.indigo,
      bullets: lesson.assessmentQuestions
        .slice(0, 4)
        .map((q) => `${q.prompt} (${q.marks} marks)`),
      notes: lesson.markScheme.length
        ? `Mark scheme:\n${lesson.markScheme.map((m) => `${m.questionRef}: ${m.answer} [${m.marks}]`).join('\n')}`
        : undefined,
    });
  }

  // --- 10. Plenary / exit ticket ------------------------------------------
  if (options.includePlenary) {
    contentSlide({
      eyebrow: 'Plenary',
      title: 'Exit ticket',
      accent: T.fuchsia,
      bullets: clampBullets(
        [
          lesson.plenary || `Summarise the three key points about ${lesson.topic}.`,
          'Write one thing you learned today.',
          'Write one question you still have.',
        ],
        `Summarise the key points about ${lesson.topic}.`,
      ),
      notes: lesson.plenary || undefined,
    });
  }

  const data = (await pptx.write({ outputType: 'nodebuffer' })) as Buffer;
  return data;
}
