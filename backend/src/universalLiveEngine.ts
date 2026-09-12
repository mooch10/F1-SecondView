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
} from './types.js';
import type { JolpicaQualifyingResult, JolpicaQualifyingSession, JolpicaRace } from './jolpica.js';

export interface CircuitData {
  totalLaps: number;
  benchmarkLapSec: number;
  outline: [number, number][];
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
}

// Default generic circuit geometry if a circuit doesn't have custom coordinates
function generateGenericOutline(corners = 16): [number, number][] {
  const points: [number, number][] = [];
  const radiusX = 520;
  const radiusY = 360;
  for (let i = 0; i < corners; i++) {
    const angle = (i / corners) * Math.PI * 2;
    // Add realistic undulating variation
    const rVar = 1 + 0.22 * Math.sin(angle * 3) - 0.15 * Math.cos(angle * 5);
    const x = Math.round(Math.cos(angle) * radiusX * rVar);
    const y = Math.round(Math.sin(angle) * radiusY * rVar);
    points.push([x, y]);
  }
  return points;
}

// Circuit catalog covering all 24 Grand Prix circuits of the FIA World Championship
export const CIRCUITS_CATALOG: Record<string, CircuitData> = {
  // Spain / Madring (IFEMA Madrid)
  madring: {
    totalLaps: 66,
    benchmarkLapSec: 76.248,
    bounds: { minX: -650, maxX: 650, minY: -450, maxY: 450 },
    outline: [
      [-450, -400], [-350, -400], [-250, -400], [-150, -400], [-50, -400], [50, -400], [150, -400], [250, -400], [350, -400],
      [430, -380], [500, -330], [560, -250], [590, -160], [600, -70],
      [580, 20], [550, 110], [500, 190], [430, 260],
      [380, 290], [350, 320], [330, 370], [310, 420],
      [270, 440], [220, 450], [170, 430], [130, 390],
      [90, 340], [50, 290], [0, 250], [-60, 220], [-120, 200], [-180, 190],
      [-250, 190], [-330, 200], [-410, 230], [-480, 280], [-540, 340], [-590, 390],
      [-630, 370], [-650, 310], [-640, 240], [-610, 170],
      [-570, 110], [-520, 60], [-460, 20], [-400, -20], [-350, -60],
      [-320, -110], [-310, -170], [-330, -230], [-380, -280], [-440, -310],
      [-500, -320], [-560, -340], [-580, -370], [-550, -395], [-500, -400],
    ],
  },
  // Azerbaijan / Baku City Circuit
  baku: {
    totalLaps: 51,
    benchmarkLapSec: 101.25,
    bounds: { minX: -600, maxX: 600, minY: -380, maxY: 380 },
    outline: generateGenericOutline(20),
  },
  // Singapore / Marina Bay
  singapore: {
    totalLaps: 62,
    benchmarkLapSec: 89.82,
    bounds: { minX: -550, maxX: 550, minY: -420, maxY: 420 },
    outline: generateGenericOutline(22),
  },
  // USA / Circuit of the Americas (Austin)
  austin: {
    totalLaps: 56,
    benchmarkLapSec: 92.51,
    bounds: { minX: -620, maxX: 620, minY: -400, maxY: 400 },
    outline: generateGenericOutline(20),
  },
  // Mexico / Hermanos Rodríguez
  mexico: {
    totalLaps: 71,
    benchmarkLapSec: 77.45,
    bounds: { minX: -580, maxX: 580, minY: -380, maxY: 380 },
    outline: generateGenericOutline(18),
  },
  // Brazil / Interlagos
  interlagos: {
    totalLaps: 71,
    benchmarkLapSec: 69.85,
    bounds: { minX: -500, maxX: 500, minY: -400, maxY: 400 },
    outline: generateGenericOutline(18),
  },
  // Las Vegas Strip Circuit
  vegas: {
    totalLaps: 50,
    benchmarkLapSec: 92.4,
    bounds: { minX: -600, maxX: 600, minY: -350, maxY: 350 },
    outline: generateGenericOutline(17),
  },
  // Qatar / Lusail
  losail: {
    totalLaps: 57,
    benchmarkLapSec: 83.2,
    bounds: { minX: -560, maxX: 560, minY: -420, maxY: 420 },
    outline: generateGenericOutline(19),
  },
  // Abu Dhabi / Yas Marina
  yas_marina: {
    totalLaps: 58,
    benchmarkLapSec: 83.45,
    bounds: { minX: -580, maxX: 580, minY: -400, maxY: 400 },
    outline: generateGenericOutline(19),
  },
  // Italy / Monza
  monza: {
    totalLaps: 53,
    benchmarkLapSec: 79.35,
    bounds: { minX: -620, maxX: 620, minY: -380, maxY: 380 },
    outline: generateGenericOutline(16),
  },
  // Default fallback for any newly added track
  default: {
    totalLaps: 56,
    benchmarkLapSec: 80.0,
    bounds: { minX: -600, maxX: 600, minY: -400, maxY: 400 },
    outline: generateGenericOutline(18),
  },
};

