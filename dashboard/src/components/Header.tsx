import { useStore } from '../store'
import type { Page } from '../types'

const NAV: { id: Page; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'uploads', label: 'Uploads' },
  { id: 'sources', label: 'Lead Analyser' },
  { id: 'email', label: 'Email Preview' },
]

export function Logo({ light = true }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <svg width="26" height="22" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 24L14 0L28 24H18L14 17L10 24H0Z" fill="#C6A15B" />
      </svg>
      <div className="flex flex-col leading-tight">
        <span className={`font-heading font-bold text-[17px] tracking-[1.5px] ${light ? 'text-white' : 'text-ink'}`}>
          FLIPSPACES
        </span>
        <span className="font-body font-medium text-[10px] tracking-[2px] text-faint">MARKETING OPS</span>
      </div>
    </div>
  )
}

export default function Header() {
  const { page, setPage } = useStore()
  const active = page === 'sources' || page === 'analysis' ? 'sources' : page

  return (
    <div className="bg-ink px-6 sm:px-10 py-4 flex items-center justify-between flex-wrap gap-4 sticky top-0 z-30">
      <button onClick={() => setPage('overview')} className="cursor-pointer">
        <Logo />
      </button>
      <div className="flex items-center gap-5 sm:gap-7 flex-wrap">
        {NAV.map((item) => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            className={`font-body text-sm font-semibold transition-colors ${
              active === item.id ? 'text-white' : 'text-faint hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
        <div className="w-9 h-9 rounded-full bg-avatar border border-[#3A3934] flex items-center justify-center font-heading font-semibold text-[13px] text-white">
          AG
        </div>
      </div>
    </div>
  )
}
