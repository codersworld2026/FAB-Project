import { SupportIcon } from '@/components/app/icons';

/**
 * Floating help button on the public site. The full AI assistant is in progress
 * (Phase 6) — for now this jumps to the assistant section, which explains it and
 * routes to real support. No fake chat.
 */
export function SupportFab() {
  return (
    <a
      href="#assistant"
      aria-label="Biology assistant — coming soon"
      className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-xl shadow-violet-500/30 transition-transform hover:scale-105 mb-[env(safe-area-inset-bottom)]"
    >
      <SupportIcon className="h-6 w-6" />
    </a>
  );
}
