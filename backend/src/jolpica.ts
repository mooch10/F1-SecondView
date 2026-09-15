import type { LastRacePodium } from './types.js';
import {
  generateUniversalQualifyingSession,
  resolveActiveSession,
} from './universalLiveEngine.js';
import { liveStreamClient } from './liveStreamClient.js';

export interface JolpicaRace {
  round: number;
  raceName: string;
  circuitName: string;
  locality: string;
  country: string;
  raceDateTime: string;
  sessions: {
    name: string;
    dateTime: string;
  }[];
  isNext: boolean;
  status?: 'COMPLETED' | 'IN_PROGRESS' | 'UPCOMING';
}

export interface JolpicaDriverStanding {
  pos: number;
  points: number;
  wins: number;
  code: string;
  name: string;
  nationality: string;
  team: string;
  teamColor: string;
}

export interface JolpicaConstructorStanding {
  pos: number;
  points: number;
  wins: number;
  name: string;
  teamColor: string;
}

export interface JolpicaQualifyingResult {
  pos: number;
  driverNumber: number;
  code: string;
  fullName: string;
  familyName: string;
  teamName: string;
  teamColor: string;
  q1: string;
  q2?: string;
  q3?: string;
  bestLap: string;
  gap: string;
  eliminatedPhase?: 'Q1' | 'Q2' | null;
  isPole?: boolean;
}

export interface JolpicaQualifyingSession {
  round: number;
  raceName: string;
  circuitName: string;
  date: string;
  poleDriver: {
    code: string;
    fullName: string;
    teamName: string;
    time: string;
  };
  results: JolpicaQualifyingResult[];
}

export interface JolpicaRaceResult {
  pos: number;
  grid: number;
  posChange: number;
  driverNumber: number;
  code: string;
  fullName: string;
  familyName: string;
  teamName: string;
  teamColor: string;
  points: number;
  laps: number;
  status: string;
  timeOrStatus: string;
  isWinner?: boolean;
  isPodium?: boolean;
  isFastestLap?: boolean;
  fastestLapTime?: string;
  fastestLapRank?: number;
}

export interface JolpicaRaceDetail {
  round: number;
  season: string;
  raceName: string;
  circuitName: string;
  date: string;
  winner: {
    code: string;
    fullName: string;
    teamName: string;
    time: string;
  };
  fastestLap?: {
    code: string;
    driverName: string;
    teamName: string;
    time: string;
    lap: number;
  };
  results: JolpicaRaceResult[];
}

const TEAM_COLORS: Record<string, string> = {
  mercedes: '#27F4D2',
  ferrari: '#E8002D',
  red_bull: '#3671C6',
  mclaren: '#FF8000',
  aston_martin: '#229971',
  alpine: '#FF87BC',
  williams: '#64C4FF',
  rb: '#6692FF',
  sauber: '#52E252',
  haas: '#B6BABD',
};

function getTeamColor(constructorId: string): string {
  const normalized = constructorId.toLowerCase().replace(/[^a-z0-9_]/g, '_');
  for (const key of Object.keys(TEAM_COLORS)) {
    if (normalized.includes(key)) {
      return TEAM_COLORS[key];
    }
  }
  return '#71717A';
}

function formatSessionDateTime(date?: string, time?: string, defaultTime = '12:00:00Z'): string {
  if (!date) return '';
  if (!time) return `${date}T${defaultTime}`;
  const cleanTime = time.endsWith('Z') ? time : `${time}Z`;
  return `${date}T${cleanTime}`;
}

export class JolpicaClient {
  private baseUrl = 'https://api.jolpi.ca/ergast/f1';
  private timeoutMs = 7000;

  private scheduleCache: { timestamp: number; data: JolpicaRace[] } | null = null;
  private standingsCache: {
    timestamp: number;
    data: { drivers: JolpicaDriverStanding[]; constructors: JolpicaConstructorStanding[] };
  } | null = null;
  private lastRaceCache: { timestamp: number; data: LastRacePodium | null } | null = null;
  private qualifyingCache: { timestamp: number; data: JolpicaQualifyingSession | null } | null =
    null;
  private cacheTtlMs = 60 * 60 * 1000; // 1 hour

  private async fetchRaw<T>(path: string): Promise<T | null> {
    try {
      const res = await fetch(`${this.baseUrl}${path}`, {
        signal: AbortSignal.timeout(this.timeoutMs),
      });
      if (!res.ok) {
        console.warn(`[Jolpica] Returned status ${res.status} on ${path}`);
        return null;
      }
      return (await res.json()) as T;
    } catch (err) {
      console.error(`[Jolpica] Error fetching ${path}:`, err);
      return null;
    }
  }

