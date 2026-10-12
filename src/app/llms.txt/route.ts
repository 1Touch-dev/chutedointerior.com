import { getLatestArticles } from '@/lib/cms-client';
import { cmsSections } from '@/lib/sections';
import { siteConfig } from '@/lib/site-config';
import { absoluteUrl, siteUrl } from '@/lib/site-url';

export const revalidate = 3600;

export const GET = async () => {
  const sections = cmsSections
    .filter((section) => section.href === `/${section.slug}`)
    .slice(0, 12)
    .map((section) => `- ${section.label}: ${siteUrl}${section.href}`)
    .join('\n');

  const notable = (await getLatestArticles(6))
    .map((article) => `- ${article.title}: ${absoluteUrl(`/artigo/${article.slug}`)}`)
    .join('\n');

  const body = `# ${siteConfig.siteName}

> ${siteConfig.tagline}. Portal brasileiro de futebol do interior e divisões de acesso: Série B/C, histórias regionais, base e amador, com cobertura do Brasileirão, Copa do Brasil, Libertadores e Seleção. Publicado em português (pt-BR) por ${siteConfig.siteName}.

Name: ${siteConfig.siteName}
Domain: chutedointerior.com
Language: pt-BR
Country: Brasil
Audience: Torcedores e leitores do futebol brasileiro fora dos holofotes das grandes capitais
Vertical: Sports / News

## Key Sections
- Home: ${siteUrl}/
- Últimas: ${siteUrl}/ultimas
- Futebol / tabela: ${siteUrl}/futebol
- Ao vivo: ${siteUrl}/ao-vivo
- Estados: ${siteUrl}/estados
${sections}

## Key / Notable Content
${notable || '- A capa lista as matérias publicadas mais recentes.'}
- RSS: ${siteUrl}/rss.xml
- Google News sitemap: ${siteUrl}/news-sitemap.xml
- Sitemap: ${siteUrl}/sitemap.xml
- Brasileirão desk: ${siteUrl}/liga/brasileirao
- Série B desk: ${siteUrl}/liga/serie-b

## About / Publisher Info
- Sobre: ${siteUrl}/about
- Contato: ${siteUrl}/contact
- Publisher: ${siteConfig.siteName} (NewsMediaOrganization)
- Standards: artigos públicos apenas com publishState=published; FAQ e metadados editoriais via CMS
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
};
