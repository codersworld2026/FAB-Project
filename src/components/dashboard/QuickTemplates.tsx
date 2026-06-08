import Link from 'next/link';
import { CellIcon, AtomIcon, FlaskIcon, MicroscopeIcon } from '@/components/science/ScienceIcons';

/**
 * Quick-start templates. Each links to the generator with prefilled query
 * params (read by the generate page) — all within the locked Biology MVP scope
 * (IGCSE / GCSE / A-Level). New subjects/levels unlock as scope expands.
 */
const TEMPLATES = [
  { label: 'IGCSE Biology', sub: 'Edexcel · Year 10–11', href: '/dashboard/generate?level=IGCSE', Icon: CellIcon, accent: 'text-fuchsia-600 bg-fuchsia-50' },
  { label: 'A-Level Biology', sub: 'Year 12–13', href: '/dashboard/generate?level=A-Level', Icon: AtomIcon, accent: 'text-violet-600 bg-violet-50' },
  { label: 'Revision lesson', sub: 'Recap + exam practice', href: '/dashboard/generate?notes=' + encodeURIComponent('Revision lesson: recap prior learning and focus on exam-style practice.'), Icon: MicroscopeIcon, accent: 'text-cyan-600 bg-cyan-50' },
  { label: 'Practical lesson', sub: 'Method + safety focus', href: '/dashboard/generate?notes=' + encodeURIComponent('Practical-focused lesson: include a required practical with method, results and a risk assessment.'), Icon: FlaskIcon, accent: 'text-emerald-600 bg-emerald-50' },
];

export function QuickTemplates() {
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
        Quick start
      </h2>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {TEMPLATES.map(({ label, sub, href, Icon, accent }) => (
          <Link
            key={label}
            href={href}
            className="group flex flex-col rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md"
          >
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent}`}>
              <Icon className="h-5 w-5" />
            </span>
            <p className="mt-3 text-sm font-bold text-zinc-900">{label}</p>
            <p className="text-xs text-zinc-500">{sub}</p>
            <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-violet-700 opacity-0 transition-opacity group-hover:opacity-100">
              Start <span aria-hidden="true">→</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
