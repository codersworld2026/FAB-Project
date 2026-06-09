import { clsx } from '@/components/clsx';

/**
 * Sticky bottom action bar — blurred surface that stays above the iOS home
 * indicator (`.sticky-action-pad`). On desktop it sits inline (non-sticky) when
 * `inline` is set. Children are typically Back / Continue / Generate buttons.
 */
export function StickyActionBar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'sticky bottom-0 z-20 -mx-4 flex items-center gap-3 border-t border-zinc-200 bg-white/90 px-4 pt-3 backdrop-blur sticky-action-pad sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none dark:border-zinc-800 dark:bg-zinc-950/90 sm:dark:bg-transparent',
        className,
      )}
    >
      {children}
    </div>
  );
}
