import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';
import { absoluteUrl, siteUrl } from '@/lib/site-url';

export interface IPageMetaInput {
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  image?: string;
  noIndex?: boolean;
}

export const pageMetadata = ({
  title,
  description,
  path,
  type = 'website',
  publishedTime,
  modifiedTime,
  image,
  noIndex,
}: IPageMetaInput): Metadata => {
  const url = absoluteUrl(path);
  const fullTitle = title.includes(siteConfig.siteName) ? title : `${title} | ${siteConfig.siteName}`;
  const ogImage = image || siteConfig.seo.defaultOgImage;

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: url,
      languages: { 'pt-BR': url, 'x-default': url },
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.siteName,
      locale: 'pt_BR',
      type,
      publishedTime,
      modifiedTime,
      images: [{ url: ogImage.startsWith('http') ? ogImage : absoluteUrl(ogImage) }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage.startsWith('http') ? ogImage : absoluteUrl(ogImage)],
    },
  };
};

export const organizationJsonLd = () => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      name: siteConfig.siteName,
      url: siteUrl,
      description: siteConfig.description,
      inLanguage: 'pt-BR',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/busca?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'NewsMediaOrganization',
      name: siteConfig.siteName,
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/icon'),
        width: 32,
        height: 32,
      },
      publishingPrinciples: absoluteUrl('/about'),
      areaServed: { '@type': 'Country', name: 'Brasil' },
    },
  ],
});

export const newsArticleJsonLd = (article: {
  title: string;
  excerpt: string;
  slug: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  imageUrl?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'NewsArticle',
  headline: article.title,
  description: article.excerpt,
  datePublished: article.publishedAt,
  dateModified: article.updatedAt || article.publishedAt,
  inLanguage: 'pt-BR',
  author: { '@type': 'Person', name: article.author },
  publisher: {
    '@type': 'NewsMediaOrganization',
    name: siteConfig.siteName,
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/icon'),
      width: 32,
      height: 32,
    },
  },
  image: article.imageUrl ? [article.imageUrl] : [absoluteUrl(siteConfig.seo.defaultOgImage)],
  mainEntityOfPage: absoluteUrl(`/artigo/${article.slug}`),
});

export const breadcrumbJsonLd = (items: Array<{ name: string; path?: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    ...(item.path ? { item: absoluteUrl(item.path) } : {}),
  })),
});
