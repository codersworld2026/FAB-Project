import Link from 'next/link';
import { requireProfile } from '@/lib/auth';
import { getUsageSummary } from '@/lib/subscription';
import { listPacks } from '@/lib/packs';
import { Badge } from '@/components/ui';
import { QuickTemplates } from '@/components/dashboard/QuickTemplates';
import { DnaIcon, MoleculeIcon, SparkleIcon, CellIcon } from '@/components/science/ScienceIcons';

export const metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const profile = await requireProfile();
  const usage = await getUsageSummary();
  const recentPacks = await listPacks();
  const firstName = profile.full_name?.split(' ')[0];

  return (
    <div className="space-y-8">
      {/* Hero create card */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-700 via-violet-600 to-fuchsia-600 p-6 text-white shadow-xl shadow-violet-300/40 sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <DnaIcon className="pointer-events-none absolute right-6 top-6 hidden h-16 w-16 text-white/20 motion-safe:animate-float sm:block" />
        <MoleculeIcon className="pointer-events-none absolute bottom-4 right-28 hidden h-14 w-14 text-white/20 motion-safe:animate-float-slow lg:block" />

        <div className="relative max-w-xl">
          <p className="text-sm font-medium text-violet-100">
            Welcome{firstName ? `, ${firstName}` : ''} 👋
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Create a new lesson pack
          </h1>
          <p className="mt-2 text-sm text-violet-100 sm:text-base">
            A full Biology pack — plan, slides, differentiated worksheets,
            assessment and teacher notes — generated in minutes.
          </p>
          <Link
            href="/dashboard/generate"
            className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 font-display text-base font-bold text-violet-700 shadow-md transition-transform hover:scale-[1.02]"
          >
            <SparkleIcon className="h-4 w-4" /> Generate a lesson pack
          </Link>
        </div>
      </section>

      {/* Usage / trial status */}
      {usage ? <UsageCard usage={usage} /> : null}

      {/* Quick templates */}
      <QuickTemplates />

      {/* Recent packs */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Your lesson packs
          </h2>
          {recentPacks.length > 0 ? (
            <Link href="/dashboard/generate" className="text-sm font-semibold text-violet-700 hover:underline dark:text-violet-300">
              + New pack
            </Link>
          ) : null}
        </div>

        {recentPacks.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Mobile: rich cards */}
            <div className="grid gap-3 sm:grid-cols-2 lg:hidden">
              {recentPacks.map((pack) => (
                <PackTile key={pack.id} pack={pack} />
              ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm lg:block dark:border-zinc-800 dark:bg-zinc-900">
              <table className="w-full text-sm">
                <thead className="border-b border-zinc-200 bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-400">
                  <tr>
                    <th className="px-5 py-3 font-medium">Topic</th>
                    <th className="px-5 py-3 font-medium">Level</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {recentPacks.map((pack) => (
                    <tr key={pack.id} className="transition-colors hover:bg-violet-50/40 dark:hover:bg-zinc-800/40">
                      <td className="px-5 py-3">
                        <Link
                          href={`/dashboard/packs/${pack.id}`}
                          className="font-semibold text-violet-700 hover:underline dark:text-violet-300"
                        >
                          {pack.topic}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-zinc-600 dark:text-zinc-300">
                        {pack.course_level} · {pack.ability_level}
                      </td>
                      <td className="px-5 py-3">
                        <ReviewBadge status={pack.review_status} />
                      </td>
                      <td className="px-5 py-3 text-zinc-500 dark:text-zinc-400">
                        {pack.created_at
                          ? new Date(pack.created_at).toLocaleDateString('en-GB')
                          : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function PackTile({
  pack,
}: {
  pack: Awaited<ReturnType<typeof listPacks>>[number];
}) {
  return (
    <Link
      href={`/dashboard/packs/${pack.id}`}
      className="group block rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-violet-800"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-300">
          <CellIcon className="h-5 w-5" />
        </span>
        <ReviewBadge status={pack.review_status} />
      </div>
      <p className="mt-3 font-display text-[15px] font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{pack.topic}</p>
      <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
        {pack.course_level} · {pack.ability_level}
      </p>
      <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
        {pack.created_at ? new Date(pack.created_at).toLocaleDateString('en-GB') : ''}
      </p>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-violet-200 bg-violet-50/40 px-6 py-14 text-center dark:border-zinc-700 dark:bg-zinc-900/50">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm ring-1 ring-inset ring-violet-100 dark:bg-zinc-800 dark:text-violet-300 dark:ring-zinc-700">
        <CellIcon className="h-7 w-7" />
      </div>
      <p className="mt-4 text-base font-bold text-zinc-900 dark:text-zinc-50">No packs yet</p>
      <p className="mt-1 mb-5 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
        Create your first lesson pack and it&apos;ll appear here — ready to review,
        teach and (soon) export as PDF and PowerPoint.
      </p>
      <Link
        href="/dashboard/generate"
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 font-display text-base font-bold text-white shadow-lg shadow-violet-500/25 transition-transform hover:scale-[1.02]"
      >
        <SparkleIcon className="h-4 w-4" /> Generate your first pack
      </Link>
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
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Unlimited lesson packs.</p>
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
            {usage.remaining} of {usage.limit} free packs remaining.
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

function ReviewBadge({ status }: { status?: string }) {
  if (status === 'approved') return <Badge color="violet">Approved</Badge>;
  if (status === 'needs_review') return <Badge color="amber">Needs review</Badge>;
  return <Badge>Draft</Badge>;
}
