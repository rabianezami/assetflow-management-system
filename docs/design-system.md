# AssetFlow Design System

Practical reference for building UI in `apps/web`. The codebase is the source of truth, there is no separate Figma file.

**Palette:** Indigo + slate (enterprise SaaS)  
**Themes:** Light and dark (class-based `.dark` on `<html>`)  
**Locales:** English (LTR), Persian and Pashto (RTL)

---

## Token layers

Tokens live in `apps/web/src/styles/tokens/` and are imported via `globals.css`.

```
brand.css      → swappable brand identity
semantic.css   → surfaces, text, borders, status colors
component.css  → layout dimensions (sidebar, header, spacing)
shadcn.css     → maps semantic tokens to shadcn names (bg-primary, etc.)
```

### How to use tokens in components

| Do | Don't |
|----|-------|
| `bg-background`, `text-foreground`, `border-border` | `bg-[#4F46E5]`, `text-gray-500` |
| `bg-status-active-bg text-status-active` | `bg-green-100 text-green-700` |
| `px-[var(--page-padding-x)]` | arbitrary one-off spacing |

**Rebrand:** change `--brand-hue` in `brand.css` (default `264` = indigo). Light/dark overrides in the same file follow automatically.

### Brand tokens (`brand.css`)

| Token | Purpose |
|-------|---------|
| `--brand-hue` | Single knob to shift the whole palette |
| `--brand-primary` | Primary actions, active nav |
| `--brand-primary-hover` | Primary hover state |
| `--brand-primary-foreground` | Text on primary surfaces |
| `--brand-accent` | Focus rings, links |
| `--brand-secondary` | Secondary buttons / subtle fills |

### Semantic tokens (`semantic.css`)

**Surfaces**

| Token | Use |
|-------|-----|
| `--surface-page` | Page background |
| `--surface-elevated` | Cards, sidebar, popovers |
| `--surface-sunken` | Muted areas, table hover |
| `--surface-overlay` | Backdrop overlays |

**Text**

| Token | Use |
|-------|-----|
| `--text-primary` | Headings, body |
| `--text-secondary` | Descriptions, labels |
| `--text-tertiary` | Captions, placeholders |
| `--text-inverse` | Text on dark/inverted surfaces |

**Borders**

| Token | Use |
|-------|-----|
| `--border-default` | Cards, inputs, dividers |
| `--border-strong` | Emphasized separators |
| `--border-focus` | Focus state (uses brand accent) |

**Status** (each has a foreground + background pair)

| Token | Meaning |
|-------|---------|
| `--status-active` | Asset in use / healthy |
| `--status-assigned` | Checked out to someone |
| `--status-maintenance` | Under repair |
| `--status-retired` | Decommissioned |
| `--status-error` | Lost, failed, destructive |

Tailwind utilities: `bg-status-active-bg`, `text-status-active`, etc. (registered in `globals.css` `@theme`).

### Component layout tokens (`component.css`)

| Token | Value | Use |
|-------|-------|-----|
| `--sidebar-width` | 16rem | Expanded sidebar |
| `--sidebar-width-collapsed` | 4rem | Icon-only sidebar |
| `--header-height` | 3.5rem | App header |
| `--content-max-width` | 80rem | Page content cap |
| `--page-padding-x` | 1.5rem | Horizontal page padding |
| `--page-padding-y` | 1.5rem | Vertical page padding |
| `--radius` | 0.625rem | Base border radius |

Derived radius utilities: `rounded-sm` through `rounded-4xl` (via `@theme`).

### shadcn bridge (`shadcn.css`)

Maps semantic/brand tokens to shadcn CSS variables (`--primary`, `--background`, `--sidebar-*`, etc.). **Prefer shadcn class names in components** — they stay stable if the palette changes.

---

## Typography

Defined in `apps/web/src/styles/typography.css` as Tailwind `@utility` classes.

### Fonts

| Locale | Font stack |
|--------|------------|
| English (`en`) | Geist Sans + Geist Mono |
| Persian / Pashto (`fa`, `ps`) | Vazirmatn + Noto Sans Arabic + Geist Mono |

Font switching is handled in `app/[locale]/layout.tsx` via `--font-sans`.

### Type scale

| Class | Size | Use |
|-------|------|-----|
| `text-display` | 36px / semibold | Marketing hero (rare in app) |
| `text-heading-lg` | 30px / semibold | Page titles |
| `text-heading-md` | 24px / semibold | Section headers |
| `text-heading-sm` | 20px / semibold | Card titles, empty states |
| `text-body-lg` | 18px | Lead paragraphs |
| `text-body` | 16px | Default body |
| `text-body-sm` | 14px | Nav items, table cells |
| `text-caption` | 12px / medium | Badges, metadata |
| `text-label` | 14px / medium | Form labels, sidebar brand |

Add `font-heading` on titles for consistent heading weight.

### Rules

- One `text-heading-lg` per page (via `PageHeader`).
- Use `tabular-nums` for KPIs and numeric columns.
- Stick to the scale — no arbitrary `text-[13px]`.

---

## Spacing & layout patterns

Use Tailwind's 4px scale (`1` = 4px). Common values:

| Context | Spacing |
|---------|---------|
| Between page sections | `gap-8` |
| Inside cards | `gap-4`, `p-6` |
| Button groups | `gap-2` |
| Form fields | `gap-4` |
| Page content | `px-[var(--page-padding-x)] py-[var(--page-padding-y)]` |

### App shell

```
AppShell
├── AppSidebar          (sticky, border-e, collapsible)
├── AppHeader           (sticky, locale + theme actions)
└── main                (scrollable content area)
```

