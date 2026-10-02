import { useState } from 'react';
import type { Node, ScheduledPlan } from '../model/plan';
import { formatDay } from '../model/plan';
import { timelineRows } from './timelineRows';
import { days, OwnerChip } from './shared';

export function Timeline({ scheduled, onOpen }: { scheduled: ScheduledPlan; onOpen: (id: string) => void }) {
  const [tooltip, setTooltip] = useState<{ node: Node; x: number; y: number } | null>(null);
  const rows = timelineRows(scheduled);
  const maxFinish = Math.max(scheduled.goLiveDay, ...Object.values(scheduled.schedule).map((item) => item.finish));
  const weeks = Math.ceil(maxFinish / 7) + 1;
  const labelWidth = 250;
  const scale = 4;
  const width = Math.max(900, labelWidth + weeks * 7 * scale + 32);
  const rowHeight = 36;
  const axisHeight = 90;
  const height = axisHeight + rows.length * rowHeight + 24;
  const x = (day: number) => labelWidth + day * scale;
  const start = new Date(`${scheduled.company.startDate}T00:00:00Z`);
  const months: Array<{ day: number; label: string }> = [];
  const firstMonth = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 1));
  for (let date = firstMonth; date.getTime() <= start.getTime() + weeks * 7 * 86400000;
    date = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1))) {
    const day = Math.max(0, (date.getTime() - start.getTime()) / 86400000);
    months.push({ day, label: new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(date) });
  }
  const showTooltip = (node: Node, rect: DOMRect) => setTooltip({ node,
    x: Math.max(8, Math.min(rect.left, window.innerWidth - 352)), y: Math.max(8, Math.min(rect.bottom + 8, window.innerHeight - 240)) });
  function bar(node: Node, y: number) {
    const item = scheduled.schedule[node.id];
    const risk = node.milestone ? 0 : (node.pReject ?? 0) * (node.retryDays ?? node.medianDays);
    const baseWidth = Math.max(2, (item.expectedDays - risk) * scale);
    const colour = item.onCriticalPath ? '#C13A2E' : '#0E7A78';
    const title = `${node.label}. ${item.onCriticalPath ? 'Critical path. ' : ''}${days(item.expectedDays)} days, ${formatDay(scheduled.company.startDate, item.start)} to ${formatDay(scheduled.company.startDate, item.finish)}. ${node.source}`;
    return <g key={node.id} className="timeline-step" data-node={node.id} data-tour={node.id === 'bank_account' ? 'bank-bar' : undefined}
      role="button" tabIndex={0} aria-label={title} onClick={() => onOpen(node.id)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(node.id); } }}
      onMouseEnter={(e) => showTooltip(node, e.currentTarget.getBoundingClientRect())}
      onMouseLeave={() => setTooltip(null)} onFocus={(e) => showTooltip(node, e.currentTarget.getBoundingClientRect())} onBlur={() => setTooltip(null)}>
      <title>{title}</title>
      <rect className="bar-hit" x={x(item.start) - 3} y={y - 4} width={node.milestone ? 20 : baseWidth + risk * scale + 6} height={28} fill="transparent" />
      {node.milestone ? <path d={`M ${x(item.start)} ${y + 3} l 6 6 l -6 6 l -6 -6 Z`} fill={colour} />
        : <><rect className="schedule-bar" x={x(item.start)} y={y} width={baseWidth} height={18} rx={2} fill={colour} opacity={item.onCriticalPath ? 1 : 0.85} />
          {baseWidth > 100 && <text x={x(item.start) + 5} y={y + 13} className="bar-label">{days(node.medianDays)} days</text>}
          {risk > 0 && <><rect className="schedule-bar retry-bar" x={x(item.start) + baseWidth} y={y} width={risk * scale} height={18}
            fill={colour} fillOpacity={0.35} stroke={colour} strokeDasharray="3 2" />
            <text x={x(item.finish) + 6} y={y + 13} className="risk-label">{Math.round((node.pReject ?? 0) * 100)}% retry risk</text></>}
        </>}
      {node.milestone && <text x={x(item.start) + 12} y={y + 13} className="milestone-label">{node.label}</text>}
    </g>;
  }
  return <section className="panel timeline-panel" data-tour="critical-path"><div className="section-heading"><div><h2>Your landing sequence</h2><p className="muted">The steps between a decision and day one.</p></div>
    <div className="timeline-legend"><span><i className="legend-critical" />Critical path</span><span><i className="legend-normal" />Parallel work</span><span>◇ Checkpoint</span></div></div>
    <p className="timeline-hint">Select a step for its dependencies, source and next action. Scroll horizontally for later checkpoints.</p>
    <div className="timeline-scroll" tabIndex={0} role="region" aria-label="Relocation timeline, scroll horizontally">
      <svg width={width} height={height} className="timeline-svg" aria-label={`Relocation schedule. Go-live ${scheduled.goLiveDate}. Red steps are on the critical path.`}>
        <text x={16} y={42} className="axis-label">Week</text>
        {months.map((month) => <text key={month.label} x={x(month.day) + 3} y={18} className="month-label">{month.label}</text>)}
        {Array.from({ length: weeks + 1 }, (_, week) => <g key={week}><line x1={x(week * 7)} x2={x(week * 7)} y1={48} y2={height - 10} stroke="#CFD9E1" strokeWidth={0.6} />
          <text x={x(week * 7)} y={42} className="axis-label">{week}</text></g>)}
        {rows.map((row, index) => {
          const y = axisHeight + index * rowHeight;
          return <g key={`${row.label}-${index}`}>{row.group ? <><rect x={0} y={y - 5} width={width} height={30} fill="#E9EEF2" /><text x={16} y={y + 14} className="group-label">{row.label}</text></>
            : <><text x={16} y={y + 13} className="row-label"><title>{row.label}</title>{row.label.length > 34 ? `${row.label.slice(0, 32)}…` : row.label}</text>
              {row.collapsed && row.nodes.length ? (() => {
                const first = row.nodes.reduce((a, b) => scheduled.schedule[a.id].start <= scheduled.schedule[b.id].start ? a : b);
                const min = Math.min(...row.nodes.map((node) => scheduled.schedule[node.id].start));
                const max = Math.max(...row.nodes.map((node) => scheduled.schedule[node.id].finish));
                return <g role="button" tabIndex={0} aria-label={`${row.label}, day ${days(min)} to ${days(max)}. Open a representative step.`}
                  onClick={() => onOpen(first.id)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(first.id); } }}>
                  <rect x={x(min)} y={y} width={Math.max(2, (max - min) * scale)} height={18} rx={2} fill={row.nodes.some((node) => scheduled.schedule[node.id].onCriticalPath) ? '#C13A2E' : '#0E7A78'} opacity={0.85} />
                  <text x={x(min) + 6} y={y + 13} className="bar-label">{row.label}</text></g>;
              })() : row.nodes.map((node) => bar(node, y))}</>}
          </g>;
        })}
        <line className="go-live-line" x1={x(scheduled.goLiveDay)} x2={x(scheduled.goLiveDay)} y1={68} y2={height - 8} stroke="#C13A2E" strokeWidth={1.5} strokeDasharray="5 4" />
        <text x={x(scheduled.goLiveDay) + 7} y={63} className="go-live-axis">Go-live {scheduled.goLiveDate}</text>
      </svg>
    </div>
    {tooltip && <div className="timeline-tooltip" role="tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
      <strong>{tooltip.node.label}</strong><OwnerChip owner={tooltip.node.owner} /><p>Median {days(tooltip.node.medianDays)} d · p80 {days(tooltip.node.p80Days)} d · expected {days(scheduled.schedule[tooltip.node.id].expectedDays)} d</p>
      <p>{formatDay(scheduled.company.startDate, scheduled.schedule[tooltip.node.id].start)} → {formatDay(scheduled.company.startDate, scheduled.schedule[tooltip.node.id].finish)}</p><p className="tooltip-source">{tooltip.node.source}</p></div>}
  </section>;
}
