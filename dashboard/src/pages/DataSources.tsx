import { useStore } from '../store'
import { mergeStatsBySegment, otherLeadSourcesBySegment, primarySourceBySegment } from '../data'
import { Avatar, DarkPillTabs, Dropzone, Eyebrow, PageShell, StatusBadge } from '../components/ui'

const STEPS = [
  { title: '1 · Connect', desc: 'Read Lead Desk – Master plus every synced upload.' },
  { title: '2 · Standardize', desc: "Map each source's columns to one lead schema." },
  { title: '3 · Deduplicate', desc: 'Match on phone number, then email.' },
]

export default function DataSources() {
  const { segment, setPage, lastMergeRun, runMerge, merging, recordUpload, pushToast } = useStore()
  const primary = primarySourceBySegment[segment]
  const others = otherLeadSourcesBySegment[segment]
  const merge = mergeStatsBySegment[segment]
  const combined = merge.fromMaster + merge.fromUploads - merge.duplicates

  return (
    <PageShell
      footerRight={
        <button onClick={() => setPage('analysis')} className="font-body font-semibold text-sm text-gold-dark hover:text-gold">
          View lead analysis →
        </button>
      }
    >
      <div>
        <Eyebrow>Lead Analyser</Eyebrow>
        <h1 className="font-heading font-bold text-[26px] sm:text-[32px] text-ink">Lead Data Sources</h1>
        <p className="font-body text-sm sm:text-[15px] text-muted mt-2 max-w-[640px]">
          Lead Desk – Master is the primary source. Add other lead lists below and they're standardized, deduplicated
          by phone and email, and merged in automatically.
        </p>
        <div className="mt-5">
          <DarkPillTabs options={['Analysis', 'Data Sources']} value="Data Sources" onChange={(v) => setPage(v === 'Analysis' ? 'analysis' : 'sources')} />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-body text-[13px] font-semibold tracking-[1.5px] text-faint uppercase">Primary Source</h2>
        <div className="border-2 border-gold rounded-2xl px-5 sm:px-7 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar initials="LD" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-heading font-semibold text-[16px] text-ink">Lead Desk – Master</span>
                <span className="font-body font-semibold text-[11px] px-2.5 py-1 rounded-full bg-gold-soft text-gold-dark">
                  Primary
                </span>
              </div>
              <div className="font-body text-[13px] text-faint mt-1">
                Google Sheets · 5 tabs read (Leads, Config, Pivot Table 2, Change_Log, Comment_Log) · Updated{' '}
                {primary.updated}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-line pt-4 sm:pt-0">
            <div className="sm:text-right">
              <div className="font-heading font-bold text-[26px] text-ink leading-none">
                {primary.leads.toLocaleString('en-IN')}
              </div>
              <div className="font-body text-[12px] text-faint mt-1">Leads on sheet</div>
            </div>
            <button
              onClick={() => pushToast('Opening Lead Desk – Master in Google Sheets…')}
              className="font-body font-semibold text-sm text-gold-dark hover:text-gold whitespace-nowrap"
            >
              Open sheet ↗
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-body text-[13px] font-semibold tracking-[1.5px] text-faint uppercase">Other Lead Sources</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {others.map((src) => (
            <div key={src.id} className="bg-white border border-line rounded-2xl p-5 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Avatar initials={src.initials} />
                <div>
                  <div className="font-heading font-semibold text-sm text-ink">{src.name}</div>
                  <div className="font-body text-[12px] text-faint">{src.lastSynced}</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <StatusBadge status={src.status} />
                <span className="font-body font-semibold text-sm text-ink">
                  {src.leads !== null ? `${src.leads} leads` : '—'}
                </span>
              </div>
              <Dropzone buttonLabel="Upload file" onFile={(name) => recordUpload(src.id, name)} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-heading font-bold text-lg sm:text-xl text-ink">Merge Pipeline</h2>
        <div className="border border-line rounded-2xl p-4 sm:p-6 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map((step) => (
              <div key={step.title} className="bg-panel rounded-xl p-4">
                <div className="font-heading font-semibold text-sm text-ink mb-1">{step.title}</div>
                <div className="font-body text-[13px] text-muted">{step.desc}</div>
              </div>
            ))}
            <div className="bg-gold-soft rounded-xl p-4">
              <div className="font-heading font-semibold text-sm text-ink mb-1">4 · Combined dataset</div>
              <div className="font-body text-[13px] text-muted">
                {combined.toLocaleString('en-IN')} unique leads, ready to analyse.
              </div>
            </div>
          </div>

          <div className="border-t border-line" />

          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 sm:gap-8">
              <div>
                <div className="font-heading font-bold text-xl text-ink">{merge.fromMaster.toLocaleString('en-IN')}</div>
                <div className="font-body text-[12px] text-faint">From Lead Desk</div>
              </div>
              <div>
                <div className="font-heading font-bold text-xl text-gold-dark">+{merge.fromUploads}</div>
                <div className="font-body text-[12px] text-faint">From uploads</div>
              </div>
              <div>
                <div className="font-heading font-bold text-xl text-rust">−{merge.duplicates}</div>
                <div className="font-body text-[12px] text-faint">Duplicates merged</div>
              </div>
              <div>
                <div className="font-heading font-bold text-xl text-ink">={combined.toLocaleString('en-IN')}</div>
                <div className="font-body text-[12px] text-faint">Unique combined leads</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <span className="font-body text-[13px] text-faint">Runs automatically every 6 hours · last run {lastMergeRun}</span>
              <button
                onClick={runMerge}
                disabled={merging}
                className="bg-gold hover:bg-gold-dark hover:text-white text-ink font-body font-semibold text-sm px-6 py-3 rounded-lg transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {merging && <span className="w-3.5 h-3.5 border-2 border-ink/40 border-t-ink rounded-full animate-spin-slow" />}
                {merging ? 'Merging…' : 'Run merge now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
