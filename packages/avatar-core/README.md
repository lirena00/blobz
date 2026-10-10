# @blobz/avatar-core

The framework-free, deterministic SVG engine behind Blobz. The same normalized
name and palette always produce the same avatar in Node.js, Bun, and the browser.

## Usage

```ts
import { createAvatar } from "@blobz/avatar-core";

const avatar = createAvatar({
  name: "Ada Lovelace",
  palette: ["#f2f1f4", "#7c6cf2"],
  frame: "rounded",
});

avatar.svg; // Complete 80×80 accessible SVG markup
avatar.choices; // Numeric choices that can be saved or edited
avatar.features; // Human-readable choices for a UI
```

For compatibility with the original `index.html` generator, `makeAvatar` keeps
the same positional API:

```ts
import { makeAvatar } from "@blobz/avatar-core";

const avatar = makeAvatar(
  "Ada Lovelace",
  ["#f2f1f4", "#7c6cf2"],
  "circle"
);
```

## Build a face manually

`createCustomAvatar` renders semantic choices directly. It does not use a name
or a name-derived hash to select missing features, and it validates every
choice at runtime.

```ts
import { createCustomAvatar } from "@blobz/avatar-core";

const avatar = createCustomAvatar({
  palette: ["#ffffff", "#12b76a"],
  frame: "circle",
  choices: {
    shape: "leaf",
    eyes: "distorted",
    look: "centre",
    eyeSpacing: "medium",
    mouth: "wide smile",
    brows: "quizzical",
    mirrored: false,
    faceAngle: 2,
    bodyTilt: -4,
    facePosition: { x: 1, y: 0 },
  },
});
```

`toCustomAvatarChoices` converts a generated result into the semantic format,
which lets an editor use a generated face as its custom starting point. The
legacy `choices` option on `createAvatar` remains available for partial numeric
overrides.

The current feature space contains `4,911,637,500` combinations before palette
variation. It includes 21 silhouettes, 14 eye styles, 11 mouths, nine brow
styles, and 25 face angles. The generator draw order is intentionally stable;
changing it would change existing users' avatars.
