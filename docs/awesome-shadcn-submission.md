# awesome-shadcn submission

Submit Blobz under **Registries**, as defined in the list's [contribution rules](https://github.com/birobirobiro/awesome-shadcn-ui/blob/main/CONTRIBUTING.md#sections).

## Suggested entry

Insert this row alphabetically. The list's workflow adds the date; omit the date column when submitting.

```md
| blobz | Free, MIT-licensed shadcn/ui registry for generated avatars and identity blocks; optional paid hosted image API. | [Link](https://blobz.lirena.in/docs/components) |
```

## Maintainer reply

Thanks for pointing out the missing connection in the README. The submitted resource is Blobz's shadcn registry: `@blobz` is included in [shadcn's public registry index](https://ui.shadcn.com/r/registries.json), and the [published Avatar registry item](https://blobz.lirena.in/r/avatar.json) can be installed with `npx shadcn@latest add @blobz/avatar`.

These components are distributed as editable source for shadcn projects and render avatars locally. The registry components and underlying avatar libraries are free and MIT-licensed, with no account or subscription required. Blobz also offers an optional paid hosted image API, which the registry components do not depend on.

I propose placing the entry under **Registries**, with the paid API disclosed in the description above.

## Publishing the updated integration docs

The local README now documents the registry installation, composition API, source definitions, and paid API scope. Publish it with the pending registry changes before referring the maintainer to the new `Avatar` / `AvatarFallback` example: the deployed Avatar item checked during this update still exports the previous `BlobAvatar` implementation.

The public namespace listing and the working Avatar registry endpoint are already available as evidence independently of that API migration.
