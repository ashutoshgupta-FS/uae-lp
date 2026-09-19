import {
  SPENDS_CHANNELS,
  type FunnelRow,
  type Kpi,
  type MetricRow,
  type MtdSegmentData,
  type OtherLeadSource,
  type OverviewSegment,
  type Segment,
  type SourceCard,
  type SpendsChannel,
  type SpendsPeriodKey,
  type SpendsRow,
  type SpendsSegmentData,
  type StatusCount,
  type UploadRow,
  type WeeklyFunnelRow,
} from './types'

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

export const MTD_WEEK_LABELS = ['Week 1', 'Week 2', 'Week 3', 'Week 4']

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

export const emptyMtdSegmentData: MtdSegmentData = {
  metrics: [
    { metric: 'Login', target: 0, achieved: 0 },
    { metric: 'Pre Login', target: 0, achieved: 0 },
    { metric: 'STS / Intel', target: 0, achieved: 0 },
    { metric: 'Leads', target: 0, achieved: 0 },
  ],
  stageNames: { sts: [], pl: [], login: [] },
  plToLogin: [],
}

export const mtdBySegment: Record<'SME' | 'Enterprise', MtdSegmentData> = {
  SME: {
    metrics: [
      { metric: 'Login', target: 18, achieved: 7 },
      { metric: 'Pre Login', target: 27, achieved: 7 },
      { metric: 'STS / Intel', target: 28, achieved: 13 },
      { metric: 'Leads', target: 688, achieved: 484 },
    ],
    stageNames: {
      sts: [
        'FEL', 'Shahi Exp 2.0', 'Carlton Wellness Group', 'Core Tech', 'Kiacart Private Limited',
        'LearnEon Edutech Private Limited', 'KPIL', 'Toyota Connect India', 'Croyant Technologies',
        'Venus Jewel', 'Healthware Private Limited.', 'ozmik infra', 'Hindalco industries limited',
        'Modern Distropolis Limited', 'Total Energies', 'Wave Machanics',
      ],
      pl: [
        'FEL', 'Shahi Exp 2.0', 'Carlton Wellness Group', 'Core Tech', 'Kiacart Private Limited',
        'LearnEon Edutech Private Limited', 'KPIL',
      ],
      login: [
        'V3 Outsourcing Solutions', 'Shahi Exp 2.0', 'Textron India Wake', 'Amcor Flexibles India Pvt.Ltd',
        'Fidelis Technology Services Pvt. Ltd', 'KPIL', 'Core Tech',
      ],
    },
    plToLogin: [
      { company: 'Planetcast Media Services Pvt. Ltd.', month: 'Sep-2026' },
      { company: 'Fillpack Technology Pvt. Ltd', month: 'Sep-2026' },
      { company: 'Vision Diagnostic India private limited', month: 'Sep-2026' },
      { company: 'Kiacart Private Limited', month: 'Sep-2026' },
      { company: 'LearnEon Edutech Private Limited', month: 'Sep-2026' },
    ],
  },
  Enterprise: emptyMtdSegmentData,
}

export function getMtdData(
  segment: OverviewSegment,
  bySegment: Record<'SME' | 'Enterprise', MtdSegmentData> = mtdBySegment,
): MtdSegmentData {
  if (segment !== 'All') return bySegment[segment]
  const sme = bySegment.SME
  const ev = bySegment.Enterprise
  return {
    metrics: sme.metrics.map((row, i) => ({
      metric: row.metric,
      target: row.target + ev.metrics[i].target,
      achieved: row.achieved + ev.metrics[i].achieved,
    })),
    stageNames: {
      sts: [...sme.stageNames.sts, ...ev.stageNames.sts],
      pl: [...sme.stageNames.pl, ...ev.stageNames.pl],
      login: [...sme.stageNames.login, ...ev.stageNames.login],
    },
    plToLogin: [...sme.plToLogin, ...ev.plToLogin],
  }
}

const MTD_METRIC_ORDER = ['Login', 'Pre Login', 'STS / Intel', 'Leads']

function normalizeMetricName(name: string): string | null {
  const n = name.trim().toLowerCase().replace(/\s+/g, ' ')
  if (n === 'login') return 'Login'
  if (n === 'pre login' || n === 'prelogin') return 'Pre Login'
  if (n === 'sts / intel' || n === 'sts/intel' || n === 'sts' || n === 'intel') return 'STS / Intel'
  if (n === 'leads') return 'Leads'
  return null
}

