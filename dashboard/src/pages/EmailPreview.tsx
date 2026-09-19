import { useEffect, useState } from 'react'
import { useStore } from '../store'
import { cpcOf, cplOf, ctrOf, getMtdData, getSpendsPeriod, inr } from '../data'
import { DarkPillTabs } from '../components/ui'
import { Logo } from '../components/Header'
import type { Segment } from '../types'

function fmtPct(v: number | null): string {
  return v === null ? '-' : `${v.toFixed(2)}%`
}

function fmtMoney(v: number | null): string {
  return v === null ? '-' : inr(Math.round(v))
}

function fmtTime(d: Date): string {
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

export default function EmailPreview() {
  const { setPage, pushToast, mtdData, spendsData } = useStore()
  const [preview, setPreview] = useState<'Preview: SME' | 'Preview: Enterprise'>('Preview: SME')
  const segment: Segment = preview === 'Preview: SME' ? 'SME' : 'Enterprise'
  const [refreshedAt, setRefreshedAt] = useState<Date | null>(null)

  const mtd = getMtdData(segment, mtdData)
  const spendsRows = getSpendsPeriod(segment, 'monthly', spendsData)
  const activeChannels = spendsRows.filter((r) => r.spends > 0 || r.impressions > 0 || r.leads > 0)

  // Reflects live data automatically: any edit on Overview/Spends re-renders this page immediately,
  // since mtdData/spendsData come straight from the shared store.
  useEffect(() => {
    setRefreshedAt(new Date())
  }, [mtdData, spendsData])

  const handleRefresh = () => {
    setRefreshedAt(new Date())
    pushToast('Email refreshed with the latest data')
  }

  return (
    <div className="w-full min-h-screen bg-paper flex flex-col items-center py-10 px-4 gap-5">
      <DarkPillTabs
        options={['Preview: SME', 'Preview: Enterprise']}
        value={preview}
        onChange={(v) => setPreview(v as typeof preview)}
      />

      <div className="flex items-center gap-3">
        {refreshedAt && (
          <span className="font-body text-[12px] text-faint">Last refreshed {fmtTime(refreshedAt)}</span>
        )}
        <button
          onClick={handleRefresh}
          className="font-body font-semibold text-[13px] bg-gold hover:bg-gold-dark hover:text-white text-ink px-4 py-1.5 rounded-full transition-colors"
        >
          ↻ Refresh
        </button>
      </div>

      <div className="w-full max-w-[640px] bg-white rounded-2xl overflow-hidden border border-line">
        <div className="bg-ink px-5 sm:px-8 py-6 sm:py-8 flex flex-col items-center gap-3 text-center">
          <span className="font-body text-[10px] sm:text-[11px] font-semibold tracking-[2px] text-faint uppercase">
            Weekly Report — as of 19 Sep 2026 · {segment}
          </span>
          <Logo />
          <span className="font-body text-[10px] sm:text-[11px] font-semibold tracking-[1.5px] text-faint uppercase">
            Central Marketing · Weekly Report
          </span>
        </div>

        <div className="p-5 sm:p-8 flex flex-col gap-6 sm:gap-8">
          <p className="font-body text-sm text-ink">
            Hi team, here's the {segment} lead-gen snapshot for the month, as of 19 Sep 2026.
          </p>

          <div className="flex flex-col gap-3">
            <h3 className="font-heading font-bold text-sm text-ink uppercase tracking-wide">MTD Targets — September 2026</h3>
            <div className="overflow-x-auto rounded-lg border border-line">
              <table className="w-full min-w-[420px] text-left">
                <thead>
                  <tr className="bg-panel">
                    {['Metric', 'Target', 'Achieved', 'Deficit'].map((h) => (
                      <th key={h} className="font-body text-[10px] font-semibold tracking-[1px] text-faint uppercase px-4 py-2">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mtd.metrics.map((row) => (
                    <tr key={row.metric} className="border-t border-line">
                      <td className="px-4 py-2.5 font-body font-semibold text-[13px] text-ink">{row.metric}</td>
                      <td className="px-4 py-2.5 font-body text-[13px] text-ink">{row.target}</td>
                      <td className="px-4 py-2.5 font-body text-[13px] text-ink">{row.achieved}</td>
                      <td className="px-4 py-2.5 font-body font-semibold text-[13px] text-rust">
                        {Math.max(row.target - row.achieved, 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {activeChannels.length === 0 ? (
            <div className="bg-panel rounded-lg p-4">
              <p className="font-body text-[13px] text-muted">
                No channel spend recorded yet for {segment} this month — add it from the Spends tab and it'll show up
                here automatically.
              </p>
            </div>
          ) : (
            activeChannels.map((row) => (
              <div key={row.channel} className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-sm text-ink uppercase tracking-wide">
                    {row.channel} — September '26
                  </h3>
                  <span className="font-body font-semibold text-[11px] bg-panel border border-line rounded-full px-2.5 py-1 text-muted whitespace-nowrap">
                    {row.sts} STS · {row.preLogin} PL · {row.login} Login
                  </span>
                </div>
                <div className="bg-panel rounded-lg p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Metric label="Spend" value={fmtMoney(row.spends || null)} />
                  <Metric label="Impr." value={row.impressions ? row.impressions.toLocaleString('en-IN') : '-'} />
                  <Metric label="Clicks" value={row.clicks ? row.clicks.toLocaleString('en-IN') : '-'} />
                  <Metric label="CTR" value={fmtPct(ctrOf(row))} />
                  <Metric label="CPC" value={fmtMoney(cpcOf(row))} />
                  <Metric label="Leads" value={row.leads ? row.leads.toLocaleString('en-IN') : '-'} />
                  <Metric label="CPL" value={fmtMoney(cplOf(row))} />
                  <Metric label="STS" value={row.sts ? String(row.sts) : '-'} />
                </div>
              </div>
            ))
          )}

          <button
            onClick={() => setPage('overview')}
            className="w-full bg-gold hover:bg-gold-dark hover:text-white text-ink font-body font-bold text-sm py-3.5 rounded-lg transition-colors underline underline-offset-4"
          >
            View Interactive Report →
          </button>

          <div className="font-body text-sm text-ink">
            Thanks &amp; Regards,
            <br />
            Ashutosh Gupta
            <br />
            Central Marketing, Flipspaces
          </div>
        </div>

        <div className="border-t border-line px-8 py-6 flex flex-col items-center gap-1.5">
          <span className="font-body text-[12px] text-faint text-center">Flipspaces Technology Labs Pvt. Ltd. · Central Marketing</span>
          <span className="font-body text-[12px] text-faint text-center">[Flipspaces Office Address]</span>
          <button onClick={() => pushToast('Email preferences saved')} className="font-body text-[12px] text-faint underline">
            Manage email preferences
          </button>
        </div>
      </div>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-body text-[10px] font-semibold tracking-[0.5px] text-faint uppercase">{label}</div>
      <div className="font-heading font-bold text-[15px] text-ink mt-0.5">{value}</div>
    </div>
  )
}
