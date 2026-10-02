# Integration (20 minutes, one person or one Codex session)

Branches touch disjoint files by construction, so merges are mechanical. Order: A, then C, then B.

```bash
git checkout main && git pull
git merge --no-ff origin/codex/engine -m "merge: engine"
npm install && npm test            # engine tests must be green now
git merge --no-ff origin/codex/ai -m "merge: ai"
npm test && npm run build
git merge --no-ff origin/codex/screen -m "merge: screen"
npm install && npm test && npm run build
git push origin main               # Vercel deploys main automatically
```

If any merge reports a conflict, the conflicting file was edited outside its owner's paths. Resolve by taking the owner's version (`git checkout --theirs <file>` for the owner's branch), then re-run tests.

Smoke test on the Vercel URL, on a phone and a laptop:
1. Page loads with Preset A rendered, red critical path, go-live date visible.
2. Click the bank bar, set Q5, Q6, Q10 to Yes: risk 30% to 12%, review 32 to 23 days, date moves.
3. Flip cheque-free, then KYC-early, then flexi-desk: date moves each time, ends around week 7.8.
4. Click Explain on the bank node: text appears (live or Demo mode pill).
5. Switch to Preset B: Emiratisation card shows 5 roles and AED 45,000 per month.

Vercel project settings: framework Vite, root directory `/`, env `OPENAI_API_KEY`, `OPENAI_MODEL`. Node 20.

Submission: copy the final `git rev-parse HEAD`, the live URL, team name `Team Visionary`, repo `hub71ai-teamvisionary`. After submitting, do not push again.
