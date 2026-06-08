import { FeatureCard } from './FeatureCard';

export function FeaturesSection() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <FeatureCard
          color="violet"
          icon={<StackIcon />}
          title="Lessons"
          description="Create engaging, standards-aligned slide decks in seconds. Perfect for introducing new concepts."
          preview={<SlidePreview />}
        />
        <FeatureCard
          color="pink"
          icon={<SeriesIcon />}
          title="Lesson Series"
          description="Plan an entire unit with ordered lessons, recaps, quizzes and assessments."
          preview={<SeriesPreview />}
        />
        <FeatureCard
          color="indigo"
          icon={<SheetIcon />}
          title="Activity Sheets"
          description="Generate ready-to-use worksheets, practicals and activities to reinforce learning."
          preview={<WorksheetPreview />}
        />
        <FeatureCard
          color="amber"
          icon={<CheckIcon />}
          title="Assessments"
          description="Create quizzes, tests and exit tickets that check understanding and inform instruction."
          preview={<QuizPreview />}
        />
      </div>
    </section>
  );
}

/* --- mini previews --- */
function SlidePreview() {
  return (
    <div>
      <div className="flex h-16 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-100 to-violet-100 text-2xl">
        🌱
      </div>
      <p className="mt-2 text-xs font-bold text-zinc-800">Photosynthesis</p>
      <div className="mt-1 space-y-1">
        <span className="block h-1.5 w-full rounded bg-zinc-100" />
        <span className="block h-1.5 w-2/3 rounded bg-zinc-100" />
      </div>
    </div>
  );
}
function SeriesPreview() {
  const items = ['Habitats and Niches', 'Food Chains', 'Energy Transfer', 'Human Impact'];
  return (
    <div>
      <p className="text-[11px] font-bold text-zinc-800">Unit: Ecosystems</p>
      <ol className="mt-1.5 space-y-1">
        {items.map((it, i) => (
          <li key={it} className="flex items-center gap-2 text-[11px] text-zinc-600">
            <span className="flex h-4 w-4 items-center justify-center rounded bg-pink-100 text-[9px] font-bold text-pink-600">
              {i + 1}
            </span>
            {it}
          </li>
        ))}
      </ol>
    </div>
  );
}
function WorksheetPreview() {
  return (
    <div>
      <p className="text-[11px] font-bold text-zinc-800">Diffusion &amp; Osmosis</p>
      <div className="mt-2 flex gap-2">
        {['🧪', '🧫'].map((e, i) => (
          <div key={i} className="flex h-12 flex-1 items-center justify-center rounded-lg bg-indigo-50 text-xl">
            {e}
          </div>
        ))}
      </div>
    </div>
  );
}
function QuizPreview() {
  const opts = [
    ['Generate energy', false],
    ['Control what enters the cell', true],
    ['Provide support only', false],
  ] as const;
  return (
    <div>
      <p className="text-[11px] font-bold text-zinc-800">Knowledge Check</p>
      <p className="mt-0.5 text-[10px] text-zinc-500">Function of the cell membrane?</p>
      <ul className="mt-1.5 space-y-1">
        {opts.map(([label, correct]) => (
          <li key={label} className="flex items-center gap-1.5 text-[10px] text-zinc-600">
            <span
              className={
                correct
                  ? 'flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-500 text-[8px] text-white'
                  : 'h-3.5 w-3.5 rounded-full border border-zinc-300'
              }
            >
              {correct ? '✓' : ''}
            </span>
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* --- icons --- */
function StackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3l9 5-9 5-9-5 9-5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M3 13l9 5 9-5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}
function SeriesIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 6h12M8 12h12M8 18h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="4" cy="6" r="1.5" fill="currentColor" />
      <circle cx="4" cy="12" r="1.5" fill="currentColor" />
      <circle cx="4" cy="18" r="1.5" fill="currentColor" />
    </svg>
  );
}
function SheetIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 8h6M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
