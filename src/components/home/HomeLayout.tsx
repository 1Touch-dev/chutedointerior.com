import EditorialBanner from '@/components/cms/EditorialBanner';
import { EMPTY_NOTES } from '@/components/cms/SectionArticles';
import FootballHome from '@/components/football/FootballHome';
import RecipeHome from '@/components/home/RecipeHome';
import { getLatestArticles, getMostRead } from '@/lib/cms-client';

/**
 * Homepage rhythm from boladoreconcavo / raquetedesaibro desk sites:
 * destaque → placar strips → editorial recipe body.
 */
export default async function HomeLayout() {
  const [articles, mostRead] = await Promise.all([
    getLatestArticles(12),
    getMostRead(5),
  ]);

  return (
    <>
      <EditorialBanner />
      <FootballHome />
      {articles.length === 0 ? (
        <p className="mx-auto max-w-7xl px-4 py-10 text-sm text-muted">{EMPTY_NOTES}</p>
      ) : (
        <RecipeHome articles={articles} mostRead={mostRead} />
      )}
    </>
  );
}
