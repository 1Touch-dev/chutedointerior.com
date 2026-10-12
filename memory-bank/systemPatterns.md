# System patterns

## Layout

Root `layout.tsx` → ChromeHost + Footer + GA. Homepage: `HomeLayout` = `EditorialBanner` → `FootballHome` → `RecipeHome`.

## Data

- Articles: `cms-client` → `/ai-articles` (`publishState === published`, `scheduledBefore` minute-bucketed).
- Football: `football-desk` → `/football/brazil/league/{slug}` + fixtures next/last/live. Live preferred in `upcoming` / `nextMatch`.
- Banners: `banners` → `/banners/public/{websiteKey}`; render via `HtmlBannerFrame` + `prepareBannerHtml` (sanitize + same-site link rewrite).

## UI patterns

- `BANNER_FRAME_CLASS` + `BANNER_FIT_STYLE` for clipped hero iframe (no `allow-scripts` / `allow-same-origin`).
- Desk strips reuse `desk-view` (`FeaturedMatch`, `MatchList`, `StandingsBoard`, `Crest`).
- Types for football payloads use `I` prefix (`IFootballMatch`, `IEditorialBanner`).

## Sibling desks

Patterns borrowed from boladoreconcavo (placar strips) and raquetedesaibro (single auto-fit banner) — do not copy their brands/memory banks.
