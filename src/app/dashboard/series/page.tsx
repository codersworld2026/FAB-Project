import { requireProfile } from '@/lib/auth';
import { SectionHeader } from '@/components/app/SectionHeader';
import { ComingSoon } from '@/components/app/ComingSoon';
import { SeriesIcon } from '@/components/app/icons';

export const metadata = { title: 'Lesson series' };

export default async function SeriesPage() {
  await requireProfile();

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Lesson series"
        subtitle="Plan a connected sequence of Edexcel Biology lessons for a whole topic."
        badge="Coming soon"
      />
      <ComingSoon
        icon={<SeriesIcon className="h-8 w-8" />}
        title="No lesson series yet"
        description="Build an ordered sequence for your next Biology topic — with recaps, quizzes and an end-of-topic assessment."
        features={[
          'Ordered lessons with objectives and summaries',
          'Recaps and retrieval between lessons',
          'Built-in quizzes and end-of-topic assessment',
          'Reorder, rename, duplicate or regenerate one lesson',
          'Assign lessons to colleagues',
          'Share the whole series with your team',
        ]}
      />
    </div>
  );
}
