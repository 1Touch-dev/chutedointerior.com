import { cache } from "react";
import { siteConfig } from "@/lib/site-config";

const SEASON = 2026;
const LEAGUE_ID = 71;
const LEAGUE_SLUG = "brasileirao";

const apiBase = (siteConfig.cms.baseUrl || "https://api.chutedointerior.com/api").replace(/\/$/, "");

const FINISHED = new Set(["FT", "AET", "PEN", "AWD", "WO"]);
const LIVE = new Set(["1H", "2H", "HT", "ET", "BT", "P", "LIVE", "INT", "SUSP"]);

export interface IFootballSide {
  id: number;
  name: string;
  logo?: string;
  score: number | null;
}

export interface IFootballMatch {
  id: number;
  date: string;
  kickoffLabel: string;
  status: "upcoming" | "live" | "finished";
  statusLabel: string;
  detail: string;
  round?: string;
  venue?: string;
  elapsed: number | null;
  home: IFootballSide;
  away: IFootballSide;
}

export interface IStanding {
  rank: number;
  teamId: number;
  name: string;
  logo?: string;
  played: number;
  win: number;
  draw: number;
  lose: number;
  goalsDiff: number;
  points: number;
  form: string;
}

export interface IScorer {
  id: number;
  name: string;
  photo?: string;
  teamId: number;
  teamName: string;
  teamLogo?: string;
  goals: number;
  assists: number;
}

export interface IFootballTeamRef {
  id: number;
  name: string;
  logo?: string;
}

export interface IFootballDesk {
  leagueName: string;
  season: number;
  nextMatch: IFootballMatch | null;
  upcoming: IFootballMatch[];
  completed: IFootballMatch[];
  standings: IStanding[];
  teams: IFootballTeamRef[];
  scorers: IScorer[];
  assists: IScorer[];
}

export interface IMatchEvent {
  minute: string;
  teamName: string;
  player: string;
  detail: string;
  kind: "goal" | "card";
}

export interface IMatchPage {
  match: IFootballMatch;
  events: IMatchEvent[];
}

export interface ITeamPage {
  id: number;
  name: string;
  logo?: string;
  venue?: string;
  city?: string;
  standing?: IStanding;
  upcoming: IFootballMatch[];
  recent: IFootballMatch[];
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const str = (value: unknown): string | undefined => (typeof value === "string" && value.trim() ? value.trim() : undefined);

const num = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))) return Number(value);
  return null;
};

const listFrom = (value: unknown): unknown[] => {
  if (Array.isArray(value)) return value;
  if (isRecord(value) && Array.isArray(value.response)) return value.response;
  return [];
};

const formatKickoff = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  }).format(date);
};

const classify = (short: string, long: string): IFootballMatch["status"] => {
  const code = short.toUpperCase();
  if (FINISHED.has(code) || /finished|after extra|after pen/i.test(long)) return "finished";
  if (LIVE.has(code) || (/half|live|extra time/i.test(long) && !/not started/i.test(long))) return "live";
  return "upcoming";
};

const statusLabelFor = (status: IFootballMatch["status"]): string => {
  if (status === "live") return "Ao vivo";
  if (status === "finished") return "Encerrado";
  return "Não iniciado";
};

const detailLabelFor = (long: string, status: IFootballMatch["status"]): string => {
  const known: Record<string, string> = {
    "Match Finished": "Encerrado",
    "Not Started": "Não iniciado",
    "First Half": "Primeiro tempo",
    "Second Half": "Segundo tempo",
    Halftime: "Intervalo",
    "Extra Time": "Prorrogação",
    "Break Time": "Intervalo",
    "Penalty In Progress": "Pênaltis",
    "Match Postponed": "Adiado",
    "Match Suspended": "Suspenso",
    "Time to be defined": "Horário a definir",
  };
  return known[long] ?? statusLabelFor(status);
};

const roundLabel = (round?: string): string | undefined => {
  if (!round) return undefined;
  const regular = round.match(/regular season\s*-\s*(\d+)/i);
  return regular ? `Rodada ${regular[1]}` : round;
};

