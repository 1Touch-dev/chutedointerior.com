import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Crest } from '@/components/football/desk-view';
import { getMatchPage } from '@/lib/football-desk';

export const revalidate = 120;

interface PageProps {
  params: Promise<{ id: string }>;
}

const readId = (value: string) => (/^\d+$/.test(value) ? Number(value) : null);

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const matchId = readId(id);
  const page = matchId == null ? null : await getMatchPage(matchId);
  if (!page) return { title: 'Jogo' };
  return { title: `${page.match.home.name} x ${page.match.away.name}` };
}

export default async function JogoPage({ params }: PageProps) {
  const { id } = await params;
  const matchId = readId(id);
  const page = matchId == null ? null : await getMatchPage(matchId);
  if (!page) notFound();
  const { match, events, lineups, stats } = page;
  const score =
    match.status === 'upcoming' || match.home.score == null || match.away.score == null
      ? '×'
      : `${match.home.score} × ${match.away.score}`;
  const goals = events.filter((event) => event.kind === 'goal');
  const cards = events.filter((event) => event.kind === 'card');

  return (
    <div className="mx-auto min-w-0 max-w-4xl space-y-3 px-4 py-6 sm:space-y-4 sm:py-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">{match.statusLabel}</p>
      <h1 className="break-words font-display text-2xl uppercase tracking-wide text-secondary sm:text-4xl">
        {match.home.name} x {match.away.name}
      </h1>
      <article className="min-w-0 rounded-xl border border-black/10 bg-white p-3 sm:p-5">
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1.5 sm:gap-3">
          <Link
            href={`/times/${match.home.id}`}
            className="flex min-w-0 flex-col items-center gap-1.5 text-center sm:flex-row sm:gap-2"
          >
            <Crest src={match.home.logo} name={match.home.name} size={44} />
            <span className="line-clamp-2 text-xs font-semibold leading-tight text-secondary sm:text-base">
              {match.home.name}
            </span>
          </Link>
          <p className="shrink-0 px-1 font-display text-2xl tabular-nums text-secondary sm:text-3xl">{score}</p>
          <Link
            href={`/times/${match.away.id}`}
            className="flex min-w-0 flex-col items-center gap-1.5 text-center sm:flex-row-reverse sm:gap-2 sm:text-right"
          >
            <Crest src={match.away.logo} name={match.away.name} size={44} />
            <span className="line-clamp-2 text-xs font-semibold leading-tight text-secondary sm:text-base">
              {match.away.name}
            </span>
          </Link>
        </div>
        <p className="mt-4 break-words text-sm text-muted">
          {match.kickoffLabel}
          {match.venue ? ` · ${match.venue}` : ''}
          {match.round ? ` · ${match.round}` : ''}
        </p>
      </article>
      <div className="grid min-w-0 gap-3 sm:gap-4 lg:grid-cols-2">
        <section className="min-w-0 rounded-xl border border-black/10 bg-white p-3 sm:p-4">
          <h2 className="font-display text-xl uppercase text-secondary sm:text-2xl">Gols</h2>
          {goals.length === 0 ? (
            <p className="py-4 text-sm text-muted">Nenhum gol registrado nesta ficha.</p>
          ) : (
            <ul className="mt-2">
              {goals.map((event, index) => (
                <li key={`${event.minute}-${event.player}-${index}`} className="border-t border-black/10 py-2 text-sm">
                  <span className="font-bold">{event.minute}</span> {event.player || event.teamName} · {event.detail}
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="min-w-0 rounded-xl border border-black/10 bg-white p-3 sm:p-4">
          <h2 className="font-display text-xl uppercase text-secondary sm:text-2xl">Cartões</h2>
          {cards.length === 0 ? (
            <p className="py-4 text-sm text-muted">Nenhum cartão registrado nesta ficha.</p>
          ) : (
            <ul className="mt-2">
              {cards.map((event, index) => (
                <li key={`${event.minute}-${event.player}-${index}`} className="border-t border-black/10 py-2 text-sm">
                  <span className="font-bold">{event.minute}</span> {event.player || event.teamName} · {event.detail}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
      {stats.length > 0 ? (
        <section className="min-w-0 rounded-xl border border-black/10 bg-white p-3 sm:p-4">
          <h2 className="font-display text-xl uppercase text-secondary sm:text-2xl">Estatísticas</h2>
          <div className="mt-3 grid min-w-0 gap-4 sm:grid-cols-2">
            {stats.map((group) => (
              <div key={group.teamName} className="min-w-0">
                <p className="mb-2 flex min-w-0 items-center gap-2 font-semibold text-secondary">
                  <Crest src={group.teamLogo} name={group.teamName} size={24} />
                  <span className="truncate">{group.teamName}</span>
                </p>
                <ul>
                  {group.items.slice(0, 12).map((item) => (
                    <li
                      key={`${group.teamName}-${item.type}`}
                      className="flex items-start justify-between gap-3 border-t border-black/10 py-1.5 text-sm"
                    >
                      <span className="min-w-0 break-words text-muted">{item.type}</span>
                      <span className="shrink-0 font-semibold text-secondary">{item.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ) : null}
      {lineups.length > 0 ? (
        <section className="min-w-0 rounded-xl border border-black/10 bg-white p-3 sm:p-4">
          <h2 className="font-display text-xl uppercase text-secondary sm:text-2xl">Escalação</h2>
          <div className="mt-3 grid min-w-0 gap-4 sm:grid-cols-2">
            {lineups.map((side) => (
              <div key={side.teamId} className="min-w-0">
                <p className="mb-2 flex min-w-0 flex-wrap items-center gap-2 font-semibold text-secondary">
                  <Crest src={side.teamLogo} name={side.teamName} size={24} />
                  <span className="truncate">{side.teamName}</span>
                  {side.formation ? <span className="text-xs font-normal text-muted">· {side.formation}</span> : null}
                </p>
                <ol>
                  {side.startXI.map((player) => (
                    <li
                      key={`${side.teamId}-${player.number}-${player.name}`}
                      className="border-t border-black/10 py-1.5 text-sm"
                    >
                      <span className="inline-block w-8 font-bold text-muted">{player.number ?? '–'}</span>
                      <span className="break-words">{player.name}</span>
                      {player.pos ? <span className="text-muted"> · {player.pos}</span> : null}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>
      ) : null}
      <p>
        <Link href="/futebol" className="text-sm font-semibold text-primary hover:underline">
          Voltar às partidas
        </Link>
      </p>
    </div>
  );
}
