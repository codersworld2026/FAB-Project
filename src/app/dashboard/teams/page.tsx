import { requireProfile } from '@/lib/auth';
import { SectionHeader } from '@/components/app/SectionHeader';
import { Avatar } from '@/components/app/Avatar';
import { UsersIcon } from '@/components/app/icons';

export const metadata = { title: 'Teams' };

const ROLES = [
  { role: 'Owner', perms: 'Full control, billing, manage roles, delete team' },
  { role: 'Admin', perms: 'Invite members, manage resources and settings' },
  { role: 'Editor', perms: 'Create and edit shared resources' },
  { role: 'Viewer', perms: 'View and duplicate shared resources' },
];

const FEATURES = [
  'Invite Biology colleagues by email',
  'Share lessons, series, activity sheets and assessments',
  'Duplicate a shared resource into your own',
  'See who last edited a resource',
  'Role-based permissions, enforced server-side',
  'Recent team activity',
];

export default async function TeamsPage() {
  const profile = await requireProfile();

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Teams"
        subtitle="Collaborate with Biology colleagues and share resources."
        badge="Coming soon"
      />

      {/* Current workspace */}
      <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <Avatar name={profile.full_name} email={profile.email} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-[15px] font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {profile.full_name?.trim() || 'My workspace'}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Personal · just you</p>
        </div>
      </div>

      {/* Coming soon */}
      <div className="overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col items-center bg-lavender px-6 py-10 text-center dark:bg-zinc-900">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm ring-1 ring-inset ring-violet-100 dark:bg-zinc-800 dark:text-violet-300 dark:ring-zinc-700">
            <UsersIcon className="h-8 w-8" />
          </div>
          <h2 className="mt-5 text-lg font-bold text-zinc-900 dark:text-zinc-50">
            Team collaboration is coming soon
          </h2>
          <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            Create a team and collaborate with Biology colleagues. We&apos;re
            building this with secure, server-side permissions.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              disabled
              className="inline-flex min-h-12 cursor-not-allowed items-center justify-center gap-2 rounded-2xl bg-violet-600/50 px-6 font-display text-sm font-bold text-white"
            >
              Create a team
            </button>
            <button
              type="button"
              disabled
              className="inline-flex min-h-12 cursor-not-allowed items-center justify-center gap-2 rounded-2xl border border-violet-200 px-6 font-display text-sm font-bold text-violet-400 dark:border-violet-900"
            >
              Invite a colleague
            </button>
          </div>
        </div>

        <div className="grid gap-6 px-6 py-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              What you&apos;ll be able to do
            </p>
            <ul className="mt-3 space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Roles
            </p>
            <ul className="mt-3 space-y-2.5">
              {ROLES.map(({ role, perms }) => (
                <li key={role} className="text-sm">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-50">{role}</span>
                  <span className="block text-xs text-zinc-500 dark:text-zinc-400">{perms}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
