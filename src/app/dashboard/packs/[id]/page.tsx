import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireProfile } from '@/lib/auth';
import { getPack } from '@/lib/packs';
import { Badge } from '@/components/ui';
import { CellIcon } from '@/components/science/ScienceIcons';
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
          className="inline-flex items-center gap-1 text-sm font-medium text-violet-700 hover:underline dark:text-violet-300"
        >
          ← Back to dashboard
        </Link>

        <div className="mt-3 overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-5 shadow-sm sm:p-6 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
          <div className="flex items-start gap-4">
            <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-sm sm:flex">
              <CellIcon className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  {pack.topic}
                </h1>
                <ReviewBadge status={pack.review_status} />
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {chips.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-zinc-600 ring-1 ring-inset ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generated content (tabbed) */}
      {pack.content ? (
        <PackContentView
          content={pack.content}
          meta={{
            learningObjectives: pack.learning_objectives,
            teacherNotesInput: pack.teacher_notes_input,
            createdAt: pack.created_at,
          }}
        />
      ) : (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            This pack has no generated content yet.
          </p>
        </div>
      )}
    </div>
  );
}

function ReviewBadge({ status }: { status: string }) {
  if (status === 'approved') return <Badge color="violet">Approved</Badge>;
  if (status === 'needs_review') return <Badge color="amber">Needs review</Badge>;
  return <Badge>Draft</Badge>;
}
