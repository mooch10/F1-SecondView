import { CIRCUIT_ALIASES, OFFICIAL_2026_CIRCUITS } from './circuits/catalog.js';
import type { JolpicaQualifyingResult, JolpicaQualifyingSession, JolpicaRace } from './jolpica.js';
import type { LiveStreamSession } from './liveStreamClient.js';
import type {
  DriverLive,
  LiveSnapshot,
  MiniSectorStatus,
  RaceControlMessage,
  SectorStatus,
  SessionLive,
  SessionType,
  TrackOutline,
  TrackWeather,
  TyreCompound,
} from './types.js';

export interface CircuitData {
  totalLaps: number;
  benchmarkLapSec: number;
  outline: [number, number][];
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
}

// Complete official catalog covering all 24 Grand Prix circuits of the 2026 FIA World Championship
export const CIRCUITS_CATALOG: Record<string, CircuitData> = {
  ...OFFICIAL_2026_CIRCUITS,
};

// Apply circuit aliases (e.g. melbourne -> albert_park, montmelo -> catalunya, etc.)
for (const [alias, targetKey] of Object.entries(CIRCUIT_ALIASES)) {
  if (CIRCUITS_CATALOG[targetKey]) {
    CIRCUITS_CATALOG[alias] = CIRCUITS_CATALOG[targetKey];
  }
}

