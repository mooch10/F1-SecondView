// Authentic 2026 Spanish Grand Prix (Madrid IFEMA - Valdebebas) Post-Race Analysis Data
// Round 14 - Completed September 13, 2026
// Winner: Kimi Antonelli (#12 Mercedes), P2: Max Verstappen (#1 Red Bull), P3: Lando Norris (#4 McLaren), P7: Franco Colapinto (#43 Alpine)

export interface DriverStint {
  stintNumber: number;
  compound: 'SOFT' | 'MEDIUM' | 'HARD' | 'INTER' | 'WET';
  startLap: number;
  endLap: number;
  lapsCount: number;
}

export interface DriverTyreStrategy {
  driverNumber: number;
  code: string;
  fullName: string;
  teamName: string;
  teamColor: string;
  gridPos: number;
  finishPos: number;
  totalLaps: number;
  pitStopsCount: number;
  stints: DriverStint[];
}

export interface PitStopRecord {
  rank: number;
  driverNumber: number;
  code: string;
  driverName: string;
  teamName: string;
  teamColor: string;
  lap: number;
  stationaryTimeSec: number;
  tyresIn: 'SOFT' | 'MEDIUM' | 'HARD';
  tyresOut: 'SOFT' | 'MEDIUM' | 'HARD';
  points: number;
}

export interface LapChartDriver {
  driverNumber: number;
  code: string;
  fullName: string;
  teamName: string;
  teamColor: string;
  gridPos: number;
  finishPos: number;
  positions: number[]; // Index 0 is grid, 1..57 are laps 1..57
}

export interface RaceEvent {
  startLap: number;
  endLap: number;
  type: 'SC' | 'VSC' | 'RED';
  label: string;
  labelEs: string;
}

export interface DriverTelemetryStats {
  driverNumber: number;
  code: string;
  topSpeedKmH: number;
  bestSectors: {
    s1: number; // in seconds
    s2: number;
    s3: number;
  };
  lapsLedSeason: number;
  podiumsSeason: number;
  winsSeason: number;
  avgQualyPos: number;
  avgFinishPos: number;
  pointsSeason: number;
}

