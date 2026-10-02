import type { ScheduledPlan } from '../model/plan';
import { days, OwnerChip } from './shared';

export function StartToday({ scheduled, onOpen }: { scheduled: ScheduledPlan; onOpen: (id: string) => void }) {
  return <section className="panel" data-tour="start-today"><h2>Start today</h2><p className="muted">Work that can begin in parallel.</p>
    <ul className="start-list">{scheduled.startToday.map((id) => {
      const node = scheduled.nodes[id];
      const duration = days(scheduled.schedule[id].expectedDays);
      return <li key={id}><button className="text-button" onClick={() => onOpen(id)}>{node.label}</button><OwnerChip owner={node.owner} />
        <p>{id.startsWith('school_seat@') ? `Apply now: allow ${duration} days for this school seat.`
          : id === 'parent_docs_attestation' ? `${duration} days before the licence can be filed.` : `${duration} days; no earlier step is required.`}</p></li>;
    })}</ul>
  </section>;
}
