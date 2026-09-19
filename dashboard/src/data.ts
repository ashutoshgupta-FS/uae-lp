import type { FunnelRow, Kpi, OtherLeadSource, Segment, SourceCard, StatusCount, UploadRow, WeeklyFunnelRow } from './types'

export type Period = 'mtd' | 'august'
export type Range = 'week' | 'month'

interface SegmentOverview {
  mtd: Kpi[]
  august: Kpi[]
  funnel: FunnelRow[]
}

export const overviewBySegment: Record<Segment, SegmentOverview> = {
  SME: {
    mtd: [
      { label: 'Login', achieved: 5, target: 12 },
      { label: 'Pre Login', achieved: 5, target: 18 },
      { label: 'STS / Intel', achieved: 9, target: 18 },
      { label: 'Leads', achieved: 160, target: 460 },
    ],
    august: [
      { label: 'Login', achieved: 0, target: 4 },
      { label: 'Pre Login', achieved: 2, target: 7 },
      { label: 'STS / Intel', achieved: 5, target: 16 },
      { label: 'Leads', achieved: 14, target: 78 },
    ],
    funnel: [
      {
        source: 'Google Ads / Website / Inbound',
        leads: [10, 40],
        intel: [3, 7],
        preLogin: [1, 3],
        login: [0, 1],
        leadsNames: [
          'Aarav Shah', 'Meera Joshi', 'Kunal Desai', 'Sanya Kapoor', 'Rohit Bhatia',
          'Ishita Rao', 'Varun Malhotra', 'Priya Nair', 'Siddharth Menon', 'Tanvi Agarwal',
        ],
      },
      {
        source: 'LinkedIn Ads / Meta – SMM',
        leads: [1, 26],
        intel: [0, 3],
        preLogin: [0, 1],
        login: [0, 1],
        leadsNames: ['Faisal Ahmed'],
      },
      {
        source: 'Outbound Calls',
        leads: [2, 8],
        intel: [1, 4],
        preLogin: [1, 2],
        login: [0, 1],
        leadsNames: ['Neha Kulkarni', 'Devansh Pillai'],
      },
      {
        source: 'Affiliate',
        leads: [0, 3],
        intel: [0, 2],
        preLogin: [0, 1],
        login: [0, 1],
        leadsNames: [],
      },
    ],
  },
  Enterprise: {
    mtd: [
      { label: 'Login', achieved: 2, target: 6 },
      { label: 'Pre Login', achieved: 3, target: 9 },
      { label: 'STS / Intel', achieved: 4, target: 10 },
      { label: 'Leads', achieved: 38, target: 120 },
    ],
    august: [
      { label: 'Login', achieved: 1, target: 3 },
      { label: 'Pre Login', achieved: 1, target: 5 },
      { label: 'STS / Intel', achieved: 3, target: 9 },
      { label: 'Leads', achieved: 9, target: 40 },
    ],
    funnel: [
      {
        source: 'Google Ads / Website / Inbound',
        leads: [4, 15],
        intel: [2, 5],
        preLogin: [1, 2],
        login: [0, 1],
        leadsNames: ['Omar Al Farsi', 'Layla Haddad', 'Vikram Oberoi', 'Sara Khan'],
      },
      {
        source: 'LinkedIn Ads / Meta – SMM',
        leads: [1, 10],
        intel: [0, 2],
        preLogin: [0, 1],
        login: [0, 1],
        leadsNames: ['Zainab Malik'],
      },
      {
        source: 'Outbound Calls',
        leads: [1, 4],
        intel: [1, 2],
        preLogin: [0, 1],
        login: [0, 1],
        leadsNames: ['Yusuf Rahman'],
      },
      {
        source: 'Affiliate',
        leads: [0, 2],
        intel: [0, 1],
        preLogin: [0, 1],
        login: [0, 1],
        leadsNames: [],
      },
    ],
  },
}

