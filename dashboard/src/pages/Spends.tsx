import { useMemo, useRef, useState } from 'react'
import { useStore } from '../store'
import {
  cpcOf,
  cplOf,
  ctrOf,
  getSpendsPeriod,
  inr,
  parseSpendsCsv,
  serializeSpendsCsv,
  SPENDS_PERIOD_LABELS,
  sumSpendsRows,
} from '../data'
import { SPENDS_PERIODS } from '../types'
import type { OverviewSegment, SpendsChannel, SpendsPeriodKey, SpendsRow } from '../types'
import { Eyebrow, ModalShell, PageShell } from '../components/ui'

export default function Spends() {
  const { segment: globalSegment, setSegment, spendsData, spendsImportInfo, updateSpendsPeriod } = useStore()
  const [segment, setLocalSegment] = useState<OverviewSegment>(globalSegment)
  const [editingPeriod, setEditingPeriod] = useState<SpendsPeriodKey | null>(null)

  const chooseSegment = (s: OverviewSegment) => {
    setLocalSegment(s)
    if (s !== 'All') setSegment(s)
  }

  const periodRows = useMemo(
    () =>
      Object.fromEntries(
        SPENDS_PERIODS.map((p) => [p, getSpendsPeriod(segment, p, spendsData)]),
      ) as Record<SpendsPeriodKey, SpendsRow[]>,
    [segment, spendsData],
  )

  return (
    <PageShell>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 sm:gap-6">
        <div>
          <Eyebrow>Central Marketing</Eyebrow>
          <h1 className="font-heading font-bold text-[26px] sm:text-[32px] text-ink">Channel Spends</h1>
          <p className="font-body text-sm sm:text-[15px] text-muted mt-2 max-w-[560px]">
            Spend, reach and funnel numbers by channel — September 2026, monthly and by week.
          </p>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-2">
          <span className="font-body text-[12px] font-semibold tracking-[1px] text-faint uppercase">Segment</span>
          <ThreeWayToggle value={segment} onChange={chooseSegment} />
        </div>
      </div>

      <div className="border-t border-line" />

      {SPENDS_PERIODS.map((period) => {
        const importInfo = segment !== 'All' ? spendsImportInfo[segment]?.[period] : null
        return (
          <div key={period} className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="font-heading font-bold text-lg sm:text-xl text-ink">{SPENDS_PERIOD_LABELS[period]}</h2>
              {segment !== 'All' && (
                <button
                  onClick={() => setEditingPeriod(period)}
                  className="font-body font-semibold text-[13px] bg-gold hover:bg-gold-dark hover:text-white text-ink px-4 py-2 rounded-full transition-colors self-start sm:self-auto"
                >
                  Upload / Edit {segment === 'Enterprise' ? 'EV' : 'SME'} data
                </button>
              )}
            </div>
            {importInfo && (
              <span className="font-body text-[12px] text-faint -mt-2">
                Last updated {importInfo.when} from {importInfo.fileName}
              </span>
            )}
            <SpendsTable rows={periodRows[period]} />
          </div>
        )
      })}

      {editingPeriod && segment !== 'All' && (
        <SpendsImportModal
          segment={segment}
          period={editingPeriod}
          initialRows={spendsData[segment][editingPeriod]}
          onClose={() => setEditingPeriod(null)}
          onSave={(rows, sourceLabel) => {
            updateSpendsPeriod(segment, editingPeriod, rows, sourceLabel)
            setEditingPeriod(null)
          }}
        />
      )}
    </PageShell>
  )
}

function ThreeWayToggle({ value, onChange }: { value: OverviewSegment; onChange: (v: OverviewSegment) => void }) {
  const options: OverviewSegment[] = ['SME', 'Enterprise', 'All']
  return (
    <div className="flex bg-panel border border-line rounded-full p-1 w-full sm:w-auto">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`flex-1 sm:flex-none font-body font-semibold text-[13px] px-4 py-2 rounded-full transition-colors whitespace-nowrap ${
            value === opt ? 'bg-ink text-white' : 'text-muted hover:text-ink'
          }`}
        >
          {opt === 'Enterprise' ? 'EV' : opt}
        </button>
      ))}
    </div>
  )
}

