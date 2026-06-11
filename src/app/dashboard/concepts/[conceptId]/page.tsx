import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireProfile } from '@/lib/auth';
import { getConceptDetail } from '@/lib/curriculum';
import { SectionHeader } from '@/components/app/SectionHeader';
import { ResourceCard } from '@/components/app/ResourceCard';
import { ConceptsIcon } from '@/components/app/icons';
import type { ConceptView } from '@/lib/types';

export const metadata = { title: 'Concept' };

const DIFFICULTY_LABEL: Record<string, string> = {
  foundational: 'Foundational',
  developing: 'Developing',
  secure: 'Secure',
  stretch: 'Stretch',
};

const ABILITY_LABEL: Record<string, string> = {
  support: 'Support',
  core: 'Core',
  challenge: 'Challenge',
};

/** A titled card section. */
function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="font-display text-sm font-bold uppercase tracking-wide text-violet-700 dark:text-violet-300">
        {title}
      </h2>
      <div className="mt-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{children}</div>
    </section>
  );
}

/** Links to other concepts in the graph (prior / next / related). */
function ConceptLinks({ concepts }: { concepts: ConceptView[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {concepts.map((c) => (
        <li key={c.id}>
          <Link
            href={`/dashboard/concepts/${c.id}`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-violet-200 bg-violet-50/60 px-3 py-1.5 text-sm font-semibold text-violet-800 transition-colors hover:border-violet-300 hover:bg-violet-100 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-200"
          >
            <ConceptsIcon className="h-3.5 w-3.5" />
            {c.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5">
      {items.map((t, i) => (
        <li key={i}>{t}</li>
      ))}
    </ul>
  );
}

export default async function ConceptDetailPage({
  params,
}: {
  params: Promise<{ conceptId: string }>;
}) {
  await requireProfile();
  const { conceptId } = await params;

  const detail = await getConceptDetail(conceptId);
  if (!detail) notFound();

  const { concept, subjectName, yearStageName, topicTitle, prior, next, related, resources } = detail;

  const backHref = `/dashboard/concepts?subject=${concept.subjectId}&stage=${concept.yearStageId}&topic=${concept.topicId}`;
  const meta = [subjectName, yearStageName, topicTitle, DIFFICULTY_LABEL[concept.difficultyLevel]].filter(Boolean);

  return (
    <div className="space-y-6">
      <SectionHeader title={concept.title} subtitle={concept.shortDescription} backHref={backHref} />

      <div className="flex flex-wrap gap-2">
        {meta.map((m) => (
          <span
            key={m}
            className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
          >
            {m}
          </span>
        ))}
        {concept.abilitySuitability.map((a) => (
          <span
            key={a}
            className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-950/50 dark:text-violet-200"
          >
            {ABILITY_LABEL[a] ?? a}
          </span>
        ))}
      </div>

      <Panel title="Explanation">
        <p>{concept.detailedExplanation}</p>
      </Panel>

      <div className="grid gap-4 md:grid-cols-2">
        <Panel title="Prior learning">
          <p className="mb-3">{concept.priorLearningSummary}</p>
          {prior.length > 0 ? (
            <ConceptLinks concepts={prior} />
          ) : (
            <p className="text-zinc-400 dark:text-zinc-500">No earlier concepts linked.</p>
          )}
        </Panel>
        <Panel title="Next learning">
          <p className="mb-3">{concept.nextLearningSummary}</p>
          {next.length > 0 ? (
            <ConceptLinks concepts={next} />
          ) : (
            <p className="text-zinc-400 dark:text-zinc-500">No later concepts linked.</p>
          )}
        </Panel>
      </div>

      {related.length > 0 ? (
        <Panel title="Related concepts">
          <ConceptLinks concepts={related} />
        </Panel>
      ) : null}

      {concept.commonMisconceptions.length > 0 ? (
        <Panel title="Common misconceptions">
          <Bullets items={concept.commonMisconceptions} />
        </Panel>
      ) : null}

      {concept.keyVocabulary.length > 0 ? (
        <Panel title="Key vocabulary">
          <ul className="flex flex-wrap gap-2">
            {concept.keyVocabulary.map((v) => (
              <li
                key={v}
                className="rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
              >
                {v}
              </li>
            ))}
          </ul>
        </Panel>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <Panel title="Lesson guidance">
          <p>{concept.lessonGuidance}</p>
        </Panel>
        <Panel title="Assessment guidance">
          <p>{concept.assessmentGuidance}</p>
        </Panel>
      </div>

      {concept.practicalLinks.length > 0 ? (
        <Panel title="Practical links">
          <Bullets items={concept.practicalLinks} />
        </Panel>
      ) : null}

      <Panel title="Resources">
        {resources.length === 0 ? (
          <p className="text-zinc-500 dark:text-zinc-400">
            Resources will appear here once concept-anchored generation is wired in a later phase.
          </p>
        ) : (
          <div className="grid gap-3">
            {resources.map((r) => (
              <ResourceCard
                key={r.id}
                href={`/dashboard/concepts/${concept.id}`}
                icon={<ConceptsIcon className="h-5 w-5" />}
                title={r.title}
                meta={[r.resourceType, ABILITY_LABEL[r.abilityLevel] ?? r.abilityLevel, r.status].filter(
                  Boolean,
                )}
              />
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
