import Link from 'next/link';
import {
  Crest,
  FeaturedMatch,
  MatchList,
  StandingsBoard,
} from '@/components/football/desk-view';
import { hasCapability } from '@/lib/capabilities';
import { getFootballDesk, type IFootballMatch } from '@/lib/football-desk';

function scoreOf(match: IFootballMatch) {
  if (match.status === 'upcoming' || match.home.score == null || match.away.score == null) {
    return null;
  }
  return `${match.home.score}–${match.away.score}`;
}

function TickerChip({ match }: { match: IFootballMatch }) {
  const score = scoreOf(match);
  const live = match.status === 'live';

  return (
    <Link
      href={`/jogos/${match.id}`}
      className="flex min-w-[12.5rem] shrink-0 flex-col justify-center gap-2 border-r border-white/10 px-4 py-3.5 sm:min-w-[14rem] sm:px-5 sm:py-4"
    >
      <p
        className={`text-[10px] font-bold uppercase tracking-[0.14em] ${
          live ? 'text-accent' : 'text-white/50'
        }`}
      >
        {live ? (
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent motion-reduce:animate-none" />
            {match.elapsed ? `${match.elapsed}'` : 'Ao vivo'}
          </span>
        ) : (
          match.round || match.statusLabel
        )}
      </p>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2.5">
          <Crest src={match.home.logo} name={match.home.name} size={24} />
          <span className="truncate text-[13px] font-semibold text-white sm:text-sm">{match.home.name}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Crest src={match.away.logo} name={match.away.name} size={24} />
          <span className="truncate text-[13px] font-semibold text-white sm:text-sm">{match.away.name}</span>
        </div>
      </div>
      <p className="font-display text-2xl tabular-nums tracking-tight text-white sm:text-[1.75rem]">
        {score || (live ? '×' : match.kickoffLabel?.split('·').pop()?.trim() || 'vs')}
      </p>
    </Link>
  );
}

/**
 * Homepage desk — placar ticker → featured → resultados/marcados → tabela peek.
 */
export default async function FootballHome() {
  if (!hasCapability('live-scores')) return null;
  const desk = await getFootballDesk('brasileirao');
  if (!desk) return null;

  const live = desk.upcoming.filter((m) => m.status === 'live');
  const soon = desk.upcoming.filter((m) => m.status !== 'live').slice(0, 4);
  const ticker = [...live, ...soon, ...desk.completed.slice(0, 5)].slice(0, 10);

  const featured = desk.nextMatch ?? desk.completed[0] ?? null;
  const featuredKind =
    featured?.status === 'live' ? 'live' : desk.nextMatch ? 'next' : 'last';

  const results = desk.completed.slice(0, 6);
  const marked = desk.upcoming.slice(0, 6);

  return (
    <section className="min-w-0 border-b border-black/10 bg-surface" aria-label="Brasileirão">
      {ticker.length > 0 ? (
        <div className="bg-secondary text-white">
          <div className="mx-auto flex max-w-7xl items-stretch">
            <p className="hidden shrink-0 items-center bg-primary px-4 text-[11px] font-bold uppercase tracking-[0.18em] sm:flex">
              Placar
            </p>
            <div
              role="list"
              aria-label="Placar recente"
              className="flex min-w-0 flex-1 overflow-x-auto overscroll-x-contain scrollbar-hide touch-pan-x [-webkit-overflow-scrolling:touch]"
            >
              {ticker.map((match) => (
                <div key={`tick-${match.id}`} role="listitem">
                  <TickerChip match={match} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <div className="mx-auto min-w-0 max-w-7xl space-y-5 px-4 py-6 sm:space-y-6 sm:py-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">{desk.leagueName}</p>
            <h2 className="font-display text-3xl uppercase tracking-wide text-secondary sm:text-4xl">
              Temporada {desk.season}
            </h2>
          </div>
          <Link
            href="/futebol"
            className="inline-flex shrink-0 items-center bg-primary px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-secondary"
          >
            Tabela completa
          </Link>
        </div>

        {featured ? (
          <FeaturedMatch match={featured} kind={featuredKind} leagueName={desk.leagueName} />
        ) : null}

        <div className="grid min-w-0 gap-4 lg:grid-cols-2">
          <section className="min-w-0 rounded-xl border border-black/10 bg-white p-4 sm:p-5">
            <div className="mb-1 flex items-end justify-between gap-3">
              <h3 className="font-display text-2xl uppercase tracking-wide text-secondary">Resultados</h3>
              <Link href="/futebol" className="text-[11px] font-bold uppercase tracking-wide text-primary hover:underline">
                Ver todos
              </Link>
            </div>
            <MatchList matches={results} empty="Sem resultados recentes." />
          </section>

          <section className="min-w-0 rounded-xl border border-black/10 bg-white p-4 sm:p-5">
            <div className="mb-1 flex items-end justify-between gap-3">
              <h3 className="font-display text-2xl uppercase tracking-wide text-secondary">Marcados</h3>
              <Link href="/ao-vivo" className="text-[11px] font-bold uppercase tracking-wide text-primary hover:underline">
                Ao vivo
              </Link>
            </div>
            <MatchList matches={marked} empty="Sem jogos marcados." />
          </section>
        </div>

        {desk.standings.length > 0 ? <StandingsBoard rows={desk.standings} limit={10} /> : null}
      </div>
    </section>
  );
}
