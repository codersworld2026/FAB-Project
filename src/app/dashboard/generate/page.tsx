import Link from 'next/link';
import { requireProfile } from '@/lib/auth';
import { getUsageSummary } from '@/lib/subscription';
import { GeneratorForm } from './GeneratorForm';
import { Alert, Button, Card } from '@/components/ui';

export const metadata = { title: 'New lesson pack' };

export default async function GeneratePage() {
  await requireProfile();
  const usage = await getUsageSummary();
  const blocked = usage ? !usage.canGenerate : false;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href="/dashboard"
          className="text-sm font-medium text-emerald-700 hover:underline"
        >
          ← Back to dashboard
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">
          New lesson pack
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Fill in the details and we&apos;ll generate a complete, original
          lesson pack.
        </p>
      </div>

      {usage && !usage.isSubscribed ? (
        <Alert variant={blocked ? 'warning' : 'info'}>
          {blocked
            ? `You've used all ${usage.limit} free packs.`
            : `Free trial — ${usage.remaining} of ${usage.limit} packs remaining.`}
        </Alert>
      ) : null}

      {blocked ? (
        <Card className="flex flex-col items-start gap-3">
          <p className="text-sm text-zinc-600">
            Subscribe to keep generating lesson packs.
          </p>
          <Link href="/dashboard/account">
            <Button>Go to subscription</Button>
          </Link>
        </Card>
      ) : (
        <Card>
          <GeneratorForm />
        </Card>
      )}
    </div>
  );
}