function fmtPct(v: number | null): string {
  return v === null ? '-' : `${v.toFixed(2)}%`
}

function fmtMoney(v: number | null): string {
  return v === null ? '-' : inr(Math.round(v))
}

function SpendsTable({ rows }: { rows: SpendsRow[] }) {
  const totals = sumSpendsRows(rows)
  const totalCtr = totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : null
  const totalCpc = totals.clicks > 0 ? totals.spends / totals.clicks : null
  const totalCpl = totals.leads > 0 ? totals.spends / totals.leads : null

  return (
    <>
      <div className="sm:hidden flex flex-col gap-3">
        {rows.map((row) => (
          <SpendsCard
            key={row.channel}
            title={row.channel}
            spends={fmtMoney(row.spends || null)}
            impressions={row.impressions ? row.impressions.toLocaleString('en-IN') : '-'}
            clicks={row.clicks ? row.clicks.toLocaleString('en-IN') : '-'}
            ctr={fmtPct(ctrOf(row))}
            cpc={fmtMoney(cpcOf(row))}
            leads={row.leads ? row.leads.toLocaleString('en-IN') : '-'}
            cpl={fmtMoney(cplOf(row))}
            sts={row.sts ? String(row.sts) : '-'}
            preLogin={row.preLogin ? String(row.preLogin) : '-'}
            login={row.login ? String(row.login) : '-'}
          />
        ))}
        <SpendsCard
          title="Total"
          highlight
          spends={fmtMoney(totals.spends || null)}
          impressions={totals.impressions.toLocaleString('en-IN')}
          clicks={totals.clicks.toLocaleString('en-IN')}
          ctr={fmtPct(totalCtr)}
          cpc={fmtMoney(totalCpc)}
          leads={totals.leads.toLocaleString('en-IN')}
          cpl={fmtMoney(totalCpl)}
          sts={String(totals.sts)}
          preLogin={String(totals.preLogin)}
          login={String(totals.login)}
        />
      </div>

      <div className="hidden sm:block border border-line rounded-2xl overflow-x-auto">
        <table className="w-full text-left min-w-[920px]">
          <thead>
            <tr className="bg-panel">
              {['Channel', 'Spends', 'Impressions', 'Clicks', 'CTR', 'CPC', 'Leads', 'CPL', 'STS', 'Pre Login', 'Login'].map(
                (h) => (
                  <th key={h} className="font-body text-[11px] font-semibold tracking-[1px] text-faint uppercase px-4 py-3 whitespace-nowrap">
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.channel} className="border-t border-line">
                <td className="px-4 py-3 font-body font-semibold text-sm text-ink whitespace-nowrap">{row.channel}</td>
                <td className="px-4 py-3 font-body text-sm text-ink">{fmtMoney(row.spends || null)}</td>
                <td className="px-4 py-3 font-body text-sm text-ink">{row.impressions ? row.impressions.toLocaleString('en-IN') : '-'}</td>
                <td className="px-4 py-3 font-body text-sm text-ink">{row.clicks ? row.clicks.toLocaleString('en-IN') : '-'}</td>
                <td className="px-4 py-3 font-body text-sm text-ink">{fmtPct(ctrOf(row))}</td>
                <td className="px-4 py-3 font-body text-sm text-ink">{fmtMoney(cpcOf(row))}</td>
                <td className="px-4 py-3 font-body text-sm text-ink">{row.leads ? row.leads.toLocaleString('en-IN') : '-'}</td>
                <td className="px-4 py-3 font-body text-sm text-ink">{fmtMoney(cplOf(row))}</td>
                <td className="px-4 py-3 font-body text-sm text-ink">{row.sts || '-'}</td>
                <td className="px-4 py-3 font-body text-sm text-ink">{row.preLogin || '-'}</td>
                <td className="px-4 py-3 font-body text-sm text-ink">{row.login || '-'}</td>
              </tr>
            ))}
            <tr className="border-t border-line bg-panel">
              <td className="px-4 py-3 font-body font-bold text-sm text-ink">Total</td>
              <td className="px-4 py-3 font-body font-bold text-sm text-ink">{fmtMoney(totals.spends || null)}</td>
              <td className="px-4 py-3 font-body font-bold text-sm text-ink">{totals.impressions.toLocaleString('en-IN')}</td>
              <td className="px-4 py-3 font-body font-bold text-sm text-ink">{totals.clicks.toLocaleString('en-IN')}</td>
              <td className="px-4 py-3 font-body font-bold text-sm text-ink">{fmtPct(totalCtr)}</td>
              <td className="px-4 py-3 font-body font-bold text-sm text-ink">{fmtMoney(totalCpc)}</td>
              <td className="px-4 py-3 font-body font-bold text-sm text-ink">{totals.leads.toLocaleString('en-IN')}</td>
              <td className="px-4 py-3 font-body font-bold text-sm text-ink">{fmtMoney(totalCpl)}</td>
              <td className="px-4 py-3 font-body font-bold text-sm text-ink">{totals.sts}</td>
              <td className="px-4 py-3 font-body font-bold text-sm text-ink">{totals.preLogin}</td>
              <td className="px-4 py-3 font-body font-bold text-sm text-ink">{totals.login}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

function SpendsCard(props: {
  title: string
  highlight?: boolean
  spends: string
  impressions: string
  clicks: string
  ctr: string
  cpc: string
  leads: string
  cpl: string
  sts: string
  preLogin: string
  login: string
}) {
  return (
    <div className={`border rounded-2xl p-4 flex flex-col gap-3 ${props.highlight ? 'border-line bg-panel' : 'border-line bg-white'}`}>
      <div className="flex items-center justify-between">
        <span className="font-heading font-bold text-sm text-ink">{props.title}</span>
        <span className="font-heading font-bold text-[15px] text-ink">{props.spends}</span>
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        <MiniField label="Impr." value={props.impressions} />
        <MiniField label="Clicks" value={props.clicks} />
        <MiniField label="CTR" value={props.ctr} />
        <MiniField label="CPC" value={props.cpc} />
        <MiniField label="Leads" value={props.leads} />
        <MiniField label="CPL" value={props.cpl} />
      </div>
      <div className="grid grid-cols-3 gap-2.5 border-t border-line pt-3">
        <MiniField label="STS" value={props.sts} accent />
        <MiniField label="Pre Login" value={props.preLogin} accent />
        <MiniField label="Login" value={props.login} accent />
      </div>
    </div>
  )
}

function MiniField({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className={`font-body text-[10px] uppercase tracking-[0.5px] ${accent ? 'text-gold-dark' : 'text-faint'}`}>
        {label}
      </span>
      <span className="font-body font-semibold text-[13px] text-ink">{value}</span>
    </div>
  )
}

function rowsToForm(rows: SpendsRow[]) {
  return rows.map((r) => ({
    channel: r.channel,
    spends: String(r.spends),
    impressions: String(r.impressions),
    clicks: String(r.clicks),
    leads: String(r.leads),
    sts: String(r.sts),
    preLogin: String(r.preLogin),
    login: String(r.login),
  }))
}

function SpendsImportModal({
  segment,
  period,
  initialRows,
  onClose,
  onSave,
}: {
  segment: 'SME' | 'Enterprise'
  period: SpendsPeriodKey
  initialRows: SpendsRow[]
  onClose: () => void
  onSave: (rows: SpendsRow[], sourceLabel: string) => void
}) {
  const label = segment === 'Enterprise' ? 'EV' : 'SME'
  const [form, setForm] = useState(rowsToForm(initialRows))
  const [attachedFile, setAttachedFile] = useState<string | null>(null)
  const [note, setNote] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const setField = (channel: SpendsChannel, field: keyof (typeof form)[number], value: string) => {
    setForm((prev) => prev.map((r) => (r.channel === channel ? { ...r, [field]: value } : r)))
  }

  const handleFile = (file: File) => {
    setAttachedFile(file.name)
    if (file.name.toLowerCase().endsWith('.csv')) {
      const reader = new FileReader()
      reader.onload = () => {
        const parsed = parseSpendsCsv(String(reader.result ?? ''))
        if (parsed) {
          setForm(rowsToForm(parsed))
          setNote('Parsed the CSV — check the fields below, then save.')
        } else {
          setNote("Couldn't read that CSV. Check it matches the template, or fill the fields in manually.")
        }
      }
      reader.readAsText(file)
    } else {
      setNote('Screenshots and spreadsheets other than CSV can’t be auto-read here — attach it for reference and fill the numbers into the fields below.')
    }
  }

  const downloadTemplate = () => {
    const blob = new Blob([serializeSpendsCsv(initialRows)], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${label.toLowerCase()}-${period}-spends-template.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleSave = () => {
    const rows: SpendsRow[] = form.map((r) => ({
      channel: r.channel,
      spends: Math.max(0, Math.round(Number(r.spends)) || 0),
      impressions: Math.max(0, Math.round(Number(r.impressions)) || 0),
      clicks: Math.max(0, Math.round(Number(r.clicks)) || 0),
      leads: Math.max(0, Math.round(Number(r.leads)) || 0),
      sts: Math.max(0, Math.round(Number(r.sts)) || 0),
      preLogin: Math.max(0, Math.round(Number(r.preLogin)) || 0),
      login: Math.max(0, Math.round(Number(r.login)) || 0),
    }))
    onSave(rows, attachedFile ?? 'Manual entry')
  }

  return (
    <ModalShell
      title={`Upload / Edit ${label} spends — ${SPENDS_PERIOD_LABELS[period]}`}
      onClose={onClose}
      maxWidth="sm:max-w-3xl"
      footer={
        <>
          <button onClick={onClose} className="font-body font-semibold text-sm text-muted hover:text-ink px-4 py-2">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-gold hover:bg-gold-dark hover:text-white text-ink font-body font-semibold text-sm px-6 py-2.5 rounded-lg transition-colors"
          >
            Save {label} data
          </button>
        </>
      }
    >
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0])
        }}
        className="cursor-pointer border border-dashed border-line hover:border-gold rounded-xl py-6 flex flex-col items-center justify-center gap-1 transition-colors"
      >
        <span className="font-body font-semibold text-sm text-ink text-center px-2">Drag a CSV, XLSX or screenshot here</span>
        <span className="font-body text-[13px] text-faint">or tap to browse</span>
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
      {note && <p className="font-body text-[13px] text-muted -mt-2">{note}</p>}
      <button
        onClick={downloadTemplate}
        className="font-body font-semibold text-[13px] text-gold-dark hover:text-gold self-start -mt-2"
      >
        Download current {label} {SPENDS_PERIOD_LABELS[period]} data as CSV template ↓
      </button>

      <div className="flex flex-col gap-4">
        {form.map((row) => (
          <div key={row.channel} className="border border-line rounded-xl p-4">
            <span className="font-heading font-semibold text-sm text-ink">{row.channel}</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
              <NumField label="Spends" value={row.spends} onChange={(v) => setField(row.channel, 'spends', v)} />
              <NumField
                label="Impressions"
                value={row.impressions}
                onChange={(v) => setField(row.channel, 'impressions', v)}
              />
              <NumField label="Clicks" value={row.clicks} onChange={(v) => setField(row.channel, 'clicks', v)} />
              <NumField label="Leads" value={row.leads} onChange={(v) => setField(row.channel, 'leads', v)} />
            </div>
            <span className="font-body text-[10px] font-semibold text-gold-dark uppercase tracking-[0.5px] mt-3 block">
              Manual entry
            </span>
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-1.5">
              <NumField
                label="STS"
                value={row.sts}
                onChange={(v) => setField(row.channel, 'sts', v)}
                accent
              />
              <NumField
                label="Pre Login"
                value={row.preLogin}
                onChange={(v) => setField(row.channel, 'preLogin', v)}
                accent
              />
              <NumField
                label="Login"
                value={row.login}
                onChange={(v) => setField(row.channel, 'login', v)}
                accent
              />
            </div>
          </div>
        ))}
      </div>
    </ModalShell>
  )
}

function NumField({
  label,
  value,
  onChange,
  accent,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  accent?: boolean
}) {
  return (
    <label className="flex flex-col gap-1 min-w-0">
      <span className={`font-body text-[10px] uppercase tracking-[0.5px] ${accent ? 'text-gold-dark' : 'text-faint'}`}>
        {label}
      </span>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full min-w-0 font-body text-sm border rounded-lg px-2.5 py-1.5 outline-none focus:border-gold ${
          accent ? 'border-gold-soft bg-gold-soft/30' : 'border-line'
        }`}
      />
    </label>
  )
}
