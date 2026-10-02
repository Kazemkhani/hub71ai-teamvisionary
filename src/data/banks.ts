// Bankable question metadata for the form (pack B) and the scorer (pack A). Deltas apply to pReject.
export interface BankableOption { value: string | number | boolean; label: string; delta: number; greenDoc?: boolean }
export interface BankableQuestion { key: string; label: string; options: BankableOption[] }

export const BANKABLE_BASE_REJECT = 0.12;
export const BANKABLE_CLAMP: [number, number] = [0.08, 0.60];
export const STRUCTURE_BASE_DAYS = { simple: 21, international: 35, complex: 56 } as const;
export const GREEN_DOC_DAYS = 3;
export const MIN_BANK_DAYS = 14;
export const BANK_RETRY_DAYS = 28;

export const BANKABLE_QUESTIONS: BankableQuestion[] = [
  { key: 'q1_layers', label: 'Ownership layers between the company and its UBOs', options: [
    { value: 1, label: '1', delta: -0.03 }, { value: 2, label: '2', delta: 0 }, { value: 3, label: '3 or more', delta: 0.10 } ] },
  { key: 'q2_parent', label: 'Parent company jurisdiction', options: [
    { value: 'UAE', label: 'UAE', delta: -0.03 }, { value: 'LOW_RISK', label: 'Low-risk', delta: 0 }, { value: 'HIGH_RISK', label: 'High-risk or grey-listed', delta: 0.10 } ] },
  { key: 'q3_uaeSignatory', label: 'A signatory or UBO already holds UAE residence', options: [
    { value: true, label: 'Yes', delta: 0 }, { value: false, label: 'No', delta: 0.03 } ] },
  { key: 'q4_activityMatches', label: 'Licensed activity matches expected transactions', options: [
    { value: true, label: 'Yes', delta: 0 }, { value: false, label: 'No', delta: 0.08 } ] },
  { key: 'q5_sourceOfFundsPack', label: 'Source-of-funds pack ready (bank statements, audited accounts, cap table)', options: [
    { value: true, label: 'Yes', delta: 0, greenDoc: true }, { value: false, label: 'No', delta: 0.10 } ] },
  { key: 'q6_namedClients', label: 'First clients named, contracts or LOIs in hand', options: [
    { value: true, label: 'Yes', delta: 0, greenDoc: true }, { value: false, label: 'No', delta: 0.05 } ] },
  { key: 'q7_inflows', label: 'Expected monthly inflows', options: [
    { value: 'UNDER_100K', label: 'Under AED 100k', delta: 0 }, { value: '100K_TO_1M', label: 'AED 100k to 1m', delta: 0 }, { value: 'OVER_1M', label: 'Over AED 1m', delta: 0.03 } ] },
  { key: 'q8_auditedParent', label: 'Audited parent financials available', options: [
    { value: true, label: 'Yes', delta: 0, greenDoc: true }, { value: false, label: 'No', delta: 0.03 } ] },
  { key: 'q9_physicalOffice', label: 'Office type', options: [
    { value: true, label: 'Physical office', delta: 0 }, { value: false, label: 'Flexi-desk', delta: 0.02 } ] },
  { key: 'q10_deckAndOrgChart', label: 'Website, company deck and org chart ready', options: [
    { value: true, label: 'Yes', delta: 0, greenDoc: true }, { value: false, label: 'No', delta: 0.03 } ] },
  { key: 'q11_highRiskActivity', label: 'Activity in a high-risk category (crypto, precious metals, general trading, real estate brokerage, defence)', options: [
    { value: false, label: 'No', delta: 0 }, { value: true, label: 'Yes', delta: 0.15 } ] },
  { key: 'q12_cashIntensive', label: 'Cash-intensive business', options: [
    { value: false, label: 'No', delta: 0 }, { value: true, label: 'Yes', delta: 0.08 } ] },
];

export const BANK_CHECKLIST: Array<{ item: string; readyWhen?: keyof import('../model/plan').BankableAnswers }> = [
  { item: 'Trade licence and MOA' },
  { item: 'Passport and visa copies of signatories and UBOs' },
  { item: 'UBO declaration and ownership chart', readyWhen: 'q10_deckAndOrgChart' },
  { item: 'Source-of-funds evidence', readyWhen: 'q5_sourceOfFundsPack' },
  { item: 'Business plan with expected monthly flows' },
  { item: 'Client contracts or LOIs', readyWhen: 'q6_namedClients' },
  { item: 'Parent audited financials', readyWhen: 'q8_auditedParent' },
  { item: 'Office lease or flexi-desk agreement', readyWhen: 'q9_physicalOffice' },
  { item: 'Website and company deck', readyWhen: 'q10_deckAndOrgChart' },
];

export const BANK_FIT: Record<'simple' | 'international' | 'complex', string> = {
  simple: 'Wio Business, Mashreq NeoBiz: digital onboarding, fastest for simple SMEs',
  international: 'FAB, ADCB, Emirates NBD: relationship-managed, expect 4 to 6 weeks',
  complex: 'Any bank will apply enhanced due diligence; budget 8 weeks and a second round of questions',
};
export const BANK_FIT_ADGM = 'ADGM entities: FAB and ADCB run dedicated ADGM desks';
export const BANK_DISCLAIMER = 'Scoring is a team heuristic from published bank guidance, not advice.';
