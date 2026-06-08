'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { generatePackAction, type GenerateState } from './actions';
import { SubmitButton } from '@/components/SubmitButton';
import { Alert, Card, Eyebrow, Field, Input, Select, Textarea } from '@/components/ui';
import { APP_CONFIG } from '@/lib/config';

export function GeneratorForm() {
  const [state, formAction] = useActionState<GenerateState, FormData>(
    generatePackAction,
    null,
  );

  return (
    <form action={formAction} className="space-y-5">
      {state?.error ? <Alert variant="error">{state.error}</Alert> : null}

      {/* Lesson details */}
      <Card className="space-y-5">
        <Eyebrow>Lesson details</Eyebrow>

        <Field label="Subject">
          <Input value={APP_CONFIG.subject} disabled readOnly />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Exam board">
            <Select name="examBoard" defaultValue={APP_CONFIG.defaultExamBoard}>
              {APP_CONFIG.examBoards.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </Select>
          </Field>
          <Field label="Course level">
            <Select name="courseLevel" defaultValue={APP_CONFIG.courseLevels[0]}>
              {APP_CONFIG.courseLevels.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </Select>
          </Field>
        </div>

        <Field label="Lesson topic">
          <Input name="topic" placeholder="e.g. Photosynthesis" maxLength={160} required />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Class ability level">
            <Select name="abilityLevel" defaultValue="Mixed">
              {APP_CONFIG.abilityLevels.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </Select>
          </Field>
          <Field label="Lesson length">
            <Select name="lessonLength" defaultValue={APP_CONFIG.lessonLengths[2]}>
              {APP_CONFIG.lessonLengths.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </Select>
          </Field>
        </div>
      </Card>

      {/* Objectives & notes */}
      <Card className="space-y-5">
        <Eyebrow>Objectives &amp; notes</Eyebrow>
        <Field
          label="Learning objectives"
          hint="One per line, or leave blank to let the generator suggest them."
        >
          <Textarea name="learningObjectives" rows={3} maxLength={2000} />
        </Field>
        <Field
          label="Teacher notes / requirements"
          hint="Anything the AI should account for — e.g. a low-energy class or an exam-style 6-marker."
        >
          <Textarea name="teacherNotes" rows={3} maxLength={2000} />
        </Field>
      </Card>

      <PendingNote />

      {/* Submit — sticky bar on mobile, inline on desktop */}
      <div className="sticky bottom-0 z-10 -mx-4 border-t border-zinc-200 bg-white/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
        <SubmitButton className="min-h-12 w-full text-base sm:w-auto" pendingText="Generating your pack…">
          Generate lesson pack
        </SubmitButton>
      </div>
    </form>
  );
}

/** Inline note shown while the AI generates, so the wait is clearly communicated. */
function PendingNote() {
  const { pending } = useFormStatus();
  if (!pending) return null;
  return (
    <Alert variant="info">
      Generating your lesson pack — this can take a moment. Please don&apos;t
      close the tab.
    </Alert>
  );
}
