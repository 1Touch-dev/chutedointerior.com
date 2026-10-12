# Active context

## Current focus

SEO/GEO/CWV production pack shipped: dynamic sitemap, news-sitemap, robots AI allowlist, llms.txt, RSS, manifest, IndexNow, NewsArticle/Org JSON-LD, next/font, partner ad CLS slots.

## Recent

- Homepage: single `HtmlBannerFrame` (sanitized CMS HTML, no scrollbars) → live-first Placar → FeaturedMatch → Resultados/Marcados → Standings peek → RecipeHome.
- Articles: `publishState === published` only; `scheduledBefore` floored to UTC minute for cache hits; sort `scheduledTime`.
- Football desk: live preferred in `upcoming` / `nextMatch`; ticker live → soon → FT.
- Favicon: `/favicon.ico` rewrite → `/icon`; GA4 `G-75GY5TF4BC`.
- Memory bank was wrongly filled with raizdeitaquera content — rewritten for this site.

## Next

- Keep partner banners empty-safe if `/partnerships/banners` returns none.
- Watch `.next` corruption in long `yarn dev` sessions (`entryCSSFiles`) — clear `.next` if 500 on `[secao]`.
- Optional: static real `.ico` if crawlers need it beyond PNG rewrite.
