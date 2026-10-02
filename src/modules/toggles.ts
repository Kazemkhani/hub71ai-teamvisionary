import type { Plan } from '../model/plan';

export function toggles(plan: Plan): Plan {
  const nodes = Object.fromEntries(Object.entries(plan.nodes).map(([id, node]) => {
    let dependsOn = [...node.dependsOn];
    if (plan.toggles.kycEarly && id === 'kyc_pack') dependsOn = [];
    if (plan.toggles.chequeFree && id.startsWith('residential_lease@')) dependsOn = dependsOn.filter((dep) => dep !== 'chequebook');
    if (plan.toggles.flexiDesk && id === 'establishment_card') dependsOn = dependsOn.filter((dep) => dep !== 'office_lease');
    return [id, { ...node, dependsOn }];
  }));
  return { ...plan, nodes };
}
