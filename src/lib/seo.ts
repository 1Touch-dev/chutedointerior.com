import { getArticlesByEndpoint, type Article } from '@/lib/cms-client';
import { siteConfig } from '@/lib/site-config';

export const siteUrl = (siteConfig.seo.canonicalHost || `https://${siteConfig.cms.websiteKey}`).replace(/\/$/, '');

export const xmlEscape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const absoluteUrl = (path: string) => `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;

export async function publishedArticles(): Promise<Article[]> {
  const pageSize = 50;
  const seen = new Set<string>();
  const articles: Article[] = [];

  for (let page = 1; page <= 8; page += 1) {
    const batch = await getArticlesByEndpoint('HomePage', pageSize, page);
    let added = 0;
    for (const article of batch) {
      if (!article.slug || seen.has(article.slug)) continue;
      seen.add(article.slug);
      articles.push(article);
      added += 1;
    }
    if (added === 0) break;
  }

  return articles;
}
