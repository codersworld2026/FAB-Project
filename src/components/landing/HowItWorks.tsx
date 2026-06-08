import Link from 'next/link';
import { StepCard, type StepAccent } from './StepCard';

const STEPS: {
  n: number;
  accent: StepAccent;
  title: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    n: 1,
    accent: 'violet',
    title: 'Enter lesson details',
    description: 'Pick your topic, exam board, year group and lesson length. Biology, exam-board aligned, in seconds.',
    icon: <PencilIcon />,
  },
  {
    n: 2,
    accent: 'cyan',
    title: 'Add class needs',
    description: 'Tell it about ability, SEND and EAL support, and the misconceptions you want to tackle.',
    icon: <ClassIcon />,
  },
  {
    n: 3,
    accent: 'pink',
    title: 'Download classroom-ready resources',
    description: 'Get a full pack — plan, slides, differentiated worksheets, assessment and teacher notes — ready to teach.',
    icon: <DownloadIcon />,
  },
];

export function HowItWorks({ ctaHref }: { ctaHref: string }) {
  return (
    <section id="how" className="relative overflow-hidden bg-gradient-to-b from-white to-violet-50/60 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 sm:text-sm">
            How it works
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            From idea to classroom in three steps
          </h2>
        </div>

        {/* Connector line behind cards (desktop) */}
        <div className="relative mt-12">
          <div
            aria-hidden="true"
            className="absolute left-[16%] right-[16%] top-12 hidden border-t-2 border-dashed border-violet-200 lg:block"
          />
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {STEPS.map((step) => (
              <li key={step.n} className="relative">
                <StepCard
                  n={step.n}
                  accent={step.accent}
                  icon={step.icon}
                  title={step.title}
                  description={step.description}
                />
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href={ctaHref}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl"
          >
            Create your first pack <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function PencilIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 20l4-1 10-10-3-3L5 16l-1 4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M14 6l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function ClassIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="2.6" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16" cy="8" r="2.6" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3.5 19c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5M12 19c0-2.5 2-4.5 4.5-4.5s4 1.6 4 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function DownloadIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 4v10m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 18h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
