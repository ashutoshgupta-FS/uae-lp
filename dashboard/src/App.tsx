import { StoreProvider, useStore } from './store'
import Header from './components/Header'
import { ToastStack } from './components/ui'
import Overview from './pages/Overview'
import Uploads from './pages/Uploads'
import DataSources from './pages/DataSources'
import Analysis from './pages/Analysis'
import EmailPreview from './pages/EmailPreview'

function Routes() {
  const { page, toasts } = useStore()

  return (
    <div className="min-h-screen bg-white">
      {page !== 'email' && <Header />}
      {page === 'overview' && <Overview />}
      {page === 'uploads' && <Uploads />}
      {page === 'sources' && <DataSources />}
      {page === 'analysis' && <Analysis />}
      {page === 'email' && <EmailPreview />}
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
