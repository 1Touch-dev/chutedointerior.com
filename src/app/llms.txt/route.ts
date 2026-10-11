import { cmsSections } from '@/lib/sections';
import { absoluteUrl, publishedArticles } from '@/lib/seo';
import { siteConfig } from '@/lib/site-config';

export const revalidate = 900;

export async function GET() {
  const articles = await publishedArticles();
  const sections = cmsSections
    .filter((item, index, list) => item.href !== '/busca' && list.findIndex((entry) => entry.href === item.href) === index)
    .map((item) => `- [${item.label}](${absoluteUrl(item.href)})`)
    .join('\n');
  const notable = articles
    .slice(0, 6)
    .map((article) => `- [${article.title}](${absoluteUrl(`/noticia/${article.slug}`)})`)
    .join('\n');

  const body = `# ${siteConfig.siteName}

> ${siteConfig.description} Publicado em português do Brasil. Cobre Série B, Série C, histórias regionais, base, estados e o futebol fora dos grandes centros.

## Key Sections
${sections}

## Key/Notable Content
${notable || '- A capa lista as matérias publicadas mais recentes.'}
- [RSS](${absoluteUrl('/rss.xml')})

## About / Publisher Info
- Redação: ${siteConfig.siteName}
- [Sobre](${absoluteUrl('/about')})
- [Contato](${absoluteUrl('/contact')})
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=900',
    },
  });
}
