import type { ScheduledPlan } from '../model/plan';
import { formatDay } from '../model/plan';
import { money } from './shared';

export function ObligationCards({ scheduled, onOpen }: { scheduled: ScheduledPlan; onOpen: (id: string) => void }) {
  const emiratisation = Object.values(scheduled.nodes).filter((node) => node.id.startsWith('emiratisation'));
  const date = (id: string) => scheduled.schedule[id] ? formatDay(scheduled.company.startDate, scheduled.schedule[id].start) : 'Awaiting licence';
  return <section className="obligations" data-tour="obligations" aria-labelledby="obligations-title"><div className="section-heading"><h2 id="obligations-title">After the licence, keep these in view</h2></div>
    <div className="obligation-grid"><article className="panel"><span className="hidden-label">Hidden obligation</span><h3>Corporate tax registration</h3>
      <p className="obligation-date">{date('ct_registration')}</p><p>AED 10,000 penalty if late</p><button onClick={() => onOpen('ct_registration')} disabled={!scheduled.nodes.ct_registration}>View source</button></article>
    <article className="panel" data-tour="emiratisation"><span className="hidden-label">Hidden obligation</span><h3>Emiratisation</h3>
      {emiratisation.length ? emiratisation.map((node) => <div key={node.id}><button className="text-button" onClick={() => onOpen(node.id)}>{node.label}</button>
        <p className="obligation-date">{date(node.id)}</p><p>AED {money(node.costAED ?? 0)} {node.id === 'emiratisation_annual' ? 'annual' : 'monthly'} exposure</p></div>)
        : <p className="muted">{scheduled.company.zone !== 'MAINLAND' ? 'Emiratisation does not apply in free zones'
          : scheduled.company.headcount < 20 ? 'Emiratisation does not apply below 20 staff' : 'No Emiratisation milestone in this plan'}</p>}
    </article><article className="panel"><span className="muted">Annual checkpoint</span><h3>Licence renewal</h3><p className="obligation-date">{date('licence_renewal')}</p>
      <p>Keep the company licensed.</p><button onClick={() => onOpen('licence_renewal')} disabled={!scheduled.nodes.licence_renewal}>View source</button></article></div>
  </section>;
}
