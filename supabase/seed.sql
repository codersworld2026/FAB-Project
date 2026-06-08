-- ============================================================================
-- Seed data: default prompt templates + app settings.
--
-- These prompts are STARTER PLACEHOLDERS that encode the required structure
-- and safety rules. The customer owns prompt quality and will refine these in
-- the admin → Prompts page (no code change needed). Re-running is safe.
-- ============================================================================

insert into public.prompt_templates (key, label, description, content) values
(
  'safety',
  'Safety / originality rules',
  'Always-applied rules. Prepended to every generation.',
  'You generate ORIGINAL, exam-style educational materials only. Strict rules:
- NEVER copy, store, reproduce, paraphrase, or imitate real past papers or official mark schemes (they are copyrighted).
- NEVER include any student personal data; do not invent named real students.
- Content must be factually accurate, age-appropriate, and classroom-ready.
- Write in clear British English.
- If a request risks copyright or safety issues, produce a safe original alternative.'
),
(
  'main',
  'Main lesson pack generation',
  'Top-level instruction that orchestrates the full pack. Receives the teacher form inputs.',
  'You are an expert {{subject}} teacher and resource author for the {{exam_board}} {{course_level}} specification.
Create a complete, original, classroom-ready lesson resource pack for the topic: "{{topic}}".

Class context:
- Ability level: {{ability_level}}
- Lesson length: {{lesson_length}}
- Learning objectives: {{learning_objectives}}
- Teacher notes / requirements: {{teacher_notes_input}}

Produce all sections to a high, consistent standard that matches a hand-made gold-standard pack: lesson plan, slide content, three differentiated worksheets (Foundation, Standard, Mastery), an assessment, a mark scheme, and teacher notes.'
),
(
  'lesson_plan',
  'Lesson plan generation',
  'Instruction for the timed lesson plan section.',
  'Write a timed lesson plan for "{{topic}}" ({{lesson_length}}, {{ability_level}}).
Include: learning objectives, success criteria, a starter, main teaching sequence with timings, guided and independent practice, differentiation notes, key vocabulary, required resources, and a plenary.'
),
(
  'slides',
  'Slide generation',
  'Instruction for the presentation slide content.',
  'Produce slide-by-slide content for "{{topic}}" suitable for export to PowerPoint.
Sequence: title slide, learning objectives, starter activity, explanation/content slides, guided practice, independent practice, assessment/plenary, and teacher notes where useful. Keep each slide concise with a clear heading and bullet points.'
),
(
  'worksheets',
  'Worksheet generation',
  'Instruction for the three differentiated worksheets.',
  'Create THREE differentiated worksheets for "{{topic}}":
- Foundation (lower ability): scaffolded, more support, simpler language.
- Standard (middle ability): grade-appropriate practice.
- Mastery (higher ability): stretch and challenge, exam-style application.
Each worksheet must have original questions and a matching answer key.'
),
(
  'assessment',
  'Assessment generation',
  'Instruction for the assessment questions.',
  'Write an original, exam-style assessment for "{{topic}}" aligned to {{exam_board}} {{course_level}}.
Mix recall, application, and extended-response questions with marks shown. Do NOT reproduce real past-paper questions.'
),
(
  'teacher_notes',
  'Teacher notes generation',
  'Instruction for teacher-facing notes and the mark scheme.',
  'Write teacher notes for "{{topic}}": common misconceptions, key teaching points, suggested questioning, safety/practical notes if relevant, and a clear original mark scheme for the assessment and worksheets.'
)
on conflict (key) do nothing;

-- App settings (override src/lib/config.ts defaults) -------------------------
insert into public.app_settings (key, value) values
  ('free_trial_pack_limit', '3'::jsonb),
  ('default_exam_board',     '"Edexcel"'::jsonb),
  ('subject',                '"Biology"'::jsonb),
  ('ai_model',               '"claude-sonnet-4-6"'::jsonb)
on conflict (key) do nothing;
