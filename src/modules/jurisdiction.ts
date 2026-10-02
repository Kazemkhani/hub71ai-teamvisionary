import type { Node, Plan } from '../model/plan';
import { COMPANY_STEPS } from '../data/steps';
import { ZONES } from '../data/zones';

export function jurisdiction(plan: Plan): Plan {
  const zone = plan.company.zone;
  const needsAttestation = plan.company.ownership.parentJurisdiction !== 'UAE';
  const nodes: Record<string, Node> = {};
  for (const step of COMPANY_STEPS) {
    if (step.id === 'parent_docs_attestation' && !needsAttestation) continue;
    nodes[step.id] = {
      ...step,
      medianDays: typeof step.medianDays === 'number' ? step.medianDays : step.medianDays[zone],
      p80Days: typeof step.p80Days === 'number' ? step.p80Days : step.p80Days[zone],
      dependsOn: [...step.dependsOn],
    };
  }
  nodes.licence.label = `Trade licence (${ZONES[zone].label})`;
  if (needsAttestation) nodes.licence.dependsOn.push('parent_docs_attestation');
  return { ...plan, nodes };
}
