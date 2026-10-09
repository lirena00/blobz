# @blobz/react

The React component library for Blobz. It uses `@blobz/avatar-core` for all
deterministic avatar generation and renders the resulting SVG as a safe image
data URI.

## Usage

```tsx
import { Avatar } from "@blobz/react";

export function Profile() {
  return (
    <Avatar
      name="Ada Lovelace"
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

Face-builder selections use the same zero-based choice indexes exposed by
`AVATAR_CHOICES` in `@blobz/avatar-core`:

```tsx
<Avatar
  name="custom-face"
  palette={["#ffffff", "#12b76a"]}
  frame="circle"
  choices={{
    shapeI: 11,
    eyeI: 13,
    mouthI: 10,
    browI: 3,
  }}
/>
```
