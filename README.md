![Blobz cover: A face worth keeping](./cover.png)

# Blobz

**Give any name, username, or ID a face that stays the same.** Blobz turns a string into a playful SVG avatar. The same input and palette produce the same character, so your app can render it again without storing an image or calling a service.

[![npm: avatar-core](https://img.shields.io/npm/v/@blobz/avatar-core?label=avatar-core&color=18a6d3)](https://www.npmjs.com/package/@blobz/avatar-core)
[![npm: react](https://img.shields.io/npm/v/@blobz/react?label=react&color=7c6cf2)](https://www.npmjs.com/package/@blobz/react)
[![License: MIT](https://img.shields.io/badge/license-MIT-0b1830)](./LICENSE)

[Try the avatar studio](https://blobz.lirena.in/create) · [Read the docs](https://blobz.lirena.in/docs) · [See the packages](#pick-your-way-in)

## Pick your way in

| You want to… | Use |
| --- | --- |
| Put avatars in a React app | [`@blobz/react`](https://www.npmjs.com/package/@blobz/react) |
| Generate SVG without React | [`@blobz/avatar-core`](https://www.npmjs.com/package/@blobz/avatar-core) |
| Design a face by hand | [Avatar studio](https://blobz.lirena.in/create) or `CustomAvatar` from `@blobz/react/custom` |
| Serve avatar images by URL | [Hosted API](./docs/hosted-api.md) |

### React: one component

```bash
bun add @blobz/react
```

```tsx
import { Avatar } from "@blobz/react";

export function ProfileAvatar() {
  return (
    <Avatar
      name="janaki-ammal"
      alt="Janaki's avatar"
      palette={["#f2f1f4", "#7c6cf2"]}
      frame="rounded"
      size={64}
    />
  );
}
```

### Anywhere else: SVG as a string

```bash
bun add @blobz/avatar-core
```

```ts
import { createAvatar } from "@blobz/avatar-core";

const { svg, choices } = createAvatar({
  name: "janaki-ammal",
  palette: ["#f2f1f4", "#7c6cf2"],
  frame: "rounded",
});

// svg is the complete image; choices describes the generated face.
```

The name selects the face. The palette colors it; the frame chooses its crop. Blobz hashes the normalized input into stable feature choices and renders those choices as SVG. There is no random seed to save and no image asset to upload. If you want to pick every feature yourself, use [`createCustomAvatar`](./packages/avatar-core/README.md#build-a-face-manually) or [`CustomAvatar`](./packages/react/README.md#custom-faces).

## What's in this repo

| Path | Role | Main tools |
| --- | --- | --- |
| [`packages/avatar-core`](./packages/avatar-core) | Deterministic avatar generator and SVG renderer | TypeScript, tsup |
| [`packages/react`](./packages/react) | React image components built on the core | React 19, TypeScript |
| [`apps/web`](./apps/web) | Studio, docs, account dashboard, and hosted image API | Next.js 16, Tailwind CSS, Fumadocs |
| [`packages/db`](./packages/db) | Account, billing, and usage data | Drizzle ORM, Neon Postgres |
| [`packages/auth`](./packages/auth) | Google sign-in and account sessions | Better Auth |
| [`packages/ui`](./packages/ui) | Shared site components and styles | shadcn/ui, Base UI |

Dodo Payments handles paid API subscriptions. Varlock validates server configuration; Bun and Turborepo run the workspace. The two avatar libraries work without the web app, database, or billing setup.

## Run the site locally

```bash
bun install
bun run dev:web
```

The site runs at `http://localhost:3001`. The studio and docs are available without an account. Dashboard and hosted API work need the services listed in [`apps/web/.env.schema`](./apps/web/.env.schema); [CONTRIBUTING.md](./CONTRIBUTING.md) has the local setup and checks. The [hosted API guide](./docs/hosted-api.md) covers image URLs, origin rules, quotas, and billing operations.

## License

MIT. See [LICENSE](./LICENSE). The published packages include their own license copies.
