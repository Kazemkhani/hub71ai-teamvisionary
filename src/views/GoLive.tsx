import { useEffect, useRef, useState } from 'react';
import type { ScheduledPlan } from '../model/plan';
import { days } from './shared';

function useTween(value: number) {
  const [display, setDisplay] = useState(value);
  const previous = useRef(value);
  useEffect(() => {
    const startValue = previous.current;
    previous.current = value;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setDisplay(value); return; }
    let frame = 0;
    const started = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - started) / 300);
      setDisplay(startValue + (value - startValue) * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return display;
}

export function GoLive({ scheduled }: { scheduled: ScheduledPlan }) {
  const animated = useTween(scheduled.goLiveDay);
  const saved = Math.max(0, scheduled.goLiveDay - scheduled.idealGoLiveDay);
  return <section className="go-live-card" data-tour="go-live" aria-labelledby="go-live-title">
    <h2 id="go-live-title">Go-live</h2><p className="go-live-date">{scheduled.goLiveDate}</p>
    <div className="week-readout tnum"><span>week</span> {(animated / 7).toFixed(1)}</div>
    <p className="muted">Paid, housed, legally working.</p>
    <div className="opportunity"><span className={saved > 0 ? 'critical-text' : 'accent-text'}>{days(saved)} days left on the table</span>
      <span className="muted">With all preparation in place: week {(scheduled.idealGoLiveDay / 7).toFixed(1)}</span></div>
  </section>;
}
