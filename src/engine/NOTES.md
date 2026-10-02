# Engine decisions

- The pipeline rebuilds nodes from templates on every run. Inputs, presets and template dependency arrays are never mutated. Event identifiers represent active setbacks, so duplicate identifiers apply once.
- The ideal schedule is calculated in the pipeline through a separate module/scheduler pass with all toggles, BEST_ANSWERS and no events. The standalone scheduler sets idealGoLiveDay to its own goLiveDay; callers requiring the comparison use pipeline.
- Anchors count as graph dependencies even if absent from dependsOn. Missing dependencies and a missing go_live node produce explicit errors. Transitive unlocks include anchored obligations and count each descendant once.
- Licence labels use the full display label from ZONES. School delays match each child's curriculum rather than parsing display text.
- Large Emiratisation thresholds use skilledHeadcount; the 20 to 49 staff band uses total headcount. With at least 50 total staff but fewer than 50 skilled staff, neither specified rule applies. Sector filtering is not implemented because the supplied data has no targeted-sector list.
- Calendar checkpoints use UTC and the first checkpoint on or after the start date, including that same day. Labels show the actual checkpoint date and year, rather than a fixed 2026 date when the plan starts in 2027 or later. The supplied 2026 exposure rates remain the task's product assumptions.
- Event delay estimates live in src/data/events.ts with the task brief as their source. Bank p80 uses the existing bank template's 14-day median-to-p80 buffer.
- Decisions are recorded here rather than at repository root to preserve task A's ownership boundary.

## Contract change requests

None. The frozen model and original acceptance tests are unchanged.

## Verification

- Before implementation: npm test had 14 failing tests and 11 passing tests.
- After implementation: all 21 original engine acceptance tests and all 4 schema tests pass.
- Added 15 edge-case tests covering frozen inputs, calendar boundaries, thresholds, bank clamps, combined events, empty teams, anchored deadlines, distinct descendants, ties and graph errors.
- Every TypeScript edit was followed by a type check or its targeted test plus a type check. Final full suite, lint and build results are recorded in the pull request.

## Dependency audit

npm install reports 12 existing vulnerabilities: 5 moderate, 5 high and 2 critical. The critical findings affect vitest and tar (in the @vercel/node dependency chain). Dependency manifests and lockfiles are outside task A's permitted scope, so no dependency changes or automatic audit fixes were applied. The shipping owner should review npm audit before deployment.
