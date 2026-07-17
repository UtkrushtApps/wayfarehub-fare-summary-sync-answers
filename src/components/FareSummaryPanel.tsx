import { useFareQuote } from '../hooks/useFareQuote';
import { formatMoney } from '../utils/money';
import type { FareQuote, FareSelection } from '../types/fare';

interface FareSummaryPanelProps {
  selection: FareSelection;
}

function FareQuoteDetails({ quote, selection }: { quote: FareQuote; selection: FareSelection }) {
  const locale = selection.locale;
  const isEmptyQuote = quote.lineItems.length === 0 && quote.total.minorUnits === 0;

  return (
    <>
      {isEmptyQuote ? (
        <p className="fare-summary-state">No fare selected yet.</p>
      ) : (
        quote.lineItems.map((item) => (
          <div className="line-item" key={item.label}>
            <span>{item.label}</span>
            <span>{formatMoney(item.amount, locale)}</span>
          </div>
        ))
      )}

      <div className="line-item" style={{ marginTop: 12 }}>
        <strong>Total</strong>
        <strong className="fare-total" aria-label="fare total">
          {formatMoney(quote.total, locale)}
        </strong>
      </div>
    </>
  );
}

export function FareSummaryPanel({ selection }: FareSummaryPanelProps) {
  const fareQuote = useFareQuote(selection);

  return (
    <div className="fare-summary" aria-busy={fareQuote.status === 'loading'}>
      <h2>Fare Summary</h2>

      {fareQuote.status === 'loading' ? (
        <p className="fare-summary-state" aria-live="polite">
          Calculating fare...
        </p>
      ) : null}

      {fareQuote.status === 'error' ? (
        <div className="fare-summary-error" role="alert">
          We could not update your fare summary. Please try changing your selection again.
        </div>
      ) : null}

      {fareQuote.status === 'success' ? (
        <FareQuoteDetails quote={fareQuote.quote} selection={selection} />
      ) : null}
    </div>
  );
}
