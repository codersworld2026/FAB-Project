'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { generatePackAction, type GenerateState } from './actions';
import { SubmitButton } from '@/components/SubmitButton';
import { Alert, Field, Input, Textarea } from '@/components/ui';
import { APP_CONFIG, getQualification } from '@/lib/config';
import { clsx } from '@/components/clsx';
import { PillSelect, type PillOption } from '@/components/app/PillSelect';
import { UploadPanel } from '@/components/app/UploadPanel';
import { StickyActionBar } from '@/components/app/StickyActionBar';
import { BottomSheet } from '@/components/app/BottomSheet';
import { LessonIcon, SeriesIcon, ChevronRightIcon } from '@/components/app/icons';
import { AtomIcon, SparkleIcon } from '@/components/science/ScienceIcons';

export type ExistingLesson = {
  id: string;
  topic: string;
  qualificationId: string;
  courseLevel: string;
};

type Defaults = {
  qualificationId?: string;
  courseLevel?: string;
  topic?: string;
  notes?: string;
};

const STEPS = ['Source', 'Lesson', 'Generate'] as const;

const INCLUDED = [
  'Timed lesson plan',
  'Slide deck',
  'Differentiated worksheets',
  'Formative assessment',
  'Teacher notes & misconceptions',
];

/** Pill option helpers from config. */
const QUAL_OPTS: PillOption[] = APP_CONFIG.qualifications.map((q) => ({ value: q.id, label: q.short }));
const YEAR_OPTS: PillOption[] = APP_CONFIG.yearGroups.map((y) => ({ value: y, label: y }));
const LENGTH_OPTS: PillOption[] = APP_CONFIG.lessonLengths.map((l) => ({ value: l, label: l }));
const LEVEL_OPTS: PillOption[] = APP_CONFIG.classLevels.map((c) => ({ value: c, label: c }));

/** Compose the optional class-needs fields into the real `teacherNotes`. */
function composeNotes(v: {
  send: string;
  eal: string;
  misconceptions: string;
  practical: string;
  notes: string;
}): string {
  const parts: string[] = [];
  if (v.notes.trim()) parts.push(v.notes.trim());
  if (v.send.trim()) parts.push(`SEND support: ${v.send.trim()}`);
  if (v.eal.trim()) parts.push(`EAL / multilingual support: ${v.eal.trim()}`);
  if (v.misconceptions.trim()) parts.push(`Misconceptions to address: ${v.misconceptions.trim()}`);
  if (v.practical.trim()) parts.push(`Practical / resource limits: ${v.practical.trim()}`);
  return parts.join('\n').slice(0, 2000);
}

