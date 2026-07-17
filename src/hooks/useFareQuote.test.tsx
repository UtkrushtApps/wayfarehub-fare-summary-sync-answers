import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { FareSummaryPanel } from '../components/FareSummaryPanel';
import type { FareSelection } from '../types/fare';
import * as fareService from '../services/fareService';

function selection(overrides: Partial<FareSelection> = {}): FareSelection {
  return { adults: 1, children: 0, addOns: [], currency: 'USD', ...overrides };
}

describe('FareSummaryPanel fare sync', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('shows the total for the latest selection when an earlier request resolves last', async () => {
    const spy = vi.spyOn(fareService, 'quoteFare');
    spy.mockImplementationOnce(
      (sel) =>
        new Promise((resolve) =>
          setTimeout(
            () => resolve({ lineItems: [], total: { minorUnits: 10000, currency: sel.currency } }),
            500,
          ),
        ),
    );
    spy.mockImplementationOnce(
      (sel) =>
        new Promise((resolve) =>
          setTimeout(
            () => resolve({ lineItems: [], total: { minorUnits: 20000, currency: sel.currency } }),
            50,
          ),
        ),
    );

    const { rerender } = render(<FareSummaryPanel selection={selection({ adults: 1 })} />);
    rerender(<FareSummaryPanel selection={selection({ adults: 2 })} />);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(600);
    });

    const total = screen.getByLabelText('fare total').textContent ?? '';
    expect(total).toContain('200');
    expect(total).not.toContain('100');
  });
});
