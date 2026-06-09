import Link from 'next/link';
import { requireProfile } from '@/lib/auth';
import { listAssessments } from '@/lib/assessments';
import { SectionHeader } from '@/components/app/SectionHeader';
import { EmptyState } from '@/components/app/EmptyState';
import { ResourceCard, type ResourceStatus } from '@/components/app/ResourceCard';
import { AssessmentIcon, PlusIcon } from '@/components/app/icons';

export const metadata = { title: 'Assessments' };

export default async function AssessmentsPage() {
  await requireProfile();
  const assessments = await listAssessments();

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Assessments"
        subtitle="Edexcel Biology quizzes, tests and exam-style questions — with a mark scheme."
        action={
          <Link
            href="/dashboard/assessments/new"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 font-display text-sm font-bold text-white shadow-sm shadow-violet-500/25 transition-transform hover:scale-[1.02]"
          >
            <PlusIcon className="h-4 w-4" /> Create new
          </Link>
        }
      />

      {assessments.length === 0 ? (
        <EmptyState
          icon={<AssessmentIcon className="h-8 w-8" />}
          title="No assessments yet"
          description="Create your first Edexcel Biology quiz or test — with a question paper and a teacher mark scheme."
          actionLabel="Create assessment"
          actionHref="/dashboard/assessments/new"
        />
      ) : (
        <div className="grid gap-3">
          {assessments.map((a) =>
            a.id ? (
              <ResourceCard
                key={a.id}
                href={`/dashboard/assessments/${a.id}`}
                icon={<AssessmentIcon className="h-5 w-5" />}
                title={a.title ?? 'Untitled assessment'}
                meta={[
                  a.assessment_type,
                  a.course_level,
                  a.question_count ? `${a.question_count} questions` : undefined,
                ].filter(Boolean) as string[]}
                status={a.review_status as ResourceStatus | undefined}
              />
            ) : null,
          )}
        </div>
      )}
    </div>
  );
}
