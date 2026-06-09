import { requireProfile } from '@/lib/auth';
import { SectionHeader } from '@/components/app/SectionHeader';
import { ComingSoon } from '@/components/app/ComingSoon';
import { AssessmentIcon } from '@/components/app/icons';

export const metadata = { title: 'Assessments' };

export default async function AssessmentsPage() {
  await requireProfile();

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Assessments"
        subtitle="Create quizzes, knowledge checks and exam-style question sets."
        badge="Coming soon"
      />
      <ComingSoon
        icon={<AssessmentIcon className="h-8 w-8" />}
        title="No assessments yet"
        description="Generate Edexcel Biology quizzes, end-of-topic tests and exam-style questions — with a mark scheme."
        features={[
          'Starter quizzes, knowledge checks and exit tickets',
          'End-of-topic tests and exam-style question sets',
          'Multiple choice, short and extended response',
          'Data analysis and practical-method questions',
          'Mark scheme and model answers',
          'Designed to support Edexcel specification teaching',
        ]}
      />
    </div>
  );
}