export const initialSourceCards: SourceCard[] = [
  { id: 'google-ads', name: 'Google Ads', initials: 'GA', lastSynced: 'Today · 9:12 AM', status: 'Synced' },
  { id: 'linkedin-ads', name: 'LinkedIn Ads', initials: 'LI', lastSynced: 'Today · 8:47 AM', status: 'Synced' },
  { id: 'meta-ads', name: 'Meta Ads', initials: 'MA', lastSynced: '2 days ago', status: 'Needs refresh' },
  { id: 'outbound-calls', name: 'Outbound Calls (CRM)', initials: 'OC', lastSynced: 'Yesterday · 6:30 PM', status: 'Synced' },
  { id: 'leads-master', name: 'Leads Master Sheet', initials: 'LM', lastSynced: '3 days ago', status: 'Needs refresh' },
  { id: 'affiliate', name: 'Affiliate Tracking', initials: 'AF', lastSynced: 'Never', status: 'Not connected' },
]

export const initialUploadsBySegment: Record<Segment, UploadRow[]> = {
  SME: [
    { id: 'u1', file: 'google_ads_sept_wk3.csv', source: 'Google Ads', uploadedBy: 'Ashutosh Gupta', when: 'Today · 9:12 AM' },
    { id: 'u2', file: 'linkedin_campaign_export.xlsx', source: 'LinkedIn Ads', uploadedBy: 'Ashutosh Gupta', when: 'Today · 8:47 AM' },
    { id: 'u3', file: 'outbound_calls_sept.csv', source: 'Outbound Calls', uploadedBy: 'Jyoti Mavi', when: 'Yesterday · 6:30 PM' },
    { id: 'u4', file: 'west_region_leads.xlsx', source: 'Leads Master Sheet', uploadedBy: 'Amruta Kamble', when: '3 days ago' },
    { id: 'u5', file: 'south_region_intel.csv', source: 'Leads Master Sheet', uploadedBy: 'Deepika Sharma', when: '4 days ago' },
  ],
  Enterprise: [
    { id: 'ue1', file: 'ev_google_ads_sept.csv', source: 'Google Ads', uploadedBy: 'Ashutosh Gupta', when: 'Today · 9:20 AM' },
    { id: 'ue2', file: 'ev_outbound_calls.csv', source: 'Outbound Calls', uploadedBy: 'Deepika Sharma', when: '2 days ago' },
  ],
}

export const primarySourceBySegment: Record<Segment, { leads: number; updated: string }> = {
  SME: { leads: 1468, updated: 'Today · 10:05 AM' },
  Enterprise: { leads: 312, updated: 'Today · 10:05 AM' },
}

export const otherLeadSourcesBySegment: Record<Segment, OtherLeadSource[]> = {
  SME: [
    { id: 'walk-in', name: 'Walk-in Register', initials: 'WI', lastSynced: 'Yesterday · 7:15 PM', status: 'Synced', leads: 38 },
    { id: 'referral', name: 'Referral Tracker', initials: 'RF', lastSynced: '2 days ago', status: 'Synced', leads: 21 },
    { id: 'whatsapp', name: 'WhatsApp Enquiries', initials: 'WA', lastSynced: '4 days ago', status: 'Needs refresh', leads: 52 },
    { id: 'partner', name: 'Partner Channel Leads', initials: 'PC', lastSynced: 'Never', status: 'Not connected', leads: null },
  ],
  Enterprise: [
    { id: 'walk-in', name: 'Walk-in Register', initials: 'WI', lastSynced: '3 days ago', status: 'Synced', leads: 6 },
    { id: 'referral', name: 'Referral Tracker', initials: 'RF', lastSynced: '5 days ago', status: 'Synced', leads: 9 },
    { id: 'whatsapp', name: 'WhatsApp Enquiries', initials: 'WA', lastSynced: '6 days ago', status: 'Needs refresh', leads: 3 },
    { id: 'partner', name: 'Partner Channel Leads', initials: 'PC', lastSynced: 'Never', status: 'Not connected', leads: null },
  ],
}

