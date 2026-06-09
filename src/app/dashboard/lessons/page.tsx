import Link from 'next/link';
import { requireProfile } from '@/lib/auth';
import { listPacks } from '@/lib/packs';
import { SectionHeader } from '@/components/app/SectionHeader';
import { EmptyState } from '@/components/app/EmptyState';
import { ResourceCard, type ResourceStatus } from '@/components/app/ResourceCard';
import { QuickExportButton } from '@/components/export/QuickExportButton';
import { LessonIcon, PlusIcon } from '@/components/app/icons';

export const metadata = { title: 'Lessons' };

export default async function LessonsPage() {
  await requireProfile();
  const packs = await listPacks();

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Lessons"
        subtitle="Your saved Edexcel Biology lessons — review, teach and export."
        action={
          <Link
            href="/dashboard/generate"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 font-display text-sm font-bold text-white shadow-sm shadow-violet-500/25 transition-transform hover:scale-[1.02]"
          >
            <PlusIcon className="h-4 w-4" /> New lesson
          </Link>
        }
      />

      {packs.length === 0 ? (
        <EmptyState
          icon={<LessonIcon className="h-8 w-8" />}
          title="No lessons yet"
          description="Create your first Edexcel Biology lesson and it'll appear here."
          actionLabel="Create a Biology lesson"
          actionHref="/dashboard/generate"
        />
      ) : (
        <div className="grid gap-3">
          {packs.map((pack) =>
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
                action={
                  pack.topic ? <QuickExportButton packId={pack.id} title={pack.topic} /> : undefined
                }
              />
            ) : null,
          )}
        </div>
      )}
    </div>
  );
}
