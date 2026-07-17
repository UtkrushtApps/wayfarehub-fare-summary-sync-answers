# Solution Steps

1. Model fare quote UI state explicitly instead of storing only a nullable quote. Use a discriminated union with loading, success, and error states so the panel can render honest pending, result, and failure UI without guessing from null.

2. In useFareQuote, track a monotonically increasing request id in a ref. Each time the selection changes, increment the id, set the hook to loading, call quoteFare, and only commit the resolved or rejected result if that request id is still the latest active request.

3. Catch quoteFare rejections in the hook and normalize unknown thrown values to Error. This prevents unhandled promise rejections and lets the panel show a clear retry/error message.

4. Update FareSummaryPanel to render by hook status: pending text while loading, an alert-style error message on rejection, and quote details only after a successful latest quote. For a successful quote with no line items and a zero total, show a sensible empty-state message while still displaying a formatted zero total.

5. Represent money throughout fare calculations as integer minor units. Replace percentage floating-point discount math with integer basis-point math and integer rounding so quoted totals match submitted totals exactly at the cent/minor-unit level.

6. Keep quoteFare’s variable latency simulation intact. Only change the internal quote construction to use integer-safe helpers for line item amounts and totals.

7. Add optional locale to FareSelection and format money using the amount currency plus the selection locale when available. Provide default locales per supported currency so existing callers that do not specify locale still format USD, EUR, and GBP correctly.

8. Update currency selection to keep the selection locale aligned with the selected currency’s default locale, ensuring the panel no longer uses hardcoded en-US/USD formatting.

9. Make formatMoney currency-aware by caching Intl.NumberFormat instances per locale/currency pair and using the Money.currency field instead of a single hardcoded USD formatter.

10. Run typecheck and tests. The race-condition test should show the latest total even when an older request resolves last, and the money tests should confirm EUR/GBP are not displayed as dollars.

