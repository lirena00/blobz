# @blobz/react

The React component library for Blobz. It renders deterministic, name-generated
avatars and explicit custom faces.

## Usage

```tsx
import { Avatar } from "@blobz/react";

export function Profile() {
  return (
    <Avatar
      name="Janaki"
      palette={["#f2f1f4", "#7c6cf2"]}
      frame="rounded"
      size={64}
    />
  );
}
```

The component forwards standard image props and its ref to the underlying
`HTMLImageElement`:

```tsx
<Avatar
  name={user.id}
  alt={`${user.name}'s avatar`}
  className="rounded-xl"
  loading="lazy"
  size="3rem"
/>
```

Pass an empty `alt` string when the image is decorative.

## Custom faces

`CustomAvatar` renders a complete semantic definition without using a name to
choose any facial feature:

```tsx
import { CustomAvatar } from "@blobz/react/custom";

const definition = {
  type: "custom",
  version: 1,
  frame: "circle",
  palette: ["#ffffff", "#12b76a"],
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
} as const;

<CustomAvatar definition={definition} size={64} />;
```
