# AssetFlow Management System

A Turborepo monorepo powered by [pnpm](https://pnpm.io) and [Turborepo](https://turborepo.com).

## What's inside?

### Apps

- `apps/web` — the AssetFlow Next.js 16 application (App Router, React 19, Tailwind CSS 4, shadcn/ui).

### Packages

- `@repo/ui` — shared React component library.
- `@repo/eslint-config` — shared ESLint configuration.
- `@repo/typescript-config` — shared `tsconfig` bases.

Every package and app is written in TypeScript.

### Docs

- `docs/` — internal documentation (Markdown). See [`docs/monorepo.md`](docs/monorepo.md).

## Prerequisites

- Node.js >= 20
- pnpm 10 (`corepack enable` or `npm i -g pnpm`)

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Common commands

```bash
pnpm dev           # run all apps in dev mode
pnpm build         # build all apps and packages
pnpm lint          # lint everything
pnpm check-types   # type-check everything
```

Run a task for a single workspace with a filter:

```bash
pnpm dev --filter=web
pnpm build --filter=web
```

## Adding another app

```bash
pnpm dlx create-next-app@latest apps/<name>
```
