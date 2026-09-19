import { StoreProvider, useStore } from './store'
import Header, { BottomNav } from './components/Header'
import { ToastStack } from './components/ui'
import Overview from './pages/Overview'
import Spends from './pages/Spends'
import Uploads from './pages/Uploads'
import DataSources from './pages/DataSources'
import Analysis from './pages/Analysis'
import EmailPreview from './pages/EmailPreview'

function Routes() {
  const { page, toasts } = useStore()

  return (
    <div className="min-h-screen bg-white">
      {page !== 'email' && <Header />}
      <div className="pb-16 sm:pb-0">
        {page === 'overview' && <Overview />}
        {page === 'spends' && <Spends />}
        {page === 'uploads' && <Uploads />}
        {page === 'sources' && <DataSources />}
        {page === 'analysis' && <Analysis />}
        {page === 'email' && <EmailPreview />}
      </div>
      <BottomNav />
      <ToastStack toasts={toasts} />
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <Routes />
    </StoreProvider>
  )
}
