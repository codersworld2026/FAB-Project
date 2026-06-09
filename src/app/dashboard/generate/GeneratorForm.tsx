'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { generatePackAction, type GenerateState } from './actions';
import { SubmitButton } from '@/components/SubmitButton';
import { Alert, Field, Input, Select, Textarea } from '@/components/ui';
import { APP_CONFIG, getQualification } from '@/lib/config';
import { clsx } from '@/components/clsx';
import {
  AtomIcon,
  DnaIcon,
  MoleculeIcon,
  CellIcon,
  SparkleIcon,
} from '@/components/science/ScienceIcons';

type Defaults = {
  qualificationId?: string;
  courseLevel?: string;
  topic?: string;
  notes?: string;
};

const STEPS = ['Lesson basics', 'Class profile', 'Outputs', 'Generate'] as const;

const INCLUDED = [
  'Timed lesson plan',
  'Slide deck',
  'Foundation worksheet',
  'Standard worksheet',
  'Mastery worksheet',
  'Formative assessment',
  'Teacher notes',
  'Misconceptions guide',
];

/** Compose the free-text class-profile fields into the real `teacherNotes`. */
function composeNotes(v: {
  send: string;
  eal: string;
  misconceptions: string;
  practical: string;
  notes: string;
}): string {
  const parts: string[] = [];
  if (v.send.trim()) parts.push(`SEND support: ${v.send.trim()}`);
  if (v.eal.trim()) parts.push(`EAL / multilingual support: ${v.eal.trim()}`);
  if (v.misconceptions.trim()) parts.push(`Misconceptions to address: ${v.misconceptions.trim()}`);
  if (v.practical.trim()) parts.push(`Practical / resource limits: ${v.practical.trim()}`);
  if (v.notes.trim()) parts.push(v.notes.trim());
  return parts.join('\n').slice(0, 2000);
}

export function GeneratorForm({ defaults }: { defaults: Defaults }) {
  const [state, formAction] = useActionState<GenerateState, FormData>(
    generatePackAction,
    null,
  );

  const [step, setStep] = useState(0);

  // Real backend fields
  const [topic, setTopic] = useState<string>(defaults.topic ?? '');
  const [qualificationId, setQualificationId] = useState<string>(
    defaults.qualificationId ?? APP_CONFIG.defaultQualificationId,
  );
  const [courseLevel, setCourseLevel] = useState<string>(
    defaults.courseLevel ?? APP_CONFIG.yearGroups[1],
  );
  const [lessonLength, setLessonLength] = useState<string>(APP_CONFIG.lessonLengths[2]);
  const [abilityLevel, setAbilityLevel] = useState<string>('Core');
  const [objectives, setObjectives] = useState('');

  // Qualification maps onto the existing `exam_board` column server-side.
  const qualification = getQualification(qualificationId);

  // Class-profile fields → folded into teacherNotes
  const [send, setSend] = useState('');
  const [eal, setEal] = useState('');
  const [misconceptions, setMisconceptions] = useState('');
  const [practical, setPractical] = useState('');
  const [notes, setNotes] = useState(defaults.notes ?? '');

  const [topicError, setTopicError] = useState<string | null>(null);

  const teacherNotes = composeNotes({ send, eal, misconceptions, practical, notes });

  const next = () => {
    if (step === 0 && topic.trim().length < 3) {
      setTopicError('Please enter a lesson topic (at least 3 characters).');
      return;
    }
    setTopicError(null);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <form action={formAction}>
      {/* Hidden inputs carry the canonical field names the server action reads. */}
      <input type="hidden" name="topic" value={topic} />
      <input type="hidden" name="qualificationId" value={qualificationId} />
      <input type="hidden" name="examBoard" value={qualification.label} />
      <input type="hidden" name="courseLevel" value={courseLevel} />
      <input type="hidden" name="abilityLevel" value={abilityLevel} />
      <input type="hidden" name="lessonLength" value={lessonLength} />
      <input type="hidden" name="learningObjectives" value={objectives} />
      <input type="hidden" name="teacherNotes" value={teacherNotes} />

      <WizardInner
        step={step}
        setStep={setStep}
        next={next}
        back={back}
        error={state?.error ?? null}
        topicError={topicError}
        values={{
          topic,
          qualificationId,
          courseLevel,
          lessonLength,
          abilityLevel,
          objectives,
          send,
          eal,
          misconceptions,
          practical,
          notes,
        }}
        set={{
          setTopic,
          setQualificationId,
          setCourseLevel,
          setLessonLength,
          setAbilityLevel,
          setObjectives,
          setSend,
          setEal,
          setMisconceptions,
          setPractical,
          setNotes,
        }}
      />
    </form>
  );
}

