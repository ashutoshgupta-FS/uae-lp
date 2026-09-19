import { useState } from 'react'
import { useStore } from '../store'
import { analysisBySegment, mergeStatsBySegment } from '../data'
import { DarkPillTabs, Eyebrow, PageShell, PillTabs, Toggle } from '../components/ui'

export default function Analysis() {
  const { segment, setPage, digests, toggleDigest, recipients, addRecipient, pushToast } = useStore()
  const [range, setRange] = useState<'This Week' | 'This Month'>('This Month')
  const [recipientInput, setRecipientInput] = useState('')
  const [addingRecipient, setAddingRecipient] = useState(false)
  const data = analysisBySegment[segment]
  const merge = mergeStatsBySegment[segment]
  const combined = merge.fromMaster + merge.fromUploads - merge.duplicates
  const newLeads = range === 'This Week' ? data.newLeadsWeek : data.newLeadsMonth
  const calls = range === 'This Week' ? data.callsWeek : data.callsMonth

  return (
    <PageShell
      footerRight={
        <button onClick={() => setPage('sources')} className="font-body font-semibold text-sm text-gold-dark hover:text-gold">
          ← Manage lead sources
        </button>
      }
    >
      <div className="flex items-start justify-between flex-wrap gap-6">
        <div>
          <Eyebrow>Lead Analyser</Eyebrow>
          <h1 className="font-heading font-bold text-[32px] text-ink">Lead Analysis</h1>
          <p className="font-body text-[15px] text-muted mt-2 max-w-[640px]">
            Combined view across Lead Desk – Master and every uploaded source, refreshed by the merge pipeline.
          </p>
          <div className="mt-5">
            <DarkPillTabs options={['Analysis', 'Data Sources']} value="Analysis" onChange={(v) => setPage(v === 'Analysis' ? 'analysis' : 'sources')} />
          </div>
        </div>
        <PillTabs options={['This Week', 'This Month']} value={range} onChange={(v) => setRange(v as typeof range)} />
      </div>

      <div className="bg-panel border border-line rounded-2xl px-7 py-4 flex items-center justify-between flex-wrap gap-3">
        <span className="font-body text-sm text-ink">
          <strong>{combined.toLocaleString('en-IN')}</strong> combined unique leads — {merge.fromMaster.toLocaleString('en-IN')} from Lead
          Desk – Master + {merge.fromUploads} merged from uploads, minus {merge.duplicates} duplicates.
        </span>
        <button onClick={() => setPage('sources')} className="font-body font-semibold text-sm text-gold-dark hover:text-gold whitespace-nowrap">
          Manage sources →
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatTile value={combined.toLocaleString('en-IN')} label="Total leads (combined)" />
        <StatTile value={data.hot} label="Hot leads open now" color="text-gold-dark" />
        <StatTile value={data.followUpsOverdue.toLocaleString('en-IN')} label="Follow-ups overdue" color="text-rust" />
        <StatTile value={data.neverContacted} label="Never contacted (no comment)" />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="font-heading font-bold text-xl text-ink">New Leads &amp; Activity</h2>
          <span className="font-body text-[13px] text-faint">{range} · September 2026</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-white border border-line rounded-2xl p-6">
            <div className="font-heading font-bold text-3xl text-ink">{newLeads}</div>
            <div className="font-body text-sm text-muted mt-1">New leads created {range === 'This Week' ? 'this week' : 'this month'}</div>
          </div>
          <div className="bg-white border border-line rounded-2xl p-6">
            <div className="font-heading font-bold text-3xl text-ink">~{calls}</div>
            <div className="font-body text-sm text-muted mt-1">Calls logged (4-week estimate)</div>
            <div className="font-body text-[12px] text-faint mt-1">
              4-week rolling estimate — only a 7-day calls count is tracked today.
            </div>
          </div>
        </div>
      </div>

      <div className="border border-line rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-panel">
              <th className="font-body text-[11px] font-semibold tracking-[1px] text-faint uppercase px-6 py-3">
                Leads Owned (All-time)
              </th>
              <th className="font-body text-[11px] font-semibold tracking-[1px] text-faint uppercase px-6 py-3 text-right">
                SDR
              </th>
            </tr>
          </thead>
          <tbody>
            {data.leadsOwned.map((row) => (
              <tr key={row.name} className="border-t border-line">
                <td className="px-6 py-4 font-body font-semibold text-sm text-ink">{row.name}</td>
                <td className="px-6 py-4 font-body text-sm text-ink text-right">{row.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="font-heading font-bold text-xl text-ink">Pipeline by Status</h2>
          <span className="font-body text-[13px] text-faint">Live snapshot</span>
        </div>
        <div className="border border-line rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-10">
          <StatusList rows={data.statusLeft} />
          <StatusList rows={data.statusRight} bordered />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <h2 className="font-heading font-bold text-xl text-ink">By Confidence</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gold-soft rounded-2xl p-5 text-center">
              <div className="font-heading font-bold text-2xl text-gold-dark">{data.hot}</div>
              <div className="font-body text-[12px] text-muted mt-1">Hot</div>
            </div>
            <div className="bg-panel rounded-2xl p-5 text-center">
              <div className="font-heading font-bold text-2xl text-ink">{data.warm}</div>
              <div className="font-body text-[12px] text-muted mt-1">Warm</div>
            </div>
            <div className="bg-panel rounded-2xl p-5 text-center">
              <div className="font-heading font-bold text-2xl text-ink">{data.cold.toLocaleString('en-IN')}</div>
              <div className="font-body text-[12px] text-muted mt-1">Cold</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="font-heading font-bold text-xl text-ink">By Lead Source</h2>
          <div className="border border-line rounded-2xl overflow-hidden">
            {data.bySource.map((row, i) => (
              <div
                key={row.label}
                className={`flex items-center justify-between px-6 py-3 ${i > 0 ? 'border-t border-line' : ''}`}
              >
                <span className="font-body text-sm text-ink">{row.label}</span>
                <span className="font-body font-semibold text-sm text-ink">{row.value.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-heading font-bold text-xl text-ink">Share This Analysis</h2>
        <div className="border border-line rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <div className="font-heading font-semibold text-sm text-ink">Weekly digest</div>
              <div className="font-body text-[12px] text-faint">Every Monday · 9:00 AM</div>
            </div>
            <Toggle checked={digests.weekly} onChange={() => toggleDigest('weekly')} />
          </div>
          <div className="flex items-center justify-between px-6 py-4 border-t border-line">
            <div>
              <div className="font-heading font-semibold text-sm text-ink">Monthly digest</div>
              <div className="font-body text-[12px] text-faint">1st of every month · 9:00 AM</div>
            </div>
            <Toggle checked={digests.monthly} onChange={() => toggleDigest('monthly')} />
          </div>
          <div className="flex items-center justify-between px-6 py-4 border-t border-line flex-wrap gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-body text-[13px] text-faint">Recipients:</span>
              {recipients.map((r) => (
                <span key={r} className="font-body font-semibold text-[13px] bg-panel border border-line rounded-full px-3 py-1 text-ink">
                  {r}
                </span>
              ))}
              {addingRecipient ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    addRecipient(recipientInput)
                    setRecipientInput('')
                    setAddingRecipient(false)
                  }}
                  className="flex items-center gap-1"
                >
                  <input
                    autoFocus
                    value={recipientInput}
                    onChange={(e) => setRecipientInput(e.target.value)}
                    onBlur={() => setAddingRecipient(false)}
                    placeholder="Name or email"
                    className="font-body text-[13px] border border-line rounded-full px-3 py-1 outline-none focus:border-gold"
                  />
                </form>
              ) : (
                <button
                  onClick={() => setAddingRecipient(true)}
                  className="font-body font-semibold text-[13px] text-gold-dark hover:text-gold"
                >
                  + Add
                </button>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span className="font-body text-[12px] text-faint whitespace-nowrap">Uses the Marketing Performance Digest template</span>
              <button
                onClick={() => pushToast(`Test email sent to ${recipients.join(', ')}`)}
                className="bg-gold hover:bg-gold-dark hover:text-white text-ink font-body font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap"
              >
                Send test now
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  )
}

function StatTile({ value, label, color }: { value: string | number; label: string; color?: string }) {
  return (
    <div className="bg-white border border-line rounded-2xl p-6">
      <div className={`font-heading font-bold text-3xl ${color ?? 'text-ink'}`}>{value}</div>
      <div className="font-body text-sm text-muted mt-1">{label}</div>
    </div>
  )
}

function StatusList({ rows, bordered }: { rows: { label: string; value: number }[]; bordered?: boolean }) {
  return (
    <div className={bordered ? 'sm:border-l sm:border-line sm:pl-10 mt-6 sm:mt-0' : ''}>
      {rows.map((row, i) => (
        <div key={row.label} className={`flex items-center justify-between py-2.5 ${i > 0 ? 'border-t border-line' : ''}`}>
          <span className="font-body text-sm text-ink">{row.label}</span>
          <span className="font-body font-semibold text-sm text-ink">{row.value.toLocaleString('en-IN')}</span>
        </div>
      ))}
    </div>
  )
}
