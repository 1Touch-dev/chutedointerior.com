export type CmsSection = {
  endpoint: string;
  slug: string;
  href: string;
  label: string;
};

/** Exact CMS endpoint names. Tabela de posições is an article section, not the points table. */
export const cmsSections: CmsSection[] = [
  { endpoint: 'Série C', slug: 'serie-c', href: '/serie-c', label: 'Série C' },
  {
    endpoint: 'Histórias regionais',
    slug: 'historias-regionais',
    href: '/historias-regionais',
    label: 'Histórias regionais',
  },
  { endpoint: 'Base e amador', slug: 'base-e-amador', href: '/base-e-amador', label: 'Base e amador' },
  { endpoint: 'Série B', slug: 'serie-b', href: '/serie-b', label: 'Série B' },
  { endpoint: 'Brasileirão', slug: 'brasileirao', href: '/brasileirao', label: 'Brasileirão' },
  { endpoint: 'Copa do Brasil', slug: 'copa-do-brasil', href: '/copa-do-brasil', label: 'Copa do Brasil' },
  { endpoint: 'Libertadores', slug: 'libertadores', href: '/libertadores', label: 'Libertadores' },
  { endpoint: 'Seleção', slug: 'selecao', href: '/selecao', label: 'Seleção' },
  { endpoint: 'Estados', slug: 'estados', href: '/estados', label: 'Estados' },
  { endpoint: 'Calendário', slug: 'calendario', href: '/calendario', label: 'Calendário' },
  {
    endpoint: 'Tabela de posições',
    slug: 'tabela-de-posicoes',
    href: '/tabela-de-posicoes',
    label: 'Tabela de posições',
  },
  { endpoint: 'Transferências', slug: 'transferencias', href: '/transferencias', label: 'Transferências' },
  { endpoint: 'Partidas', slug: 'partidas', href: '/futebol', label: 'Partidas' },
  { endpoint: 'Clubes', slug: 'clubes', href: '/clubes', label: 'Clubes' },
  { endpoint: 'Jogadores', slug: 'jogadores', href: '/jogadores', label: 'Jogadores' },
  { endpoint: 'Notícias', slug: 'noticias', href: '/ultimas', label: 'Notícias' },
  { endpoint: 'Other', slug: 'outras', href: '/outras', label: 'Outras' },
];

export const cmsSectionBySlug = (slug: string) => cmsSections.find((section) => section.slug === slug);

export const cmsSectionByEndpoint = (endpoint: string) =>
  cmsSections.find((section) => section.endpoint === endpoint);