type Values = {
  topic: string;
  qualificationId: string;
  courseLevel: string;
  lessonLength: string;
  abilityLevel: string;
  objectives: string;
  send: string;
  eal: string;
  misconceptions: string;
  practical: string;
  notes: string;
};
type Setters = {
  setTopic: (v: string) => void;
  setQualificationId: (v: string) => void;
  setCourseLevel: (v: string) => void;
  setLessonLength: (v: string) => void;
  setAbilityLevel: (v: string) => void;
  setObjectives: (v: string) => void;
  setSend: (v: string) => void;
  setEal: (v: string) => void;
  setMisconceptions: (v: string) => void;
  setPractical: (v: string) => void;
  setNotes: (v: string) => void;
};

function WizardInner({
  step,
  setStep,
  next,
  back,
  error,
  topicError,
  values,
  set,
}: {
  step: number;
  setStep: (n: number) => void;
  next: () => void;
  back: () => void;
  error: string | null;
  topicError: string | null;
  values: Values;
  set: Setters;
}) {
  const { pending } = useFormStatus();

  if (pending) return <GeneratingState />;

  return (
    <div className="space-y-6">
      {error ? <Alert variant="error">{error}</Alert> : null}

      <Stepper step={step} onJump={setStep} />

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
        {step === 0 ? <StepBasics values={values} set={set} topicError={topicError} /> : null}
        {step === 1 ? <StepClassProfile values={values} set={set} /> : null}
        {step === 2 ? <StepOutputs /> : null}
        {step === 3 ? <StepReview values={values} /> : null}
      </div>

      {/* Nav — sticky on mobile for easy thumb reach */}
      <div className="sticky bottom-0 z-10 -mx-4 flex items-center gap-3 border-t border-zinc-200 bg-white/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none dark:border-zinc-800 dark:bg-zinc-950/95 sm:dark:bg-transparent">
        {step > 0 ? (
          <button
            type="button"
            onClick={back}
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-zinc-300 bg-white px-5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
          >
            Back
          </button>
        ) : null}

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={next}
            className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 text-base font-semibold text-white shadow-sm shadow-violet-500/25 transition-all hover:brightness-105 sm:flex-none"
          >
            Continue <span aria-hidden="true">→</span>
          </button>
        ) : (
          <SubmitButton
            className="min-h-12 flex-1 text-base sm:flex-none"
            pendingText="Generating…"
          >
            Generate lesson pack ✨
          </SubmitButton>
        )}
      </div>
    </div>
  );
}

