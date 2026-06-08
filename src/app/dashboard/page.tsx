import Link from 'next/link';
import { requireProfile } from '@/lib/auth';
import { getUsageSummary } from '@/lib/subscription';
import { listPacks } from '@/lib/packs';
import { Badge, Button, Card, PageHeader } from '@/components/ui';

export const metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const profile = await requireProfile();
  const usage = await getUsageSummary();
  const recentPacks = await listPacks();
  const firstName = profile.full_name?.split(' ')[0];

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome${firstName ? `, ${firstName}` : ''}`}
        description="Generate and manage your Biology lesson packs."
        actions={
          <Link href="/dashboard/generate">
            <Button>New lesson pack</Button>
          </Link>
        }
      />

      {/* Trial / subscription status */}
      {usage ? <UsageCard usage={usage} /> : null}

      {/* Recent packs */}
      <section>
        <h2 className="mb-3 text-lg font-semibold tracking-tight text-zinc-900">
          Your lesson packs
        </h2>

        {recentPacks.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-14 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-100">
              <DocIcon />
            </div>
            <p className="mt-4 text-base font-semibold text-zinc-900">
              No packs yet
            </p>
            <p className="mt-1 mb-5 max-w-sm text-sm text-zinc-500">
              Create your first lesson pack and it will appear here, ready to
              download as PDF and PowerPoint.
            </p>
            <Link href="/dashboard/generate">
              <Button>Generate your first pack</Button>
            </Link>
          </Card>
        ) : (
          <>
            {/* Mobile: cards */}
            <div className="space-y-3 md:hidden">
              {recentPacks.map((pack) => (
                <Link
                  key={pack.id}
                  href={`/dashboard/packs/${pack.id}`}
                  className="block rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-colors hover:border-zinc-300"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-medium text-zinc-900">
                      {pack.topic}
                    </span>
                    <ReviewBadge status={pack.review_status} />
                  </div>
                  <p className="mt-1 text-sm text-zinc-500">
                    {pack.course_level} · {pack.ability_level}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {pack.created_at
                      ? new Date(pack.created_at).toLocaleDateString('en-GB')
                      : ''}
                  </p>
                </Link>
              ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm md:block">
              <table className="w-full text-sm">
                <thead className="border-b border-zinc-200 bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500">
                  <tr>
                    <th className="px-5 py-3 font-medium">Topic</th>
                    <th className="px-5 py-3 font-medium">Level</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {recentPacks.map((pack) => (
                    <tr key={pack.id} className="hover:bg-zinc-50">
                      <td className="px-5 py-3">
                        <Link
                          href={`/dashboard/packs/${pack.id}`}
                          className="font-medium text-violet-700 hover:underline"
                        >
                          {pack.topic}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-zinc-600">
                        {pack.course_level} · {pack.ability_level}
                      </td>
                      <td className="px-5 py-3">
                        <ReviewBadge status={pack.review_status} />
                      </td>
                      <td className="px-5 py-3 text-zinc-500">
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

function UsageCard({
  usage,
}: {
  usage: NonNullable<Awaited<ReturnType<typeof getUsageSummary>>>;
}) {
  if (usage.isSubscribed) {
    return (
      <Card className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-zinc-900">
            Subscription active
          </p>
          <p className="text-sm text-zinc-500">Unlimited lesson packs.</p>
        </div>
        <Badge color="violet">Subscribed</Badge>
      </Card>
    );
  }

  const pct = Math.min(100, Math.round((usage.used / usage.limit) * 100));
  const exhausted = usage.remaining === 0;

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-zinc-900">Free trial</p>
          <p className="text-sm text-zinc-500">
            {usage.remaining} of {usage.limit} free packs remaining.
          </p>
        </div>
        {exhausted ? (
          <Link href="/dashboard/account">
            <Button size="sm">Subscribe to continue</Button>
          </Link>
        ) : (
          <Badge color="amber">{usage.remaining} left</Badge>
        )}
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
        <div
          className={exhausted ? 'h-full bg-amber-500' : 'h-full bg-violet-600'}
          style={{ width: `${pct}%` }}
        />
      </div>
    </Card>
  );
}

function ReviewBadge({ status }: { status?: string }) {
  if (status === 'approved') return <Badge color="violet">Approved</Badge>;
  if (status === 'needs_review') return <Badge color="amber">Needs review</Badge>;
  return <Badge>Draft</Badge>;
}

function DocIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 3h7l5 5v13a0 0 0 0 1 0 0H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M14 3v5h5M9 13h6M9 16h6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