const mapSide = (value: unknown, score: unknown): IFootballSide | null => {
  if (!isRecord(value)) return null;
  const id = num(value.id);
  const name = str(value.name);
  if (id == null || !name) return null;
  return { id, name, logo: str(value.logo), score: num(score) };
};

const mapApiFixture = (raw: Record<string, unknown>): IFootballMatch | null => {
  const fixture = isRecord(raw.fixture) ? raw.fixture : null;
  const teams = isRecord(raw.teams) ? raw.teams : null;
  if (!fixture || !teams) return null;
  const id = num(fixture.id);
  const goals = isRecord(raw.goals) ? raw.goals : {};
  const home = mapSide(teams.home, goals.home);
  const away = mapSide(teams.away, goals.away);
  if (id == null || !home || !away) return null;
  const status = isRecord(fixture.status) ? fixture.status : {};
  const short = str(status.short) ?? "";
  const long = str(status.long) ?? short;
  const kind = classify(short, long);
  const league = isRecord(raw.league) ? raw.league : null;
  const venue = isRecord(fixture.venue) ? str(fixture.venue.name) : undefined;
  const date = str(fixture.date) ?? "";
  return {
    id,
    date,
    kickoffLabel: formatKickoff(date),
    status: kind,
    statusLabel: statusLabelFor(kind),
    detail: detailLabelFor(long, kind),
    round: roundLabel(league ? str(league.round) : undefined),
    venue,
    elapsed: num(status.elapsed),
    home,
    away,
  };
};

const mapBundleFixture = (raw: Record<string, unknown>): IFootballMatch | null => {
  const id = num(raw.id);
  const homeRaw = isRecord(raw.homeTeam) ? raw.homeTeam : null;
  const awayRaw = isRecord(raw.awayTeam) ? raw.awayTeam : null;
  const home = mapSide(homeRaw, homeRaw?.score);
  const away = mapSide(awayRaw, awayRaw?.score);
  if (id == null || !home || !away) return null;
  const label = str(raw.status) ?? "";
  const kind = classify(label, label);
  const matchday = num(raw.matchday);
  const date = str(raw.date) ?? "";
  return {
    id,
    date,
    kickoffLabel: formatKickoff(date),
    status: kind,
    statusLabel: statusLabelFor(kind),
    detail: detailLabelFor(label, kind),
    round: matchday != null ? `Rodada ${matchday}` : undefined,
    venue: str(raw.venue),
    elapsed: null,
    home,
    away,
  };
};

const mapMatch = (value: unknown): IFootballMatch | null => {
  if (!isRecord(value)) return null;
  if (isRecord(value.fixture) && isRecord(value.teams)) return mapApiFixture(value);
  if (isRecord(value.homeTeam) && isRecord(value.awayTeam)) return mapBundleFixture(value);
  return null;
};

const leagueIdOf = (value: unknown): number | null => {
  if (!isRecord(value) || !isRecord(value.league)) return null;
  return num(value.league.id);
};

const matchesFrom = (payload: unknown, leagueId?: number): IFootballMatch[] => {
  const rows = Array.isArray(payload) ? payload : listFrom(isRecord(payload) ? (payload.response ?? payload.fixtures ?? payload) : null);
  return rows.flatMap((row) => {
    if (leagueId != null) {
      const id = leagueIdOf(row);
      if (id != null && id !== leagueId) return [];
    }
    const match = mapMatch(row);
    return match ? [match] : [];
  });
};

const mapStanding = (value: unknown): IStanding | null => {
  if (!isRecord(value) || !isRecord(value.team)) return null;
  const id = num(value.team.id);
  const name = str(value.team.name);
  const rank = num(value.rank);
  if (id == null || !name || rank == null) return null;
  const all = isRecord(value.all) ? value.all : {};
  return {
    rank,
    teamId: id,
    name,
    logo: str(value.team.logo),
    played: num(all.played) ?? 0,
    win: num(all.win) ?? 0,
    draw: num(all.draw) ?? 0,
    lose: num(all.lose) ?? 0,
    goalsDiff: num(value.goalsDiff) ?? 0,
    points: num(value.points) ?? 0,
    form: str(value.form) ?? "",
  };
};

