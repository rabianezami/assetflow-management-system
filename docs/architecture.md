# Architecture

One Next.js app in a small monorepo. Shared packages are for config and UI we might reuse later.

```mermaid
flowchart TB
  web["apps/web — the product"]
  ui["packages/ui"]
  eslint["packages/eslint-config"]
  ts["packages/typescript-config"]
  docs["docs/"]

  web --> ui
  web --> eslint
  web --> ts
```

Inside `apps/web`, a request goes:

```mermaid
flowchart LR
  A["Request"] --> B["Pick locale<br/>en / fa / ps"]
  B --> C["Page under /[locale]"]
  C --> D["Translations"]
  C --> E["Theme + design tokens"]
```

## Commands

```bash
pnpm dev --filter=web
pnpm build
pnpm lint
pnpm check-types
```
