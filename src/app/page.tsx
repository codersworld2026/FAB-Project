import { getUser } from '@/lib/auth';
import { isPreviewMode } from '@/lib/preview';
import { MarketingHeader } from '@/components/landing/MarketingHeader';
import { Hero } from '@/components/landing/Hero';
import { WhatTeachersCreate } from '@/components/landing/WhatTeachersCreate';
import { QualificationSupport } from '@/components/landing/QualificationSupport';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { ExampleLesson } from '@/components/landing/ExampleLesson';
import { CollaborationTeaser, AssistantTeaser } from '@/components/landing/PlatformTeasers';
import { TeacherBenefits } from '@/components/landing/TeacherBenefits';
import { CTASection } from '@/components/landing/CTASection';
import { MarketingFooter } from '@/components/landing/MarketingFooter';
import { SupportFab } from '@/components/landing/SupportFab';

export default async function HomePage() {
  const user = await getUser();
  const loggedIn = Boolean(user) || isPreviewMode();
  // Logged-in (or preview) users go straight to the generator; visitors sign up.
  const ctaHref = loggedIn ? '/dashboard/generate' : '/signup';

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-zinc-950">
      <MarketingHeader loggedIn={loggedIn} />
      <main className="flex-1">
        <Hero ctaHref={ctaHref} />
        <WhatTeachersCreate />
        <QualificationSupport />
        <HowItWorks ctaHref={ctaHref} />
        <ExampleLesson />
        <CollaborationTeaser />
        <AssistantTeaser />
        <TeacherBenefits />
        <CTASection ctaHref={ctaHref} />
      </main>
      <MarketingFooter />
      <SupportFab />
    </div>
  );
}
