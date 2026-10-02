import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { pipeline } from './engine/pipeline';
import { PRESET_A } from './data/presets';
import { aiState } from './ai/client';
import type { AiMode } from './ai/client';
import { planReducer } from './views/state';
import { TopBar } from './views/TopBar';
import { Timeline } from './views/Timeline';
import { GoLive } from './views/GoLive';
import { Keystone } from './views/Keystone';
import { StartToday } from './views/StartToday';
import { Toggles } from './views/Toggles';
import { ObligationCards } from './views/ObligationCards';
import { WhatIf } from './views/WhatIf';
import { NodeDrawer } from './views/NodeDrawer';
import { Tour } from './views/Tour';
import { startAutoplay } from './views/Autoplay';

// Define the product icon before load so the browser does not request a missing favicon.
if (!document.querySelector('link[rel="icon"]')) {
  const icon = document.createElement('link');
  icon.rel = 'icon';
  icon.href = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#0E7A78"/><path d="M7 9h12v4H7zm4 6h14v4H11zm8 6h6v4h-6z" fill="white"/></svg>');
  document.head.appendChild(icon);
}

export default function App() {
  const [plan, dispatch] = useReducer(planReducer, PRESET_A);
  const scheduled = useMemo(() => pipeline(plan), [plan]);
  const [selected, setSelected] = useState<string | null>(null);
  const [explainToken, setExplainToken] = useState(0);
  const [mode, setMode] = useState<AiMode | null>(null);
  const [tourOpen, setTourOpen] = useState(false);
  const [tourOffer, setTourOffer] = useState(() => {
    try { return localStorage.getItem('landing-sequence-tour-seen') !== 'true'; }
    catch { return true; } // Storage may be disabled; offer the tour for this session.
  });
  const [storageNote, setStorageNote] = useState('');
  const [demo, setDemo] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [caption, setCaption] = useState('');
  const [demoTarget, setDemoTarget] = useState('');
  const cancelDemo = useRef<(() => void) | null>(null);
  const openNode = useCallback((id: string, explain = false) => {
    setSelected(id); setExplainToken((value) => explain ? value + 1 : 0);
  }, []);
  const closeNode = useCallback(() => { setSelected(null); setExplainToken(0); }, []);
  const stopDemo = useCallback(() => {
    cancelDemo.current?.(); cancelDemo.current = null;
    setDemo('idle'); setCaption(''); setDemoTarget(''); closeNode();
  }, [closeNode]);
  const startDemo = useCallback(() => {
    cancelDemo.current?.(); setTourOpen(false); closeNode(); setDemo('playing');
    cancelDemo.current = startAutoplay((step) => {
      if (step.action) dispatch(step.action);
      if (step.close) closeNode();
      if (step.open) openNode(step.open, step.explain);
      if (step.target) setDemoTarget(step.target);
      setCaption(step.caption);
      if (step.end) { setDemo('ended'); setDemoTarget(''); }
    });
  }, [closeNode, openNode]);
  useEffect(() => () => cancelDemo.current?.(), []);
  useEffect(() => {
    if (demo === 'idle') return;
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopImmediatePropagation(); stopDemo(); }
    };
    window.addEventListener('keydown', key, true);
    return () => window.removeEventListener('keydown', key, true);
  }, [demo, stopDemo]);
  useEffect(() => {
    if (!demoTarget || demo !== 'playing') return;
    let target: Element | null = null;
    const frame = requestAnimationFrame(() => {
      target = document.querySelector(`[data-tour="${demoTarget}"]`);
      target?.classList.add('demo-highlight');
      target?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' });
    });
    return () => { cancelAnimationFrame(frame); target?.classList.remove('demo-highlight'); };
  }, [demoTarget, demo, selected]);
  const prepareTour = useCallback((bankOpen: boolean) => { if (bankOpen) openNode('bank_account'); else closeNode(); }, [openNode, closeNode]);
  const finishTour = () => {
    setTourOpen(false); setTourOffer(false); closeNode();
    try { localStorage.setItem('landing-sequence-tour-seen', 'true'); }
    catch { setStorageNote('Walkthrough preference is saved for this session only.'); }
  };
  const reportAiCall = useCallback(() => setMode(aiState.lastMode), []);
  const demoCaption = demo !== 'idle' ? <div className={`demo-caption ${demo === 'ended' ? 'demo-end' : ''}`} role="status" aria-live="polite">
      <div><span className="demo-caption-label">{demo === 'ended' ? 'Demo complete' : '90-second walkthrough'}</span><p>{caption}</p>
        {demo === 'playing' && <span className="demo-metrics tnum">Week {(scheduled.goLiveDay / 7).toFixed(1)} · bank risk {Math.round((scheduled.nodes.bank_account?.pReject ?? 0) * 100)}%</span>}</div>
      <div className="demo-caption-actions">{demo === 'ended' && <button className="primary" onClick={startDemo}>Replay</button>}<button onClick={stopDemo}>{demo === 'ended' ? 'Back to plan' : 'Stop demo'}</button></div>
    </div> : null;
  return <div className="product-shell"><a className="skip-link" href="#planner">Skip to planner</a>
    <TopBar plan={plan} dispatch={dispatch} demoMode={mode === 'mock'}
      onTour={() => { stopDemo(); setTourOpen(true); }} onDemo={startDemo} />
    {tourOffer && !tourOpen && demo === 'idle' && <div className="tour-banner"><span>New here? Follow the date from the bank to day one.</span><button onClick={() => setTourOpen(true)}>Take the walkthrough</button><button className="text-button" onClick={finishTour}>Dismiss</button></div>}
    {storageNote && <p className="storage-note" role="status">{storageNote}</p>}
    <main id="planner" className="planner-grid"><div className="main-column"><div className="plan-heading"><div><h1>{plan.company.name}</h1><p className="muted">{plan.company.headcount} people · {plan.company.activity} · {plan.company.district}</p></div><span className="plan-status">Scenario plan</span></div>
      <Timeline scheduled={scheduled} onOpen={openNode} /><Toggles plan={plan} dispatch={dispatch} /><ObligationCards scheduled={scheduled} onOpen={openNode} />
    </div><aside className="decision-rail" aria-label="Go-live and next actions"><GoLive scheduled={scheduled} /><div className="next-actions" data-tour="next-actions"><Keystone scheduled={scheduled} onOpen={openNode} /><StartToday scheduled={scheduled} onOpen={openNode} /></div>
      <WhatIf plan={plan} dispatch={dispatch} onAiCall={reportAiCall} /></aside></main>
    <footer className="product-footer"><span>Landing Sequence</span><span>Durations have sources. Dates have dependencies.</span></footer>
    {selected && scheduled.nodes[selected] && <NodeDrawer key={`${plan.company.name}:${selected}`} id={selected} plan={plan} scheduled={scheduled} dispatch={dispatch}
      onClose={closeNode} onOpen={openNode} onAiCall={reportAiCall} explainToken={explainToken} footer={demoCaption} tourActive={tourOpen} />}
    {tourOpen && <Tour onClose={finishTour} onPrepare={prepareTour} />}
    {!selected && demoCaption}
  </div>;
}
