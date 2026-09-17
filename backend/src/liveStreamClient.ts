import type { SessionType } from './types.js';
import { DRIVERS_GRID_2026, type DriverGridSeed } from './universalLiveEngine.js';

export interface LiveStreamDriver {
  order: number;
  driverNumber: number;
  code: string;
  fullName: string;
  familyName: string;
  teamName: string;
  teamColor: string;
  status: 'ON_TRACK' | 'PIT' | 'GARAGE' | 'OUT';
  statusText: string;
  lapsCompleted: number;
  gapToLeaderSec: number;
  intervalSec: number;
}

export interface LiveStreamSession {
  eventName: string;
  circuitName: string;
  circuitCity: string;
  circuitCountry: string;
  competitionId: string;
  sessionName: string;
  sessionType: SessionType;
  status: 'IN_PROGRESS' | 'FINISHED' | 'NOT_STARTED';
  statusDescription: string;
  period: number;
  displayClock: string;
  drivers: LiveStreamDriver[];
  lastUpdated: number;
}

interface EspnStatistic {
  name?: string;
  value?: number;
}

interface EspnCompetitor {
  order?: number;
  athlete?: {
    displayName?: string;
    fullName?: string;
  };
  vehicle?: {
    number?: string | number;
    manufacturer?: string;
    teamColor?: string;
  };
  status?: {
    type?: {
      name?: string;
    };
    displayValue?: string;
  };
  statistics?: EspnStatistic[];
}

interface EspnCompetition {
  id?: string;
  type?: {
    id?: string;
    text?: string;
    abbreviation?: string;
  };
  status?: {
    period?: number;
    displayClock?: string;
    type?: {
      state?: string;
      description?: string;
    };
  };
  competitors?: EspnCompetitor[];
}

interface EspnEvent {
  name?: string;
  circuit?: {
    fullName?: string;
    address?: {
      city?: string;
      country?: string;
    };
  };
  competitions?: EspnCompetition[];
}

interface EspnScoreboardResponse {
  events?: EspnEvent[];
}

export class LiveStreamClient {
  private cache: { timestamp: number; data: LiveStreamSession | null } = {
    timestamp: 0,
    data: null,
  };
  private readonly CACHE_TTL_MS = 3500; // 3.5 seconds cache

