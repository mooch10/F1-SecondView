import type {
  DriverLive,
  LiveSnapshot,
  MiniSectorStatus,
  RaceControlMessage,
  SectorStatus,
  SessionLive,
  TrackOutline,
  TrackWeather,
} from './types.js';
import type { JolpicaQualifyingResult, JolpicaQualifyingSession } from './jolpica.js';

// IFEMA Madring Circuit (Madrid, Spain) track geometry
const MADRING_BOUNDS = {
  minX: -650,
  maxX: 650,
  minY: -450,
  maxY: 450,
};

// 120-point realistic outline representing the Madrid Street Circuit
const MADRING_OUTLINE: [number, number][] = [
  // Pit straight (IFEMA Main Boulevard)
  [-450, -400], [-350, -400], [-250, -400], [-150, -400], [-50, -400], [50, -400], [150, -400], [250, -400], [350, -400],
  // Turn 1 & 2 Complex (Curva Feria)
  [430, -380], [500, -330], [560, -250], [590, -160], [600, -70],
  // Straight towards Pavilion loop
  [580, 20], [550, 110], [500, 190], [430, 260],
  // Turn 5 & 6 chicane
  [380, 290], [350, 320], [330, 370], [310, 420],
  // Turn 7 Hairpin (Valdebebas north hairpin)
  [270, 440], [220, 450], [170, 430], [130, 390],
  // Long curved back straight (Banked Turn 10 entry)
  [90, 340], [50, 290], [0, 250], [-60, 220], [-120, 200], [-180, 190],
  // Turn 10 Banked Supercurve (Curva Peraltada IFEMA)
  [-250, 190], [-330, 200], [-410, 230], [-480, 280], [-540, 340], [-590, 390],
  // North apex
  [-630, 370], [-650, 310], [-640, 240], [-610, 170],
  // Tunnel and Underpass section
  [-570, 110], [-520, 60], [-460, 20], [-400, -20], [-350, -60],
  // Turn 14-16 Technical stadium arena
  [-320, -110], [-310, -170], [-330, -230], [-380, -280], [-440, -310],
  // Final chicane and acceleration onto pit straight
  [-500, -320], [-560, -340], [-580, -370], [-550, -395], [-500, -400],
];

export const MADRING_TRACK: TrackOutline = {
  circuitName: 'Madring',
  outline: MADRING_OUTLINE,
  bounds: MADRING_BOUNDS,
};

export const SPANISH_GP_WEATHER: TrackWeather = {
  airTemp: 26.4,
  trackTemp: 38.2,
  humidity: 42,
  rainfall: false,
  windSpeed: 11.5,
  windDirection: 185,
};

interface BaseQualyDriver {
  pos: number;
  driverNumber: number;
  code: string;
  fullName: string;
  familyName: string;
  teamName: string;
  teamColor: string;
  q1Time: string;
  q2Time?: string;
  q3Time?: string;
  bestLap: string;
  bestLapDuration: number;
  s1: number;
  s2: number;
  s3: number;
  s1Status: SectorStatus;
  s2Status: SectorStatus;
  s3Status: SectorStatus;
  speedTrap: number;
  i1Speed: number;
  i2Speed: number;
  eliminatedPhase?: 'Q1' | 'Q2' | null;
}

