import type { ReactNode } from 'react';
import AffiliateBanner from './AffiliateBanner';

/** The rail's containing block ends with the story, before related content. */
export default function ArticleAffiliateLayout({ children }: { children: ReactNode }) {
  return (
    <div className="article-affiliate-layout">
      <div className="min-w-0">{children}</div>
      <div className="article-affiliate-rail hidden lg:block" aria-label="Publicidade lateral">
        <div className="sticky top-28">
          <AffiliateBanner preset="vertical" />
        </div>
      </div>
    </div>
  );
}
