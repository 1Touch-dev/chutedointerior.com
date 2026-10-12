# Tech context

## Stack

- Next.js `15.2.6` App Router, React 18, TypeScript
- Tailwind CSS v3 (`globals.css` + `generated/design-tokens.css`)
- `@next/third-parties` GoogleAnalytics
- Package manager: **Yarn Classic** (no npm / no `package-lock.json`)

## Scripts

- `yarn dev` · `yarn lint` · `yarn build` · `yarn type-check`
- `yarn precommit` → lint · Husky 9.1.7

## CMS / sports API

- Base: `NEXT_PUBLIC_CMS_URL` or `https://api.chutedointerior.com/api`
- Website key: `chutedointerior.com`
- Season default: `2026` (`DEFAULT_SPORTS_SEASON`)
- Fetch freshness: `revalidate: 30` on home/football/banners/articles

## Constraints

- Portuguese only (`pt-BR`)
- Prefer capability flags (`hasCapability`) over hardcoding features
- Avoid editing generated `site-config` by hand unless assembler regenerates
