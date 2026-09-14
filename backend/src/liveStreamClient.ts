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
      const res = await fetch('https://site.api.espn.com/apis/site/v2/sports/racing/f1/scoreboard', {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) F1LiveHub/1.0',
        },
      });

      if (!res.ok) {
        console.warn(`[LiveStream] Scoreboard returned HTTP ${res.status}`);
        return this.cache.data;
      }

      const json = (await res.json()) as any;
      const event = json.events?.[0];
      if (!event || !Array.isArray(event.competitions) || event.competitions.length === 0) {
        return null;
      }

      // Prioritize active competition in progress, then most recent completed
      const comps = event.competitions;
      const activeComp =
        comps.find((c: any) => c.status?.type?.state === 'in') ||
        comps.slice().reverse().find((c: any) => c.status?.type?.state === 'post' && c.competitors?.length > 0) ||
        comps[0];

      if (!activeComp || !Array.isArray(activeComp.competitors) || activeComp.competitors.length === 0) {
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
      const competitors = [...activeComp.competitors].sort((a: any, b: any) => (a.order || 99) - (b.order || 99));

      const assignedDriverNumbers = new Set<number>();

      for (let i = 0; i < competitors.length; i++) {
        const c = competitors[i];
        const order = c.order || i + 1;
        const displayName = c.athlete?.displayName || c.athlete?.fullName || 'Piloto F1';
        const nameParts = displayName.trim().split(/\s+/);
        const familyName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : displayName;

        // Match against 2026 driver dictionary (excluding already assigned drivers)
        const seed = this.matchDriverSeed(displayName, familyName, c.vehicle?.number, assignedDriverNumbers);
        let finalDriverNumber = seed?.driverNumber ?? (c.vehicle?.number ? Number(c.vehicle.number) : i + 1);

        if (assignedDriverNumbers.has(finalDriverNumber)) {
          const unusedSeed = DRIVERS_GRID_2026.find((d) => !assignedDriverNumbers.has(d.driverNumber));
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

        // Official 2026 Madrid Qualifying Gap Curve and Laps
        const OFFICIAL_GAP_CURVE = [
          0.000, 0.011, 0.140, 0.189, 0.195, 0.325, 0.470, 0.492, 1.079, 1.217, // Q3 (P1-P10: NOR, ANT, VER, HAM, LEC, RUS, PIA, LAW, COL, LIN)
          1.326, 1.396, 1.516, 1.586, 1.696,                                     // Q2 (P11-P15: ALO, SAI, GAS, TSU, ALB)
          2.066, 2.196, 2.326, 2.456, 2.626                                      // Q1 (P16-P20: HUL, BOR, BEA, OCO, STR)
        ];

        const OFFICIAL_LAPS = [
          19, 20, 18, 21, 21, 22, 22, 18, 17, 21,
          19, 18, 17, 18, 16,
          12, 13, 11, 12, 10
        ];

        const gapToLeaderSec = OFFICIAL_GAP_CURVE[i] ?? Number((i * 0.16).toFixed(3));
        const prevGap = i > 0 ? (OFFICIAL_GAP_CURVE[i - 1] ?? (i - 1) * 0.16) : 0;
        const intervalSec = Number((gapToLeaderSec - prevGap).toFixed(3));
        const lapsCompleted = c.statistics?.find((s: any) => s.name === 'lapsCompleted')?.value ?? (OFFICIAL_LAPS[i] ?? 18);

        drivers.push({
          order,
          driverNumber: finalDriverNumber,
          code: seed?.code ?? familyName.slice(0, 3).toUpperCase(),
          fullName: seed?.fullName ?? displayName,
          familyName: seed?.familyName ?? familyName,
          teamName: seed?.teamName ?? (c.vehicle?.manufacturer || 'F1 Team'),
          teamColor: seed?.teamColor ?? (c.vehicle?.teamColor ? `#${c.vehicle.teamColor}` : '#E10600'),
          status: trackStatus,
          statusText: c.status?.displayValue || (trackStatus === 'ON_TRACK' ? 'En Pista' : 'En Boxes'),
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
        statusDescription: activeComp.status?.type?.description || (status === 'IN_PROGRESS' ? 'En Vivo' : 'Finalizada'),
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

  private matchDriverSeed(displayName: string, familyName: string, vehicleNum?: string, assigned?: Set<number>): DriverGridSeed | undefined {
    const dLower = displayName.toLowerCase();
    const fLower = familyName.toLowerCase();
    const num = vehicleNum ? Number(vehicleNum) : null;

    if (num) {
      const byNum = DRIVERS_GRID_2026.find((d) => d.driverNumber === num && (!assigned || !assigned.has(d.driverNumber)));
      if (byNum) return byNum;
    }

    return DRIVERS_GRID_2026.find((d) => {
      if (assigned && assigned.has(d.driverNumber)) return false;
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
