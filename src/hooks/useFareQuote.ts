import { useEffect, useRef, useState } from 'react';
import { quoteFare } from '../services/fareService';
import type { FareQuote, FareSelection } from '../types/fare';

export type FareQuoteState =
  | {
      status: 'loading';
      quote: null;
      error: null;
    }
  | {
      status: 'success';
      quote: FareQuote;
      error: null;
    }
  | {
      status: 'error';
      quote: null;
      error: Error;
    };

function toError(value: unknown): Error {
  return value instanceof Error ? value : new Error('Unable to quote fare.');
}

export function useFareQuote(selection: FareSelection): FareQuoteState {
  const latestRequestId = useRef(0);
  const [state, setState] = useState<FareQuoteState>({
    status: 'loading',
    quote: null,
    error: null,
  });

  useEffect(() => {
    const requestId = latestRequestId.current + 1;
    latestRequestId.current = requestId;
    let isEffectActive = true;

    setState({ status: 'loading', quote: null, error: null });

    quoteFare(selection)
      .then((quote) => {
        if (isEffectActive && latestRequestId.current === requestId) {
          setState({ status: 'success', quote, error: null });
        }
      })
      .catch((error: unknown) => {
        if (isEffectActive && latestRequestId.current === requestId) {
          setState({ status: 'error', quote: null, error: toError(error) });
        }
      });

    return () => {
      isEffectActive = false;
    };
  }, [selection]);

  return state;
}