  async getSchedule(): Promise<JolpicaRace[]> {
    if (this.scheduleCache && Date.now() - this.scheduleCache.timestamp < this.cacheTtlMs) {
      return this.scheduleCache.data;
    }

    interface RawScheduleResponse {
      MRData: {
        RaceTable: {
          Races: Array<{
            round: string;
            raceName: string;
            date: string;
            time?: string;
            Circuit: {
              circuitName: string;
              Location: { locality: string; country: string };
            };
            FirstPractice?: { date: string; time?: string };
            SecondPractice?: { date: string; time?: string };
            ThirdPractice?: { date: string; time?: string };
            Sprint?: { date: string; time?: string };
            Qualifying?: { date: string; time?: string };
          }>;
        };
      };
    }

    let raw = await this.fetchRaw<RawScheduleResponse>('/2026.json');
    if (!raw?.MRData?.RaceTable?.Races || raw.MRData.RaceTable.Races.length === 0) {
      raw = await this.fetchRaw<RawScheduleResponse>('/current.json');
    }
    if (!raw?.MRData?.RaceTable?.Races) {
      return this.scheduleCache?.data || [];
    }

    const nowMs = Date.now();
    let foundNext = false;

    const races: JolpicaRace[] = raw.MRData.RaceTable.Races.map((r) => {
      const raceDateTime = formatSessionDateTime(r.date, r.time, '12:00:00Z');
      const raceTimeMs = new Date(raceDateTime).getTime();
      const raceEndMs = raceTimeMs + 3 * 3600 * 1000; // 3 hour race window

      let status: 'COMPLETED' | 'IN_PROGRESS' | 'UPCOMING' = 'UPCOMING';
      if (!Number.isNaN(raceTimeMs)) {
        if (nowMs >= raceEndMs) {
          status = 'COMPLETED';
        } else if (nowMs >= raceTimeMs) {
          status = 'IN_PROGRESS';
        } else {
          status = 'UPCOMING';
        }
      }

      let isNext = false;
      if (status !== 'COMPLETED' && !foundNext) {
        isNext = true;
        foundNext = true;
      }

      const sessions: { name: string; dateTime: string }[] = [];
      if (r.FirstPractice) {
        sessions.push({
          name: 'Práctica 1',
          dateTime: formatSessionDateTime(r.FirstPractice.date, r.FirstPractice.time, '10:00:00Z'),
        });
      }
      if (r.SecondPractice) {
        sessions.push({
          name: 'Práctica 2',
          dateTime: formatSessionDateTime(
            r.SecondPractice.date,
            r.SecondPractice.time,
            '14:00:00Z',
          ),
        });
      }
      if (r.Sprint) {
        sessions.push({
          name: 'Sprint',
          dateTime: formatSessionDateTime(r.Sprint.date, r.Sprint.time, '11:00:00Z'),
        });
      }
      if (r.ThirdPractice) {
        sessions.push({
          name: 'Práctica 3',
          dateTime: formatSessionDateTime(r.ThirdPractice.date, r.ThirdPractice.time, '11:00:00Z'),
        });
      }
      if (r.Qualifying) {
        sessions.push({
          name: 'Clasificación',
          dateTime: formatSessionDateTime(r.Qualifying.date, r.Qualifying.time, '15:00:00Z'),
        });
      }
      sessions.push({
        name: 'Carrera',
        dateTime: raceDateTime,
      });

      const rawCircuitName = r.Circuit.circuitName;
      const circuitName =
        rawCircuitName.toLowerCase().includes('madring') ? 'Circuito de Madrid' : rawCircuitName;

      return {
        round: Number(r.round),
        raceName: r.raceName,
        circuitName,
        locality: r.Circuit.Location.locality,
        country: r.Circuit.Location.country,
        raceDateTime,
        sessions,
        isNext,
        status,
      };
    });

    this.scheduleCache = { timestamp: Date.now(), data: races };
    return races;
  }

