// ACCEPTANCE TESTS FOR PACK A. Do not weaken them to pass. Worked numbers are in AGENTS.md.
import { describe, it, expect } from 'vitest';
import { pipeline } from '../pipeline';
import { schedule } from '../schedule';
import { PRESET_A, PRESET_B } from '../../data/presets';

describe('Preset A baseline', () => {
  const sp = pipeline(PRESET_A);
  it('schedules the licence after parent attestation', () => {
    expect(sp.schedule.parent_docs_attestation.finish).toBeCloseTo(14, 1);
    expect(sp.schedule.licence.start).toBeCloseTo(14, 1);
    expect(sp.schedule.licence.finish).toBeCloseTo(28, 1);
  });
  it('scores the bank from the answers', () => {
    expect(sp.nodes.bank_account.pReject).toBeCloseTo(0.30, 2);
    expect(sp.nodes.bank_account.medianDays).toBe(32);
    expect(sp.structure).toBe('international');
    expect(sp.schedule.bank_account.expectedDays).toBeCloseTo(40.4, 1);
    expect(sp.schedule.bank_account.start).toBeCloseTo(35, 1);
    expect(sp.schedule.bank_account.finish).toBeCloseTo(75.4, 1);
  });
  it('puts go-live at about day 92 through bank, chequebook and a lease', () => {
    expect(sp.goLiveDay).toBeCloseTo(92.4, 1);
    expect(sp.criticalPath).toContain('bank_account');
    expect(sp.criticalPath).toContain('chequebook');
    expect(sp.criticalPath.some((id) => id.startsWith('residential_lease@'))).toBe(true);
    expect(sp.criticalPath[sp.criticalPath.length - 1]).toBe('go_live');
  });
  it('builds one node per person and per kid', () => {
    expect(Object.keys(sp.nodes).filter((id) => id.startsWith('work_permit_visa@')).length).toBe(12);
    expect(Object.keys(sp.nodes).filter((id) => id.startsWith('degree_attestation@')).length).toBe(10);
    const seats = Object.keys(sp.nodes).filter((id) => id.startsWith('school_seat@'));
    expect(seats.length).toBe(4);
    for (const id of seats) expect(sp.schedule[id].start).toBe(0);
    expect(sp.startToday.some((id) => id.startsWith('school_seat@'))).toBe(true);
  });
  it('computes the ideal go-live at about day 49', () => {
    expect(sp.idealGoLiveDay).toBeCloseTo(49, 1);
  });
  it('names a keystone step with the most transitive unlocks among day-0 steps', () => {
    expect(sp.keystoneStep).toBe('parent_docs_attestation');
    expect(sp.schedule.parent_docs_attestation.unlocks).toBeGreaterThan(sp.schedule['school_seat@p1-0'].unlocks);
  });
  it('places obligations after the licence', () => {
    expect(sp.schedule.ct_registration.start).toBeCloseTo(118, 1);
    expect(sp.nodes.ct_registration.costAED).toBe(10000);
    expect(Object.keys(sp.nodes).some((id) => id.startsWith('emiratisation'))).toBe(false);
  });
});

