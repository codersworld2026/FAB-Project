import { requireProfile } from '@/lib/auth';
import { SectionHeader } from '@/components/app/SectionHeader';
import { ComingSoon } from '@/components/app/ComingSoon';
import { ActivityIcon } from '@/components/app/icons';

export const metadata = { title: 'Activity sheets' };

export default async function ActivitySheetsPage() {
  await requireProfile();

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Activity sheets"
        subtitle="Create print-ready Biology activities for lessons, revision or homework."
        badge="Coming soon"
      />
      <ComingSoon
        icon={<ActivityIcon className="h-8 w-8" />}
        title="No activity sheets yet"
        description="Generate printable Edexcel Biology activities — with a student version and a teacher answer version."
        features={[
          'Labelling, matching and gap-fill activities',
          'Retrieval questions and keyword tasks',
          'Data interpretation and practical-method sheets',
          'Exam-question practice and revision checklists',
          'Student version + teacher answer version',
          'Print preview and PDF export',
        ]}
      />
    </div>
  );
}
