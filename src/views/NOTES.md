# Screen decisions

- Task B changes are limited to src/views, src/App.tsx and src/index.css. The branch was fast-forwarded to main after task A merged; no engine or frozen-contract edits belong to this PR.
- One Plan reducer controls presets, jurisdiction, headcount, date, bank answers, decisions and setbacks. Headcount changes retain the preset's skilled-staff proportion, rounded and capped at total headcount. The people manifest remains the selected preset's manifest; headcount does not invent employees.
- Invalid dates, out-of-range headcounts and unknown or unsupported bank answers are rejected by the reducer. What-if output is previewed and requires Apply. A changed plan invalidates an older proposal.
- The timeline derives all rows from ScheduledPlan nodes and schedules. Family members get individual people rows; others share a range row. Family steps and obligation milestones have separate groups. Source details are available through pointer hover, keyboard focus and the drawer.
- Native dialogs provide focus containment, Esc and focus restoration. The drawer is non-modal while the tour owns the modal layer; this prevents the bank form from covering the tour controls. Demo controls are rendered inside the drawer's modal layer when it is open.
- A full 90-second timer script defines the demo. Cancelling clears every pending action; replay starts Preset A again. AI explanations do not gate the timer script. The supplied client handles absent APIs and the screen refreshes its Demo mode indicator after completed calls.
- Tour state is session-local when storage is unavailable. It is offered by a banner and never opens automatically. The seventh spotlight includes both Start here and Start today.
- Existing colour and font tokens were retained. CSS transitions and the numeric tween respect reduced motion. No packages or generated build files were added.
- A data-URI product favicon is installed from App because index.html is outside task B's ownership and the missing default icon caused a console error on load.

## Contract change requests

None. The model, schemas, engine exports and AI client are unchanged.

## Verification

- Initial screen reducer tests failed because its state module did not yet exist; all four passed after implementation.
- Added eight tests: reducer input/proposal handling (4), autoplay timing/cancellation (2), timeline grouping (2).
- Final npm test: 48 passing tests. npm run lint, npm run build and git diff --check pass.
- Chromium checked at 1440px and 390px. At 390px the document width is exactly 390px, while the timeline scrolls inside its container. The drawer is a 390px-wide bottom sheet.
- All eight tour steps completed on desktop and phone. Esc, modal focus containment and English clipboard copy were exercised.
- Mock Explain and Draft rendered English and Arabic. What-if preview left decisions unchanged until Apply; the Demo mode pill appeared after fallback.
- With the real engine, Preset A moves from week 13.2 to 7.8 after Q5, Q6, Q10 and the three decisions. Preset B renders 52 people in the shared path row and shows five Emirati roles with AED 45,000 monthly exposure.
- The entire autoplay script completed using Playwright's controlled clock, including the Arabic explanation, Preset B, end card, Replay, Esc cancellation and click cancellation inside the drawer. Reduced motion was also exercised.
- No console errors on initial load and no uncaught browser errors in checked flows. Absent API calls produce expected HTTP failures before the unchanged client supplies mock output.
- Live AI responses, assistive-technology speech output, Safari and Firefox were not exercised. The existing dependency audit is recorded in src/engine/NOTES.md and remains outside this task's scope.
