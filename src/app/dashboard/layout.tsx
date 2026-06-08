import { requireProfile } from '@/lib/auth';
import { isPreviewMode } from '@/lib/preview';
import { DashboardNav } from '@/components/DashboardNav';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireProfile();

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50/50 to-zinc-50">
      {isPreviewMode() ? (
        <div className="bg-amber-100 px-4 py-2 text-center text-xs font-medium text-amber-900">
          Preview mode — sample data shown (no login required). Real auth and
          data activate automatically once Supabase keys are added.
        </div>
      ) : null}
      <DashboardNav email={profile.email} isOwner={profile.role === 'owner'} />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
