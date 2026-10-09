import EditorialBanner from '@/components/cms/EditorialBanner';
import { EMPTY_NOTES } from '@/components/cms/SectionArticles';
import RecipeHome from '@/components/home/RecipeHome';
import { getLatestArticles, getMostRead } from '@/lib/cms-client';

/**
 * Brief-first homepage — RecipeHome only.
 * Slot composition comes from siteConfig.homepageRecipe (assembler).
 */
export default async function HomeLayout() {
  const [articles, mostRead] = await Promise.all([
    getLatestArticles(12),
    getMostRead(5),
  ]);

  return (
    <>
      <EditorialBanner />
      {articles.length === 0 ? (
        <p className="mx-auto max-w-7xl px-4 py-10 text-sm text-muted">{EMPTY_NOTES}</p>
      ) : (
        <RecipeHome articles={articles} mostRead={mostRead} />
      )}
    </>
  );
}
