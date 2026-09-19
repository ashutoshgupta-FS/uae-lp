import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { MtdSegmentData, Page, Segment, SourceCard, SpendsPeriodKey, SpendsRow, SpendsSegmentData, UploadRow } from './types'
import { initialSourceCards, initialUploadsBySegment, mtdBySegment, spendsBySegment } from './data'

const STORAGE_KEY = 'flipspaces-ops-dashboard-v3'

type MtdImportInfo = { fileName: string; when: string } | null
type SpendsImportInfo = { fileName: string; when: string } | null

interface PersistedState {
  segment: Segment
  sourceCards: SourceCard[]
  uploads: Record<Segment, UploadRow[]>
  digests: { weekly: boolean; monthly: boolean }
  recipients: string[]
  lastMergeRun: string
  mtdData: Record<'SME' | 'Enterprise', MtdSegmentData>
  mtdImportInfo: Record<'SME' | 'Enterprise', MtdImportInfo>
  spendsData: Record<'SME' | 'Enterprise', SpendsSegmentData>
  spendsImportInfo: Record<'SME' | 'Enterprise', Partial<Record<SpendsPeriodKey, SpendsImportInfo>>>
}

function defaultState(): PersistedState {
  return {
    segment: 'SME',
    sourceCards: initialSourceCards,
    uploads: initialUploadsBySegment,
    digests: { weekly: true, monthly: true },
    recipients: ['Ashutosh Gupta', 'Central Marketing'],
    lastMergeRun: 'Today · 9:00 AM',
    mtdData: mtdBySegment,
    mtdImportInfo: { SME: null, Enterprise: null },
    spendsData: spendsBySegment,
    spendsImportInfo: { SME: {}, Enterprise: {} },
  }
}

function loadState(): PersistedState {
  const fallback = defaultState()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...fallback, ...(JSON.parse(raw) as Partial<PersistedState>) }
  } catch {
    // ignore corrupt storage
  }
  return fallback
}

interface Toast {
  id: number
  message: string
}

interface StoreValue {
  page: Page
  setPage: (p: Page) => void
  segment: Segment
  setSegment: (s: Segment) => void
  sourceCards: SourceCard[]
  uploads: Record<Segment, UploadRow[]>
  recordUpload: (sourceId: string, fileName: string) => void
  digests: { weekly: boolean; monthly: boolean }
  toggleDigest: (which: 'weekly' | 'monthly') => void
  recipients: string[]
  addRecipient: (name: string) => void
  lastMergeRun: string
  runMerge: () => Promise<void>
  merging: boolean
  toasts: Toast[]
  pushToast: (message: string) => void
  mtdData: Record<'SME' | 'Enterprise', MtdSegmentData>
  mtdImportInfo: Record<'SME' | 'Enterprise', MtdImportInfo>
  updateMtdData: (segment: 'SME' | 'Enterprise', data: MtdSegmentData, sourceLabel: string) => void
  spendsData: Record<'SME' | 'Enterprise', SpendsSegmentData>
  spendsImportInfo: Record<'SME' | 'Enterprise', Partial<Record<SpendsPeriodKey, SpendsImportInfo>>>
  updateSpendsPeriod: (
    segment: 'SME' | 'Enterprise',
    period: SpendsPeriodKey,
    rows: SpendsRow[],
    sourceLabel: string,
  ) => void
}

const StoreContext = createContext<StoreValue | null>(null)

