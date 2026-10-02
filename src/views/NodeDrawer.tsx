import { useEffect, useRef, useState } from 'react';
import type { Dispatch, ReactNode } from 'react';
import type { Plan, ScheduledPlan } from '../model/plan';
import { formatDay } from '../model/plan';
import { aiClient } from '../ai/client';
import type { DraftResult, ExplainResult } from '../ai/schemas';
import { BankableForm } from './BankableForm';
import { days, OwnerChip } from './shared';
import type { Action } from './state';

export function NodeDrawer({ id, plan, scheduled, dispatch, onClose, onOpen, onAiCall, explainToken, footer, tourActive }: {
  id: string; plan: Plan; scheduled: ScheduledPlan; dispatch: Dispatch<Action>;
  onClose: () => void; onOpen: (id: string, explain?: boolean) => void; onAiCall: () => void; explainToken: number; footer?: ReactNode; tourActive: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [explanation, setExplanation] = useState<ExplainResult | null>(null);
  const [draft, setDraft] = useState<DraftResult | null>(null);
  const [busy, setBusy] = useState<'explain' | 'draft' | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');
  const version = useRef(0);
  const node = scheduled.nodes[id];
  const item = scheduled.schedule[id];
  const latest = useRef({ plan, scheduled });
  latest.current = { plan, scheduled };
  useEffect(() => {
    const element = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    if (element && !element.open) { if (tourActive) element.show(); else element.showModal(); }
    return () => { version.current++; element?.close(); if (previous?.isConnected) previous.focus(); };
  }, [tourActive]);
  async function explain() {
    const request = ++version.current;
    const current = latest.current;
    const currentNode = current.scheduled.nodes[id];
    const timing = current.scheduled.schedule[id];
    setBusy('explain'); setError('');
    try {
      const result = await aiClient.explain({ nodeId: id, label: currentNode.label, owner: currentNode.owner,
        startDay: timing.start, finishDay: timing.finish, expectedDays: timing.expectedDays,
        onCriticalPath: timing.onCriticalPath, unlocks: timing.unlocks,
        companyName: current.plan.company.name, zone: current.plan.company.zone, source: currentNode.source });
      if (request === version.current) { setExplanation(result); onAiCall(); }
    } catch { if (request === version.current) setError('The explanation could not be prepared. Try again.'); }
    finally { if (request === version.current) setBusy(null); }
  }
  useEffect(() => { if (explainToken > 0) void explain(); }, [explainToken]);
  async function prepareDraft() {
    const request = ++version.current;
    setBusy('draft'); setError('');
    const person = plan.people.find((person) => person.id === node.personId);
    try {
      const result = await aiClient.draft({ template: id === 'bank_account' ? 'bank_cover_letter' : 'landlord_direct_debit', tone: 'formal',
        context: { companyName: plan.company.name, activity: plan.company.activity, zone: plan.company.zone,
          headcount: String(plan.company.headcount), inflows: `AED ${plan.company.ownership.expectedMonthlyInflowsAED}`,
          origin: plan.company.ownership.parentJurisdiction, employeeName: person?.name ?? '', tenantName: person?.name ?? '',
          role: person?.role ?? '', salary: String(person?.basicSalaryAED ?? ''), address: plan.company.district } });
      if (request === version.current) { setDraft(result); onAiCall(); }
    } catch { if (request === version.current) setError('The draft could not be prepared. Try again.'); }
    finally { if (request === version.current) setBusy(null); }
  }
  async function copy(text: string, language: string) {
    try { await navigator.clipboard.writeText(text); setCopied(`${language} copied`); }
    catch { setCopied('Clipboard unavailable. Select the text and copy it manually.'); }
  }
  if (!node || !item) return null;
  return <dialog ref={dialog} className="node-drawer" aria-labelledby="drawer-title" onCancel={(e) => { e.preventDefault(); onClose(); }}
    onClick={(e) => { const rect = e.currentTarget.getBoundingClientRect(); if (e.target === e.currentTarget && (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom)) onClose(); }}>
    <header className="drawer-header"><span>Step details</span><button onClick={onClose} aria-label="Close step details" autoFocus>Close</button></header>
    <div className="drawer-body"><h2 id="drawer-title">{node.label}</h2><div className="node-status"><OwnerChip owner={node.owner} />{item.onCriticalPath && <span className="critical-tag">Critical path</span>}</div>
      <p className="duration-readout tnum">Median {days(node.medianDays)} d · p80 {days(node.p80Days)} d · expected {days(item.expectedDays)} d</p>
      <dl className="node-dates"><div><dt>Start</dt><dd>{formatDay(plan.company.startDate, item.start)}</dd></div><div><dt>Finish</dt><dd>{formatDay(plan.company.startDate, item.finish)}</dd></div></dl>
      {item.start === 0 && !node.milestone && <p className="start-today-line">Start today: no earlier step is required.</p>}
      <h3>Depends on</h3>{node.dependsOn.length ? <ul className="dependency-list">{node.dependsOn.map((dependency) => <li key={dependency}><button className="text-button" onClick={() => onOpen(dependency)}>{scheduled.nodes[dependency]?.label ?? dependency}</button></li>)}</ul> : <p className="muted">No earlier step required.{node.anchor ? ` Anchored to ${scheduled.nodes[node.anchor]?.label ?? node.anchor}.` : ''}</p>}
      <h3>Source</h3><p className="source-text">{node.source}</p>
      <div className="drawer-actions"><button className="primary" disabled={busy !== null} onClick={() => void explain()}>{busy === 'explain' ? 'Explaining…' : 'Explain'}</button>
        {(id === 'bank_account' || id.startsWith('residential_lease@')) && <button disabled={busy !== null} onClick={() => void prepareDraft()}>{busy === 'draft' ? 'Drafting…' : 'Draft'}</button>}</div>
      {error && <p role="alert" className="critical-text">{error}</p>}
      {explanation && <section className="ai-output" aria-live="polite"><h3>Explanation</h3><p lang="en">{explanation.en}</p><p lang="ar" dir="rtl">{explanation.ar}</p><div className="action-today"><strong>Action today</strong><p>{explanation.actionToday}</p></div></section>}
      {draft && <section className="ai-output" aria-live="polite"><h3>{draft.subject}</h3><div className="draft-columns"><div><h4>English</h4><p className="draft-text" lang="en">{draft.en}</p><button onClick={() => void copy(`${draft.subject}\n\n${draft.en}`, 'English')}>Copy English</button></div>
        <div><h4>Arabic</h4><p className="draft-text" lang="ar" dir="rtl">{draft.ar}</p><button onClick={() => void copy(`${draft.subject}\n\n${draft.ar}`, 'Arabic')}>Copy Arabic</button></div></div><p role="status">{copied}</p></section>}
      {id === 'bank_account' && <BankableForm plan={plan} scheduled={scheduled} dispatch={dispatch} />}
    </div>
    {footer}
  </dialog>;
}
