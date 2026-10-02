import { describe, expect, it } from 'vitest';
import { FIXTURE_SCHEDULED_A } from '../fixtures/scheduled-preset-a';
import { timelineRows } from './timelineRows';

describe('Timeline grouping', () => {
  it('separates company, people, families and obligations without duplicating steps', () => {
    const rows = timelineRows(FIXTURE_SCHEDULED_A);
    expect(rows.filter((row) => row.group).map((row) => row.label)).toEqual(['Company', 'People', 'Families', 'After go-live']);
    const ids = rows.flatMap((row) => row.nodes.map((node) => node.id));
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).not.toContain('go_live');
    expect(rows.find((row) => row.label.includes('CEO'))?.nodes.every((node) => !node.tags?.includes('family'))).toBe(true);
    expect(rows.find((row) => row.label === 'Obligation checkpoints')?.nodes).toHaveLength(2);
  });
  it('collapses people without families while retaining every underlying node for the range', () => {
    const plan = structuredClone(FIXTURE_SCHEDULED_A);
    plan.people[0].family = undefined;
    const rows = timelineRows(plan);
    const collapsed = rows.find((row) => row.collapsed);
    expect(collapsed?.label).toBe('1 more people, same path');
    expect(collapsed?.nodes.map((node) => node.id)).toEqual([
      'degree_attestation@p1', 'work_permit_visa@p1', 'emirates_id@p1', 'residential_lease@p1',
    ]);
  });
});
