import { useEffect, useRef, useState } from 'react';

export const TOUR_STEPS = [
  { target: 'go-live', title: 'A date you can plan around', text: 'This is the date you can plan payroll around.' },
  { target: 'critical-path', title: 'Follow the red path', text: 'Red is the critical path. The bank gates the chequebook, the chequebook gates every lease.' },
  { target: 'bank-bar', title: 'A source behind every step', text: 'Click any step for its source and an explanation in English and Arabic.' },
  { target: 'bankable', title: 'Make the bank review predictable', text: 'Twelve questions set your rejection risk and review time.' },
  { target: 'toggles', title: 'Change the dependencies', text: 'Three decisions you can flip. Watch the date move.' },
  { target: 'obligations', title: 'See the cost of missing a date', text: 'Hidden obligations in dirhams.' },
  { target: 'next-actions', title: 'Know what to start today', text: 'What to start today, ranked by what it unlocks. The Start here card identifies the strongest first step.' },
  { target: 'what-if', title: 'Ask, preview, then apply', text: 'Ask in plain words. The model proposes edits, the engine does the dates.' },
] as const;

export function Tour({ onClose, onPrepare }: { onClose: () => void; onPrepare: (bankOpen: boolean) => void }) {
  const [step, setStep] = useState(0);
  const [bounds, setBounds] = useState({ left: 8, top: 8, width: 1, height: 1 });
  const dialog = useRef<HTMLDialogElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const close = useRef(onClose); close.current = onClose;
  useEffect(() => {
    const element = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    element?.showModal();
    return () => { element?.close(); if (previous?.isConnected) previous.focus(); };
  }, []);
  useEffect(() => {
    onPrepare(step === 3);
    let frame = 0;
    let attempts = 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const measure = () => {
      const target = document.querySelector<HTMLElement>(`[data-tour="${TOUR_STEPS[step].target}"]`);
      if (!target) { if (attempts++ < 30) frame = requestAnimationFrame(measure); return; }
      const rect = target.getBoundingClientRect();
      setBounds({ left: Math.max(8, rect.left - 6), top: Math.max(8, rect.top - 6),
        width: Math.max(1, Math.min(window.innerWidth - 16, rect.width + 12)),
        height: Math.max(1, Math.min(window.innerHeight - Math.max(8, rect.top) - 8, rect.height + 12)) });
    };
    frame = requestAnimationFrame(() => {
      const target = document.querySelector<HTMLElement>(`[data-tour="${TOUR_STEPS[step].target}"]`);
      target?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'center', inline: 'nearest' });
      measure();
    });
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    card.current?.querySelector<HTMLButtonElement>('button')?.focus();
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', measure); window.removeEventListener('scroll', measure, true); };
  }, [step, onPrepare]);
  useEffect(() => {
    const keys = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopImmediatePropagation(); close.current(); }
      if (event.key === 'ArrowRight') { event.preventDefault(); if (step === TOUR_STEPS.length - 1) close.current(); else setStep((value) => value + 1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); setStep((value) => Math.max(0, value - 1)); }
    };
    window.addEventListener('keydown', keys, true);
    return () => window.removeEventListener('keydown', keys, true);
  }, [step]);
  const cardHeight = 250;
  const below = bounds.top + bounds.height + 16;
  const top = below + cardHeight < window.innerHeight ? below : Math.max(12, Math.min(bounds.top - cardHeight - 16, window.innerHeight - cardHeight - 12));
  const left = Math.max(12, Math.min(bounds.left, window.innerWidth - 372));
  return <dialog ref={dialog} className="tour-dialog" aria-labelledby="tour-title" aria-describedby="tour-text"
    onCancel={(event) => { event.preventDefault(); onClose(); }}>
    <div className="tour-spotlight" style={bounds} aria-hidden="true" />
    <div className="tour-card" ref={card} style={{ top, left }}><div className="inline-between"><span className="tour-counter">{step + 1} of {TOUR_STEPS.length}</span><button className="text-button" onClick={onClose}>Skip</button></div>
      <h2 id="tour-title">{TOUR_STEPS[step].title}</h2><p id="tour-text">{TOUR_STEPS[step].text}</p>
      <div className="tour-actions"><button disabled={step === 0} onClick={() => setStep((value) => value - 1)}>Back</button><button className="primary" onClick={() => step === TOUR_STEPS.length - 1 ? onClose() : setStep((value) => value + 1)}>{step === TOUR_STEPS.length - 1 ? 'Finish' : 'Next'}</button></div>
      <p className="tour-keyboard">Arrow keys to navigate. Esc to close.</p>
    </div>
  </dialog>;
}