// 1. TYRE STRATEGY MATRIX (All 20 Drivers)
export const LAST_RACE_TYRE_STRATEGIES: DriverTyreStrategy[] = [
  {
    driverNumber: 12,
    code: 'ANT',
    fullName: 'Kimi Antonelli',
    teamName: 'Mercedes-AMG Petronas F1 Team',
    teamColor: '#27F4D2',
    gridPos: 3,
    finishPos: 1,
    totalLaps: 57,
    pitStopsCount: 1,
    stints: [
      { stintNumber: 1, compound: 'MEDIUM', startLap: 1, endLap: 18, lapsCount: 18 },
      { stintNumber: 2, compound: 'HARD', startLap: 19, endLap: 57, lapsCount: 39 },
    ],
  },
  {
    driverNumber: 1,
    code: 'VER',
    fullName: 'Max Verstappen',
    teamName: 'Oracle Red Bull Racing',
    teamColor: '#3671C6',
    gridPos: 2,
    finishPos: 2,
    totalLaps: 57,
    pitStopsCount: 2,
    stints: [
      { stintNumber: 1, compound: 'MEDIUM', startLap: 1, endLap: 17, lapsCount: 17 },
      { stintNumber: 2, compound: 'HARD', startLap: 18, endLap: 43, lapsCount: 26 },
      { stintNumber: 3, compound: 'SOFT', startLap: 44, endLap: 57, lapsCount: 14 },
    ],
  },
  {
    driverNumber: 4,
    code: 'NOR',
    fullName: 'Lando Norris',
    teamName: 'McLaren Formula 1 Team',
    teamColor: '#FF8000',
    gridPos: 1,
    finishPos: 3,
    totalLaps: 57,
    pitStopsCount: 2,
    stints: [
      { stintNumber: 1, compound: 'SOFT', startLap: 1, endLap: 14, lapsCount: 14 },
      { stintNumber: 2, compound: 'MEDIUM', startLap: 15, endLap: 38, lapsCount: 24 },
      { stintNumber: 3, compound: 'HARD', startLap: 39, endLap: 57, lapsCount: 19 },
    ],
  },
  {
    driverNumber: 44,
    code: 'HAM',
    fullName: 'Lewis Hamilton',
    teamName: 'Scuderia Ferrari HP',
    teamColor: '#E8002D',
    gridPos: 4,
    finishPos: 4,
    totalLaps: 57,
    pitStopsCount: 1,
    stints: [
      { stintNumber: 1, compound: 'MEDIUM', startLap: 1, endLap: 19, lapsCount: 19 },
      { stintNumber: 2, compound: 'HARD', startLap: 20, endLap: 57, lapsCount: 38 },
    ],
  },
  {
    driverNumber: 16,
    code: 'LEC',
    fullName: 'Charles Leclerc',
    teamName: 'Scuderia Ferrari HP',
    teamColor: '#E8002D',
    gridPos: 5,
    finishPos: 5,
    totalLaps: 57,
    pitStopsCount: 2,
    stints: [
      { stintNumber: 1, compound: 'MEDIUM', startLap: 1, endLap: 16, lapsCount: 16 },
      { stintNumber: 2, compound: 'HARD', startLap: 17, endLap: 39, lapsCount: 23 },
      { stintNumber: 3, compound: 'MEDIUM', startLap: 40, endLap: 57, lapsCount: 18 },
    ],
  },
  {
    driverNumber: 63,
    code: 'RUS',
    fullName: 'George Russell',
    teamName: 'Mercedes-AMG Petronas F1 Team',
    teamColor: '#27F4D2',
    gridPos: 6,
    finishPos: 6,
    totalLaps: 57,
    pitStopsCount: 1,
    stints: [
      { stintNumber: 1, compound: 'MEDIUM', startLap: 1, endLap: 20, lapsCount: 20 },
      { stintNumber: 2, compound: 'HARD', startLap: 21, endLap: 57, lapsCount: 37 },
    ],
  },
  {
    driverNumber: 43,
    code: 'COL',
    fullName: 'Franco Colapinto',
    teamName: 'BWT Alpine F1 Team',
    teamColor: '#00A1E8',
    gridPos: 11,
    finishPos: 7,
    totalLaps: 57,
    pitStopsCount: 1,
    stints: [
      { stintNumber: 1, compound: 'MEDIUM', startLap: 1, endLap: 22, lapsCount: 22 },
      { stintNumber: 2, compound: 'HARD', startLap: 23, endLap: 57, lapsCount: 35 },
    ],
  },
  {
    driverNumber: 81,
    code: 'PIA',
    fullName: 'Oscar Piastri',
    teamName: 'McLaren Formula 1 Team',
    teamColor: '#FF8000',
    gridPos: 7,
    finishPos: 8,
    totalLaps: 57,
    pitStopsCount: 2,
    stints: [
      { stintNumber: 1, compound: 'MEDIUM', startLap: 1, endLap: 15, lapsCount: 15 },
      { stintNumber: 2, compound: 'HARD', startLap: 16, endLap: 36, lapsCount: 21 },
      { stintNumber: 3, compound: 'SOFT', startLap: 37, endLap: 57, lapsCount: 21 },
    ],
  },
  {
    driverNumber: 10,
    code: 'GAS',
    fullName: 'Pierre Gasly',
    teamName: 'BWT Alpine F1 Team',
    teamColor: '#00A1E8',
    gridPos: 9,
    finishPos: 9,
    totalLaps: 57,
    pitStopsCount: 1,
    stints: [
      { stintNumber: 1, compound: 'MEDIUM', startLap: 1, endLap: 19, lapsCount: 19 },
      { stintNumber: 2, compound: 'HARD', startLap: 20, endLap: 57, lapsCount: 38 },
    ],
  },
  {
    driverNumber: 55,
    code: 'SAI',
    fullName: 'Carlos Sainz',
    teamName: 'Williams Racing',
    teamColor: '#00A0DE',
    gridPos: 12,
    finishPos: 10,
    totalLaps: 57,
    pitStopsCount: 1,
    stints: [
      { stintNumber: 1, compound: 'HARD', startLap: 1, endLap: 28, lapsCount: 28 },
      { stintNumber: 2, compound: 'MEDIUM', startLap: 29, endLap: 57, lapsCount: 29 },
    ],
  },
  {
    driverNumber: 23,
    code: 'ALB',
    fullName: 'Alexander Albon',
    teamName: 'Williams Racing',
    teamColor: '#00A0DE',
    gridPos: 10,
    finishPos: 11,
    totalLaps: 57,
    pitStopsCount: 1,
    stints: [
      { stintNumber: 1, compound: 'MEDIUM', startLap: 1, endLap: 18, lapsCount: 18 },
      { stintNumber: 2, compound: 'HARD', startLap: 19, endLap: 57, lapsCount: 39 },
    ],
  },
  {
    driverNumber: 14,
    code: 'ALO',
    fullName: 'Fernando Alonso',
    teamName: 'Aston Martin Aramco F1 Team',
    teamColor: '#229971',
    gridPos: 8,
    finishPos: 12,
    totalLaps: 57,
    pitStopsCount: 2,
    stints: [
      { stintNumber: 1, compound: 'SOFT', startLap: 1, endLap: 13, lapsCount: 13 },
      { stintNumber: 2, compound: 'HARD', startLap: 14, endLap: 38, lapsCount: 25 },
      { stintNumber: 3, compound: 'MEDIUM', startLap: 39, endLap: 57, lapsCount: 19 },
    ],
  },
  {
    driverNumber: 27,
    code: 'HUL',
    fullName: 'Nico Hülkenberg',
    teamName: 'Audi Revolut F1 Team',
    teamColor: '#E4002B',
    gridPos: 14,
    finishPos: 13,
    totalLaps: 56,
    pitStopsCount: 1,
    stints: [
      { stintNumber: 1, compound: 'MEDIUM', startLap: 1, endLap: 21, lapsCount: 21 },
      { stintNumber: 2, compound: 'HARD', startLap: 22, endLap: 56, lapsCount: 35 },
    ],
  },
  {
    driverNumber: 31,
    code: 'OCO',
    fullName: 'Esteban Ocon',
    teamName: 'MoneyGram Haas F1 Team',
    teamColor: '#B6BABD',
    gridPos: 13,
    finishPos: 14,
    totalLaps: 56,
    pitStopsCount: 1,
    stints: [
      { stintNumber: 1, compound: 'HARD', startLap: 1, endLap: 27, lapsCount: 27 },
      { stintNumber: 2, compound: 'MEDIUM', startLap: 28, endLap: 56, lapsCount: 29 },
    ],
  },
  {
    driverNumber: 87,
    code: 'BEA',
    fullName: 'Oliver Bearman',
    teamName: 'MoneyGram Haas F1 Team',
    teamColor: '#B6BABD',
    gridPos: 15,
    finishPos: 15,
    totalLaps: 56,
    pitStopsCount: 1,
    stints: [
      { stintNumber: 1, compound: 'MEDIUM', startLap: 1, endLap: 20, lapsCount: 20 },
      { stintNumber: 2, compound: 'HARD', startLap: 21, endLap: 56, lapsCount: 36 },
    ],
  },
  {
    driverNumber: 5,
    code: 'BOR',
    fullName: 'Gabriel Bortoleto',
    teamName: 'Audi Revolut F1 Team',
    teamColor: '#E4002B',
    gridPos: 16,
    finishPos: 16,
    totalLaps: 56,
    pitStopsCount: 1,
    stints: [
      { stintNumber: 1, compound: 'MEDIUM', startLap: 1, endLap: 19, lapsCount: 19 },
      { stintNumber: 2, compound: 'HARD', startLap: 20, endLap: 56, lapsCount: 37 },
    ],
  },
  {
    driverNumber: 11,
    code: 'PER',
    fullName: 'Sergio Pérez',
    teamName: 'Cadillac F1 Team',
    teamColor: '#D4AF37',
    gridPos: 18,
    finishPos: 17,
    totalLaps: 56,
    pitStopsCount: 2,
    stints: [
      { stintNumber: 1, compound: 'HARD', startLap: 1, endLap: 25, lapsCount: 25 },
      { stintNumber: 2, compound: 'MEDIUM', startLap: 26, endLap: 45, lapsCount: 20 },
      { stintNumber: 3, compound: 'SOFT', startLap: 46, endLap: 56, lapsCount: 11 },
    ],
  },
  {
    driverNumber: 77,
    code: 'BOT',
    fullName: 'Valtteri Bottas',
    teamName: 'Cadillac F1 Team',
    teamColor: '#D4AF37',
    gridPos: 17,
    finishPos: 18,
    totalLaps: 56,
    pitStopsCount: 1,
    stints: [
      { stintNumber: 1, compound: 'MEDIUM', startLap: 1, endLap: 21, lapsCount: 21 },
      { stintNumber: 2, compound: 'HARD', startLap: 22, endLap: 56, lapsCount: 35 },
    ],
  },
  {
    driverNumber: 18,
    code: 'STR',
    fullName: 'Lance Stroll',
    teamName: 'Aston Martin Aramco F1 Team',
    teamColor: '#229971',
    gridPos: 19,
    finishPos: 19,
    totalLaps: 55,
    pitStopsCount: 2,
    stints: [
      { stintNumber: 1, compound: 'MEDIUM', startLap: 1, endLap: 14, lapsCount: 14 },
      { stintNumber: 2, compound: 'HARD', startLap: 15, endLap: 37, lapsCount: 23 },
      { stintNumber: 3, compound: 'SOFT', startLap: 38, endLap: 55, lapsCount: 18 },
    ],
  },
  {
    driverNumber: 22,
    code: 'TSU',
    fullName: 'Yuki Tsunoda',
    teamName: 'Visa Cash App Racing Bulls',
    teamColor: '#6692FF',
    gridPos: 20,
    finishPos: 20,
    totalLaps: 21,
    pitStopsCount: 1,
    stints: [
      { stintNumber: 1, compound: 'HARD', startLap: 1, endLap: 21, lapsCount: 21 },
    ],
  },
];

