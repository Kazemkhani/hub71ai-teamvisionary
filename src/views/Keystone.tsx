import type { ScheduledPlan } from '../model/plan';
import { OwnerChip } from './shared';

export function Keystone({ scheduled, onOpen }: { scheduled: ScheduledPlan; onOpen: (id: string, explain?: boolean) => void }) {
  const node = scheduled.nodes[scheduled.keystoneStep];
  if (!node) return null;
  return <section className="panel keystone" data-tour="keystone"><h2>Start here</h2><h3>{node.label}</h3>
    <p className="unlock-count">Unlocks <strong className="tnum">{scheduled.schedule[node.id].unlocks}</strong> steps</p>
    <div className="inline-between"><OwnerChip owner={node.owner} /><button onClick={() => onOpen(node.id, true)}>Explain</button></div>
  </section>;
}