Route groups wire the shell:

| Group | Layout | Example |
|-------|--------|---------|
| `(dashboard)` | `AppShell` | `/dashboard` |
| `(auth)` | Centered, no sidebar | `/login` |
| `(marketing)` | Public, no sidebar | `/` |
| `(admin)` | Admin shell (stub) | `/admin` |

### Page content wrapper

```tsx
<div className="mx-auto flex w-full max-w-[var(--content-max-width)] flex-col gap-8">
  {/* PageHeader + content */}
</div>
```

### Standard page templates

| Template | Composition |
|----------|---------------|
| **List page** | `PageHeader` → filter bar → table → pagination |
| **Detail page** | `PageHeader` → tabs → info cards |
| **Form page** | `PageHeader` → form card → footer actions |
| **Dashboard** | `PageHeader` → stat grid → charts → recent table |
| **Empty / new user** | `PageHeader` → `EmptyState` with CTA |

Reference implementation: `app/[locale]/(dashboard)/dashboard/page.tsx`.

---

## Component architecture

Three tiers - compose downward, never skip a tier.

```
features/          Domain UI (AssetTable, AssetForm)
    ↓
components/common/ App patterns (PageHeader, StatusBadge)
    ↓
components/ui/     shadcn primitives (Button, Input, Dialog)
```

| Tier | Location | Rules |
|------|----------|-------|
| **ui** | `components/ui/` | shadcn output only. No business logic, no API calls. Add via `npx shadcn add <name> --rtl`. |
| **common** | `components/common/` | Reusable across features. Composes `ui/`. |
| **layout** | `components/layout/` | App shell, providers, header, sidebar. |
| **features** | `features/<domain>/` | Domain-specific. May import common + ui. |

Shared UI also lives in `packages/ui/` for monorepo reuse (e.g. `Card`).

### Existing common components

| Component | File | Purpose |
|-----------|------|---------|
| `PageHeader` | `common/page-header.tsx` | Title + description + action slot |
| `EmptyState` | `common/empty-state.tsx` | Icon + message + CTA |
| `StatusBadge` | `common/status-badge.tsx` | Asset status pill (`active`, `assigned`, `maintenance`, `retired`, `error`) |
| `LocaleSwitcher` | `common/locale-switcher.tsx` | Language dropdown (en / fa / ps) |
| `ThemeToggle` | `common/theme-toggle.tsx` | Light / dark switch |
| `DirectionalIcon` | `common/directional-icon.tsx` | Mirrors directional icons in RTL |

### StatusBadge usage

```tsx
<StatusBadge status="active" label={t("status.active")} />
```

Labels come from i18n — never hardcode status text.

### i18n rule

No user-facing strings in components. Use `useTranslations` (client) or `getTranslations` (server). Navigation via `@/i18n/navigation` (`Link`, `useRouter`, `usePathname`).

---

## RTL checklist

Persian (`fa`) and Pashto (`ps`) are RTL. English (`en`) is LTR. Direction is set on `<html dir="rtl|ltr">` in the locale layout.

### CSS - use logical properties

| Avoid | Use |
|-------|-----|
| `ml-4`, `mr-4` | `ms-4`, `me-4` |
| `pl-4`, `pr-4` | `ps-4`, `pe-4` |
| `left-0`, `right-0` | `start-0`, `end-0` |
| `text-left`, `text-right` | `text-start`, `text-end` |
| `border-l`, `border-r` | `border-s`, `border-e` |

### Layout - verify in `/fa` and `/ps`

| Area | Expected behavior |
|------|-------------------|
| **Sidebar** | Anchored to start (`border-e`), active item uses `border-s-2` |
| **Header actions** | Group aligned with `ms-auto` (end in LTR, start in RTL) |
| **Collapse chevron** | `DirectionalIcon` mirrors with `rtl:rotate-180` |
| **Nav links** | Use `@/i18n/navigation` `Link` — preserves locale in URL |
| **Dropdowns / popovers** | Prefer `align="start"`, not `align="left"` |
| **Tables** | Checkbox column at start; actions column at end |
| **Forms** | Labels above inputs (direction-agnostic) |
| **Charts** | Keep numeric axis LTR: wrap in `dir="ltr"` if needed |

### Icons that mirror

Use `DirectionalIcon` for: `ChevronLeft`, `ChevronRight`, `ArrowLeft`, `ArrowRight`, `ArrowBack`, etc.

Do **not** mirror symmetric icons: `Plus`, `X`, `Search`, `Settings`, `LayoutDashboard`.

### shadcn CLI

`components.json` has `"rtl": true`. Always add components with:

```bash
npx shadcn add <component> --rtl
```

### Accessibility

- `<html lang={locale} dir={direction}>`  always set (done in locale layout).
- Icon-only buttons: `aria-label` from i18n.
- Decorative icons: `aria-hidden="true"`.
- Nav: `aria-label`, `aria-current="page"` on active link (see `AppSidebar`).
- Don't remove focus rings from shadcn components.

---

## Quick reference - file map

```
apps/web/src/
├── app/globals.css              Entry point — imports all tokens
├── styles/
│   ├── tokens/
│   │   ├── brand.css
│   │   ├── semantic.css
│   │   ├── component.css
│   │   └── shadcn.css
│   └── typography.css
├── components/
│   ├── ui/                      shadcn primitives
│   ├── common/                  PageHeader, EmptyState, StatusBadge, …
│   └── layout/                  AppShell, AppSidebar, AppHeader
└── i18n/                        Locale config, routing, navigation
```

For architecture and commands, see [architecture.md](./architecture.md).
