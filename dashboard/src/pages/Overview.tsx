import { useMemo, useState } from 'react'
import { useStore } from '../store'
import { buildWeeklyMetrics, getMtdData, MTD_WEEK_LABELS } from '../data'
import type { MetricRow, OverviewSegment } from '../types'
import { Eyebrow, PageShell } from '../components/ui'

export default function Overview() {
  const { segment: globalSegment, setSegment, setPage } = useStore()
  const [segment, setLocalSegment] = useState<OverviewSegment>(globalSegment)

  const chooseSegment = (s: OverviewSegment) => {
    setLocalSegment(s)
    if (s !== 'All') setSegment(s)
  }

  const mtd = useMemo(() => getMtdData(segment), [segment])
  const weeks = useMemo(() => buildWeeklyMetrics(mtd.metrics), [mtd.metrics])

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
            MTD funnel performance and weekly bifurcation for the SDR team, as of 19 Sep 2026.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="font-body text-[12px] font-semibold tracking-[1px] text-faint uppercase">Segment</span>
          <ThreeWayToggle value={segment} onChange={chooseSegment} />
        </div>
      </div>

      <div className="border-t border-line" />

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="font-heading font-bold text-xl text-ink">MTD — September, 2026</h2>
          <span className="font-body text-[13px] text-faint">{segment} · as of 19 Sep 2026</span>
        </div>
        <MetricsTable rows={mtd.metrics} />
      </div>

      <div className="flex flex-col gap-6">
        <h2 className="font-heading font-bold text-xl text-ink">Weekly Bifurcation</h2>
        {weeks.map((rows, i) => (
          <div key={MTD_WEEK_LABELS[i]} className="flex flex-col gap-3">
            <span className="font-body text-[13px] font-semibold tracking-[1px] text-gold-dark uppercase">
              {MTD_WEEK_LABELS[i]}
            </span>
            <MetricsTable rows={rows} />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-heading font-bold text-xl text-ink">Leads by Stage</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StageNameColumn title="STS" names={mtd.stageNames.sts} />
          <StageNameColumn title="PL" names={mtd.stageNames.pl} />
          <StageNameColumn title="Login" names={mtd.stageNames.login} />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-heading font-bold text-xl text-ink">PL → Login Watchlist</h2>
        <div className="border border-line rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-panel">
                <th className="font-body text-[11px] font-semibold tracking-[1px] text-faint uppercase px-6 py-3">
                  PL to be Login
                </th>
                <th className="font-body text-[11px] font-semibold tracking-[1px] text-faint uppercase px-6 py-3">
                  PL Month
                </th>
              </tr>
            </thead>
            <tbody>
              {mtd.plToLogin.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-6 py-6 font-body text-sm text-faint text-center">
                    No Pre Login leads queued to convert this month.
                  </td>
                </tr>
              ) : (
                mtd.plToLogin.map((row, i) => (
                  <tr key={row.company + i} className="border-t border-line">
                    <td className="px-6 py-4 font-body font-semibold text-sm text-ink">{row.company}</td>
                    <td className="px-6 py-4 font-body text-sm text-muted">{row.month}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  )
}

function ThreeWayToggle({ value, onChange }: { value: OverviewSegment; onChange: (v: OverviewSegment) => void }) {
  const options: OverviewSegment[] = ['SME', 'Enterprise', 'All']
  return (
    <div className="flex bg-panel border border-line rounded-full p-1">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`font-body font-semibold text-[13px] px-4 py-2 rounded-full transition-colors whitespace-nowrap ${
            value === opt ? 'bg-ink text-white' : 'text-muted hover:text-ink'
          }`}
        >
          {opt === 'Enterprise' ? 'EV' : opt}
        </button>
      ))}
    </div>
  )
}

function MetricsTable({ rows }: { rows: MetricRow[] }) {
  return (
    <div className="border border-line rounded-2xl overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-panel">
            {['Metric', 'Target (Monthly)', 'Achieved', 'Deficit', 'Remark / Key Insights'].map((h) => (
              <th key={h} className="font-body text-[11px] font-semibold tracking-[1px] text-faint uppercase px-6 py-3">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const deficit = Math.max(row.target - row.achieved, 0)
            const remark = row.target > 0 ? Math.round((deficit / row.target) * 10000) / 100 : null
            const isLeads = row.metric === 'Leads'
            return (
              <tr key={row.metric} className={i > 0 ? 'border-t border-line' : ''}>
                <td className="px-6 py-4 font-body font-semibold text-sm text-ink">{row.metric}</td>
                <td className="px-6 py-4 font-body text-sm text-ink">{row.target}</td>
                <td className="px-6 py-4 font-body text-sm text-ink">{row.achieved}</td>
                <td className="px-6 py-4 font-body text-sm text-ink">{deficit}</td>
                <td className="px-6 py-4">
                  {!isLeads && remark !== null && (
                    <span
                      className={`inline-block font-body font-semibold text-[12px] px-2.5 py-1 rounded-full ${
                        deficit > 0 ? 'bg-[#F5E4DC] text-rust' : 'bg-gold-soft text-gold-dark'
                      }`}
                    >
                      {remark.toFixed(2)}%
                    </span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function StageNameColumn({ title, names }: { title: string; names: string[] }) {
  return (
    <div className="border border-line rounded-2xl overflow-hidden flex flex-col">
      <div className="bg-ink px-5 py-3">
        <span className="font-body font-semibold text-[13px] text-white uppercase tracking-[1px]">{title}</span>
      </div>
      <div className="flex flex-col max-h-72 overflow-y-auto">
        {names.length === 0 ? (
          <span className="font-body text-sm text-faint px-5 py-4">No leads at this stage yet.</span>
        ) : (
          names.map((name, i) => (
            <div key={name + i} className={`px-5 py-2.5 font-body text-sm text-ink ${i > 0 ? 'border-t border-line' : ''}`}>
              {name}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
