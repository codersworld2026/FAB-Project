import { CellIcon, SparkleIcon } from '@/components/science/ScienceIcons';

const OBJECTIVES = [
  'Describe the main parts of animal and plant cells',
  'Explain the function of each cell structure',
  'Compare animal and plant cells',
];
const VOCAB = ['nucleus', 'cytoplasm', 'cell membrane', 'mitochondria', 'chloroplast', 'cell wall'];

const SECTIONS = [
  {
    tag: 'Starter',
    body: 'Recall task: label the parts of an animal cell from memory, then check with a partner.',
  },
  {
    tag: 'Main teaching',
    body: 'Introduce each organelle with a clear function; model how to compare animal and plant cells.',
  },
  {
    tag: 'Differentiated task',
    body: 'Support: structured table to complete. Core: describe functions. Challenge: explain how structure links to function.',
  },
  {
    tag: 'Exit ticket',
    body: 'Three quick questions: name two structures only in plant cells and give one reason why.',
  },
];

export function ExampleLesson() {
  return (
    <section id="example" className="relative overflow-hidden bg-gradient-to-b from-white to-violet-50/60 py-16 sm:py-20 dark:from-zinc-950 dark:to-zinc-900/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 sm:text-sm">
            See it in action
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
            An example lesson
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            A taste of what one generation produces — here, a Year 10 GCSE Biology
            lesson on cell structure.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-xl shadow-violet-200/30 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/30">
          {/* Header band */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-violet-700 to-fuchsia-600 px-5 py-4 text-white sm:px-7">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 ring-1 ring-inset ring-white/30">
              <CellIcon className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <p className="truncate font-display text-base font-bold sm:text-lg">Cells and microscopes</p>
              <p className="text-xs text-violet-100">Edexcel GCSE Biology · Year 10 · 60 minutes</p>
            </div>
          </div>

          <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-7">
            {/* Objectives + vocab */}
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-300">
                  Learning objectives
                </p>
                <ul className="mt-2 space-y-1.5">
                  {OBJECTIVES.map((o) => (
                    <li key={o} className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-200">
                      <SparkleIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-500" />
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-300">
                  Key vocabulary
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {VOCAB.map((v) => (
                    <span
                      key={v}
                      className="rounded-lg bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700 ring-1 ring-inset ring-violet-100 dark:bg-violet-950/50 dark:text-violet-300 dark:ring-violet-900"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-3">
              {SECTIONS.map((s) => (
                <div
                  key={s.tag}
                  className="rounded-xl border border-zinc-100 bg-zinc-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-800/40"
                >
                  <p className="text-[11px] font-bold uppercase tracking-wide text-violet-600 dark:text-violet-300">
                    {s.tag}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">{s.body}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="border-t border-zinc-100 px-5 py-3 text-[11px] text-zinc-400 sm:px-7 dark:border-zinc-800 dark:text-zinc-500">
            Illustrative example. Review generated content before classroom use.
          </p>
        </div>
      </div>
    </section>
  );
}
