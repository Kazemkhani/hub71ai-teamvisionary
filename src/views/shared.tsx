import type { Owner } from '../model/plan';

const OWNER_LABELS: Record<Owner, string> = {
  gov: 'Licensing authority', federal: 'Federal authority', bank: 'Bank',
  landlord: 'Landlord', school: 'School', company: 'Your company',
};
export function OwnerChip({ owner }: { owner: Owner }) {
  return <span className={`owner-chip owner-${owner}`}>{OWNER_LABELS[owner]}</span>;
}
export function days(value: number): string { return Number.isInteger(value) ? String(value) : value.toFixed(1); }
export function money(value: number): string { return new Intl.NumberFormat('en-GB').format(value); }
