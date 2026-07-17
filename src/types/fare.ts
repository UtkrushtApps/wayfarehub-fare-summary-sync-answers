export type CurrencyCode = 'USD' | 'EUR' | 'GBP';

export type AddOnId = 'seat' | 'insurance' | 'baggage';

export interface AddOn {
  id: AddOnId;
  label: string;
  priceMinor: number;
}

export interface FareSelection {
  adults: number;
  children: number;
  addOns: AddOnId[];
  currency: CurrencyCode;
  locale?: string;
}

export interface Money {
  minorUnits: number;
  currency: CurrencyCode;
}

export interface FareLineItem {
  label: string;
  amount: Money;
}

export interface FareQuote {
  lineItems: FareLineItem[];
  total: Money;
}
