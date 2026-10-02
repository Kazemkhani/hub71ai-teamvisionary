import type { Node, Plan } from '../model/plan';
import { CT_REGISTRATION, EMIRATISATION, LICENCE_RENEWAL } from '../data/obligations';
import { ZONES } from '../data/zones';

export function emiratisationSummary(plan: Plan) {
  const { zone, skilledHeadcount, headcount } = plan.company;
  if (!ZONES[zone].emiratisationApplies) {
    return { applies: false, reason: EMIRATISATION.notApplicableFreeZone };
  }
  if (skilledHeadcount >= EMIRATISATION.largeThreshold) {
    const roles = Math.ceil(EMIRATISATION.targetShare * skilledHeadcount);
    return { applies: true, roles, monthlyExposureAED: roles * EMIRATISATION.monthlyPerRoleAED,
      reason: EMIRATISATION.largeSource };
  }
  if (headcount >= EMIRATISATION.smallMin && headcount <= EMIRATISATION.smallMax) {
    return { applies: true, roles: 1, annualExposureAED: EMIRATISATION.smallAnnualAED,
      reason: EMIRATISATION.smallSource };
  }
  return { applies: false, reason: headcount < EMIRATISATION.smallMin
    ? EMIRATISATION.notApplicableSmall : 'Fewer than 50 skilled staff; outside the 20 to 49 staff band' };
}

function nextCheckpoint(startDate: string, month: number, day: number) {
  const start = new Date(`${startDate}T00:00:00Z`);
  let date = new Date(Date.UTC(start.getUTCFullYear(), month, day));
  if (date < start) date = new Date(Date.UTC(start.getUTCFullYear() + 1, month, day));
  return { absoluteDay: (date.getTime() - start.getTime()) / (24 * 60 * 60 * 1000), year: date.getUTCFullYear() };
}

export function obligations(plan: Plan): Plan {
  const nodes = { ...plan.nodes };
  const milestone = (id: string, label: string, source: string): Node => ({
    id, label, source, owner: 'company', medianDays: 0, p80Days: 0,
    dependsOn: [], milestone: true, tags: ['obligation'],
  });
  for (const rule of [CT_REGISTRATION, LICENCE_RENEWAL]) {
    nodes[rule.id] = { ...milestone(rule.id, rule.label, rule.source), ...rule,
      anchor: 'licence', dependsOn: ['licence'] };
  }
  const summary = emiratisationSummary(plan);
  if (summary.applies) {
    const checkpoints = summary.monthlyExposureAED !== undefined
      ? [{ id: 'emiratisation_h1', month: 5, day: 30, label: '30 Jun' },
        { id: 'emiratisation_h2', month: 11, day: 31, label: '31 Dec' }]
      : [{ id: 'emiratisation_annual', month: 11, day: 31, label: '31 Dec' }];
    for (const checkpoint of checkpoints) {
      const { absoluteDay, year } = nextCheckpoint(plan.company.startDate, checkpoint.month, checkpoint.day);
      nodes[checkpoint.id] = {
        ...milestone(checkpoint.id, `Emiratisation: ${summary.roles} Emirati hires by ${checkpoint.label} ${year}`, summary.reason),
        absoluteDay, costAED: summary.monthlyExposureAED ?? summary.annualExposureAED,
      };
    }
  }
  return { ...plan, nodes };
}
