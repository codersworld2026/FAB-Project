import { describe, it, expect } from 'vitest';
import {
  YEAR_LEVEL_IDS,
  isYearLevelId,
  yearLabel,
  yearNumber,
  keyStageOf,
  yearLevelIdFromLegacy,
} from '../years';

describe('year-level domain', () => {
  it('covers Year 7 through Year 13', () => {
    expect(YEAR_LEVEL_IDS).toHaveLength(7);
    expect(YEAR_LEVEL_IDS[0]).toBe('year_7');
    expect(YEAR_LEVEL_IDS[6]).toBe('year_13');
  });

  it('maps ids to labels and numbers', () => {
    expect(yearLabel('year_10')).toBe('Year 10');
    expect(yearNumber('year_7')).toBe(7);
    expect(yearNumber('year_13')).toBe(13);
  });

  it('derives key stage from year', () => {
    expect(keyStageOf('year_7')).toBe('KS3');
    expect(keyStageOf('year_9')).toBe('KS3');
    expect(keyStageOf('year_10')).toBe('KS4');
    expect(keyStageOf('year_11')).toBe('KS4');
    expect(keyStageOf('year_12')).toBe('KS5');
    expect(keyStageOf('year_13')).toBe('KS5');
  });

  it('guards ids', () => {
    expect(isYearLevelId('year_7')).toBe(true);
    expect(isYearLevelId('year_6')).toBe(false);
    expect(isYearLevelId('Year 7')).toBe(false);
  });

  it('adapts legacy free-text year values', () => {
    expect(yearLevelIdFromLegacy('Year 10')).toBe('year_10');
    expect(yearLevelIdFromLegacy('year 7')).toBe('year_7');
    expect(yearLevelIdFromLegacy('Y11')).toBe('year_11');
    expect(yearLevelIdFromLegacy('13')).toBe('year_13');
    expect(yearLevelIdFromLegacy('Year 6')).toBeNull();
    expect(yearLevelIdFromLegacy(null)).toBeNull();
  });
});
