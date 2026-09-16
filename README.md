# Job Search Dashboard

A single-user dashboard for tracking job applications and discovering new roles: top
metrics, an Applications table, a New Roles table, Quick Links, and an AI cover letter
generator. This is the **Phase 1** build — everything is manual-entry (no job-board APIs
or Gmail parsing yet); see [Roadmap](#roadmap) below.

## Features (Phase 1)

- Password-protected dashboard (single user, session cookie)
- Top metrics: Applications Submitted, Interviews, Active Applications
- **Applications** table — company, title, link, status (Applied / Responded / Interview
  Scheduled / Offer / Rejected / Ghosted). Applications with no status change after 14
  days auto-flag as Ghosted. Rejected/Ghosted applications auto-archive (toggle "Show
  archived" to see them).
- **New Roles** table — manually add roles you find, with company / posted date / link /
  job ID. Adding the same company + title + job ID twice is treated as a duplicate; a
  different job ID for the same company + title is treated as a separate opening.
- **Company Watchlist** (Settings) — companies to keep an eye on; will power auto-matching
  in Phase 2.
- **Quick Links** — LinkedIn inbox and Google Doc resume links (configured in Settings),
  plus a built-in AI **Cover Letter Generator** that reuses a resume you paste once.
- Refresh button reloads the dashboard's stored data.

## Getting Started

```bash
npm install
cp .env.example .env   # then fill in DATABASE_URL, DIRECT_URL, APP_PASSWORD, SESSION_SECRET, ANTHROPIC_API_KEY
npx prisma migrate deploy   # applies the committed migration to your Supabase database
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and log in with the password you set
in `.env` as `APP_PASSWORD`.

## Environment variables

See `.env.example`. The app uses a hosted Postgres database (Supabase) both locally and
in production — there's no local-only database file.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Supabase's **pooled** connection string (port 6543, `?pgbouncer=true`). Used by the running app. |
| `DIRECT_URL` | Supabase's **direct** connection string (port 5432). Used only by `prisma migrate`, which needs a non-pooled connection. |
| `APP_PASSWORD` | The password required to log into the dashboard. |
| `SESSION_SECRET` | Random 32+ character string used to encrypt the login session cookie. |
| `ANTHROPIC_API_KEY` | Needed for the Cover Letter Generator. Get one at [console.anthropic.com](https://console.anthropic.com). |
| `ANTHROPIC_MODEL` | Optional, defaults to `claude-sonnet-5`. |

Get both Postgres URLs from your Supabase project: **Project Settings → Database →
Connect**, then choose the "Prisma" tab, which gives you both pre-formatted.

## Deploying (Vercel)

1. Push this repo to GitHub (already done) and import it into
   [Vercel](https://vercel.com/new).
2. In the Vercel project's environment variables, set everything from `.env.example`
   (`DATABASE_URL`, `DIRECT_URL`, `APP_PASSWORD`, `SESSION_SECRET`, `ANTHROPIC_API_KEY`)
   using your Supabase connection strings.
3. Run `npx prisma migrate deploy` once against the Supabase database (either locally
   with the production `.env`, or as a one-off via Vercel's CLI) to create the tables.
4. Deploy. Every subsequent push to the connected branch redeploys automatically.

## Known dev-dependency advisories

`npm audit` reports a high-severity advisory in `deepmerge-ts`, a transitive dependency
of Prisma's own CLI config loader (`@prisma/config`). This only affects the `prisma`
CLI's local config-merging at dev/build time — it is not part of `@prisma/client`, which
is what actually runs in the deployed app, and nothing in this app merges
attacker-controlled config objects. Re-check `npm audit` when upgrading Prisma in case
this is fixed upstream.

## Roadmap (Phase 2)

- Pull "New Roles" automatically from Greenhouse/Lever and job-board aggregator APIs,
  matched against keywords/companies from the Watchlist.
- Gmail OAuth integration to auto-log applications and auto-update status
  (responded/rejected) by parsing inbox activity.
- "Refresh" hitting live job sources instead of just reloading stored data.
- Assisted "apply" flow (pre-fill an application from the dashboard for manual review and
  submission).

Note: LinkedIn has no public job-search or inbox API, and scraping it violates LinkedIn's
Terms of Service. Phase 2 LinkedIn coverage will most likely stay a manual "paste this
listing" flow rather than automated pulling.

---

<details>
<summary>Original create-next-app notes</summary>

This project was bootstrapped with
[`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). See
the [Next.js documentation](https://nextjs.org/docs) to learn more.

</details>
