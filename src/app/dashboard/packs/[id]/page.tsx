import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireProfile } from '@/lib/auth';
import { getPack } from '@/lib/packs';
import { Badge, Card } from '@/components/ui';
import { PackContentView } from './PackContentView';

export const metadata = { title: 'Lesson pack' };

export default async function PackDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireProfile();
  const { id } = await params;

  const pack = await getPack(id);
  if (!pack) notFound();

  const chips = [
    pack.subject,
    pack.exam_board,
    pack.course_level,
    pack.ability_level,
    pack.lesson_length,
  ].filter(Boolean) as string[];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700 hover:underline"
        >
          ← Back to dashboard
        </Link>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            {pack.topic}
          </h1>
          <ReviewBadge status={pack.review_status} />
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {chips.map((c) => (
            <span
              key={c}
              className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600"
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Downloads — primary action, kept near the top */}
      <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-zinc-900">Download pack</p>
          <p className="text-sm text-zinc-500">
            PDF and PowerPoint exports arrive in Milestone 5.
          </p>
        </div>
        <div className="flex gap-2">
          <DisabledDownload>PDF</DisabledDownload>
          <DisabledDownload>PowerPoint</DisabledDownload>
        </div>
      </Card>

      {/* Lesson inputs */}
      <Card className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Lesson details
        </h2>
        <dl className="grid gap-4 sm:grid-cols-2">
          <Detail label="Learning objectives" value={pack.learning_objectives} />
          <Detail label="Teacher notes" value={pack.teacher_notes_input} />
          <Detail
            label="Created"
            value={new Date(pack.created_at).toLocaleString('en-GB')}
          />
        </dl>
      </Card>

      {/* Generated content */}
      {pack.content ? (
        <PackContentView content={pack.content} />
      ) : (
        <Card>
          <p className="text-sm text-zinc-600">
            This pack has no generated content yet.
          </p>
        </Card>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm text-zinc-800">{value || '—'}</dd>
    </div>
  );
}

function DisabledDownload({ children }: { children: React.ReactNode }) {
  return (
    <button
      disabled
      title="Available in Milestone 5"
      className="inline-flex h-10 cursor-not-allowed items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 px-4 text-sm font-medium text-zinc-400"
    >
      {children}
    </button>
  );
}

function ReviewBadge({ status }: { status: string }) {
  if (status === 'approved') return <Badge color="emerald">Approved</Badge>;
  if (status === 'needs_review') return <Badge color="amber">Needs review</Badge>;
  return <Badge>Draft</Badge>;
}
