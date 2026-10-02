// Pitch copy. Every number here is sourced in docs/PITCH.md and docs/REVIEW.md. Edit copy here, not in components.
export const PITCH = {
  wordmark: 'Landing Sequence',
  tagline: 'The critical path for moving a company and its people to Abu Dhabi.',
  hero: {
    numbers: [
      { value: '6 min', label: 'to a trade licence', source: 'TAMM Investor Journey' },
      { value: '5 days', label: 'to a work visa', source: 'Work Bundle, MoHRE and ICP' },
      { value: '13 weeks', label: 'until the company is operational', source: 'Our model, Preset A, from published ranges and our survey' },
    ],
    headline: ['Abu Dhabi made every step fast.', 'Nobody owns the order.'],
    sub: 'A relocating company waits months after its six-minute licence, because the steps across government, banks, landlords and schools are done in the wrong sequence. We show the critical path, the date you can plan payroll around, and what to start today.',
    cta: 'Enter the demo',
  },
  problem: {
    eyebrow: 'Criterion 1 · Real problem',
    headline: 'The loop every newcomer hits',
    loop: ['Licence', 'Bank account', 'Chequebook', 'Lease', 'Tawtheeq', 'School seat'],
    facts: [
      { value: '2 to 6 wks', text: 'to a corporate bank account, about 30% rejected first time, over 60% of those for source-of-funds documents.', source: 'Meydan FZ; UpperSetup 2026' },
      { value: '1 to 4', text: 'post-dated cheques per lease. No chequebook for weeks after arrival.', source: 'The National' },
      { value: '0.1%', text: 'prime office space available. Mainland visas need about 9 to 11 m² each.', source: 'Cushman & Wakefield Core, Q3 2025' },
      { value: 'AED 9,000', text: 'per month per unfilled Emirati role for mainland firms with 50+ skilled staff.', source: 'MoHRE, 2026' },
      { value: '6 to 12 mo', text: 'advised lead time for school seats; most year groups at established UK and IB schools are waitlisted.', source: 'ISchoolAdvisor 2026' },
    ],
  },
  discovery: {
    eyebrow: 'Criterion 8 · New problem discovered',
    headline: 'Everyone built the checklist for one person. Companies move as a graph.',
    body: 'Demand is not the problem. New licences grew 29% in 2025 and ADGM operating entities grew 43%. The bottleneck moved to absorption: the private steps after the licence, and obligations nobody warns you about. The licence gates the visa file, the bank gates the chequebook, the chequebook gates every lease, the office floor gates the visa quota, the school year group gates the family. The value is in the edges.',
  },
  solution: {
    eyebrow: 'Criterion 5 · Differentiation',
    headline: 'A schedule you can plan payroll around, not a chat transcript.',
    before: { label: 'Today', weeks: 13.2 },
    after: { label: 'With a complete bank file, KYC in parallel, direct-debit rent and a flexi-desk visa file', weeks: 7.8 },
    bullets: [
      'One dependency graph for the company and every relocating person. Deterministic critical path and go-live date.',
      'Bankable: twelve questions score your bank-account rejection risk and review time, and tell you which documents are missing.',
      'Hidden obligations in dirhams: Emiratisation checkpoints, corporate tax registration, licence renewal.',
      'Three decisions you can flip, and the date moves while you watch.',
    ],
  },
  data: {
    eyebrow: 'Criterion 6 · Unique dataset',
    headline: 'Every duration has a source. Some of them are ours.',
    items: [
      { title: 'Relocation survey', text: 'Days to Emirates ID, bank account, lease and school seat from people who moved in the last two years. Sample size shown on screen.' },
      { title: 'Nova Real Estate leasing medians', text: 'Days from enquiry to Tawtheeq for corporate relocators, cheque-count distribution, share of deals needing an employer guarantee.' },
      { title: 'School availability calls', text: 'FS1, Year 3 and Year 7 availability by curriculum for the January and September intakes, called today.' },
      { title: 'Published ranges, cited', text: 'Bank review times, visa processing, rent indices, vacancy, Emiratisation and tax rules, each with its source string in the data.' },
    ],
  },
  ai: {
    eyebrow: 'Criterion 3 · Use of OpenAI tooling',
    headline: 'The model does the language. The engine does the dates.',
    items: [
      { title: 'Read the documents', text: 'Trade licence, MOA and offer letters go in; company facts and the relocating people come out, with evidence quotes. Responses API, structured outputs, PDF and image input.' },
      { title: 'Explain any step in English and Arabic', text: 'Why it sits on the critical path, what it unlocks, what to do today.' },
      { title: 'Draft the paperwork', text: 'Bank cover letter, employer rent guarantee, school application, direct-debit proposal to a landlord. Bilingual.' },
      { title: 'Ask what-if in plain words', text: 'A question becomes plan edits, never invented numbers. The schedule recomputes.' },
    ],
  },
  world: {
    eyebrow: 'What world-class programmes do',
    items: [
      { place: 'Singapore LifeSG, New Zealand SmartStart', lesson: 'Bundle services around a life event. Moving a company is one.' },
      { place: 'Denmark International Citizen Service', lesson: 'ID, digital ID and tax card in one visit. Our landing pass is that visit, per person.' },
      { place: 'Estonia e-Residency', lesson: 'Fixed its banking bottleneck once it had the data. Our Bankable score is the data.' },
      { place: 'Saudi RHQ programme', lesson: 'Made the HQ decision a spreadsheet. Our obligations module does the same for Abu Dhabi.' },
    ],
  },
  venture: {
    eyebrow: 'The venture',
    headline: 'Companies pay for the date. Abu Dhabi gets the map.',
    body: 'Buyer: the COO or head of people relocating 10 to 200 roles. Channel: ADGM, Hub71, ADRO and PRO firms, who answer sequencing questions by email today. Revenue: a per-relocation fee plus referrals from banks, schools and landlords who want document-complete applicants. Every plan reports real durations. Aggregated, that is the licence-to-operational bottleneck map the emirate does not have, and the evidence for shared KYC, direct-debit rent and school seat windows.',
    cta: 'Enter the demo',
  },
  footer: 'Hub71+ AI Hackathon, 2 October 2026. Team Visionary. Durations are medians from published ranges and our survey; sources on every bar.',
};
