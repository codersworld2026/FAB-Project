import { requireProfile } from '@/lib/auth';
import { getUsageSummary } from '@/lib/subscription';
import { APP_CONFIG } from '@/lib/config';
import { Badge, Card, Eyebrow, PageHeader } from '@/components/ui';

export const metadata = { title: 'Account' };

export default async function AccountPage() {
  const profile = await requireProfile();
  const usage = await getUsageSummary();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="Account" description="Your profile and subscription." />

      <Card className="space-y-4">
        <Eyebrow>Profile</Eyebrow>
        <dl className="divide-y divide-zinc-100 dark:divide-zinc-800">
          <Row label="Name" value={profile.full_name || '—'} />
          <Row label="Email" value={profile.email} />
          <Row label="School" value={profile.school || '—'} />
          <Row
            label="Role"
            value={profile.role === 'owner' ? 'Owner / Admin' : 'Teacher'}
          />
        </dl>
      </Card>

      <Card className="space-y-4">
        <Eyebrow>Subscription</Eyebrow>
        {usage?.isSubscribed ? (
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-700 dark:text-zinc-300">Active subscription</span>
            <Badge color="violet">Subscribed</Badge>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-700 dark:text-zinc-300">Free trial</span>
              <Badge color="amber">
                {usage ? `${usage.remaining}/${usage.limit} left` : 'Trial'}
              </Badge>
            </div>
            {usage ? (
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div
                  className="h-full bg-violet-600"
                  style={{
                    width: `${Math.min(100, Math.round((usage.used / usage.limit) * 100))}%`,
                  }}
                />
              </div>
            ) : null}
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Stripe checkout is added in a later milestone. After your free
              packs are used, you&apos;ll be able to subscribe here.
            </p>
          </div>
        )}
      </Card>

      <Card className="space-y-3">
        <Eyebrow>Support</Eyebrow>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Need help? Email{' '}
          <a
            href={`mailto:${APP_CONFIG.supportEmail}`}
            className="font-medium text-violet-700 hover:underline dark:text-violet-300"
          >
            {APP_CONFIG.supportEmail}
          </a>
          .
        </p>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
      <dt className="text-sm text-zinc-500 dark:text-zinc-400">{label}</dt>
      <dd className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{value}</dd>
    </div>
  );
}
