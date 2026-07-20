# Monorepo setup

What we did to set up this repository:

- Converted the repo to a **pnpm + Turborepo** monorepo.
- Moved the Next.js app into `apps/web`.
- Added shared packages: `@repo/ui`, `@repo/eslint-config`, `@repo/typescript-config`.
- Switched the package manager from npm to **pnpm workspaces**.
- Fixed the app so it builds: `utils` → `src/lib`, `@/*` → `./src/*`, removed empty stub files.

## Layout

```
apps/
  web/                  # AssetFlow Next.js 16 app
packages/
  ui/                   # @repo/ui — shared React components
  eslint-config/        # @repo/eslint-config
  typescript-config/    # @repo/typescript-config
docs/                   # internal documentation (this folder)
```

## Common commands

```bash
pnpm dev           # run apps in dev mode
pnpm build         # build everything
pnpm lint          # lint everything
pnpm check-types   # type-check everything
```
