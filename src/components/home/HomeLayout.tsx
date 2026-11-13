import EditorialBanner from '@/components/cms/EditorialBanner';
import AffiliatePlacement from '@/components/affiliate/AffiliatePlacement';
import { EMPTY_NOTES } from '@/components/cms/SectionArticles';
import FootballHome from '@/components/football/FootballHome';
import RecipeHome from '@/components/home/RecipeHome';
import { getLatestArticles, getMostRead } from '@/lib/cms-client';
import { HOME_ARTICLE_LIMIT } from '@/lib/cmsEndpoints';

/**
 * Homepage rhythm from boladoreconcavo / raquetedesaibro desk sites:
 * destaque → placar strips → editorial recipe body.
 * Articles come from Postman HomePage (limit=12, sort=createdAt).
 */
export default async function HomeLayout() {
  const [articles, mostRead] = await Promise.all([
    getLatestArticles(HOME_ARTICLE_LIMIT),
    getMostRead(5),
  ]);

  return (
    <>
      <EditorialBanner />
      <AffiliatePlacement />
      <FootballHome />
      {articles.length === 0 ? (
        <p className="mx-auto max-w-7xl px-4 py-10 text-sm text-muted">{EMPTY_NOTES}</p>
      ) : (
        <RecipeHome articles={articles} mostRead={mostRead} />
      )}
    </>
  );
}
