import { afterEach, describe, expect, it, vi } from 'vitest';
import { DEMO_STEPS, startAutoplay } from './Autoplay';

afterEach(() => vi.useRealTimers());

describe('Deterministic demo', () => {
  it('finishes at 90 seconds with all three decisions, two presets and an explanation', () => {
    vi.useFakeTimers();
    const run = vi.fn();
    startAutoplay(run);
    vi.advanceTimersByTime(89999);
    expect(run.mock.calls.some(([step]) => step.end)).toBe(false);
    vi.advanceTimersByTime(1);
    const steps = run.mock.calls.map(([step]) => step);
    expect(steps).toEqual(DEMO_STEPS);
    expect(steps.filter((step) => step.action?.type === 'setToggle')).toHaveLength(3);
    expect(steps.filter((step) => step.action?.type === 'setPreset')).toHaveLength(2);
    expect(steps.some((step) => step.explain && step.open === 'bank_account')).toBe(true);
  });
  it('cancels every pending action and can replay from the beginning', () => {
    vi.useFakeTimers();
    const run = vi.fn();
    const cancel = startAutoplay(run);
    vi.advanceTimersByTime(12000);
    const count = run.mock.calls.length;
    cancel();
    vi.advanceTimersByTime(100000);
    expect(run).toHaveBeenCalledTimes(count);
    startAutoplay(run);
    vi.advanceTimersByTime(0);
    expect(run.mock.calls.at(-1)?.[0].action).toEqual({ type: 'setPreset', preset: 'A' });
  });
});
