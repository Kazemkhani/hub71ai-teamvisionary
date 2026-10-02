// Product data. Change a number only with a source. Owned by pack A after the base commit.
import type { Owner, Zone, Curriculum } from '../model/plan';

export type ZoneDays = number | Record<Zone, number>;
export interface CompanyStep {
  id: string; label: string; owner: Owner; medianDays: ZoneDays; p80Days: ZoneDays;
  pReject?: number; retryDays?: number; dependsOn: string[]; source: string;
}
export interface PersonStep {
  id: string; label: string; owner: Owner; medianDays: number | Record<Curriculum, number>; p80Days: number | Record<Curriculum, number>;
  dependsOn: string[]; // '@self' suffix means the same person's node
  appliesWhen: 'always' | 'skilled' | 'perKid'; source: string;
}

export const COMPANY_STEPS: CompanyStep[] = [
  { id: 'licence', label: 'Trade licence', owner: 'gov',
    medianDays: { ADGM: 14, MAINLAND: 3, KEZAD: 10, MASDAR: 10, TWOFOUR54: 10 },
    p80Days: { ADGM: 28, MAINLAND: 7, KEZAD: 21, MASDAR: 21, TWOFOUR54: 21 },
    dependsOn: [],
    source: 'ADGM: advisors report a few weeks for non-regulated licences. Mainland: TAMM Investor Journey issues trade name and licence online in about 6 minutes; activity approvals add days.' },
  { id: 'parent_docs_attestation', label: 'Parent company documents attested', owner: 'federal', medianDays: 14, p80Days: 28, dependsOn: [],
    source: 'Notary, home-country MFA, UAE embassy, then MOFAIC. MOFAIC fee AED 2,000 per commercial document. The UAE is not party to the Apostille Convention.' },
  { id: 'kyc_pack', label: 'Bank KYC pack prepared', owner: 'company', medianDays: 7, p80Days: 14, dependsOn: ['licence'],
    source: 'Team estimate. With KYC-early the pack is prepared in parallel with the licence.' },
  { id: 'bank_account', label: 'Corporate bank account', owner: 'bank', medianDays: 28, p80Days: 42, pReject: 0.30, retryDays: 28, dependsOn: ['licence', 'kyc_pack'],
    source: '2 to 6 weeks typical; about 30% first-time rejection; over 60% of SME rejections cite source-of-funds documentation (Meydan FZ; UpperSetup 2026).' },
  { id: 'office_lease', label: 'Office lease sized for visa quota', owner: 'landlord', medianDays: 14, p80Days: 21, dependsOn: ['licence'],
    source: 'Mainland heuristic about 1 visa per 9 to 11 m²; prime office availability 0.1% in Q3 2025 (Cushman & Wakefield Core).' },
  { id: 'establishment_card', label: 'Establishment card and immigration file', owner: 'gov', medianDays: 4, p80Days: 7, dependsOn: ['licence', 'office_lease'],
    source: 'PRO practice; team estimate. Flexi-desk removes the office dependency.' },
  { id: 'chequebook', label: 'Chequebook issued', owner: 'bank', medianDays: 7, p80Days: 10, dependsOn: ['bank_account'],
    source: 'Needed for 1 to 4 post-dated rent cheques unless the landlord accepts direct debit (UAEDDS).' },
];

export const PERSON_STEPS: PersonStep[] = [
  { id: 'degree_attestation', label: 'Degree attestation', owner: 'federal', medianDays: 14, p80Days: 28, dependsOn: [], appliesWhen: 'skilled',
    source: 'Four-step chain to MOFAIC; AED 150 per personal document.' },
  { id: 'work_permit_visa', label: 'Work permit and entry visa', owner: 'federal', medianDays: 7, p80Days: 10, dependsOn: ['establishment_card', 'degree_attestation@self'], appliesWhen: 'always',
    source: 'Work Bundle: 5 working days, documents cut from 16 to 5, two visits (MoHRE and ICP).' },
  { id: 'emirates_id', label: 'Medical and Emirates ID', owner: 'federal', medianDays: 10, p80Days: 14, dependsOn: ['work_permit_visa@self'], appliesWhen: 'always',
    source: 'Biometrics visit plus card issuance; team estimate.' },
  { id: 'residential_lease', label: 'Residential lease and Tawtheeq', owner: 'landlord', medianDays: 10, p80Days: 14, dependsOn: ['chequebook', 'work_permit_visa@self'], appliesWhen: 'always',
    source: 'Tawtheeq requires UAE Pass; rent is paid in 1 to 4 post-dated cheques; bounced cheques decriminalised Jan 2022; direct debit (UAEDDS) exists.' },
  { id: 'school_seat', label: 'School seat', owner: 'school',
    medianDays: { UK: 84, IB: 84, US: 21, Indian: 21 }, p80Days: { UK: 168, IB: 168, US: 42, Indian: 42 }, dependsOn: [], appliesWhen: 'perKid',
    source: 'Most year groups at established UK and IB schools are waitlisted for 2026-27; apply 6 to 12 months ahead (ISchoolAdvisor). Newer and US or Indian-curriculum campuses report better availability.' },
];

export const GO_LIVE_LABEL = 'Operational: paid, housed, legally working';
