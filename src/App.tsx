// OWNED BY PACK B (screen). Base stub renders the fixture so the pipeline is proven end to end.
import { useMemo, useReducer } from 'react';
import { pipeline } from './engine/pipeline';
import { PRESET_A } from './data/presets';
import type { Plan } from './model/plan';

type Action = { type: 'replace'; plan: Plan };
function reducer(_state: Plan, action: Action): Plan {
  switch (action.type) {
    case 'replace':
      return action.plan;
  }
}

export default function App() {
  const [plan] = useReducer(reducer, PRESET_A);
  const scheduled = useMemo(() => pipeline(plan), [plan]);
  return (
    <main className="p-6 font-body">
      <h1 className="font-display text-3xl font-bold">Landing Sequence</h1>
      <p className="text-muted mt-2">Base stub. Go-live day {scheduled.goLiveDay.toFixed(1)} ({scheduled.goLiveDate}).</p>
      <pre className="mt-4 text-xs bg-surface2 p-3 overflow-auto">{JSON.stringify(scheduled.criticalPath, null, 2)}</pre>
    </main>
  );
}
