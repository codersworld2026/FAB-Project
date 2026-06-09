import { notFound } from 'next/navigation';
import { requireProfile } from '@/lib/auth';
import { getAssessment } from '@/lib/assessments';
import { AssessmentView } from './AssessmentView';

export const metadata = { title: 'Assessment' };

export default async function AssessmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireProfile();
  const { id } = await params;

  const assessment = await getAssessment(id);
  if (!assessment) notFound();
  if (!assessment.content) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm text-zinc-600 dark:text-zinc-300">This assessment has no content yet.</p>
      </div>
    );
  }

  return <AssessmentView assessment={assessment} content={assessment.content} />;
}
