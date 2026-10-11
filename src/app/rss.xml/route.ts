import { absoluteUrl, publishedArticles, siteUrl, xmlEscape } from '@/lib/seo';
import { siteConfig } from '@/lib/site-config';

export const revalidate = 900;

export async function GET() {
  const articles = await publishedArticles();
  const items = articles
    .slice(0, 40)
    .map((article) => {
      const link = absoluteUrl(`/noticia/${article.slug}`);
      const published = Date.parse(article.publishedAt);
      const pubDate = Number.isNaN(published) ? new Date().toUTCString() : new Date(published).toUTCString();
      const description = article.excerpt || article.title;
      return `<item>
        <title>${xmlEscape(article.title)}</title>
        <link>${xmlEscape(link)}</link>
        <guid isPermaLink="true">${xmlEscape(link)}</guid>
        <pubDate>${xmlEscape(pubDate)}</pubDate>
        <description>${xmlEscape(description)}</description>
      </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${xmlEscape(siteConfig.siteName)}</title>
    <link>${xmlEscape(siteUrl)}</link>
    <description>${xmlEscape(siteConfig.description)}</description>
    <language>${xmlEscape(siteConfig.locale.dialect)}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=900',
    },
  });
}
