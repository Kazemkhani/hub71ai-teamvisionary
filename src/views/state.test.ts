import { describe, expect, it } from 'vitest';
import { PRESET_A, PRESET_B } from '../data/presets';
import { planReducer } from './state';

describe('Screen actions', () => {
  it('switches presets without mutating their inputs', () => {
    expect(planReducer(PRESET_A, { type: 'setPreset', preset: 'B' })).toEqual(PRESET_B);
  });
  it('updates controls and keeps existing headcount skill proportions', () => {
    const result = planReducer(PRESET_B, { type: 'setHeadcount', value: 120 });
    expect(result.company.headcount).toBe(120);
    expect(result.company.skilledHeadcount).toBe(100);
    expect(PRESET_B.company.headcount).toBe(60);
    expect(planReducer(PRESET_A, { type: 'setHeadcount', value: -1 })).toBe(PRESET_A);
    expect(planReducer(PRESET_A, { type: 'setStartDate', value: '2027-02-30' })).toBe(PRESET_A);
  });
  it('deduplicates setbacks and clears them', () => {
    const first = planReducer(PRESET_A, { type: 'addEvent', event: 'bank_rejected' });
    const second = planReducer(first, { type: 'addEvent', event: 'bank_rejected' });
    expect(second.events).toEqual(['bank_rejected']);
    expect(planReducer(second, { type: 'clearEvents' }).events).toEqual([]);
  });
  it('applies only valid proposed bank answers and preserves unmentioned values', () => {
    const result = planReducer(PRESET_A, { type: 'applyWhatIf', result: {
      rationale: 'Scenario', zone: 'MAINLAND', headcount: 24, toggles: { chequeFree: true },
      bankable: { q5_sourceOfFundsPack: true, q1_layers: 99, injected: 'value' },
      events: ['landlord_delayed'],
    } });
    expect(result.company.zone).toBe('MAINLAND');
    expect(result.company.headcount).toBe(24);
    expect(result.company.skilledHeadcount).toBe(24);
    expect(result.bankable.q5_sourceOfFundsPack).toBe(true);
    expect(result.bankable.q1_layers).toBe(2);
    expect(result.bankable).not.toHaveProperty('injected');
    expect(result.toggles).toEqual({ kycEarly: false, chequeFree: true, flexiDesk: false });
    expect(result.events).toEqual(['landlord_delayed']);
  });
});