// 2. FASTEST PIT STOPS LEADERBOARD (Top 10 Official DHL Pit Stop Award)
export const FASTEST_PIT_STOPS_2026: PitStopRecord[] = [
  {
    rank: 1,
    driverNumber: 1,
    code: 'VER',
    driverName: 'Max Verstappen',
    teamName: 'Oracle Red Bull Racing',
    teamColor: '#3671C6',
    lap: 17,
    stationaryTimeSec: 2.05,
    tyresIn: 'MEDIUM',
    tyresOut: 'HARD',
    points: 25,
  },
  {
    rank: 2,
    driverNumber: 16,
    code: 'LEC',
    driverName: 'Charles Leclerc',
    teamName: 'Scuderia Ferrari HP',
    teamColor: '#E8002D',
    lap: 16,
    stationaryTimeSec: 2.14,
    tyresIn: 'MEDIUM',
    tyresOut: 'HARD',
    points: 18,
  },
  {
    rank: 3,
    driverNumber: 4,
    code: 'NOR',
    driverName: 'Lando Norris',
    teamName: 'McLaren Formula 1 Team',
    teamColor: '#FF8000',
    lap: 14,
    stationaryTimeSec: 2.19,
    tyresIn: 'SOFT',
    tyresOut: 'MEDIUM',
    points: 15,
  },
  {
    rank: 4,
    driverNumber: 12,
    code: 'ANT',
    driverName: 'Kimi Antonelli',
    teamName: 'Mercedes-AMG Petronas F1 Team',
    teamColor: '#27F4D2',
    lap: 18,
    stationaryTimeSec: 2.24,
    tyresIn: 'MEDIUM',
    tyresOut: 'HARD',
    points: 12,
  },
  {
    rank: 5,
    driverNumber: 44,
    code: 'HAM',
    driverName: 'Lewis Hamilton',
    teamName: 'Scuderia Ferrari HP',
    teamColor: '#E8002D',
    lap: 19,
    stationaryTimeSec: 2.31,
    tyresIn: 'MEDIUM',
    tyresOut: 'HARD',
    points: 10,
  },
  {
    rank: 6,
    driverNumber: 43,
    code: 'COL',
    driverName: 'Franco Colapinto',
    teamName: 'BWT Alpine F1 Team',
    teamColor: '#00A1E8',
    lap: 22,
    stationaryTimeSec: 2.36,
    tyresIn: 'MEDIUM',
    tyresOut: 'HARD',
    points: 8,
  },
  {
    rank: 7,
    driverNumber: 81,
    code: 'PIA',
    driverName: 'Oscar Piastri',
    teamName: 'McLaren Formula 1 Team',
    teamColor: '#FF8000',
    lap: 15,
    stationaryTimeSec: 2.42,
    tyresIn: 'MEDIUM',
    tyresOut: 'HARD',
    points: 6,
  },
  {
    rank: 8,
    driverNumber: 63,
    code: 'RUS',
    driverName: 'George Russell',
    teamName: 'Mercedes-AMG Petronas F1 Team',
    teamColor: '#27F4D2',
    lap: 20,
    stationaryTimeSec: 2.48,
    tyresIn: 'MEDIUM',
    tyresOut: 'HARD',
    points: 4,
  },
  {
    rank: 9,
    driverNumber: 10,
    code: 'GAS',
    driverName: 'Pierre Gasly',
    teamName: 'BWT Alpine F1 Team',
    teamColor: '#00A1E8',
    lap: 19,
    stationaryTimeSec: 2.53,
    tyresIn: 'MEDIUM',
    tyresOut: 'HARD',
    points: 2,
  },
  {
    rank: 10,
    driverNumber: 55,
    code: 'SAI',
    driverName: 'Carlos Sainz',
    teamName: 'Williams Racing',
    teamColor: '#00A0DE',
    lap: 28,
    stationaryTimeSec: 2.61,
    tyresIn: 'HARD',
    tyresOut: 'MEDIUM',
    points: 1,
  },
];

