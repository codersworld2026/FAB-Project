import { describe, it, expect } from 'vitest';
import {
  isExamBoardId,
  examBoardLabel,
  examBoardIdFromLegacy,
} from '../exam-boards';

describe('exam-board domain', () => {
  it('maps ids to labels', () => {
    expect(examBoardLabel('edexcel')).toBe('Pearson Edexcel');
    expect(examBoardLabel('aqa')).toBe('AQA');
    expect(examBoardLabel('ocr')).toBe('OCR');
  });

  it('guards ids', () => {
    expect(isExamBoardId('edexcel')).toBe(true);
    expect(isExamBoardId('Pearson Edexcel')).toBe(false);
    expect(isExamBoardId('wjec')).toBe(false);
  });

  it('adapts legacy board AND overloaded qualification-label values', () => {
    expect(examBoardIdFromLegacy('Pearson Edexcel')).toBe('edexcel');
    expect(examBoardIdFromLegacy('Edexcel')).toBe('edexcel');
    // The legacy `exam_board` column sometimes holds a qualification label:
    expect(examBoardIdFromLegacy('Edexcel GCSE Biology')).toBe('edexcel');
    expect(examBoardIdFromLegacy('AQA')).toBe('aqa');
    // KS3 resources legitimately have no board:
    expect(examBoardIdFromLegacy('')).toBeNull();
    expect(examBoardIdFromLegacy(null)).toBeNull();
    expect(examBoardIdFromLegacy('Something else')).toBeNull();
  });
});
