import type { Plan, Scheduled, ScheduledPlan } from '../model/plan';
import { formatDay } from '../model/plan';
import { bankSummary } from '../modules/bankable';

export function schedule(plan: Plan): ScheduledPlan {
  const ids = Object.keys(plan.nodes);
  const dependencies: Record<string, string[]> = {};
  const children: Record<string, string[]> = Object.fromEntries(ids.map((id) => [id, []]));
  const indegree: Record<string, number> = {};
  for (const id of ids) {
    const node = plan.nodes[id];
    dependencies[id] = [...new Set([...node.dependsOn, ...(node.milestone && node.anchor ? [node.anchor] : [])])];
    indegree[id] = dependencies[id].length;
    for (const dep of dependencies[id]) {
      if (!Object.hasOwn(plan.nodes, dep)) throw new Error(`missing dependency: ${dep} for ${id}`);
      children[dep].push(id);
    }
  }
  const ready = ids.filter((id) => indegree[id] === 0);
  const order: string[] = [];
  const scheduled: Record<string, Scheduled> = {};
  for (let index = 0; index < ready.length; index++) {
    const id = ready[index];
    const node = plan.nodes[id];
    const expectedDays = node.milestone ? 0 : node.medianDays + (node.pReject ?? 0) * (node.retryDays ?? node.medianDays);
    const start = node.milestone && node.anchor
      ? scheduled[node.anchor].finish + (node.deadlineDays ?? 0)
      : node.milestone && node.absoluteDay !== undefined ? node.absoluteDay
        : Math.max(0, ...dependencies[id].map((dep) => scheduled[dep].finish));
    scheduled[id] = { start, finish: start + expectedDays, expectedDays, onCriticalPath: false, unlocks: 0 };
    order.push(id);
    for (const child of children[id]) {
      indegree[child]--;
      if (indegree[child] === 0) ready.push(child);
    }
  }
  if (order.length !== ids.length) throw new Error('cycle detected');
  if (!Object.hasOwn(plan.nodes, 'go_live')) throw new Error('missing go_live node');

  const descendants: Record<string, Set<string>> = {};
  for (const id of [...order].reverse()) {
    const reachable = new Set<string>();
    for (const child of children[id]) {
      reachable.add(child);
      for (const descendant of descendants[child]) reachable.add(descendant);
    }
    descendants[id] = reachable;
    scheduled[id].unlocks = reachable.size;
  }
  const criticalPath: string[] = [];
  let current: string | undefined = 'go_live';
  while (current !== undefined) {
    criticalPath.push(current);
    scheduled[current].onCriticalPath = true;
    let latest: string | undefined;
    for (const dep of plan.nodes[current].dependsOn) {
      if (latest === undefined || scheduled[dep].finish > scheduled[latest].finish) latest = dep;
    }
    current = latest;
  }
  criticalPath.reverse();
  const available = ids.filter((id) => !plan.nodes[id].milestone && scheduled[id].start === 0);
  const startToday = [...available].sort((a, b) => scheduled[b].expectedDays - scheduled[a].expectedDays);
  const keystoneStep = [...available].sort((a, b) => scheduled[b].unlocks - scheduled[a].unlocks || a.localeCompare(b))[0] ?? '';
  const goLiveDay = scheduled.go_live.finish;
  const bank = bankSummary(plan.bankable, plan.company.zone);
  return { ...plan, schedule: scheduled, goLiveDay, goLiveDate: formatDay(plan.company.startDate, goLiveDay),
    idealGoLiveDay: goLiveDay, criticalPath, startToday, keystoneStep,
    structure: bank.structure, bankChecklist: bank.checklist, bankFit: bank.fit };
}
