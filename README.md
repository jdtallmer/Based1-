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
cp .env.example .env   # then edit APP_PASSWORD, SESSION_SECRET, ANTHROPIC_API_KEY
npx prisma migrate dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and log in with the password you set
in `.env` as `APP_PASSWORD`.

## Environment variables

See `.env.example`. Locally, the app uses a zero-setup SQLite file (`prisma/dev.db`, not
committed).

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | `file:./dev.db` locally. For deployment, point this at a hosted Postgres instance (e.g. [Neon](https://neon.tech) or [Supabase](https://supabase.com)) — see below. |
| `APP_PASSWORD` | The password required to log into the dashboard. |
| `SESSION_SECRET` | Random 32+ character string used to encrypt the login session cookie. |
| `ANTHROPIC_API_KEY` | Needed for the Cover Letter Generator. Get one at [console.anthropic.com](https://console.anthropic.com). |
| `ANTHROPIC_MODEL` | Optional, defaults to `claude-sonnet-5`. |

## Deploying (Postgres + Vercel)

This was built against SQLite for zero-setup local dev. To deploy:

1. Create a free Postgres database (Neon or Supabase both have a free tier).
2. In `prisma/schema.prisma`, change the datasource provider from `sqlite` to
   `postgresql`.
3. Set `DATABASE_URL` in your hosting provider's environment variables to the Postgres
   connection string.
4. Run `npx prisma migrate deploy` against that database (Prisma will need a fresh
   migration since SQLite and Postgres migrations aren't interchangeable — delete
   `prisma/migrations` and run `npx prisma migrate dev --name init` once against the
   Postgres URL locally, then commit the new migration).
5. Deploy to [Vercel](https://vercel.com/new) (or any Node host), setting the same env
   vars from `.env.example` in the project's environment settings.

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
