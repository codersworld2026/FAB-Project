/**
 * Science line-art icon set + a decorative floating "science field".
 * All icons inherit `currentColor` and accept a className for sizing.
 * Used across the marketing site and app to give a rich, on-brand science feel.
 */
import { clsx } from '@/components/clsx';

type IconProps = { className?: string };

export function DnaIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M7 3c0 5 10 5 10 10S7 18 7 23M17 3c0 5-10 5-10 10s10 5 10 10"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M8.5 6.5h7M8 9h8M8 15h8M8.5 17.5h7"
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function MoleculeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M12 7.5l-5 3M12 7.5l5 3M7 10.5v4l5 3 5-3v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="6" r="2.4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="5.5" cy="11" r="2.2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="18.5" cy="11" r="2.2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="18" r="2.4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function CellIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" />
      <circle cx="7.5" cy="8" r="1" fill="currentColor" />
      <circle cx="16.5" cy="9" r="1.2" fill="currentColor" />
      <circle cx="15.5" cy="16" r="1" fill="currentColor" />
    </svg>
  );
}

export function AtomIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      <ellipse cx="12" cy="12" rx="10" ry="4.2" stroke="currentColor" strokeWidth="1.4" />
      <ellipse cx="12" cy="12" rx="10" ry="4.2" stroke="currentColor" strokeWidth="1.4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4.2" stroke="currentColor" strokeWidth="1.4" transform="rotate(120 12 12)" />
    </svg>
  );
}

export function FlaskIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M9 3h6M10 3v6.5L5.5 17a2 2 0 0 0 1.8 3h9.4a2 2 0 0 0 1.8-3L14 9.5V3"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 14h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="10" cy="16.5" r="0.9" fill="currentColor" />
      <circle cx="13.5" cy="17.5" r="0.7" fill="currentColor" />
    </svg>
  );
}

export function MicroscopeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M6 21h13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M9 18a7 7 0 0 0 9-6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M11 18H7l1.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="9.4" y="4" width="3.6" height="9" rx="1.8" transform="rotate(20 11 8)" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12.5 13.5l1.8-4.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function SparkleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3z" fill="currentColor" />
    </svg>
  );
}

const FIELD = [
  { Icon: DnaIcon, cls: 'left-[4%] top-[14%] h-12 w-12 text-violet-300/70 motion-safe:animate-float' },
  { Icon: MoleculeIcon, cls: 'right-[6%] top-[10%] h-14 w-14 text-cyan-300/70 motion-safe:animate-float-slow' },
  { Icon: CellIcon, cls: 'left-[10%] bottom-[12%] h-16 w-16 text-fuchsia-300/60 motion-safe:animate-float-slow' },
  { Icon: AtomIcon, cls: 'right-[12%] bottom-[16%] h-12 w-12 text-sky-300/70 motion-safe:animate-float' },
  { Icon: FlaskIcon, cls: 'left-[46%] top-[6%] hidden h-10 w-10 text-rose-300/70 motion-safe:animate-float-slow sm:block' },
];

/** Floating science shapes scattered behind a section (purely decorative). */
export function ScienceField({ className }: IconProps) {
  return (
    <div
      aria-hidden="true"
      className={clsx('pointer-events-none absolute inset-0 -z-10 overflow-hidden', className)}
    >
      {FIELD.map(({ Icon, cls }, i) => (
        <Icon key={i} className={clsx('absolute', cls)} />
      ))}
    </div>
  );
}
