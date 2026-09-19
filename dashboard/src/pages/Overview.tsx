import { useState } from 'react'
import { useStore } from '../store'
import { overviewBySegment } from '../data'
import { Eyebrow, KpiCard, PageShell, PillTabs, SegmentToggle } from '../components/ui'

export default function Overview() {
  const { segment, setSegment, setPage } = useStore()
  const [period, setPeriod] = useState<'September MTD' | 'August 2026'>('September MTD')
  const data = overviewBySegment[segment]
  const kpis = period === 'September MTD' ? data.mtd : data.august

  const totals = data.funnel.reduce(
    (acc, row) => {
      acc.leads[0] += row.leads[0]
      acc.leads[1] += row.leads[1]
      acc.intel[0] += row.intel[0]
      acc.intel[1] += row.intel[1]
      acc.preLogin[0] += row.preLogin[0]
      acc.preLogin[1] += row.preLogin[1]
      acc.login[0] += row.login[0]
      acc.login[1] += row.login[1]
      return acc
    },
    { leads: [0, 0], intel: [0, 0], preLogin: [0, 0], login: [0, 0] } as {
      leads: [number, number]
      intel: [number, number]
      preLogin: [number, number]
      login: [number, number]
    },
  )

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
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="font-heading font-bold text-xl text-ink">Source-wise Target vs Achieved</h2>
          <span className="font-body text-[13px] text-faint">August 2026 · Monthly · {segment}</span>
        </div>
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
              {data.funnel.map((row) => (
                <tr key={row.source} className="border-t border-line">
                  <td className="px-6 py-4 font-body font-semibold text-sm text-ink">{row.source}</td>
                  <td className="px-6 py-4 font-body text-sm text-ink">
                    {row.leads[0]} / {row.leads[1]}
                  </td>
                  <td className="px-6 py-4 font-body text-sm text-ink">
                    {row.intel[0]} / {row.intel[1]}
                  </td>
                  <td className="px-6 py-4 font-body text-sm text-ink">
                    {row.preLogin[0]} / {row.preLogin[1]}
                  </td>
                  <td className="px-6 py-4 font-body text-sm text-ink">
                    {row.login[0]} / {row.login[1]}
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
      </div>
    </PageShell>
  )
}
