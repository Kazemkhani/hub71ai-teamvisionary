# Adversarial review of prior art, and what we did about it

## Keystone (friend's prototype, github.com/safwanmohiuddin-droid/keystone)
Strengths we absorbed:
- The "keystone step": among available steps, the one that unlocks the most downstream steps. We compute `unlocks` (transitive descendants) per node and expose `keystoneStep` and the Start Today list.
- Stuck-mode rerouting: "bank rejected me", "landlord delayed". We model these as `events` that change durations and edges, and the schedule recomputes.
- Server-only AI with zod-validated responses and realistic mock fallback, with a visible Demo mode indicator. Adopted verbatim as a principle.
- A deterministic demo path and a written three-minute script. Adopted.
- A quality bar (zero console errors, keyboard reachable, phone width, reduced motion). Adopted.
- Bilingual output. Adopted for AI explanations and drafts (EN plus AR).

Weaknesses we avoided:
- Individual-only. It plans one newcomer. Companies move as a graph of people plus the company's own licence, bank, office and obligations. We model the company and every person in one graph with a single go-live.
- No evidence base. All data is labelled synthetic and the landing page numbers are illustrative. Every duration in our data carries a source string and the pitch leads with verifiable public figures plus our own survey.
- No live URL. Localhost scores 3 of 5 on the deployment criterion. We deploy to Vercel first and build second.
- Scope. Eight scroll sections, a WebGL dune shader, a press-and-hold persona switcher, voice behind a flag, three personas. For a one-day build that is demo risk, and the animation-heavy landing page is close to the generic "AI showcase" look. We ship one screen with one signature interaction: the date moving when a decision changes.
- No money. It never tells you what a wrong order costs in dirhams. We show AED exposure on Emiratisation and tax, and "days left on the table" on every state.

## Hub71+ AI Hackathon entries we could see (2 October 2026)
- Arrival: conversational checklist with voice, Cloudflare Workers, Responses API structured outputs. Chat box UI. Hosted on ChatGPT Sites with judge access needing arrangement. Lesson: a chat box is the baseline; our UI is a diagram that moves. We deploy on a public Vercel URL.
- Move2AD: profession and experience in, visa routes and costs out as designed pages, Laravel plus Vue, web search limited to official domains. Lesson: designed output pages beat transcripts; we go one step further with a computed schedule rather than generated prose.
- Life Setup Agent: deterministic dependency engine for individuals, Astro plus Spring Boot, curated official sources, OpenAI only to interpret questions into task ids. Closest to our thinking. Lesson: they prove the deterministic-engine approach reads well to judges. Our difference is the company dimension, the bank readiness score, the obligations in dirhams and the what-if that edits the plan.
- Just Landed (LOTUSPMO): 100-question knowledge base plus document upload. Lesson: static knowledge bases age; we show sources per duration and a flywheel that recalibrates.

## Design decisions taken from the review
1. One graph, two presets, three toggles, one Bankable form. Nothing else on the first screen.
2. Deterministic engine with acceptance tests that encode the demo numbers. The model never writes a duration.
3. AI where language is the work: extraction from documents, explanation in two languages, drafts in two languages, what-if to plan edits.
4. Every number has a source string. The footer says which are medians from published ranges and which are our survey.
5. Live URL before features. Integration branch merges three ownership-bounded branches in a fixed order.
