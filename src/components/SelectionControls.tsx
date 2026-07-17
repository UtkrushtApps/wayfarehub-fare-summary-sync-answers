import type { AddOnId, FareSelection } from '../types/fare';
import { ADD_ON_CATALOG } from '../data/fareFixtures';
import { getDefaultLocaleForCurrency } from '../utils/money';

interface SelectionControlsProps {
  selection: FareSelection;
  onChange: (next: FareSelection) => void;
}

export function SelectionControls({ selection, onChange }: SelectionControlsProps) {
  const setCount = (key: 'adults' | 'children', delta: number) => {
    const next = Math.max(key === 'adults' ? 1 : 0, selection[key] + delta);
    onChange({ ...selection, [key]: next });
  };

  const toggleAddOn = (id: AddOnId) => {
    const addOns = selection.addOns.includes(id)
      ? selection.addOns.filter((a) => a !== id)
      : [...selection.addOns, id];
    onChange({ ...selection, addOns });
  };

  const setCurrency = (currency: FareSelection['currency']) => {
    onChange({
      ...selection,
      currency,
      locale: getDefaultLocaleForCurrency(currency),
    });
  };

  return (
    <div className="selection-controls">
      <h2>Travelers &amp; Add-ons</h2>

      <div className="control-row">
        <span>Adults</span>
        <div className="stepper">
          <button aria-label="decrease adults" onClick={() => setCount('adults', -1)}>
            -
          </button>
          <span aria-label="adults count">{selection.adults}</span>
          <button aria-label="increase adults" onClick={() => setCount('adults', 1)}>
            +
          </button>
        </div>
      </div>

      <div className="control-row">
        <span>Children</span>
        <div className="stepper">
          <button aria-label="decrease children" onClick={() => setCount('children', -1)}>
            -
          </button>
          <span aria-label="children count">{selection.children}</span>
          <button aria-label="increase children" onClick={() => setCount('children', 1)}>
            +
          </button>
        </div>
      </div>

      {ADD_ON_CATALOG.map((addOn) => (
        <div className="control-row" key={addOn.id}>
          <label>
            <input
              type="checkbox"
              checked={selection.addOns.includes(addOn.id)}
              onChange={() => toggleAddOn(addOn.id)}
            />{' '}
            {addOn.label}
          </label>
        </div>
      ))}

      <div className="control-row">
        <span>Currency</span>
        <select
          aria-label="currency"
          value={selection.currency}
          onChange={(e) => setCurrency(e.target.value as FareSelection['currency'])}
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>
      </div>
    </div>
  );
}
