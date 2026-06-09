import { requireProfile } from '@/lib/auth';
import { SectionHeader } from '@/components/app/SectionHeader';
import { SupportForm } from '@/components/app/SupportForm';
import { SparkleIcon } from '@/components/science/ScienceIcons';

export const metadata = { title: 'Support' };

export default async function SupportPage() {
  const profile = await requireProfile();

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Support"
        subtitle="Get help with the platform or your Edexcel Biology teaching."
      />

      {/* Assistant teaser — clearly not yet live (no fake AI). */}
      <div className="flex items-start gap-3 rounded-2xl border border-violet-100 bg-lavender p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white">
          <SparkleIcon className="h-5 w-5" />
        </span>
        <div>
          <p className="font-display text-sm font-bold text-zinc-900 dark:text-zinc-50">
            Biology assistant — coming soon
          </p>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            An in-app assistant for platform help and Edexcel GCSE / International
            GCSE Biology questions is on the way. For now, send us a message below
            and the team will help.
          </p>
        </div>
      </div>

      <SupportForm defaultEmail={profile.email} />

      <p className="text-xs leading-relaxed text-zinc-400 dark:text-zinc-500">
        AI features, when available, may contain errors — review teaching and
        assessment content before classroom use.
      </p>
    </div>
  );
}
