import 'server-only';
import { isPreviewMode } from './preview';
import { createAdminClient } from './supabase/admin';
import { createClient } from './supabase/server';

interface LogInput {
  event:
    | 'generation_started'
    | 'generation_complete'
    | 'generation_failed'
    | 'export_pdf'
    | 'export_pptx';
  success: boolean;
  packId?: string | null;
  inputTokens?: number;
  outputTokens?: number;
  costUsd?: number;
  error?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Writes a usage/generation-log row. Uses the service-role client (audit logs
 * are a trusted server operation). Best-effort: never throws, so logging can't
 * break a generation. No-ops in preview mode (no database).
 */
export async function logUsage(input: LogInput): Promise<void> {
  if (isPreviewMode()) return;
  try {
    let userId: string | null = null;
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      userId = user?.id ?? null;
    } catch {
      userId = null;
    }

    const admin = createAdminClient();
    await admin.from('usage_logs').insert({
      user_id: userId,
      pack_id: input.packId ?? null,
      event: input.event,
      success: input.success,
      input_tokens: input.inputTokens ?? null,
      output_tokens: input.outputTokens ?? null,
      cost_usd: input.costUsd ?? null,
      error: input.error ?? null,
      metadata: input.metadata ?? null,
    });
  } catch {
    // best-effort logging — swallow errors
  }
}