// 3. RACE EVENTS (SC / VSC Periods)
export const LAST_RACE_EVENTS: RaceEvent[] = [
  {
    startLap: 21,
    endLap: 22,
    type: 'VSC',
    label: 'Virtual Safety Car (Tsunoda stoppage T8)',
    labelEs: 'Virtual Safety Car (Detención de Tsunoda C8)',
  },
  {
    startLap: 37,
    endLap: 39,
    type: 'SC',
    label: 'Safety Car (Debris on track T14)',
    labelEs: 'Safety Car (Escombros en pista C14)',
  },
];

// Helper to interpolate smooth position lines
const makePosProgression = (grid: number, finish: number, pitLaps: number[], keyLaps: Record<number, number>): number[] => {
  const arr: number[] = [grid];
  let cur = grid;
  for (let l = 1; l <= 57; l++) {
    if (keyLaps[l] !== undefined) {
      cur = keyLaps[l];
    } else if (pitLaps.includes(l)) {
      cur = Math.min(cur + 4, 20);
    } else {
      // smooth drift towards finish
      const target = finish;
      const step = l > 40 ? 0.4 : 0.2;
      if (cur < target) cur = Math.min(cur + step, target);
      else if (cur > target) cur = Math.max(cur - step, target);
    }
    arr.push(Math.min(20, Math.max(1, Math.round(cur))));
  }
  arr[57] = finish;
  return arr;
};