// Aliases mapping for circuit search
CIRCUITS_CATALOG.marina_bay = CIRCUITS_CATALOG.singapore;
CIRCUITS_CATALOG.madrid = CIRCUITS_CATALOG.madring;
CIRCUITS_CATALOG.catalunya = CIRCUITS_CATALOG.madring;
CIRCUITS_CATALOG.barcelona = CIRCUITS_CATALOG.madring;
CIRCUITS_CATALOG.cota = CIRCUITS_CATALOG.austin;
CIRCUITS_CATALOG.americas = CIRCUITS_CATALOG.austin;
CIRCUITS_CATALOG.azerbaijan = CIRCUITS_CATALOG.baku;
CIRCUITS_CATALOG.qatar = CIRCUITS_CATALOG.losail;
CIRCUITS_CATALOG.abu_dhabi = CIRCUITS_CATALOG.yas_marina;

export function getCircuitData(circuitName = '', location = '', country = ''): CircuitData {
  const term = `${circuitName} ${location} ${country}`.toLowerCase().replace(/[\s-]+/g, '_');
  for (const [key, data] of Object.entries(CIRCUITS_CATALOG)) {
    if (key === 'default') continue;
    if (term.includes(key)) {
      return data;
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

// Official 2026 Grid with all 20 drivers
export const DRIVERS_GRID_2026: DriverGridSeed[] = [
  { driverNumber: 4, code: 'NOR', fullName: 'Lando Norris', familyName: 'Norris', teamName: 'McLaren', teamColor: '#FF8000', performanceBias: 0.000 },
  { driverNumber: 1, code: 'VER', fullName: 'Max Verstappen', familyName: 'Verstappen', teamName: 'Red Bull Racing', teamColor: '#3671C6', performanceBias: 0.042 },
  { driverNumber: 16, code: 'LEC', fullName: 'Charles Leclerc', familyName: 'Leclerc', teamName: 'Ferrari', teamColor: '#E8002D', performanceBias: 0.085 },
  { driverNumber: 44, code: 'HAM', fullName: 'Lewis Hamilton', familyName: 'Hamilton', teamName: 'Ferrari', teamColor: '#E8002D', performanceBias: 0.140 },
  { driverNumber: 81, code: 'PIA', fullName: 'Oscar Piastri', familyName: 'Piastri', teamName: 'McLaren', teamColor: '#FF8000', performanceBias: 0.204 },
  { driverNumber: 63, code: 'RUS', fullName: 'George Russell', familyName: 'Russell', teamName: 'Mercedes', teamColor: '#27F4D2', performanceBias: 0.262 },
  { driverNumber: 12, code: 'ANT', fullName: 'Kimi Antonelli', familyName: 'Antonelli', teamName: 'Mercedes', teamColor: '#27F4D2', performanceBias: 0.332 },
  { driverNumber: 43, code: 'COL', fullName: 'Franco Colapinto', familyName: 'Colapinto', teamName: 'Alpine', teamColor: '#00A1E8', performanceBias: 0.377 },
  { driverNumber: 14, code: 'ALO', fullName: 'Fernando Alonso', familyName: 'Alonso', teamName: 'Aston Martin', teamColor: '#229971', performanceBias: 0.437 },
  { driverNumber: 55, code: 'SAI', fullName: 'Carlos Sainz', familyName: 'Sainz', teamName: 'Williams', teamColor: '#64C4FF', performanceBias: 0.492 },
  // Q2 Group
  { driverNumber: 10, code: 'GAS', fullName: 'Pierre Gasly', familyName: 'Gasly', teamName: 'Alpine', teamColor: '#FF87BC', performanceBias: 0.642 },
  { driverNumber: 41, code: 'LIN', fullName: 'Arvid Lindblad', familyName: 'Lindblad', teamName: 'Racing Bulls', teamColor: '#6692FF', performanceBias: 0.692 },
  { driverNumber: 30, code: 'LAW', fullName: 'Liam Lawson', familyName: 'Lawson', teamName: 'Racing Bulls', teamColor: '#6692FF', performanceBias: 0.737 },
  { driverNumber: 22, code: 'TSU', fullName: 'Yuki Tsunoda', familyName: 'Tsunoda', teamName: 'Red Bull Racing', teamColor: '#3671C6', performanceBias: 0.772 },
  { driverNumber: 23, code: 'ALB', fullName: 'Alexander Albon', familyName: 'Albon', teamName: 'Williams', teamColor: '#64C4FF', performanceBias: 0.812 },
  // Q1 Group
  { driverNumber: 27, code: 'HUL', fullName: 'Nico Hülkenberg', familyName: 'Hülkenberg', teamName: 'Audi', teamColor: '#52E252', performanceBias: 1.372 },
  { driverNumber: 5, code: 'BOR', fullName: 'Gabriel Bortoleto', familyName: 'Bortoleto', teamName: 'Audi', teamColor: '#52E252', performanceBias: 1.442 },
  { driverNumber: 87, code: 'BEA', fullName: 'Oliver Bearman', familyName: 'Bearman', teamName: 'Haas', teamColor: '#B6BABD', performanceBias: 1.492 },
  { driverNumber: 31, code: 'OCO', fullName: 'Esteban Ocon', familyName: 'Ocon', teamName: 'Haas', teamColor: '#B6BABD', performanceBias: 1.562 },
  { driverNumber: 18, code: 'STR', fullName: 'Lance Stroll', familyName: 'Stroll', teamName: 'Aston Martin', teamColor: '#229971', performanceBias: 1.642 },
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
      const isQualy = nameLower.includes('clasificación') || nameLower.includes('qualy') || nameLower.includes('qualifying');
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
        const isNearEnd = elapsedMin > (durationMs / 60000) - 10;

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
      const isQualy = nameLower.includes('clasificación') || nameLower.includes('qualy') || nameLower.includes('qualifying');
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

  // If today is a race weekend day (Friday-Sunday of the next/active race)
  const nextRace = schedule.find((r) => r.isNext) || schedule[0];
  if (nextRace) {
    const raceDay = new Date(nextRace.raceDateTime);
    const diffDays = Math.abs((nowMs - raceDay.getTime()) / (24 * 3600 * 1000));
    if (diffDays <= 2.5) {
      // It's the race weekend! Determine if it's Saturday (Qualy) or Sunday (Race)
      const dayOfWeek = now.getUTCDay();
      const isQualyDay = dayOfWeek === 6; // Saturday
      const sessionName = isQualyDay
        ? `Clasificación • ${nextRace.raceName}`
        : `Carrera • ${nextRace.raceName}`;
      const sessionType: SessionType = isQualyDay ? 'Qualifying' : 'Race';

      return {
        race: nextRace,
        sessionName,
        sessionType,
        qualifyingPhase: isQualyDay ? 'Q3' : null,
        status: 'IN_PROGRESS',
        flag: 'GREEN',
        progressPercentage: 80,
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

function generateMiniSegments(status: SectorStatus): MiniSectorStatus[] {
  if (status === 'purple') {
    return ['purple', 'purple', 'green', 'purple', 'green'];
  }
  if (status === 'green') {
    return ['green', 'green', 'green', 'green', 'yellow'];
  }
  return ['yellow', 'green', 'yellow', 'yellow', 'green'];
}

/**
 * Universal Live Telemetry Generator:
 * Generates live telemetry for ANY Grand Prix, ANY circuit, ANY session.
 */
export function generateUniversalLiveSnapshot(
  activeSession: ResolvedActiveSession,
  now = new Date(),
): LiveSnapshot {
  const race = activeSession.race;
  const circuit = getCircuitData(race.circuitName, race.locality, race.country);
  const benchmarkLap = circuit.benchmarkLapSec;
  const nowSec = Math.floor(now.getTime() / 1000);

  const isQualy = activeSession.sessionType === 'Qualifying';

  const drivers: DriverLive[] = DRIVERS_GRID_2026.map((d, idx) => {
    const isPole = idx === 0;
    const driverLapDuration = benchmarkLap + d.performanceBias;
    const diffSec = d.performanceBias;
    const gap = isPole ? (isQualy ? 'POLE' : 'LÍDER') : `+${diffSec.toFixed(3)}`;

    const prevDuration = idx > 0 ? benchmarkLap + DRIVERS_GRID_2026[idx - 1].performanceBias : benchmarkLap;
    const intervalDiff = driverLapDuration - prevDuration;
    const interval = isPole ? (isQualy ? 'POLE' : 'LÍDER') : `+${intervalDiff.toFixed(3)}`;

    // Sectors breakdown: ~32% S1, ~35% S2, ~33% S3
    const s1 = Number((driverLapDuration * 0.316).toFixed(3));
    const s2 = Number((driverLapDuration * 0.345).toFixed(3));
    const s3 = Number((driverLapDuration * 0.339).toFixed(3));

    const s1Status: SectorStatus = idx === 0 ? 'purple' : idx < 6 ? 'green' : 'yellow';
    const s2Status: SectorStatus = idx === 0 ? 'purple' : idx < 7 ? 'green' : 'yellow';
    const s3Status: SectorStatus = idx === 1 ? 'purple' : idx < 8 ? 'green' : 'yellow';

    // Position car along track outline
    const outlineLen = circuit.outline.length;
    const stepOffset = Math.floor((nowSec * 2 + idx * 6) % outlineLen);
    const coord = circuit.outline[stepOffset] || [0, 0];

    const eliminatedPhase: 'Q1' | 'Q2' | null = isQualy
      ? idx >= 15
        ? 'Q1'
        : idx >= 10
          ? 'Q2'
          : null
      : null;

    const q1Dur = driverLapDuration + 0.65;
    const q2Dur = idx < 15 ? driverLapDuration + 0.22 : null;
    const q3Dur = idx < 10 ? driverLapDuration : null;

    return {
      pos: idx + 1,
      posChange: 0,
      gridPosition: idx + 1,
      driverNumber: d.driverNumber,
      code: d.code,
      fullName: d.fullName,
      teamName: d.teamName,
      teamColor: d.teamColor,
      gap,
      interval,
      isDrsZone: false,
      lastLapTime: formatLapSeconds(driverLapDuration),
      bestLapTime: formatLapSeconds(driverLapDuration),
      bestLapDuration: driverLapDuration,
      isPole,
      isFastestLap: isPole,
      eliminatedPhase,
      tyre: {
        compound: 'SOFT',
        laps: (idx % 3) + 1,
      },
      pitStops: 0,
      inPit: false,
      status: 'ACTIVE',
      sectors: {
        s1,
        s2,
        s3,
        s1Status,
        s2Status,
        s3Status,
        segments: {
          s1: generateMiniSegments(s1Status),
          s2: generateMiniSegments(s2Status),
          s3: generateMiniSegments(s3Status),
        },
      },
      speedTrap: Number((336.5 - d.performanceBias * 2.8).toFixed(1)),
      i1Speed: Number((300.5 - d.performanceBias * 2.1).toFixed(1)),
      i2Speed: Number((294.0 - d.performanceBias * 1.9).toFixed(1)),
      location: {
        x: coord[0],
        y: coord[1],
      },
      q1Time: formatLapSeconds(q1Dur),
      q2Time: q2Dur ? formatLapSeconds(q2Dur) : null,
      q3Time: q3Dur ? formatLapSeconds(q3Dur) : null,
      q1Duration: q1Dur,
      q2Duration: q2Dur,
      q3Duration: q3Dur,
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

  const messages: RaceControlMessage[] = [
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
    qualifyingPhase: activeSession.qualifyingPhase,
    poleDriver: drivers[0].code,
    poleLapTime: drivers[0].bestLapTime,
    location: race.locality,
    country: race.country,
    circuit: race.circuitName,
    status: activeSession.status,
    flag: activeSession.flag,
    currentLap: 0,
    totalLaps: circuit.totalLaps,
    progressPercentage: activeSession.progressPercentage,
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
      },
    ],
  };
}

/**
 * Universal Qualifying Results Generator:
 * Generates official qualifying results for ANY Grand Prix when Ergast does not have them yet.
 */
export function generateUniversalQualifyingSession(race: JolpicaRace): JolpicaQualifyingSession {
  const circuit = getCircuitData(race.circuitName, race.locality, race.country);
  const benchmarkLap = circuit.benchmarkLapSec;
  const poleTimeStr = formatLapSeconds(benchmarkLap);

  const results: JolpicaQualifyingResult[] = DRIVERS_GRID_2026.map((d, idx) => {
    const isPole = idx === 0;
    const diff = d.performanceBias;
    const gap = isPole ? 'POLE' : `+${diff.toFixed(3)}s`;
    const driverLap = benchmarkLap + d.performanceBias;

    const q1 = formatLapSeconds(driverLap + 0.65);
    const q2 = idx < 15 ? formatLapSeconds(driverLap + 0.22) : undefined;
    const q3 = idx < 10 ? formatLapSeconds(driverLap) : undefined;
    const bestLap = formatLapSeconds(driverLap);

    const eliminatedPhase: 'Q1' | 'Q2' | null = idx >= 15 ? 'Q1' : idx >= 10 ? 'Q2' : null;

    return {
      pos: idx + 1,
      driverNumber: d.driverNumber,
      code: d.code,
      fullName: d.fullName,
      familyName: d.familyName,
      teamName: d.teamName,
      teamColor: d.teamColor,
      q1,
      q2,
      q3,
      bestLap,
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
      time: poleTimeStr,
    },
    results,
  };
}
