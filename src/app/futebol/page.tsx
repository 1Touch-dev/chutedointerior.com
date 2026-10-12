import type { Metadata } from 'next';
import SectionArticles from '@/components/cms/SectionArticles';
import BrasileiraoBoard from '@/components/football/BrasileiraoBoard';
import { hasCapability } from '@/lib/capabilities';
import { pageMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site-config';

export const revalidate = 30;

export const metadata: Metadata = pageMetadata({
  title: 'Partidas',
  description: `Brasileirão 2026, classificação e notas de partidas em ${siteConfig.siteName}`,
  path: '/futebol',
});

export default async function FutebolHubPage() {
  const sports = hasCapability('live-scores');

  return (
    <div className="mx-auto min-w-0 max-w-7xl space-y-6 px-4 py-6 sm:space-y-10 sm:py-8">
      <header className="space-y-2">
        <h1 className="font-display text-3xl uppercase tracking-wide text-secondary sm:text-4xl md:text-5xl">Partidas</h1>
        <p className="text-sm text-muted">Brasileirão Série A · temporada 2026</p>
      </header>
      {sports ? <BrasileiraoBoard /> : null}
      <SectionArticles endpoint="Partidas" heading="Notas" />
    </div>
  );
}
