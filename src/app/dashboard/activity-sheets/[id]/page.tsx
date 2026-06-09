import { notFound } from 'next/navigation';
import { requireProfile } from '@/lib/auth';
import { getActivitySheet } from '@/lib/activitySheets';
import { ActivitySheetView } from './ActivitySheetView';

export const metadata = { title: 'Activity sheet' };

export default async function ActivitySheetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireProfile();
  const { id } = await params;

  const sheet = await getActivitySheet(id);
  if (!sheet) notFound();
  if (!sheet.content) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm text-zinc-600 dark:text-zinc-300">This activity sheet has no content yet.</p>
      </div>
    );
  }

  return <ActivitySheetView sheet={sheet} content={sheet.content} />;
}
