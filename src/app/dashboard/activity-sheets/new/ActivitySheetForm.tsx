'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { createActivitySheetAction, type ActivityState } from './actions';
import { SubmitButton } from '@/components/SubmitButton';
import { Alert, Field, Input, Textarea } from '@/components/ui';
import { APP_CONFIG, getQualification } from '@/lib/config';
import { clsx } from '@/components/clsx';
import { PillSelect, type PillOption } from '@/components/app/PillSelect';
import { StickyActionBar } from '@/components/app/StickyActionBar';
import { ActivityIcon } from '@/components/app/icons';
import { SparkleIcon } from '@/components/science/ScienceIcons';

const QUAL_OPTS: PillOption[] = APP_CONFIG.qualifications.map((q) => ({ value: q.id, label: q.short }));
const YEAR_OPTS: PillOption[] = APP_CONFIG.yearGroups.map((y) => ({ value: y, label: y }));
const LEVEL_OPTS: PillOption[] = APP_CONFIG.classLevels.map((c) => ({ value: c, label: c }));

export function ActivitySheetForm() {
  const [state, formAction] = useActionState<ActivityState, FormData>(createActivitySheetAction, null);

  const [activityType, setActivityType] = useState<string>(APP_CONFIG.activityTypes[0]);
  const [topic, setTopic] = useState('');
  const [qualificationId, setQualificationId] = useState<string>(APP_CONFIG.defaultQualificationId);
  const [courseLevel, setCourseLevel] = useState<string>(APP_CONFIG.yearGroups[1]);
  const [difficulty, setDifficulty] = useState<string>('Core');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');

  const qualification = getQualification(qualificationId);

  return (
    <form action={formAction}>
      <input type="hidden" name="title" value={title} />
      <input type="hidden" name="topic" value={topic} />
      <input type="hidden" name="examBoard" value={qualification.label} />
      <input type="hidden" name="courseLevel" value={courseLevel} />
      <input type="hidden" name="activityType" value={activityType} />
      <input type="hidden" name="difficulty" value={difficulty} />
      <input type="hidden" name="notes" value={notes} />

      <Inner
        error={state?.error ?? null}
        topic={topic}
        setTopic={setTopic}
        activityType={activityType}
        setActivityType={setActivityType}
        qualificationId={qualificationId}
        setQualificationId={setQualificationId}
        courseLevel={courseLevel}
        setCourseLevel={setCourseLevel}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        title={title}
        setTitle={setTitle}
        notes={notes}
        setNotes={setNotes}
      />
    </form>
  );
}

function Inner(props: {
  error: string | null;
  topic: string;
  setTopic: (v: string) => void;
  activityType: string;
  setActivityType: (v: string) => void;
  qualificationId: string;
  setQualificationId: (v: string) => void;
  courseLevel: string;
  setCourseLevel: (v: string) => void;
  difficulty: string;
  setDifficulty: (v: string) => void;
  title: string;
  setTitle: (v: string) => void;
  notes: string;
  setNotes: (v: string) => void;
}) {
  const { pending } = useFormStatus();
  if (pending) return <GeneratingState />;

  const canGenerate = props.topic.trim().length >= 3;

  return (
    <div className="space-y-6">
      {props.error ? <Alert variant="error">{props.error}</Alert> : null}

      {/* Activity type */}
      <div>
        <p className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-200">Activity type</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {APP_CONFIG.activityTypes.map((t) => {
            const active = props.activityType === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => props.setActivityType(t)}
                aria-pressed={active}
                className={clsx(
                  'flex min-h-12 items-center gap-2 rounded-xl border px-3 text-left text-sm font-semibold transition-colors',
                  active
                    ? 'border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-700 dark:bg-violet-950/50 dark:text-violet-300'
                    : 'border-zinc-200 bg-white text-zinc-700 hover:border-violet-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200',
                )}
              >
                <ActivityIcon className="h-4 w-4 shrink-0 opacity-70" />
                <span className="truncate">{t}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <Field label="Topic">
          <Input
            value={props.topic}
            onChange={(e) => props.setTopic(e.target.value)}
            placeholder="e.g. Cell structure, Enzymes, Photosynthesis…"
            maxLength={160}
            autoFocus
          />
        </Field>

        <div className="mt-4 flex flex-wrap gap-2">
          <PillSelect label="Qualification" value={props.qualificationId} options={QUAL_OPTS} onChange={props.setQualificationId} />
          <PillSelect label="Year group" value={props.courseLevel} options={YEAR_OPTS} onChange={props.setCourseLevel} />
          <PillSelect label="Difficulty" value={props.difficulty} options={LEVEL_OPTS} onChange={props.setDifficulty} />
        </div>

        <div className="mt-4">
          <Field label="Title" hint="Optional — we'll name it from the topic if blank.">
            <Input value={props.title} onChange={(e) => props.setTitle(e.target.value)} placeholder="Activity sheet title" maxLength={160} />
          </Field>
        </div>

        <div className="mt-4">
          <Field label="Any specific instructions?" hint="Optional">
            <Textarea value={props.notes} onChange={(e) => props.setNotes(e.target.value)} rows={3} maxLength={2000} placeholder="e.g. focus on diagrams, keep reading age low, include a challenge question…" />
          </Field>
        </div>
      </div>

      <p className="rounded-xl bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900 ring-1 ring-inset ring-amber-100 dark:bg-amber-950/30 dark:text-amber-100 dark:ring-amber-900/60">
        Generates a student version and a teacher answer version. AI-generated —
        review before classroom use.
      </p>

      <StickyActionBar>
        <SubmitButton className="min-h-12 flex-1 text-base" pendingText="Generating…" disabled={!canGenerate}>
          Generate activity sheet ✨
        </SubmitButton>
      </StickyActionBar>
    </div>
  );
}

function GeneratingState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-violet-100 bg-gradient-to-b from-violet-50/70 to-white px-6 py-16 text-center shadow-sm dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
      <div className="relative flex h-20 w-20 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-violet-200/40 blur-xl motion-safe:animate-pulse-soft" />
        <ActivityIcon className="h-16 w-16 text-violet-500 motion-safe:animate-pulse-soft" />
        <SparkleIcon className="absolute -right-1 -top-1 h-6 w-6 text-fuchsia-500 motion-safe:animate-pulse-soft" />
      </div>
      <h2 className="mt-6 text-xl font-bold text-zinc-900 dark:text-zinc-50">Building your activity sheet…</h2>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Student and teacher versions, in a moment.</p>
    </div>
  );
}
