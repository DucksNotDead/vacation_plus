import { describe, expect, it } from 'vitest';
import {
  dateToString,
  daysInMonth,
  hasStringInStrings,
  numIntervalToString,
  stringIntervalToNum,
  stringToYearDays,
} from '../lib/date-parser';

describe('date parser core', () => {
  it('formats Date to DD.MM.YYYY', () => {
    expect(dateToString(new Date(2026, 6, 22))).toBe('22.07.2026');
  });

  it('computes days in month including leap February', () => {
    expect(daysInMonth(2, 2024)).toBe(29);
    expect(daysInMonth(2, 2025)).toBe(28);
    expect(daysInMonth(1, 2026)).toBe(31);
  });

  it('roundtrips interval string ↔ numeric interval', () => {
    const interval = '01.01.2026-10.01.2026';
    const numeric = stringIntervalToNum(interval);

    expect(numeric.year).toBe(2026);
    expect(numeric.days).toBe(9);
    expect(numIntervalToString(numeric)).toBe(interval);
  });

  it('checks whether a date belongs to an interval', () => {
    const interval = '01.07.2026-10.07.2026';
    expect(hasStringInStrings(interval, '05.07.2026')).toBe(true);
    expect(hasStringInStrings(interval, '01.07.2026')).toBe(true);
    expect(hasStringInStrings(interval, '11.07.2026')).toBe(false);
  });

  it('maps Jan 1 to day 1 of the year', () => {
    expect(stringToYearDays('01.01.2026')).toBe(1);
  });
});
