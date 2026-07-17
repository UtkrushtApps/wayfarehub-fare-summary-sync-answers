import { describe, it, expect } from 'vitest';
import { formatMoney } from './money';

describe('formatMoney', () => {
  it('formats USD amounts', () => {
    expect(formatMoney({ minorUnits: 29999, currency: 'USD' })).toBe('$299.99');
  });

  it('formats EUR amounts in euros, not dollars', () => {
    const output = formatMoney({ minorUnits: 15000, currency: 'EUR' });
    expect(output).not.toContain('$');
    expect(output).toContain('150');
  });

  it('formats GBP amounts in pounds', () => {
    const output = formatMoney({ minorUnits: 8000, currency: 'GBP' });
    expect(output).toContain('80');
    expect(output).not.toContain('$');
  });
});
