import Link from 'next/link';
import { requireProfile } from '@/lib/auth';
import { getUsageSummary } from '@/lib/subscription';
import { GeneratorForm } from './GeneratorForm';
import { Alert } from '@/components/ui';
import { APP_CONFIG } from '@/lib/config';

export const metadata = { title: 'New lesson' };

export default async function GeneratePage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string; topic?: string; notes?: string; qual?: string }>;
}) {
  await requireProfile();
  const usage = await getUsageSummary();
  const blocked = usage ? !usage.canGenerate : false;
  const sp = await searchParams;

  // Prefill from query params — validated against the supported scope.
  const courseLevel = APP_CONFIG.yearGroups.includes(
    sp.level as (typeof APP_CONFIG.yearGroups)[number],
  )
    ? sp.level
    : undefined;
  const qualificationId = APP_CONFIG.qualifications.some((q) => q.id === sp.qual)
    ? sp.qual
    : undefined;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm font-medium text-violet-700 hover:underline dark:text-violet-300"
        >
          ← Back to dashboard
        </Link>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          New Biology lesson
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          A few quick steps. We&apos;ll generate a complete, original Edexcel
          Biology lesson tailored to your class.
        </p>
      </div>

      {usage && !usage.isSubscribed ? (
        <Alert variant={blocked ? 'warning' : 'info'}>
          {blocked
            ? `You've used all ${usage.limit} free lessons. Subscribe from your account to continue.`
            : `Free trial — ${usage.remaining} of ${usage.limit} lessons remaining.`}
        </Alert>
      ) : null}

      {blocked ? (
        <div className="flex flex-col items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            Subscribe to keep generating Biology lessons.
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
            qualificationId,
            courseLevel,
            topic: sp.topic,
            notes: sp.notes,
          }}
        />
      )}
    </div>
  );
}
