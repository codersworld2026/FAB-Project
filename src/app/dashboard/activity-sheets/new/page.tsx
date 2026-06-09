import Link from 'next/link';
import { requireProfile } from '@/lib/auth';
import { getUsageSummary } from '@/lib/subscription';
import { Alert } from '@/components/ui';
import { SectionHeader } from '@/components/app/SectionHeader';
import { ActivitySheetForm } from './ActivitySheetForm';

export const metadata = { title: 'New activity sheet' };

export default async function NewActivitySheetPage() {
  await requireProfile();
  const usage = await getUsageSummary();
  const blocked = usage ? !usage.canGenerate : false;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <SectionHeader
        backHref="/dashboard/activity-sheets"
        title="New activity sheet"
        subtitle="Create a print-ready Edexcel Biology activity — with student and teacher versions."
      />

      {usage && !usage.isSubscribed ? (
        <Alert variant={blocked ? 'warning' : 'info'}>
          {blocked
            ? `You've used all ${usage.limit} free generations. Subscribe from your account to continue.`
            : `Free trial — ${usage.remaining} of ${usage.limit} generations remaining.`}
        </Alert>
      ) : null}

      {blocked ? (
        <div className="flex flex-col items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-600 dark:text-zinc-300">Subscribe to keep creating resources.</p>
          <Link href="/dashboard/account" className="inline-flex h-11 items-center rounded-xl bg-violet-700 px-5 text-sm font-semibold text-white hover:bg-violet-800">
            Go to subscription
          </Link>
        </div>
      ) : (
        <ActivitySheetForm />
      )}
    </div>
  );
}
