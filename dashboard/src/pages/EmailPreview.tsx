import { useState } from 'react'
import { useStore } from '../store'
import { googleAdsAugust, inr, linkedinAugust, outboundCalling, overviewBySegment } from '../data'
import { DarkPillTabs } from '../components/ui'
import { Logo } from '../components/Header'

export default function EmailPreview() {
  const { setPage, pushToast } = useStore()
  const [preview, setPreview] = useState<'Preview: SME' | 'Preview: Enterprise'>('Preview: SME')
  const segment = preview === 'Preview: SME' ? 'SME' : 'Enterprise'
  const august = overviewBySegment[segment].august

  const funnel = overviewBySegment[segment].funnel
  const totals = funnel.reduce(
    (acc, row) => {
      acc.leads[0] += row.leads[0]
      acc.leads[1] += row.leads[1]
      acc.intel[0] += row.intel[0]
      acc.intel[1] += row.intel[1]
      acc.preLogin[0] += row.preLogin[0]
      acc.preLogin[1] += row.preLogin[1]
      acc.login[0] += row.login[0]
      acc.login[1] += row.login[1]
      return acc
    },
    { leads: [0, 0], intel: [0, 0], preLogin: [0, 0], login: [0, 0] } as Record<string, [number, number]>,
  )

  return (
    <div className="w-full min-h-screen bg-paper flex flex-col items-center py-10 px-4 gap-8">
      <DarkPillTabs
        options={['Preview: SME', 'Preview: Enterprise']}
        value={preview}
        onChange={(v) => setPreview(v as typeof preview)}
      />

      <div className="w-full max-w-[640px] bg-white rounded-2xl overflow-hidden border border-line">
        <div className="bg-ink px-5 sm:px-8 py-6 sm:py-8 flex flex-col items-center gap-3 text-center">
          <span className="font-body text-[10px] sm:text-[11px] font-semibold tracking-[2px] text-faint uppercase">
            Weekly Report — as of 9 Aug 2026 · {segment}
          </span>
          <Logo />
          <span className="font-body text-[10px] sm:text-[11px] font-semibold tracking-[1.5px] text-faint uppercase">
            Central Marketing · Weekly Report
          </span>
        </div>

        <div className="p-5 sm:p-8 flex flex-col gap-6 sm:gap-8">
          <p className="font-body text-sm text-ink">
            Hi team, here's the {segment} lead-gen snapshot for the month, as of 9 Aug 2026.
          </p>

          <div className="flex flex-col gap-3">
            <h3 className="font-heading font-bold text-sm text-ink uppercase tracking-wide">Monthly Targets — August 2026</h3>
            <div className="overflow-x-auto rounded-lg border border-line">
            <table className="w-full min-w-[420px] text-left">
              <thead>
                <tr className="bg-panel">
                  {['Metric', 'Target', 'Achieved', 'Deficit'].map((h) => (
                    <th key={h} className="font-body text-[10px] font-semibold tracking-[1px] text-faint uppercase px-4 py-2">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {august.map((kpi) => (
                  <tr key={kpi.label} className="border-t border-line">
                    <td className="px-4 py-2.5 font-body font-semibold text-[13px] text-ink">{kpi.label}</td>
                    <td className="px-4 py-2.5 font-body text-[13px] text-ink">{kpi.target}</td>
                    <td className="px-4 py-2.5 font-body text-[13px] text-ink">{kpi.achieved}</td>
                    <td className="px-4 py-2.5 font-body font-semibold text-[13px] text-rust">
                      {Math.max(kpi.target - kpi.achieved, 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-heading font-bold text-sm text-ink uppercase tracking-wide">Source-wise Target vs Achieved</h3>
            <div className="overflow-x-auto rounded-lg border border-line">
            <table className="w-full min-w-[420px] text-left">
              <thead>
                <tr className="bg-panel">
                  {['Source', 'Leads', 'Intel', 'PL', 'Login'].map((h) => (
                    <th key={h} className="font-body text-[10px] font-semibold tracking-[1px] text-faint uppercase px-4 py-2">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {funnel.map((row) => (
                  <tr key={row.source} className="border-t border-line">
                    <td className="px-4 py-2.5 font-body font-semibold text-[13px] text-ink">{row.source.replace(' / ', '/').replace(' – ', '-')}</td>
                    <td className="px-4 py-2.5 font-body text-[13px] text-ink">{row.leads[0]}/{row.leads[1]}</td>
                    <td className="px-4 py-2.5 font-body text-[13px] text-ink">{row.intel[0]}/{row.intel[1]}</td>
                    <td className="px-4 py-2.5 font-body text-[13px] text-ink">{row.preLogin[0]}/{row.preLogin[1]}</td>
                    <td className="px-4 py-2.5 font-body text-[13px] text-ink">{row.login[0]}/{row.login[1]}</td>
                  </tr>
                ))}
                <tr className="border-t border-line bg-panel">
                  <td className="px-4 py-2.5 font-body font-bold text-[13px] text-ink">Total</td>
                  <td className="px-4 py-2.5 font-body font-bold text-[13px] text-ink">{totals.leads[0]}/{totals.leads[1]}</td>
                  <td className="px-4 py-2.5 font-body font-bold text-[13px] text-ink">{totals.intel[0]}/{totals.intel[1]}</td>
                  <td className="px-4 py-2.5 font-body font-bold text-[13px] text-ink">{totals.preLogin[0]}/{totals.preLogin[1]}</td>
                  <td className="px-4 py-2.5 font-body font-bold text-[13px] text-ink">{totals.login[0]}/{totals.login[1]}</td>
                </tr>
              </tbody>
            </table>
          </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-sm text-ink uppercase tracking-wide">Google Ads — August</h3>
              <span className="font-body font-semibold text-[11px] bg-panel border border-line rounded-full px-2.5 py-1 text-muted">
                {googleAdsAugust.sts} STS · {googleAdsAugust.preLogin} PL · {googleAdsAugust.login} Login
              </span>
            </div>
            <div className="bg-panel rounded-lg p-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
              <Metric label="Spend" value={inr(googleAdsAugust.spend)} />
              <Metric label="Impr." value={googleAdsAugust.impressions.toLocaleString('en-IN')} />
              <Metric label="Clicks" value={googleAdsAugust.clicks.toString()} />
              <Metric label="CTR" value={`${googleAdsAugust.ctr}%`} />
              <Metric label="CPC" value={inr(googleAdsAugust.cpc)} />
              <Metric label="Leads" value={googleAdsAugust.leads.toString()} />
              <Metric label="CPL" value={inr(googleAdsAugust.cpl)} />
              <Metric label="STS" value={googleAdsAugust.sts.toString()} />
              <Metric label="Pre Login" value={googleAdsAugust.preLogin.toString()} />
              <Metric label="Login" value={googleAdsAugust.login.toString()} />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-sm text-ink uppercase tracking-wide">LinkedIn — August</h3>
              <span className="font-body font-semibold text-[11px] bg-panel border border-line rounded-full px-2.5 py-1 text-muted">
                {linkedinAugust.sts} STS · {linkedinAugust.preLogin} PL · {linkedinAugust.login} Login
              </span>
            </div>
            <div className="bg-panel rounded-lg p-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
              <Metric label="Spend" value={inr(linkedinAugust.spend)} />
              <Metric label="Impr." value={linkedinAugust.impressions.toLocaleString('en-IN')} />
              <Metric label="Clicks" value={linkedinAugust.clicks.toString()} />
              <Metric label="CPC" value={inr(linkedinAugust.cpc)} />
              <Metric label="CPM" value={inr(linkedinAugust.cpm)} />
              <Metric label="STS" value={linkedinAugust.sts.toString()} />
              <Metric label="Pre Login" value={linkedinAugust.preLogin.toString()} />
              <Metric label="Login" value={linkedinAugust.login.toString()} />
            </div>
            <p className="font-body text-[12px] text-faint">
              Only 1 lead total this week — too small a sample to split leads/CPL by segment, so both are shown blended above.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-heading font-bold text-sm text-ink uppercase tracking-wide">Outbound Calling Activity</h3>
            <div className="bg-panel rounded-lg p-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
              <Metric label="Dialed" value={outboundCalling.dialed.toString()} />
              <Metric label="Connected" value={outboundCalling.connected.toString()} />
              <Metric label="Ringing" value={outboundCalling.ringing.toString()} />
              <Metric label="Invalid" value={outboundCalling.invalid.toString()} />
              <Metric label="Info Req." value={outboundCalling.infoReq.toString()} />
            </div>
            <p className="font-body text-[12px] text-faint">Funnel from calls: 1 STS · 1 Pre Login · 0 Login · Connect rate 27%</p>
          </div>

          <button
            onClick={() => setPage('overview')}
            className="w-full bg-gold hover:bg-gold-dark hover:text-white text-ink font-body font-bold text-sm py-3.5 rounded-lg transition-colors underline underline-offset-4"
          >
            View Interactive Report →
          </button>

          <div className="font-body text-sm text-ink">
            Thanks &amp; Regards,
            <br />
            Ashutosh Gupta
            <br />
            Central Marketing, Flipspaces
          </div>
        </div>

        <div className="border-t border-line px-8 py-6 flex flex-col items-center gap-1.5">
          <span className="font-body text-[12px] text-faint text-center">Flipspaces Technology Labs Pvt. Ltd. · Central Marketing</span>
          <span className="font-body text-[12px] text-faint text-center">[Flipspaces Office Address]</span>
          <button onClick={() => pushToast('Email preferences saved')} className="font-body text-[12px] text-faint underline">
            Manage email preferences
          </button>
        </div>
      </div>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-body text-[10px] font-semibold tracking-[0.5px] text-faint uppercase">{label}</div>
      <div className="font-heading font-bold text-[15px] text-ink mt-0.5">{value}</div>
    </div>
  )
}
