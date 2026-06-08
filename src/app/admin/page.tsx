import Link from 'next/link';
import { requireOwner } from '@/lib/auth';
import { APP_CONFIG } from '@/lib/config';
import { DEFAULT_PROMPTS, PROMPT_KEYS, getPrompts } from '@/lib/prompts';
import { Badge, Card, Eyebrow, PageHeader } from '@/components/ui';

export const metadata = { title: 'Admin' };

export default async function AdminPage() {
  await requireOwner();
  const prompts = await getPrompts();

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/dashboard"
          className="text-sm font-medium text-emerald-700 hover:underline"
        >
          ← Back to dashboard
        </Link>
        <div className="mt-3">
          <PageHeader
            title="Admin"
            description="Owner-only tools for prompts, quality and settings."
          />
        </div>
      </div>

      {/* Settings summary */}
      <Card>
        <Eyebrow>Current settings</Eyebrow>
        <dl className="mt-3 grid gap-4 sm:grid-cols-3">
          <SettingStat label="Subject" value={APP_CONFIG.subject} />
          <SettingStat label="Exam board" value={APP_CONFIG.defaultExamBoard} />
          <SettingStat
            label="Free-trial limit"
            value={`${APP_CONFIG.freeTrialPackLimit} packs`}
          />
        </dl>
        <p className="mt-4 text-xs text-zinc-500">
          Editable settings (exam board, trial limit) are wired in Milestone 7.
        </p>
      </Card>

      {/* Prompt templates */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
            AI prompt templates
          </h2>
          <Badge>Editing in M7</Badge>
        </div>
        <p className="mb-4 max-w-2xl text-sm text-zinc-500">
          These instructions drive every generation and are stored in the
          database, so they can be tuned without a code change. A full editor
          arrives in Milestone 7 — shown read-only here.
        </p>
        <div className="space-y-3">
          {PROMPT_KEYS.map((key) => (
            <Card key={key} className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-zinc-900">
                  {DEFAULT_PROMPTS[key].label}
                </h3>
                <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-500">
                  {key}
                </code>
              </div>
              <p className="text-xs text-zinc-500">
                {DEFAULT_PROMPTS[key].description}
              </p>
              <p className="line-clamp-2 rounded-lg bg-zinc-50 p-3 text-xs leading-relaxed text-zinc-600">
                {prompts[key]}
              </p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

function SettingStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}
