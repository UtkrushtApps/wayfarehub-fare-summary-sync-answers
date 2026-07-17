import type { CurrencyCode, Money } from '../types/fare';

const MINOR_UNITS_PER_MAJOR: Record<CurrencyCode, number> = {
  USD: 100,
  EUR: 100,
  GBP: 100,
};

const DEFAULT_LOCALE_BY_CURRENCY: Record<CurrencyCode, string> = {
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
};

const formatterCache = new Map<string, Intl.NumberFormat>();

export function getDefaultLocaleForCurrency(currency: CurrencyCode): string {
  return DEFAULT_LOCALE_BY_CURRENCY[currency];
}

function getFormatter(currency: CurrencyCode, locale: string): Intl.NumberFormat {
  const cacheKey = `${locale}:${currency}`;
  const cached = formatterCache.get(cacheKey);
  if (cached) return cached;

  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  });
  formatterCache.set(cacheKey, formatter);
  return formatter;
}

export function formatMoney(amount: Money, locale = getDefaultLocaleForCurrency(amount.currency)): string {
  const majorUnits = amount.minorUnits / MINOR_UNITS_PER_MAJOR[amount.currency];
  return getFormatter(amount.currency, locale).format(majorUnits);
}
