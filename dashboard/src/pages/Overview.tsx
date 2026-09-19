import { useMemo, useRef, useState } from 'react'
import { useStore } from '../store'
import { buildWeeklyMetrics, getMtdData, MTD_WEEK_LABELS, parseMtdCsv, serializeMtdCsv } from '../data'
import type { MetricRow, MtdSegmentData, OverviewSegment } from '../types'
import { Eyebrow, PageShell } from '../components/ui'

export default function Overview() {
  const { segment: globalSegment, setSegment, setPage, mtdData, mtdImportInfo, updateMtdData } = useStore()
  const [segment, setLocalSegment] = useState<OverviewSegment>(globalSegment)
  const [importOpen, setImportOpen] = useState(false)

  const chooseSegment = (s: OverviewSegment) => {
    setLocalSegment(s)
    if (s !== 'All') setSegment(s)
  }

  const mtd = useMemo(() => getMtdData(segment, mtdData), [segment, mtdData])
  const weeks = useMemo(() => buildWeeklyMetrics(mtd.metrics), [mtd.metrics])
  const importInfo = segment !== 'All' ? mtdImportInfo[segment] : null

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
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="font-heading font-bold text-xl text-ink">MTD — September, 2026</h2>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-body text-[13px] text-faint">{segment} · as of 19 Sep 2026</span>
            {segment !== 'All' && (
              <button
                onClick={() => setImportOpen(true)}
                className="font-body font-semibold text-[13px] bg-gold hover:bg-gold-dark hover:text-white text-ink px-4 py-2 rounded-full transition-colors"
              >
                Upload / Edit {segment === 'Enterprise' ? 'EV' : 'SME'} data
              </button>
            )}
          </div>
        </div>
        {importInfo && (
          <span className="font-body text-[12px] text-faint -mt-2">
            Last updated {importInfo.when} from {importInfo.fileName}
          </span>
        )}
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-start">
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

      {importOpen && segment !== 'All' && (
        <MtdImportModal
          segment={segment}
          initialData={mtdData[segment]}
          onClose={() => setImportOpen(false)}
          onSave={(data, sourceLabel) => {
            updateMtdData(segment, data, sourceLabel)
            setImportOpen(false)
          }}
        />
      )}
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
      <div className="bg-ink px-5 py-3 flex items-center justify-between gap-2">
        <span className="font-body font-semibold text-[13px] text-white uppercase tracking-[1px]">{title}</span>
        <span className="font-body text-[12px] text-faint">{names.length}</span>
      </div>
      <div className="flex flex-col">
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

function metricsToFormRows(metrics: MetricRow[]) {
  return metrics.map((m) => ({ metric: m.metric, target: String(m.target), achieved: String(m.achieved) }))
}

function MtdImportModal({
  segment,
  initialData,
  onClose,
  onSave,
}: {
  segment: 'SME' | 'Enterprise'
  initialData: MtdSegmentData
  onClose: () => void
  onSave: (data: MtdSegmentData, sourceLabel: string) => void
}) {
  const label = segment === 'Enterprise' ? 'EV' : 'SME'
  const [metricRows, setMetricRows] = useState(metricsToFormRows(initialData.metrics))
  const [sts, setSts] = useState(initialData.stageNames.sts.join('\n'))
  const [pl, setPl] = useState(initialData.stageNames.pl.join('\n'))
  const [login, setLogin] = useState(initialData.stageNames.login.join('\n'))
  const [watchlist, setWatchlist] = useState(initialData.plToLogin.map((r) => `${r.company}, ${r.month}`).join('\n'))
  const [attachedFile, setAttachedFile] = useState<string | null>(null)
  const [note, setNote] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleFile = (file: File) => {
    setAttachedFile(file.name)
    if (file.name.toLowerCase().endsWith('.csv')) {
      const reader = new FileReader()
      reader.onload = () => {
        const parsed = parseMtdCsv(String(reader.result ?? ''))
        if (parsed) {
          setMetricRows(metricsToFormRows(parsed.metrics))
          setSts(parsed.stageNames.sts.join('\n'))
          setPl(parsed.stageNames.pl.join('\n'))
          setLogin(parsed.stageNames.login.join('\n'))
          setWatchlist(parsed.plToLogin.map((r) => `${r.company}, ${r.month}`).join('\n'))
          setNote('Parsed the CSV — check the fields below, then save.')
        } else {
          setNote("Couldn't read that CSV. Check it matches the template, or fill the fields in manually.")
        }
      }
      reader.readAsText(file)
    } else {
      setNote('Screenshots and spreadsheets other than CSV can’t be auto-read here — attach it for reference and fill (or paste) the numbers and names into the fields below.')
    }
  }

  const downloadTemplate = () => {
    const blob = new Blob([serializeMtdCsv(initialData)], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${label.toLowerCase()}-mtd-template.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleSave = () => {
    const data: MtdSegmentData = {
      metrics: metricRows.map((r) => ({
        metric: r.metric,
        target: Math.max(0, Math.round(Number(r.target)) || 0),
        achieved: Math.max(0, Math.round(Number(r.achieved)) || 0),
      })),
      stageNames: {
        sts: sts.split('\n').map((s) => s.trim()).filter(Boolean),
        pl: pl.split('\n').map((s) => s.trim()).filter(Boolean),
        login: login.split('\n').map((s) => s.trim()).filter(Boolean),
      },
      plToLogin: watchlist
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [company, month] = line.split(',').map((s) => s.trim())
          return { company: company ?? line, month: month ?? '' }
        }),
    }
    onSave(data, attachedFile ?? 'Manual entry')
  }

  return (
    <div className="fixed inset-0 bg-ink/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-line">
          <h3 className="font-heading font-semibold text-[16px] text-ink">Upload / Edit {label} data</h3>
          <button onClick={onClose} className="font-body text-faint hover:text-ink text-lg leading-none">
            ✕
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5 flex flex-col gap-6">
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0])
            }}
            className="cursor-pointer border border-dashed border-line hover:border-gold rounded-xl py-6 flex flex-col items-center justify-center gap-1 transition-colors"
          >
            <span className="font-body font-semibold text-sm text-ink">Drag a CSV, XLSX or screenshot here</span>
            <span className="font-body text-[13px] text-faint">or click to browse</span>
            {attachedFile && <span className="font-body text-[12px] text-gold-dark mt-1">Attached: {attachedFile}</span>}
            <input
              ref={inputRef}
              type="file"
              accept=".csv,.xlsx,image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFile(e.target.files[0])
                e.target.value = ''
              }}
            />
          </div>
          {note && <p className="font-body text-[13px] text-muted -mt-3">{note}</p>}
          <button
            onClick={downloadTemplate}
            className="font-body font-semibold text-[13px] text-gold-dark hover:text-gold self-start -mt-3"
          >
            Download current {label} data as CSV template ↓
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {metricRows.map((row, i) => (
              <div key={row.metric} className="border border-line rounded-xl p-4 flex flex-col gap-2">
                <span className="font-heading font-semibold text-sm text-ink">{row.metric}</span>
                <div className="flex items-center gap-2">
                  <label className="flex flex-col gap-1 flex-1">
                    <span className="font-body text-[11px] text-faint uppercase tracking-[1px]">Target</span>
                    <input
                      type="number"
                      min={0}
                      value={row.target}
                      onChange={(e) =>
                        setMetricRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, target: e.target.value } : r)))
                      }
                      className="font-body text-sm border border-line rounded-lg px-3 py-2 outline-none focus:border-gold"
                    />
                  </label>
                  <label className="flex flex-col gap-1 flex-1">
                    <span className="font-body text-[11px] text-faint uppercase tracking-[1px]">Achieved</span>
                    <input
                      type="number"
                      min={0}
                      value={row.achieved}
                      onChange={(e) =>
                        setMetricRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, achieved: e.target.value } : r)))
                      }
                      className="font-body text-sm border border-line rounded-lg px-3 py-2 outline-none focus:border-gold"
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <TextAreaField label="STS names (one per line)" value={sts} onChange={setSts} />
            <TextAreaField label="PL names (one per line)" value={pl} onChange={setPl} />
            <TextAreaField label="Login names (one per line)" value={login} onChange={setLogin} />
          </div>

          <TextAreaField
            label="PL → Login watchlist (Company, Month per line)"
            value={watchlist}
            onChange={setWatchlist}
            rows={4}
          />
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-line">
          <button onClick={onClose} className="font-body font-semibold text-sm text-muted hover:text-ink px-4 py-2">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-gold hover:bg-gold-dark hover:text-white text-ink font-body font-semibold text-sm px-6 py-2.5 rounded-lg transition-colors"
          >
            Save {label} data
          </button>
        </div>
      </div>
    </div>
  )
}

function TextAreaField({
  label,
  value,
  onChange,
  rows = 6,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  rows?: number
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-body text-[11px] text-faint uppercase tracking-[1px]">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="font-body text-sm border border-line rounded-lg px-3 py-2 outline-none focus:border-gold resize-none"
      />
    </label>
  )
}
