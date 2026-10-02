import type { Dispatch } from 'react';
import type { Plan, Zone } from '../model/plan';
import { ZONES } from '../data/zones';
import { PRESETS } from '../data/presets';
import type { Action } from './state';

export function TopBar({ plan, dispatch, demoMode, onTour, onDemo }: {
  plan: Plan; dispatch: Dispatch<Action>; demoMode: boolean; onTour: () => void; onDemo: () => void;
}) {
  return <header className="topbar">
    <div className="topbar-brand"><a className="wordmark" href="/">Landing Sequence<span className="wordmark-dot" aria-hidden="true" /></a>
      <span className="product-descriptor">Abu Dhabi relocation planner</span>
      {demoMode && <span className="demo-pill" role="status">Demo mode</span>}
    </div>
    <div className="topbar-controls">
      <fieldset className="preset-control"><legend>Company preset</legend><div className="segments">
        {(['A', 'B'] as const).map((key) => <button key={key} aria-pressed={plan.company.name === PRESETS[key].company.name}
          onClick={() => dispatch({ type: 'setPreset', preset: key })}>{key === 'A' ? 'Northline Payments, ADGM' : 'Gulf Reach Logistics, mainland'}</button>)}
      </div></fieldset>
      <label>Jurisdiction<select value={plan.company.zone} onChange={(e) => dispatch({ type: 'setZone', zone: e.target.value as Zone })}>
        {Object.entries(ZONES).map(([key, rule]) => <option key={key} value={key}>{rule.label}</option>)}
      </select></label>
      <label className="headcount-field">Headcount<input type="number" min="1" max="10000" step="1" value={plan.company.headcount}
        onChange={(e) => dispatch({ type: 'setHeadcount', value: e.target.valueAsNumber })} /></label>
      <label>Start date<input type="date" value={plan.company.startDate}
        onChange={(e) => dispatch({ type: 'setStartDate', value: e.target.value })} /></label>
      <div className="topbar-actions"><button onClick={onTour}>Walkthrough</button><button className="primary" onClick={onDemo}>Play demo</button></div>
    </div>
  </header>;
}
