import Link from 'next/link';
import { requireProfile } from '@/lib/auth';
import { listActivitySheets } from '@/lib/activitySheets';
import { SectionHeader } from '@/components/app/SectionHeader';
import { EmptyState } from '@/components/app/EmptyState';
import { ResourceCard, type ResourceStatus } from '@/components/app/ResourceCard';
import { ActivityIcon, PlusIcon } from '@/components/app/icons';

export const metadata = { title: 'Activity sheets' };

export default async function ActivitySheetsPage() {
  await requireProfile();
  const sheets = await listActivitySheets();

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Activity sheets"
        subtitle="Print-ready Biology activities for lessons, revision or homework."
        action={
          <Link
            href="/dashboard/activity-sheets/new"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 font-display text-sm font-bold text-white shadow-sm shadow-violet-500/25 transition-transform hover:scale-[1.02]"
          >
            <PlusIcon className="h-4 w-4" /> Create new
          </Link>
        }
      />

      {sheets.length === 0 ? (
        <EmptyState
          icon={<ActivityIcon className="h-8 w-8" />}
          title="No activity sheets yet"
          description="Create your first Edexcel Biology activity sheet — with a student version and a teacher answer version."
          actionLabel="Create activity sheet"
          actionHref="/dashboard/activity-sheets/new"
        />
      ) : (
        <div className="grid gap-3">
          {sheets.map((s) =>
            s.id ? (
              <ResourceCard
                key={s.id}
                href={`/dashboard/activity-sheets/${s.id}`}
                icon={<ActivityIcon className="h-5 w-5" />}
                title={s.title ?? 'Untitled activity'}
                meta={[s.activity_type, s.course_level, s.difficulty].filter(Boolean) as string[]}
                status={s.review_status as ResourceStatus | undefined}
              />
            ) : null,
          )}
        </div>
      )}
    </div>
  );
}
