import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type {
  MtdSegmentData,
  OtherLeadSource,
  Page,
  Segment,
  SourceCard,
  SpendsPeriodKey,
  SpendsRow,
  SpendsSegmentData,
  UploadRow,
} from './types'
import {
  initialSourceCards,
  initialUploadsBySegment,
  mergeStatsBySegment,
  mtdBySegment,
  otherLeadSourcesBySegment,
  primarySourceBySegment,
  spendsBySegment,
} from './data'

type MergeStats = { fromMaster: number; fromUploads: number; duplicates: number }

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
  otherSources: Record<Segment, OtherLeadSource[]>
  mergeStats: Record<Segment, MergeStats>
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
    otherSources: otherLeadSourcesBySegment,
    mergeStats: mergeStatsBySegment,
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
  otherSources: Record<Segment, OtherLeadSource[]>
  mergeStats: Record<Segment, MergeStats>
  recordSourceLeadUpload: (sourceId: string, fileName: string, leadCount: number) => void
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
    const onHash = () => {
      setPageState(pageFromHash())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const setPage = useCallback((p: Page) => {
    window.location.hash = `/${p}`
    setPageState(p)
    window.scrollTo(0, 0)
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

  const recordSourceLeadUpload = useCallback(
    (sourceId: string, fileName: string, leadCount: number) => {
      setPersisted((prev) => {
        const segSources = prev.otherSources[prev.segment]
        const source = segSources.find((s) => s.id === sourceId)
        const nextSources = segSources.map((s) =>
          s.id === sourceId ? { ...s, status: 'Synced' as const, lastSynced: 'Just now', leads: leadCount } : s,
        )
        const row: UploadRow = {
          id: `up-${Date.now()}`,
          file: fileName,
          source: source?.name ?? sourceId,
          uploadedBy: 'You',
          when: 'Just now',
        }
        return {
          ...prev,
          otherSources: { ...prev.otherSources, [prev.segment]: nextSources },
          uploads: { ...prev.uploads, [prev.segment]: [row, ...prev.uploads[prev.segment]] },
        }
      })
      pushToast(`Uploaded ${fileName} — ${leadCount} leads ready to merge`)
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

    const seg = persisted.segment
    const fromMaster = primarySourceBySegment[seg].leads
    const fromUploads = persisted.otherSources[seg]
      .filter((s) => s.status === 'Synced')
      .reduce((sum, s) => sum + (s.leads ?? 0), 0)
    const duplicates = Math.round((fromMaster + fromUploads) * 0.03)
    const previousStats = persisted.mergeStats[seg]
    const previousCombined = previousStats.fromMaster + previousStats.fromUploads - previousStats.duplicates
    const nextCombined = fromMaster + fromUploads - duplicates

    const now = new Date()
    const stamp = `Today · ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`

    setPersisted((prev) => ({
      ...prev,
      lastMergeRun: stamp,
      mergeStats: { ...prev.mergeStats, [seg]: { fromMaster, fromUploads, duplicates } },
    }))

    setMerging(false)
    const delta = nextCombined - previousCombined
    const deltaText = delta === 0 ? 'no change' : `${delta > 0 ? '+' : ''}${delta} vs last run`
    pushToast(`Merge complete — ${nextCombined.toLocaleString('en-IN')} unique leads (${deltaText})`)
  }, [pushToast, persisted])

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
      otherSources: persisted.otherSources,
      mergeStats: persisted.mergeStats,
      recordSourceLeadUpload,
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
      recordSourceLeadUpload,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
