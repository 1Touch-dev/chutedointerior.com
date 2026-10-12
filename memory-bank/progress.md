# Progress

## Works

- Home 200 with Placar, Resultados, Marcados, Tabela, latest CMS articles
- `/futebol`, `/ao-vivo`, `/ultimas`, `/historias-regionais`, `/artigo/[slug]`, `/favicon.ico`, `/icon`
- Brazil desk API season 2026 fixtures + standings
- Banner iframe clipped (overflow hidden, first slide only)
- Code-quality pass: isPublic harden, cache bucket, live match preference, banner sanitize/sandbox, frame class dedupe

## Left

- Broader a11y polish on ticker keyboard affordances
- Prune unused `next.config` remotePatterns noise when convenient
- Confirm Amplify deploy after next push

## Known

- Long `next dev` can corrupt CSS manifests → clear `.next`
- Editorial banner is CMS-controlled (may lag article feed)
- Partner `/partnerships/banners` often empty for this hostname