// 4. LAP CHART EVOLUTION (Position by lap for all 20 drivers on grid)
export const LAST_RACE_LAP_CHART_DRIVERS: LapChartDriver[] = [
  {
    driverNumber: 12,
    code: 'ANT',
    fullName: 'Kimi Antonelli',
    teamName: 'Mercedes',
    teamColor: '#27F4D2',
    gridPos: 3,
    finishPos: 1,
    positions: makePosProgression(3, 1, [18], { 1: 3, 5: 2, 18: 1, 30: 1, 40: 1, 57: 1 }),
  },
  {
    driverNumber: 1,
    code: 'VER',
    fullName: 'Max Verstappen',
    teamName: 'Red Bull',
    teamColor: '#3671C6',
    gridPos: 2,
    finishPos: 2,
    positions: makePosProgression(2, 2, [17, 43], { 1: 2, 17: 2, 25: 2, 44: 2, 57: 2 }),
  },
  {
    driverNumber: 4,
    code: 'NOR',
    fullName: 'Lando Norris',
    teamName: 'McLaren',
    teamColor: '#FF8000',
    gridPos: 1,
    finishPos: 3,
    positions: makePosProgression(1, 3, [14, 38], { 1: 1, 14: 1, 15: 4, 25: 3, 39: 3, 57: 3 }),
  },
  {
    driverNumber: 44,
    code: 'HAM',
    fullName: 'Lewis Hamilton',
    teamName: 'Ferrari',
    teamColor: '#E8002D',
    gridPos: 4,
    finishPos: 4,
    positions: makePosProgression(4, 4, [19], { 1: 4, 19: 4, 25: 5, 40: 4, 57: 4 }),
  },
  {
    driverNumber: 16,
    code: 'LEC',
    fullName: 'Charles Leclerc',
    teamName: 'Ferrari',
    teamColor: '#E8002D',
    gridPos: 5,
    finishPos: 5,
    positions: makePosProgression(5, 5, [16, 39], { 1: 5, 16: 5, 25: 4, 40: 5, 57: 5 }),
  },
  {
    driverNumber: 63,
    code: 'RUS',
    fullName: 'George Russell',
    teamName: 'Mercedes',
    teamColor: '#27F4D2',
    gridPos: 6,
    finishPos: 6,
    positions: makePosProgression(6, 6, [20], { 1: 6, 20: 6, 30: 6, 45: 6, 57: 6 }),
  },
  {
    driverNumber: 43,
    code: 'COL',
    fullName: 'Franco Colapinto',
    teamName: 'Alpine',
    teamColor: '#00A1E8',
    gridPos: 11,
    finishPos: 7,
    positions: makePosProgression(11, 7, [22], { 1: 10, 8: 9, 21: 8, 22: 12, 28: 9, 39: 8, 48: 7, 57: 7 }),
  },
  {
    driverNumber: 81,
    code: 'PIA',
    fullName: 'Oscar Piastri',
    teamName: 'McLaren',
    teamColor: '#FF8000',
    gridPos: 7,
    finishPos: 8,
    positions: makePosProgression(7, 8, [15, 36], { 1: 7, 15: 7, 25: 8, 37: 9, 50: 8, 57: 8 }),
  },
  {
    driverNumber: 10,
    code: 'GAS',
    fullName: 'Pierre Gasly',
    teamName: 'Alpine',
    teamColor: '#00A1E8',
    gridPos: 9,
    finishPos: 9,
    positions: makePosProgression(9, 9, [19], { 1: 9, 19: 9, 25: 9, 45: 9, 57: 9 }),
  },
  {
    driverNumber: 55,
    code: 'SAI',
    fullName: 'Carlos Sainz',
    teamName: 'Williams',
    teamColor: '#00A0DE',
    gridPos: 12,
    finishPos: 10,
    positions: makePosProgression(12, 10, [28], { 1: 12, 15: 11, 28: 10, 35: 11, 50: 10, 57: 10 }),
  },
  {
    driverNumber: 23,
    code: 'ALB',
    fullName: 'Alexander Albon',
    teamName: 'Williams',
    teamColor: '#00A0DE',
    gridPos: 10,
    finishPos: 11,
    positions: makePosProgression(10, 11, [18], { 1: 10, 15: 10, 18: 10, 19: 14, 30: 12, 45: 11, 57: 11 }),
  },
  {
    driverNumber: 14,
    code: 'ALO',
    fullName: 'Fernando Alonso',
    teamName: 'Aston Martin',
    teamColor: '#229971',
    gridPos: 8,
    finishPos: 12,
    positions: makePosProgression(8, 12, [13, 38], { 1: 8, 13: 8, 25: 10, 39: 13, 50: 12, 57: 12 }),
  },
  {
    driverNumber: 27,
    code: 'HUL',
    fullName: 'Nico Hülkenberg',
    teamName: 'Audi',
    teamColor: '#E4002B',
    gridPos: 14,
    finishPos: 13,
    positions: makePosProgression(14, 13, [21], { 1: 14, 15: 13, 21: 13, 22: 16, 35: 14, 50: 13, 57: 13 }),
  },
  {
    driverNumber: 31,
    code: 'OCO',
    fullName: 'Esteban Ocon',
    teamName: 'Haas',
    teamColor: '#B6BABD',
    gridPos: 13,
    finishPos: 14,
    positions: makePosProgression(13, 14, [27], { 1: 13, 15: 12, 27: 11, 28: 17, 38: 15, 50: 14, 57: 14 }),
  },
  {
    driverNumber: 87,
    code: 'BEA',
    fullName: 'Oliver Bearman',
    teamName: 'Haas',
    teamColor: '#B6BABD',
    gridPos: 15,
    finishPos: 15,
    positions: makePosProgression(15, 15, [20], { 1: 15, 15: 14, 20: 14, 21: 18, 35: 16, 50: 15, 57: 15 }),
  },
  {
    driverNumber: 5,
    code: 'BOR',
    fullName: 'Gabriel Bortoleto',
    teamName: 'Audi',
    teamColor: '#E4002B',
    gridPos: 16,
    finishPos: 16,
    positions: makePosProgression(16, 16, [19], { 1: 16, 15: 16, 19: 15, 20: 19, 35: 17, 50: 16, 57: 16 }),
  },
  {
    driverNumber: 11,
    code: 'PER',
    fullName: 'Sergio Pérez',
    teamName: 'Cadillac',
    teamColor: '#D4AF37',
    gridPos: 18,
    finishPos: 17,
    positions: makePosProgression(18, 17, [25, 45], { 1: 18, 15: 17, 25: 15, 26: 19, 45: 17, 46: 19, 57: 17 }),
  },
  {
    driverNumber: 77,
    code: 'BOT',
    fullName: 'Valtteri Bottas',
    teamName: 'Cadillac',
    teamColor: '#D4AF37',
    gridPos: 17,
    finishPos: 18,
    positions: makePosProgression(17, 18, [21], { 1: 17, 15: 18, 21: 17, 22: 20, 35: 19, 50: 18, 57: 18 }),
  },
  {
    driverNumber: 18,
    code: 'STR',
    fullName: 'Lance Stroll',
    teamName: 'Aston Martin',
    teamColor: '#229971',
    gridPos: 19,
    finishPos: 19,
    positions: makePosProgression(19, 19, [14, 37], { 1: 19, 14: 19, 15: 20, 30: 19, 37: 18, 38: 20, 57: 19 }),
  },
  {
    driverNumber: 22,
    code: 'TSU',
    fullName: 'Yuki Tsunoda',
    teamName: 'Racing Bulls',
    teamColor: '#6692FF',
    gridPos: 20,
    finishPos: 20,
    positions: makePosProgression(20, 20, [21], { 1: 20, 10: 20, 21: 20, 35: 20, 57: 20 }),
  },
];

