export type Segment = 'SME' | 'Enterprise'

export type SyncStatus = 'Synced' | 'Needs refresh' | 'Not connected'

export type Page = 'overview' | 'uploads' | 'sources' | 'analysis' | 'email'

export interface Kpi {
  label: string
  achieved: number
  target: number
}

export interface FunnelRow {
  source: string
  leads: [number, number]
  intel: [number, number]
  preLogin: [number, number]
  login: [number, number]
  leadsNames: string[]
}

export interface WeeklyStageCell {
  achieved: number
  target: number
  names: string[]
}

export interface WeeklyFunnelRow {
  source: string
  leads: WeeklyStageCell
  intel: WeeklyStageCell
  preLogin: WeeklyStageCell
  login: WeeklyStageCell
}

export interface SourceCard {
  id: string
  name: string
  initials: string
  lastSynced: string
  status: SyncStatus
  leadCount?: number
}

export interface UploadRow {
  id: string
  file: string
  source: string
  uploadedBy: string
  when: string
}

export interface OtherLeadSource {
  id: string
  name: string
  initials: string
  lastSynced: string
  status: SyncStatus
  leads: number | null
}

export interface StatusCount {
  label: string
  value: number
}

export type OverviewSegment = 'SME' | 'Enterprise' | 'All'

export interface MetricRow {
  metric: string
  target: number
  achieved: number
}

export interface StageNameLists {
  sts: string[]
  pl: string[]
  login: string[]
}

export interface PlToLoginRow {
  company: string
  month: string
}

export interface MtdSegmentData {
  metrics: MetricRow[]
  stageNames: StageNameLists
  plToLogin: PlToLoginRow[]
}
