import { clsx } from '@/components/clsx';

/** Derive up to two initials from a name or, failing that, an email. */
export function initialsFrom(name?: string | null, email?: string | null): string {
  const source = (name ?? '').trim() || (email ?? '').split('@')[0] || '';
  const parts = source.split(/[\s._-]+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase();
  return (parts[0]!.charAt(0) + parts[parts.length - 1]!.charAt(0)).toUpperCase();
}

/** Brand avatar — initials on a violet gradient (consistent, not random). */
export function Avatar({
  name,
  email,
  size = 'md',
  className,
}: {
  name?: string | null;
  email?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-lg',
  } as const;
  return (
    <span
      aria-hidden="true"
      className={clsx(
        'inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 font-display font-bold text-white shadow-sm',
        sizes[size],
        className,
      )}
    >
      {initialsFrom(name, email)}
    </span>
  );
}
