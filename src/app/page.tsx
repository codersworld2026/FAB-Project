import { getUser } from '@/lib/auth';
import { isPreviewMode } from '@/lib/preview';
import { MarketingHeader } from '@/components/landing/MarketingHeader';
import { Hero } from '@/components/landing/Hero';
import { BuiltForTeachers } from '@/components/landing/BuiltForTeachers';
import { WhatYouGet } from '@/components/landing/WhatYouGet';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { ScienceDepartments } from '@/components/landing/ScienceDepartments';
import { CTASection } from '@/components/landing/CTASection';
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
        <BuiltForTeachers />
        <WhatYouGet />
        <HowItWorks ctaHref={ctaHref} />
        <ScienceDepartments />
        <CTASection ctaHref={ctaHref} />
      </main>
      <MarketingFooter />
    </div>
  );
}
