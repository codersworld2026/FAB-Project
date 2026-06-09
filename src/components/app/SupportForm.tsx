'use client';

import { useState } from 'react';
import { APP_CONFIG } from '@/lib/config';
import { Field, Select, Textarea, Input } from '@/components/ui';

const CATEGORIES = [
  'Account',
  'Billing',
  'Lesson generation',
  'Export',
  'Teams',
  'Technical issue',
  'Curriculum question',
  'Other',
] as const;

/**
 * Human support handoff. Composes an email to the support address (real, not
 * faked). A live-agent / AI assistant is not yet available — this is stated
 * plainly and the request is sent by email instead.
 */
export function SupportForm({ defaultEmail }: { defaultEmail?: string }) {
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [email, setEmail] = useState(defaultEmail ?? '');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`[Support · ${category}] Lessons Generator`);
    const body = encodeURIComponent(
      `Category: ${category}\nFrom: ${email || '(not provided)'}\n\n${message}`,
    );
    // Opens the teacher's email client addressed to support — a real handoff.
    window.location.href = `mailto:${APP_CONFIG.supportEmail}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  if (sent) {
    return (
      <div className="rounded-2xl border border-violet-100 bg-violet-50/60 p-5 text-sm text-violet-900 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-100">
        <p className="font-semibold">Thanks — your request is ready to send.</p>
        <p className="mt-1">
          We&apos;ve opened your email app addressed to {APP_CONFIG.supportEmail}. Send
          it and our team will get back to you. (A live in-app agent isn&apos;t
          available yet.)
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-3 text-sm font-semibold text-violet-700 hover:underline dark:text-violet-300"
        >
          Write another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <Field label="What do you need help with?">
        <Select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>
      </Field>
      <Field label="Your email" hint="So we can reply.">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@school.example"
        />
      </Field>
      <Field label="Message">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          maxLength={2000}
          placeholder="Tell us what's happening…"
          required
        />
      </Field>
      <button
        type="submit"
        disabled={message.trim().length === 0}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 font-display text-sm font-bold text-white shadow-lg shadow-violet-500/25 transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        Send to support
      </button>
    </form>
  );
}
