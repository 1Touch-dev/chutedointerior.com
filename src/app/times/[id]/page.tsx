import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Crest, MatchList } from '@/components/football/desk-view';
import { getTeamPage } from '@/lib/football-desk';

export const revalidate = 120;

interface PageProps {
  params: Promise<{ id: string }>;
}

const readId = (value: string) => (/^\d+$/.test(value) ? Number(value) : null);

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const teamId = readId(id);
  const team = teamId == null ? null : await getTeamPage(teamId);
  if (!team) return { title: 'Clube' };
  return { title: team.name };
}

export default async function TimePage({ params }: PageProps) {
  const { id } = await params;
  const teamId = readId(id);
  const team = teamId == null ? null : await getTeamPage(teamId);
  if (!team) notFound();
  const place = [team.venue, team.city].filter(Boolean).join(' · ');

  return (
    <div className="mx-auto max-w-5xl space-y-4 px-4 py-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">Brasileirão Série A</p>
      <h1 className="font-display text-4xl uppercase tracking-wide text-secondary">{team.name}</h1>
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-black/10 bg-white p-4">
        <Crest src={team.logo} name={team.name} size={64} />
        <div>
          {team.standing ? (
            <p className="font-semibold text-secondary">
              {team.standing.rank}º lugar · {team.standing.points} pts · {team.standing.played} jogos
            </p>
          ) : (
            <p className="text-sm text-muted">Sem linha na classificação nesta leitura.</p>
          )}
          {place ? <p className="mt-1 text-sm text-muted">{place}</p> : null}
        </div>
        <Link href="/futebol" className="ml-auto text-sm font-semibold text-primary hover:underline">
          Voltar à tabela
        </Link>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-black/10 bg-white p-4">
          <h2 className="font-display text-2xl uppercase text-secondary">Próximos</h2>
          <MatchList matches={team.upcoming} empty="Sem jogos marcados nesta amostra." />
        </section>
        <section className="rounded-xl border border-black/10 bg-white p-4">
          <h2 className="font-display text-2xl uppercase text-secondary">Encerrados</h2>
          <MatchList matches={team.recent} empty="Sem jogos encerrados nesta amostra." />
        </section>
      </div>
    </div>
  );
}
