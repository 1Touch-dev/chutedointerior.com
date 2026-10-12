import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BrasileiraoBoard from '@/components/football/BrasileiraoBoard';
import CompetitionTabs from '@/components/football/CompetitionTabs';
import { hasCapability } from '@/lib/capabilities';
import { getCompetitionBySlug } from '@/lib/competitions';
import { hasBrazilDeskLeague } from '@/lib/football-desk';
import { siteConfig } from '@/lib/site-config';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const competition = getCompetitionBySlug(slug);
  if (!competition) return { title: 'Liga' };
  return {
    title: competition.name,
    description: `${competition.name} — classificação, artilharia e próximos jogos em ${siteConfig.siteName}`,
  };
}

export default async function LigaPage({ params }: PageProps) {
  if (!hasCapability('live-scores')) notFound();
  const { slug } = await params;
  const competition = getCompetitionBySlug(slug);
  if (!competition || !hasBrazilDeskLeague(competition.slug)) notFound();

  return (
    <div className="mx-auto min-w-0 max-w-7xl space-y-5 px-4 py-6 sm:space-y-8 sm:py-8">
      <header className="space-y-3 sm:space-y-4">
        <h1 className="break-words font-display text-3xl uppercase tracking-wide text-secondary sm:text-4xl md:text-5xl">
          {competition.name}
        </h1>
        <p className="text-sm text-muted">Temporada {competition.season}</p>
        <CompetitionTabs activeSlug={competition.slug} />
      </header>
      <BrasileiraoBoard slug={competition.slug} />
    </div>
  );
}