  public async getLiveStream(): Promise<LiveStreamSession | null> {
    const now = Date.now();
    if (this.cache.data && now - this.cache.timestamp < this.CACHE_TTL_MS) {
      return this.cache.data;
    }

    try {
      const res = await fetch(
        'https://site.api.espn.com/apis/site/v2/sports/racing/f1/scoreboard',
        {
          headers: {
            Accept: 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) F1LiveHub/1.0',
          },
        },
      );

      if (!res.ok) {
        console.warn(`[LiveStream] Scoreboard returned HTTP ${res.status}`);
        return this.cache.data;
      }

      const json = (await res.json()) as EspnScoreboardResponse;
      const event = json.events?.[0];
      if (!event || !Array.isArray(event.competitions) || event.competitions.length === 0) {
        return null;
      }

      // Prioritize active competition in progress, then most recent completed
      const comps = event.competitions;
      const activeComp =
        comps.find((c) => c.status?.type?.state === 'in') ||
        comps
          .slice()
          .reverse()
          .find((c) => c.status?.type?.state === 'post' && (c.competitors?.length ?? 0) > 0) ||
        comps[0];

      if (
        !activeComp ||
        !Array.isArray(activeComp.competitors) ||
        activeComp.competitors.length === 0
      ) {
        return null;
      }

      const compType = activeComp.type?.abbreviation || activeComp.type?.id || '';
      let sessionType: SessionType = 'Race';
      let sessionName = 'Carrera';
      if (compType.includes('Qual') || compType === '2') {
        sessionType = 'Qualifying';
        sessionName = 'Clasificación';
      } else if (compType.includes('FP') || compType === '1') {
        sessionType = 'Practice';
        sessionName = activeComp.type?.text || `Práctica Libre ${activeComp.id?.slice(-1) || '1'}`;
      }

      const state = activeComp.status?.type?.state;
      const status: 'IN_PROGRESS' | 'FINISHED' | 'NOT_STARTED' =
        state === 'in' ? 'IN_PROGRESS' : state === 'post' ? 'FINISHED' : 'NOT_STARTED';

      const drivers: LiveStreamDriver[] = [];
      const competitors = [...activeComp.competitors].sort(
        (a, b) => (a.order || 99) - (b.order || 99),
      );

      const assignedDriverNumbers = new Set<number>();

      for (let i = 0; i < competitors.length; i++) {
        const c = competitors[i];
        const order = c.order || i + 1;
        const displayName = c.athlete?.displayName || c.athlete?.fullName || 'Piloto F1';
        const nameParts = displayName.trim().split(/\s+/);
        const familyName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : displayName;

        // Match against 2026 driver dictionary (excluding already assigned drivers)
        const seed = this.matchDriverSeed(
          displayName,
          familyName,
          c.vehicle?.number !== undefined ? String(c.vehicle.number) : undefined,
          assignedDriverNumbers,
        );
        let finalDriverNumber =
          seed?.driverNumber ?? (c.vehicle?.number ? Number(c.vehicle.number) : i + 1);

        if (assignedDriverNumbers.has(finalDriverNumber)) {
          const unusedSeed = DRIVERS_GRID_2026.find(
            (d) => !assignedDriverNumbers.has(d.driverNumber),
          );
          if (unusedSeed) {
            finalDriverNumber = unusedSeed.driverNumber;
          }
        }
        assignedDriverNumbers.add(finalDriverNumber);

        const statusDetail = (c.status?.type?.name || c.status?.displayValue || '').toUpperCase();
        let trackStatus: 'ON_TRACK' | 'PIT' | 'GARAGE' | 'OUT' = 'ON_TRACK';
        if (statusDetail.includes('PIT')) trackStatus = 'PIT';
        else if (statusDetail.includes('GARAGE')) trackStatus = 'GARAGE';
        else if (statusDetail.includes('OUT') || statusDetail.includes('DNF')) trackStatus = 'OUT';

        // Extract authentic gaps and laps from statistics if provided by scoreboard
        const statGap = c.statistics?.find(
          (s) => s.name === 'gapToLeader' || s.name === 'behind',
        )?.value;
        const statInterval = c.statistics?.find((s) => s.name === 'interval')?.value;
        const statLaps = c.statistics?.find(
          (s) => s.name === 'lapsCompleted' || s.name === 'laps',
        )?.value;

        const gapToLeaderSec = typeof statGap === 'number' ? statGap : 0;
        const intervalSec = typeof statInterval === 'number' ? statInterval : 0;
        const lapsCompleted = typeof statLaps === 'number' ? statLaps : 0;

        drivers.push({
          order,
          driverNumber: finalDriverNumber,
          code: seed?.code ?? familyName.slice(0, 3).toUpperCase(),
          fullName: seed?.fullName ?? displayName,
          familyName: seed?.familyName ?? familyName,
          teamName: seed?.teamName ?? (c.vehicle?.manufacturer || 'F1 Team'),
          teamColor:
            seed?.teamColor ?? (c.vehicle?.teamColor ? `#${c.vehicle.teamColor}` : '#E10600'),
          status: trackStatus,
          statusText:
            c.status?.displayValue || (trackStatus === 'ON_TRACK' ? 'En Pista' : 'En Boxes'),
          lapsCompleted,
          gapToLeaderSec,
          intervalSec,
        });
      }

      const session: LiveStreamSession = {
        eventName: event.name || 'Gran Premio de España',
        circuitName: event.circuit?.fullName || 'Circuito de Madrid',
        circuitCity: event.circuit?.address?.city || 'Madrid',
        circuitCountry: event.circuit?.address?.country || 'España',
        competitionId: activeComp.id || '',
        sessionName,
        sessionType,
        status,
        statusDescription:
          activeComp.status?.type?.description ||
          (status === 'IN_PROGRESS' ? 'En Vivo' : 'Finalizada'),
        period: activeComp.status?.period || 1,
        displayClock: activeComp.status?.displayClock || '0:00',
        drivers,
        lastUpdated: now,
      };

      this.cache = { timestamp: now, data: session };
      return session;
    } catch (err) {
      console.warn('[LiveStream] Failed to fetch live stream:', err);
      return this.cache.data;
    }
  }

  private matchDriverSeed(
    displayName: string,
    familyName: string,
    vehicleNum?: string,
    assigned?: Set<number>,
  ): DriverGridSeed | undefined {
    const dLower = displayName.toLowerCase();
    const fLower = familyName.toLowerCase();
    const num = vehicleNum ? Number(vehicleNum) : null;

    if (num) {
      const byNum = DRIVERS_GRID_2026.find(
        (d) => d.driverNumber === num && (!assigned || !assigned.has(d.driverNumber)),
      );
      if (byNum) return byNum;
    }

    return DRIVERS_GRID_2026.find((d) => {
      if (assigned?.has(d.driverNumber)) return false;
      const seedFull = d.fullName.toLowerCase();
      const seedFam = d.familyName.toLowerCase();
      return (
        seedFull.includes(fLower) ||
        dLower.includes(seedFam) ||
        seedFam.includes(fLower) ||
        fLower.includes(seedFam)
      );
    });
  }
}

export const liveStreamClient = new LiveStreamClient();
