'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { generatePackAction, type GenerateState } from './actions';
import { SubmitButton } from '@/components/SubmitButton';
import { Alert, Field, Input, Select, Textarea } from '@/components/ui';
import { APP_CONFIG } from '@/lib/config';

export function GeneratorForm() {
  const [state, formAction] = useActionState<GenerateState, FormData>(
    generatePackAction,
    null,
  );

  return (
    <form action={formAction} className="space-y-5">
      {state?.error ? <Alert variant="error">{state.error}</Alert> : null}

      <Field label="Subject">
        <Input value={APP_CONFIG.subject} disabled readOnly />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Exam board">
          <Select name="examBoard" defaultValue={APP_CONFIG.defaultExamBoard}>
            {APP_CONFIG.examBoards.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Course level">
          <Select name="courseLevel" defaultValue={APP_CONFIG.courseLevels[0]}>
            {APP_CONFIG.courseLevels.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="Lesson topic">
        <Input
          name="topic"
          placeholder="e.g. Photosynthesis"
          maxLength={160}
          required
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Class ability level">
          <Select name="abilityLevel" defaultValue="Mixed">
            {APP_CONFIG.abilityLevels.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Lesson length">
          <Select name="lessonLength" defaultValue={APP_CONFIG.lessonLengths[2]}>
            {APP_CONFIG.lessonLengths.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="Learning objectives (optional)">
        <Textarea
          name="learningObjectives"
          rows={3}
          placeholder="One objective per line, or leave blank to let the generator suggest them."
          maxLength={2000}
        />
      </Field>

      <Field label="Teacher notes / requirements (optional)">
        <Textarea
          name="teacherNotes"
          rows={3}
          placeholder="e.g. Low-energy period 5 class; include a strong starter and an exam-style 6-marker."
          maxLength={2000}
        />
      </Field>

      <PendingNote />

      <SubmitButton pendingText="Generating your pack…">
        Generate lesson pack
      </SubmitButton>
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