  async getStandings(year?: number): Promise<{
    drivers: JolpicaDriverStanding[];
    constructors: JolpicaConstructorStanding[];
  }> {
    const isHistorical = typeof year === 'number' && year > 1950 && year < 2026;
    if (!isHistorical && this.standingsCache && Date.now() - this.standingsCache.timestamp < this.cacheTtlMs) {
      return this.standingsCache.data;
    }

    interface RawDriversResponse {
      MRData: {
        StandingsTable: {
          StandingsLists: Array<{
            DriverStandings: Array<{
              position: string;
              points: string;
              wins: string;
              Driver: {
                code?: string;
                givenName: string;
                familyName: string;
                nationality: string;
              };
              Constructors: Array<{
                constructorId: string;
                name: string;
              }>;
            }>;
          }>;
        };
      };
    }

    interface RawConstructorsResponse {
      MRData: {
        StandingsTable: {
          StandingsLists: Array<{
            ConstructorStandings: Array<{
              position: string;
              points: string;
              wins: string;
              Constructor: {
                constructorId: string;
                name: string;
              };
            }>;
          }>;
        };
      };
    }

    const driverPath = isHistorical ? `/${year}/driverStandings.json` : '/current/driverStandings.json';
    const constrPath = isHistorical ? `/${year}/constructorStandings.json` : '/current/constructorStandings.json';

    const [rawDrivers, rawConstructors] = await Promise.all([
      this.fetchRaw<RawDriversResponse>(driverPath),
      this.fetchRaw<RawConstructorsResponse>(constrPath),
    ]);

    const driversList =
      rawDrivers?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings || [];
    const constrList =
      rawConstructors?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings || [];

    const drivers: JolpicaDriverStanding[] = driversList.map((d) => {
      const primaryTeam = d.Constructors?.[0];
      const teamId = primaryTeam?.constructorId || 'unknown';
      return {
        pos: Number(d.position),
        points: Number(d.points),
        wins: Number(d.wins),
        code: d.Driver.code || d.Driver.familyName.substring(0, 3).toUpperCase(),
        name: `${d.Driver.givenName} ${d.Driver.familyName}`,
        nationality: d.Driver.nationality,
        team: primaryTeam?.name || 'Independiente',
        teamColor: getTeamColor(teamId),
      };
    });

    const constructors: JolpicaConstructorStanding[] = constrList.map((c) => ({
      pos: Number(c.position),
      points: Number(c.points),
      wins: Number(c.wins),
      name: c.Constructor.name,
      teamColor: getTeamColor(c.Constructor.constructorId),
    }));

    const result = { drivers, constructors };
    if (!isHistorical) {
      this.standingsCache = { timestamp: Date.now(), data: result };
    }
    return result;
  }

  async getLastRacePodium(): Promise<LastRacePodium | null> {
    if (this.lastRaceCache && Date.now() - this.lastRaceCache.timestamp < this.cacheTtlMs) {
      return this.lastRaceCache.data;
    }

    interface RawLastRaceResponse {
      MRData?: {
        RaceTable?: {
          Races?: Array<{
            raceName: string;
            round: string;
            date: string;
            Circuit: {
              circuitName: string;
            };
            Results?: Array<{
              position: string;
              Driver: {
                code?: string;
                givenName: string;
                familyName: string;
              };
              Constructor: {
                constructorId: string;
                name: string;
              };
              Time?: {
                time: string;
              };
              status: string;
            }>;
          }>;
        };
      };
    }

    let raw = await this.fetchRaw<RawLastRaceResponse>('/2026/last/results.json');
    let race = raw?.MRData?.RaceTable?.Races?.[0];

    if (!race || !race.Results || race.Results.length === 0) {
      raw = await this.fetchRaw<RawLastRaceResponse>('/current/last/results.json');
      race = raw?.MRData?.RaceTable?.Races?.[0];
    }

    if (!race || !race.Results) {
      return null;
    }

    const podium = race.Results.slice(0, 3).map((r) => ({
      position: Number(r.position),
      code: r.Driver.code || r.Driver.familyName.substring(0, 3).toUpperCase(),
      fullName: `${r.Driver.givenName} ${r.Driver.familyName}`,
      teamName: r.Constructor.name,
      teamColor: getTeamColor(r.Constructor.constructorId),
      timeOrStatus: r.Time?.time || r.status,
    }));

    const result: LastRacePodium = {
      raceName: race.raceName,
      round: Number(race.round),
      circuitName: race.Circuit.circuitName,
      date: race.date,
      podium,
    };

    this.lastRaceCache = { timestamp: Date.now(), data: result };
    return result;
  }

