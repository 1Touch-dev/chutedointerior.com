import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleLayout from '@/components/article/ArticleLayout';
import { getArticleBySlug, getByCategory } from '@/lib/cms-client';
import { cmsSectionBySlug } from '@/lib/sections';
import { absoluteUrl, siteUrl } from '@/lib/seo';
import { siteConfig } from '@/lib/site-config';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: 'Artigo não encontrado' };
  }

  const path = `/noticia/${article.slug}`;
  const description = article.excerpt || article.title;

  return {
    title: article.title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: article.title,
      description,
      type: 'article',
      locale: siteConfig.locale.dialect.replace('-', '_'),
      url: absoluteUrl(path),
      publishedTime: article.publishedAt,
      modifiedTime: article.publishedAt,
      images: article.imageUrl ? [{ url: article.imageUrl }] : [{ url: siteConfig.seo.defaultOgImage }],
    },
    twitter: { card: 'summary_large_image', title: article.title, description },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const related = (await getByCategory(article.categorySlug, 4))
    .filter((item) => item.slug !== article.slug)
    .slice(0, 3);
  const path = `/noticia/${article.slug}`;
  const section = cmsSectionBySlug(article.categorySlug);
  const sectionPath = section?.href || `/categoria/${article.categorySlug}`;
  const sectionName = section?.label || article.category;
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: article.title,
      description: article.excerpt || article.title,
      datePublished: article.publishedAt,
      dateModified: article.publishedAt,
      inLanguage: siteConfig.locale.dialect,
      mainEntityOfPage: absoluteUrl(path),
      author: { '@type': 'Person', name: article.author },
      publisher: { '@type': 'Organization', name: siteConfig.siteName, url: siteUrl },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: sectionName, item: absoluteUrl(sectionPath) },
        { '@type': 'ListItem', position: 3, name: article.title, item: absoluteUrl(path) },
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ArticleLayout article={article} related={related} />
    </>
  );
}
