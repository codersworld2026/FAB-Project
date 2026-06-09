import { describe, it, expect } from 'vitest';
import { can } from '../can';
import type { Role } from '../../domain/roles';

const profile = (role: Role) => ({ role });

describe('authz can()', () => {
  it('owners may perform every action', () => {
    const owner = profile('owner');
    expect(can(owner, 'resource:create')).toBe(true);
    expect(can(owner, 'resource:read:any')).toBe(true);
    expect(can(owner, 'admin:access')).toBe(true);
    expect(can(owner, 'prompts:write')).toBe(true);
    expect(can(owner, 'settings:write')).toBe(true);
  });

  it('teachers may create their own resources but nothing owner-gated', () => {
    const teacher = profile('teacher');
    expect(can(teacher, 'resource:create')).toBe(true);
    expect(can(teacher, 'resource:read:any')).toBe(false);
    expect(can(teacher, 'admin:access')).toBe(false);
    expect(can(teacher, 'prompts:write')).toBe(false);
    expect(can(teacher, 'settings:write')).toBe(false);
  });

  it('department_lead authorises NOTHING (deferred, not yet a real role)', () => {
    const lead = profile('department_lead');
    expect(can(lead, 'resource:create')).toBe(false);
    expect(can(lead, 'admin:access')).toBe(false);
    expect(can(lead, 'settings:write')).toBe(false);
  });
});
