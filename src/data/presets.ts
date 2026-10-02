import type { Plan, Person } from '../model/plan';

const rolesA = ['CEO', 'CTO', 'Engineer', 'Engineer', 'Engineer', 'Engineer', 'Sales', 'Sales', 'Compliance lead', 'Product lead', 'Operations', 'Operations'];
const peopleA: Person[] = rolesA.map((role, i) => ({
  id: `p${i + 1}`, name: `Person ${i + 1}`, role, skilled: role !== 'Operations', basicSalaryAED: role === 'CEO' ? 60000 : 25000,
}));
peopleA[0].family = { spouse: true, kids: [{ yearGroup: 'Year 3', curriculum: 'UK' }] };
peopleA[1].family = { spouse: true, kids: [{ yearGroup: 'Year 7', curriculum: 'UK' }] };
peopleA[2].family = { spouse: true, kids: [{ yearGroup: 'FS1', curriculum: 'UK' }] };
peopleA[3].family = { spouse: true, kids: [{ yearGroup: 'Grade 5', curriculum: 'US' }] };

export const PRESET_A: Plan = {
  company: {
    name: 'Northline Payments', zone: 'ADGM', district: 'Al Maryah Island', activity: 'Payments software', sector: 'Fintech',
    headcount: 12, skilledHeadcount: 12, startDate: '2027-01-04', officeSqm: 180,
    ownership: { layers: 2, parentJurisdiction: 'LOW_RISK', uaeResidentSignatory: true, expectedMonthlyInflowsAED: 400000 },
  },
  people: peopleA,
  bankable: {
    q1_layers: 2, q2_parent: 'LOW_RISK', q3_uaeSignatory: true, q4_activityMatches: true, q5_sourceOfFundsPack: false, q6_namedClients: false,
    q7_inflows: '100K_TO_1M', q8_auditedParent: true, q9_physicalOffice: true, q10_deckAndOrgChart: false, q11_highRiskActivity: false, q12_cashIntensive: false,
  },
  toggles: { kycEarly: false, chequeFree: false, flexiDesk: false },
  events: [],
  nodes: {},
};

const rolesB = ['Manager', 'Coordinator', 'Driver', 'Analyst'];
const kidsB = [
  { yearGroup: 'Year 7', curriculum: 'UK' }, { yearGroup: 'Year 7', curriculum: 'UK' }, { yearGroup: 'Year 7', curriculum: 'UK' },
  { yearGroup: 'Year 3', curriculum: 'IB' }, { yearGroup: 'Year 3', curriculum: 'IB' },
  { yearGroup: 'Grade 4', curriculum: 'Indian' }, { yearGroup: 'Grade 4', curriculum: 'Indian' }, { yearGroup: 'Grade 4', curriculum: 'Indian' },
] as const;
const peopleB: Person[] = Array.from({ length: 60 }, (_, i) => ({
  id: `e${String(i + 1).padStart(2, '0')}`, name: `Employee ${String(i + 1).padStart(2, '0')}`, role: rolesB[i % 4], skilled: i < 40, basicSalaryAED: 15000,
  ...(i < 8 ? { family: { spouse: true, kids: [{ ...kidsB[i] }] } } : {}),
}));

export const PRESET_B: Plan = {
  company: {
    name: 'Gulf Reach Logistics', zone: 'MAINLAND', district: 'Khalifa City', activity: 'Freight forwarding', sector: 'Logistics',
    headcount: 60, skilledHeadcount: 50, startDate: '2027-01-04', officeSqm: 600,
    ownership: { layers: 3, parentJurisdiction: 'LOW_RISK', uaeResidentSignatory: false, expectedMonthlyInflowsAED: 1500000 },
  },
  people: peopleB,
  bankable: {
    q1_layers: 3, q2_parent: 'LOW_RISK', q3_uaeSignatory: false, q4_activityMatches: true, q5_sourceOfFundsPack: false, q6_namedClients: true,
    q7_inflows: 'OVER_1M', q8_auditedParent: true, q9_physicalOffice: true, q10_deckAndOrgChart: false, q11_highRiskActivity: false, q12_cashIntensive: false,
  },
  toggles: { kycEarly: false, chequeFree: false, flexiDesk: false },
  events: [],
  nodes: {},
};

export const PRESETS = { A: PRESET_A, B: PRESET_B } as const;