const standingsFrom = (payload: unknown): IStanding[] => {
  const response = listFrom(isRecord(payload) ? (payload.response ?? payload) : payload);
  const flat: unknown[] = [];
  for (const item of response) {
    if (!isRecord(item)) continue;
    const league = isRecord(item.league) ? item.league : item;
    const groups = league.standings;
    if (!Array.isArray(groups)) continue;
    for (const group of groups) {
      if (Array.isArray(group)) flat.push(...group);
      else flat.push(group);
    }
  }
  return flat
    .flatMap((row) => {
      const standing = mapStanding(row);
      return standing ? [standing] : [];
    })
    .sort((a, b) => a.rank - b.rank);
};

const mapScorer = (value: unknown): IScorer | null => {
  if (!isRecord(value)) return null;
  const player = isRecord(value.player) ? value.player : value;
  const stats = Array.isArray(value.statistics) ? value.statistics[0] : value.statistics;
  const stat = isRecord(stats) ? stats : {};
  const id = num(player.id);
  const name = str(player.name);
  if (id == null || !name) return null;
  const team = isRecord(stat.team) ? stat.team : {};
  const goalsNode = isRecord(stat.goals) ? stat.goals : {};
  const assistsNode = isRecord(stat.assists) ? stat.assists : null;
  return {
    id,
    name,
    photo: str(player.photo),
    teamId: num(team.id) ?? 0,
    teamName: str(team.name) ?? "",
    teamLogo: str(team.logo),
    goals: num(goalsNode.total) ?? 0,
    assists: num(goalsNode.assists) ?? (assistsNode ? num(assistsNode.total) : num(stat.assists)) ?? 0,
  };
};

const scorersFrom = (payload: unknown): IScorer[] => {
  const rows = Array.isArray(payload) ? payload : listFrom(isRecord(payload) ? payload.response : null);
  return rows.flatMap((row) => {
    const scorer = mapScorer(row);
    return scorer ? [scorer] : [];
  });
};

const detailLabel = (detail: string): string => {
  const labels: Record<string, string> = {
    "Normal Goal": "Gol",
    "Own Goal": "Gol contra",
    Penalty: "Pênalti",
    "Missed Penalty": "Pênalti perdido",
    "Yellow Card": "Amarelo",
    "Red Card": "Vermelho",
    "Second Yellow card": "Segundo amarelo",
  };
  return labels[detail] ?? detail;
};

const mapEvents = (value: unknown): IMatchEvent[] =>
  listFrom(value).flatMap((item) => {
    if (!isRecord(item)) return [];
    const type = str(item.type) ?? "";
    const kind = /goal/i.test(type) ? "goal" : /card/i.test(type) ? "card" : null;
    if (!kind) return [];
    const time = isRecord(item.time) ? item.time : {};
    const elapsed = num(time.elapsed);
    const extra = num(time.extra);
    const minute = elapsed == null ? "" : extra ? `${elapsed}+${extra}'` : `${elapsed}'`;
    const detail = str(item.detail) ?? type;
    return [
      {
        minute,
        teamName: isRecord(item.team) ? (str(item.team.name) ?? "") : "",
        player: isRecord(item.player) ? (str(item.player.name) ?? "") : "",
        detail: detailLabel(detail),
        kind,
      },
    ];
  });

const footballGet = async (path: string): Promise<unknown> => {
  try {
    const response = await fetch(`${apiBase}${path}`, {
      next: { revalidate: 120 },
      headers: { accept: "application/json" },
    });
    if (!response.ok) return null;
    return (await response.json()) as unknown;
  } catch {
    return null;
  }
};

const byDate = (left: IFootballMatch, right: IFootballMatch) => left.date.localeCompare(right.date);

