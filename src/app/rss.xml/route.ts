import { getLatestArticles } from '@/lib/cms-client';
import { siteConfig } from '@/lib/site-config';
import { absoluteUrl, siteUrl } from '@/lib/site-url';
import { escapeXml } from '@/lib/xml';

export const revalidate = 300;

export const GET = async () => {
  const articles = await getLatestArticles(40);
  const items = articles
    .map((article) => {
      const link = absoluteUrl(`/artigo/${article.slug}`);
      return `<item>
        <title>${escapeXml(article.title)}</title>
        <link>${link}</link>
        <guid isPermaLink="true">${link}</guid>
        <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
        <description>${escapeXml(article.excerpt || '')}</description>
        ${article.category ? `<category>${escapeXml(article.category)}</category>` : ''}
      </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>${escapeXml(siteConfig.siteName)}</title>
      <link>${siteUrl}</link>
      <description>${escapeXml(siteConfig.description)}</description>
      <language>pt-BR</language>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      ${items}
    </channel>
  </rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=1800',
    },
  });
};
