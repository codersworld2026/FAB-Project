import { LessonPackCard, type PackAccent } from './LessonPackCard';
import {
  LessonIcon,
  SeriesIcon,
  ActivityIcon,
  AssessmentIcon,
} from '@/components/app/icons';

const ITEMS: {
  accent: PackAccent;
  title: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    accent: 'violet',
    title: 'Lessons',
    description:
      'Complete Biology lessons — objectives, starter, teaching, activities, checks for understanding and plenary.',
    icon: <LessonIcon className="h-5 w-5" />,
  },
  {
    accent: 'indigo',
    title: 'Lesson series',
    description:
      'Plan a full topic sequence with ordered lessons, recaps, quizzes and an end-of-topic assessment.',
    icon: <SeriesIcon className="h-5 w-5" />,
  },
  {
    accent: 'sky',
    title: 'Activity sheets',
    description:
      'Printable worksheets, differentiated tasks and matching teacher answer sheets.',
    icon: <ActivityIcon className="h-5 w-5" />,
  },
  {
    accent: 'amber',
    title: 'Assessments',
    description:
      'Quick quizzes, end-of-topic tests, exam-style questions and knowledge checks.',
    icon: <AssessmentIcon className="h-5 w-5" />,
  },
];

export function WhatTeachersCreate() {
  return (
    <section id="create" className="relative overflow-hidden py-16 sm:py-20">
      <div className="bg-lab-grid pointer-events-none absolute inset-0 -z-10 opacity-40" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 sm:text-sm">
            One tool, every resource
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
            What teachers can create
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Everything you need for Edexcel Biology — generated, differentiated
            and classroom-ready in minutes.
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
            />
          ))}
        </div>
      </div>
    </section>
  );
}
