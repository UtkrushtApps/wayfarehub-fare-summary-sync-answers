import {
  ADD_ON_CATALOG,
  BASE_FARE_MINOR,
  CHILD_DISCOUNT_BASIS_POINTS,
} from '../data/fareFixtures';
import type { FareLineItem, FareQuote, FareSelection, Money } from '../types/fare';

const LATENCIES_MS = [400, 90, 260, 60, 520, 150];
const BASIS_POINTS_PER_UNIT = 10_000;
let callIndex = 0;

function nextLatency(): number {
  const latency = LATENCIES_MS[callIndex % LATENCIES_MS.length];
  callIndex += 1;
  return latency;
}

function money(minorUnits: number, selection: FareSelection): Money {
  return {
    minorUnits,
    currency: selection.currency,
  };
}

function divideAndRoundToNearestInteger(numerator: number, denominator: number): number {
  return Math.floor((numerator + Math.floor(denominator / 2)) / denominator);
}

function discountedMinorUnits(baseMinorUnits: number, discountBasisPoints: number): number {
  const payableBasisPoints = BASIS_POINTS_PER_UNIT - discountBasisPoints;
  return divideAndRoundToNearestInteger(baseMinorUnits * payableBasisPoints, BASIS_POINTS_PER_UNIT);
}

function buildQuote(selection: FareSelection): FareQuote {
  const lineItems: FareLineItem[] = [];

  const adultTotal = BASE_FARE_MINOR * selection.adults;
  if (selection.adults > 0) {
    lineItems.push({
      label: `Adults x${selection.adults}`,
      amount: money(adultTotal, selection),
    });
  }

  const childUnit = discountedMinorUnits(BASE_FARE_MINOR, CHILD_DISCOUNT_BASIS_POINTS);
  const childTotal = childUnit * selection.children;
  if (selection.children > 0) {
    lineItems.push({
      label: `Children x${selection.children}`,
      amount: money(childTotal, selection),
    });
  }

  const travelers = selection.adults + selection.children;
  for (const id of selection.addOns) {
    const addOn = ADD_ON_CATALOG.find((a) => a.id === id);
    if (!addOn) continue;

    lineItems.push({
      label: addOn.label,
      amount: money(addOn.priceMinor * travelers, selection),
    });
  }

  const totalMinor = lineItems.reduce((sum, item) => sum + item.amount.minorUnits, 0);

  return {
    lineItems,
    total: money(totalMinor, selection),
  };
}

export function quoteFare(selection: FareSelection): Promise<FareQuote> {
  const latency = nextLatency();
  return new Promise((resolve) => {
    setTimeout(() => resolve(buildQuote(selection)), latency);
  });
}
