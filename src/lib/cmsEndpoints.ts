/**
 * Exact CMS `endpoint` query values from Postman
 * "Brazil CMS — desk sites" → Chute do Interior.
 *
 * Shared list shape:
 * GET /ai-articles?targetWebsite=chutedointerior.com&endpoint={name}&limit=20&page=1&sort=createdAt&order=desc
 * (HomePage uses limit=12.)
 *
 * Article by slug:
 * GET /ai-articles/slug/{{articleSlug}}?targetWebsite=chutedointerior.com
 */

export const HOME_ARTICLE_ENDPOINT = 'HomePage';

export const HOME_ARTICLE_LIMIT = 12;

/** Desk section feeds (excludes HomePage + article-by-slug). */
export const DESK_ARTICLE_ENDPOINTS = [
  'Série C',
  'Histórias regionais',
  'Base e amador',
  'Série B',
  'Brasileirão',
  'Copa do Brasil',
  'Libertadores',
  'Seleção',
  'Estados',
  'Calendário',
  'Tabela de posições',
  'Transferências',
  'Partidas',
  'Clubes',
  'Jogadores',
  'Notícias',
  'Other',
] as const;

export type DeskArticleEndpoint = (typeof DESK_ARTICLE_ENDPOINTS)[number];

export const ALL_ARTICLE_ENDPOINTS = [
  HOME_ARTICLE_ENDPOINT,
  ...DESK_ARTICLE_ENDPOINTS,
] as const;

export type ArticleEndpoint = (typeof ALL_ARTICLE_ENDPOINTS)[number];

/** CMS noise labels that should not drive HomePage or section matching alone. */
export const isNoiseAssignment = (name: string) => {
  const key = name.trim().toLowerCase();
  return key === 'league' || key === 'other';
};

export const namesIncludeEndpoint = (names: string[], endpoint: string) => {
  const target = endpoint.trim().toLowerCase();
  if (!target) return false;
  return names.some((name) => name.trim().toLowerCase() === target);
};
