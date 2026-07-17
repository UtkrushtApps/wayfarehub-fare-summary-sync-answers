import { useState } from 'react';
import { SelectionControls } from './components/SelectionControls';
import { FareSummaryPanel } from './components/FareSummaryPanel';
import { initialSelection } from './data/fareFixtures';
import type { FareSelection } from './types/fare';

export function App() {
  const [selection, setSelection] = useState<FareSelection>(initialSelection);

  return (
    <div className="checkout">
      <SelectionControls selection={selection} onChange={setSelection} />
      <FareSummaryPanel selection={selection} />
    </div>
  );
}
