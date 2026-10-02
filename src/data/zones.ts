import type { Zone } from '../model/plan';
export interface ZoneRule { label: string; regulator: string; taxNote: string; emiratisationApplies: boolean; visaRule: string; officeNote: string }
const QFZP = '0% on qualifying income as a Qualifying Free Zone Person if Article 18 conditions and the de minimis rule (lower of AED 5m or 5% of revenue) are met; otherwise 9%.';
export const ZONES: Record<Zone, ZoneRule> = {
  ADGM: { label: 'ADGM (Al Maryah, Al Reem)', regulator: 'ADGM Registration Authority', taxNote: QFZP, emiratisationApplies: false,
    visaRule: 'Visas per ADGM office package; flexi-desk available for tech start-up licences.', officeNote: 'Al Maryah and Al Reem Island. Prime availability 0.1%.' },
  MAINLAND: { label: 'Mainland (ADDED)', regulator: 'ADDED (Abu Dhabi Department of Economic Development)', taxNote: '9% corporate tax above AED 375,000 taxable income.', emiratisationApplies: true,
    visaRule: 'About 1 visa per 9 to 11 m² of leased office, by activity.', officeNote: 'Any mainland district. Visa quota follows floor area.' },
  KEZAD: { label: 'KEZAD', regulator: 'KEZAD Group', taxNote: QFZP, emiratisationApplies: false,
    visaRule: 'Office or warehouse packages include visa allocations.', officeNote: 'Industrial and logistics. Packages from about AED 11,000.' },
  MASDAR: { label: 'Masdar City', regulator: 'Masdar City Free Zone', taxNote: QFZP, emiratisationApplies: false,
    visaRule: 'Flexi-desk and office packages with visa allocations.', officeNote: 'Clean-tech and tech.' },
  TWOFOUR54: { label: 'twofour54', regulator: 'twofour54', taxNote: QFZP, emiratisationApplies: false,
    visaRule: 'Media packages with visa allocations.', officeNote: 'Media, gaming, content.' },
};