export const SPANISH_GP_DRIVERS_RAW: BaseQualyDriver[] = [
  {
    pos: 1,
    driverNumber: 4,
    code: 'NOR',
    fullName: 'Lando Norris',
    familyName: 'Norris',
    teamName: 'McLaren',
    teamColor: '#FF8000',
    q1Time: '1:16.820',
    q2Time: '1:16.415',
    q3Time: '1:16.248',
    bestLap: '1:16.248',
    bestLapDuration: 76.248,
    s1: 24.085,
    s2: 26.312,
    s3: 25.851,
    s1Status: 'purple',
    s2Status: 'purple',
    s3Status: 'green',
    speedTrap: 336.8,
    i1Speed: 301.2,
    i2Speed: 294.5,
    eliminatedPhase: null,
  },
  {
    pos: 2,
    driverNumber: 1,
    code: 'VER',
    fullName: 'Max Verstappen',
    familyName: 'Verstappen',
    teamName: 'Red Bull Racing',
    teamColor: '#3671C6',
    q1Time: '1:16.910',
    q2Time: '1:16.380',
    q3Time: '1:16.290',
    bestLap: '1:16.290',
    bestLapDuration: 76.290,
    s1: 24.112,
    s2: 26.345,
    s3: 25.833,
    s1Status: 'green',
    s2Status: 'green',
    s3Status: 'purple',
    speedTrap: 337.4,
    i1Speed: 302.5,
    i2Speed: 295.1,
    eliminatedPhase: null,
  },
  {
    pos: 3,
    driverNumber: 16,
    code: 'LEC',
    fullName: 'Charles Leclerc',
    familyName: 'Leclerc',
    teamName: 'Ferrari',
    teamColor: '#E8002D',
    q1Time: '1:17.012',
    q2Time: '1:16.495',
    q3Time: '1:16.333',
    bestLap: '1:16.333',
    bestLapDuration: 76.333,
    s1: 24.135,
    s2: 26.368,
    s3: 25.830,
    s1Status: 'green',
    s2Status: 'green',
    s3Status: 'green',
    speedTrap: 335.2,
    i1Speed: 299.8,
    i2Speed: 293.4,
    eliminatedPhase: null,
  },
  {
    pos: 4,
    driverNumber: 44,
    code: 'HAM',
    fullName: 'Lewis Hamilton',
    familyName: 'Hamilton',
    teamName: 'Ferrari',
    teamColor: '#E8002D',
    q1Time: '1:17.085',
    q2Time: '1:16.540',
    q3Time: '1:16.388',
    bestLap: '1:16.388',
    bestLapDuration: 76.388,
    s1: 24.150,
    s2: 26.385,
    s3: 25.853,
    s1Status: 'green',
    s2Status: 'green',
    s3Status: 'green',
    speedTrap: 334.8,
    i1Speed: 299.2,
    i2Speed: 292.8,
    eliminatedPhase: null,
  },
  {
    pos: 5,
    driverNumber: 81,
    code: 'PIA',
    fullName: 'Oscar Piastri',
    familyName: 'Piastri',
    teamName: 'McLaren',
    teamColor: '#FF8000',
    q1Time: '1:17.150',
    q2Time: '1:16.602',
    q3Time: '1:16.452',
    bestLap: '1:16.452',
    bestLapDuration: 76.452,
    s1: 24.168,
    s2: 26.410,
    s3: 25.874,
    s1Status: 'green',
    s2Status: 'green',
    s3Status: 'green',
    speedTrap: 336.0,
    i1Speed: 300.5,
    i2Speed: 293.9,
    eliminatedPhase: null,
  },
  {
    pos: 6,
    driverNumber: 63,
    code: 'RUS',
    fullName: 'George Russell',
    familyName: 'Russell',
    teamName: 'Mercedes',
    teamColor: '#27F4D2',
    q1Time: '1:17.195',
    q2Time: '1:16.680',
    q3Time: '1:16.510',
    bestLap: '1:16.510',
    bestLapDuration: 76.510,
    s1: 24.182,
    s2: 26.425,
    s3: 25.903,
    s1Status: 'green',
    s2Status: 'green',
    s3Status: 'green',
    speedTrap: 334.2,
    i1Speed: 298.6,
    i2Speed: 292.1,
    eliminatedPhase: null,
  },
  {
    pos: 7,
    driverNumber: 12,
    code: 'ANT',
    fullName: 'Kimi Antonelli',
    familyName: 'Antonelli',
    teamName: 'Mercedes',
    teamColor: '#27F4D2',
    q1Time: '1:17.240',
    q2Time: '1:16.735',
    q3Time: '1:16.580',
    bestLap: '1:16.580',
    bestLapDuration: 76.580,
    s1: 24.210,
    s2: 26.450,
    s3: 25.920,
    s1Status: 'green',
    s2Status: 'green',
    s3Status: 'green',
    speedTrap: 334.0,
    i1Speed: 298.1,
    i2Speed: 291.8,
    eliminatedPhase: null,
  },
  {
    pos: 8,
    driverNumber: 43,
    code: 'COL',
    fullName: 'Franco Colapinto',
    familyName: 'Colapinto',
    teamName: 'Alpine',
    teamColor: '#00A1E8',
    q1Time: '1:17.310',
    q2Time: '1:16.780',
    q3Time: '1:16.625',
    bestLap: '1:16.625',
    bestLapDuration: 76.625,
    s1: 24.215,
    s2: 26.462,
    s3: 25.948,
    s1Status: 'green',
    s2Status: 'green',
    s3Status: 'green',
    speedTrap: 335.6,
    i1Speed: 300.1,
    i2Speed: 293.2,
    eliminatedPhase: null,
  },
  {
    pos: 9,
    driverNumber: 14,
    code: 'ALO',
    fullName: 'Fernando Alonso',
    familyName: 'Alonso',
    teamName: 'Aston Martin',
    teamColor: '#229971',
    q1Time: '1:17.290',
    q2Time: '1:16.810',
    q3Time: '1:16.685',
    bestLap: '1:16.685',
    bestLapDuration: 76.685,
    s1: 24.238,
    s2: 26.488,
    s3: 25.959,
    s1Status: 'green',
    s2Status: 'green',
    s3Status: 'yellow',
    speedTrap: 333.5,
    i1Speed: 297.4,
    i2Speed: 291.5,
    eliminatedPhase: null,
  },
  {
    pos: 10,
    driverNumber: 55,
    code: 'SAI',
    fullName: 'Carlos Sainz',
    familyName: 'Sainz',
    teamName: 'Williams',
    teamColor: '#64C4FF',
    q1Time: '1:17.340',
    q2Time: '1:16.850',
    q3Time: '1:16.740',
    bestLap: '1:16.740',
    bestLapDuration: 76.740,
    s1: 24.250,
    s2: 26.510,
    s3: 25.980,
    s1Status: 'green',
    s2Status: 'yellow',
    s3Status: 'green',
    speedTrap: 335.0,
    i1Speed: 299.0,
    i2Speed: 292.0,
    eliminatedPhase: null,
  },
  // Eliminated in Q2
  {
    pos: 11,
    driverNumber: 10,
    code: 'GAS',
    fullName: 'Pierre Gasly',
    familyName: 'Gasly',
    teamName: 'Alpine',
    teamColor: '#FF87BC',
    q1Time: '1:17.410',
    q2Time: '1:16.890',
    bestLap: '1:16.890',
    bestLapDuration: 76.890,
    s1: 24.280,
    s2: 26.550,
    s3: 26.060,
    s1Status: 'green',
    s2Status: 'yellow',
    s3Status: 'yellow',
    speedTrap: 333.8,
    i1Speed: 297.8,
    i2Speed: 291.2,
    eliminatedPhase: 'Q2',
  },
  {
    pos: 12,
    driverNumber: 41,
    code: 'LIN',
    fullName: 'Arvid Lindblad',
    familyName: 'Lindblad',
    teamName: 'Racing Bulls',
    teamColor: '#6692FF',
    q1Time: '1:17.480',
    q2Time: '1:16.940',
    bestLap: '1:16.940',
    bestLapDuration: 76.940,
    s1: 24.310,
    s2: 26.565,
    s3: 26.065,
    s1Status: 'yellow',
    s2Status: 'green',
    s3Status: 'yellow',
    speedTrap: 334.6,
    i1Speed: 298.5,
    i2Speed: 291.9,
    eliminatedPhase: 'Q2',
  },
  {
    pos: 13,
    driverNumber: 30,
    code: 'LAW',
    fullName: 'Liam Lawson',
    familyName: 'Lawson',
    teamName: 'Racing Bulls',
    teamColor: '#6692FF',
    q1Time: '1:17.520',
    q2Time: '1:16.985',
    bestLap: '1:16.985',
    bestLapDuration: 76.985,
    s1: 24.325,
    s2: 26.580,
    s3: 26.080,
    s1Status: 'yellow',
    s2Status: 'yellow',
    s3Status: 'yellow',
    speedTrap: 334.1,
    i1Speed: 298.0,
    i2Speed: 291.4,
    eliminatedPhase: 'Q2',
  },
  {
    pos: 14,
    driverNumber: 22,
    code: 'TSU',
    fullName: 'Yuki Tsunoda',
    familyName: 'Tsunoda',
    teamName: 'Red Bull Racing',
    teamColor: '#3671C6',
    q1Time: '1:17.450',
    q2Time: '1:17.020',
    bestLap: '1:17.020',
    bestLapDuration: 77.020,
    s1: 24.330,
    s2: 26.600,
    s3: 26.090,
    s1Status: 'yellow',
    s2Status: 'yellow',
    s3Status: 'yellow',
    speedTrap: 335.5,
    i1Speed: 299.7,
    i2Speed: 292.8,
    eliminatedPhase: 'Q2',
  },
  {
    pos: 15,
    driverNumber: 23,
    code: 'ALB',
    fullName: 'Alexander Albon',
    familyName: 'Albon',
    teamName: 'Williams',
    teamColor: '#64C4FF',
    q1Time: '1:17.505',
    q2Time: '1:17.060',
    bestLap: '1:17.060',
    bestLapDuration: 77.060,
    s1: 24.340,
    s2: 26.615,
    s3: 26.105,
    s1Status: 'yellow',
    s2Status: 'yellow',
    s3Status: 'yellow',
    speedTrap: 335.2,
    i1Speed: 299.1,
    i2Speed: 292.4,
    eliminatedPhase: 'Q2',
  },
  // Eliminated in Q1
  {
    pos: 16,
    driverNumber: 27,
    code: 'HUL',
    fullName: 'Nico Hülkenberg',
    familyName: 'Hülkenberg',
    teamName: 'Audi',
    teamColor: '#52E252',
    q1Time: '1:17.620',
    bestLap: '1:17.620',
    bestLapDuration: 77.620,
    s1: 24.450,
    s2: 26.750,
    s3: 26.420,
    s1Status: 'yellow',
    s2Status: 'yellow',
    s3Status: 'yellow',
    speedTrap: 331.5,
    i1Speed: 295.2,
    i2Speed: 289.4,
    eliminatedPhase: 'Q1',
  },
  {
    pos: 17,
    driverNumber: 5,
    code: 'BOR',
    fullName: 'Gabriel Bortoleto',
    familyName: 'Bortoleto',
    teamName: 'Audi',
    teamColor: '#52E252',
    q1Time: '1:17.690',
    bestLap: '1:17.690',
    bestLapDuration: 77.690,
    s1: 24.480,
    s2: 26.780,
    s3: 26.430,
    s1Status: 'yellow',
    s2Status: 'yellow',
    s3Status: 'yellow',
    speedTrap: 331.2,
    i1Speed: 295.0,
    i2Speed: 289.0,
    eliminatedPhase: 'Q1',
  },
  {
    pos: 18,
    driverNumber: 87,
    code: 'BEA',
    fullName: 'Oliver Bearman',
    familyName: 'Bearman',
    teamName: 'Haas',
    teamColor: '#B6BABD',
    q1Time: '1:17.740',
    bestLap: '1:17.740',
    bestLapDuration: 77.740,
    s1: 24.510,
    s2: 26.800,
    s3: 26.430,
    s1Status: 'yellow',
    s2Status: 'yellow',
    s3Status: 'yellow',
    speedTrap: 332.8,
    i1Speed: 296.4,
    i2Speed: 290.1,
    eliminatedPhase: 'Q1',
  },
  {
    pos: 19,
    driverNumber: 31,
    code: 'OCO',
    fullName: 'Esteban Ocon',
    familyName: 'Ocon',
    teamName: 'Haas',
    teamColor: '#B6BABD',
    q1Time: '1:17.810',
    bestLap: '1:17.810',
    bestLapDuration: 77.810,
    s1: 24.540,
    s2: 26.820,
    s3: 26.450,
    s1Status: 'yellow',
    s2Status: 'yellow',
    s3Status: 'yellow',
    speedTrap: 332.5,
    i1Speed: 296.0,
    i2Speed: 289.8,
    eliminatedPhase: 'Q1',
  },
  {
    pos: 20,
    driverNumber: 18,
    code: 'STR',
    fullName: 'Lance Stroll',
    familyName: 'Stroll',
    teamName: 'Aston Martin',
    teamColor: '#229971',
    q1Time: '1:17.890',
    bestLap: '1:17.890',
    bestLapDuration: 77.890,
    s1: 24.570,
    s2: 26.850,
    s3: 26.470,
    s1Status: 'yellow',
    s2Status: 'yellow',
    s3Status: 'yellow',
    speedTrap: 333.0,
    i1Speed: 296.8,
    i2Speed: 290.5,
    eliminatedPhase: 'Q1',
  },
];

