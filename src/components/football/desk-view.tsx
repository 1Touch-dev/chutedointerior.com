import Link from 'next/link';
import type { IFootballMatch, IFootballTeamRef, IScorer, IStanding } from '@/lib/football-desk';

const signed = (value: number) => (value > 0 ? `+${value}` : String(value));

export function Crest({ src, name, size = 32 }: { src?: string; name: string; size?: number }) {
  if (!src) {
    return (
      <span
        className="inline-flex shrink-0 items-center justify-center rounded-full bg-black/10 text-[10px] font-bold uppercase text-secondary"
        style={{ width: size, height: size }}
      >
        {name.slice(0, 2)}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" width={size} height={size} className="shrink-0 object-contain" style={{ width: size, height: size }} />
  );
}

const scoreText = (match: IFootballMatch) => {
  if (match.status === 'upcoming' || match.home.score == null || match.away.score == null) return '–';
  return `${match.home.score}–${match.away.score}`;
};

export function MatchList({ matches, empty }: { matches: IFootballMatch[]; empty: string }) {
  if (!matches.length) return <p className="py-4 text-sm text-muted">{empty}</p>;
  return (
    <ul>
      {matches.map((match) => (
        <li key={match.id} className="border-t border-black/10">
          <Link href={`/jogos/${match.id}`} className="grid grid-cols-[1fr_auto] items-center gap-3 py-3">
            <span className="grid gap-1.5">
              <span className="flex items-center gap-2">
                <Crest src={match.home.logo} name={match.home.name} size={24} />
                <span className="truncate text-sm font-semibold text-secondary">{match.home.name}</span>
              </span>
              <span className="flex items-center gap-2">
                <Crest src={match.away.logo} name={match.away.name} size={24} />
                <span className="truncate text-sm font-semibold text-secondary">{match.away.name}</span>
              </span>
            </span>
            <span className="text-right">
              <span className={`block font-display text-xl ${match.status === 'live' ? 'text-primary' : 'text-secondary'}`}>
                {scoreText(match)}
              </span>
              <span className="mt-1 block text-[11px] font-bold uppercase text-muted">
                {match.status === 'live' && match.elapsed ? `${match.elapsed}'` : match.statusLabel}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function FeaturedMatch({
  match,
  kind,
  leagueName,
}: {
  match: IFootballMatch;
  kind: 'live' | 'next' | 'last';
  leagueName: string;
}) {
  const label = kind === 'live' ? (match.elapsed ? `Ao vivo · ${match.elapsed}'` : 'Ao vivo') : kind === 'next' ? 'Próximo jogo' : 'Último jogo';
  const score =
    match.status === 'upcoming' || match.home.score == null || match.away.score == null
      ? '×'
      : `${match.home.score} × ${match.away.score}`;

  return (
    <article className="rounded-xl border border-black/10 bg-white p-4 sm:p-5">
      <p className={`text-[11px] font-bold uppercase tracking-[0.16em] ${kind === 'live' ? 'text-primary' : 'text-primary'}`}>{label}</p>
      <p className="mt-1 text-sm text-muted">
        {leagueName}
        {match.round ? ` · ${match.round}` : ''}
      </p>
      <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <Link href={`/times/${match.home.id}`} className="flex flex-col items-center gap-2 text-center sm:flex-row sm:text-left">
          <Crest src={match.home.logo} name={match.home.name} size={48} />
          <span className="font-semibold text-secondary">{match.home.name}</span>
        </Link>
        <p className="font-display text-3xl text-secondary">{score}</p>
        <Link href={`/times/${match.away.id}`} className="flex flex-col items-center gap-2 text-center sm:flex-row-reverse sm:text-right">
          <Crest src={match.away.logo} name={match.away.name} size={48} />
          <span className="font-semibold text-secondary">{match.away.name}</span>
        </Link>
      </div>
      <p className="mt-4 text-sm text-muted">
        {match.kickoffLabel}
        {match.venue ? ` · ${match.venue}` : ''}
      </p>
      <Link href={`/jogos/${match.id}`} className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
        Ficha do jogo
      </Link>
    </article>
  );
}

export function StandingsBoard({ rows, limit }: { rows: IStanding[]; limit?: number }) {
  const visible = typeof limit === 'number' ? rows.slice(0, limit) : rows;
  return (
    <section className="rounded-xl border border-black/10 bg-white p-4 sm:p-5">
      <h3 className="font-display text-2xl uppercase tracking-wide text-secondary">Tabela</h3>
      {visible.length === 0 ? (
        <p className="py-4 text-sm text-muted">A classificação não chegou nesta leitura.</p>
      ) : (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-black/10 text-left text-[11px] font-bold uppercase tracking-wider text-muted">
                <th className="px-2 py-2">#</th>
                <th className="px-2 py-2">Time</th>
                <th className="px-2 py-2">J</th>
                <th className="hidden px-2 py-2 sm:table-cell">V</th>
                <th className="hidden px-2 py-2 sm:table-cell">E</th>
                <th className="hidden px-2 py-2 sm:table-cell">D</th>
                <th className="px-2 py-2">SG</th>
                <th className="px-2 py-2">Pts</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => (
                <tr key={row.teamId} className="border-b border-black/10">
                  <td className="px-2 py-2 text-muted">{row.rank}</td>
                  <td className="px-2 py-2">
                    <Link href={`/times/${row.teamId}`} className="flex items-center gap-2 font-semibold text-secondary">
                      <Crest src={row.logo} name={row.name} size={24} />
                      <span className="truncate">{row.name}</span>
                    </Link>
                  </td>
                  <td className="px-2 py-2">{row.played}</td>
                  <td className="hidden px-2 py-2 sm:table-cell">{row.win}</td>
                  <td className="hidden px-2 py-2 sm:table-cell">{row.draw}</td>
                  <td className="hidden px-2 py-2 sm:table-cell">{row.lose}</td>
                  <td className="px-2 py-2">{signed(row.goalsDiff)}</td>
                  <td className="px-2 py-2 font-bold">{row.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export function TeamGrid({ teams }: { teams: IFootballTeamRef[] }) {
  return (
    <section className="rounded-xl border border-black/10 bg-white p-4 sm:p-5">
      <h3 className="font-display text-2xl uppercase tracking-wide text-secondary">Clubes</h3>
      {teams.length === 0 ? (
        <p className="py-4 text-sm text-muted">Nenhum clube listado nesta leitura.</p>
      ) : (
        <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {teams.map((team) => (
            <li key={team.id}>
              <Link href={`/times/${team.id}`} className="flex items-center gap-2 rounded-lg border border-black/10 px-2 py-2 font-semibold text-secondary">
                <Crest src={team.logo} name={team.name} size={28} />
                <span className="truncate text-sm">{team.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function ScorerTable({
  title,
  rows,
  metric,
  limit,
}: {
  title: string;
  rows: IScorer[];
  metric: 'goals' | 'assists';
  limit?: number;
}) {
  const visible = typeof limit === 'number' ? rows.slice(0, limit) : rows;
  return (
    <section className="rounded-xl border border-black/10 bg-white p-4 sm:p-5">
      <h3 className="font-display text-2xl uppercase tracking-wide text-secondary">{title}</h3>
      {visible.length === 0 ? (
        <p className="py-4 text-sm text-muted">Sem números nesta leitura.</p>
      ) : (
        <ol className="mt-2">
          {visible.map((row, index) => (
            <li key={`${row.id}-${row.teamId}`} className="flex items-center gap-3 border-t border-black/10 py-2.5">
              <span className="w-5 text-sm text-muted">{index + 1}</span>
              <Crest src={row.photo} name={row.name} size={32} />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold text-secondary">{row.name}</span>
                {row.teamId ? (
                  <Link href={`/times/${row.teamId}`} className="block truncate text-xs text-primary">
                    {row.teamName}
                  </Link>
                ) : (
                  <span className="block truncate text-xs text-muted">{row.teamName}</span>
                )}
              </span>
              <span className="text-right font-display text-xl">{metric === 'goals' ? row.goals : row.assists}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
