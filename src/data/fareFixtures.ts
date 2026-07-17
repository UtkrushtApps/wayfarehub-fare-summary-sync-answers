import type { AddOn, FareSelection } from '../types/fare';

export const BASE_FARE_MINOR = 29_999;

export const CHILD_DISCOUNT_BASIS_POINTS = 2_500;

export const ADD_ON_CATALOG: AddOn[] = [
  { id: 'seat', label: 'Seat Selection', priceMinor: 1_250 },
  { id: 'insurance', label: 'Travel Insurance', priceMinor: 4_995 },
  { id: 'baggage', label: 'Extra Baggage', priceMinor: 3_500 },
];

export const initialSelection: FareSelection = {
  adults: 1,
  children: 0,
  addOns: [],
  currency: 'USD',
  locale: 'en-US',
};
