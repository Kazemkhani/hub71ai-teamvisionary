// OWNED BY PACK C. Base version is content-complete and static; pack C adds scroll-driven motion with `motion/react` and keeps this copy.
import { PITCH } from './content';

const Enter = ({ label }: { label: string }) => (
  <a href="/app" className="inline-flex items-center gap-3 bg-accent text-white font-display font-semibold px-6 py-3 text-lg hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
    {label}
    <span aria-hidden className="font-mono">→</span>
  </a>
);

const Eyebrow = ({ children }: { children: string }) => (
  <p className="font-mono text-xs tracking-[0.08em] uppercase text-muted">{children}</p>
);

export default function Pitch() {
  const p = PITCH;
  return (
    <div className="min-h-screen bg-bg text-fg">
      <header className="sticky top-0 z-20 bg-bg/90 backdrop-blur border-b border-line">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <span className="font-display font-bold tracking-tight">{p.wordmark}</span>
          <a href="/app" className="font-mono text-sm text-accent underline underline-offset-4">Enter the demo</a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4">
        <section id="hero" className="py-20 md:py-28 grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-7">
            <Eyebrow>Hub71+ AI Hackathon · Abu Dhabi relocation</Eyebrow>
            <h1 className="font-display font-bold text-5xl md:text-7xl leading-[1.02] mt-4" style={{ textWrap: 'balance' }}>
              {p.hero.headline[0]}<br /><span className="text-accent">{p.hero.headline[1]}</span>
            </h1>
            <p className="mt-6 text-lg max-w-[60ch]">{p.hero.sub}</p>
            <div className="mt-8"><Enter label={p.hero.cta} /></div>
          </div>
          <ol className="md:col-span-5 grid gap-px bg-line border border-line">
            {p.hero.numbers.map((n) => (
              <li key={n.label} className="bg-surface p-5">
                <div className="font-mono tnum text-3xl font-medium">{n.value}</div>
                <div className="mt-1">{n.label}</div>
                <div className="text-xs text-muted mt-1">{n.source}</div>
              </li>
            ))}
          </ol>
        </section>

        <section id="problem" className="py-16 border-t border-line grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <Eyebrow>{p.problem.eyebrow}</Eyebrow>
            <h2 className="font-display font-semibold text-3xl md:text-4xl mt-3" style={{ textWrap: 'balance' }}>{p.problem.headline}</h2>
            <ol className="mt-6 flex flex-wrap gap-2 font-mono text-sm">
              {p.problem.loop.map((s, i) => (
                <li key={s} className="flex items-center gap-2"><span className="border border-line bg-surface px-2 py-1">{s}</span>{i < p.problem.loop.length - 1 && <span aria-hidden>→</span>}</li>
              ))}
            </ol>
          </div>
          <ul className="md:col-span-7 grid sm:grid-cols-2 gap-px bg-line border border-line">
            {p.problem.facts.map((f) => (
              <li key={f.value} className="bg-surface p-5">
                <div className="font-mono tnum text-2xl text-crit">{f.value}</div>
                <p className="mt-1 text-sm">{f.text}</p>
                <p className="text-xs text-muted mt-2">{f.source}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="discovery" className="py-16 border-t border-line max-w-[70ch]">
          <Eyebrow>{p.discovery.eyebrow}</Eyebrow>
          <h2 className="font-display font-semibold text-3xl md:text-4xl mt-3" style={{ textWrap: 'balance' }}>{p.discovery.headline}</h2>
          <p className="mt-5 text-lg">{p.discovery.body}</p>
        </section>

        <section id="solution" className="py-16 border-t border-line grid md:grid-cols-12 gap-10">
          <div className="md:col-span-6">
            <Eyebrow>{p.solution.eyebrow}</Eyebrow>
            <h2 className="font-display font-semibold text-3xl md:text-4xl mt-3" style={{ textWrap: 'balance' }}>{p.solution.headline}</h2>
            <ul className="mt-6 grid gap-3 list-disc pl-5">{p.solution.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
            <div className="mt-8"><Enter label="See it move" /></div>
          </div>
          <div className="md:col-span-6 grid gap-px bg-line border border-line self-start">
            {[p.solution.before, p.solution.after].map((row, i) => (
              <div key={row.label} className="bg-surface p-5 grid grid-cols-[1fr_auto] gap-4 items-center">
                <div>
                  <div className="font-mono text-xs uppercase tracking-[0.08em] text-muted">{i === 0 ? 'Go-live today' : 'Go-live after three decisions'}</div>
                  <div className="text-sm mt-1">{row.label}</div>
                </div>
                <div className={`font-mono tnum text-4xl font-medium ${i === 0 ? 'text-crit' : 'text-accent'}`}>wk {row.weeks}</div>
              </div>
            ))}
          </div>
        </section>

        {[p.data, p.ai].map((sec) => (
          <section key={sec.eyebrow} className="py-16 border-t border-line">
            <Eyebrow>{sec.eyebrow}</Eyebrow>
            <h2 className="font-display font-semibold text-3xl md:text-4xl mt-3 max-w-[30ch]" style={{ textWrap: 'balance' }}>{sec.headline}</h2>
            <ul className="mt-8 grid md:grid-cols-2 gap-px bg-line border border-line">
              {sec.items.map((it) => (
                <li key={it.title} className="bg-surface p-5"><h3 className="font-display font-semibold text-lg">{it.title}</h3><p className="mt-2 text-sm">{it.text}</p></li>
              ))}
            </ul>
          </section>
        ))}

        <section id="world" className="py-16 border-t border-line">
          <Eyebrow>{p.world.eyebrow}</Eyebrow>
          <ul className="mt-6 grid md:grid-cols-4 gap-px bg-line border border-line">
            {p.world.items.map((w) => (
              <li key={w.place} className="bg-surface p-5"><div className="font-mono text-xs uppercase tracking-[0.08em] text-muted">{w.place}</div><p className="mt-2 text-sm">{w.lesson}</p></li>
            ))}
          </ul>
        </section>

        <section id="venture" className="py-20 border-t border-line grid md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-7">
            <Eyebrow>{p.venture.eyebrow}</Eyebrow>
            <h2 className="font-display font-semibold text-3xl md:text-5xl mt-3" style={{ textWrap: 'balance' }}>{p.venture.headline}</h2>
            <p className="mt-5 text-lg max-w-[65ch]">{p.venture.body}</p>
          </div>
          <div className="md:col-span-5 md:pt-14"><Enter label={p.venture.cta} /></div>
        </section>
      </main>
      <footer className="border-t border-line"><div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted">{p.footer}</div></footer>
    </div>
  );
}
