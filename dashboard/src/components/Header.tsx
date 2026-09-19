import { LayoutGrid, Mail, UploadCloud, Users, Wallet } from 'lucide-react'
import { useStore } from '../store'
import type { Page } from '../types'

const NAV: { id: Page; label: string; icon: typeof LayoutGrid }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'spends', label: 'Spends', icon: Wallet },
  { id: 'uploads', label: 'Uploads', icon: UploadCloud },
  { id: 'sources', label: 'Lead Analyser', icon: Users },
  { id: 'email', label: 'Email Preview', icon: Mail },
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

function useActivePage() {
  const { page } = useStore()
  return page === 'sources' || page === 'analysis' ? 'sources' : page
}

export default function Header() {
  const { setPage } = useStore()
  const active = useActivePage()

  return (
    <div className="bg-ink px-4 sm:px-10 py-3 sm:py-4 flex items-center justify-between gap-4 sticky top-0 z-30">
      <button onClick={() => setPage('overview')} className="cursor-pointer shrink-0">
        <Logo />
      </button>
      <div className="hidden sm:flex items-center gap-5 sm:gap-7 flex-wrap">
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
      </div>
      <div className="w-9 h-9 rounded-full bg-avatar border border-[#3A3934] flex items-center justify-center font-heading font-semibold text-[13px] text-white shrink-0">
        AG
      </div>
    </div>
  )
}

export function BottomNav() {
  const { setPage } = useStore()
  const active = useActivePage()

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-ink border-t border-[#2A2A28] safe-bottom">
      <div className="flex items-stretch justify-between px-1">
        {NAV.map((item) => {
          const Icon = item.icon
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 min-w-0"
            >
              <Icon size={20} strokeWidth={isActive ? 2.4 : 1.8} color={isActive ? '#C6A15B' : '#9B9890'} />
              <span
                className={`font-body text-[10px] font-semibold leading-none truncate max-w-full px-1 ${
                  isActive ? 'text-white' : 'text-faint'
                }`}
              >
                {item.id === 'sources' ? 'Leads' : item.id === 'email' ? 'Email' : item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
