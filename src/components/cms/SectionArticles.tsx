import ArticleCard from '@/components/cards/ArticleCard';
import { getArticlesByEndpoint } from '@/lib/cms-client';

export const EMPTY_NOTES = 'Sem notas nesta seção no momento.';

export default async function SectionArticles({
  endpoint,
  limit = 24,
  heading,
}: {
  endpoint: string;
  limit?: number;
  heading?: string;
}) {
  const articles = await getArticlesByEndpoint(endpoint, limit);

  return (
    <section className="space-y-4">
      {heading ? (
        <h2 className="font-display text-2xl uppercase tracking-wide text-secondary">{heading}</h2>
      ) : null}
      {articles.length === 0 ? (
        <p className="rounded-xl border border-black/10 bg-white px-4 py-8 text-sm text-muted">{EMPTY_NOTES}</p>
      ) : (
        <div className="divide-y divide-black/10 rounded border border-black/10 bg-white">
          {articles.map((article) => (
            <div key={article.id} className="px-4">
              <ArticleCard article={article} variant="horizontal" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