export const getFootballDesk = cache(async (): Promise<IFootballDesk | null> => {
  const [bundle, nextPayload, finishedPayload, livePayload] = await Promise.all([
    footballGet(`/football/brazil/league/${LEAGUE_SLUG}?season=${SEASON}`),
    footballGet(`/football/fixtures?league=${LEAGUE_ID}&season=${SEASON}&next=12`),
    footballGet(`/football/fixtures?league=${LEAGUE_ID}&season=${SEASON}&status=FT&last=12`),
    footballGet(`/football/fixtures?live=all`),
  ]);

  const bundleRecord = isRecord(bundle) ? bundle : null;
  const league = bundleRecord && isRecord(bundleRecord.league) ? bundleRecord.league : null;
  const ordered = [
    ...matchesFrom(bundleRecord?.fixtures),
    ...matchesFrom(nextPayload),
    ...matchesFrom(livePayload, LEAGUE_ID),
    ...matchesFrom(finishedPayload),
  ];
  const byId = new Map<number, IFootballMatch>();
  for (const match of ordered) byId.set(match.id, match);
  const all = [...byId.values()];
  const upcoming = all.filter((match) => match.status !== "finished").sort(byDate).slice(0, 10);
  const completed = all
    .filter((match) => match.status === "finished")
    .sort((left, right) => right.date.localeCompare(left.date))
    .slice(0, 10);
  const standings = standingsFrom(bundleRecord?.standings);
  const teams = standings.map((row) => ({ id: row.teamId, name: row.name, logo: row.logo }));
  const scorers = scorersFrom(bundleRecord?.topScorers)
    .sort((left, right) => right.goals - left.goals || right.assists - left.assists)
    .slice(0, 20);
  const assistSource = scorersFrom(bundleRecord?.topAssists);
  const assists = (assistSource.length > 0 ? assistSource : scorers.filter((row) => row.assists > 0))
    .sort((left, right) => right.assists - left.assists || right.goals - left.goals)
    .slice(0, 20);

  if (!upcoming.length && !completed.length && !standings.length && !scorers.length) return null;

  return {
    leagueName: (league && (str(league.namePt) || str(league.name))) || "Brasileirão Série A",
    season: (bundleRecord && num(bundleRecord.season)) || SEASON,
    nextMatch: upcoming[0] ?? null,
    upcoming,
    completed,
    standings,
    teams,
    scorers,
    assists,
  };
});

export const getMatchPage = cache(async (id: number): Promise<IMatchPage | null> => {
  const payload = await footballGet(`/football/fixtures?id=${id}`);
  const raw = listFrom(isRecord(payload) ? payload.response : null)[0];
  const match = mapMatch(raw);
  if (!match || !isRecord(raw)) return null;
  return { match, events: mapEvents(raw.events) };
});

const teamProfile = (payload: unknown, teamId: number): { name?: string; logo?: string; venue?: string; city?: string } => {
  const rows = listFrom(isRecord(payload) ? payload.response : null);
  const found = rows.find((row) => isRecord(row) && isRecord(row.team) && num(row.team.id) === teamId);
  const row = isRecord(found) ? found : rows.find(isRecord);
  if (!isRecord(row) || !isRecord(row.team)) return {};
  const venue = isRecord(row.venue) ? row.venue : {};
  return {
    name: str(row.team.name),
    logo: str(row.team.logo),
    venue: str(venue.name),
    city: str(venue.city),
  };
};

export const getTeamPage = cache(async (teamId: number): Promise<ITeamPage | null> => {
  const [teamPayload, nextPayload, lastPayload, desk] = await Promise.all([
    footballGet(`/football/teams?id=${teamId}&season=${SEASON}`),
    footballGet(`/football/fixtures?team=${teamId}&season=${SEASON}&next=6`),
    footballGet(`/football/fixtures?team=${teamId}&season=${SEASON}&last=8`),
    getFootballDesk(),
  ]);
  const profile = teamProfile(teamPayload, teamId);
  const standing = desk?.standings.find((row) => row.teamId === teamId);
  const name = profile.name || standing?.name;
  if (!name) return null;
  const upcoming = matchesFrom(nextPayload)
    .filter((match) => match.status !== "finished")
    .sort(byDate)
    .slice(0, 5);
  const recent = matchesFrom(lastPayload)
    .filter((match) => match.status === "finished")
    .sort((left, right) => right.date.localeCompare(left.date))
    .slice(0, 5);
  return {
    id: teamId,
    name,
    logo: profile.logo || standing?.logo,
    venue: profile.venue,
    city: profile.city,
    standing,
    upcoming,
    recent,
  };
});
