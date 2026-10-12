# Chute do Interior — project brief

`chutedointerior.com` is a Brazil football news desk: interior / lower-division coverage plus Brasileirão live scores.

Folder / domain: **chutedointerior.com**. Brand: **Chute do Interior**.

## Niche

O futebol que nasce longe dos holofotes — Série B/C, histórias regionais, base/amador, plus national pack (Brasileirão, Copa, Libertadores, Seleção).

## Brand

- Tagline: **O futebol que nasce longe dos holofotes**
- Language: pt-BR · timezone America/Sao_Paulo
- GA4: `G-75GY5TF4BC`
- Primary green `#0B3D2E` (site tokens via generated design CSS)

## Stack

Next.js 15.2 App Router, React 18, TypeScript, Tailwind 3, Yarn Classic. CMS: `https://api.chutedointerior.com/api`.

## Must-ship

- Homepage: editorial banner → football desk strips → recipe articles
- CMS articles (`/ai-articles`, published only) + `/artigo/[slug]`
- Brazil football desk: `/futebol`, `/ao-vivo`, `/jogos/[id]`, `/liga/[slug]`, `/times/[id]`
- Sections via `[secao]`, redirects `/noticias|noticia/:slug` → `/artigo/:slug`
