# Landing Sequence — AGENTS.md

One-screen web app: the critical path for moving a company and its people to Abu Dhabi. Built in parallel by three Codex sessions with strict file ownership. Read this whole file before touching anything.

## Commands
- `npm install` · `npm run dev` · `npm test` (Vitest) · `npm run build` (tsc + vite) · `npm run lint` (tsc --noEmit)
- Deploy target: Vercel, framework Vite, `api/` folder = serverless functions. `vercel.json` already excludes `/api` from the SPA rewrite.

## Architecture (fixed)
- `src/model/plan.ts` is the FROZEN contract. Nobody edits it during the parallel build.
- Logic is pure. `src/engine/pipeline.ts` runs modules in this exact order on every change:
  `jurisdiction -> bankable -> obligations -> family -> toggles -> events -> schedule`. Each module is `(plan: Plan) => Plan`. `schedule` returns `ScheduledPlan`.
- React only renders a `ScheduledPlan`. State is one `useReducer` holding a `Plan`.
- AI is server-side only (`api/*`), validated by the zod schemas in `src/ai/schemas.ts`. The client (`src/ai/client.ts`) falls back to `src/ai/mocks.ts` on any failure and sets `aiState.lastMode = 'mock'` so the UI shows a "Demo mode" pill. The model never invents durations; it extracts, explains, drafts and maps questions to plan edits.
- Durations and source strings in `src/data/*` are product data. Change a number only with a source string.

## File ownership (hard rule for the parallel build)
| Pack | Branch | May modify | Must not touch |
|---|---|---|---|
| A Engine | `codex/engine` | `src/engine/**`, `src/modules/**`, `src/data/**` | everything else |
| B Screen | `codex/screen` | `src/views/**`, `src/App.tsx`, `src/index.css`, `tailwind.config.js` | everything else |
| C AI + pitch + ship | `codex/ai` | `api/**`, `src/ai/client.ts`, `src/ai/mocks.ts`, `src/pitch/**`, `index.html`, `README.md`, `docs/**`, `.env.example` | everything else, including `src/ai/schemas.ts` and `src/main.tsx` |
Shared, frozen: `src/model/plan.ts`, `src/ai/schemas.ts`, `src/main.tsx` (routing: `/` pitch, `/app` product), `src/fixtures/**`, `package.json` (already contains react, zod, openai, motion; add nothing else), configs.
If you believe a frozen file must change, write the proposed change in `NOTES.md` under "Contract change requests" and work around it. Do not edit it.

## Worked numbers (Preset A, baseline) so everyone debugs against the same truth
attestation 0→14 · licence 14→28 · kyc_pack 28→35 · bank 35→75.4 (median 32, pReject 0.30, retry 28 → expected 40.4) · chequebook 75.4→82.4 · office 28→42 · establishment card 42→46 · work permits 46→53 · Emirates ID 53→63 · residential leases 82.4→92.4 · go_live 92.4 (week 13.2).
After fixing Bankable Q5, Q6, Q10 and turning on all three toggles: bank 28→54.4 (median 23, pReject 0.12) · establishment card 28→32 · permits 32→39 · leases 39→49 · go_live 54.4 (week 7.8). Ideal (BEST_ANSWERS + all toggles): bank median floor 14, pReject floor 0.08, go_live 49.
Preset B baseline: attestation 0→14 · licence 14→17 · bank median 50, pReject 0.41 · Emiratisation 5 roles, AED 45,000 per month · ct_registration day 107.

## Quality bar
- Zero TypeScript errors, zero console errors on load. Tests never weakened to pass.
- First frame: Preset A fully rendered. No empty state on load. No network needed after load (AI calls are user-triggered and fall back to mocks).
- Phone width 390px: no horizontal page scroll; timeline scrolls inside its container.
- Copy: plain English, no emoji, no exclamation marks. Every duration shows its source on hover or in the drawer.

## Git
- Work only on your branch. Commit small, push often (`git push -u origin <branch>`). Open a PR to `main` titled `[A] engine`, `[B] screen`, `[C] ai`.
- Stop at your time box even if unfinished: push what is green, write `NOTES.md` (decisions, what is missing), and end.
