import EditorialBanner from '@/components/cms/EditorialBanner';
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
      <RecipeHome articles={articles} mostRead={mostRead} />
    </>
  );
}
