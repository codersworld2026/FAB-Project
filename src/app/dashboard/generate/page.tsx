import Link from 'next/link';
import { requireProfile } from '@/lib/auth';
import { getUsageSummary } from '@/lib/subscription';
import { GeneratorForm } from './GeneratorForm';
import { Alert } from '@/components/ui';
import { APP_CONFIG } from '@/lib/config';

export const metadata = { title: 'New lesson pack' };

export default async function GeneratePage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string; topic?: string; notes?: string }>;
}) {
  await requireProfile();
  const usage = await getUsageSummary();
  const blocked = usage ? !usage.canGenerate : false;
  const sp = await searchParams;

  // Template prefill (from dashboard quick-start) — validated against scope.
  const courseLevel = APP_CONFIG.courseLevels.includes(
    sp.level as (typeof APP_CONFIG.courseLevels)[number],
  )
    ? sp.level
    : undefined;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm font-medium text-violet-700 hover:underline"
        >
          ← Back to dashboard
        </Link>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
          New lesson pack
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Four quick steps. We&apos;ll generate a complete, original Biology pack
          tailored to your class.
        </p>
      </div>

      {usage && !usage.isSubscribed ? (
        <Alert variant={blocked ? 'warning' : 'info'}>
          {blocked
            ? `You've used all ${usage.limit} free packs. Subscribe from your account to continue.`
            : `Free trial — ${usage.remaining} of ${usage.limit} packs remaining.`}
        </Alert>
      ) : null}

      {blocked ? (
        <div className="flex flex-col items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-zinc-600">
            Subscribe to keep generating lesson packs.
          </p>
          <Link
            href="/dashboard/account"
            className="inline-flex h-11 items-center rounded-xl bg-violet-700 px-5 text-sm font-semibold text-white hover:bg-violet-800"
          >
            Go to subscription
          </Link>
        </div>
      ) : (
        <GeneratorForm
          defaults={{
            courseLevel,
            topic: sp.topic,
            notes: sp.notes,
          }}
        />
      )}
    </div>
  );
}
