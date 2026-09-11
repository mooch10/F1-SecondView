import type { LastRacePodium } from './types.js';

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

    const raw = await this.fetchRaw<RawScheduleResponse>('/current.json');
    if (!raw?.MRData?.RaceTable?.Races) {
      return this.scheduleCache?.data || [];
    }

    const now = new Date().toISOString();
    let foundNext = false;

    const races: JolpicaRace[] = raw.MRData.RaceTable.Races.map((r) => {
      const raceDateTime = formatSessionDateTime(r.date, r.time, '12:00:00Z');
      const isPast = raceDateTime < now;
      let isNext = false;

      if (!isPast && !foundNext) {
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

      return {
        round: Number(r.round),
        raceName: r.raceName,
        circuitName: r.Circuit.circuitName,
        locality: r.Circuit.Location.locality,
        country: r.Circuit.Location.country,
        raceDateTime,
        sessions,
        isNext,
      };
    });

    this.scheduleCache = { timestamp: Date.now(), data: races };
    return races;
  }

  async getStandings(): Promise<{
    drivers: JolpicaDriverStanding[];
    constructors: JolpicaConstructorStanding[];
  }> {
    if (this.standingsCache && Date.now() - this.standingsCache.timestamp < this.cacheTtlMs) {
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

    const [rawDrivers, rawConstructors] = await Promise.all([
      this.fetchRaw<RawDriversResponse>('/current/driverStandings.json'),
      this.fetchRaw<RawConstructorsResponse>('/current/constructorStandings.json'),
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
    this.standingsCache = { timestamp: Date.now(), data: result };
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

    let raw = await this.fetchRaw<RawLastRaceResponse>('/current/last/results.json');
    let race = raw?.MRData?.RaceTable?.Races?.[0];

    if (!race || !race.Results || race.Results.length === 0) {
      raw = await this.fetchRaw<RawLastRaceResponse>('/2024/last/results.json');
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
}
