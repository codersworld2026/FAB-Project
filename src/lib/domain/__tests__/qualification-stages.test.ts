import { describe, it, expect } from 'vitest';
import {
  isQualificationStageId,
  qualificationStageLabel,
  stageRequiresExamBoard,
  qualificationStageIdFromLegacy,
} from '../qualification-stages';

describe('qualification-stage domain', () => {
  it('maps ids to labels', () => {
    expect(qualificationStageLabel('gcse')).toBe('GCSE');
    expect(qualificationStageLabel('igcse')).toBe('International GCSE');
    expect(qualificationStageLabel('a_level')).toBe('A-level');
    expect(qualificationStageLabel('ks3')).toBe('Key Stage 3');
  });

  it('treats exam board as separate: KS3 needs none, GCSE/IGCSE/A-level do', () => {
    expect(stageRequiresExamBoard('ks3')).toBe(false);
    expect(stageRequiresExamBoard('gcse')).toBe(true);
    expect(stageRequiresExamBoard('igcse')).toBe(true);
    expect(stageRequiresExamBoard('a_level')).toBe(true);
  });

  it('guards ids', () => {
    expect(isQualificationStageId('gcse')).toBe(true);
    expect(isQualificationStageId('GCSE')).toBe(false);
    expect(isQualificationStageId('btec')).toBe(false);
  });

  it('adapts legacy course-level values', () => {
    expect(qualificationStageIdFromLegacy('GCSE')).toBe('gcse');
    expect(qualificationStageIdFromLegacy('International GCSE')).toBe('igcse');
    expect(qualificationStageIdFromLegacy('A-level')).toBe('a_level');
    expect(qualificationStageIdFromLegacy('Key Stage 3')).toBe('ks3');
    expect(qualificationStageIdFromLegacy('Year 10')).toBeNull();
    expect(qualificationStageIdFromLegacy(null)).toBeNull();
  });
});