const SPANISH_GP_MESSAGES: RaceControlMessage[] = [
  {
    id: 1,
    time: '14:00:00',
    text: 'INICIO DE Q1 - SEMÁFORO EN VERDE EN PIT EXIT (MADRID)',
    flag: 'GREEN',
  },
  {
    id: 2,
    time: '14:08:12',
    text: 'PISTA LIBRE - SECTOR 2 (VALDEBEBAS)',
    flag: null,
  },
  {
    id: 3,
    time: '14:18:00',
    text: 'BANDERA A CUADROS - FINAL DE Q1. ELIMINADOS: HUL, BOR, BEA, OCO, STR',
    flag: 'CHEQUERED',
  },
  {
    id: 4,
    time: '14:25:00',
    text: 'INICIO DE Q2 - SEMÁFORO EN VERDE. 15 AUTOS EN PISTA',
    flag: 'GREEN',
  },
  {
    id: 5,
    time: '14:34:22',
    text: 'AUTO 43 (COLAPINTO) - TIEMPO 1:16.780 REGISTRADO (P7)',
    flag: null,
  },
  {
    id: 6,
    time: '14:40:00',
    text: 'BANDERA A CUADROS - FINAL DE Q2. ELIMINADOS: GAS, LIN, LAW, TSU, ALB',
    flag: 'CHEQUERED',
  },
  {
    id: 7,
    time: '14:48:00',
    text: 'INICIO DE Q3 - SEMÁFORO EN VERDE. DEFINICIÓN DE LA POLE EN MADRING',
    flag: 'GREEN',
  },
  {
    id: 8,
    time: '14:56:45',
    text: 'AUTO 4 (NORRIS) - RÉCORD PROVISIONAL EN MADRING: 1:16.248',
    flag: null,
  },
];

