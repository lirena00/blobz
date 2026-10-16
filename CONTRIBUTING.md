# Contributing to Blobz

Blobz has two public npm libraries, a public shadcn registry, and one web app. Changes to generated faces can affect every existing avatar, so please check the output as well as the types.

## Get the workspace running

Use the Bun version in the root `package.json`. From the repository root:

```bash
bun install
bun run dev:web
```

The site starts at `http://localhost:3001`. The studio and documentation need no external services. Account, billing, and hosted API routes use the variables in `apps/web/.env.schema`; put local values in the ignored `apps/web/.env` file. After changing an env schema, run `bun run env:generate`.

For database work, use a Neon Postgres branch and apply the checked-in migrations. From `packages/db`, with the web env file available:

```bash
bun --env-file=../../apps/web/.env run db:migrate
```

Use a direct connection for `DATABASE_MIGRATION_URL` when possible and a pooled connection for `DATABASE_URL`. Do not run the initial migration over a database that already has tables created by `db:push`; reconcile that schema first.

## Find the right place

| Change | Start here |
| --- | --- |
| Generated face, hash, SVG, or custom choices | `packages/avatar-core/src/avatar.ts` |
| React components | `packages/react/src/` |
| Shared shadcn Avatar primitives | `packages/ui/src/components/avatar.tsx` |
| Registry compositions, cards, and blocks | `apps/web/src/registry/blobz/` |
| Studio, docs, dashboard, or API routes | `apps/web/src/` |
| Shared site components and styling | `packages/ui/src/` |
| Database schema or migrations | `packages/db/` |
| Google sign-in or sessions | `packages/auth/` |

The web app imports the libraries from the workspace. Keep rendering logic in `avatar-core` so React, the studio, and the hosted API produce the same avatar.

## Before opening a pull request

```bash
bun run check
bun run check-types
cd packages/avatar-core && bun test
cd ../react && bun test
```

Run `bun run fix` to apply Ultracite formatting. Include a screenshot for visible UI changes. For generator changes, show before and after SVGs for a few stable names and explain whether existing names now render differently. Add or update tests for behavior changes and boundary cases. Keep credentials, database URLs, and local `.env` files out of commits.

For registry changes, update the source and the relevant item definition included by the root `registry.json`. From `apps/web`, run `bun run registry:validate` and `bun run registry:build` to regenerate `public/r/`. Install the affected item in a separate shadcn project to check its dependency list, target paths, and copied imports.

If you change Better Auth plugins or schema options, run `bun run auth:generate` from the root, review the resulting schema, and include the matching migration. For hosted API changes, update [the API guide](./docs/hosted-api.md) when URL behavior, origin checks, limits, or billing behavior changes.

## Package releases

Only `@blobz/avatar-core` and `@blobz/react` are published to npm. Other workspace packages are private npm packages; selected UI source files are distributed through the shadcn registry. A package release should bump the affected package version, build it, inspect `npm pack --dry-run`, and publish `avatar-core` before `react` when both change. Each public tarball must contain its README, built `dist/`, and MIT license.
