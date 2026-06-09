import Link from 'next/link';
import { requireProfile } from '@/lib/auth';
import { getUsageSummary } from '@/lib/subscription';
import { listPacks } from '@/lib/packs';
import { Badge } from '@/components/ui';
import { CreationTypeCard } from '@/components/app/CreationTypeCard';
import { ResourceCard, type ResourceStatus } from '@/components/app/ResourceCard';
import { EmptyState } from '@/components/app/EmptyState';
import { TeamsPromo } from '@/components/app/TeamsPromo';
import { Avatar } from '@/components/app/Avatar';
import {
  LessonIcon,
  SeriesIcon,
  ActivityIcon,
  AssessmentIcon,
  PlusIcon,
} from '@/components/app/icons';
import { SparkleIcon } from '@/components/science/ScienceIcons';

export const metadata = { title: 'Home' };

const CREATE = [
  {
    href: '/dashboard/generate',
    title: 'Single lesson',
    subtitle: 'Create one complete Biology lesson',
    accent: 'violet' as const,
    Icon: LessonIcon,
  },
  {
    href: '/dashboard/series',
    title: 'Lesson series',
    subtitle: 'Plan connected lessons for a topic',
    accent: 'indigo' as const,
    Icon: SeriesIcon,
  },
  {
    href: '/dashboard/activity-sheets/new',
    title: 'Activity sheets',
    subtitle: 'Print-ready classroom & homework tasks',
    accent: 'sky' as const,
    Icon: ActivityIcon,
  },
  {
    href: '/dashboard/assessments/new',
    title: 'Assessments',
    subtitle: 'Quizzes, tests and exam-style questions',
    accent: 'amber' as const,
    Icon: AssessmentIcon,
  },
];

export default async function DashboardPage() {
  const profile = await requireProfile();
  const usage = await getUsageSummary();
  const recentPacks = await listPacks();
  const firstName = profile.full_name?.split(' ')[0];

  return (
    <div className="space-y-8">
      {/* Heading */}
      <header>
        <p className="text-sm font-medium text-violet-700 dark:text-violet-300">
          Welcome{firstName ? `, ${firstName}` : ''} 👋
        </p>
        <h1 className="mt-1 flex items-start gap-2 text-3xl font-extrabold leading-tight tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
          What shall we create today?
          <SparkleIcon className="mt-1 h-6 w-6 shrink-0 text-amber-400" />
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Edexcel GCSE &amp; International GCSE Biology — ready in minutes.
        </p>
      </header>

      {usage ? <UsageCard usage={usage} /> : null}

      {/* Creation hub */}
      <section className="grid gap-3 sm:grid-cols-2">
        {CREATE.map(({ href, title, subtitle, accent, Icon }) => (
          <CreationTypeCard
            key={href}
            href={href}
            title={title}
            subtitle={subtitle}
            accent={accent}
            icon={<Icon className="h-6 w-6" />}
          />
        ))}
      </section>

      {/* Recent lessons */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Recent lessons
          </h2>
          {recentPacks.length > 0 ? (
            <Link href="/dashboard/lessons" className="text-sm font-semibold text-violet-700 hover:underline dark:text-violet-300">
              View all
            </Link>
          ) : null}
        </div>

        {recentPacks.length === 0 ? (
          <EmptyState
            icon={<LessonIcon className="h-8 w-8" />}
            title="No lessons yet"
            description="Create your first Edexcel Biology lesson — it'll appear here, ready to review, teach and export."
            actionLabel="Create a Biology lesson"
            actionHref="/dashboard/generate"
          />
        ) : (
          <div className="grid gap-3">
            {recentPacks.slice(0, 4).map((pack) =>
              pack.id ? (
                <ResourceCard
                  key={pack.id}
                  href={`/dashboard/packs/${pack.id}`}
                  icon={<LessonIcon className="h-5 w-5" />}
                  title={pack.topic ?? 'Untitled lesson'}
                  meta={[
                    pack.course_level,
                    pack.ability_level,
                    pack.created_at
                      ? new Date(pack.created_at).toLocaleDateString('en-GB')
                      : undefined,
                  ].filter(Boolean) as string[]}
                  status={pack.review_status as ResourceStatus | undefined}
                />
              ) : null,
            )}
          </div>
        )}
      </section>

      {/* Teams */}
      <section className="space-y-4">
        <TeamsPromo />
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Teams
          </h2>
          <Link
            href="/dashboard/teams"
            className="inline-flex items-center gap-1.5 rounded-xl border border-violet-200 px-3 py-1.5 text-sm font-semibold text-violet-700 transition-colors hover:bg-violet-50 dark:border-violet-900 dark:text-violet-300 dark:hover:bg-zinc-800"
          >
            <PlusIcon className="h-4 w-4" /> Team
          </Link>
        </div>
        <Link
          href="/dashboard/teams"
          className="flex items-center gap-3 rounded-2xl border border-zinc-200/80 bg-lavender p-4 shadow-sm transition-colors hover:border-violet-300 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <Avatar name={profile.full_name} email={profile.email} />
          <span className="min-w-0 flex-1">
            <span className="block truncate font-display text-[15px] font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {profile.full_name?.trim() || 'My workspace'}
            </span>
            <span className="block text-xs text-zinc-500 dark:text-zinc-400">Personal · just you</span>
          </span>
          <span className="shrink-0 text-xs font-semibold text-violet-700 dark:text-violet-300">Manage →</span>
        </Link>
      </section>
    </div>
  );
}

function UsageCard({
  usage,
}: {
  usage: NonNullable<Awaited<ReturnType<typeof getUsageSummary>>>;
}) {
  if (usage.isSubscribed) {
    return (
      <div className="flex items-center justify-between rounded-2xl border border-violet-100 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Subscription active</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Unlimited lessons.</p>
        </div>
        <Badge color="violet">Subscribed</Badge>
      </div>
    );
  }

  const pct = Math.min(100, Math.round((usage.used / usage.limit) * 100));
  const exhausted = usage.remaining === 0;

  return (
    <div className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Free trial</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {usage.remaining} of {usage.limit} free lessons remaining.
          </p>
        </div>
        {exhausted ? (
          <Link
            href="/dashboard/account"
            className="inline-flex h-9 items-center rounded-lg bg-violet-700 px-3 text-sm font-semibold text-white hover:bg-violet-800"
          >
            Subscribe to continue
          </Link>
        ) : (
          <Badge color="amber">{usage.remaining} left</Badge>
        )}
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
        <div
          className={
            exhausted
              ? 'h-full rounded-full bg-amber-500'
              : 'h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600'
          }
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
