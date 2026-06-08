const STEPS = [
  {
    n: 1,
    icon: '📝',
    title: 'Tell Lessons Generator what you need',
    desc: 'Enter a topic, year group and what to include in your lesson.',
  },
  {
    n: 2,
    icon: '⚡',
    title: 'AI creates your resources',
    desc: 'Slides, worksheets, quizzes and plans — aligned and ready.',
  },
  {
    n: 3,
    icon: '✅',
    title: 'Review and teach with confidence',
    desc: 'Edit in minutes, then share, export or print.',
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-violet-600">
          How it works
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
          From idea to lesson in three steps
        </h2>
      </div>

      <div className="relative mt-12 grid gap-10 md:grid-cols-3">
        {/* Dotted connector (desktop) */}
        <div
          aria-hidden="true"
          className="absolute left-[16%] right-[16%] top-9 hidden border-t-2 border-dashed border-violet-200 md:block"
        />
        {STEPS.map((step) => (
          <div key={step.n} className="relative flex flex-col items-center text-center">
            <div className="relative flex h-18 w-18 items-center justify-center rounded-full bg-violet-100 text-3xl ring-8 ring-white">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-50">
                {step.icon}
              </span>
              <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white shadow">
                {step.n}
              </span>
            </div>
            <h3 className="mt-5 text-base font-bold text-zinc-900">{step.title}</h3>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-zinc-600">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
