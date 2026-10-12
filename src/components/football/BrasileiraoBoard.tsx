import Link from 'next/link';
import { FeaturedMatch, ScorerTable, StandingsBoard, TeamGrid } from '@/components/football/desk-view';
import MatchTabs from '@/components/football/MatchTabs';
import { getFootballDesk } from '@/lib/football-desk';

export default async function BrasileiraoBoard({
  compact = false,
  slug = 'brasileirao',
  showHeaderLink = false,
}: {
  compact?: boolean;
  slug?: string;
  showHeaderLink?: boolean;
}) {
  const desk = await getFootballDesk(slug);
  const featured = desk?.nextMatch ?? desk?.completed[0] ?? null;
  const kind = desk?.nextMatch ? (desk.nextMatch.status === 'live' ? 'live' : 'next') : 'last';

  if (!desk) {
    return (
      <p className="rounded-xl border border-black/10 bg-white px-4 py-8 text-sm text-muted">
        A classificação e os jogos não estão disponíveis agora.
      </p>
    );
  }

  return (
    <div className="grid min-w-0 gap-3 sm:gap-4">
      {showHeaderLink ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">{desk.leagueName}</p>
            <h2 className="font-display text-2xl uppercase tracking-wide text-secondary sm:text-3xl">
              Temporada {desk.season}
            </h2>
          </div>
          <Link href="/futebol" className="shrink-0 text-sm font-semibold text-primary hover:underline">
            Tabela e times
          </Link>
        </div>
      ) : null}
      {featured ? <FeaturedMatch match={featured} kind={kind} leagueName={desk.leagueName} /> : null}
      <MatchTabs upcoming={desk.upcoming} completed={desk.completed} />
      {desk.standings.length > 0 ? (
        <StandingsBoard rows={desk.standings} limit={compact ? 8 : undefined} />
      ) : null}
      {compact ? null : <TeamGrid teams={desk.teams} />}
      <div className="grid min-w-0 gap-3 sm:gap-4 lg:grid-cols-2">
        <ScorerTable title="Artilheiros" rows={desk.scorers} metric="goals" limit={compact ? 5 : undefined} />
        <ScorerTable title="Assistências" rows={desk.assists} metric="assists" limit={compact ? 5 : undefined} />
      </div>
    </div>
  );
}