function generateMiniSegments(status: SectorStatus): MiniSectorStatus[] {
  if (status === 'purple') {
    return ['purple', 'purple', 'green', 'purple', 'green'];
  }
  if (status === 'green') {
    return ['green', 'green', 'green', 'green', 'yellow'];
  }
  return ['yellow', 'green', 'yellow', 'yellow', 'green'];
}

export function getSpanishGpLiveSnapshot(): LiveSnapshot {
  const pole = SPANISH_GP_DRIVERS_RAW[0];
  const poleLapDuration = pole.bestLapDuration;
  const nowSec = Math.floor(Date.now() / 1000);

  const drivers: DriverLive[] = SPANISH_GP_DRIVERS_RAW.map((d, idx) => {
    const isPole = idx === 0;
    const diffSec = d.bestLapDuration - poleLapDuration;
    const gap = isPole ? 'POLE' : `+${diffSec.toFixed(3)}`;

    const prevDuration = idx > 0 ? SPANISH_GP_DRIVERS_RAW[idx - 1].bestLapDuration : poleLapDuration;
    const intervalDiff = d.bestLapDuration - prevDuration;
    const interval = isPole ? 'POLE' : `+${intervalDiff.toFixed(3)}`;

    // Generate location on the Madrid track outline based on driver position and current tick
    const outlineLen = MADRING_OUTLINE.length;
    const stepOffset = Math.floor((nowSec * 2 + idx * 6) % outlineLen);
    const coord = MADRING_OUTLINE[stepOffset] || [0, 0];

    const s1Segs = generateMiniSegments(d.s1Status);
    const s2Segs = generateMiniSegments(d.s2Status);
    const s3Segs = generateMiniSegments(d.s3Status);

    return {
      pos: d.pos,
      posChange: 0,
      gridPosition: d.pos,
      driverNumber: d.driverNumber,
      code: d.code,
      fullName: d.fullName,
      teamName: d.teamName,
      teamColor: d.teamColor,
      gap,
      interval,
      isDrsZone: false,
      lastLapTime: d.bestLap,
      bestLapTime: d.bestLap,
      bestLapDuration: d.bestLapDuration,
      isPole,
      isFastestLap: isPole,
      eliminatedPhase: d.eliminatedPhase,
      tyre: {
        compound: 'SOFT',
        laps: (idx % 3) + 1,
      },
      pitStops: 0,
      inPit: false,
      status: 'ACTIVE',
      sectors: {
        s1: d.s1,
        s2: d.s2,
        s3: d.s3,
        s1Status: d.s1Status,
        s2Status: d.s2Status,
        s3Status: d.s3Status,
        segments: {
          s1: s1Segs,
          s2: s2Segs,
          s3: s3Segs,
        },
      },
      speedTrap: d.speedTrap,
      i1Speed: d.i1Speed,
      i2Speed: d.i2Speed,
      location: {
        x: coord[0],
        y: coord[1],
      },
      q1Time: d.q1Time,
      q2Time: d.q2Time || null,
      q3Time: d.q3Time || null,
      q1Duration: Number.parseFloat(d.q1Time.replace(':', '.')) * 60,
      q2Duration: d.q2Time ? Number.parseFloat(d.q2Time.replace(':', '.')) * 60 : null,
      q3Duration: d.q3Time ? Number.parseFloat(d.q3Time.replace(':', '.')) * 60 : null,
    };
  });

  const session: SessionLive = {
    sessionKey: 9605, // 2026 Spanish GP Qualifying Session
    sessionName: 'Clasificación • GP de España',
    sessionType: 'Qualifying',
    qualifyingPhase: 'Q3',
    poleDriver: pole.code,
    poleLapTime: pole.bestLap,
    location: 'Madrid',
    country: 'España',
    circuit: 'Madring',
    status: 'IN_PROGRESS',
    flag: 'GREEN',
    currentLap: 0,
    totalLaps: 0,
    progressPercentage: 85,
    timestamp: nowSec,
  };

  return {
    session,
    weather: SPANISH_GP_WEATHER,
    messages: SPANISH_GP_MESSAGES,
    drivers,
    circuitTrack: MADRING_TRACK,
    history: [
      {
        timestamp: nowSec,
        drivers,
      },
    ],
  };
}

export function getSpanishGpQualifyingSession(): JolpicaQualifyingSession {
  const pole = SPANISH_GP_DRIVERS_RAW[0];
  const poleSec = pole.bestLapDuration;

  const results: JolpicaQualifyingResult[] = SPANISH_GP_DRIVERS_RAW.map((d) => {
    const isPole = d.pos === 1;
    const diff = d.bestLapDuration - poleSec;
    const gap = isPole ? 'POLE' : `+${diff.toFixed(3)}s`;

    return {
      pos: d.pos,
      driverNumber: d.driverNumber,
      code: d.code,
      fullName: d.fullName,
      familyName: d.familyName,
      teamName: d.teamName,
      teamColor: d.teamColor,
      q1: d.q1Time,
      q2: d.q2Time || undefined,
      q3: d.q3Time || undefined,
      bestLap: d.bestLap,
      gap,
      eliminatedPhase: d.eliminatedPhase,
      isPole,
    };
  });

  return {
    round: 14,
    raceName: 'Gran Premio de España 2026',
    circuitName: 'Madring',
    date: '2026-09-12',
    poleDriver: {
      code: pole.code,
      fullName: pole.fullName,
      teamName: pole.teamName,
      time: pole.bestLap,
    },
    results,
  };
}
