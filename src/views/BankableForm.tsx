import type { Dispatch } from 'react';
import type { BankableAnswers, Plan, ScheduledPlan } from '../model/plan';
import { BANKABLE_QUESTIONS, BANK_DISCLAIMER } from '../data/banks';
import type { Action, AnswerValue } from './state';

export function BankableForm({ plan, scheduled, dispatch }: { plan: Plan; scheduled: ScheduledPlan; dispatch: Dispatch<Action> }) {
  const bank = scheduled.nodes.bank_account;
  return <section className="bankable" data-tour="bankable"><h3>Bankable</h3><p className="bank-readout tnum" aria-live="polite">
    Rejection risk {Math.round((bank?.pReject ?? 0) * 100)}% · review {bank?.medianDays ?? 0} days · {scheduled.structure}</p>
    <div className="bank-questions">{BANKABLE_QUESTIONS.map((question, index) => <fieldset key={question.key}>
      <legend><span className="question-number">{index + 1}.</span> {question.label}</legend><div className="segments">
        {question.options.map((option) => <button key={String(option.value)} aria-pressed={plan.bankable[question.key as keyof BankableAnswers] === option.value}
          onClick={() => dispatch({ type: 'setAnswer', key: question.key as keyof BankableAnswers, value: option.value as AnswerValue })}>{option.label}</button>)}
      </div></fieldset>)}</div>
    <h4>Documents to prepare</h4><ul className="checklist">{scheduled.bankChecklist.map((item) => <li key={item.item}>
      <span className={item.ready ? 'ready-mark' : 'pending-mark'} aria-label={item.ready ? 'Ready' : 'Not ready'}>{item.ready ? '✓' : '○'}</span>{item.item}</li>)}</ul>
    <h4>Bank fit</h4>{scheduled.bankFit.map((fit) => <p className="bank-fit" key={fit}>{fit}</p>)}<p className="disclaimer">{BANK_DISCLAIMER}</p>
  </section>;
}
