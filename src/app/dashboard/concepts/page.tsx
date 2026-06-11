import Link from 'next/link';
import { requireProfile } from '@/lib/auth';
import {
  listSubjects,
  listYearStages,
  listTopicsBySubject,
  listConceptsByTopic,
  searchConcepts,
} from '@/lib/curriculum';
import { SectionHeader } from '@/components/app/SectionHeader';
import { EmptyState } from '@/components/app/EmptyState';
import { ResourceCard } from '@/components/app/ResourceCard';
import { ConceptsIcon, ChevronRightIcon } from '@/components/app/icons';

export const metadata = { title: 'Concepts' };

const DIFFICULTY_LABEL: Record<string, string> = {
  foundational: 'Foundational',
  developing: 'Developing',
  secure: 'Secure',
  stretch: 'Stretch',
};

/** Builds a /dashboard/concepts URL preserving the chosen drill-down context. */
function conceptsHref(params: { subject?: string; stage?: string; topic?: string }) {
  const sp = new URLSearchParams();
  if (params.subject) sp.set('subject', params.subject);
  if (params.stage) sp.set('stage', params.stage);
  if (params.topic) sp.set('topic', params.topic);
  const qs = sp.toString();
  return qs ? `/dashboard/concepts?${qs}` : '/dashboard/concepts';
}

