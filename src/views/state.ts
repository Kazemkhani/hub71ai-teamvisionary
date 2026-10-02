import type { BankableAnswers, Plan, StuckEvent, Toggles, Zone } from '../model/plan';
import type { WhatIfResult } from '../ai/schemas';
import { BANKABLE_QUESTIONS } from '../data/banks';
import { PRESETS } from '../data/presets';

export type AnswerValue = BankableAnswers[keyof BankableAnswers];
export type Action =
  | { type: 'setPreset'; preset: keyof typeof PRESETS }
  | { type: 'setZone'; zone: Zone }
  | { type: 'setHeadcount'; value: number }
  | { type: 'setStartDate'; value: string }
  | { type: 'setToggle'; key: keyof Toggles; value: boolean }
  | { type: 'setAnswer'; key: keyof BankableAnswers; value: AnswerValue }
  | { type: 'addEvent'; event: StuckEvent }
  | { type: 'clearEvents' }
  | { type: 'applyWhatIf'; result: WhatIfResult };

function withHeadcount(plan: Plan, value: number): Plan {
  if (!Number.isSafeInteger(value) || value < 1 || value > 10000) return plan;
  const ratio = plan.company.headcount ? plan.company.skilledHeadcount / plan.company.headcount : 1;
  return { ...plan, company: { ...plan.company, headcount: value,
    skilledHeadcount: Math.min(value, Math.round(value * ratio)) } };
}

export function planReducer(plan: Plan, action: Action): Plan {
  switch (action.type) {
    case 'setPreset': return structuredClone(PRESETS[action.preset]);
    case 'setZone': return { ...plan, company: { ...plan.company, zone: action.zone } };
    case 'setHeadcount': return withHeadcount(plan, action.value);
    case 'setStartDate': {
      const date = new Date(`${action.value}T00:00:00Z`);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(action.value) || !Number.isFinite(date.getTime())
        || date.toISOString().slice(0, 10) !== action.value) return plan;
      return { ...plan, company: { ...plan.company, startDate: action.value } };
    }
    case 'setToggle': return { ...plan, toggles: { ...plan.toggles, [action.key]: action.value } };
    case 'setAnswer': {
      const question = BANKABLE_QUESTIONS.find((item) => item.key === action.key);
      if (!question?.options.some((option) => option.value === action.value)) return plan;
      return { ...plan, bankable: { ...plan.bankable, [action.key]: action.value } };
    }
    case 'addEvent': return { ...plan, events: [...new Set([...(plan.events ?? []), action.event])] };
    case 'clearEvents': return { ...plan, events: [] };
    case 'applyWhatIf': {
      const result = action.result;
      let next = result.headcount === undefined ? plan : withHeadcount(plan, result.headcount);
      if (result.zone) next = { ...next, company: { ...next.company, zone: result.zone } };
      if (result.toggles) next = { ...next, toggles: { ...next.toggles, ...result.toggles } };
      for (const [key, value] of Object.entries(result.bankable ?? {})) {
        next = planReducer(next, { type: 'setAnswer', key: key as keyof BankableAnswers, value: value as AnswerValue });
      }
      return { ...next, events: [...new Set([...(next.events ?? []), ...(result.events ?? [])])] };
    }
  }
}
