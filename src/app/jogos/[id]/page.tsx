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
  const { match, events } = page;
  const score =
    match.status === 'upcoming' || match.home.score == null || match.away.score == null
      ? '×'
      : `${match.home.score} × ${match.away.score}`;
  const goals = events.filter((event) => event.kind === 'goal');
  const cards = events.filter((event) => event.kind === 'card');

  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4 py-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">{match.statusLabel}</p>
      <h1 className="font-display text-4xl uppercase tracking-wide text-secondary">
        {match.home.name} x {match.away.name}
      </h1>
      <article className="rounded-xl border border-black/10 bg-white p-4 sm:p-5">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <Link href={`/times/${match.home.id}`} className="flex flex-col items-center gap-2 text-center sm:flex-row">
            <Crest src={match.home.logo} name={match.home.name} size={56} />
            <span className="font-semibold text-secondary">{match.home.name}</span>
          </Link>
          <p className="font-display text-3xl text-secondary">{score}</p>
          <Link href={`/times/${match.away.id}`} className="flex flex-col items-center gap-2 text-center sm:flex-row-reverse sm:text-right">
            <Crest src={match.away.logo} name={match.away.name} size={56} />
            <span className="font-semibold text-secondary">{match.away.name}</span>
          </Link>
        </div>
        <p className="mt-4 text-sm text-muted">
          {match.kickoffLabel}
          {match.venue ? ` · ${match.venue}` : ''}
          {match.round ? ` · ${match.round}` : ''}
        </p>
      </article>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-black/10 bg-white p-4">
          <h2 className="font-display text-2xl uppercase text-secondary">Gols</h2>
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
        <section className="rounded-xl border border-black/10 bg-white p-4">
          <h2 className="font-display text-2xl uppercase text-secondary">Cartões</h2>
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
    </div>
  );
}