export const mergeStatsBySegment: Record<Segment, { fromMaster: number; fromUploads: number; duplicates: number }> = {
  SME: { fromMaster: 1468, fromUploads: 111, duplicates: 47 },
  Enterprise: { fromMaster: 312, fromUploads: 18, duplicates: 9 },
}

interface AnalysisData {
  hot: number
  warm: number
  cold: number
  followUpsOverdue: number
  neverContacted: number
  newLeadsWeek: number
  newLeadsMonth: number
  callsWeek: number
  callsMonth: number
  leadsOwned: { name: string; count: number }[]
  statusLeft: StatusCount[]
  statusRight: StatusCount[]
  bySource: StatusCount[]
}

export const analysisBySegment: Record<Segment, AnalysisData> = {
  SME: {
    hot: 43,
    warm: 103,
    cold: 1255,
    followUpsOverdue: 856,
    neverContacted: 54,
    newLeadsWeek: 142,
    newLeadsMonth: 570,
    callsWeek: 210,
    callsMonth: 860,
    leadsOwned: [
      { name: 'Amruta Kamble', count: 743 },
      { name: 'Deepika Sharma', count: 506 },
      { name: 'Jyoti Mavi', count: 214 },
      { name: 'Ashutosh Gupta', count: 5 },
    ],
    statusLeft: [
      { label: 'Not Interested', value: 604 },
      { label: 'Ringing', value: 259 },
      { label: 'STS', value: 37 },
      { label: 'Interested', value: 29 },
      { label: 'Non Operational Zone', value: 17 },
      { label: 'Old Lead', value: 2 },
      { label: 'Founder Lead', value: 1 },
    ],
    statusRight: [
      { label: 'Not Relevant', value: 321 },
      { label: 'Call Back', value: 57 },
      { label: 'Vendor', value: 37 },
      { label: 'Wrong Number', value: 19 },
      { label: 'International Number', value: 7 },
      { label: 'Dp Relevant', value: 2 },
    ],
    bySource: [
      { label: 'Meta Ads', value: 635 },
      { label: 'Google Ads', value: 127 },
      { label: 'Chatbot', value: 100 },
      { label: 'Other', value: 60 },
      { label: 'Website Form', value: 15 },
      { label: 'Inbound Call', value: 5 },
      { label: 'Uploaded lists (merged)', value: 111 },
    ],
  },
  Enterprise: {
    hot: 12,
    warm: 30,
    cold: 279,
    followUpsOverdue: 120,
    neverContacted: 9,
    newLeadsWeek: 18,
    newLeadsMonth: 64,
    callsWeek: 35,
    callsMonth: 140,
    leadsOwned: [
      { name: 'Amruta Kamble', count: 158 },
      { name: 'Deepika Sharma', count: 108 },
      { name: 'Jyoti Mavi', count: 42 },
      { name: 'Ashutosh Gupta', count: 4 },
    ],
    statusLeft: [
      { label: 'Not Interested', value: 132 },
      { label: 'Ringing', value: 54 },
      { label: 'STS', value: 12 },
      { label: 'Interested', value: 9 },
      { label: 'Non Operational Zone', value: 4 },
      { label: 'Old Lead', value: 1 },
      { label: 'Founder Lead', value: 0 },
    ],
    statusRight: [
      { label: 'Not Relevant', value: 68 },
      { label: 'Call Back', value: 14 },
      { label: 'Vendor', value: 8 },
      { label: 'Wrong Number', value: 5 },
      { label: 'International Number', value: 3 },
      { label: 'Dp Relevant', value: 1 },
    ],
    bySource: [
      { label: 'Meta Ads', value: 60 },
      { label: 'Google Ads', value: 140 },
      { label: 'Chatbot', value: 10 },
      { label: 'Other', value: 8 },
      { label: 'Website Form', value: 12 },
      { label: 'Inbound Call', value: 3 },
      { label: 'Uploaded lists (merged)', value: 18 },
    ],
  },
}

