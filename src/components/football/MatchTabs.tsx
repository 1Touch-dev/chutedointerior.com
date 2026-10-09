'use client';

import { useState } from 'react';
import type { IFootballMatch } from '@/lib/football-desk';
import { MatchList } from '@/components/football/desk-view';

export default function MatchTabs({ upcoming, completed }: { upcoming: IFootballMatch[]; completed: IFootballMatch[] }) {
  const [tab, setTab] = useState<'upcoming' | 'completed'>(upcoming.length > 0 ? 'upcoming' : 'completed');
  const rows = tab === 'upcoming' ? upcoming : completed;
  const empty = tab === 'upcoming' ? 'Sem jogos à frente nesta amostra.' : 'Sem jogos encerrados nesta amostra.';

  return (
    <section className="rounded-xl border border-black/10 bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-2xl uppercase tracking-wide text-secondary">Jogos</h3>
        <div role="tablist" aria-label="Jogos do Brasileirão" className="inline-flex rounded-full border border-black/10 p-0.5">
          {(
            [
              ['upcoming', 'Próximos'],
              ['completed', 'Encerrados'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={tab === value}
              className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
                tab === value ? 'bg-primary text-white' : 'text-muted'
              }`}
              onClick={() => setTab(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-2" role="tabpanel">
        <MatchList matches={rows} empty={empty} />
      </div>
    </section>
  );
}
