import { describe, expect, it } from 'vitest';
import type { Node, Plan } from '../../model/plan';
import { BEST_ANSWERS } from '../../model/plan';
import { PRESET_A, PRESET_B } from '../../data/presets';
import { BANKABLE_CLAMP, MIN_BANK_DAYS } from '../../data/banks';
import { pipeline, runModules } from '../pipeline';
import { schedule } from '../schedule';
import { bankSummary } from '../../modules/bankable';
import { emiratisationSummary } from '../../modules/obligations';

function node(id: string, dependsOn: string[] = [], overrides: Partial<Node> = {}): Node {
  return { id, label: id, owner: 'company', medianDays: 5, p80Days: 8,
    source: 'Test scenario', dependsOn, ...overrides };
}

function freeze<T>(value: T): T {
  if (value !== null && typeof value === 'object') {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}

describe('Pipeline edge cases', () => {
  it('leaves deeply frozen inputs unchanged and rebuilds stale nodes on every run', () => {
    const input = freeze(structuredClone(PRESET_A));
    const before = JSON.stringify(input);
    const first = pipeline(input);
    const second = pipeline(first);
    expect(JSON.stringify(input)).toBe(before);
    expect(second).toEqual(first);
    expect(runModules({ ...input, nodes: { stale: node('stale') } }).nodes.stale).toBeUndefined();
  });

  it('omits parent attestation for UAE ownership independently of bank answers', () => {
    const result = pipeline({ ...PRESET_A, company: { ...PRESET_A.company,
      ownership: { ...PRESET_A.company.ownership, parentJurisdiction: 'UAE' } } });
    expect(result.nodes.parent_docs_attestation).toBeUndefined();
    expect(result.schedule.licence.start).toBe(0);
    expect(result.structure).toBe('international');
  });

  it('settles families after every seat without making schools block company go-live', () => {
    const result = pipeline({ ...PRESET_A, events: ['school_waitlisted'] });
    expect(result.schedule['family_settled@p1'].finish).toBe(126);
    expect(result.schedule['school_seat@p4-0'].finish).toBe(21);
    expect(result.goLiveDay).toBeCloseTo(92.4);
    expect(result.nodes['degree_attestation@p11']).toBeUndefined();
    expect(result.nodes['work_permit_visa@p11'].dependsOn).toEqual(['establishment_card']);
  });

  it('applies combined setbacks once and removes all of them from the ideal scenario', () => {
    const base = pipeline(PRESET_A);
    const result = pipeline({ ...PRESET_A,
      events: ['bank_rejected', 'bank_rejected', 'landlord_delayed', 'school_waitlisted'] });
    expect(result.nodes.bank_account.pReject).toBe(base.nodes.bank_account.pReject);
    expect(result.nodes.bank_account.retryDays).toBe(base.nodes.bank_account.retryDays);
    expect(result.goLiveDay - base.goLiveDay).toBeCloseTo(42);
    expect(result.idealGoLiveDay).toBe(base.idealGoLiveDay);
  });

  it('supports a company with no people', () => {
    const result = pipeline({ ...PRESET_A, people: [] });
    expect(result.nodes.go_live.dependsOn).toEqual(['bank_account']);
    expect(result.goLiveDay).toBe(result.schedule.bank_account.finish);
  });
});

describe('Bank summaries', () => {
  it('clamps both extremes and uses the minimum review time for complete documentation', () => {
    const best = bankSummary(BEST_ANSWERS, 'ADGM');
    expect(best.structure).toBe('simple');
    expect(best.pReject).toBe(BANKABLE_CLAMP[0]);
    expect(best.medianDays).toBe(MIN_BANK_DAYS);
    expect(pipeline({ ...PRESET_A, bankable: BEST_ANSWERS }).nodes.bank_account.p80Days).toBe(28);
    expect(pipeline(PRESET_A).nodes.bank_account.p80Days).toBe(46);
    expect(best.fit).toHaveLength(2);
    expect(best.checklist.find((item) => item.item === 'Trade licence and MOA')?.ready).toBe(false);
    const worst = bankSummary({ ...BEST_ANSWERS, q1_layers: 3, q2_parent: 'HIGH_RISK',
      q3_uaeSignatory: false, q4_activityMatches: false, q5_sourceOfFundsPack: false,
      q6_namedClients: false, q7_inflows: 'OVER_1M', q8_auditedParent: false,
      q9_physicalOffice: false, q10_deckAndOrgChart: false,
      q11_highRiskActivity: true, q12_cashIntensive: true }, 'MAINLAND');
    expect(worst.pReject).toBe(BANKABLE_CLAMP[1]);
    expect(worst.structure).toBe('complex');
    expect(worst.fit).toHaveLength(1);
  });

  it('treats a high-risk activity as complex even with domestic simple ownership', () => {
    expect(bankSummary({ ...BEST_ANSWERS, q11_highRiskActivity: true }, 'KEZAD').structure).toBe('complex');
  });
});

describe('Emiratisation calendar and thresholds', () => {
  function mainland(headcount: number, skilledHeadcount = headcount, startDate = '2026-06-30'): Plan {
    return { ...PRESET_B, company: { ...PRESET_B.company, headcount, skilledHeadcount, startDate } };
  }

  it.each([20, 49])('uses total headcount for the small band (%i staff)', (headcount) => {
    const plan = mainland(headcount, 5);
    const result = pipeline(plan);
    expect(result.nodes.emiratisation_annual.costAED).toBe(108000);
    expect(result.nodes.emiratisation_h1).toBeUndefined();
    expect(emiratisationSummary(plan)).toMatchObject({ applies: true, roles: 1, annualExposureAED: 108000 });
  });

  it('rounds large targets up and reports the monthly exposure', () => {
    expect(emiratisationSummary(mainland(51))).toMatchObject({ applies: true, roles: 6, monthlyExposureAED: 54000 });
    expect(emiratisationSummary(mainland(19)).applies).toBe(false);
    expect(emiratisationSummary(mainland(60, 40)).applies).toBe(false);
    expect(emiratisationSummary(PRESET_A).reason).toContain('free zones');
  });

  it('keeps a checkpoint on the start date at day zero and handles leap years', () => {
    const sameDay = pipeline(mainland(50));
    expect(sameDay.schedule.emiratisation_h1.start).toBe(0);
    expect(sameDay.nodes.emiratisation_h1.label).toContain('30 Jun 2026');
    const nextYear = pipeline(mainland(50, 50, '2027-07-01'));
    expect(nextYear.schedule.emiratisation_h1.start).toBe(365);
    expect(nextYear.nodes.emiratisation_h1.label).toContain('2028');
    expect(nextYear.schedule.emiratisation_h2.start).toBe(183);
    const yearEnd = pipeline(mainland(50, 50, '2027-12-31'));
    expect(yearEnd.schedule.emiratisation_h2.start).toBe(0);
  });
});

describe('Scheduler graph behaviour', () => {
  it('orders anchors even when they are absent from dependsOn and inserted after the milestone', () => {
    const result = schedule({ ...PRESET_A, nodes: {
      tax: node('tax', [], { milestone: true, anchor: 'licence', deadlineDays: 90 }),
      go_live: node('go_live', ['licence'], { milestone: true }),
      licence: node('licence'),
      fixed: node('fixed', [], { milestone: true, absoluteDay: 0 }),
    } });
    expect(result.schedule.tax.finish).toBe(95);
    expect(result.schedule.fixed.finish).toBe(0);
    expect(result.schedule.licence.unlocks).toBe(2);
  });

  it('counts diamond descendants once and selects the first dependency on finish ties', () => {
    const result = schedule({ ...PRESET_A, nodes: {
      root: node('root'), left: node('left', ['root']), right: node('right', ['root']),
      go_live: node('go_live', ['right', 'left'], { milestone: true }),
    } });
    expect(result.schedule.root.unlocks).toBe(3);
    expect(result.criticalPath).toEqual(['root', 'right', 'go_live']);
    expect(result.schedule.left.onCriticalPath).toBe(false);
  });

  it('uses alphabetical keystone ties, duration ordering, and default retry duration', () => {
    const result = schedule({ ...PRESET_A, nodes: {
      z: node('z', [], { medianDays: 10, pReject: 0.5 }), a: node('a'),
      go_live: node('go_live', ['z', 'a'], { milestone: true }),
    } });
    expect(result.schedule.z.expectedDays).toBe(15);
    expect(result.startToday).toEqual(['z', 'a']);
    expect(result.keystoneStep).toBe('a');
  });

  it('rejects dangling dependencies, anchor cycles and graphs without go-live', () => {
    expect(() => schedule({ ...PRESET_A, nodes: { go_live: node('go_live', ['missing']) } })).toThrow('missing dependency');
    expect(() => schedule({ ...PRESET_A, nodes: {
      go_live: node('go_live', ['tax']), tax: node('tax', [], { milestone: true, anchor: 'go_live' }),
    } })).toThrow('cycle detected');
    expect(() => schedule({ ...PRESET_A, nodes: {} })).toThrow('missing go_live');
  });
});
