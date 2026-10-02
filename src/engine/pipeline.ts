import type { Plan, ScheduledPlan } from '../model/plan';
import { BEST_ANSWERS } from '../model/plan';
import { jurisdiction } from '../modules/jurisdiction';
import { bankable } from '../modules/bankable';
import { obligations } from '../modules/obligations';
import { family } from '../modules/family';
import { toggles } from '../modules/toggles';
import { events } from '../modules/events';
import { schedule } from './schedule';

export function runModules(plan: Plan): Plan {
  return events(toggles(family(obligations(bankable(jurisdiction(plan))))));
}

export function pipeline(plan: Plan): ScheduledPlan {
  const scheduled = schedule(runModules(plan));
  const ideal = schedule(runModules({ ...plan, bankable: BEST_ANSWERS,
    toggles: { kycEarly: true, chequeFree: true, flexiDesk: true }, events: [] }));
  return { ...scheduled, idealGoLiveDay: ideal.goLiveDay };
}
