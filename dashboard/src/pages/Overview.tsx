import { useMemo, useState } from 'react'
import { useStore } from '../store'
import { buildWeeklyFunnel, overviewBySegment, toMonthlyDisplayRows, WEEK_LABELS } from '../data'
import type { WeeklyFunnelRow } from '../types'
import { Eyebrow, KpiCard, LeadNamesModal, PageShell, PillTabs, SegmentToggle, StageCell } from '../components/ui'

interface ActiveModal {
  title: string
  names: string[]
}

export default function Overview() {
  const { segment, setSegment, setPage } = useStore()
  const [period, setPeriod] = useState<'September MTD' | 'August 2026'>('September MTD')
  const [view, setView] = useState<'Monthly' | 'Weekly'>('Monthly')
  const [modal, setModal] = useState<ActiveModal | null>(null)
  const data = overviewBySegment[segment]
  const kpis = period === 'September MTD' ? data.mtd : data.august

  const monthlyRows = useMemo(() => toMonthlyDisplayRows(data.funnel), [data.funnel])
  const weeklyRows = useMemo(() => buildWeeklyFunnel(data.funnel), [data.funnel])

  const openModal = (source: string, stage: string, periodLabel: string, names: string[]) => {
    setModal({ title: `${source} — ${stage} — ${periodLabel}`, names })
  }

  return (
    <PageShell
      footerRight={
        <button
          onClick={() => setPage('sources')}
          className="font-body font-semibold text-sm text-gold-dark hover:text-gold"
        >
          View lead analysis →
        </button>
      }
    >
      <div className="flex items-end justify-between flex-wrap gap-6">
        <div>
          <Eyebrow>Central Marketing</Eyebrow>
          <h1 className="font-heading font-bold text-[32px] text-ink">Lead-Gen Performance Report</h1>
          <p className="font-body text-[15px] text-muted mt-2 max-w-[560px]">
            Funnel performance across Google, Meta, LinkedIn and outbound calling for the SDR team.
          </p>
        </div>
        <PillTabs options={['September MTD', 'August 2026']} value={period} onChange={(v) => setPeriod(v as typeof period)} />
      </div>

      <div className="border-t border-line" />

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <span className="font-body text-[12px] font-semibold tracking-[1px] text-faint uppercase">Segment</span>
          <SegmentToggle value={segment} onChange={setSegment} />
        </div>
        <span className="font-body text-[13px] text-faint">
          {period === 'September MTD' ? 'MTD · as of 19 Sep 2026' : 'August 2026 · Full month'} · {segment} accounts
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} label={kpi.label} achieved={kpi.achieved} target={kpi.target} />
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="font-heading font-bold text-xl text-ink">Source-wise Target vs Achieved</h2>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-body text-[13px] text-faint">August 2026 · {segment}</span>
            <PillTabs options={['Monthly', 'Weekly']} value={view} onChange={(v) => setView(v as typeof view)} />
          </div>
        </div>

        <p className="font-body text-[13px] text-faint -mt-1">
          Click any Intel, Pre Login or Login figure to see which leads reached that stage.
        </p>

        {view === 'Monthly' ? (
          <FunnelTable rows={monthlyRows} periodLabel="August 2026" onOpenNames={openModal} />
        ) : (
          <div className="flex flex-col gap-6">
            {weeklyRows.map((rows, i) => (
              <div key={WEEK_LABELS[i]} className="flex flex-col gap-3">
                <span className="font-body text-[12px] font-semibold tracking-[1px] text-faint uppercase">
                  {WEEK_LABELS[i]}
                </span>
                <FunnelTable rows={rows} periodLabel={WEEK_LABELS[i]} onOpenNames={openModal} />
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && <LeadNamesModal title={modal.title} names={modal.names} onClose={() => setModal(null)} />}
    </PageShell>
  )
}

function FunnelTable({
  rows,
  periodLabel,
  onOpenNames,
}: {
  rows: WeeklyFunnelRow[]
  periodLabel: string
  onOpenNames: (source: string, stage: string, periodLabel: string, names: string[]) => void
}) {
  const totals = rows.reduce(
    (acc, row) => {
      acc.leads[0] += row.leads.achieved
      acc.leads[1] += row.leads.target
      acc.intel[0] += row.intel.achieved
      acc.intel[1] += row.intel.target
      acc.preLogin[0] += row.preLogin.achieved
      acc.preLogin[1] += row.preLogin.target
      acc.login[0] += row.login.achieved
      acc.login[1] += row.login.target
      return acc
    },
    { leads: [0, 0], intel: [0, 0], preLogin: [0, 0], login: [0, 0] } as Record<string, [number, number]>,
  )

  return (
    <div className="border border-line rounded-2xl overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-panel">
            {['Source', 'Leads', 'Intel', 'Pre Login', 'Login'].map((h) => (
              <th key={h} className="font-body text-[11px] font-semibold tracking-[1px] text-faint uppercase px-6 py-3">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.source} className="border-t border-line">
              <td className="px-6 py-4 font-body font-semibold text-sm text-ink">{row.source}</td>
              <td className="px-6 py-4 font-body text-sm text-ink">
                {row.leads.achieved} / {row.leads.target}
              </td>
              <td className="px-6 py-4">
                <StageCell
                  achieved={row.intel.achieved}
                  target={row.intel.target}
                  names={row.intel.names}
                  onOpen={() => onOpenNames(row.source, 'Intel / STS', periodLabel, row.intel.names)}
                />
              </td>
              <td className="px-6 py-4">
                <StageCell
                  achieved={row.preLogin.achieved}
                  target={row.preLogin.target}
                  names={row.preLogin.names}
                  onOpen={() => onOpenNames(row.source, 'Pre Login', periodLabel, row.preLogin.names)}
                />
              </td>
              <td className="px-6 py-4">
                <StageCell
                  achieved={row.login.achieved}
                  target={row.login.target}
                  names={row.login.names}
                  onOpen={() => onOpenNames(row.source, 'Login', periodLabel, row.login.names)}
                />
              </td>
            </tr>
          ))}
          <tr className="border-t border-line bg-panel">
            <td className="px-6 py-4 font-body font-bold text-sm text-ink">Total</td>
            <td className="px-6 py-4 font-body font-bold text-sm text-ink">
              {totals.leads[0]} / {totals.leads[1]}
            </td>
            <td className="px-6 py-4 font-body font-bold text-sm text-ink">
              {totals.intel[0]} / {totals.intel[1]}
            </td>
            <td className="px-6 py-4 font-body font-bold text-sm text-ink">
              {totals.preLogin[0]} / {totals.preLogin[1]}
            </td>
            <td className="px-6 py-4 font-body font-bold text-sm text-ink">
              {totals.login[0]} / {totals.login[1]}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
