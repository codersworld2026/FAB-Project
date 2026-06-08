import { mockGenerator } from './mock';
import type { PackGenerator } from './types';

export type {
  GenerationInput,
  GenerationResult,
  GenerationUsage,
  PackGenerator,
} from './types';

/**
 * Selects the active pack generator.
 *
 * Milestone 3 ships the MOCK generator (zero AI cost) so the full
 * form → generate → save → view loop works today.
 *
 * To wire the real Anthropic generator later:
 *   1. Create `src/lib/generation/anthropic.ts` implementing `PackGenerator`
 *      with the Anthropic SDK (build the request from the DB prompt templates,
 *      ask Claude for JSON matching `PackContent`, validate, return usage).
 *   2. Return it here when a key is present, e.g.:
 *        if (process.env.ANTHROPIC_API_KEY) return anthropicGenerator;
 * Nothing else downstream changes — the interface is identical.
 */
export function getGenerator(): PackGenerator {
  return mockGenerator;
}
