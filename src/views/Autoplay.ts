import type { Action } from './state';

export interface DemoStep { at: number; caption: string; action?: Action; open?: string; explain?: boolean; close?: boolean; target?: string; end?: boolean }
export const DEMO_STEPS: DemoStep[] = [
  { at: 0, action: { type: 'setPreset', preset: 'A' }, close: true, target: 'go-live', caption: 'Northline Payments. Start with the date you can plan payroll around.' },
  { at: 6000, target: 'critical-path', caption: 'The red path controls day one: bank, chequebook, then every lease.' },
  { at: 12000, open: 'bank_account', caption: 'The bank is a dependency you can prepare for.' },
  { at: 20000, action: { type: 'setAnswer', key: 'q5_sourceOfFundsPack', value: true }, target: 'bankable', caption: 'Source-of-funds evidence ready. Rejection risk falls.' },
  { at: 23000, action: { type: 'setAnswer', key: 'q6_namedClients', value: true }, target: 'bankable', caption: 'Name the first clients. Give the bank evidence, not promises.' },
  { at: 26000, action: { type: 'setAnswer', key: 'q10_deckAndOrgChart', value: true }, target: 'bankable', caption: 'Complete the deck and ownership chart. Review time falls too.' },
  { at: 32000, close: true, target: 'toggles', caption: 'Three decisions change which steps need to wait.' },
  { at: 35000, action: { type: 'setToggle', key: 'chequeFree', value: true }, caption: 'Direct debit frees rent from the chequebook.' },
  { at: 36500, action: { type: 'setToggle', key: 'kycEarly', value: true }, caption: 'Prepare KYC before the licence arrives.' },
  { at: 38000, action: { type: 'setToggle', key: 'flexiDesk', value: true }, target: 'go-live', caption: 'A flexi-desk frees the visa file from the office lease. Watch the week change.' },
  { at: 45000, open: 'bank_account', explain: true, caption: 'Every step has a source and an explanation in English and Arabic.' },
  { at: 65000, action: { type: 'setPreset', preset: 'B' }, close: true, target: 'go-live', caption: 'Gulf Reach Logistics. A mainland plan with a different structure.' },
  { at: 70000, target: 'emiratisation', caption: 'Five Emirati roles. AED 45,000 monthly exposure. Hidden obligations are visible.' },
  { at: 90000, end: true, caption: 'Week 13 to week 8. Every plan reports real durations.' },
];

export function startAutoplay(onStep: (step: DemoStep) => void, scheduleTimer = setTimeout, cancelTimer = clearTimeout): () => void {
  const timers = DEMO_STEPS.map((step) => scheduleTimer(() => onStep(step), step.at));
  return () => timers.forEach(cancelTimer);
}
