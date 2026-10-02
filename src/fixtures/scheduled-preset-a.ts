// Hand-built ScheduledPlan for Preset A with a reduced node set, so pack B can build the UI before the engine exists.
// Numbers follow the worked baseline in AGENTS.md. Replaced at integration by the real pipeline.
import type { Node, Scheduled, ScheduledPlan } from '../model/plan';
import { formatDay } from '../model/plan';
import { PRESET_A } from '../data/presets';

const n = (id: string, label: string, owner: Node['owner'], medianDays: number, p80Days: number, dependsOn: string[], extra: Partial<Node> = {}): Node =>
  ({ id, label, owner, medianDays, p80Days, dependsOn, source: 'fixture', ...extra });

export const FIXTURE_NODES: Record<string, Node> = {
  parent_docs_attestation: n('parent_docs_attestation', 'Parent company documents attested', 'federal', 14, 28, []),
  licence: n('licence', 'Trade licence (ADGM)', 'gov', 14, 28, ['parent_docs_attestation']),
  kyc_pack: n('kyc_pack', 'Bank KYC pack prepared', 'company', 7, 14, ['licence']),
  bank_account: n('bank_account', 'Corporate bank account', 'bank', 32, 46, ['licence', 'kyc_pack'], { pReject: 0.30, retryDays: 28, tags: ['bank'] }),
  office_lease: n('office_lease', 'Office lease sized for visa quota', 'landlord', 14, 21, ['licence']),
  establishment_card: n('establishment_card', 'Establishment card and immigration file', 'gov', 4, 7, ['licence', 'office_lease']),
  chequebook: n('chequebook', 'Chequebook issued', 'bank', 7, 10, ['bank_account']),
  'degree_attestation@p1': n('degree_attestation@p1', 'Degree attestation', 'federal', 14, 28, [], { personId: 'p1' }),
  'work_permit_visa@p1': n('work_permit_visa@p1', 'Work permit and entry visa', 'federal', 7, 10, ['establishment_card', 'degree_attestation@p1'], { personId: 'p1' }),
  'emirates_id@p1': n('emirates_id@p1', 'Medical and Emirates ID', 'federal', 10, 14, ['work_permit_visa@p1'], { personId: 'p1' }),
  'residential_lease@p1': n('residential_lease@p1', 'Residential lease and Tawtheeq', 'landlord', 10, 14, ['chequebook', 'work_permit_visa@p1'], { personId: 'p1' }),
  'school_seat@p1-0': n('school_seat@p1-0', 'School seat (Year 3, UK)', 'school', 84, 168, [], { personId: 'p1', tags: ['family'] }),
  'family_settled@p1': n('family_settled@p1', 'Family settled', 'company', 0, 0, ['residential_lease@p1', 'school_seat@p1-0'], { personId: 'p1', milestone: true, tags: ['family'] }),
  ct_registration: n('ct_registration', 'Register for corporate tax', 'federal', 0, 0, [], { milestone: true, anchor: 'licence', deadlineDays: 90, costAED: 10000, tags: ['obligation'] }),
  licence_renewal: n('licence_renewal', 'Licence renewal', 'gov', 0, 0, [], { milestone: true, anchor: 'licence', deadlineDays: 365, tags: ['obligation'] }),
  go_live: n('go_live', 'Operational: paid, housed, legally working', 'company', 0, 0, ['bank_account', 'work_permit_visa@p1', 'residential_lease@p1'], { milestone: true }),
};

const s = (start: number, finish: number, onCriticalPath = false, unlocks = 0): Scheduled => ({ start, finish, expectedDays: finish - start, onCriticalPath, unlocks });

export const FIXTURE_SCHEDULE: Record<string, Scheduled> = {
  parent_docs_attestation: s(0, 14, true, 13),
  licence: s(14, 28, true, 12),
  kyc_pack: s(28, 35, true, 5),
  bank_account: s(35, 75.4, true, 4),
  office_lease: s(28, 42, false, 6),
  establishment_card: s(42, 46, false, 5),
  chequebook: s(75.4, 82.4, true, 3),
  'degree_attestation@p1': s(0, 14, false, 5),
  'work_permit_visa@p1': s(46, 53, false, 4),
  'emirates_id@p1': s(53, 63, false, 0),
  'residential_lease@p1': s(82.4, 92.4, true, 2),
  'school_seat@p1-0': s(0, 84, false, 1),
  'family_settled@p1': s(92.4, 92.4, false, 0),
  ct_registration: s(118, 118, false, 0),
  licence_renewal: s(393, 393, false, 0),
  go_live: s(92.4, 92.4, true, 0),
};

export const FIXTURE_SCHEDULED_A: ScheduledPlan = {
  ...PRESET_A,
  nodes: FIXTURE_NODES,
  schedule: FIXTURE_SCHEDULE,
  goLiveDay: 92.4,
  goLiveDate: formatDay(PRESET_A.company.startDate, 92.4),
  idealGoLiveDay: 49,
  criticalPath: ['parent_docs_attestation', 'licence', 'kyc_pack', 'bank_account', 'chequebook', 'residential_lease@p1', 'go_live'],
  startToday: ['school_seat@p1-0', 'parent_docs_attestation', 'degree_attestation@p1'],
  keystoneStep: 'parent_docs_attestation',
  structure: 'international',
  bankChecklist: [
    { item: 'Trade licence and MOA', ready: false },
    { item: 'Passport and visa copies of signatories and UBOs', ready: false },
    { item: 'UBO declaration and ownership chart', ready: false },
    { item: 'Source-of-funds evidence', ready: false },
    { item: 'Business plan with expected monthly flows', ready: false },
    { item: 'Client contracts or LOIs', ready: false },
    { item: 'Parent audited financials', ready: true },
    { item: 'Office lease or flexi-desk agreement', ready: true },
    { item: 'Website and company deck', ready: false },
  ],
  bankFit: ['FAB, ADCB, Emirates NBD: relationship-managed, expect 4 to 6 weeks', 'ADGM entities: FAB and ADCB run dedicated ADGM desks'],
};
