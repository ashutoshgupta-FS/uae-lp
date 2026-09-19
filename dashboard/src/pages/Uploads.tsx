import { useStore } from '../store'
import { Avatar, Dropzone, Eyebrow, PageShell, SegmentToggle, StatusBadge } from '../components/ui'

export default function Uploads() {
  const { segment, setSegment, sourceCards, uploads, recordUpload, setPage } = useStore()
  const syncedCount = sourceCards.filter((c) => c.status === 'Synced').length
  const total = sourceCards.length
  const pct = Math.round((syncedCount / total) * 100)
  const rows = uploads[segment]

  return (
    <PageShell
      footerRight={
        <button onClick={() => setPage('overview')} className="font-body font-semibold text-sm text-gold-dark hover:text-gold">
          ← Back to report overview
        </button>
      }
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 sm:gap-6">
        <div>
          <Eyebrow>Central Marketing</Eyebrow>
          <h1 className="font-heading font-bold text-[26px] sm:text-[32px] text-ink">Upload Source Data</h1>
          <p className="font-body text-sm sm:text-[15px] text-muted mt-2 max-w-[560px]">
            Drop in the latest export from each platform to refresh the weekly and MTD report. Tag each upload SME or
            Enterprise so the report can split by account tier.
          </p>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-2">
          <span className="font-body text-[12px] font-semibold tracking-[1px] text-faint uppercase">Segment</span>
          <SegmentToggle value={segment} onChange={setSegment} />
        </div>
      </div>

      <div className="bg-panel border border-line rounded-2xl px-5 sm:px-7 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="font-heading font-semibold text-sm sm:text-[15px] text-ink">
            {syncedCount} of {total} sources synced this week · {segment}
          </span>
          <span className="font-body text-xs text-faint">
            {syncedCount === total ? 'All sources are up to date' : 'Some sources still need a refresh'}
          </span>
        </div>
        <div className="w-full sm:w-[220px] h-2 bg-line rounded-full overflow-hidden">
          <div className="h-full bg-gold transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {sourceCards.map((card) => (
          <div key={card.id} className="bg-white border border-line rounded-2xl p-5 sm:p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <Avatar initials={card.initials} />
                <div>
                  <div className="font-heading font-semibold text-[15px] text-ink">{card.name}</div>
                  <div className="font-body text-[13px] text-faint">Last synced {card.lastSynced}</div>
                </div>
              </div>
            </div>
            <div>
              <StatusBadge status={card.status} />
            </div>
            <Dropzone buttonLabel={`Upload ${segment} file`} onFile={(name) => recordUpload(card.id, name)} />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-ink">Recent Uploads</h2>
          <span className="font-body text-[13px] text-faint">{segment}</span>
        </div>

        {rows.length === 0 ? (
          <div className="border border-line rounded-2xl px-6 py-6 font-body text-sm text-faint text-center">
            No uploads yet for {segment}.
          </div>
        ) : (
          <>
            <div className="sm:hidden flex flex-col gap-3">
              {rows.map((row) => (
                <div key={row.id} className="border border-line rounded-2xl p-4 flex flex-col gap-1.5">
                  <span className="font-body font-semibold text-sm text-ink break-all">{row.file}</span>
                  <div className="flex items-center justify-between">
                    <span className="font-body text-[13px] text-muted">{row.source}</span>
                    <span className="font-body text-[12px] text-faint">{row.when}</span>
                  </div>
                  <span className="font-body text-[12px] text-faint">Uploaded by {row.uploadedBy}</span>
                </div>
              ))}
            </div>

            <div className="hidden sm:block border border-line rounded-2xl overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-panel">
                    {['File', 'Source', 'Uploaded By', 'When'].map((h) => (
                      <th key={h} className="font-body text-[11px] font-semibold tracking-[1px] text-faint uppercase px-6 py-3">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="border-t border-line">
                      <td className="px-6 py-4 font-body font-semibold text-sm text-ink">{row.file}</td>
                      <td className="px-6 py-4 font-body text-sm text-muted">{row.source}</td>
                      <td className="px-6 py-4 font-body text-sm text-muted">{row.uploadedBy}</td>
                      <td className="px-6 py-4 font-body text-sm text-faint">{row.when}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </PageShell>
  )
}
