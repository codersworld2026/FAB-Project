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
    <section id="how" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 sm:text-sm">
          How it works
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
          From idea to lesson in three steps
        </h2>
      </div>

      {/* Mobile: vertical timeline */}
      <ol className="mt-10 sm:hidden">
        {STEPS.map((step, i) => (
          <li key={step.n} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-600 text-base font-bold text-white shadow-sm shadow-violet-300/50">
                {step.n}
              </span>
              {i < STEPS.length - 1 ? (
                <span className="my-1 w-0.5 flex-1 border-l-2 border-dashed border-violet-200" />
              ) : null}
            </div>
            <div className="pb-8">
              <span className="text-xl">{step.icon}</span>
              <h3 className="mt-1 text-base font-bold text-zinc-900">{step.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-zinc-600">{step.desc}</p>
            </div>
          </li>
        ))}
      </ol>

      {/* Desktop: horizontal with dotted connector */}
      <div className="relative mt-12 hidden gap-10 sm:grid sm:grid-cols-3">
        <div
          aria-hidden="true"
          className="absolute left-[16%] right-[16%] top-9 border-t-2 border-dashed border-violet-200"
        />
        {STEPS.map((step) => (
          <div key={step.n} className="relative flex flex-col items-center text-center">
            <div className="relative flex items-center justify-center rounded-full bg-violet-100 ring-8 ring-white">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-50 text-3xl">
                {step.icon}
              </span>
              <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white shadow">
                {step.n}
              </span>
            </div>
            <h3 className="mt-5 text-base font-bold text-zinc-900">{step.title}</h3>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-zinc-600">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
