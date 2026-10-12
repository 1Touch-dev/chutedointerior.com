import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleLayout from '@/components/article/ArticleLayout';
import { getArticleBySlug, getByCategory } from '@/lib/cms-client';
import { breadcrumbJsonLd, newsArticleJsonLd, pageMetadata } from '@/lib/seo';
import { navHrefForSlug } from '@/lib/competitions';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return pageMetadata({
      title: 'Artigo não encontrado',
      description: 'Matéria indisponível',
      path: `/artigo/${slug}`,
      noIndex: true,
    });
  }

  return pageMetadata({
    title: article.title,
    description: article.excerpt || article.title,
    path: `/artigo/${article.slug}`,
    type: 'article',
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt || article.publishedAt,
    image: article.imageUrl,
  });
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const related = (await getByCategory(article.categorySlug, 4))
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  const jsonLd = [
    newsArticleJsonLd(article),
    breadcrumbJsonLd([
      { name: 'Início', path: '/' },
      { name: article.category, path: navHrefForSlug(article.categorySlug) },
      { name: article.title },
    ]),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleLayout article={article} related={related} />
    </>
  );
}
