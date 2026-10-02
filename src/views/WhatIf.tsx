import { useRef, useState } from 'react';
import type { Dispatch, FormEvent } from 'react';
import type { Plan } from '../model/plan';
import { aiClient } from '../ai/client';
import type { WhatIfResult } from '../ai/schemas';
import { BANKABLE_QUESTIONS } from '../data/banks';
import type { Action } from './state';

export function WhatIf({ plan, dispatch, onAiCall }: { plan: Plan; dispatch: Dispatch<Action>; onAiCall: () => void }) {
  const [question, setQuestion] = useState('');
  const [preview, setPreview] = useState<{ result: WhatIfResult; context: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const requestVersion = useRef(0);
  const current = { zone: plan.company.zone, headcount: plan.company.headcount, toggles: plan.toggles, bankable: { ...plan.bankable } };
  const context = JSON.stringify(current);
  async function ask(e: FormEvent) {
    e.preventDefault();
    const version = ++requestVersion.current;
    setBusy(true); setError(''); setPreview(null);
    try {
      const result = await aiClient.whatIf({ question: question.trim(), current });
      if (version === requestVersion.current) { setPreview({ result, context }); onAiCall(); }
    } catch { if (version === requestVersion.current) setError('The proposal could not be prepared. Try a shorter question.'); }
    finally { if (version === requestVersion.current) setBusy(false); }
  }
  const edits = preview ? [
    ...(preview.result.zone ? [`Jurisdiction: ${preview.result.zone}`] : []),
    ...(preview.result.headcount !== undefined ? [`Headcount: ${preview.result.headcount}`] : []),
    ...Object.entries(preview.result.toggles ?? {}).map(([key, value]) => `${key === 'kycEarly' ? 'KYC early' : key === 'chequeFree' ? 'Cheque-free rent' : 'Flexi-desk'}: ${value ? 'on' : 'off'}`),
    ...Object.entries(preview.result.bankable ?? {}).flatMap(([key, value]) => {
      const q = BANKABLE_QUESTIONS.find((item) => item.key === key);
      const option = q?.options.find((item) => item.value === value);
      return q && option ? [`${q.label}: ${option.label}`] : [];
    }),
    ...(preview.result.events ?? []).map((event) => `Setback: ${event.replaceAll('_', ' ')}`),
  ] : [];
  const stale = preview !== null && preview.context !== context;
  return <section className="panel what-if" data-tour="what-if"><h2>Ask a what-if</h2><p className="muted">A proposed change. Your decision to apply it.</p>
    <form onSubmit={ask}><label htmlFor="what-if-question" className="sr-only">Ask a what-if</label>
      <input id="what-if-question" value={question} maxLength={400} placeholder="What if rent is cheque-free?" onChange={(e) => setQuestion(e.target.value)} />
      <button className="primary" disabled={busy || question.trim().length < 3}>{busy ? 'Preparing proposal…' : 'Preview changes'}</button></form>
    {error && <p role="alert" className="critical-text">{error}</p>}
    {preview && <div className="proposal" aria-live="polite"><p>{preview.result.rationale}</p><div className="proposal-chips">{edits.map((edit) => <span key={edit}>{edit}</span>)}</div>
      {!edits.length && <p className="muted">No supported edits found. Name a jurisdiction, headcount or one of the three decisions.</p>}
      {stale && <p className="critical-text">Your plan changed. Preview this question again before applying it.</p>}
      <button disabled={!edits.length || stale} onClick={() => { dispatch({ type: 'applyWhatIf', result: preview.result }); setPreview(null); }}>Apply</button></div>}
  </section>;
}
