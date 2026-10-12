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
    <div className="mx-auto min-w-0 max-w-5xl space-y-3 px-4 py-6 sm:space-y-4 sm:py-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">Brasileirão Série A</p>
      <h1 className="break-words font-display text-2xl uppercase tracking-wide text-secondary sm:text-4xl">
        {team.name}
      </h1>
      <div className="flex flex-col gap-3 rounded-xl border border-black/10 bg-white p-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 sm:p-4">
        <div className="flex min-w-0 items-center gap-3">
          <Crest src={team.logo} name={team.name} size={56} />
          <div className="min-w-0">
            {team.standing ? (
              <p className="font-semibold text-secondary">
                {team.standing.rank}º lugar · {team.standing.points} pts · {team.standing.played} jogos
              </p>
            ) : (
              <p className="text-sm text-muted">Sem linha na classificação nesta leitura.</p>
            )}
            {place ? <p className="mt-1 break-words text-sm text-muted">{place}</p> : null}
          </div>
        </div>
        <Link href="/futebol" className="text-sm font-semibold text-primary hover:underline sm:ml-auto">
          Voltar à tabela
        </Link>
      </div>
      <div className="grid min-w-0 gap-3 sm:gap-4 lg:grid-cols-2">
        <section className="min-w-0 rounded-xl border border-black/10 bg-white p-3 sm:p-4">
          <h2 className="font-display text-xl uppercase text-secondary sm:text-2xl">Próximos</h2>
          <MatchList matches={team.upcoming} empty="Sem jogos marcados nesta amostra." />
        </section>
        <section className="min-w-0 rounded-xl border border-black/10 bg-white p-3 sm:p-4">
          <h2 className="font-display text-xl uppercase text-secondary sm:text-2xl">Encerrados</h2>
          <MatchList matches={team.recent} empty="Sem jogos encerrados nesta amostra." />
        </section>
      </div>
    </div>
  );
}