describe('Preset A after the demo clicks', () => {
  const fixed = { ...PRESET_A, bankable: { ...PRESET_A.bankable, q5_sourceOfFundsPack: true, q6_namedClients: true, q10_deckAndOrgChart: true } };
  it('three Bankable fixes drop risk to 0.12 and review to 23 days', () => {
    const sp = pipeline(fixed);
    expect(sp.nodes.bank_account.pReject).toBeCloseTo(0.12, 2);
    expect(sp.nodes.bank_account.medianDays).toBe(23);
    expect(sp.bankChecklist.filter((c) => c.ready).length).toBeGreaterThanOrEqual(5);
  });
  it('kycEarly starts the KYC pack on day 0', () => {
    const sp = pipeline({ ...fixed, toggles: { kycEarly: true, chequeFree: false, flexiDesk: false } });
    expect(sp.nodes.kyc_pack.dependsOn).toEqual([]);
    expect(sp.schedule.kyc_pack.start).toBe(0);
  });
  it('chequeFree removes the chequebook edge from every lease', () => {
    const sp = pipeline({ ...fixed, toggles: { kycEarly: false, chequeFree: true, flexiDesk: false } });
    const leases = Object.values(sp.nodes).filter((n) => n.id.startsWith('residential_lease@'));
    expect(leases.length).toBe(12);
    for (const n of leases) expect(n.dependsOn).not.toContain('chequebook');
  });
  it('flexiDesk removes the office edge from the establishment card', () => {
    const sp = pipeline({ ...fixed, toggles: { kycEarly: false, chequeFree: false, flexiDesk: true } });
    expect(sp.nodes.establishment_card.dependsOn).not.toContain('office_lease');
    expect(sp.schedule.establishment_card.finish).toBeCloseTo(32, 1);
  });
  it('all fixes and all toggles put go-live at about day 54, at least 28 days earlier', () => {
    const base = pipeline(PRESET_A);
    const sp = pipeline({ ...fixed, toggles: { kycEarly: true, chequeFree: true, flexiDesk: true } });
    expect(sp.goLiveDay).toBeCloseTo(54.4, 1);
    expect(base.goLiveDay - sp.goLiveDay).toBeGreaterThanOrEqual(28);
  });
  it('a bank_rejected event adds one full retry to the bank node', () => {
    const base = pipeline(PRESET_A);
    const sp = pipeline({ ...PRESET_A, events: ['bank_rejected'] });
    expect(sp.schedule.bank_account.expectedDays - base.schedule.bank_account.expectedDays).toBeCloseTo(28, 1);
    expect(sp.goLiveDay).toBeGreaterThan(base.goLiveDay);
  });
});

describe('Preset B', () => {
  const sp = pipeline(PRESET_B);
  it('uses the 3-day mainland licence after attestation', () => {
    expect(sp.schedule.licence.finish).toBeCloseTo(17, 1);
  });
  it('scores a complex structure', () => {
    expect(sp.nodes.bank_account.pReject).toBeCloseTo(0.41, 2);
    expect(sp.nodes.bank_account.medianDays).toBe(50);
    expect(sp.structure).toBe('complex');
  });
  it('adds Emiratisation and corporate tax obligations', () => {
    expect(sp.nodes.emiratisation_h1).toBeDefined();
    expect(sp.nodes.emiratisation_h2).toBeDefined();
    expect(sp.nodes.emiratisation_h1.costAED).toBe(45000);
    expect(sp.nodes.ct_registration.costAED).toBe(10000);
    expect(sp.schedule.ct_registration.start).toBeCloseTo(107, 1);
  });
  it('flexiDesk pulls every work permit 14 days earlier', () => {
    const on = pipeline({ ...PRESET_B, toggles: { ...PRESET_B.toggles, flexiDesk: true } });
    const permits = Object.keys(sp.nodes).filter((id) => id.startsWith('work_permit_visa@'));
    expect(permits.length).toBe(60);
    for (const id of permits) expect(sp.schedule[id].finish - on.schedule[id].finish).toBeCloseTo(14, 1);
  });
});

describe('Zone and threshold switching', () => {
  it('Preset A on mainland gets a 3-day licence and no Emiratisation below 20 staff', () => {
    const sp = pipeline({ ...PRESET_A, company: { ...PRESET_A.company, zone: 'MAINLAND' } });
    expect(sp.nodes.licence.medianDays).toBe(3);
    expect(Object.keys(sp.nodes).some((id) => id.startsWith('emiratisation'))).toBe(false);
  });
  it('mainland with 50 skilled staff gets 5 roles at AED 45,000 per month', () => {
    const sp = pipeline({ ...PRESET_A, company: { ...PRESET_A.company, zone: 'MAINLAND', headcount: 50, skilledHeadcount: 50 } });
    expect(sp.nodes.emiratisation_h1.costAED).toBe(45000);
  });
  it('a free zone has no Emiratisation nodes', () => {
    const sp = pipeline({ ...PRESET_B, company: { ...PRESET_B.company, zone: 'KEZAD' } });
    expect(Object.keys(sp.nodes).some((id) => id.startsWith('emiratisation'))).toBe(false);
  });
});

describe('Scheduler guards', () => {
  it('throws on a cycle', () => {
    const plan = pipeline(PRESET_A);
    const nodes = { ...plan.nodes, licence: { ...plan.nodes.licence, dependsOn: [...plan.nodes.licence.dependsOn, 'chequebook'] } };
    expect(() => schedule({ ...plan, nodes })).toThrow(/cycle/);
  });
});
