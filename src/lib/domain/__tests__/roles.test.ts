import { describe, it, expect } from 'vitest';
import { PERSISTED_ROLES, isPersistedRole } from '../roles';

describe('roles domain', () => {
  it('only teacher and owner are persistable today', () => {
    expect([...PERSISTED_ROLES]).toEqual(['teacher', 'owner']);
    expect(isPersistedRole('teacher')).toBe(true);
    expect(isPersistedRole('owner')).toBe(true);
  });

  it('department_lead is NOT a persistable role (type-only, deferred)', () => {
    expect(isPersistedRole('department_lead')).toBe(false);
    expect(isPersistedRole('admin')).toBe(false);
    expect(isPersistedRole(undefined)).toBe(false);
  });
});