  async getQualifying(): Promise<JolpicaQualifyingSession | null> {
    // 1. Determine active race from current schedule
    const schedule = await this.getSchedule();
    const activeSession = resolveActiveSession(schedule);
    const isLiveActive = !!(activeSession && activeSession.status === 'IN_PROGRESS');
    const effectiveTtl = isLiveActive ? 5000 : this.cacheTtlMs;

    if (this.qualifyingCache && Date.now() - this.qualifyingCache.timestamp < effectiveTtl) {
      return this.qualifyingCache.data;
    }

    interface RawQualifyingResultItem {
      number: string;
      position: string;
      Driver: {
        driverId?: string;
        code?: string;
        givenName: string;
        familyName: string;
      };
      Constructor: {
        constructorId: string;
        name: string;
      };
      Q1?: string;
      Q2?: string;
      Q3?: string;
    }

    interface RawQualifyingRace {
      raceName: string;
      round: string;
      date: string;
      Circuit: {
        circuitName: string;
      };
      QualifyingResults?: RawQualifyingResultItem[];
    }

    interface RawQualifyingResponse {
      MRData?: {
        RaceTable?: {
          Races?: RawQualifyingRace[];
        };
      };
    }

    const liveSession = await liveStreamClient.getLiveStream();
    const isQualyLive = !!(
      activeSession &&
      activeSession.status === 'IN_PROGRESS' &&
      activeSession.sessionType === 'Qualifying'
    );

    let race: RawQualifyingRace | undefined;

    // 1. If qualifying is LIVE IN PROGRESS right now:
    if (isQualyLive && activeSession) {
      const raw = await this.fetchRaw<RawQualifyingResponse>(`/current/${activeSession.race.round}/qualifying.json`);
      race = raw?.MRData?.RaceTable?.Races?.[0];

      if (!race || !race.QualifyingResults || race.QualifyingResults.length === 0) {
        const data = generateUniversalQualifyingSession(activeSession.race, liveSession);
        this.qualifyingCache = { timestamp: Date.now(), data };
        return data;
      }
    }

    // 2. When not live: Return the last completed qualifying session
    if (!race || !race.QualifyingResults || race.QualifyingResults.length === 0) {
      const raw = await this.fetchRaw<RawQualifyingResponse>('/current/last/qualifying.json');
      race = raw?.MRData?.RaceTable?.Races?.[0];
    }

    if (!race || !race.QualifyingResults || race.QualifyingResults.length === 0) {
      const raw = await this.fetchRaw<RawQualifyingResponse>('/2026/last/qualifying.json');
      race = raw?.MRData?.RaceTable?.Races?.[0];
    }

    if (!race || !race.QualifyingResults || race.QualifyingResults.length === 0) {
      const raw = await this.fetchRaw<RawQualifyingResponse>('/2026/14/qualifying.json');
      race = raw?.MRData?.RaceTable?.Races?.[0];
    }

    if (!race || !race.QualifyingResults || race.QualifyingResults.length === 0) {
      // Fallback: Last completed race is Round 14 (Madrid)
      const lastCompletedRace = schedule.find((r) => r.round === 14) || schedule[schedule.length - 1];
      return lastCompletedRace ? generateUniversalQualifyingSession(lastCompletedRace, liveSession) : null;
    }

    const parseToSec = (str?: string): number | null => {
      if (!str) return null;
      const parts = str.trim().split(':');
      if (parts.length === 2) {
        const m = Number.parseFloat(parts[0]);
        const s = Number.parseFloat(parts[1]);
        if (!Number.isNaN(m) && !Number.isNaN(s)) return m * 60 + s;
      }
      const val = Number.parseFloat(str);
      return Number.isNaN(val) ? null : val;
    };

    const firstResult = race.QualifyingResults[0];
    const poleTimeStr = firstResult?.Q3 || firstResult?.Q2 || firstResult?.Q1 || '';
    const poleSec = parseToSec(poleTimeStr);

    const results: JolpicaQualifyingResult[] = (race.QualifyingResults || []).map((r: RawQualifyingResultItem) => {
      const pos = Number(r.position);
      const code = r.Driver.code || r.Driver.familyName.substring(0, 3).toUpperCase();
      const fullName = `${r.Driver.givenName} ${r.Driver.familyName}`;
      const q1 = r.Q1 || '';
      const q2 = r.Q2 || '';
      const q3 = r.Q3 || '';
      const bestLap = q3 || q2 || q1 || '--:--.---';
      const bestSec = parseToSec(bestLap);

      let gap = '--';
      if (pos === 1) {
        gap = 'POLE';
      } else if (poleSec !== null && bestSec !== null) {
        const diff = bestSec - poleSec;
        gap = `+${diff.toFixed(3)}s`;
      }

      const eliminatedPhase: 'Q1' | 'Q2' | null = pos >= 16 ? 'Q1' : pos >= 11 ? 'Q2' : null;

      return {
        pos,
        driverNumber: Number(r.number),
        code,
        fullName,
        familyName: r.Driver.familyName,
        teamName: r.Constructor.name,
        teamColor: getTeamColor(r.Constructor.constructorId),
        q1,
        q2: q2 || undefined,
        q3: q3 || undefined,
        bestLap,
        gap,
        eliminatedPhase,
        isPole: pos === 1,
      };
    });

    const data: JolpicaQualifyingSession = {
      round: Number(race.round),
      raceName: race.raceName,
      circuitName: race.Circuit.circuitName,
      date: race.date,
      poleDriver: {
        code: results[0]?.code || '',
        fullName: results[0]?.fullName || '',
        teamName: results[0]?.teamName || '',
        time: poleTimeStr,
      },
      results,
    };

    this.qualifyingCache = { timestamp: Date.now(), data };
    return data;
  }

