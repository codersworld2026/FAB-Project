import { APP_CONFIG } from '@/lib/config';

export const metadata = { title: 'Privacy Policy' };

/**
 * The customer supplies the final, legally reviewed wording. This page renders
 * it with a clear interim notice; the structure and data-handling summary are
 * accurate to how the app actually works.
 */
export default function PrivacyPage() {
  return (
    <>
      <h1>Privacy Policy</h1>

      <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Interim version. Final wording will be provided by {APP_CONFIG.name}{' '}
        before public launch.
      </div>

      <h2>What we store</h2>
      <p>
        We store only the data needed to run a teacher account: your name,
        email address, optional school, and the lesson packs you generate. We do{' '}
        <strong>not</strong> collect or store any student personal data.
      </p>

      <h2>How we use it</h2>
      <p>
        Your account data is used to provide the service — signing you in,
        saving your packs, and managing your subscription. We do not sell your
        data.
      </p>

      <h2>Payments</h2>
      <p>
        Subscription payments are processed securely by Stripe. We never see or
        store your card details.
      </p>

      <h2>Your rights</h2>
      <p>
        You can request a copy of your data or ask us to delete your account at
        any time by contacting support.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about your data? Email{' '}
        <a href={`mailto:${APP_CONFIG.supportEmail}`}>{APP_CONFIG.supportEmail}</a>
        .
      </p>
    </>
  );
}
