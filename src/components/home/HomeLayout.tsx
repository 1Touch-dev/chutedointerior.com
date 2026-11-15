import EditorialBanner from '@/components/cms/EditorialBanner';
import AffiliatePlacement from '@/components/affiliate/AffiliatePlacement';
import { EMPTY_NOTES } from '@/components/cms/SectionArticles';
import FootballHome from '@/components/football/FootballHome';
import RecipeHome from '@/components/home/RecipeHome';
import { getLatestArticles, getMostRead } from '@/lib/cms-client';
import { HOME_ARTICLE_LIMIT } from '@/lib/cmsEndpoints';
import { siteConfig } from '@/lib/site-config';

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
      <header className="mx-auto max-w-7xl px-4 pt-6 sm:pt-8">
        <h1 className="font-display text-2xl uppercase tracking-wide text-secondary sm:text-3xl md:text-4xl">
          Futebol do Interior: Notícias, Clubes e Competições Regionais
        </h1>
        <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
          {siteConfig.tagline}
        </p>
      </header>
      <FootballHome />
      {articles.length === 0 ? (
        <p className="mx-auto max-w-7xl px-4 py-10 text-sm text-muted">{EMPTY_NOTES}</p>
      ) : (
        <RecipeHome articles={articles} mostRead={mostRead} />
      )}
    </>
  );
}
