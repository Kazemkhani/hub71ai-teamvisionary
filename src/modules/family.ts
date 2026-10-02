import type { Node, Plan } from '../model/plan';
import { GO_LIVE_LABEL, PERSON_STEPS } from '../data/steps';

export function family(plan: Plan): Plan {
  const nodes = { ...plan.nodes };
  const permits: string[] = [];
  const leases: string[] = [];
  for (const person of plan.people) {
    const seats: string[] = [];
    for (const step of PERSON_STEPS) {
      if (step.appliesWhen === 'skilled' && !person.skilled) continue;
      if (step.appliesWhen === 'perKid') {
        for (const [index, kid] of (person.family?.kids ?? []).entries()) {
          const id = `${step.id}@${person.id}-${index}`;
          nodes[id] = {
            id, personId: person.id, owner: step.owner, source: step.source,
            label: `School seat (${kid.yearGroup}, ${kid.curriculum})`,
            medianDays: typeof step.medianDays === 'number' ? step.medianDays : step.medianDays[kid.curriculum],
            p80Days: typeof step.p80Days === 'number' ? step.p80Days : step.p80Days[kid.curriculum],
            dependsOn: [...step.dependsOn], tags: ['family'],
          };
          seats.push(id);
        }
        continue;
      }
      const id = `${step.id}@${person.id}`;
      const node: Node = {
        id, label: step.label, owner: step.owner, source: step.source, personId: person.id,
        medianDays: typeof step.medianDays === 'number' ? step.medianDays : 0,
        p80Days: typeof step.p80Days === 'number' ? step.p80Days : 0,
        dependsOn: step.dependsOn.filter((dep) => person.skilled || dep !== 'degree_attestation@self')
          .map((dep) => dep.replace('@self', `@${person.id}`)),
      };
      nodes[id] = node;
      if (step.id === 'work_permit_visa') permits.push(id);
      if (step.id === 'residential_lease') leases.push(id);
    }
    if (seats.length) {
      const id = `family_settled@${person.id}`;
      nodes[id] = { id, label: 'Family settled', owner: 'company', personId: person.id,
        medianDays: 0, p80Days: 0, milestone: true, tags: ['family'],
        source: 'Family settlement requires a residential lease and a seat for each child.',
        dependsOn: [`residential_lease@${person.id}`, ...seats] };
    }
  }
  nodes.go_live = { id: 'go_live', label: GO_LIVE_LABEL, owner: 'company', medianDays: 0, p80Days: 0,
    milestone: true, dependsOn: ['bank_account', ...permits, ...leases],
    source: 'Operational when the bank account, work permits and residential leases are ready.' };
  return { ...plan, nodes };
}
