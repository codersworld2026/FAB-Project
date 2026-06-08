import { SparkleIcon } from '@/components/science/ScienceIcons';

/**
 * GeneratorPreviewCard — static, decorative mockup of the lesson generator,
 * shown in the hero. Not a working form; the real generator is at
 * /dashboard/generate. Mirrors the real fields so it feels authentic.
 */
export function LessonGeneratorPreview() {
  const outputs = ['Lesson plan', 'Slides', 'Worksheets', 'Quiz', 'Teacher notes'];

  return (
    <div className="w-full max-w-sm rounded-3xl border border-white/70 bg-white/90 p-5 shadow-2xl shadow-violet-400/25 ring-1 ring-white backdrop-blur">
      {/* Window chrome */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white">
            <SparkleIcon className="h-4 w-4" />
          </span>
          <p className="text-sm font-bold text-zinc-900">New lesson pack</p>
        </div>
        <span className="flex gap-1" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-rose-300" />
          <span className="h-2 w-2 rounded-full bg-amber-300" />
          <span className="h-2 w-2 rounded-full bg-emerald-300" />
        </span>
      </div>

      <PreviewRow label="Topic" value="Cell structure" />
      <PreviewRow label="Exam board" value="Edexcel IGCSE" />
      <PreviewRow label="Year group" value="Year 10" />

      <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
        Class profile
      </p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {['Mixed ability', 'EAL support'].map((chip) => (
          <span
            key={chip}
            className="rounded-lg bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700 ring-1 ring-inset ring-violet-100"
          >
            {chip}
          </span>
        ))}
      </div>

      <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
        Output
      </p>
      <div className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-2">
        {outputs.map((o) => (
          <span key={o} className="flex items-center gap-2 text-sm text-zinc-700">
            <CheckBox />
            {o}
          </span>
        ))}
      </div>

      <div className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3 text-sm font-semibold text-white shadow-sm">
        Create a lesson pack
        <SparkleIcon className="h-4 w-4" />
      </div>
    </div>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
        {label}
      </p>
      <div className="mt-1.5 flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50/80 px-3 py-2.5 text-sm font-medium text-zinc-800">
        {value}
        <span className="h-1.5 w-1.5 rounded-full bg-violet-400" aria-hidden="true" />
      </div>
    </div>
  );
}

function CheckBox() {
  return (
    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white">
      <svg width="10" height="10" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M16 5.5L8.25 14L4 9.75" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