export function GeneratorForm({
  defaults,
  existingLessons = [],
}: {
  defaults: Defaults;
  existingLessons?: ExistingLesson[];
}) {
  const [state, formAction] = useActionState<GenerateState, FormData>(generatePackAction, null);
  const [step, setStep] = useState(0);

  // Backend fields
  const [topic, setTopic] = useState<string>(defaults.topic ?? '');
  const [qualificationId, setQualificationId] = useState<string>(
    defaults.qualificationId ?? APP_CONFIG.defaultQualificationId,
  );
  const [courseLevel, setCourseLevel] = useState<string>(defaults.courseLevel ?? APP_CONFIG.yearGroups[1]);
  const [lessonLength, setLessonLength] = useState<string>(APP_CONFIG.lessonLengths[2]);
  const [classLevel, setClassLevel] = useState<string>('Core');
  const [objectives, setObjectives] = useState('');

  // Optional class-needs → folded into teacherNotes
  const [notes, setNotes] = useState(defaults.notes ?? '');
  const [send, setSend] = useState('');
  const [eal, setEal] = useState('');
  const [misconceptions, setMisconceptions] = useState('');
  const [practical, setPractical] = useState('');

  const [topicError, setTopicError] = useState<string | null>(null);

  const qualification = getQualification(qualificationId);
  const teacherNotes = composeNotes({ send, eal, misconceptions, practical, notes });

  const startNew = () => {
    setStep(1);
  };
  const startFromExisting = (lesson: ExistingLesson) => {
    setTopic(lesson.topic);
    setQualificationId(lesson.qualificationId);
    setCourseLevel(lesson.courseLevel);
    setStep(1);
  };

  const next = () => {
    if (step === 1 && topic.trim().length < 3) {
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
      <input type="hidden" name="abilityLevel" value={classLevel} />
      <input type="hidden" name="lessonLength" value={lessonLength} />
      <input type="hidden" name="learningObjectives" value={objectives} />
      <input type="hidden" name="teacherNotes" value={teacherNotes} />

      <WizardInner
        step={step}
        setStep={setStep}
        next={next}
        back={back}
        startNew={startNew}
        startFromExisting={startFromExisting}
        existingLessons={existingLessons}
        error={state?.error ?? null}
        topicError={topicError}
        values={{ topic, qualificationId, courseLevel, lessonLength, classLevel, objectives, notes, send, eal, misconceptions, practical }}
        set={{ setTopic, setQualificationId, setCourseLevel, setLessonLength, setClassLevel, setObjectives, setNotes, setSend, setEal, setMisconceptions, setPractical }}
      />
    </form>
  );
}

type Values = {
  topic: string;
  qualificationId: string;
  courseLevel: string;
  lessonLength: string;
  classLevel: string;
  objectives: string;
  notes: string;
  send: string;
  eal: string;
  misconceptions: string;
  practical: string;
};
type Setters = {
  setTopic: (v: string) => void;
  setQualificationId: (v: string) => void;
  setCourseLevel: (v: string) => void;
  setLessonLength: (v: string) => void;
  setClassLevel: (v: string) => void;
  setObjectives: (v: string) => void;
  setNotes: (v: string) => void;
  setSend: (v: string) => void;
  setEal: (v: string) => void;
  setMisconceptions: (v: string) => void;
  setPractical: (v: string) => void;
};

function WizardInner({
  step,
  setStep,
  next,
  back,
  startNew,
  startFromExisting,
  existingLessons,
  error,
  topicError,
  values,
  set,
}: {
  step: number;
  setStep: (n: number) => void;
  next: () => void;
  back: () => void;
  startNew: () => void;
  startFromExisting: (l: ExistingLesson) => void;
  existingLessons: ExistingLesson[];
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

      {step === 0 ? (
        <StepSource startNew={startNew} startFromExisting={startFromExisting} existingLessons={existingLessons} />
      ) : (
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
          {step === 1 ? <StepLesson values={values} set={set} topicError={topicError} /> : null}
          {step === 2 ? <StepReview values={values} /> : null}
        </div>
      )}

      {/* Step 0 advances by choosing a source card, so no Continue there. */}
      {step > 0 ? (
        <StickyActionBar>
          <button
            type="button"
            onClick={back}
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-zinc-300 bg-white px-5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
          >
            Back
          </button>
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={next}
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 text-base font-semibold text-white shadow-sm shadow-violet-500/25 transition-all hover:brightness-105 sm:flex-none"
            >
              Continue <span aria-hidden="true">→</span>
            </button>
          ) : (
            <SubmitButton className="min-h-12 flex-1 text-base sm:flex-none" pendingText="Generating…">
              Generate lesson ✨
            </SubmitButton>
          )}
        </StickyActionBar>
      ) : null}
    </div>
  );
}

