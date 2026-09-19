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