function pageFromHash(): Page {
  const h = window.location.hash.replace('#/', '') as Page
  if (['overview', 'uploads', 'sources', 'analysis', 'email', 'spends'].includes(h)) return h
  return 'overview'
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [persisted, setPersisted] = useState<PersistedState>(loadState)
  const [page, setPageState] = useState<Page>(pageFromHash)
  const [merging, setMerging] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted))
  }, [persisted])

  useEffect(() => {
    const onHash = () => setPageState(pageFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const setPage = useCallback((p: Page) => {
    window.location.hash = `/${p}`
    setPageState(p)
  }, [])

  const setSegment = useCallback((s: Segment) => {
    setPersisted((prev) => ({ ...prev, segment: s }))
  }, [])

  const pushToast = useCallback((message: string) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3200)
  }, [])

  const recordUpload = useCallback(
    (sourceId: string, fileName: string) => {
      setPersisted((prev) => {
        const source = prev.sourceCards.find((s) => s.id === sourceId)
        const sourceName = source?.name ?? sourceId
        const row: UploadRow = {
          id: `up-${Date.now()}`,
          file: fileName,
          source: sourceName,
          uploadedBy: 'You',
          when: 'Just now',
        }
        const nextUploads = {
          ...prev.uploads,
          [prev.segment]: [row, ...prev.uploads[prev.segment]],
        }
        const nextCards = prev.sourceCards.map((s) =>
          s.id === sourceId ? { ...s, status: 'Synced' as const, lastSynced: 'Just now' } : s,
        )
        return { ...prev, uploads: nextUploads, sourceCards: nextCards }
      })
      pushToast(`Uploaded ${fileName}`)
    },
    [pushToast],
  )

  const toggleDigest = useCallback((which: 'weekly' | 'monthly') => {
    setPersisted((prev) => ({ ...prev, digests: { ...prev.digests, [which]: !prev.digests[which] } }))
  }, [])

  const addRecipient = useCallback(
    (name: string) => {
      const trimmed = name.trim()
      if (!trimmed) return
      setPersisted((prev) =>
        prev.recipients.includes(trimmed) ? prev : { ...prev, recipients: [...prev.recipients, trimmed] },
      )
      pushToast(`Added ${trimmed} to recipients`)
    },
    [pushToast],
  )

  const runMerge = useCallback(async () => {
    setMerging(true)
    await new Promise((resolve) => setTimeout(resolve, 1400))
    const now = new Date()
    const stamp = `Today · ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
    setPersisted((prev) => ({ ...prev, lastMergeRun: stamp }))
    setMerging(false)
    pushToast('Merge pipeline completed')
  }, [pushToast])

  const updateMtdData = useCallback(
    (segment: 'SME' | 'Enterprise', data: MtdSegmentData, sourceLabel: string) => {
      setPersisted((prev) => ({
        ...prev,
        mtdData: { ...prev.mtdData, [segment]: data },
        mtdImportInfo: { ...prev.mtdImportInfo, [segment]: { fileName: sourceLabel, when: 'Just now' } },
      }))
      pushToast(`${segment === 'Enterprise' ? 'EV' : segment} data updated from ${sourceLabel}`)
    },
    [pushToast],
  )

  const updateSpendsPeriod = useCallback(
    (segment: 'SME' | 'Enterprise', period: SpendsPeriodKey, rows: SpendsRow[], sourceLabel: string) => {
      setPersisted((prev) => ({
        ...prev,
        spendsData: { ...prev.spendsData, [segment]: { ...prev.spendsData[segment], [period]: rows } },
        spendsImportInfo: {
          ...prev.spendsImportInfo,
          [segment]: { ...prev.spendsImportInfo[segment], [period]: { fileName: sourceLabel, when: 'Just now' } },
        },
      }))
      pushToast(`${segment === 'Enterprise' ? 'EV' : segment} spends updated from ${sourceLabel}`)
    },
    [pushToast],
  )

  const value = useMemo<StoreValue>(
    () => ({
      page,
      setPage,
      segment: persisted.segment,
      setSegment,
      sourceCards: persisted.sourceCards,
      uploads: persisted.uploads,
      recordUpload,
      digests: persisted.digests,
      toggleDigest,
      recipients: persisted.recipients,
      addRecipient,
      lastMergeRun: persisted.lastMergeRun,
      runMerge,
      merging,
      toasts,
      pushToast,
      mtdData: persisted.mtdData,
      mtdImportInfo: persisted.mtdImportInfo,
      updateMtdData,
      spendsData: persisted.spendsData,
      spendsImportInfo: persisted.spendsImportInfo,
      updateSpendsPeriod,
    }),
    [
      page,
      persisted,
      merging,
      toasts,
      setPage,
      setSegment,
      recordUpload,
      toggleDigest,
      addRecipient,
      runMerge,
      pushToast,
      updateMtdData,
      updateSpendsPeriod,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
