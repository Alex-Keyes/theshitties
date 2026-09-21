# The Shitties

Annual community awards for products that got worse. Next.js + TypeScript + Tailwind + Drizzle/Postgres. Intended for Vercel; nothing has been deployed.

## Local development

Requires Node.js 22 or newer.

```sh
npm ci
cp .env.example .env.local
npm run db:seed
npm run dev
```

Open http://localhost:3000. With no `DATABASE_URL`, the app initializes embedded Postgres (PGlite) in `.local/postgres` and applies Drizzle migrations automatically. The seed adds six clearly fictional companies with **zero votes**, only into an empty database. Run database scripts while the development server is stopped: embedded Postgres is a single-process local fallback, not a production database.

Set a random `SESSION_SECRET` of at least 32 characters in `.env.local`. For admin access, run `npm run admin:password -- 'a-long-unique-password'` and put the returned hash in `ADMIN_PASSWORD_HASH`. `/admin` uses this password, never the hash. A development-only signing fallback lets the public site run before configuration; production fails without a proper secret and database.

## Neon development branch

Create a dedicated development branch in your existing Neon project, then put its pooled Postgres connection string in `DATABASE_URL` in `.env.local`. Keep the branch separate from production. Restart the server after changing environment variables.

```sh
npm run db:migrate
# Optional, only on the dedicated development branch:
ALLOW_DEMO_SEED=true npm run db:seed
npm run dev
```

No Neon connection was supplied with this project, so the actual Neon connection still needs to be configured and verified. All integration tests run against real Postgres semantics using in-memory PGlite. Demo seeding refuses production/Vercel environments and requires explicit opt-in for remote databases. Do not set `ALLOW_DEMO_SEED` in production.

## Behavior

- Public submissions publish immediately; text is rendered as text, and source links are never fetched by the server.
- One upvote per signed browser identifier per nomination; repeat requests are idempotent. Anonymous voting is deliberately not one-person-one-vote.
- Server-enforced rate limits: 5 submissions/hour, 120 vote requests/minute, 10 reports/hour, 10 admin login attempts/15 minutes, per hashed connection address.
- Vercel's trusted request IP headers supply the address. If hosting behind another proxy, configure trusted headers before launch.
- The default season is 2026, closing `2027-01-01T05:00:00Z` (midnight in New York). Admin edits use UTC and only allow future dates while the season is open.
- All ballot writes and finalization lock the season row. Vote totals and nominee text are snapshotted on the first homepage, results, admin visit, or moderation action after closing. The deadline is enforced even if no page is visited at the exact closing time.
- Each category's highest count wins; the overall highest count wins The Golden Shitty. Ties, including zero-vote ties, share awards. Empty categories have no winner.
- Reports never automatically hide entries. Admins can hide/restore, mark duplicates without transferring votes, and resolve reports. Saved annual results stay immutable when nominations are moderated later.
- No public login, comments, uploads, downvotes, analytics, or submitter editing.
- To open another season, add a new row to `seasons` through a reviewed migration after finalizing the previous season. Historical snapshots remain intact. V1 admin settings edit the current deadline; they do not create seasons.

## Checks

```sh
npm test
npm run typecheck
npm run build
```

Tests cover validation, token tampering, password verification, repeated/concurrent votes, vote removal, moderation, duplicate links, reports, rate limits, closing enforcement, ties, empty awards, and immutable result snapshots.

Browser review checklist: desktop and 375px mobile layout, keyboard focus, submit validation and duplicate suggestions, submit-to-detail flow, vote/unvote after reload, report confirmation, admin login/logout, and network-error vote rollback. The browser connector was unavailable during initial implementation; these visual checks remain to be run in a connected browser.

## Later: Vercel deployment

1. Connect the repository to Vercel; use the standard Next.js build settings.
2. Attach a **clean production Neon database**, set `DATABASE_URL`, `SESSION_SECRET`, and `ADMIN_PASSWORD_HASH` as secrets. Preview environments must use a separate development database.
3. Apply committed migrations with `npm run db:migrate` using production environment variables. Do not run demo seed.
4. Verify the deadline, submissions, votes, moderation, and mobile layout in a preview deployment before connecting `theshitties.com`.
5. Keep Cloudflare DNS if desired; configure domain records according to Vercel's domain setup.

`.env.local` and `.local/` are ignored by Git. Never expose secrets through `NEXT_PUBLIC_*` variables. `LOCAL_PREVIEW=1` allows a local production-mode check with embedded Postgres; never set it on Vercel.