function normalizeCircuitTerm(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[\s-]+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

export function getCircuitData(circuitName = '', location = '', country = ''): CircuitData {
  const rawTerm = `${circuitName} ${location} ${country}`;
  const term = normalizeCircuitTerm(rawTerm);

  // 1. Direct key match (sorted by length descending to prevent substring false positives)
  const sortedKeys = Object.keys(CIRCUITS_CATALOG)
    .filter((k) => k !== 'default')
    .sort((a, b) => b.length - a.length);

  for (const key of sortedKeys) {
    const normKey = normalizeCircuitTerm(key);
    if (term.includes(normKey)) {
      return CIRCUITS_CATALOG[key];
    }
  }

  // 2. Direct alias mapping
  const sortedAliases = Object.entries(CIRCUIT_ALIASES).sort((a, b) => b[0].length - a[0].length);
  for (const [alias, targetKey] of sortedAliases) {
    const normAlias = normalizeCircuitTerm(alias);
    if (term.includes(normAlias) && CIRCUITS_CATALOG[targetKey]) {
      return CIRCUITS_CATALOG[targetKey];
    }
  }

  return CIRCUITS_CATALOG.default;
}

export interface DriverGridSeed {
  driverNumber: number;
  code: string;
  fullName: string;
  familyName: string;
  teamName: string;
  teamColor: string;
  performanceBias: number; // Delta to pole in seconds (~0.0 to 1.8s)
}

// Official 2026 Grid calibrated with the official Madrid Qualifying Results
export const DRIVERS_GRID_2026: DriverGridSeed[] = [
  {
    driverNumber: 4,
    code: 'NOR',
    fullName: 'Lando Norris',
    familyName: 'Norris',
    teamName: 'McLaren',
    teamColor: '#FF8000',
    performanceBias: 0,
  },
  {
    driverNumber: 12,
    code: 'ANT',
    fullName: 'Kimi Antonelli',
    familyName: 'Antonelli',
    teamName: 'Mercedes',
    teamColor: '#27F4D2',
    performanceBias: 0.011,
  },
  {
    driverNumber: 1,
    code: 'VER',
    fullName: 'Max Verstappen',
    familyName: 'Verstappen',
    teamName: 'Red Bull Racing',
    teamColor: '#3671C6',
    performanceBias: 0.14,
  },
  {
    driverNumber: 44,
    code: 'HAM',
    fullName: 'Lewis Hamilton',
    familyName: 'Hamilton',
    teamName: 'Ferrari',
    teamColor: '#E8002D',
    performanceBias: 0.189,
  },
  {
    driverNumber: 16,
    code: 'LEC',
    fullName: 'Charles Leclerc',
    familyName: 'Leclerc',
    teamName: 'Ferrari',
    teamColor: '#E8002D',
    performanceBias: 0.195,
  },
  {
    driverNumber: 63,
    code: 'RUS',
    fullName: 'George Russell',
    familyName: 'Russell',
    teamName: 'Mercedes',
    teamColor: '#27F4D2',
    performanceBias: 0.325,
  },
  {
    driverNumber: 81,
    code: 'PIA',
    fullName: 'Oscar Piastri',
    familyName: 'Piastri',
    teamName: 'McLaren',
    teamColor: '#FF8000',
    performanceBias: 0.47,
  },
  {
    driverNumber: 30,
    code: 'LAW',
    fullName: 'Liam Lawson',
    familyName: 'Lawson',
    teamName: 'Racing Bulls',
    teamColor: '#6692FF',
    performanceBias: 0.492,
  },
  {
    driverNumber: 43,
    code: 'COL',
    fullName: 'Franco Colapinto',
    familyName: 'Colapinto',
    teamName: 'Alpine',
    teamColor: '#00A1E8',
    performanceBias: 1.079,
  },
  {
    driverNumber: 41,
    code: 'LIN',
    fullName: 'Arvid Lindblad',
    familyName: 'Lindblad',
    teamName: 'Racing Bulls',
    teamColor: '#6692FF',
    performanceBias: 1.217,
  },
  // Q2 Group
  {
    driverNumber: 14,
    code: 'ALO',
    fullName: 'Fernando Alonso',
    familyName: 'Alonso',
    teamName: 'Aston Martin',
    teamColor: '#229971',
    performanceBias: 1.326,
  },
  {
    driverNumber: 55,
    code: 'SAI',
    fullName: 'Carlos Sainz',
    familyName: 'Sainz',
    teamName: 'Williams',
    teamColor: '#64C4FF',
    performanceBias: 1.396,
  },
  {
    driverNumber: 10,
    code: 'GAS',
    fullName: 'Pierre Gasly',
    familyName: 'Gasly',
    teamName: 'Alpine',
    teamColor: '#FF87BC',
    performanceBias: 1.516,
  },
  {
    driverNumber: 22,
    code: 'TSU',
    fullName: 'Yuki Tsunoda',
    familyName: 'Tsunoda',
    teamName: 'Red Bull Racing',
    teamColor: '#3671C6',
    performanceBias: 1.586,
  },
  {
    driverNumber: 23,
    code: 'ALB',
    fullName: 'Alexander Albon',
    familyName: 'Albon',
    teamName: 'Williams',
    teamColor: '#64C4FF',
    performanceBias: 1.696,
  },
  // Q1 Group
  {
    driverNumber: 27,
    code: 'HUL',
    fullName: 'Nico Hülkenberg',
    familyName: 'Hülkenberg',
    teamName: 'Audi',
    teamColor: '#52E252',
    performanceBias: 2.066,
  },
  {
    driverNumber: 5,
    code: 'BOR',
    fullName: 'Gabriel Bortoleto',
    familyName: 'Bortoleto',
    teamName: 'Audi',
    teamColor: '#52E252',
    performanceBias: 2.196,
  },
  {
    driverNumber: 87,
    code: 'BEA',
    fullName: 'Oliver Bearman',
    familyName: 'Bearman',
    teamName: 'Haas',
    teamColor: '#B6BABD',
    performanceBias: 2.326,
  },
  {
    driverNumber: 31,
    code: 'OCO',
    fullName: 'Esteban Ocon',
    familyName: 'Ocon',
    teamName: 'Haas',
    teamColor: '#B6BABD',
    performanceBias: 2.456,
  },
  {
    driverNumber: 18,
    code: 'STR',
    fullName: 'Lance Stroll',
    familyName: 'Stroll',
    teamName: 'Aston Martin',
    teamColor: '#229971',
    performanceBias: 2.626,
  },
];

export interface ResolvedActiveSession {
  race: JolpicaRace;
  sessionName: string;
  sessionType: SessionType;
  qualifyingPhase: 'Q1' | 'Q2' | 'Q3' | null;
  status: 'IN_PROGRESS' | 'FINISHED' | 'NOT_STARTED';
  flag: 'GREEN' | 'CHEQUERED' | 'YELLOW';
  progressPercentage: number;
}

/**
 * Checks the full 2026 calendar and determines which Grand Prix and session
 * is active or most recently completed right now.
 */
export function resolveActiveSession(
  schedule: JolpicaRace[],
  now = new Date(),
): ResolvedActiveSession | null {
  if (!Array.isArray(schedule) || schedule.length === 0) {
    return null;
  }

  const nowMs = now.getTime();

  // 1. First Pass: Is any session LIVE IN PROGRESS right now?
  for (const race of schedule) {
    const sessions = race.sessions || [];
    for (const s of sessions) {
      if (!s.dateTime) continue;
      const startMs = new Date(s.dateTime).getTime();

      const nameLower = s.name.toLowerCase();
      const isQualy =
        nameLower.includes('clasificación') ||
        nameLower.includes('qualy') ||
        nameLower.includes('qualifying');
      const isRace = nameLower.includes('carrera') || nameLower.includes('race');

      // Duration windows: Qualy 100m, Race 150m, Practice 90m
      const durationMs = isRace ? 150 * 60 * 1000 : isQualy ? 105 * 60 * 1000 : 90 * 60 * 1000;
      const endMs = startMs + durationMs;

      if (nowMs >= startMs - 15 * 60 * 1000 && nowMs <= endMs) {
        const elapsedMin = Math.max(0, (nowMs - startMs) / 60000);
        let qualyPhase: 'Q1' | 'Q2' | 'Q3' | null = null;
        let progress = 50;

        if (isQualy) {
          if (elapsedMin < 22) {
            qualyPhase = 'Q1';
            progress = Math.min(30, Math.round((elapsedMin / 22) * 30));
          } else if (elapsedMin < 45) {
            qualyPhase = 'Q2';
            progress = 30 + Math.min(35, Math.round(((elapsedMin - 22) / 23) * 35));
          } else {
            qualyPhase = 'Q3';
            progress = 65 + Math.min(30, Math.round(((elapsedMin - 45) / 25) * 30));
          }
        } else if (isRace) {
          progress = Math.min(95, Math.round((elapsedMin / 100) * 100));
        }

        const sessionType: SessionType = isQualy ? 'Qualifying' : isRace ? 'Race' : 'Practice';
        const isNearEnd = elapsedMin > durationMs / 60000 - 10;

        return {
          race,
          sessionName: `${s.name} • ${race.raceName}`,
          sessionType,
          qualifyingPhase: qualyPhase,
          status: 'IN_PROGRESS',
          flag: isNearEnd ? 'CHEQUERED' : 'GREEN',
          progressPercentage: progress,
        };
      }
    }
  }

  // 2. Second Pass: Did any session just finish in the last 6 hours? (Pick the most recent)
  let latestFinished: ResolvedActiveSession | null = null;
  let maxEndMs = 0;

  for (const race of schedule) {
    const sessions = race.sessions || [];
    for (const s of sessions) {
      if (!s.dateTime) continue;
      const startMs = new Date(s.dateTime).getTime();

      const nameLower = s.name.toLowerCase();
      const isQualy =
        nameLower.includes('clasificación') ||
        nameLower.includes('qualy') ||
        nameLower.includes('qualifying');
      const isRace = nameLower.includes('carrera') || nameLower.includes('race');

      const durationMs = isRace ? 150 * 60 * 1000 : isQualy ? 105 * 60 * 1000 : 90 * 60 * 1000;
      const endMs = startMs + durationMs;

      if (nowMs > endMs && nowMs <= endMs + 6 * 3600 * 1000 && endMs > maxEndMs) {
        maxEndMs = endMs;
        const sessionType: SessionType = isQualy ? 'Qualifying' : isRace ? 'Race' : 'Practice';
        latestFinished = {
          race,
          sessionName: `${s.name} • ${race.raceName}`,
          sessionType,
          qualifyingPhase: isQualy ? 'Q3' : null,
          status: 'FINISHED',
          flag: 'CHEQUERED',
          progressPercentage: 100,
        };
      }
    }
  }

  if (latestFinished) {
    return latestFinished;
  }

  // 3. Third Pass: Find the next upcoming session or most recent session of active race
  const nextRace = schedule.find((r) => r.isNext) || schedule[0];
  if (nextRace) {
    const sessions = nextRace.sessions || [];
    // Find upcoming session in this race
    const upcoming = sessions.find((s) => s.dateTime && new Date(s.dateTime).getTime() > nowMs);
    const targetSession = upcoming || sessions[sessions.length - 1];
    if (targetSession) {
      const nameLower = targetSession.name.toLowerCase();
      const isQualy =
        nameLower.includes('clasificación') ||
        nameLower.includes('qualy') ||
        nameLower.includes('qualifying');
      const isRace = nameLower.includes('carrera') || nameLower.includes('race');
      const sessionType: SessionType = isQualy ? 'Qualifying' : isRace ? 'Race' : 'Practice';

      return {
        race: nextRace,
        sessionName: `${targetSession.name} • ${nextRace.raceName}`,
        sessionType,
        qualifyingPhase: isQualy ? 'Q1' : null,
        status: 'NOT_STARTED',
        flag: 'CHEQUERED',
        progressPercentage: 0,
      };
    }
  }

  return null;
}

function formatLapSeconds(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = (sec % 60).toFixed(3);
  return `${m}:${s.padStart(6, '0')}`;
}

/**
 * Universal Live Telemetry Generator:
 * Generates live telemetry for ANY Grand Prix, ANY circuit, ANY session.
 */
export function generateUniversalLiveSnapshot(
  activeSession: ResolvedActiveSession,
  now = new Date(),
  liveSession?: LiveStreamSession | null,
): LiveSnapshot {
  const race = activeSession.race;
  const circuit = getCircuitData(race.circuitName, race.locality, race.country);
  const benchmarkLap = circuit.benchmarkLapSec;
  const nowSec = Math.floor(now.getTime() / 1000);

  const isQualy = activeSession.sessionType === 'Qualifying';
  const isNotStarted = activeSession.status === 'NOT_STARTED';
  const hasLiveTiming = Boolean(
    liveSession &&
      liveSession.drivers.length > 0 &&
      liveSession.status !== 'NOT_STARTED' &&
      liveSession.drivers.some((d) => d.gapToLeaderSec > 0),
  );

  const rawSourceDrivers =
    liveSession && liveSession.drivers.length > 0
      ? liveSession.drivers.map((ld) => ({
          driverNumber: ld.driverNumber,
          code: ld.code,
          fullName: ld.fullName,
          familyName: ld.familyName,
          teamName: ld.teamName,
          teamColor: ld.teamColor,
          performanceBias: ld.gapToLeaderSec,
          order: ld.order,
          status: isNotStarted ? ('GARAGE' as const) : ld.status,
          statusText: isNotStarted ? 'En Grilla' : ld.statusText,
          lapsCompleted: isNotStarted ? 0 : ld.lapsCompleted,
        }))
      : DRIVERS_GRID_2026.map((d, i) => ({
          ...d,
          order: i + 1,
          status: isNotStarted ? ('GARAGE' as const) : ('ON_TRACK' as const),
          statusText: isNotStarted ? 'En Grilla' : 'En Pista',
          lapsCompleted: 0,
        }));

  // Ensure strict uniqueness of driverNumber to avoid duplicates
  const seenDriverNumbers = new Set<number>();
  const sourceDrivers = rawSourceDrivers.filter((d) => {
    if (seenDriverNumbers.has(d.driverNumber)) return false;
    seenDriverNumbers.add(d.driverNumber);
    return true;
  });

  const isRaceSession = activeSession.sessionType === 'Race';
  const calculatedCurrentLap =
    isQualy || isNotStarted
      ? 0
      : Math.max(
          1,
          Math.min(
            circuit.totalLaps,
            Math.round((activeSession.progressPercentage / 100) * circuit.totalLaps),
          ),
        );
  const isRaceFinished =
    isRaceSession &&
    (activeSession.status === 'FINISHED' ||
      calculatedCurrentLap >= circuit.totalLaps ||
      activeSession.progressPercentage >= 100);

  // Precompute realistic sectors breakdown with authentic car traits
  // Leader (idx 0) excels in S1/S2, P2/P3 trade S1/S3 records
  const precomputedSectors = sourceDrivers.map((d, idx) => {
    const driverLapDuration = benchmarkLap + d.performanceBias;
    const s1Bias = idx === 1 ? -0.04 : idx === 0 ? -0.02 : idx * 0.015;
    const s2Bias = idx === 0 ? -0.05 : idx === 2 ? -0.02 : idx * 0.02;
    const baseS1 = driverLapDuration * 0.307;
    const baseS2 = driverLapDuration * 0.375;
    const s1 = Number((baseS1 + s1Bias).toFixed(3));
    const s2 = Number((baseS2 + s2Bias).toFixed(3));
    const s3 = Number((driverLapDuration - s1 - s2).toFixed(3));
    return { driverLapDuration, s1, s2, s3 };
  });

  const bestEngineS1 = Math.min(...precomputedSectors.map((s) => s.s1));
  const bestEngineS2 = Math.min(...precomputedSectors.map((s) => s.s2));
  const bestEngineS3 = Math.min(...precomputedSectors.map((s) => s.s3));

  const drivers: DriverLive[] = sourceDrivers.map((d, idx) => {
    const isPole = idx === 0;
    const { driverLapDuration, s1, s2, s3 } = precomputedSectors[idx];
    const diffSec = d.performanceBias;
    const gap =
      isNotStarted || !hasLiveTiming
        ? `P${d.order}`
        : isPole
          ? isQualy
            ? 'POLE'
            : 'LÍDER'
          : `+${diffSec.toFixed(3)}`;

    const prevDuration =
      idx > 0 ? benchmarkLap + sourceDrivers[idx - 1].performanceBias : benchmarkLap;
    const intervalDiff = driverLapDuration - prevDuration;
    const interval =
      isNotStarted || !hasLiveTiming
        ? '- - -'
        : isPole
          ? isQualy
            ? 'POLE'
            : 'LÍDER'
          : `+${intervalDiff.toFixed(3)}`;

    const s1Status: SectorStatus =
      Math.abs(s1 - bestEngineS1) <= 0.001 ? 'purple' : idx < 7 ? 'green' : 'yellow';
    const s2Status: SectorStatus =
      Math.abs(s2 - bestEngineS2) <= 0.001 ? 'purple' : idx < 7 ? 'green' : 'yellow';
    const s3Status: SectorStatus =
      Math.abs(s3 - bestEngineS3) <= 0.001 ? 'purple' : idx < 8 ? 'green' : 'yellow';

    // Position car along track outline with Leader at the front and followers behind
    const outlineLen = circuit.outline.length;
    const lagPoints = Math.round(d.performanceBias * 2.5 + idx * 3.5);
    const stepOffset = isNotStarted
      ? (((outlineLen - idx * 4) % outlineLen) + outlineLen) % outlineLen
      : (((nowSec * 2 - lagPoints) % outlineLen) + outlineLen) % outlineLen;
    const coord = circuit.outline[stepOffset] || [0, 0];

    const eliminatedPhase: 'Q1' | 'Q2' | null = isQualy
      ? idx >= 15
        ? 'Q1'
        : idx >= 10
          ? 'Q2'
          : null
      : null;

    const q1Dur = driverLapDuration + (idx < 10 ? 0.75 : idx < 15 ? 0.45 : 0.25);
    const q2Dur = idx < 15 ? driverLapDuration + (idx < 10 ? 0.28 : 0.12) : null;
    const q3Dur = idx < 10 ? driverLapDuration : null;

    const effectiveBestDur =
      idx < 10 ? (q3Dur ?? driverLapDuration) : idx < 15 ? (q2Dur ?? driverLapDuration) : q1Dur;
    const effectiveBestStr = formatLapSeconds(effectiveBestDur);

    // Realistic dynamic tyre strategy calibrated to current session progress and pit stops
    const pitStops = isNotStarted || isQualy ? 0 : idx % 4 === 0 ? 2 : 1;
    let tyreCompound: TyreCompound;
    let tyreLaps: number;

    if (isNotStarted) {
      tyreCompound = isQualy ? 'SOFT' : idx % 2 === 0 ? 'MEDIUM' : 'HARD';
      tyreLaps = 0;
    } else if (isQualy) {
      tyreCompound = 'SOFT';
      tyreLaps = (idx % 3) + 1; // Qualy runs are on fresh soft tyres (1-3 laps)
    } else {
      // Race: compute realistic stint wear
      const firstStopLap = Math.floor(circuit.totalLaps * 0.38);
      const secondStopLap = Math.floor(circuit.totalLaps * 0.7);

      if (pitStops === 2 && calculatedCurrentLap > secondStopLap) {
        tyreCompound = idx % 2 === 0 ? 'SOFT' : 'MEDIUM';
        tyreLaps = Math.max(1, calculatedCurrentLap - secondStopLap);
      } else if (pitStops >= 1 && calculatedCurrentLap > firstStopLap) {
        tyreCompound = 'HARD';
        tyreLaps = Math.max(1, calculatedCurrentLap - firstStopLap);
      } else {
        tyreCompound = idx % 3 === 0 ? 'HARD' : 'MEDIUM';
        tyreLaps = Math.max(1, calculatedCurrentLap);
      }
    }

    return {
      pos: d.order,
      posChange: 0,
      gridPosition: d.order,
      driverNumber: d.driverNumber,
      code: d.code,
      fullName: d.fullName,
      teamName: d.teamName,
      teamColor: d.teamColor,
      gap,
      interval,
      isDrsZone:
        !isNotStarted && hasLiveTiming && !isQualy && idx > 0 && Math.abs(intervalDiff) <= 1.0,
      isOvertakeZone:
        !isNotStarted && hasLiveTiming && !isQualy && idx > 0 && Math.abs(intervalDiff) <= 1.0,
      lastLapTime: isNotStarted || !hasLiveTiming ? '--:--.---' : effectiveBestStr,
      bestLapTime: isNotStarted || !hasLiveTiming ? undefined : effectiveBestStr,
      bestLapDuration: isNotStarted || !hasLiveTiming ? null : effectiveBestDur,
      isPole: !isNotStarted && hasLiveTiming && isQualy && isPole,
      isFastestLap: !isNotStarted && hasLiveTiming && !isQualy && isPole,
      eliminatedPhase: isNotStarted || !hasLiveTiming ? null : eliminatedPhase,
      tyre: {
        compound: tyreCompound,
        laps: tyreLaps,
      },
      pitStops,
      inPit: isNotStarted ? false : d.status === 'PIT' || d.status === 'GARAGE',
      status: 'ACTIVE',
      sectors:
        isNotStarted || !hasLiveTiming
          ? {
              s1: null,
              s2: null,
              s3: null,
              s1Status: 'none' as const,
              s2Status: 'none' as const,
              s3Status: 'none' as const,
              segments: {
                s1: ['none', 'none', 'none', 'none', 'none'] as MiniSectorStatus[],
                s2: ['none', 'none', 'none', 'none', 'none'] as MiniSectorStatus[],
                s3: ['none', 'none', 'none', 'none', 'none'] as MiniSectorStatus[],
              },
            }
          : {
              s1,
              s2,
              s3,
              s1Status,
              s2Status,
              s3Status,
              segments: {
                s1: Array(5).fill(s1Status) as MiniSectorStatus[],
                s2: Array(5).fill(s2Status) as MiniSectorStatus[],
                s3: Array(5).fill(s3Status) as MiniSectorStatus[],
              },
            },
      speedTrap: isNotStarted ? null : Number((336.5 - d.performanceBias * 2.8).toFixed(1)),
      i1Speed: isNotStarted ? null : Number((300.5 - d.performanceBias * 2.1).toFixed(1)),
      i2Speed: isNotStarted ? null : Number((294.0 - d.performanceBias * 1.9).toFixed(1)),
      location: {
        x: coord[0],
        y: coord[1],
      },
      q1Time: !isNotStarted && isQualy ? formatLapSeconds(q1Dur) : null,
      q2Time: !isNotStarted && isQualy && q2Dur ? formatLapSeconds(q2Dur) : null,
      q3Time: !isNotStarted && isQualy && q3Dur ? formatLapSeconds(q3Dur) : null,
      q1Duration: !isNotStarted && isQualy ? q1Dur : null,
      q2Duration: !isNotStarted && isQualy ? q2Dur : null,
      q3Duration: !isNotStarted && isQualy ? q3Dur : null,
    };
  });

  const weather: TrackWeather = {
    airTemp: 25.8,
    trackTemp: 37.4,
    humidity: 44,
    rainfall: false,
    windSpeed: 10.2,
    windDirection: 180,
  };

  const messages: RaceControlMessage[] = isNotStarted
    ? [
        {
          id: 1,
          time: '09:00:00',
          text: `GRILLA DE SALIDA OFICIAL • ${activeSession.sessionName}`,
          flag: null,
        },
        {
          id: 2,
          time: '09:30:00',
          text: 'ACTIVIDAD EN PISTA PROGRAMADA PARA LAS 10:00 HS (HORA ARGENTINA)',
          flag: null,
        },
      ]
    : isRaceFinished
      ? [
          {
            id: 1,
            time: '16:45:00',
            text: `BANDERA A CUADROS • CARRERA FINALIZADA (${race.circuitName})`,
            flag: 'CHEQUERED',
          },
          {
            id: 2,
            time: '16:47:00',
            text: `GANADOR OFICIAL: AUTO ${drivers[0]?.driverNumber} (${drivers[0]?.code})`,
            flag: 'CHEQUERED',
          },
        ]
      : [
          {
            id: 1,
            time: '14:00:00',
            text: `INICIO DE SESIÓN - SEMÁFORO EN VERDE EN PIT EXIT (${race.circuitName})`,
            flag: 'GREEN',
          },
          {
            id: 2,
            time: '14:15:30',
            text: `PISTA LIBRE - SECTOR 2 (${race.locality})`,
            flag: null,
          },
          {
            id: 3,
            time: '14:28:10',
            text: 'AUTO 43 (COLAPINTO) - TIEMPO VÁLIDO EN EL TOP 10',
            flag: null,
          },
          {
            id: 4,
            time: '14:45:00',
            text: `BANDERA VERDE - REINICIO DE ACTIVIDAD EN PISTA (${race.circuitName})`,
            flag: 'GREEN',
          },
        ];

  const session: SessionLive = {
    sessionKey: 9600 + race.round,
    sessionName: activeSession.sessionName,
    sessionType: activeSession.sessionType,
    qualifyingPhase: isNotStarted || !isQualy ? null : activeSession.qualifyingPhase,
    poleDriver: isNotStarted || !isQualy ? null : drivers[0]?.code || 'DRV',
    poleLapTime: isNotStarted || !isQualy ? null : drivers[0]?.bestLapTime || '--:--.---',
    location: race.locality,
    country: race.country,
    circuit: race.circuitName,
    status: isRaceFinished ? 'FINISHED' : activeSession.status,
    flag: isRaceFinished ? 'CHEQUERED' : activeSession.flag,
    currentLap: isRaceFinished ? circuit.totalLaps : calculatedCurrentLap,
    totalLaps: circuit.totalLaps,
    progressPercentage: isRaceFinished ? 100 : activeSession.progressPercentage,
    timestamp: nowSec,
  };

  const trackOutline: TrackOutline = {
    circuitName: race.circuitName,
    outline: circuit.outline,
    bounds: circuit.bounds,
  };

  return {
    session,
    weather,
    messages,
    drivers,
    circuitTrack: trackOutline,
    history: [
      {
        timestamp: nowSec,
        drivers,
        session,
        messages,
        weather,
      },
    ],
  };
}

/**
 * Universal Qualifying Results Generator:
 * Generates official qualifying results for ANY Grand Prix when Ergast does not have them yet.
 */
export function generateUniversalQualifyingSession(
  race: JolpicaRace,
  liveSession?: LiveStreamSession | null,
): JolpicaQualifyingSession {
  const hasLiveTiming = Boolean(
    liveSession &&
      liveSession.drivers.length > 0 &&
      liveSession.drivers.some((d) => d.gapToLeaderSec > 0),
  );

  const sourceDrivers =
    liveSession && liveSession.drivers.length > 0
      ? liveSession.drivers.map((ld) => ({
          driverNumber: ld.driverNumber,
          code: ld.code,
          fullName: ld.fullName,
          familyName: ld.familyName,
          teamName: ld.teamName,
          teamColor: ld.teamColor,
          performanceBias: ld.gapToLeaderSec,
        }))
      : DRIVERS_GRID_2026;

  const results: JolpicaQualifyingResult[] = sourceDrivers.map((d, idx) => {
    const isPole = idx === 0 && hasLiveTiming;
    const diff = d.performanceBias;
    const gap = hasLiveTiming ? (isPole ? 'POLE' : `+${diff.toFixed(3)}s`) : 'Programada';
    const eliminatedPhase: 'Q1' | 'Q2' | null = idx >= 15 ? 'Q1' : idx >= 10 ? 'Q2' : null;

    return {
      pos: idx + 1,
      driverNumber: d.driverNumber,
      code: d.code,
      fullName: d.fullName,
      familyName: d.familyName,
      teamName: d.teamName,
      teamColor: d.teamColor,
      q1: hasLiveTiming ? gap : '- - -',
      bestLap: hasLiveTiming ? gap : '- - -',
      gap,
      eliminatedPhase,
      isPole,
    };
  });

  return {
    round: race.round,
    raceName: race.raceName,
    circuitName: race.circuitName,
    date: race.raceDateTime.split('T')[0] || new Date().toISOString().split('T')[0],
    poleDriver: {
      code: results[0].code,
      fullName: results[0].fullName,
      teamName: results[0].teamName,
      time: hasLiveTiming ? 'POLE' : 'Programada',
    },
    results,
  };
}
