import Link from 'next/link';
import { getUser } from '@/lib/auth';
import { APP_CONFIG } from '@/lib/config';
import { isPreviewMode } from '@/lib/preview';
import { Button } from '@/components/ui';

const PACK_ITEMS = [
  { title: 'Lesson plan', desc: 'Timed, with starter, main and plenary.' },
  { title: 'Slides', desc: 'Presentation-ready, exportable to PowerPoint.' },
  {
    title: 'Three worksheets',
    desc: 'Foundation, Standard and Mastery — differentiated.',
  },
  { title: 'Assessment', desc: 'Original, exam-style questions with marks.' },
  { title: 'Mark scheme', desc: 'Clear answers for fast marking.' },
  { title: 'Teacher notes', desc: 'Misconceptions and key teaching points.' },
];

const STEPS = [
  {
    n: '1',
    title: 'Describe your lesson',
    desc: 'Topic, course level, ability and length — that’s it.',
  },
  {
    n: '2',
    title: 'Generate in minutes',
    desc: 'A complete, original pack tailored to your class.',
  },
  {
    n: '3',
    title: 'Download & teach',
    desc: 'Export to PDF and PowerPoint, ready for the classroom.',
  },
];

export default async function HomePage() {
  const user = await getUser();
  const previewing = isPreviewMode();
  const loggedInHref = '/dashboard';

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-zinc-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <span className="text-lg font-bold tracking-tight text-emerald-700">
            {APP_CONFIG.name}
          </span>
          <nav className="flex items-center gap-2">
            {user || previewing ? (
              <Link href={loggedInHref}>
                <Button>{previewing ? 'View dashboard' : 'Dashboard'}</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Sign in</Button>
                </Link>
                <Link href="/signup">
                  <Button>Start free trial</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
              {APP_CONFIG.subject} · {APP_CONFIG.defaultExamBoard}
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
              Complete lesson packs, ready in minutes.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-zinc-600">
              Stop spending evenings adapting bought resources. Generate
              original, exam-style {APP_CONFIG.subject} packs — lesson plan,
              slides, three differentiated worksheets, assessment and teacher
              notes — tailored to your class.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={user || previewing ? loggedInHref : '/signup'}>
                <Button size="lg" className="w-full sm:w-auto">
                  {user
                    ? 'Open dashboard'
                    : previewing
                      ? 'Explore the dashboard'
                      : 'Start your free trial'}
                </Button>
              </Link>
              {!user && !previewing ? (
                <Link href="/login">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    Sign in
                  </Button>
                </Link>
              ) : null}
            </div>
            <p className="mt-4 text-sm text-zinc-500">
              No student data collected · Original content only · Built for
              British-curriculum schools
            </p>
          </div>

          {/* Hero visual: a stylised pack preview */}
          <div className="relative">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 shadow-sm sm:p-6">
              <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-zinc-900">
                    Photosynthesis
                  </span>
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
                    Approved
                  </span>
                </div>
                <p className="mt-1 text-xs text-zinc-500">
                  Biology · Edexcel · IGCSE · Mixed ability
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {PACK_ITEMS.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2 text-xs font-medium text-zinc-700"
                    >
                      {item.title}
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  <span className="inline-flex items-center rounded-md bg-zinc-900 px-2.5 py-1 text-xs font-medium text-white">
                    PDF
                  </span>
                  <span className="inline-flex items-center rounded-md bg-amber-500 px-2.5 py-1 text-xs font-medium text-white">
                    PowerPoint
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What's in every pack */}
        <section className="border-t border-zinc-100 bg-zinc-50/60">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                Every pack includes
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
                Everything you need for the lesson
              </h2>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {PACK_ITEMS.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-100">
                    <CheckIcon />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-zinc-900">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              How it works
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
              From idea to classroom in three steps
            </h2>
          </div>
          <ol className="mt-10 grid gap-6 sm:grid-cols-3">
            {STEPS.map((step) => (
              <li key={step.n} className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-700 text-sm font-semibold text-white">
                  {step.n}
                </div>
                <h3 className="mt-4 text-base font-semibold text-zinc-900">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm text-zinc-600">{step.desc}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* CTA band */}
        <section className="border-t border-zinc-100">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-emerald-700 px-6 py-10 sm:flex-row sm:items-center sm:px-10">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-white">
                  Try it with your next lesson.
                </h2>
                <p className="mt-1 text-emerald-50">
                  Start free — no card required for the trial.
                </p>
              </div>
              <Link href={user || previewing ? loggedInHref : '/signup'}>
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto"
                >
                  {user || previewing ? 'Open dashboard' : 'Start free trial'}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-100">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-zinc-500 sm:flex-row sm:px-6">
          <span>
            © {new Date().getFullYear()} {APP_CONFIG.name}
          </span>
          <nav className="flex gap-5">
            <Link href="/privacy" className="hover:text-zinc-900">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-zinc-900">
              Terms
            </Link>
            <a
              href={`mailto:${APP_CONFIG.supportEmail}`}
              className="hover:text-zinc-900"
            >
              Support
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M16.5 5.5L8.25 14L4 9.75"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
