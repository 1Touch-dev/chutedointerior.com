import type { StandingRow } from '@/lib/football-client';

export default function StandingsTable({ rows }: { rows: StandingRow[] }) {
  if (rows.length === 0) {
    return (
      <p className="rounded-xl border border-black/10 bg-white px-4 py-8 text-sm text-muted">
        Classificação ainda não disponível para esta competição.
      </p>
    );
  }

  return (
    <div className="min-w-0 overflow-x-auto overscroll-x-contain rounded-xl border border-black/10 bg-white [-webkit-overflow-scrolling:touch]">
      <table className="w-full min-w-[17rem] border-collapse text-sm">
        <caption className="sr-only">Classificação</caption>
        <thead>
          <tr className="border-b border-black/10 text-left text-[10px] font-bold uppercase tracking-wider text-muted">
            <th className="w-8 px-2 py-2.5 sm:px-3">#</th>
            <th className="px-2 py-2.5 sm:px-3">Time</th>
            <th className="px-2 py-2.5 text-right tabular-nums sm:px-3">J</th>
            <th className="px-2 py-2.5 text-right tabular-nums sm:px-3">SG</th>
            <th className="px-2 py-2.5 text-right tabular-nums sm:px-3">Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={`${row.rank}-${row.team.id || row.team.name}`}
              className="border-b border-black/[0.06] last:border-0"
            >
              <td className="px-2 py-2.5 tabular-nums text-muted sm:px-3">{row.rank}</td>
              <td className="max-w-[10rem] px-2 py-2.5 sm:max-w-none sm:px-3">
                <span className="inline-flex min-w-0 items-center gap-2">
                  {row.team.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={row.team.logo}
                      alt=""
                      width={22}
                      height={22}
                      className="h-[22px] w-[22px] shrink-0 object-contain"
                    />
                  ) : null}
                  <span className="truncate font-semibold text-secondary">{row.team.name}</span>
                </span>
              </td>
              <td className="px-3 py-2.5 text-right tabular-nums text-muted">
                {row.played}
              </td>
              <td className="px-3 py-2.5 text-right tabular-nums text-muted">
                {row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}
              </td>
              <td className="px-3 py-2.5 text-right font-display text-base tabular-nums text-secondary">
                {row.points}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
