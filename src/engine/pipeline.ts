// OWNED BY PACK A. Base STUB: returns the fixture with the caller's inputs spliced in, so the UI renders before the engine exists.
// Pack A replaces the body with: jurisdiction -> bankable -> obligations -> family -> toggles -> events -> schedule. Signature must not change.
import type { Plan, ScheduledPlan } from '../model/plan';
import { formatDay } from '../model/plan';
import { FIXTURE_SCHEDULED_A } from '../fixtures/scheduled-preset-a';

export function pipeline(plan: Plan): ScheduledPlan {
  return {
    ...FIXTURE_SCHEDULED_A,
    company: plan.company,
    people: plan.people,
    bankable: plan.bankable,
    toggles: plan.toggles,
    events: plan.events ?? [],
    goLiveDate: formatDay(plan.company.startDate, FIXTURE_SCHEDULED_A.goLiveDay),
  };
}
