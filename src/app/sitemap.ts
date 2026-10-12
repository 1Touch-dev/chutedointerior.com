import type { MetadataRoute } from 'next';
import { getAllPublishedArticles } from '@/lib/cms-client';
import { getCompetitions } from '@/lib/competitions';
import { notifyIndexNow } from '@/lib/indexnow';
import { cmsSections } from '@/lib/sections';
import { absoluteUrl } from '@/lib/site-url';
import { BRAZILIAN_STATES } from '@/data/brazilian-states';

export const revalidate = 300;

const entry = (
  path: string,
  lastModified: Date,
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'],
  priority: number
): MetadataRoute.Sitemap[number] => ({
  url: absoluteUrl(path),
  lastModified,
  changeFrequency,
  priority,
});

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getAllPublishedArticles();
  const newest = articles[0]?.updatedAt || articles[0]?.publishedAt;
  const contentStamp = newest ? new Date(newest) : new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    entry('/', contentStamp, 'hourly', 1),
    entry('/ultimas', contentStamp, 'hourly', 0.9),
    entry('/futebol', contentStamp, 'hourly', 0.9),
    entry('/ao-vivo', contentStamp, 'hourly', 0.85),
    entry('/categories', contentStamp, 'daily', 0.7),
    entry('/estados', contentStamp, 'weekly', 0.6),
    entry('/about', contentStamp, 'monthly', 0.4),
    entry('/contact', contentStamp, 'monthly', 0.4),
    entry('/news', contentStamp, 'daily', 0.5),
    entry('/noticias', contentStamp, 'daily', 0.5),
  ];

  const sections = cmsSections
    .filter((section) => section.href === `/${section.slug}`)
    .map((section) => entry(section.href, contentStamp, 'daily', 0.75));

  const ligas = getCompetitions().map((competition) =>
    entry(`/liga/${competition.slug}`, contentStamp, 'hourly', 0.8)
  );

  const estados = BRAZILIAN_STATES.map((state) =>
    entry(`/estados/${state.slug}`, contentStamp, 'weekly', 0.55)
  );

  const articleRoutes = articles.map((article) =>
    entry(
      `/artigo/${article.slug}`,
      new Date(article.updatedAt || article.publishedAt),
      'daily',
      0.8
    )
  );

  // Fire-and-forget IndexNow for freshest articles (production only).
  void notifyIndexNow(articleRoutes.slice(0, 40).map((row) => row.url));

  return [...staticRoutes, ...sections, ...ligas, ...estados, ...articleRoutes];
}
