import type { Dispatch } from 'react';
import type { Plan, StuckEvent, Toggles as ToggleValues } from '../model/plan';
import type { Action } from './state';

const CHOICES: Array<{ key: keyof ToggleValues; label: string; detail: string }> = [
  { key: 'kycEarly', label: 'KYC early', detail: 'Prepare the bank KYC pack before the licence issues' },
  { key: 'chequeFree', label: 'Cheque-free rent', detail: 'Landlord accepts direct debit or employer guarantee, no cheques' },
  { key: 'flexiDesk', label: 'Flexi-desk', detail: 'Flexi-desk counts as the registered office for the visa file' },
];
const EVENTS: Record<StuckEvent, string> = { bank_rejected: 'Bank rejected us', landlord_delayed: 'Landlord delayed the lease', school_waitlisted: 'School waitlisted' };

export function Toggles({ plan, dispatch }: { plan: Plan; dispatch: Dispatch<Action> }) {
  return <section className="panel decisions" data-tour="toggles"><div className="section-heading"><h2>Three decisions that move the date</h2><span className="muted">Recalculated instantly</span></div>
    <div className="toggle-grid">{CHOICES.map(({ key, label, detail }) => <label className="toggle-row" key={key}>
      <input role="switch" type="checkbox" checked={plan.toggles[key]} onChange={(e) => dispatch({ type: 'setToggle', key, value: e.target.checked })} />
      <span className="switch-track" aria-hidden="true" /><span><strong>{label}</strong><span>{detail}</span></span>
    </label>)}</div>
    <div className="setbacks"><label>Something went wrong<select value="" onChange={(e) => { if (e.target.value) dispatch({ type: 'addEvent', event: e.target.value as StuckEvent }); }}>
      <option value="">Add a setback</option>{Object.entries(EVENTS).map(([key, text]) => <option key={key} value={key}>{text}</option>)}
    </select></label><div className="event-chips" aria-live="polite">{(plan.events ?? []).map((event) => <span className="event-chip" key={event}>{EVENTS[event]}</span>)}</div>
      <button onClick={() => dispatch({ type: 'clearEvents' })} disabled={!plan.events?.length}>Clear</button></div>
  </section>;
}
