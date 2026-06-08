import type { PackContent } from '../types';
import type { PromptKey } from '../prompts';

/** Inputs to a generation (form fields + locked subject). */
export interface GenerationInput {
  subject: string;
  topic: string;
  examBoard: string;
  courseLevel: string;
  abilityLevel: string;
  lessonLength: string;
  learningObjectives: string;
  teacherNotes: string;
}

export interface GenerationUsage {
  model: string;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
}

export interface GenerationResult {
  content: PackContent;
  usage: GenerationUsage;
}

/**
 * A pack generator. The mock implementation runs now (no cost); the Anthropic
 * implementation is swapped in once the customer provides an API key — same
 * interface, so nothing downstream changes.
 */
export interface PackGenerator {
  readonly name: string;
  generate(
    input: GenerationInput,
    prompts: Record<PromptKey, string>,
  ): Promise<GenerationResult>;
}
