import { describe, it, expect } from 'vitest';
import { ExtractResult, ExplainResult, DraftResult, WhatIfResult } from '../schemas';
import { mockDraft, mockExplain, mockExtract, mockWhatIf } from '../mocks';

describe('AI mocks satisfy the frozen schemas', () => {
  it('extract', () => { expect(ExtractResult.safeParse(mockExtract).success).toBe(true); });
  it('explain', () => {
    const r = mockExplain({ nodeId: 'bank_account', label: 'Corporate bank account', owner: 'bank', startDay: 35, finishDay: 75.4, expectedDays: 40.4, onCriticalPath: true, unlocks: 4, companyName: 'Northline Payments', zone: 'ADGM', source: 'x' });
    expect(ExplainResult.safeParse(r).success).toBe(true);
  });
  it('draft, all templates', () => {
    for (const template of ['bank_cover_letter', 'employer_rent_guarantee', 'school_application', 'landlord_direct_debit'] as const) {
      expect(DraftResult.safeParse(mockDraft({ template, tone: 'formal', context: {} })).success).toBe(true);
    }
  });
  it('whatIf', () => {
    const r = mockWhatIf('what if the landlord takes direct debit and we prepare KYC early for 20 staff on mainland');
    expect(WhatIfResult.safeParse(r).success).toBe(true);
    expect(r.toggles?.chequeFree).toBe(true);
    expect(r.toggles?.kycEarly).toBe(true);
    expect(r.zone).toBe('MAINLAND');
    expect(r.headcount).toBe(20);
  });
});
