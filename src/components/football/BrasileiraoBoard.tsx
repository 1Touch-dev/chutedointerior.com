import { FeaturedMatch, ScorerTable, StandingsBoard, TeamGrid } from '@/components/football/desk-view';
import MatchTabs from '@/components/football/MatchTabs';
import { getFootballDesk } from '@/lib/football-desk';

export default async function BrasileiraoBoard({ compact = false }: { compact?: boolean }) {
  const desk = await getFootballDesk();
  const featured = desk?.nextMatch ?? desk?.completed[0] ?? null;
  const kind = desk?.nextMatch ? (desk.nextMatch.status === 'live' ? 'live' : 'next') : 'last';

  if (!desk) {
    return (
      <p className="rounded-xl border border-black/10 bg-white px-4 py-8 text-sm text-muted">
        A classificação e os jogos do Brasileirão não estão disponíveis agora.
      </p>
    );
  }

  return (
    <div className="grid gap-4">
      {featured ? <FeaturedMatch match={featured} kind={kind} leagueName={desk.leagueName} /> : null}
      <MatchTabs upcoming={desk.upcoming} completed={desk.completed} />
      <StandingsBoard rows={desk.standings} limit={compact ? 8 : undefined} />
      {compact ? null : <TeamGrid teams={desk.teams} />}
      <div className="grid gap-4 lg:grid-cols-2">
        <ScorerTable title="Artilheiros" rows={desk.scorers} metric="goals" limit={compact ? 5 : undefined} />
        <ScorerTable title="Assistências" rows={desk.assists} metric="assists" limit={compact ? 5 : undefined} />
      </div>
    </div>
  );
}
