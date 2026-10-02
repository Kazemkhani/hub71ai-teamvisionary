export const CT_REGISTRATION = { id: 'ct_registration', label: 'Register for corporate tax', deadlineDays: 90, costAED: 10000,
  source: 'AED 10,000 administrative penalty for late registration (Cabinet Decision 10 of 2024); newly incorporated companies have 3 months.' };
export const LICENCE_RENEWAL = { id: 'licence_renewal', label: 'Licence renewal', deadlineDays: 365, source: 'Annual renewal with the licensing authority.' };
export const EMIRATISATION = {
  largeThreshold: 50, targetShare: 0.10, monthlyPerRoleAED: 9000,
  smallMin: 20, smallMax: 49, smallAnnualAED: 108000,
  largeSource: 'Mainland firms with 50+ skilled staff must reach 10% Emiratis by 31 December 2026; AED 9,000 per month per unfilled role in 2026 (MoHRE).',
  smallSource: 'Companies with 20 to 49 staff in 14 targeted sectors must hire one Emirati per year; AED 108,000 per unfilled role.',
  notApplicableSmall: 'Emiratisation does not apply below 20 staff',
  notApplicableFreeZone: 'Emiratisation does not apply in free zones',
};
