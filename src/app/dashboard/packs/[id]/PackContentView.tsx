import { Badge, Card } from '@/components/ui';
import type { PackContent } from '@/lib/types';

/** Renders the full structured lesson pack (text-based; exports come in M5). */
export function PackContentView({ content }: { content: PackContent }) {
  return (
    <div className="space-y-6">
      {/* Overview */}
      <Section title="Lesson overview">
        <p className="text-sm text-zinc-700">{content.overview.summary}</p>
        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Learning objectives
        </p>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-zinc-700">
          {content.overview.objectives.map((o, i) => (
            <li key={i}>{o}</li>
          ))}
        </ul>
      </Section>

      {/* Lesson plan */}
      <Section title="Lesson plan">
        <div className="space-y-3">
          {content.lessonPlan.sections.map((s, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-16 shrink-0 text-xs font-medium text-violet-700">
                {s.durationMins ? `${s.durationMins} min` : ''}
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-900">{s.title}</p>
                <p className="text-sm text-zinc-600">{s.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Slides */}
      <Section title={`Slides (${content.slides.length})`}>
        <div className="grid gap-3 sm:grid-cols-2">
          {content.slides.map((slide, i) => (
            <div
              key={i}
              className="rounded-lg border border-zinc-200 bg-zinc-50 p-3"
            >
              <p className="text-xs font-medium text-zinc-500">Slide {i + 1}</p>
              <p className="text-sm font-semibold text-zinc-900">{slide.title}</p>
              <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-zinc-600">
                {slide.bullets.map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
              {slide.teacherNotes ? (
                <p className="mt-2 text-xs italic text-zinc-500">
                  Notes: {slide.teacherNotes}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </Section>

      {/* Worksheets */}
      <Section title="Differentiated worksheets">
        <div className="space-y-4">
          {content.worksheets.map((w, i) => (
            <div key={i} className="rounded-lg border border-zinc-200 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Badge color={worksheetColor(w.level)}>{w.level}</Badge>
                <span className="text-sm font-medium text-zinc-900">
                  {w.title}
                </span>
              </div>
              {w.intro ? (
                <p className="mb-2 text-xs text-zinc-500">{w.intro}</p>
              ) : null}
              <ol className="list-decimal space-y-1 pl-5 text-sm text-zinc-700">
                {w.questions.map((q, j) => (
                  <li key={j}>
                    {q.prompt}
                    {q.marks ? (
                      <span className="text-zinc-500"> ({q.marks} marks)</span>
                    ) : null}
                  </li>
                ))}
              </ol>
              <details className="mt-2">
                <summary className="cursor-pointer text-xs font-medium text-violet-700">
                  Answer key
                </summary>
                <ol className="mt-1 list-decimal space-y-1 pl-5 text-xs text-zinc-600">
                  {w.answers.map((a, j) => (
                    <li key={j}>{a}</li>
                  ))}
                </ol>
              </details>
            </div>
          ))}
        </div>
      </Section>

      {/* Assessment */}
      <Section title="Assessment">
        <ol className="list-decimal space-y-1 pl-5 text-sm text-zinc-700">
          {content.assessment.questions.map((q, i) => (
            <li key={i}>
              {q.prompt}
              <span className="text-zinc-500"> ({q.marks} marks)</span>
            </li>
          ))}
        </ol>
      </Section>

      {/* Mark scheme */}
      <Section title="Mark scheme">
        <div className="space-y-2">
          {content.markScheme.map((m, i) => (
            <div key={i} className="text-sm">
              <span className="font-medium text-zinc-900">{m.questionRef}:</span>{' '}
              <span className="text-zinc-600">{m.answer}</span>{' '}
              <span className="font-medium text-zinc-500">[{m.marks}]</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Teacher notes */}
      <Section title="Teacher notes">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Common misconceptions
        </p>
        <ul className="mb-3 mt-1 list-disc space-y-1 pl-5 text-sm text-zinc-700">
          {content.teacherNotes.misconceptions.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Key teaching points
        </p>
        <ul className="mb-3 mt-1 list-disc space-y-1 pl-5 text-sm text-zinc-700">
          {content.teacherNotes.teachingPoints.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
        {content.teacherNotes.safety ? (
          <>
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Safety
            </p>
            <p className="mt-1 text-sm text-zinc-700">
              {content.teacherNotes.safety}
            </p>
          </>
        ) : null}
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  // Collapsible accordion (open by default): expanded on desktop, tap to
  // collapse on mobile. Native <details> keeps it server-rendered + accessible.
  return (
    <Card className="p-0">
      <details open className="group">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-2 px-5 py-4 sm:px-6 [&::-webkit-details-marker]:hidden">
          <span className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            {title}
          </span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="shrink-0 text-zinc-400 transition-transform group-open:rotate-180"
          >
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </summary>
        <div className="px-5 pb-5 sm:px-6 sm:pb-6">{children}</div>
      </details>
    </Card>
  );
}

function worksheetColor(level: string): 'blue' | 'zinc' | 'violet' {
  if (level === 'Foundation') return 'blue';
  if (level === 'Mastery') return 'violet';
  return 'zinc';
}
