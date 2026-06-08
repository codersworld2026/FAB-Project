import { clsx } from './clsx';

/** Minimal, dependency-light UI primitives shared across the app. */

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}) {
  const variants: Record<string, string> = {
    // violet-700 on white gives WCAG-AA contrast for the label.
    primary:
      'bg-violet-700 text-white shadow-sm hover:bg-violet-800 disabled:bg-violet-700/50',
    secondary:
      'bg-white text-zinc-800 border border-zinc-300 shadow-sm hover:bg-zinc-50 hover:border-zinc-400',
    ghost: 'bg-transparent text-zinc-700 hover:bg-zinc-100',
    danger: 'bg-red-600 text-white shadow-sm hover:bg-red-700',
  };
  const sizes: Record<string, string> = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
  };
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-80',
        sizes[size],
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={clsx(
        'h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 shadow-sm transition-colors placeholder:text-zinc-400 hover:border-zinc-400 focus:border-violet-500 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500',
        className,
      )}
      {...props}
    />
  );
}

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={clsx(
        'h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 shadow-sm transition-colors hover:border-zinc-400 focus:border-violet-500',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={clsx(
        'w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm leading-relaxed text-zinc-900 shadow-sm transition-colors placeholder:text-zinc-400 hover:border-zinc-400 focus:border-violet-500',
        className,
      )}
      {...props}
    />
  );
}

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={clsx('mb-1.5 block text-sm font-medium text-zinc-700', className)}
      {...props}
    />
  );
}

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
      {hint && !error ? (
        <p className="mt-1.5 text-xs text-zinc-500">{hint}</p>
      ) : null}
      {error ? <p className="mt-1.5 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        'rounded-xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6',
        className,
      )}
      {...props}
    />
  );
}

export function Alert({
  variant = 'info',
  children,
}: {
  variant?: 'info' | 'success' | 'error' | 'warning';
  children: React.ReactNode;
}) {
  const variants: Record<string, string> = {
    info: 'bg-blue-50 text-blue-900 border-blue-200',
    success: 'bg-violet-50 text-violet-900 border-violet-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-amber-50 text-amber-900 border-amber-200',
  };
  return (
    <div
      role="alert"
      className={clsx(
        'rounded-lg border px-4 py-3 text-sm leading-relaxed',
        variants[variant],
      )}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
  color = 'zinc',
}: {
  children: React.ReactNode;
  color?: 'zinc' | 'amber' | 'violet' | 'blue';
}) {
  const colors: Record<string, string> = {
    zinc: 'bg-zinc-100 text-zinc-700 ring-zinc-200',
    amber: 'bg-amber-50 text-amber-800 ring-amber-200',
    violet: 'bg-violet-50 text-violet-800 ring-violet-200',
    blue: 'bg-blue-50 text-blue-800 ring-blue-200',
  };
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        colors[color],
      )}
    >
      {children}
    </span>
  );
}

/** Eyebrow/section label — small uppercase heading. */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
      {children}
    </p>
  );
}

/** Standard page header (title + optional description + actions). */
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          {title}
        </h1>
        {description ? (
          <p className="text-sm text-zinc-500">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 gap-2">{actions}</div> : null}
    </div>
  );
}
