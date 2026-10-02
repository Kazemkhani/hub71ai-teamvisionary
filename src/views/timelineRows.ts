import type { Node, ScheduledPlan } from '../model/plan';
export interface TimelineRow { label: string; group?: boolean; nodes: Node[]; collapsed?: boolean }
export function timelineRows(scheduled: ScheduledPlan): TimelineRow[] {
  const nodes = Object.values(scheduled.nodes).filter((node) => scheduled.schedule[node.id]);
  const rows: TimelineRow[] = [{ label: 'Company', group: true, nodes: [] }];
  for (const node of nodes.filter((node) => !node.personId && !node.milestone)) rows.push({ label: node.label, nodes: [node] });
  rows.push({ label: 'People', group: true, nodes: [] });
  const people = scheduled.people.filter((person) => nodes.some((node) => node.personId === person.id));
  for (const person of people.filter((person) => person.family)) {
    rows.push({ label: `${person.name} · ${person.role}`, nodes: nodes.filter((node) => node.personId === person.id && !node.tags?.includes('family')) });
  }
  const otherPeople = people.filter((person) => !person.family);
  const otherIds = new Set(otherPeople.map((person) => person.id));
  if (otherPeople.length) rows.push({ label: `${otherPeople.length} more people, same path`,
    nodes: nodes.filter((node) => node.personId && otherIds.has(node.personId) && !node.tags?.includes('family')), collapsed: true });
  rows.push({ label: 'Families', group: true, nodes: [] });
  for (const node of nodes.filter((node) => node.tags?.includes('family'))) rows.push({ label: node.label, nodes: [node] });
  rows.push({ label: 'After go-live', group: true, nodes: [] });
  rows.push({ label: 'Obligation checkpoints', nodes: nodes.filter((node) => node.milestone && node.tags?.includes('obligation')) });
  return rows;
}
