import { getUser } from '@/lib/auth';
import { isPreviewMode } from '@/lib/preview';
import { MarketingHeader } from '@/components/landing/MarketingHeader';
import { Hero } from '@/components/landing/Hero';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { ExampleLessonPreview } from '@/components/landing/ExampleLessonPreview';
import { CTASection } from '@/components/landing/CTASection';
import { StatsRow } from '@/components/landing/StatsRow';
import { MarketingFooter } from '@/components/landing/MarketingFooter';

export default async function HomePage() {
  const user = await getUser();
  const loggedIn = Boolean(user) || isPreviewMode();
  // Logged-in (or preview) users go straight to the generator; visitors sign up.
  const ctaHref = loggedIn ? '/dashboard/generate' : '/signup';

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <MarketingHeader loggedIn={loggedIn} />
      <main className="flex-1">
        <Hero ctaHref={ctaHref} />
        <FeaturesSection />
        <HowItWorks />
        <ExampleLessonPreview ctaHref={ctaHref} />
        <CTASection ctaHref={ctaHref} />
        <StatsRow />
      </main>
      <MarketingFooter />
    </div>
  );
}
