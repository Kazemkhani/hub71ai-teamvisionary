import type { Plan } from '../model/plan';
import { EVENT_DELAYS, EVENT_DELAY_SOURCE } from '../data/events';

export function events(plan: Plan): Plan {
  const active = new Set(plan.events ?? []);
  const waitlistedSeats = new Set(plan.people.flatMap((person) =>
    (person.family?.kids ?? []).flatMap((kid, index) => kid.curriculum === 'UK' || kid.curriculum === 'IB'
      ? [`school_seat@${person.id}-${index}`] : [])));
  const nodes = Object.fromEntries(Object.entries(plan.nodes).map(([id, node]) => {
    let delay = 0;
    if (active.has('bank_rejected') && id === 'bank_account') delay += node.retryDays ?? 0;
    if (active.has('landlord_delayed') && id.startsWith('residential_lease@')) delay += EVENT_DELAYS.landlord_delayed;
    if (active.has('school_waitlisted') && waitlistedSeats.has(id)) delay += EVENT_DELAYS.school_waitlisted;
    return [id, { ...node, medianDays: node.medianDays + delay,
      source: delay && id !== 'bank_account' ? `${node.source} ${EVENT_DELAY_SOURCE}` : node.source }];
  }));
  return { ...plan, nodes };
}