  private raceResultsCache = new Map<
    string,
    { timestamp: number; data: JolpicaRaceDetail | null }
  >();

  async getRaceResults(roundStr = 'last'): Promise<JolpicaRaceDetail | null> {
    const cacheKey = roundStr;
    const cached = this.raceResultsCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTtlMs) {
      return cached.data;
    }

    interface RawResultsResponse {
      MRData?: {
        RaceTable?: {
          season?: string;
          Races?: Array<{
            season?: string;
            round: string;
            raceName: string;
            date: string;
            Circuit: {
              circuitName: string;
            };
            Results?: Array<{
              number: string;
              position: string;
              points: string;
              grid: string;
              laps: string;
              status: string;
              Driver: {
                driverId?: string;
                code?: string;
                givenName: string;
                familyName: string;
              };
              Constructor: {
                constructorId: string;
                name: string;
              };
              Time?: {
                time: string;
              };
              FastestLap?: {
                rank?: string;
                lap?: string;
                Time?: {
                  time: string;
                };
              };
            }>;
          }>;
        };
      };
    }

    let raw = await this.fetchRaw<RawResultsResponse>(`/2026/${roundStr}/results.json`);
    let race = raw?.MRData?.RaceTable?.Races?.[0];

    if (!race || !race.Results || race.Results.length === 0) {
      raw = await this.fetchRaw<RawResultsResponse>(`/current/${roundStr}/results.json`);
      race = raw?.MRData?.RaceTable?.Races?.[0];
    }

    if (!race || !race.Results) {
      return null;
    }

    const winnerTime = race.Results[0]?.Time?.time || 'Ganador';

    let fastestLapInfo: JolpicaRaceDetail['fastestLap'] = undefined;

    const results: JolpicaRaceResult[] = race.Results.map((r) => {
      const pos = Number(r.position);
      const grid = Number(r.grid) || pos;
      const posChange = grid - pos;
      const code = r.Driver.code || r.Driver.familyName.substring(0, 3).toUpperCase();
      const fullName = `${r.Driver.givenName} ${r.Driver.familyName}`;
      const isWinner = pos === 1;
      const isPodium = pos <= 3;
      const isFastestLap = r.FastestLap?.rank === '1';

      if (isFastestLap && r.FastestLap?.Time?.time) {
        fastestLapInfo = {
          code,
          driverName: fullName,
          teamName: r.Constructor.name,
          time: r.FastestLap.Time.time,
          lap: Number(r.FastestLap.lap) || 0,
        };
      }

      let timeOrStatus = r.Time?.time || r.status;
      if (pos > 1 && !r.Time?.time) {
        if (r.status.toLowerCase().includes('lap')) {
          timeOrStatus = r.status;
        } else {
          timeOrStatus = r.status.toUpperCase();
        }
      }

      return {
        pos,
        grid,
        posChange,
        driverNumber: Number(r.number),
        code,
        fullName,
        familyName: r.Driver.familyName,
        teamName: r.Constructor.name,
        teamColor: getTeamColor(r.Constructor.constructorId),
        points: Number(r.points) || 0,
        laps: Number(r.laps) || 0,
        status: r.status,
        timeOrStatus,
        isWinner,
        isPodium,
        isFastestLap,
        fastestLapTime: r.FastestLap?.Time?.time,
        fastestLapRank: r.FastestLap?.rank ? Number(r.FastestLap.rank) : undefined,
      };
    });

    const data: JolpicaRaceDetail = {
      round: Number(race.round),
      season: race.season || '2026',
      raceName: race.raceName,
      circuitName: race.Circuit.circuitName,
      date: race.date,
      winner: {
        code: results[0]?.code || '',
        fullName: results[0]?.fullName || '',
        teamName: results[0]?.teamName || '',
        time: winnerTime,
      },
      fastestLap: fastestLapInfo,
      results,
    };

    this.raceResultsCache.set(cacheKey, { timestamp: Date.now(), data });
    return data;
  }
}
