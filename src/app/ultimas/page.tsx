import type { Metadata } from 'next';
import SectionArticles from '@/components/cms/SectionArticles';
import { siteConfig } from '@/lib/site-config';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Notícias',
  description: `Notícias de ${siteConfig.siteName}`,
};

export default function UltimasPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <header>
        <h1 className="font-display text-4xl uppercase tracking-wide text-secondary">Notícias</h1>
      </header>
      <SectionArticles endpoint="Notícias" />
    </div>
  );
}
