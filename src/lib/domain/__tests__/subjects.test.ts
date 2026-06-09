import { describe, it, expect } from 'vitest';
import {
  SUBJECT_IDS,
  isSubjectId,
  subjectLabel,
  subjectIdFromLegacy,
} from '../subjects';

describe('subjects domain', () => {
  it('supports all three sciences with stable lowercase ids', () => {
    expect([...SUBJECT_IDS]).toEqual(['biology', 'chemistry', 'physics']);
  });

  it('maps ids to display labels', () => {
    expect(subjectLabel('biology')).toBe('Biology');
    expect(subjectLabel('chemistry')).toBe('Chemistry');
    expect(subjectLabel('physics')).toBe('Physics');
  });

  it('guards ids', () => {
    expect(isSubjectId('biology')).toBe(true);
    expect(isSubjectId('Biology')).toBe(false); // labels are not ids
    expect(isSubjectId('history')).toBe(false);
    expect(isSubjectId(42)).toBe(false);
  });

  it('adapts legacy title-case values without a migration', () => {
    expect(subjectIdFromLegacy('Biology')).toBe('biology');
    expect(subjectIdFromLegacy(' CHEMISTRY ')).toBe('chemistry');
    expect(subjectIdFromLegacy('physics')).toBe('physics');
    expect(subjectIdFromLegacy('Geography')).toBeNull();
    expect(subjectIdFromLegacy(null)).toBeNull();
    expect(subjectIdFromLegacy(undefined)).toBeNull();
  });
});
