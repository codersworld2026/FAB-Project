import { LessonPackCard, type PackAccent } from './LessonPackCard';

type Item = {
  accent: PackAccent;
  title: string;
  description: string;
  tag?: string;
  icon: React.ReactNode;
};

const ITEMS: Item[] = [
  {
    accent: 'violet',
    title: 'Lesson plan',
    description: 'A timed, structured plan — starter, main teaching, practice and plenary — mapped to your objectives.',
    icon: <PlanIcon />,
  },
  {
    accent: 'cyan',
    title: 'Slide deck',
    description: 'Presentation-ready slides with clear explanations, visuals cues and teacher prompts.',
    icon: <SlidesIcon />,
  },
  {
    accent: 'emerald',
    title: 'Foundation worksheet',
    description: 'Scaffolded questions with sentence starters and support for your lower-ability pupils.',
    tag: 'Support',
    icon: <SheetIcon />,
  },
  {
    accent: 'indigo',
    title: 'Standard worksheet',
    description: 'Grade-appropriate practice that builds fluency and confidence for the core of the class.',
    tag: 'Core',
    icon: <SheetIcon />,
  },
  {
    accent: 'rose',
    title: 'Mastery worksheet',
    description: 'Stretch-and-challenge tasks with exam-style application for your highest attainers.',
    tag: 'Stretch',
    icon: <SheetIcon />,
  },
  {
    accent: 'amber',
    title: 'Formative assessment',
    description: 'A short quiz with marks and a clear mark scheme to check understanding instantly.',
    icon: <CheckIcon />,
  },
  {
    accent: 'sky',
    title: 'Teacher notes',
    description: 'Key teaching points, timings and delivery guidance so any teacher can pick it up.',
    icon: <NotesIcon />,
  },
  {
    accent: 'pink',
    title: 'Misconceptions',
    description: 'The common errors pupils make on this topic — with guidance on how to address them.',
    icon: <BulbIcon />,
  },
];

export function WhatYouGet() {
  return (
    <section id="pack" className="relative overflow-hidden py-16 sm:py-20">
      <div className="bg-lab-grid pointer-events-none absolute inset-0 -z-10 opacity-40" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 sm:text-sm">
            One generation, a full pack
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
            What you get in one pack
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Every pack is a complete, classroom-ready set of resources — not just a
            single worksheet. Differentiated for the whole class, out of the box.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((item) => (
            <LessonPackCard
              key={item.title}
              accent={item.accent}
              icon={item.icon}
              title={item.title}
              description={item.description}
              tag={item.tag}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* --- inline icons (stroke = currentColor → inherit the white-on-accent tile) --- */
function PlanIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function SlidesIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 16v4M9 20h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function SheetIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 3h7l5 5v13H7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M14 3v5h5M9 13h6M9 16h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.5 12l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function NotesIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 4h11l3 3v13H5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M8 9h6M8 13h8M8 17h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function BulbIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 18h6M10 21h4M12 3a6 6 0 0 1 4 10.5c-.7.6-1 1.2-1 2.5H9c0-1.3-.3-1.9-1-2.5A6 6 0 0 1 12 3z"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
