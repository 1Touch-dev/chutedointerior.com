import type { Metadata } from 'next';
import SectionArticles from '@/components/cms/SectionArticles';
import BrasileiraoBoard from '@/components/football/BrasileiraoBoard';
import { hasCapability } from '@/lib/capabilities';
import { siteConfig } from '@/lib/site-config';

export const revalidate = 120;

export const metadata: Metadata = {
  title: 'Partidas',
  description: `Brasileirão 2026, classificação e notas de partidas em ${siteConfig.siteName}`,
};

export default async function FutebolHubPage() {
  const sports = hasCapability('live-scores');

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-8">
      <header className="space-y-2">
        <h1 className="font-display text-4xl uppercase tracking-wide text-secondary md:text-5xl">Partidas</h1>
        <p className="text-sm text-muted">Brasileirão Série A · temporada 2026</p>
      </header>
      {sports ? <BrasileiraoBoard /> : null}
      <SectionArticles endpoint="Partidas" heading="Notas" />
    </div>
  );
}
