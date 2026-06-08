import { APP_CONFIG } from '@/lib/config';

export const metadata = { title: 'Terms of Service' };

/** The customer supplies the final, legally reviewed wording. */
export default function TermsPage() {
  return (
    <>
      <h1>Terms of Service</h1>

      <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Interim version. Final wording will be provided by {APP_CONFIG.name}{' '}
        before public launch.
      </div>

      <h2>The service</h2>
      <p>
        {APP_CONFIG.name} generates original, exam-style {APP_CONFIG.subject}{' '}
        lesson resources for teachers. It does not reproduce real past papers or
        official mark schemes.
      </p>

      <h2>Use of generated content</h2>
      <p>
        Generated packs are AI-produced and intended for classroom use. You are
        responsible for reviewing content for accuracy before teaching with it.
      </p>

      <h2>Subscriptions</h2>
      <p>
        Access begins with a free trial and continues via a paid subscription.
        Billing is handled by Stripe. You can cancel at any time.
      </p>

      <h2>Acceptable use</h2>
      <p>
        Don&apos;t misuse the service or attempt to generate content that
        breaches copyright or applicable law.
      </p>

      <h2>Contact</h2>
      <p>
        Questions? Email{' '}
        <a href={`mailto:${APP_CONFIG.supportEmail}`}>{APP_CONFIG.supportEmail}</a>
        .
      </p>
    </>
  );
}