/* ----------------------------- Stepper ----------------------------- */
function Stepper({ step, onJump }: { step: number; onJump: (n: number) => void }) {
  const pct = ((step + 1) / STEPS.length) * 100;
  return (
    <div>
      {/* Mobile: compact label + progress bar */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-violet-700 dark:text-violet-300">
            Step {step + 1} of {STEPS.length}
          </p>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{STEPS[step]}</p>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Desktop: full stepper */}
      <ol className="hidden items-center gap-2 sm:flex">
        {STEPS.map((label, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <li key={label} className="flex flex-1 items-center gap-2">
              <button
                type="button"
                onClick={() => (i <= step ? onJump(i) : undefined)}
                disabled={i > step}
                className={clsx(
                  'flex items-center gap-2 rounded-xl px-2 py-1 text-left transition-colors',
                  i <= step ? 'cursor-pointer' : 'cursor-default',
                )}
                aria-current={active ? 'step' : undefined}
              >
                <span
                  className={clsx(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors',
                    active
                      ? 'bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow'
                      : done
                        ? 'bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300'
                        : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500',
                  )}
                >
                  {done ? '✓' : i + 1}
                </span>
                <span
                  className={clsx(
                    'text-sm font-semibold',
                    active
                      ? 'text-zinc-900 dark:text-zinc-50'
                      : done
                        ? 'text-zinc-600 dark:text-zinc-300'
                        : 'text-zinc-400 dark:text-zinc-500',
                  )}
                >
                  {label}
                </span>
              </button>
              {i < STEPS.length - 1 ? (
                <span
                  className={clsx(
                    'h-0.5 flex-1 rounded',
                    done ? 'bg-violet-300 dark:bg-violet-800' : 'bg-zinc-200 dark:bg-zinc-800',
                  )}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* --------------------------- Step 1: basics --------------------------- */
function StepBasics({
  values,
  set,
  topicError,
}: {
  values: Values;
  set: Setters;
  topicError: string | null;
}) {
  return (
    <div className="space-y-5">
      <StepHeading icon={<DnaIcon className="h-5 w-5" />} title="Lesson basics" subtitle="What are you teaching?" />

      <Field label="Lesson topic" error={topicError ?? undefined}>
        <Input
          value={values.topic}
          onChange={(e) => set.setTopic(e.target.value)}
          placeholder="e.g. Cell structure"
          maxLength={160}
          autoFocus
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Qualification" hint="Edexcel Biology only.">
          <Select value={values.qualificationId} onChange={(e) => set.setQualificationId(e.target.value)}>
            {APP_CONFIG.qualifications.map((q) => (
              <option key={q.id} value={q.id}>{q.label}</option>
            ))}
          </Select>
        </Field>
        <Field label="Year group">
          <Select value={values.courseLevel} onChange={(e) => set.setCourseLevel(e.target.value)}>
            {APP_CONFIG.yearGroups.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="Lesson length">
        <Select value={values.lessonLength} onChange={(e) => set.setLessonLength(e.target.value)}>
          {APP_CONFIG.lessonLengths.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </Select>
      </Field>

      <Field
        label="Learning objectives"
        hint="Optional — one per line, or leave blank and we'll suggest them."
      >
        <Textarea
          value={values.objectives}
          onChange={(e) => set.setObjectives(e.target.value)}
          rows={3}
          maxLength={2000}
          placeholder="By the end of the lesson, pupils will be able to…"
        />
      </Field>
    </div>
  );
}

/* ------------------------ Step 2: class profile ------------------------ */
function StepClassProfile({ values, set }: { values: Values; set: Setters }) {
  return (
    <div className="space-y-5">
      <StepHeading icon={<CellIcon className="h-5 w-5" />} title="Class profile" subtitle="Tailor it to your pupils." />

      <Field label="Class level">
        <Select value={values.abilityLevel} onChange={(e) => set.setAbilityLevel(e.target.value)}>
          {APP_CONFIG.classLevels.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </Select>
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="SEND support" hint="Optional">
          <Textarea
            value={values.send}
            onChange={(e) => set.setSend(e.target.value)}
            rows={2}
            maxLength={600}
            placeholder="e.g. dyslexia-friendly layout, extra scaffolding"
          />
        </Field>
        <Field label="EAL / multilingual support" hint="Optional">
          <Textarea
            value={values.eal}
            onChange={(e) => set.setEal(e.target.value)}
            rows={2}
            maxLength={600}
            placeholder="e.g. key-word glossary, sentence stems"
          />
        </Field>
      </div>

      <Field label="Misconceptions to address" hint="Optional">
        <Textarea
          value={values.misconceptions}
          onChange={(e) => set.setMisconceptions(e.target.value)}
          rows={2}
          maxLength={600}
          placeholder="e.g. pupils confuse diffusion with osmosis"
        />
      </Field>

      <Field label="Practical / resource limits" hint="Optional">
        <Textarea
          value={values.practical}
          onChange={(e) => set.setPractical(e.target.value)}
          rows={2}
          maxLength={600}
          placeholder="e.g. no lab access, limited to a single microscope"
        />
      </Field>
    </div>
  );
}

/* --------------------------- Step 3: outputs --------------------------- */
function StepOutputs() {
  return (
    <div className="space-y-5">
      <StepHeading icon={<MoleculeIcon className="h-5 w-5" />} title="Outputs" subtitle="Everything below is included." />
      <p className="text-sm text-zinc-600 dark:text-zinc-300">
        Each lesson is generated as a complete, classroom-ready set of resources.
        Export to PDF &amp; PowerPoint from the lesson page once it&apos;s ready.
      </p>
      <ul className="grid gap-2.5 sm:grid-cols-2">
        {INCLUDED.map((item) => (
          <li
            key={item}
            className="flex items-center gap-3 rounded-xl border border-violet-100 bg-violet-50/50 px-3 py-2.5 text-sm font-medium text-zinc-800 dark:border-violet-950 dark:bg-violet-950/30 dark:text-zinc-100"
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white">
              <svg width="11" height="11" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M16 5.5L8.25 14L4 9.75" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------------------- Step 4: review ---------------------------- */
function StepReview({ values }: { values: Values }) {
  const rows = [
    ['Topic', values.topic || '—'],
    ['Qualification', getQualification(values.qualificationId).label],
    ['Year group', values.courseLevel],
    ['Lesson length', values.lessonLength],
    ['Class level', values.abilityLevel],
  ];
  const tailored = [
    values.send && 'SEND',
    values.eal && 'EAL',
    values.misconceptions && 'Misconceptions',
    values.practical && 'Resource limits',
  ].filter(Boolean) as string[];

  return (
    <div className="space-y-5">
      <StepHeading icon={<AtomIcon className="h-5 w-5" />} title="Review & generate" subtitle="Check the details, then create your pack." />

      <dl className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
        {rows.map(([label, value], i) => (
          <div
            key={label}
            className={clsx(
              'flex items-center justify-between gap-4 px-4 py-3 text-sm',
              i % 2 === 0 ? 'bg-zinc-50/60 dark:bg-zinc-800/40' : 'bg-white dark:bg-zinc-900',
            )}
          >
            <dt className="font-medium text-zinc-500 dark:text-zinc-400">{label}</dt>
            <dd className="text-right font-semibold text-zinc-900 dark:text-zinc-100">{value}</dd>
          </div>
        ))}
      </dl>

      {tailored.length > 0 ? (
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Tailored for
          </p>
          <div className="flex flex-wrap gap-1.5">
            {tailored.map((t) => (
              <span
                key={t}
                className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700 ring-1 ring-inset ring-violet-100 dark:bg-violet-950/50 dark:text-violet-300 dark:ring-violet-900"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <p className="rounded-xl bg-cyan-50/70 px-4 py-3 text-xs text-cyan-900 ring-1 ring-inset ring-cyan-100 dark:bg-cyan-950/40 dark:text-cyan-200 dark:ring-cyan-900">
        Generation can take a moment. Keep this tab open — you&apos;ll be taken
        straight to your finished pack.
      </p>
    </div>
  );
}

/* ------------------------- shared bits ------------------------- */
function StepHeading({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-300">
        {icon}
      </span>
      <div>
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{title}</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{subtitle}</p>
      </div>
    </div>
  );
}

/** Full-bleed, on-brand loading state shown while the pack is generating. */
function GeneratingState() {
  const phases = [
    'Planning the lesson',
    'Writing the slides',
    'Differentiating worksheets',
    'Building the assessment',
    'Adding teacher notes',
  ];
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-violet-100 bg-gradient-to-b from-violet-50/70 to-white px-6 py-16 text-center shadow-sm dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
      {/* Spinning atom */}
      <div className="relative flex h-24 w-24 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-violet-200/40 blur-xl motion-safe:animate-pulse-soft" />
        <AtomIcon className="h-20 w-20 text-violet-500 motion-safe:animate-spin-slow" />
        <SparkleIcon className="absolute -right-1 -top-1 h-6 w-6 text-fuchsia-500 motion-safe:animate-pulse-soft" />
      </div>

      <h2 className="mt-6 text-xl font-bold text-zinc-900 dark:text-zinc-50">
        Building your classroom-ready pack…
      </h2>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">This usually takes a few moments.</p>

      <ul className="mt-6 w-full max-w-xs space-y-2 text-left">
        {phases.map((p, i) => (
          <li
            key={p}
            className="flex items-center gap-3 rounded-xl bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm ring-1 ring-zinc-100 motion-safe:animate-fade-up dark:bg-zinc-900 dark:text-zinc-200 dark:ring-zinc-800"
            style={{ animationDelay: `${i * 140}ms` }}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-950/60">
              <span className="h-2 w-2 rounded-full bg-violet-500 motion-safe:animate-pulse-soft" />
            </span>
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}
