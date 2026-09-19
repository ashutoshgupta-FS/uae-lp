import React, { useCallback, useRef, useState } from 'react'
import type { SyncStatus } from '../types'

export function PageShell({ children, footerRight }: { children: React.ReactNode; footerRight?: React.ReactNode }) {
  return (
    <div className="w-full min-h-screen bg-white flex flex-col">
      <div className="w-full max-w-[1280px] mx-auto px-6 sm:px-10 pt-10 pb-20 flex flex-col gap-9 flex-1">
        {children}
      </div>
      <Footer right={footerRight} />
    </div>
  )
}

export function Footer({ right }: { right?: React.ReactNode }) {
  return (
    <div className="border-t border-line px-6 sm:px-10 py-6 flex items-center justify-between flex-wrap gap-3">
      <div className="flex items-center gap-2 text-faint text-sm">
        <svg width="16" height="14" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 24L14 0L28 24H18L14 17L10 24H0Z" fill="#9B9890" />
        </svg>
        Flipspaces Central Marketing · Internal use only
      </div>
      {right}
    </div>
  )
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-body text-[13px] font-semibold tracking-[1.5px] text-gold uppercase mb-2">{children}</div>
  )
}

export function SegmentToggle({
  value,
  onChange,
}: {
  value: 'SME' | 'Enterprise'
  onChange: (v: 'SME' | 'Enterprise') => void
}) {
  const options: { id: 'SME' | 'Enterprise'; label: string }[] = [
    { id: 'SME', label: 'SME' },
    { id: 'Enterprise', label: 'Enterprise (EV)' },
  ]
  return (
    <div className="flex bg-panel border border-line rounded-full p-1">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          className={`font-body font-semibold text-[13px] px-4 py-2 rounded-full transition-colors ${
            value === opt.id ? 'bg-ink text-white' : 'text-muted hover:text-ink'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export function PillTabs({
  options,
  value,
  onChange,
}: {
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex bg-panel border border-line rounded-full p-1 w-fit">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`font-body font-semibold text-[13px] px-4 py-2 rounded-full transition-colors whitespace-nowrap ${
            value === opt ? 'bg-gold text-ink' : 'text-muted hover:text-ink'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

export function DarkPillTabs({
  options,
  value,
  onChange,
}: {
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex bg-panel border border-line rounded-full p-1 w-fit">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`font-body font-semibold text-[13px] px-4 py-2 rounded-full transition-colors whitespace-nowrap ${
            value === opt ? 'bg-ink text-white' : 'text-muted hover:text-ink'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

export function StatusBadge({ status }: { status: SyncStatus }) {
  const styles: Record<SyncStatus, string> = {
    Synced: 'bg-gold-soft text-gold-dark',
    'Needs refresh': 'bg-[#F5E4DC] text-rust',
    'Not connected': 'bg-panel text-faint',
  }
  return (
    <span className={`inline-block font-body font-semibold text-[11px] px-2.5 py-1 rounded-full ${styles[status]}`}>
      {status}
    </span>
  )
}

export function Avatar({ initials }: { initials: string }) {
  return (
    <div className="w-10 h-10 rounded-lg bg-ink flex items-center justify-center font-heading font-semibold text-[13px] text-white shrink-0">
      {initials}
    </div>
  )
}

export function KpiCard({
  label,
  achieved,
  target,
}: {
  label: string
  achieved: number
  target: number
}) {
  const pct = target > 0 ? Math.round((achieved / target) * 100) : 0
  const deficit = Math.max(target - achieved, 0)
  const barPct = Math.min(pct, 100)
  return (
    <div className="bg-white border border-line rounded-2xl p-6 flex flex-col gap-4">
      <div className="font-body text-[12px] font-semibold tracking-[1px] text-faint uppercase">{label}</div>
      <div className="flex items-baseline gap-1.5">
        <span className="font-heading font-bold text-[32px] text-ink leading-none">{achieved}</span>
        <span className="font-body text-sm text-faint">/ {target} target</span>
      </div>
      <div className="w-full h-1.5 bg-line rounded-full overflow-hidden">
        <div className="h-full bg-gold rounded-full transition-all duration-500" style={{ width: `${barPct}%` }} />
      </div>
      <div className="flex items-center justify-between">
        <span className="font-body font-semibold text-[13px] text-rust">
          {deficit > 0 ? `Deficit ${deficit}` : 'Target met'}
        </span>
        <span className="font-body text-[13px] text-muted">{pct}% of target</span>
      </div>
    </div>
  )
}

export function Dropzone({
  onFile,
  buttonLabel,
}: {
  onFile: (fileName: string) => void
  buttonLabel: string
}) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (files && files.length > 0) {
        onFile(files[0].name)
      }
    },
    [onFile],
  )

  return (
    <div className="flex flex-col gap-3">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          handleFiles(e.dataTransfer.files)
        }}
        className={`cursor-pointer border border-dashed rounded-xl py-6 flex flex-col items-center justify-center gap-1 transition-colors ${
          dragOver ? 'border-gold bg-gold-soft/50' : 'border-line hover:border-gold'
        }`}
      >
        <span className="font-body font-semibold text-sm text-ink">Drag a CSV or XLSX here</span>
        <span className="font-body text-[13px] text-faint">or click to browse</span>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx"
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files)
            e.target.value = ''
          }}
        />
      </div>
      <button
        onClick={() => inputRef.current?.click()}
        className="w-full bg-gold hover:bg-gold-dark hover:text-white text-ink font-body font-semibold text-sm py-3 rounded-lg transition-colors"
      >
        {buttonLabel}
      </button>
    </div>
  )
}

export function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`w-11 h-6 rounded-full relative transition-colors shrink-0 ${checked ? 'bg-gold' : 'bg-line'}`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-[22px]' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}

export function ToastStack({ toasts }: { toasts: { id: number; message: string }[] }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="animate-toast bg-ink text-white font-body text-sm font-medium px-4 py-3 rounded-lg shadow-lg"
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}