export const googleAdsAugust = {
  spend: 185750,
  impressions: 4350,
  clicks: 422,
  ctr: 9.7,
  cpc: 440,
  leads: 10,
  cpl: 18575,
  sts: 3,
  preLogin: 1,
  login: 0,
}

export const linkedinAugust = {
  spend: 53455,
  impressions: 89096,
  clicks: 649,
  cpc: 82,
  cpm: 6616,
  sts: 1,
  preLogin: 1,
  login: 0,
}

export const outboundCalling = {
  dialed: 358,
  connected: 98,
  ringing: 178,
  invalid: 22,
  infoReq: 13,
}

export function inr(value: number): string {
  return '₹' + value.toLocaleString('en-IN')
}

export const WEEK_LABELS = ['Week 1 · Aug 1–7', 'Week 2 · Aug 8–14', 'Week 3 · Aug 15–21', 'Week 4 · Aug 22–31']

function splitFour(n: number): [number, number, number, number] {
  const base = Math.floor(n / 4)
  const rem = n % 4
  return [0, 1, 2, 3].map((i) => base + (i < rem ? 1 : 0)) as [number, number, number, number]
}

export function toMonthlyDisplayRows(rows: FunnelRow[]): WeeklyFunnelRow[] {
  return rows.map((row) => ({
    source: row.source,
    leads: { achieved: row.leads[0], target: row.leads[1], names: row.leadsNames },
    intel: { achieved: row.intel[0], target: row.intel[1], names: row.leadsNames.slice(0, row.intel[0]) },
    preLogin: { achieved: row.preLogin[0], target: row.preLogin[1], names: row.leadsNames.slice(0, row.preLogin[0]) },
    login: { achieved: row.login[0], target: row.login[1], names: row.leadsNames.slice(0, row.login[0]) },
  }))
}

export function buildWeeklyFunnel(rows: FunnelRow[]): WeeklyFunnelRow[][] {
  const weeks: WeeklyFunnelRow[][] = [[], [], [], []]

  rows.forEach((row) => {
    const leadsAchievedByWeek = splitFour(row.leads[0])
    const leadsTargetByWeek = splitFour(row.leads[1])
    const intelAchievedByWeek = splitFour(row.intel[0])
    const intelTargetByWeek = splitFour(row.intel[1])
    const preLoginAchievedByWeek = splitFour(row.preLogin[0])
    const preLoginTargetByWeek = splitFour(row.preLogin[1])
    const loginAchievedByWeek = splitFour(row.login[0])
    const loginTargetByWeek = splitFour(row.login[1])

    let cursor = 0
    for (let w = 0; w < 4; w++) {
      const weekLeadsCount = leadsAchievedByWeek[w]
      const weekLeadNames = row.leadsNames.slice(cursor, cursor + weekLeadsCount)
      cursor += weekLeadsCount

      weeks[w].push({
        source: row.source,
        leads: { achieved: weekLeadsCount, target: leadsTargetByWeek[w], names: weekLeadNames },
        intel: {
          achieved: intelAchievedByWeek[w],
          target: intelTargetByWeek[w],
          names: weekLeadNames.slice(0, intelAchievedByWeek[w]),
        },
        preLogin: {
          achieved: preLoginAchievedByWeek[w],
          target: preLoginTargetByWeek[w],
          names: weekLeadNames.slice(0, preLoginAchievedByWeek[w]),
        },
        login: {
          achieved: loginAchievedByWeek[w],
          target: loginTargetByWeek[w],
          names: weekLeadNames.slice(0, loginAchievedByWeek[w]),
        },
      })
    }
  })

  return weeks
}
