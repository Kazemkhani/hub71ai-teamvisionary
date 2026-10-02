// FROZEN CONTRACT. No pack may change this file during the parallel build.
export type Zone = 'ADGM' | 'MAINLAND' | 'KEZAD' | 'MASDAR' | 'TWOFOUR54';
export type Owner = 'gov' | 'federal' | 'bank' | 'landlord' | 'school' | 'company';
export type Curriculum = 'UK' | 'IB' | 'US' | 'Indian';

export interface Company {
  name: string;
  zone: Zone;
  district: string;
  activity: string;
  sector: string;
  headcount: number;
  skilledHeadcount: number;
  startDate: string; // ISO date, day 0
  officeSqm: number;
  ownership: {
    layers: 1 | 2 | 3; // 3 means 3 or more
    parentJurisdiction: 'UAE' | 'LOW_RISK' | 'HIGH_RISK';
    uaeResidentSignatory: boolean;
    expectedMonthlyInflowsAED: number;
  };
}

export interface Kid { yearGroup: string; curriculum: Curriculum }
export interface Person {
  id: string;
  name: string;
  role: string;
  skilled: boolean;
  basicSalaryAED: number;
  family?: { spouse: boolean; kids: Kid[] };
}

export interface Node {
  id: string; // per-person nodes: "<template>@<personId>"; school seats: "school_seat@<personId>-<kidIndex>"
  label: string;
  owner: Owner;
  medianDays: number;
  p80Days: number;
  pReject?: number;
  retryDays?: number;
  dependsOn: string[];
  source: string;
  personId?: string;
  milestone?: boolean; // zero duration
  anchor?: string; // milestone anchored to another node's finish
  deadlineDays?: number; // added to the anchor's finish
  absoluteDay?: number; // milestone at a fixed day offset from startDate (Emiratisation checkpoints)
  costAED?: number;
  tags?: string[]; // 'obligation' | 'family' | 'bank'
}

export interface BankableAnswers {
  q1_layers: 1 | 2 | 3;
  q2_parent: 'UAE' | 'LOW_RISK' | 'HIGH_RISK';
  q3_uaeSignatory: boolean;
  q4_activityMatches: boolean;
  q5_sourceOfFundsPack: boolean;
  q6_namedClients: boolean;
  q7_inflows: 'UNDER_100K' | '100K_TO_1M' | 'OVER_1M';
  q8_auditedParent: boolean;
  q9_physicalOffice: boolean;
  q10_deckAndOrgChart: boolean;
  q11_highRiskActivity: boolean;
  q12_cashIntensive: boolean;
}

export interface Toggles { kycEarly: boolean; chequeFree: boolean; flexiDesk: boolean }

export type StuckEvent = 'bank_rejected' | 'landlord_delayed' | 'school_waitlisted';

export interface Plan {
  company: Company;
  people: Person[];
  bankable: BankableAnswers;
  toggles: Toggles;
  events?: StuckEvent[]; // applied after toggles: bank_rejected adds one retry; landlord_delayed +14d on leases; school_waitlisted +42d on UK/IB seats
  nodes: Record<string, Node>; // rebuilt by the modules on every run
}

export interface Scheduled { start: number; finish: number; expectedDays: number; onCriticalPath: boolean; unlocks: number }

export interface ScheduledPlan extends Plan {
  schedule: Record<string, Scheduled>;
  goLiveDay: number;
  goLiveDate: string; // e.g. "Mon 5 Apr 2027"
  idealGoLiveDay: number; // all toggles on, all Bankable answers at their best values
  criticalPath: string[]; // first node to "go_live"
  startToday: string[]; // non-milestone node ids with start === 0, by expectedDays descending
  keystoneStep: string; // the available (start===0 or deps done) non-milestone node with the most transitive unlocks
  structure: 'simple' | 'international' | 'complex';
  bankChecklist: Array<{ item: string; ready: boolean }>;
  bankFit: string[];
}

export const BEST_ANSWERS: BankableAnswers = {
  q1_layers: 1, q2_parent: 'UAE', q3_uaeSignatory: true, q4_activityMatches: true,
  q5_sourceOfFundsPack: true, q6_namedClients: true, q7_inflows: 'UNDER_100K',
  q8_auditedParent: true, q9_physicalOffice: true, q10_deckAndOrgChart: true,
  q11_highRiskActivity: false, q12_cashIntensive: false,
};

export function addDays(iso: string, days: number): Date {
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + Math.round(days));
  return d;
}

export function formatDay(iso: string, days: number): string {
  return new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(addDays(iso, days));
}
