import type { BankableAnswers, Plan, Zone } from '../model/plan';
import {
  BANKABLE_BASE_REJECT, BANKABLE_CLAMP, BANKABLE_QUESTIONS, BANK_CHECKLIST,
  BANK_FIT, BANK_FIT_ADGM, BANK_P80_BUFFER_DAYS, BANK_RETRY_DAYS, GREEN_DOC_DAYS, MIN_BANK_DAYS, STRUCTURE_BASE_DAYS,
} from '../data/banks';

export function bankSummary(answers: BankableAnswers, zone: Zone) {
  const structure: keyof typeof STRUCTURE_BASE_DAYS = answers.q1_layers === 3 || answers.q2_parent === 'HIGH_RISK' || answers.q11_highRiskActivity
    ? 'complex' : answers.q2_parent !== 'UAE' || answers.q1_layers === 2 ? 'international' : 'simple';
  const selected = BANKABLE_QUESTIONS.map((question) => question.options.find(
    (option) => option.value === answers[question.key as keyof BankableAnswers],
  ));
  const risk = BANKABLE_BASE_REJECT + selected.reduce((sum, option) => sum + (option?.delta ?? 0), 0);
  const pReject = Math.min(BANKABLE_CLAMP[1], Math.max(BANKABLE_CLAMP[0], risk));
  const medianDays = Math.max(MIN_BANK_DAYS,
    STRUCTURE_BASE_DAYS[structure] - GREEN_DOC_DAYS * selected.filter((option) => option?.greenDoc).length);
  return {
    structure, pReject, medianDays,
    checklist: BANK_CHECKLIST.map(({ item, readyWhen }) => ({ item, ready: readyWhen ? answers[readyWhen] === true : false })),
    fit: [BANK_FIT[structure], ...(zone === 'ADGM' ? [BANK_FIT_ADGM] : [])],
  };
}

export function bankable(plan: Plan): Plan {
  const summary = bankSummary(plan.bankable, plan.company.zone);
  const bank = plan.nodes.bank_account;
  return { ...plan, nodes: { ...plan.nodes, bank_account: {
    ...bank, pReject: summary.pReject, medianDays: summary.medianDays,
    p80Days: summary.medianDays + BANK_P80_BUFFER_DAYS, retryDays: BANK_RETRY_DAYS,
  } } };
}
