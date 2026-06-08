/**
 * Static visual mockup of the lesson-generator form (decorative — for the hero).
 * Not a working form; the real generator lives at /dashboard/generate.
 */
export function LessonGeneratorPreview() {
  const years = ['Year 7', 'Year 8', 'Year 9', 'KS3', 'KS4'];
  const includes = [
    ['Slides', true],
    ['Worksheet', true],
    ['Quiz', true],
    ['Differentiation', true],
    ['Exit ticket', true],
  ] as const;

  return (
    <div className="w-full max-w-sm rounded-2xl border border-violet-100 bg-white p-5 shadow-xl shadow-violet-200/40">
      <p className="text-sm font-semibold text-zinc-900">Lesson generator</p>

      <label className="mt-4 block text-xs font-medium text-zinc-500">
        What will you teach?
      </label>
      <div className="mt-1.5 flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-700">
        Cells and microscopes
        <SearchIcon />
      </div>

      <p className="mt-4 text-xs font-medium text-zinc-500">Year group</p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {years.map((y, i) => (
          <span
            key={y}
            className={
              i === 0
                ? 'rounded-lg bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-700 ring-1 ring-inset ring-violet-200'
                : 'rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600'
            }
          >
            {y}
          </span>
        ))}
      </div>

      <p className="mt-4 text-xs font-medium text-zinc-500">Subject</p>
      <div className="mt-1.5 flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-700">
        Science
        <ChevronIcon />
      </div>

      <p className="mt-4 text-xs font-medium text-zinc-500">Include in lesson</p>
      <div className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-2">
        {includes.map(([label]) => (
          <span key={label} className="flex items-center gap-2 text-sm text-zinc-700">
            <CheckBox />
            {label}
          </span>
        ))}
      </div>

      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-2.5 text-sm font-semibold text-white shadow-sm"
      >
        Generate lesson ✨
      </button>
    </div>
  );
}

function CheckBox() {
  return (
    <span className="flex h-4 w-4 items-center justify-center rounded bg-violet-600 text-white">
      <svg width="10" height="10" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M16 5.5L8.25 14L4 9.75" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-zinc-400" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-zinc-400" aria-hidden="true">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