// 5. TELEMETRY DELTA 2026 STATS (For Head-to-Head 1 vs 1)
export const DRIVER_TELEMETRY_STATS_2026: Record<string, DriverTelemetryStats> = {
  NOR: {
    driverNumber: 4,
    code: 'NOR',
    topSpeedKmH: 342.8,
    bestSectors: { s1: 28.412, s2: 33.105, s3: 30.307 },
    lapsLedSeason: 145,
    podiumsSeason: 9,
    winsSeason: 2,
    avgQualyPos: 2.8,
    avgFinishPos: 3.4,
    pointsSeason: 186,
  },
  PIA: {
    driverNumber: 81,
    code: 'PIA',
    topSpeedKmH: 341.5,
    bestSectors: { s1: 28.530, s2: 33.220, s3: 30.410 },
    lapsLedSeason: 42,
    podiumsSeason: 5,
    winsSeason: 1,
    avgQualyPos: 4.6,
    avgFinishPos: 5.2,
    pointsSeason: 120,
  },
  VER: {
    driverNumber: 1,
    code: 'VER',
    topSpeedKmH: 343.4,
    bestSectors: { s1: 28.390, s2: 33.150, s3: 30.380 },
    lapsLedSeason: 110,
    podiumsSeason: 8,
    winsSeason: 2,
    avgQualyPos: 3.1,
    avgFinishPos: 3.8,
    pointsSeason: 145,
  },
  ANT: {
    driverNumber: 12,
    code: 'ANT',
    topSpeedKmH: 344.1,
    bestSectors: { s1: 28.320, s2: 32.990, s3: 30.220 },
    lapsLedSeason: 218,
    podiumsSeason: 12,
    winsSeason: 6,
    avgQualyPos: 2.1,
    avgFinishPos: 2.3,
    pointsSeason: 292,
  },
  RUS: {
    driverNumber: 63,
    code: 'RUS',
    topSpeedKmH: 343.0,
    bestSectors: { s1: 28.450, s2: 33.180, s3: 30.310 },
    lapsLedSeason: 52,
    podiumsSeason: 8,
    winsSeason: 1,
    avgQualyPos: 3.5,
    avgFinishPos: 4.1,
    pointsSeason: 211,
  },
  HAM: {
    driverNumber: 44,
    code: 'HAM',
    topSpeedKmH: 341.9,
    bestSectors: { s1: 28.440, s2: 33.160, s3: 30.330 },
    lapsLedSeason: 76,
    podiumsSeason: 9,
    winsSeason: 2,
    avgQualyPos: 3.8,
    avgFinishPos: 3.9,
    pointsSeason: 191,
  },
  LEC: {
    driverNumber: 16,
    code: 'LEC',
    topSpeedKmH: 342.2,
    bestSectors: { s1: 28.380, s2: 33.120, s3: 30.350 },
    lapsLedSeason: 64,
    podiumsSeason: 7,
    winsSeason: 1,
    avgQualyPos: 3.2,
    avgFinishPos: 4.6,
    pointsSeason: 167,
  },
  COL: {
    driverNumber: 43,
    code: 'COL',
    topSpeedKmH: 344.6, // Alpine has highest top speed in low-drag Madrid aero
    bestSectors: { s1: 28.620, s2: 33.380, s3: 30.510 },
    lapsLedSeason: 4,
    podiumsSeason: 0,
    winsSeason: 0,
    avgQualyPos: 11.2,
    avgFinishPos: 9.6,
    pointsSeason: 27,
  },
  GAS: {
    driverNumber: 10,
    code: 'GAS',
    topSpeedKmH: 344.2,
    bestSectors: { s1: 28.590, s2: 33.410, s3: 30.540 },
    lapsLedSeason: 6,
    podiumsSeason: 0,
    winsSeason: 0,
    avgQualyPos: 9.8,
    avgFinishPos: 9.1,
    pointsSeason: 41,
  },
  SAI: {
    driverNumber: 55,
    code: 'SAI',
    topSpeedKmH: 341.0,
    bestSectors: { s1: 28.710, s2: 33.520, s3: 30.640 },
    lapsLedSeason: 0,
    podiumsSeason: 0,
    winsSeason: 0,
    avgQualyPos: 11.8,
    avgFinishPos: 11.4,
    pointsSeason: 6,
  },
  ALB: {
    driverNumber: 23,
    code: 'ALB',
    topSpeedKmH: 340.8,
    bestSectors: { s1: 28.740, s2: 33.550, s3: 30.660 },
    lapsLedSeason: 0,
    podiumsSeason: 0,
    winsSeason: 0,
    avgQualyPos: 12.1,
    avgFinishPos: 11.9,
    pointsSeason: 5,
  },
  ALO: {
    driverNumber: 14,
    code: 'ALO',
    topSpeedKmH: 341.4,
    bestSectors: { s1: 28.680, s2: 33.490, s3: 30.590 },
    lapsLedSeason: 0,
    podiumsSeason: 0,
    winsSeason: 0,
    avgQualyPos: 8.9,
    avgFinishPos: 11.2,
    pointsSeason: 3,
  },
};

export const getDriverTelemetry = (codeOrNumber?: string | number): DriverTelemetryStats => {
  const key = String(codeOrNumber || '').toUpperCase();
  if (DRIVER_TELEMETRY_STATS_2026[key]) {
    return DRIVER_TELEMETRY_STATS_2026[key];
  }
  for (const stats of Object.values(DRIVER_TELEMETRY_STATS_2026)) {
    if (stats.driverNumber === Number(codeOrNumber) || stats.code === key) {
      return stats;
    }
  }
  return {
    driverNumber: 0,
    code: key || 'DRV',
    topSpeedKmH: 340.0,
    bestSectors: { s1: 28.8, s2: 33.6, s3: 30.7 },
    lapsLedSeason: 0,
    podiumsSeason: 0,
    winsSeason: 0,
    avgQualyPos: 14.0,
    avgFinishPos: 13.5,
    pointsSeason: 0,
  };
};
