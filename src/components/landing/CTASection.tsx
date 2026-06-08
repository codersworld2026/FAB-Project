import Link from 'next/link';

export function CTASection({ ctaHref }: { ctaHref: string }) {
  return (
    <section id="cta" className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-12 shadow-xl shadow-violet-300/40 sm:px-12">
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 left-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Ready to plan your next lesson in seconds?
            </h2>
            <p className="mt-2 text-violet-100">
              Join teachers saving hours every week with Lessons Generator.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-base font-semibold text-violet-700 shadow-md transition-transform hover:scale-[1.02]"
            >
              Sign up free <span aria-hidden="true">→</span>
            </Link>
            <span className="text-xs text-violet-100">No credit card required</span>
          </div>
        </div>
      </div>
    </section>
  );
}
