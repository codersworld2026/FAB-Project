import { UsersIcon } from '@/components/app/icons';
import { SparkleIcon } from '@/components/science/ScienceIcons';

/** Team collaboration teaser (feature in progress — labelled honestly). */
export function CollaborationTeaser() {
  return (
    <section id="teams" className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
              Coming soon
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
              Better together
            </h2>
            <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
              Create a team, invite your Biology colleagues, and share lessons,
              series and assessments that anyone can duplicate and make their own —
              with roles and secure, server-side permissions.
            </p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {['Share across your department', 'Duplicate and remix resources', 'Owner / Admin / Editor / Viewer roles', 'See who last edited a resource'].map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-200">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute inset-x-10 -bottom-4 -z-10 h-28 rounded-full bg-violet-300/30 blur-2xl" />
            <div className="rounded-3xl border border-violet-100 bg-lavender p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-600 text-white">
                  <UsersIcon className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-display text-sm font-bold text-zinc-900 dark:text-zinc-50">Science department</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">4 teachers · 28 shared lessons</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {['Cell biology — Year 10', 'Enzymes — Year 11', 'Ecology — Year 9'].map((l, i) => (
                  <div
                    key={l}
                    className="flex items-center justify-between rounded-xl bg-white px-3 py-2.5 text-sm font-medium text-zinc-700 shadow-sm dark:bg-zinc-800 dark:text-zinc-200"
                  >
                    {l}
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-300">
                      {['Shared', 'Editing', 'Shared'][i]}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-zinc-400 dark:text-zinc-500">Illustrative preview.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** AI Biology assistant teaser — clearly not yet live (no fake AI answers). */
export function AssistantTeaser() {
  return (
    <section id="assistant" className="relative overflow-hidden bg-gradient-to-b from-violet-50/60 to-white py-16 sm:py-20 dark:from-zinc-900/50 dark:to-zinc-950">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-500/30">
          <SparkleIcon className="h-7 w-7" />
        </span>
        <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
          Coming soon
        </span>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
          An AI Biology assistant
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
          Help using the platform, plus answers to Edexcel GCSE and International
          GCSE Biology questions — with the qualification kept clear so content
          never gets mixed up. AI responses may contain errors; review teaching
          and assessment content before classroom use.
        </p>
      </div>
    </section>
  );
}
