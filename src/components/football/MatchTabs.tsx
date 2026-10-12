'use client';

import { useState } from 'react';
import type { IFootballMatch } from '@/lib/football-desk';
import { MatchList } from '@/components/football/desk-view';

export default function MatchTabs({ upcoming, completed }: { upcoming: IFootballMatch[]; completed: IFootballMatch[] }) {
  const [tab, setTab] = useState<'upcoming' | 'completed'>(upcoming.length > 0 ? 'upcoming' : 'completed');
  const rows = tab === 'upcoming' ? upcoming : completed;
  const empty = tab === 'upcoming' ? 'Sem jogos à frente nesta amostra.' : 'Sem jogos encerrados nesta amostra.';

  return (
    <section className="min-w-0 rounded-xl border border-black/10 bg-white p-3 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="font-display text-xl uppercase tracking-wide text-secondary sm:text-2xl">Jogos</h3>
        <div
          role="tablist"
          aria-label="Jogos"
          className="grid w-full grid-cols-2 rounded-lg border border-black/10 p-0.5 sm:inline-grid sm:w-auto"
        >
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
              className={`rounded-md px-3 py-2 text-[11px] font-bold uppercase tracking-wider sm:py-1 ${
                tab === value ? 'bg-primary text-white' : 'text-muted'
              }`}
              onClick={() => setTab(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-2 min-w-0" role="tabpanel">
        <MatchList matches={rows} empty={empty} />
      </div>
    </section>
  );
}
