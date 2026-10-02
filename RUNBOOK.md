# Runbook — hub71ai-teamvisionary, three Codex accounts, under 2 hours

Clock from the moment you start. Target submit 15:30, hard freeze 15:45 Gulf time.

## 0 to 10 min — one person, the repo and Vercel
1. On GitHub create a public repo named exactly `hub71ai-teamvisionary`. Settings → Collaborators → invite `safwanmohiuddin-droid` and `muslimbarahooe007-max` with Write.
2. Unzip `00-base.zip` and push it as the first commit:
   ```bash
   unzip 00-base.zip && cd 00-base
   git init -b main && git add -A && git commit -m "chore: base contracts, data, tests, pitch skeleton"
   git remote add origin https://github.com/<you>/hub71ai-teamvisionary.git && git push -u origin main
   ```
3. Vercel → Add New Project → import the repo. Framework Vite, root `/`, Node 20. Environment variables: `OPENAI_API_KEY`, `OPENAI_MODEL=gpt-4.1-mini`. Deploy. The base already renders the pitch at `/` and the stub product at `/app`. You now have a live URL before any feature exists.
4. Start the three Codex tasks, one per enterprise account, each pointed at the repo with its own branch name:
   - Account 1: paste `A-engine/PROMPT.md`. Branch `codex/engine`.
   - Account 2: paste `B-screen/PROMPT.md`. Branch `codex/screen`.
   - Account 3: paste `C-ai-pitch/PROMPT.md`. Branch `codex/ai`.
   First line of your message to each: "Work on branch <name>. Read AGENTS.md first." Then the prompt.

## 10 to 70 min — Codex runs, humans collect data
While the three sessions run, do the things only humans can do:
- Send the six-question WhatsApp survey to 15 to 25 people who moved in the last two years (questions are in `docs/PITCH.md` context and the earlier brief). Write down n and the medians.
- Call 10 to 15 schools for FS1, Year 3, Year 7 availability. Write down days to a confirmed seat by curriculum.
- Pull the Nova leasing medians (days enquiry → Tawtheeq, cheque counts, employer guarantee share).
- Draft the one-paragraph spoken opening. Rehearse the 3-minute script in `docs/DEMO_SCRIPT.md`.
At 55 minutes each session must stop and push. If a session is still going at 65, tell it: "Stop now. Push what is green. Open the PR."

## 70 to 95 min — integration (follow INTEGRATION.md exactly)
Merge order A, then C, then B. Run `npm install && npm test && npm run build` after each. Push `main`; Vercel deploys. Smoke test on a phone and a laptop with the five checks in INTEGRATION.md. If the engine PR is red, merge C and B anyway: the app still runs on the fixture and the demo still moves (toggles will not change numbers; say "engine in final test" and demo the pitch, Explain, Draft, Tour). A live URL with a working screen beats a perfect engine on localhost.

## 95 to 110 min — final numbers and submission
- Put the survey n and medians into `src/data/steps.ts` source strings and the pitch `content.ts` hero (third tile) if they differ from the model. One commit, `npm test`, push.
- Record a 2-minute screen video of the demo as backup for bad Wi-Fi.
- Submit: team `Team Visionary`, repo `hub71ai-teamvisionary`, final SHA from `git rev-parse HEAD`, live URL, no login needed. Then do not push again.

## The 3-minute demo (no slides; the pitch site is the slides)
0:00 Open `/`. Scroll: six minutes, five days, thirteen weeks. "Abu Dhabi made every step fast. Nobody owns the order." Scroll through the loop and the discovery section: "Everyone built the checklist for one person. Companies move as a graph."
0:40 Press Enter. Preset A is already rendered. Point at the red path.
0:50 Click the bank bar, fix three answers: 30% to 12%, 32 to 23 days. The date moves.
1:20 Flip direct debit, KYC early, flexi-desk. Week 13 to week 8.
1:50 Explain in English and Arabic; Draft the bank cover letter. "The model does the language, the engine does the dates."
2:20 Preset B: five Emirati hires or AED 45,000 a month, the tax deadline nobody mentions.
2:40 Close with the venture line: companies pay for the date, Abu Dhabi gets the map.

## Rubric, reverse-engineered
1 Real problem: sourced numbers on the pitch and on every bar, plus your survey n. 2 Working and deployed: Vercel URL, no login. 3 OpenAI tooling: four Responses API functions with structured outputs; show Explain and Draft live; mention extraction. 4 Clarity: one sentence, one screen, three clicks, the autoplay as backup. 5 Differentiation: company plus people as one graph, bank score, obligations in AED; every other entry is a personal checklist or chat. 6 Unique dataset: survey, Nova medians, school calls. 7 Unique UI: a schedule that moves, a guided walkthrough, no chat box. 8 New problem: absorption, not demand; the edges, not the list.
