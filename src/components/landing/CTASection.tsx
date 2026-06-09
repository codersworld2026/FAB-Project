import Link from 'next/link';
import { DnaIcon, MoleculeIcon, AtomIcon, SparkleIcon } from '@/components/science/ScienceIcons';

export function CTASection({ ctaHref }: { ctaHref: string }) {
  return (
    <section id="cta" className="px-4 py-14 sm:px-6 sm:py-16">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-violet-700 via-violet-600 to-fuchsia-600 px-6 py-14 text-center shadow-2xl shadow-violet-400/40 sm:px-12 sm:py-20">
        {/* Decorative glows + floating science shapes */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-14 left-6 h-52 w-52 rounded-full bg-cyan-300/20 blur-2xl" />
        <DnaIcon className="pointer-events-none absolute left-6 top-8 hidden h-12 w-12 text-white/25 motion-safe:animate-float sm:block" />
        <MoleculeIcon className="pointer-events-none absolute right-10 top-10 hidden h-14 w-14 text-white/25 motion-safe:animate-float-slow sm:block" />
        <AtomIcon className="pointer-events-none absolute bottom-8 right-12 hidden h-12 w-12 text-white/25 motion-safe:animate-float sm:block" />

        <div className="relative mx-auto max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white ring-1 ring-inset ring-white/30 backdrop-blur">
            <SparkleIcon className="h-3.5 w-3.5" /> Your first pack is free
          </span>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Plan your next lesson in under 60 seconds
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-violet-100 sm:text-lg">
            Turn an hour of lesson prep into a couple of minutes. Generate a
            complete, classroom-ready Edexcel Biology lesson today.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3">
            <Link
              href={ctaHref}
              className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-2xl bg-white px-7 py-3.5 font-display text-base font-bold text-violet-700 shadow-lg transition-transform hover:scale-[1.02] sm:w-auto"
            >
              Create my lesson now
              <span aria-hidden="true">→</span>
            </Link>
            <span className="text-xs text-violet-100">No credit card required</span>
          </div>
        </div>
      </div>
    </section>
  );
}
