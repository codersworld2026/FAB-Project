/**
 * Shared application error vocabulary.
 *
 * A small, framework-agnostic set of error types so server actions, route
 * handlers and library code can fail in a consistent, classifiable way. Messages
 * here are intended to be user-safe — never embed secrets or raw provider error
 * detail in an AppError message.
 */

export type AppErrorCode =
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'validation'
  | 'rate_limited'
  | 'config'
  | 'generation_failed'
  | 'export_failed'
  | 'internal';

export class AppError extends Error {
  readonly code: AppErrorCode;
  /** HTTP status hint for route handlers. */
  readonly status: number;

  constructor(code: AppErrorCode, message: string, status = 500) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
  }
}

/** Thrown when required configuration/environment is missing or invalid. */
export class ConfigError extends AppError {
  constructor(message: string) {
    super('config', message, 500);
    this.name = 'ConfigError';
  }
}

export function isAppError(value: unknown): value is AppError {
  return value instanceof AppError;
}

/** A user-safe message for any thrown value (never leaks internals). */
export function toUserMessage(
  value: unknown,
  fallback = 'Something went wrong. Please try again.',
): string {
  return isAppError(value) ? value.message : fallback;
}