export function serializeMtdCsv(data: MtdSegmentData): string {
  const lines: string[] = []
  lines.push('# Metrics')
  lines.push('Metric,Target,Achieved')
  data.metrics.forEach((row) => lines.push(`${row.metric},${row.target},${row.achieved}`))
  lines.push('')
  lines.push('# STS')
  data.stageNames.sts.forEach((name) => lines.push(name))
  lines.push('')
  lines.push('# PL')
  data.stageNames.pl.forEach((name) => lines.push(name))
  lines.push('')
  lines.push('# Login')
  data.stageNames.login.forEach((name) => lines.push(name))
  lines.push('')
  lines.push('# Watchlist')
  lines.push('Company,Month')
  data.plToLogin.forEach((row) => lines.push(`${row.company},${row.month}`))
  return lines.join('\n')
}

export function parseMtdCsv(text: string): MtdSegmentData | null {
  const lines = text.split(/\r?\n/)
  const metrics = new Map(MTD_METRIC_ORDER.map((m) => [m, { metric: m, target: 0, achieved: 0 }]))
  const sts: string[] = []
  const pl: string[] = []
  const login: string[] = []
  const plToLogin: { company: string; month: string }[] = []

  type Section = 'metrics' | 'sts' | 'pl' | 'login' | 'watchlist' | null
  let section: Section = null
  let sawAnyData = false

  for (const raw of lines) {
    const line = raw.trim()
    if (!line) continue
    if (line.startsWith('#')) {
      const header = line.replace(/^#+/, '').trim().toLowerCase()
      if (header === 'metrics') section = 'metrics'
      else if (header === 'sts') section = 'sts'
      else if (header === 'pl') section = 'pl'
      else if (header === 'login') section = 'login'
      else if (header === 'watchlist') section = 'watchlist'
      else section = null
      continue
    }

    const cells = line.split(',').map((c) => c.trim())

    if (section === 'metrics') {
      if (cells[0]?.toLowerCase() === 'metric') continue
      const name = normalizeMetricName(cells[0] ?? '')
      const target = Number(cells[1])
      const achieved = Number(cells[2])
      if (name && Number.isFinite(target) && Number.isFinite(achieved)) {
        metrics.set(name, { metric: name, target, achieved })
        sawAnyData = true
      }
    } else if (section === 'sts') {
      sts.push(line)
      sawAnyData = true
    } else if (section === 'pl') {
      pl.push(line)
      sawAnyData = true
    } else if (section === 'login') {
      login.push(line)
      sawAnyData = true
    } else if (section === 'watchlist') {
      if (cells[0]?.toLowerCase() === 'company') continue
      if (cells[0]) {
        plToLogin.push({ company: cells[0], month: cells[1] ?? '' })
        sawAnyData = true
      }
    }
  }

  if (!sawAnyData) return null

  return {
    metrics: MTD_METRIC_ORDER.map((m) => metrics.get(m)!),
    stageNames: { sts, pl, login },
    plToLogin,
  }
}

export function buildWeeklyMetrics(metrics: MetricRow[]): MetricRow[][] {
  const weeks: MetricRow[][] = [[], [], [], []]
  metrics.forEach((row) => {
    const targetByWeek = splitFour(row.target)
    const achievedByWeek = splitFour(row.achieved)
    for (let w = 0; w < 4; w++) {
      weeks[w].push({ metric: row.metric, target: targetByWeek[w], achieved: achievedByWeek[w] })
    }
  })
  return weeks
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

function emptySpendsRow(channel: SpendsChannel): SpendsRow {
  return { channel, spends: 0, impressions: 0, clicks: 0, leads: 0, sts: 0, preLogin: 0, login: 0 }
}

export function emptySpendsPeriod(): SpendsRow[] {
  return SPENDS_CHANNELS.map(emptySpendsRow)
}

export function emptySpendsSegmentData(): SpendsSegmentData {
  return {
    monthly: emptySpendsPeriod(),
    week1: emptySpendsPeriod(),
    week2: emptySpendsPeriod(),
    week3: emptySpendsPeriod(),
    week4: emptySpendsPeriod(),
  }
}

function spendsRow(
  channel: SpendsChannel,
  spends: number,
  impressions: number,
  clicks: number,
  leads: number,
  sts = 0,
  preLogin = 0,
  login = 0,
): SpendsRow {
  return { channel, spends, impressions, clicks, leads, sts, preLogin, login }
}

export const spendsBySegment: Record<'SME' | 'Enterprise', SpendsSegmentData> = {
  SME: {
    monthly: [
      spendsRow('Google', 552273, 47044, 2893, 140, 13, 7, 7),
      spendsRow('Meta', 90875, 318202, 2278, 85, 0, 0, 0),
      spendsRow('LinkedIn', 0, 0, 0, 0, 0, 0, 0),
      spendsRow('Chatbot', 0, 0, 0, 0, 0, 0, 0),
      spendsRow('Others', 0, 0, 0, 0, 0, 0, 0),
    ],
    week1: [
      spendsRow('Google', 175555, 18410, 1332, 38, 5, 3, 3),
      spendsRow('Meta', 34892, 128069, 954, 31, 0, 0, 0),
      spendsRow('LinkedIn', 0, 0, 0, 0, 0, 0, 0),
      spendsRow('Chatbot', 0, 0, 0, 0, 0, 0, 0),
      spendsRow('Others', 0, 0, 0, 0, 0, 0, 0),
    ],
    week2: [
      spendsRow('Google', 186960, 18292, 1629, 53, 5, 3, 2),
      spendsRow('Meta', 35222, 124785, 0, 0, 0, 0, 0),
      spendsRow('LinkedIn', 0, 0, 0, 0, 0, 0, 0),
      spendsRow('Chatbot', 0, 0, 0, 0, 0, 0, 0),
      spendsRow('Others', 0, 0, 0, 0, 0, 0, 0),
    ],
    week3: emptySpendsPeriod(),
    week4: emptySpendsPeriod(),
  },
  Enterprise: emptySpendsSegmentData(),
}

export function getSpendsPeriod(
  segment: OverviewSegment,
  period: SpendsPeriodKey,
  bySegment: Record<'SME' | 'Enterprise', SpendsSegmentData> = spendsBySegment,
): SpendsRow[] {
  if (segment !== 'All') return bySegment[segment][period]
  const sme = bySegment.SME[period]
  const ev = bySegment.Enterprise[period]
  return SPENDS_CHANNELS.map((channel, i) => ({
    channel,
    spends: sme[i].spends + ev[i].spends,
    impressions: sme[i].impressions + ev[i].impressions,
    clicks: sme[i].clicks + ev[i].clicks,
    leads: sme[i].leads + ev[i].leads,
    sts: sme[i].sts + ev[i].sts,
    preLogin: sme[i].preLogin + ev[i].preLogin,
    login: sme[i].login + ev[i].login,
  }))
}

export function ctrOf(row: SpendsRow): number | null {
  return row.impressions > 0 ? (row.clicks / row.impressions) * 100 : null
}

export function cpcOf(row: SpendsRow): number | null {
  return row.clicks > 0 ? row.spends / row.clicks : null
}

export function cplOf(row: SpendsRow): number | null {
  return row.leads > 0 ? row.spends / row.leads : null
}

export function sumSpendsRows(rows: SpendsRow[]): Omit<SpendsRow, 'channel'> {
  return rows.reduce(
    (acc, row) => ({
      spends: acc.spends + row.spends,
      impressions: acc.impressions + row.impressions,
      clicks: acc.clicks + row.clicks,
      leads: acc.leads + row.leads,
      sts: acc.sts + row.sts,
      preLogin: acc.preLogin + row.preLogin,
      login: acc.login + row.login,
    }),
    { spends: 0, impressions: 0, clicks: 0, leads: 0, sts: 0, preLogin: 0, login: 0 },
  )
}

export const SPENDS_PERIOD_LABELS: Record<SpendsPeriodKey, string> = {
  monthly: "September '26 · Monthly",
  week1: 'Week 1',
  week2: 'Week 2',
  week3: 'Week 3',
  week4: 'Week 4',
}

export function serializeSpendsCsv(rows: SpendsRow[]): string {
  const lines = ['Channel,Spends,Impressions,Clicks,Leads,STS,PreLogin,Login']
  rows.forEach((r) => lines.push(`${r.channel},${r.spends},${r.impressions},${r.clicks},${r.leads},${r.sts},${r.preLogin},${r.login}`))
  return lines.join('\n')
}

function normalizeChannelName(name: string): SpendsChannel | null {
  const n = name.trim().toLowerCase()
  const found = SPENDS_CHANNELS.find((c) => c.toLowerCase() === n)
  return found ?? null
}

export function parseSpendsCsv(text: string): SpendsRow[] | null {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  const rows = new Map(SPENDS_CHANNELS.map((c) => [c, emptySpendsRow(c)]))
  let sawAnyData = false

  for (const line of lines) {
    const cells = line.split(',').map((c) => c.trim())
    if (cells[0]?.toLowerCase() === 'channel') continue
    const channel = normalizeChannelName(cells[0] ?? '')
    if (!channel) continue
    const [spends, impressions, clicks, leads, sts, preLogin, login] = cells.slice(1).map((c) => Number(c) || 0)
    rows.set(channel, { channel, spends, impressions, clicks, leads, sts, preLogin, login })
    sawAnyData = true
  }

  if (!sawAnyData) return null
  return SPENDS_CHANNELS.map((c) => rows.get(c)!)
}
