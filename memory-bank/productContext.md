# Product context

## Why

Readers outside the big-club spotlight need scores, tables, and notes in one desk — not a generic national portal clone.

## How it works

1. CMS feeds articles + public editorial banners for `chutedointerior.com`.
2. Football desk pulls Brazil league pack + fixtures (next/last/live).
3. Homepage rhythm: destaque → Placar / Resultados / Marcados / Tabela → RecipeHome.
4. Full board stays on `/futebol` and liga routes.

## UX goals

- Mobile-first horizontal placar strips (boladore / raquete desk pattern).
- Single clipped HTML banner (no carousel doubles, no iframe scrollbars).
- Fresh data (~30s revalidate) without breaking Next fetch cache keys.
