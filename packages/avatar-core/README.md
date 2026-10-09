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

`AVATAR_CHOICES` contains every label in display order. Pass the corresponding
zero-based indexes through `choices`; omitted or invalid values fall back to the
name's deterministic choice.

```ts
import { AVATAR_CHOICES, createAvatar } from "@blobz/avatar-core";

console.log(AVATAR_CHOICES);

const avatar = createAvatar({
  name: "my-face",
  palette: ["#ffffff", "#12b76a"],
  choices: {
    shapeI: 11,
    eyeI: 13,
    lookI: 4,
    mouthI: 10,
    browI: 3,
    gapI: 2,
    tiltI: 14,
    dxI: 4,
    dyI: 2,
    flip: 1,
    faceTiltI: 12,
  },
});
```

The current feature space contains `1,135,134,000` combinations before palette
variation. The generator draw order is intentionally stable; changing it would
change existing users' avatars.