function Breadcrumbs({ trail }: { trail: { label: string; href: string }[] }) {
  return (
    <nav className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
      {trail.map((c, i) => (
        <span key={c.href} className="flex items-center gap-1.5">
          {i > 0 ? <ChevronRightIcon className="h-3.5 w-3.5 text-zinc-300 dark:text-zinc-600" /> : null}
          {i < trail.length - 1 ? (
            <Link href={c.href} className="hover:text-violet-700 hover:underline dark:hover:text-violet-300">
              {c.label}
            </Link>
          ) : (
            <span className="text-zinc-700 dark:text-zinc-200">{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

/** A minimal server-rendered GET search form — no client JS. Full-width by
 *  default; callers size it (compact in the desktop header, full-width on mobile). */
function SearchForm({ subject, defaultValue }: { subject?: string; defaultValue?: string }) {
  return (
    <form action="/dashboard/concepts" method="get" className="flex w-full items-center gap-2">
      {subject ? <input type="hidden" name="subject" value={subject} /> : null}
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder="Search concepts…"
        aria-label="Search concepts"
        className="min-h-11 w-full flex-1 rounded-xl border border-zinc-200 bg-white px-3 text-base text-zinc-900 shadow-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-200 sm:text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
      />
      <button
        type="submit"
        className="inline-flex min-h-11 shrink-0 items-center rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 font-display text-sm font-bold text-white shadow-sm shadow-violet-500/25"
      >
        Search
      </button>
    </form>
  );
}

/** Renders the search form full-width on mobile (its own row) and compact in the
 *  desktop header slot — avoids overflowing the SectionHeader's shrink-0 action. */
function MobileSearchRow({ subject, defaultValue }: { subject?: string; defaultValue?: string }) {
  return (
    <div className="sm:hidden">
      <SearchForm subject={subject} defaultValue={defaultValue} />
    </div>
  );
}

function DesktopSearchSlot({ subject, defaultValue }: { subject?: string; defaultValue?: string }) {
  return (
    <div className="hidden w-72 sm:block">
      <SearchForm subject={subject} defaultValue={defaultValue} />
    </div>
  );
}

export default async function ConceptsPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string; stage?: string; topic?: string; q?: string }>;
}) {
  await requireProfile();
  const { subject, stage, topic, q } = await searchParams;

  // --- Search mode -----------------------------------------------------------
  if (q && q.trim()) {
    const results = await searchConcepts(q, subject);
    return (
      <div className="space-y-6">
        <SectionHeader
          title="Search concepts"
          subtitle={`Results for “${q.trim()}”`}
          action={<DesktopSearchSlot subject={subject} defaultValue={q} />}
          backHref={conceptsHref({ subject })}
        />
        <MobileSearchRow subject={subject} defaultValue={q} />
        {results.length === 0 ? (
          <EmptyState
            icon={<ConceptsIcon className="h-8 w-8" />}
            title="No matching concepts"
            description="Try a different search term, or browse the curriculum by subject and year."
            actionLabel="Browse all concepts"
            actionHref="/dashboard/concepts"
          />
        ) : (
          <div className="grid gap-3">
            {results.map((c) => (
              <ResourceCard
                key={c.id}
                href={`/dashboard/concepts/${c.id}`}
                icon={<ConceptsIcon className="h-5 w-5" />}
                title={c.title}
                meta={[c.shortDescription, DIFFICULTY_LABEL[c.difficultyLevel]].filter(Boolean) as string[]}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // --- Drill-down ------------------------------------------------------------
  const subjects = await listSubjects();

  // Curriculum not available (e.g. preview mode / no backend keys, or unseeded).
  if (subjects.length === 0) {
    return (
      <div className="space-y-6">
        <SectionHeader
          title="Concepts"
          subtitle="Browse the Science concept graph by subject, year and topic."
        />
        <EmptyState
          icon={<ConceptsIcon className="h-8 w-8" />}
          title="No curriculum to show yet"
          description="The Science concept graph will appear here once it’s available for your account."
        />
      </div>
    );
  }

  const activeSubject = subject ? subjects.find((s) => s.id === subject) ?? null : null;
  const stages = activeSubject ? await listYearStages() : [];
  const activeStage = stage ? stages.find((y) => y.id === stage) ?? null : null;
  const topics = activeSubject && activeStage ? await listTopicsBySubject(activeSubject.id, activeStage.id) : [];
  const activeTopic = topic ? topics.find((t) => t.id === topic) ?? null : null;
  const concepts = activeTopic ? await listConceptsByTopic(activeTopic.id) : [];

  const trail: { label: string; href: string }[] = [{ label: 'Concepts', href: conceptsHref({}) }];
  if (activeSubject) trail.push({ label: activeSubject.name, href: conceptsHref({ subject: activeSubject.id }) });
  if (activeStage)
    trail.push({ label: activeStage.name, href: conceptsHref({ subject: activeSubject!.id, stage: activeStage.id }) });
  if (activeTopic)
    trail.push({
      label: activeTopic.title,
      href: conceptsHref({ subject: activeSubject!.id, stage: activeStage!.id, topic: activeTopic.id }),
    });

  // Decide which level to render.
  let level: 'subjects' | 'stages' | 'topics' | 'concepts' = 'subjects';
  if (activeSubject && !activeStage) level = 'stages';
  else if (activeSubject && activeStage && !activeTopic) level = 'topics';
  else if (activeSubject && activeStage && activeTopic) level = 'concepts';

  const heading =
    level === 'subjects'
      ? { title: 'Concepts', subtitle: 'Choose a subject to explore its Science concept graph.' }
      : level === 'stages'
        ? { title: activeSubject!.name, subtitle: 'Choose a year group.' }
        : level === 'topics'
          ? { title: activeStage!.name, subtitle: `Topics in ${activeSubject!.name}.` }
          : { title: activeTopic!.title, subtitle: activeTopic!.description };

  // Back link = the previous breadcrumb level.
  const backHref = trail.length >= 2 ? trail[trail.length - 2].href : undefined;

  return (
    <div className="space-y-6">
      <SectionHeader
        title={heading.title}
        subtitle={heading.subtitle}
        action={<DesktopSearchSlot subject={activeSubject?.id} />}
        backHref={backHref}
      />
      <MobileSearchRow subject={activeSubject?.id} />
      {trail.length > 1 ? <Breadcrumbs trail={trail} /> : null}

      {level === 'subjects' ? (
        <div className="grid gap-3">
          {subjects.map((s) => (
            <ResourceCard
              key={s.id}
              href={conceptsHref({ subject: s.id })}
              icon={<ConceptsIcon className="h-5 w-5" />}
              title={s.name}
              meta={['Science']}
            />
          ))}
        </div>
      ) : null}

      {level === 'stages' ? (
        stages.length === 0 ? (
          <EmptyState
            icon={<ConceptsIcon className="h-8 w-8" />}
            title="No year groups yet"
            description="Year groups for this subject will appear here once they’re available."
          />
        ) : (
          <div className="grid gap-3">
            {stages.map((y) => (
              <ResourceCard
                key={y.id}
                href={conceptsHref({ subject: activeSubject!.id, stage: y.id })}
                icon={<ConceptsIcon className="h-5 w-5" />}
                title={y.name}
                meta={[y.phase]}
              />
            ))}
          </div>
        )
      ) : null}

      {level === 'topics' ? (
        topics.length === 0 ? (
          <EmptyState
            icon={<ConceptsIcon className="h-8 w-8" />}
            title="No topics yet"
            description={`Topics for ${activeStage!.name} ${activeSubject!.name} will appear here once they’re available.`}
          />
        ) : (
          <div className="grid gap-3">
            {topics.map((t) => (
              <ResourceCard
                key={t.id}
                href={conceptsHref({ subject: activeSubject!.id, stage: activeStage!.id, topic: t.id })}
                icon={<ConceptsIcon className="h-5 w-5" />}
                title={t.title}
                meta={[t.description]}
              />
            ))}
          </div>
        )
      ) : null}

      {level === 'concepts' ? (
        concepts.length === 0 ? (
          <EmptyState
            icon={<ConceptsIcon className="h-8 w-8" />}
            title="No concepts yet"
            description={`Concepts for ${activeTopic!.title} will appear here once they’re available.`}
          />
        ) : (
          <div className="grid gap-3">
            {concepts.map((c) => (
              <ResourceCard
                key={c.id}
                href={`/dashboard/concepts/${c.id}`}
                icon={<ConceptsIcon className="h-5 w-5" />}
                title={c.title}
                meta={[c.shortDescription, DIFFICULTY_LABEL[c.difficultyLevel]].filter(Boolean) as string[]}
              />
            ))}
          </div>
        )
      ) : null}
    </div>
  );
}
