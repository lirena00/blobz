# blobz

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines Next.js, Self, and more.

## Features

- **TypeScript** - For type safety and improved developer experience
- **Next.js** - Full-stack React framework
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **Shared UI package** - shadcn/ui primitives live in `packages/ui`
- **Drizzle** - TypeScript-first ORM
- **PostgreSQL** - Database engine
- **Authentication** - Better-Auth
- **Biome** - Linting and formatting
- **Turborepo** - Optimized monorepo build system

## Getting Started

First, install the dependencies:

```bash
bun install
```

## Database Setup

This project uses Neon PostgreSQL with Drizzle ORM.

1. Create a Neon database and set `DATABASE_URL` in `apps/web/.env`.
2. Set `DATABASE_MIGRATION_URL` to Neon's direct connection URL when available.
3. Apply the checked-in migrations from `packages/db` with those values in the process environment:

```bash
cd packages/db
bun run db:migrate
```

`db:push` is useful for disposable local databases; use migrations for deployed environments.

Then, run the development server:

```bash
bun run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the fullstack application.

## Hosted avatar API

The hosted API uses the same deterministic avatar renderer as the React package. A signed-in Better Auth user is the billing account. Each paid account has **one active image endpoint**, provisioned automatically after the first verified successful payment; customers do not create endpoints or API keys. The account can approve **five exact browser origins total**. The 5M/10M monthly request allowance is account-wide.

Set these server-side values in `apps/web/.env` for local development and in your deployment secret store for production:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Neon pooled Postgres URL for web requests. |
| `DATABASE_MIGRATION_URL` | Optional direct Neon URL for migrations; otherwise `DATABASE_URL` is used. |
| `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET` | Canonical site URL and a 32+ character secret. |
| `DODO_PAYMENTS_API_KEY` | Dodo test or live API key. |
| `DODO_PAYMENTS_WEBHOOK_SECRET` | Signing secret for the Dodo webhook endpoint. |
| `DODO_PAYMENTS_ENVIRONMENT` | `test_mode` or `live_mode`; match the API key and products. |
| `DODO_PRODUCT_PLUS_MONTHLY`, `DODO_PRODUCT_PLUS_YEARLY` | IDs of the Plus monthly and yearly recurring Dodo products (5M requests per month). |
| `DODO_PRODUCT_PRO_MONTHLY`, `DODO_PRODUCT_PRO_YEARLY` | IDs of the Pro monthly and yearly recurring Dodo products (10M requests per month). All four product IDs must be distinct. |
| `CRON_SECRET` | Optional 32+ character secret for the daily maintenance endpoint. |

Create the four products and their prices in Dodo, then register `https://YOUR_SITE/api/auth/dodopayments/webhooks` as a webhook. Subscribe to `payment.succeeded` and subscription lifecycle events (`active`, `updated`, `renewed`, `plan_changed`, `on_hold`, `paused`, `unpaused`, `failed`, `cancelled`, `expired`). The [Better Auth Dodo plugin](https://better-auth.com/docs/plugins/dodopayments) verifies signatures before the app applies entitlements. The checkout route chooses product IDs on the server; it does not accept a client-supplied product cart. A new subscription stays pending until its first signed successful-payment event. The image endpoint is inserted in the same transaction that activates the entitlement, including when the payment and subscription webhooks arrive in either order. Checkout redirects do not grant access. In-app plan switching is disabled for now; keep the `plan_changed` webhook enabled so external Dodo changes are still reflected. Configure the products without a free trial and without a renewal grace period, because this API is designed to stop access outside the paid billing period. A yearly subscription still receives a fresh 5M/10M allowance every month, anchored to its annual billing start; unused requests do not roll over.

The checked-in Drizzle migrations create the auth and API tables for a **new database**. For a fresh Neon branch, run from `packages/db` with the connection variables present in the process environment:

```bash
bun run db:migrate
```

For a local `.env` in the web app, Bun can load it with `bun --env-file=../../apps/web/.env run db:migrate` from `packages/db`. Use a direct Neon URL for migrations and a pooled URL at runtime. If your database already contains Better Auth tables created by `db:push`, baseline or reconcile the migration against that schema before applying it; do not run the initial migration over existing tables blindly. The image-endpoint migration renames `api_key` to `api_endpoint`, preserves existing IDs and daily usage, retires extra active legacy endpoints per account, and backfills an endpoint for active subscribers who have none. Apply it before deploying the new application code. Retired legacy endpoint URLs stop working; the oldest active URL per account remains.

The browser endpoint is `GET /api/v1/avatars/ENDPOINT_ID`. It needs no Authorization header. Paste the dashboard's generated image tag into a page served from one of the account's approved origins:

```html
<img src="https://YOUR_BLOBZ_HOST/api/v1/avatars/ENDPOINT_ID?name=Ada&amp;frame=rounded&amp;palette=%23f2f1f4%2C%237c6cf2&amp;size=80" crossorigin="anonymous" width="80" height="80" alt="Ada avatar" />
```