/* ----------------------------- Stepper ----------------------------- */
function Stepper({ step, onJump }: { step: number; onJump: (n: number) => void }) {
  return (
    <ol className="flex items-center gap-2">
      {STEPS.map((label, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <li key={label} className="flex flex-1 items-center gap-2">
            <button
              type="button"
              onClick={() => (i <= step ? onJump(i) : undefined)}
              disabled={i > step}
              aria-current={active ? 'step' : undefined}
              className={clsx('flex items-center gap-2', i <= step ? 'cursor-pointer' : 'cursor-default')}
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
                  active ? 'text-zinc-900 dark:text-zinc-50' : 'text-zinc-400 dark:text-zinc-500',
                )}
              >
                {label}
              </span>
            </button>
            {i < STEPS.length - 1 ? (
              <span className={clsx('h-0.5 flex-1 rounded', done ? 'bg-violet-300 dark:bg-violet-800' : 'bg-zinc-200 dark:bg-zinc-800')} />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

/* --------------------------- Step 0: source --------------------------- */
function StepSource({
  startNew,
  startFromExisting,
  existingLessons,
}: {
  startNew: () => void;
  startFromExisting: (l: ExistingLesson) => void;
  existingLessons: ExistingLesson[];
}) {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <div className="space-y-4">
      <h2 className="text-center text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
        Where shall we start? 🧭
      </h2>

      <button
        type="button"
        onClick={startNew}
        className="group flex w-full items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-violet-800"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300">
          <SparkleIcon className="h-6 w-6" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-base font-bold tracking-tight text-zinc-900 sm:text-lg dark:text-zinc-50">
            Start something new
          </span>
          <span className="block text-sm text-zinc-500 dark:text-zinc-400">From a topic and your class details</span>
        </span>
        <ChevronRightIcon className="h-5 w-5 shrink-0 text-zinc-300 group-hover:text-violet-500 dark:text-zinc-600" />
      </button>

      <button
        type="button"
        onClick={() => (existingLessons.length > 0 ? setPickerOpen(true) : undefined)}
        disabled={existingLessons.length === 0}
        className="group flex w-full items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 text-left shadow-sm transition-all enabled:hover:-translate-y-0.5 enabled:hover:border-violet-300 enabled:hover:shadow-lg disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-900 dark:enabled:hover:border-violet-800"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
          <SeriesIcon className="h-6 w-6" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-base font-bold tracking-tight text-zinc-900 sm:text-lg dark:text-zinc-50">
            Use a saved lesson
          </span>
          <span className="block text-sm text-zinc-500 dark:text-zinc-400">
            {existingLessons.length > 0
              ? 'Start from one of your saved Biology lessons'
              : 'No saved lessons yet — create your first one'}
          </span>
        </span>
        <ChevronRightIcon className="h-5 w-5 shrink-0 text-zinc-300 group-hover:text-violet-500 dark:text-zinc-600" />
      </button>

      <BottomSheet open={pickerOpen} onClose={() => setPickerOpen(false)} title="Pick a lesson to start from">
        <ul className="space-y-1.5">
          {existingLessons.map((l) => (
            <li key={l.id}>
              <button
                type="button"
                onClick={() => {
                  startFromExisting(l);
                  setPickerOpen(false);
                }}
                className="flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-50 dark:text-zinc-100 dark:hover:bg-zinc-800"
              >
                <LessonIcon className="h-5 w-5 shrink-0 text-violet-500" />
                <span className="min-w-0 flex-1 truncate">{l.topic}</span>
                <span className="shrink-0 text-xs font-medium text-zinc-400">{l.courseLevel}</span>
              </button>
            </li>
          ))}
        </ul>
      </BottomSheet>
    </div>
  );
}

/* --------------------------- Step 1: lesson --------------------------- */
function StepLesson({
  values,
  set,
  topicError,
}: {
  values: Values;
  set: Setters;
  topicError: string | null;
}) {
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <div className="space-y-5">
      <h2 className="text-center text-xl font-extrabold tracking-tight text-zinc-900 sm:text-2xl dark:text-zinc-50">
        Pick your topic 🎯
      </h2>

      <Field label="Lesson topic" error={topicError ?? undefined}>
        <Input
          value={values.topic}
          onChange={(e) => set.setTopic(e.target.value)}
          placeholder="e.g. Cell structure, Enzymes, The heart…"
          maxLength={160}
          autoFocus
        />
      </Field>

      {/* Pill selectors */}
      <div className="flex flex-wrap gap-2">
        <PillSelect label="Qualification" value={values.qualificationId} options={QUAL_OPTS} onChange={set.setQualificationId} icon={<CapIcon />} />
        <PillSelect label="Year group" value={values.courseLevel} options={YEAR_OPTS} onChange={set.setCourseLevel} icon={<CalendarIcon />} />
        <PillSelect label="Lesson length" value={values.lessonLength} options={LENGTH_OPTS} onChange={set.setLessonLength} icon={<ClockIcon />} />
        <PillSelect label="Class level" value={values.classLevel} options={LEVEL_OPTS} onChange={set.setClassLevel} icon={<UsersMini />} />
      </div>

      <Field label="Any specific instructions or focus?" hint="Optional">
        <Textarea
          value={values.notes}
          onChange={(e) => set.setNotes(e.target.value)}
          rows={3}
          maxLength={2000}
          placeholder="e.g. low-energy period 5 class, build in a required practical, focus on exam technique…"
        />
      </Field>

      {/* Collapsible class needs */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => setMoreOpen((v) => !v)}
          aria-expanded={moreOpen}
          className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-zinc-700 dark:text-zinc-200"
        >
          Class needs &amp; objectives (optional)
          <span className={clsx('text-zinc-400 transition-transform', moreOpen && 'rotate-180')}>▾</span>
        </button>
        {moreOpen ? (
          <div className="space-y-4 border-t border-zinc-100 px-4 py-4 dark:border-zinc-800">
            <Field label="Learning objectives" hint="One per line, or leave blank and we'll suggest them.">
              <Textarea value={values.objectives} onChange={(e) => set.setObjectives(e.target.value)} rows={2} maxLength={2000} placeholder="By the end of the lesson, pupils will be able to…" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="SEND support">
                <Textarea value={values.send} onChange={(e) => set.setSend(e.target.value)} rows={2} maxLength={600} placeholder="e.g. dyslexia-friendly, extra scaffolding" />
              </Field>
              <Field label="EAL support">
                <Textarea value={values.eal} onChange={(e) => set.setEal(e.target.value)} rows={2} maxLength={600} placeholder="e.g. key-word glossary, sentence stems" />
              </Field>
            </div>
            <Field label="Misconceptions to address">
              <Textarea value={values.misconceptions} onChange={(e) => set.setMisconceptions(e.target.value)} rows={2} maxLength={600} placeholder="e.g. pupils confuse diffusion with osmosis" />
            </Field>
            <Field label="Practical / resource limits">
              <Textarea value={values.practical} onChange={(e) => set.setPractical(e.target.value)} rows={2} maxLength={600} placeholder="e.g. no lab access this week" />
            </Field>
          </div>
        ) : null}
      </div>

      <UploadPanel />
    </div>
  );
}

/* --------------------------- Step 2: review --------------------------- */
function StepReview({ values }: { values: Values }) {
  const rows: [string, string][] = [
    ['Topic', values.topic || '—'],
    ['Qualification', getQualification(values.qualificationId).label],
    ['Year group', values.courseLevel],
    ['Lesson length', values.lessonLength],
    ['Class level', values.classLevel],
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-300">
          <AtomIcon className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Review &amp; generate</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Check the details, then create your lesson.</p>
        </div>
      </div>

      <dl className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
        {rows.map(([label, value], i) => (
          <div key={label} className={clsx('flex items-center justify-between gap-4 px-4 py-3 text-sm', i % 2 === 0 ? 'bg-zinc-50/60 dark:bg-zinc-800/40' : 'bg-white dark:bg-zinc-900')}>
            <dt className="font-medium text-zinc-500 dark:text-zinc-400">{label}</dt>
            <dd className="text-right font-semibold text-zinc-900 dark:text-zinc-100">{value}</dd>
          </div>
        ))}
      </dl>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">You&apos;ll get</p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {INCLUDED.map((item) => (
            <li key={item} className="flex items-center gap-2.5 rounded-xl border border-violet-100 bg-violet-50/50 px-3 py-2 text-sm font-medium text-zinc-800 dark:border-violet-950 dark:bg-violet-950/30 dark:text-zinc-100">
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

      <p className="rounded-xl bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900 ring-1 ring-inset ring-amber-100 dark:bg-amber-950/30 dark:text-amber-100 dark:ring-amber-900/60">
        AI-generated — review content for accuracy before teaching. Generation
        takes a moment; keep this tab open and you&apos;ll land on your lesson.
      </p>
    </div>
  );
}

/* ------------------------- loading state ------------------------- */
function GeneratingState() {
  const phases = ['Planning the lesson', 'Writing the slides', 'Differentiating worksheets', 'Building the assessment', 'Adding teacher notes'];
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-violet-100 bg-gradient-to-b from-violet-50/70 to-white px-6 py-16 text-center shadow-sm dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
      <div className="relative flex h-24 w-24 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-violet-200/40 blur-xl motion-safe:animate-pulse-soft" />
        <AtomIcon className="h-20 w-20 text-violet-500 motion-safe:animate-spin-slow" />
        <SparkleIcon className="absolute -right-1 -top-1 h-6 w-6 text-fuchsia-500 motion-safe:animate-pulse-soft" />
      </div>
      <h2 className="mt-6 text-xl font-bold text-zinc-900 dark:text-zinc-50">Building your classroom-ready lesson…</h2>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">This usually takes a few moments.</p>
      <ul className="mt-6 w-full max-w-xs space-y-2 text-left">
        {phases.map((p, i) => (
          <li key={p} className="flex items-center gap-3 rounded-xl bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm ring-1 ring-zinc-100 motion-safe:animate-fade-up dark:bg-zinc-900 dark:text-zinc-200 dark:ring-zinc-800" style={{ animationDelay: `${i * 140}ms` }}>
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

/* ------------------------- tiny pill icons ------------------------- */
function CapIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 9l9-4 9 4-9 4-9-4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M7 11v4c0 1 2.2 2 5 2s5-1 5-2v-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="5" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 9h16M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function UsersMini() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
