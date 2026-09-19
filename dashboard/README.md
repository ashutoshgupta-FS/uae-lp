# Flipspaces Marketing Ops — Lead-Gen Dashboard

Internal marketing ops dashboard for Flipspaces Central Marketing: lead-gen performance overview, source uploads, lead analyser (data sources + analysis) and a weekly email report preview.

Built with React, TypeScript, Vite and Tailwind CSS. All data is mocked client-side (no backend) and persisted to `localStorage`, so uploads, toggles, the merge pipeline and email-digest settings all behave interactively.

## Pages

- **Overview** — funnel KPIs (Login/Pre Login/STS/Leads) vs target, segment (SME/Enterprise) and period (MTD/monthly) toggles, source-wise breakdown table.
- **Uploads** — per-source drag-and-drop / click-to-browse upload, sync status, recent uploads log.
- **Lead Analyser → Data Sources** — primary Lead Desk source, other lead sources, and a merge pipeline with a working "Run merge now" action.
- **Lead Analyser → Analysis** — combined lead stats, pipeline by status, confidence and source breakdowns, and a "Share This Analysis" panel (digest toggles, recipients, test send).
- **Email Preview** — a rendered preview of the weekly report email, switchable between SME/Enterprise.

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy

This folder is set up to deploy standalone from the repo root config:

- **Vercel** — import the repo; `vercel.json` at the repo root points the build at this folder (`dashboard/`) and outputs `dashboard/dist`.
- **Netlify** — `netlify.toml` at the repo root sets `base = "dashboard"`, `command = "npm run build"`, `publish = "dist"`.

Either platform's free tier is enough — no server/back end is required.