The query uses Blobz's own hash-based avatar inputs: required `name` (1–256 characters); optional `frame` (`circle`, `rounded`, or `square`); optional `palette` (two comma-separated six-digit hex colors, background then body); and optional `size` (16–1024 pixels). Defaults match the React package: rounded frame, `#f2f1f4,#7c6cf2`, and 80 pixels. The `crossorigin` attribute is required so a cross-origin browser image request sends its `Origin` header. The configured Blobz deployment is trusted automatically for its same-origin API playground; every other browser origin must be approved before counting or rendering. Successful responses return SVG with an exact `Access-Control-Allow-Origin` response header. The endpoint ID is public, stable, and not a secret.

Only successful GET image requests draw from the **account-wide** 5M or 10M monthly allowance, whether the subscription is billed monthly or yearly. Exceeding that allowance returns `429` with `Retry-After`; unknown endpoints return `404`, unapproved origins or inactive subscriptions `403`, and invalid input `422`. An additional 10,000 requests/minute account-wide burst guard applies. Successful responses include `RateLimit-Limit`, `RateLimit-Remaining`, and `RateLimit-Reset`. The old Bearer-key POST route and customer endpoint-creation routes are removed.

The image URL is public. CORS and `Origin` checks restrict ordinary browser embedding, but a non-browser client can spoof `Origin` and consume an account's allowance. `Referer` is not used as authentication because sites can omit it. Endpoint rotation is an operator action, not a customer dashboard control; use short-lived server-signed URLs if strong caller authentication is required. Do not put private email addresses or other sensitive data in `name` unless URL logging by browsers, proxies, and hosts is acceptable; an opaque stable ID produces the same deterministic behavior.

The current implementation uses Neon's atomic transactions for exact accounting and sends `Cache-Control: no-store`, so every served network request reaches the quota check. Benchmark database throughput and request peaks before promising multi-million-request production plans; a durable atomic counter service can later move the hot request counter off Neon without changing the public URL contract. A separate `img.blobz.com` hostname can point to this same app in production; customer-owned DNS domains are not required for the embed API.

Schedule `GET /api/internal/maintenance` daily with `Authorization: Bearer <CRON_SECRET>` to remove expired minute counters, checkout intents, old webhook deduplication records, and old daily usage. The endpoint is disabled when `CRON_SECRET` is unset. Monthly usage-period totals are retained. Test checkout, subscription renewal, and cancellation with Dodo test mode before switching to live products and keys. Customers can schedule cancellation in the dashboard; paid API access continues through the current billing period and then stops. The dashboard does not expose plan switching or a Dodo customer-portal link while plan changes are disabled; arrange a support path for other billing changes.

## UI Customization

React web apps in this stack share shadcn/ui primitives through `packages/ui`.

- Change design tokens and global styles in `packages/ui/src/styles/globals.css`
- Update shared primitives in `packages/ui/src/components/*`
- Adjust shadcn aliases or style config in `packages/ui/components.json` and `apps/web/components.json`

### Add more shared components

Run this from the project root to add more primitives to the shared UI package:

```bash
npx shadcn@latest add accordion dialog popover sheet table -c packages/ui
```

Import shared components like this:

```tsx
import { Button } from "@blobz/ui/components/button";
```

### Add app-specific blocks

If you want to add app-specific blocks instead of shared primitives, run the shadcn CLI from `apps/web`.

## Environment Configuration

Each app owns its environment schema in `.env.schema`. Varlock generates `src/env.ts` during installation; run `bun run env:generate` after changing a schema. Commit schemas, and keep secrets in ignored env files or your deployment platform.

Import the generated `ENV` accessor in application code. Shared database and auth packages receive configuration or initialized clients from the application. See [Varlock's monorepo guide](https://varlock.dev/guides/monorepos/).

Bun's automatic env loading is disabled in `bunfig.toml`; the framework integration or server bootstrap loads Varlock. Node deployments must include Varlock and its dependencies alongside the app schema.

Run standalone Node/Bun tools that use Varlock from the owning app directory so they load that app's schema and env files. `env:generate` only generates TypeScript files; it does not initialize environment values in a subsequent command.

## Git Hooks and Formatting

- Run checks: `bun run check`

## Project Structure

```
blobz/
├── apps/
│   └── web/         # Fullstack application (Next.js)
├── packages/
│   ├── ui/          # Shared shadcn/ui components and styles
│   ├── auth/        # Authentication configuration & logic
│   └── db/          # Database schema & queries
```

## Available Scripts

- `bun run dev`: Start all applications in development mode
- `bun run build`: Build all applications
- `bun run dev:web`: Start only the web application
- `bun run check-types`: Check TypeScript types across all apps
- `bun run db:push`: Push schema changes to database
- `bun run db:generate`: Generate database client/types
- `bun run db:migrate`: Run database migrations
- `bun run db:studio`: Open database studio UI
- `bun run check`: Run Biome formatting and linting

## Better Auth Schema Generation

After changing auth plugins or schema options, run `bun run auth:generate` from the project root. The script runs the Better Auth CLI through `varlock run` from the owning app directory, loading the auth instance from `src/services.ts`. Review the schema changes, then use your ORM's migration workflow to apply them.
