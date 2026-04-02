# UI Diff Report - Full UI Rework v3

## What changed visually and why

### 1. Storefront
- Home rebuilt into high-contrast commerce rhythm: strong hero, compressed trust, direct CTA path.
- Catalog filters and controls simplified for faster scan and lower visual noise.
- PDP purchase rail strengthened (price, stock, CTA, trust copy in one focused block).
- Cart and checkout preserve quick flow with clearer hierarchy and instant feedback states.

### 2. Account
- Account now uses the same visual language as storefront/admin.
- Added hero status block, metric cards, and clean key-value profile section.
- Reduced raw-data feel, increased readability and confidence.

### 3. Admin
- Full UTF-8 text cleanup (removed mojibake).
- Unified panel system: consistent headers, table wrappers, status pills, KPI rhythm.
- Stronger action focus with less decorative clutter.

### 4. Design system
- Unified `mono + emerald` token direction in `globals.css`.
- Standardized control states: default, hover, active, focus, disabled, pending, done, failed.
- Consistent tactile feedback and reduced-noise motion behavior.

### 5. Media and assets
- Product media mapped to final uploaded images (`card/hero/gallery`) with fallback support.
- Added app icon (`/icon.svg`) and wired metadata icons to remove favicon 404 noise.

## Changed pages/components
- Home: `/`
- Catalog: `/catalog`
- PDP: `/catalog/[slug]`
- Cart: `/cart`
- Checkout: `/checkout`
- Account: `/account`
- Admin: `/admin`, `/admin/billing`, `/admin/health`, `/admin/nodes`
- Global style system: `src/app/globals.css`
- Header metadata/icon: `src/app/layout.tsx`, `public/icon.svg`

## UX principle enforced
- Simplicity, speed, predictability.
