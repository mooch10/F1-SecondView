export interface FormFinish {
  race: string;
  pos: string;
  type: 'podium' | 'points' | 'unclassified' | 'dnf';
}

export interface HeadToHeadStats {
  teammateNumber: number;
  teammateCode: string;
  teammateName: string;
  qualy: [number, number];   // [driver, teammate]
  race: [number, number];    // [driver, teammate]
  points: [number, number];  // [driver, teammate]
}

export interface SuperLicenseStats {
  points: number;            // 0 to 12
  maxPoints: 12;
  status: string;
  statusEs: string;
  riskLevel: 'clean' | 'moderate' | 'danger';
  notes: string;
  notesEs: string;
}

export interface DriverAnalytics {
  h2h: HeadToHeadStats;
  form: FormFinish[];
  superLicense: SuperLicenseStats;
}

export const DRIVER_ANALYTICS_DATA: Record<number | string, DriverAnalytics> = {
  // Franco Colapinto (43 / COL) - Alpine F1 Team
  43: {
    h2h: {
      teammateNumber: 10,
      teammateCode: 'GAS',
      teammateName: 'Pierre Gasly',
      qualy: [4, 10],
      race: [5, 9],
      points: [27, 41],
    },
    form: [
      { race: 'BEL', pos: 'P10', type: 'points' },
      { race: 'HUN', pos: 'P15', type: 'unclassified' },
      { race: 'NLD', pos: 'P14', type: 'unclassified' },
      { race: 'ITA', pos: 'P9', type: 'points' },
      { race: 'MAD', pos: 'P7', type: 'points' },
    ],
    superLicense: {
      points: 0,
      maxPoints: 12,
      status: 'Clean & Active (Grade A)',
      statusEs: 'Limpia y Activa (Grado A)',
      riskLevel: 'clean',
      notes: 'No penalty points accumulated in the last 12 rolling months.',
      notesEs: 'Sin puntos de penalización en los últimos 12 meses móviles.',
    },
  },

  // Pierre Gasly (10 / GAS) - Alpine F1 Team
  10: {
    h2h: {
      teammateNumber: 43,
      teammateCode: 'COL',
      teammateName: 'Franco Colapinto',
      qualy: [10, 4],
      race: [9, 5],
      points: [41, 27],
    },
    form: [
      { race: 'BEL', pos: 'P11', type: 'unclassified' },
      { race: 'HUN', pos: 'P12', type: 'unclassified' },
      { race: 'NLD', pos: 'P10', type: 'points' },
      { race: 'ITA', pos: 'P7', type: 'points' },
      { race: 'MAD', pos: 'P12', type: 'unclassified' },
    ],
    superLicense: {
      points: 2,
      maxPoints: 12,
      status: 'Active (Grade A)',
      statusEs: 'Activa (Grado A)',
      riskLevel: 'clean',
      notes: '2/12 penalty points active.',
      notesEs: '2/12 puntos de penalización activos.',
    },
  },

  // Andrea Kimi Antonelli (12 / ANT) - Mercedes
  12: {
    h2h: {
      teammateNumber: 63,
      teammateCode: 'RUS',
      teammateName: 'George Russell',
      qualy: [7, 7],
      race: [10, 4],
      points: [292, 211],
    },
    form: [
      { race: 'BEL', pos: 'P1', type: 'podium' },
      { race: 'HUN', pos: 'P3', type: 'podium' },
      { race: 'NLD', pos: 'P2', type: 'podium' },
      { race: 'ITA', pos: 'P1', type: 'podium' },
      { race: 'MAD', pos: 'P1', type: 'podium' },
    ],
    superLicense: {
      points: 0,
      maxPoints: 12,
      status: 'Rookie License (Grade A)',
      statusEs: 'Superlicencia Rookie (Grado A)',
      riskLevel: 'clean',
      notes: 'Clean record with zero penalty points.',
      notesEs: 'Historial impecable sin puntos de penalización.',
    },
  },

  // George Russell (63 / RUS) - Mercedes
  63: {
    h2h: {
      teammateNumber: 12,
      teammateCode: 'ANT',
      teammateName: 'Kimi Antonelli',
      qualy: [7, 7],
      race: [4, 10],
      points: [211, 292],
    },
    form: [
      { race: 'BEL', pos: 'DNF', type: 'dnf' },
      { race: 'HUN', pos: 'P7', type: 'points' },
      { race: 'NLD', pos: 'P3', type: 'podium' },
      { race: 'ITA', pos: 'P2', type: 'podium' },
      { race: 'MAD', pos: 'P5', type: 'points' },
    ],
    superLicense: {
      points: 2,
      maxPoints: 12,
      status: 'Active (Grade A)',
      statusEs: 'Activa (Grado A)',
      riskLevel: 'clean',
      notes: '2/12 penalty points active.',
      notesEs: '2/12 puntos activos por exceder límites de pista.',
    },
  },

  // Lewis Hamilton (44 / HAM) - Ferrari
  44: {
    h2h: {
      teammateNumber: 16,
      teammateCode: 'LEC',
      teammateName: 'Charles Leclerc',
      qualy: [6, 8],
      race: [8, 6],
      points: [191, 167],
    },
    form: [
      { race: 'BEL', pos: 'P4', type: 'points' },
      { race: 'HUN', pos: 'P5', type: 'points' },
      { race: 'NLD', pos: 'P4', type: 'points' },
      { race: 'ITA', pos: 'P6', type: 'points' },
      { race: 'MAD', pos: 'DNF', type: 'dnf' },
    ],
    superLicense: {
      points: 2,
      maxPoints: 12,
      status: 'Active (Grade A)',
      statusEs: 'Activa (Grado A)',
      riskLevel: 'clean',
      notes: '2/12 penalty points active.',
      notesEs: '2/12 puntos de penalización activos.',
    },
  },

  // Charles Leclerc (16 / LEC) - Ferrari
  16: {
    h2h: {
      teammateNumber: 44,
      teammateCode: 'HAM',
      teammateName: 'Lewis Hamilton',
      qualy: [8, 6],
      race: [6, 8],
      points: [167, 191],
    },
    form: [
      { race: 'BEL', pos: 'P2', type: 'podium' },
      { race: 'HUN', pos: 'P4', type: 'points' },
      { race: 'NLD', pos: 'P5', type: 'points' },
      { race: 'ITA', pos: 'DNF', type: 'dnf' },
      { race: 'MAD', pos: 'P4', type: 'points' },
    ],
    superLicense: {
      points: 1,
      maxPoints: 12,
      status: 'Active (Grade A)',
      statusEs: 'Activa (Grado A)',
      riskLevel: 'clean',
      notes: '1/12 penalty point active.',
      notesEs: '1/12 punto de penalización activo.',
    },
  },

  // Lando Norris (4 / NOR) - McLaren
  4: {
    h2h: {
      teammateNumber: 81,
      teammateCode: 'PIA',
      teammateName: 'Oscar Piastri',
      qualy: [8, 6],
      race: [8, 6],
      points: [186, 120],
    },
    form: [
      { race: 'BEL', pos: 'P7', type: 'points' },
      { race: 'HUN', pos: 'P1', type: 'podium' },
      { race: 'NLD', pos: 'P1', type: 'podium' },
      { race: 'ITA', pos: 'P4', type: 'points' },
      { race: 'MAD', pos: 'P3', type: 'podium' },
    ],
    superLicense: {
      points: 2,
      maxPoints: 12,
      status: 'Active (Grade A)',
      statusEs: 'Activa (Grado A)',
      riskLevel: 'clean',
      notes: '2/12 penalty points active for minor track limits breaches.',
      notesEs: '2/12 puntos activos por límites de pista.',
    },
  },

  // Oscar Piastri (81 / PIA) - McLaren
  81: {
    h2h: {
      teammateNumber: 4,
      teammateCode: 'NOR',
      teammateName: 'Lando Norris',
      qualy: [6, 8],
      race: [6, 8],
      points: [120, 186],
    },
    form: [
      { race: 'BEL', pos: 'P5', type: 'points' },
      { race: 'HUN', pos: 'DNF', type: 'dnf' },
      { race: 'NLD', pos: 'P6', type: 'points' },
      { race: 'ITA', pos: 'P5', type: 'points' },
      { race: 'MAD', pos: 'P8', type: 'points' },
    ],
    superLicense: {
      points: 1,
      maxPoints: 12,
      status: 'Active (Grade A)',
      statusEs: 'Activa (Grado A)',
      riskLevel: 'clean',
      notes: '1/12 penalty point active.',
      notesEs: '1/12 punto activo.',
    },
  },

  // Max Verstappen (1 / VER) - Red Bull
  1: {
    h2h: {
      teammateNumber: 6,
      teammateCode: 'HAD',
      teammateName: 'Isack Hadjar',
      qualy: [8, 3],
      race: [8, 3],
      points: [145, 71],
    },
    form: [
      { race: 'BEL', pos: 'P3', type: 'podium' },
      { race: 'HUN', pos: 'P2', type: 'podium' },
      { race: 'NLD', pos: 'DNF', type: 'dnf' },
      { race: 'ITA', pos: 'P3', type: 'podium' },
      { race: 'MAD', pos: 'P2', type: 'podium' },
    ],
    superLicense: {
      points: 4,
      maxPoints: 12,
      status: 'Active (Grade A)',
      statusEs: 'Activa (Grado A)',
      riskLevel: 'clean',
      notes: '4/12 penalty points active (2 points expire in October).',
      notesEs: '4/12 puntos de penalización activos (2 vencen en octubre).',
    },
  },

  // Isack Hadjar (6 / HAD) - Red Bull
  6: {
    h2h: {
      teammateNumber: 1,
      teammateCode: 'VER',
      teammateName: 'Max Verstappen',
      qualy: [3, 8],
      race: [3, 8],
      points: [71, 145],
    },
    form: [
      { race: 'CAN', pos: 'P7', type: 'points' },
      { race: 'AUT', pos: 'P9', type: 'points' },
      { race: 'GBR', pos: 'P8', type: 'points' },
      { race: 'BEL', pos: 'P6', type: 'points' },
      { race: 'HUN', pos: 'P6', type: 'points' },
    ],
    superLicense: {
      points: 0,
      maxPoints: 12,
      status: 'Clean & Active (Grade A)',
      statusEs: 'Limpia y Activa (Grado A)',
      riskLevel: 'clean',
      notes: '0 penalty points active.',
      notesEs: 'Sin puntos de penalización activos.',
    },
  },

  // Liam Lawson (30 / LAW) - RB F1 Team
  30: {
    h2h: {
      teammateNumber: 41,
      teammateCode: 'LIN',
      teammateName: 'Arvid Lindblad',
      qualy: [8, 6],
      race: [10, 4],
      points: [59, 31],
    },
    form: [
      { race: 'BEL', pos: 'P12', type: 'unclassified' },
      { race: 'HUN', pos: 'P8', type: 'points' },
      { race: 'NLD', pos: 'P7', type: 'points' },
      { race: 'ITA', pos: 'P14', type: 'unclassified' },
      { race: 'MAD', pos: 'P6', type: 'points' },
    ],
    superLicense: {
      points: 2,
      maxPoints: 12,
      status: 'Active (Grade A)',
      statusEs: 'Activa (Grado A)',
      riskLevel: 'clean',
      notes: '2/12 penalty points active.',
      notesEs: '2/12 puntos de penalización activos.',
    },
  },

  // Arvid Lindblad (41 / LIN) - RB F1 Team
  41: {
    h2h: {
      teammateNumber: 30,
      teammateCode: 'LAW',
      teammateName: 'Liam Lawson',
      qualy: [6, 8],
      race: [4, 10],
      points: [31, 59],
    },
    form: [
      { race: 'BEL', pos: 'P9', type: 'points' },
      { race: 'HUN', pos: 'P10', type: 'points' },
      { race: 'NLD', pos: 'P12', type: 'unclassified' },
      { race: 'ITA', pos: 'P8', type: 'points' },
      { race: 'MAD', pos: 'P9', type: 'points' },
    ],
    superLicense: {
      points: 0,
      maxPoints: 12,
      status: 'Clean & Active (Grade A)',
      statusEs: 'Limpia y Activa (Grado A)',
      riskLevel: 'clean',
      notes: 'Rookie record with zero penalty points.',
      notesEs: 'Historial de debutante sin puntos de penalización.',
    },
  },

  // Oliver Bearman (87 / BEA) - Haas F1 Team
  87: {
    h2h: {
      teammateNumber: 31,
      teammateCode: 'OCO',
      teammateName: 'Esteban Ocon',
      qualy: [9, 5],
      race: [8, 6],
      points: [18, 3],
    },
    form: [
      { race: 'BEL', pos: 'P14', type: 'unclassified' },
      { race: 'HUN', pos: 'P19', type: 'unclassified' },
      { race: 'NLD', pos: 'DNF', type: 'dnf' },
      { race: 'ITA', pos: 'P15', type: 'unclassified' },
      { race: 'MAD', pos: 'P16', type: 'unclassified' },
    ],
    superLicense: {
      points: 2,
      maxPoints: 12,
      status: 'Active (Grade A)',
      statusEs: 'Activa (Grado A)',
      riskLevel: 'clean',
      notes: '2/12 penalty points active.',
      notesEs: '2/12 puntos de penalización activos.',
    },
  },

  // Esteban Ocon (31 / OCO) - Haas F1 Team
  31: {
    h2h: {
      teammateNumber: 87,
      teammateCode: 'BEA',
      teammateName: 'Oliver Bearman',
      qualy: [5, 9],
      race: [6, 8],
      points: [3, 18],
    },
    form: [
      { race: 'BEL', pos: 'P17', type: 'unclassified' },
      { race: 'HUN', pos: 'P16', type: 'unclassified' },
      { race: 'NLD', pos: 'DNF', type: 'dnf' },
      { race: 'ITA', pos: 'P16', type: 'unclassified' },
      { race: 'MAD', pos: 'P11', type: 'unclassified' },
    ],
    superLicense: {
      points: 4,
      maxPoints: 12,
      status: 'Active (Grade A)',
      statusEs: 'Activa (Grado A)',
      riskLevel: 'clean',
      notes: '4 penalty points active.',
      notesEs: '4 puntos de penalización activos.',
    },
  },

  // Gabriel Bortoleto (5 / BOR) - Audi
  5: {
    h2h: {
      teammateNumber: 27,
      teammateCode: 'HUL',
      teammateName: 'Nico Hülkenberg',
      qualy: [7, 7],
      race: [8, 6],
      points: [10, 7],
    },
    form: [
      { race: 'BEL', pos: 'P8', type: 'points' },
      { race: 'HUN', pos: 'P11', type: 'unclassified' },
      { race: 'NLD', pos: 'P13', type: 'unclassified' },
      { race: 'ITA', pos: 'P11', type: 'unclassified' },
      { race: 'MAD', pos: 'P13', type: 'unclassified' },
    ],
    superLicense: {
      points: 0,
      maxPoints: 12,
      status: 'Clean & Active (Grade A)',
      statusEs: 'Limpia y Activa (Grado A)',
      riskLevel: 'clean',
      notes: 'Clean record with zero penalty points.',
      notesEs: 'Historial impecable sin penalizaciones.',
    },
  },

  // Nico Hülkenberg (27 / HUL) - Audi
  27: {
    h2h: {
      teammateNumber: 5,
      teammateCode: 'BOR',
      teammateName: 'Gabriel Bortoleto',
      qualy: [7, 7],
      race: [6, 8],
      points: [7, 10],
    },
    form: [
      { race: 'BEL', pos: 'P13', type: 'unclassified' },
      { race: 'HUN', pos: 'P9', type: 'points' },
      { race: 'NLD', pos: 'P8', type: 'points' },
      { race: 'ITA', pos: 'P12', type: 'unclassified' },
      { race: 'MAD', pos: 'P10', type: 'points' },
    ],
    superLicense: {
      points: 4,
      maxPoints: 12,
      status: 'Active (Grade A)',
      statusEs: 'Activa (Grado A)',
      riskLevel: 'clean',
      notes: '4 penalty points active.',
      notesEs: '4 puntos de penalización activos.',
    },
  },

  // Carlos Sainz (55 / SAI) - Williams
  55: {
    h2h: {
      teammateNumber: 23,
      teammateCode: 'ALB',
      teammateName: 'Alexander Albon',
      qualy: [9, 5],
      race: [8, 6],
      points: [6, 5],
    },
    form: [
      { race: 'BEL', pos: 'P16', type: 'unclassified' },
      { race: 'HUN', pos: 'P18', type: 'unclassified' },
      { race: 'NLD', pos: 'P16', type: 'unclassified' },
      { race: 'ITA', pos: 'P13', type: 'unclassified' },
      { race: 'MAD', pos: 'DNF', type: 'dnf' },
    ],
    superLicense: {
      points: 3,
      maxPoints: 12,
      status: 'Active (Grade A)',
      statusEs: 'Activa (Grado A)',
      riskLevel: 'clean',
      notes: '3 penalty points active.',
      notesEs: '3 puntos de penalización activos.',
    },
  },

  // Alexander Albon (23 / ALB) - Williams
  23: {
    h2h: {
      teammateNumber: 55,
      teammateCode: 'SAI',
      teammateName: 'Carlos Sainz',
      qualy: [5, 9],
      race: [6, 8],
      points: [5, 6],
    },
    form: [
      { race: 'BEL', pos: 'P15', type: 'unclassified' },
      { race: 'HUN', pos: 'P17', type: 'unclassified' },
      { race: 'NLD', pos: 'P17', type: 'unclassified' },
      { race: 'ITA', pos: 'P17', type: 'unclassified' },
      { race: 'MAD', pos: 'P15', type: 'unclassified' },
    ],
    superLicense: {
      points: 1,
      maxPoints: 12,
      status: 'Active (Grade A)',
      statusEs: 'Activa (Grado A)',
      riskLevel: 'clean',
      notes: '1 penalty point active.',
      notesEs: '1 punto de penalización activo.',
    },
  },

  // Fernando Alonso (14 / ALO) - Aston Martin
  14: {
    h2h: {
      teammateNumber: 18,
      teammateCode: 'STR',
      teammateName: 'Lance Stroll',
      qualy: [11, 3],
      race: [10, 4],
      points: [3, 0],
    },
    form: [
      { race: 'BEL', pos: 'P19', type: 'unclassified' },
      { race: 'HUN', pos: 'P14', type: 'unclassified' },
      { race: 'NLD', pos: 'P9', type: 'points' },
      { race: 'ITA', pos: 'DNF', type: 'dnf' },
      { race: 'MAD', pos: 'P17', type: 'unclassified' },
    ],
    superLicense: {
      points: 8,
      maxPoints: 12,
      status: 'Warning Level (8/12 pts)',
      statusEs: 'Nivel de Advertencia (8/12 pts)',
      riskLevel: 'danger',
      notes: '8 penalty points active across the rolling year.',
      notesEs: '8 puntos de penalización activos acumulados.',
    },
  },

  // Lance Stroll (18 / STR) - Aston Martin
  18: {
    h2h: {
      teammateNumber: 14,
      teammateCode: 'ALO',
      teammateName: 'Fernando Alonso',
      qualy: [3, 11],
      race: [4, 10],
      points: [0, 3],
    },
    form: [
      { race: 'BEL', pos: 'DNF', type: 'dnf' },
      { race: 'HUN', pos: 'P13', type: 'unclassified' },
      { race: 'NLD', pos: 'DNF', type: 'dnf' },
      { race: 'ITA', pos: 'DNF', type: 'dnf' },
      { race: 'MAD', pos: 'DNF', type: 'dnf' },
    ],
    superLicense: {
      points: 5,
      maxPoints: 12,
      status: 'Active (Grade A)',
      statusEs: 'Activa (Grado A)',
      riskLevel: 'moderate',
      notes: '5 penalty points active.',
      notesEs: '5 puntos de penalización activos.',
    },
  },

  // Valtteri Bottas (77 / BOT) - Cadillac F1 Team
  77: {
    h2h: {
      teammateNumber: 11,
      teammateCode: 'PER',
      teammateName: 'Sergio Pérez',
      qualy: [7, 7],
      race: [4, 10],
      points: [0, 0],
    },
    form: [
      { race: 'BEL', pos: 'P18', type: 'unclassified' },
      { race: 'HUN', pos: 'DNF', type: 'dnf' },
      { race: 'NLD', pos: 'DNF', type: 'dnf' },
      { race: 'ITA', pos: 'P19', type: 'unclassified' },
      { race: 'MAD', pos: 'P18', type: 'unclassified' },
    ],
    superLicense: {
      points: 1,
      maxPoints: 12,
      status: 'Active (Grade A)',
      statusEs: 'Activa (Grado A)',
      riskLevel: 'clean',
      notes: '1 penalty point active.',
      notesEs: '1 punto de penalización activo.',
    },
  },

  // Sergio Pérez (11 / PER) - Cadillac F1 Team
  11: {
    h2h: {
      teammateNumber: 77,
      teammateCode: 'BOT',
      teammateName: 'Valtteri Bottas',
      qualy: [7, 7],
      race: [10, 4],
      points: [0, 0],
    },
    form: [
      { race: 'BEL', pos: 'DNF', type: 'dnf' },
      { race: 'HUN', pos: 'DNF', type: 'dnf' },
      { race: 'NLD', pos: 'P15', type: 'unclassified' },
      { race: 'ITA', pos: 'P18', type: 'unclassified' },
      { race: 'MAD', pos: 'DNF', type: 'dnf' },
    ],
    superLicense: {
      points: 5,
      maxPoints: 12,
      status: 'Active (Grade A)',
      statusEs: 'Activa (Grado A)',
      riskLevel: 'moderate',
      notes: '5 penalty points active.',
      notesEs: '5 puntos de penalización activos.',
    },
  },

  // Yuki Tsunoda (22 / TSU) - RB F1 Team
  22: {
    h2h: {
      teammateNumber: 30,
      teammateCode: 'LAW',
      teammateName: 'Liam Lawson',
      qualy: [2, 1],
      race: [2, 1],
      points: [1, 59],
    },
    form: [
      { race: 'AUT', pos: 'P11', type: 'unclassified' },
      { race: 'GBR', pos: 'P10', type: 'points' },
      { race: 'NLD', pos: 'P11', type: 'unclassified' },
      { race: 'ITA', pos: 'P10', type: 'points' },
      { race: 'MAD', pos: 'P14', type: 'unclassified' },
    ],
    superLicense: {
      points: 3,
      maxPoints: 12,
      status: 'Active (Grade A)',
      statusEs: 'Activa (Grado A)',
      riskLevel: 'clean',
      notes: '3 penalty points active.',
      notesEs: '3 puntos de penalización activos.',
    },
  },
};

// Fallback analytics for unmapped or junior drivers
const DEFAULT_ANALYTICS: DriverAnalytics = {
  h2h: {
    teammateNumber: 0,
    teammateCode: '',
    teammateName: '',
    qualy: [0, 0],
    race: [0, 0],
    points: [0, 0],
  },
  form: [
    { race: 'BEL', pos: 'P10', type: 'points' },
    { race: 'HUN', pos: 'P10', type: 'points' },
    { race: 'NLD', pos: 'P10', type: 'points' },
    { race: 'ITA', pos: 'P10', type: 'points' },
    { race: 'MAD', pos: 'P10', type: 'points' },
  ],
  superLicense: {
    points: 0,
    maxPoints: 12,
    status: 'Clean (Grade A)',
    statusEs: 'Limpia (Grado A)',
    riskLevel: 'clean',
    notes: 'Zero penalty points active.',
    notesEs: 'Sin puntos de penalización activos.',
  },
};

// Code-to-number mapping for flexible lookups
const DRIVER_CODE_TO_NUMBER: Record<string, number> = {
  COL: 43,
  VER: 1,
  NOR: 4,
  LEC: 16,
  PIA: 81,
  SAI: 55,
  HAM: 44,
  RUS: 63,
  PER: 11,
  ALO: 14,
  GAS: 10,
  OCO: 31,
  STR: 18,
  HUL: 27,
  TSU: 22,
  ALB: 23,
  LAW: 30,
  BEA: 87,
  BOT: 77,
  ANT: 12,
  BOR: 5,
  HAD: 6,
  LIN: 41,
};

export function getDriverAnalytics(numberOrCode: number | string): DriverAnalytics {
  if (typeof numberOrCode === 'number') {
    return DRIVER_ANALYTICS_DATA[numberOrCode] || DEFAULT_ANALYTICS;
  }

  const num = parseInt(numberOrCode, 10);
  if (!isNaN(num) && DRIVER_ANALYTICS_DATA[num]) {
    return DRIVER_ANALYTICS_DATA[num];
  }

  const upperCode = String(numberOrCode).toUpperCase().trim();
  const mappedNum = DRIVER_CODE_TO_NUMBER[upperCode];
  if (mappedNum && DRIVER_ANALYTICS_DATA[mappedNum]) {
    return DRIVER_ANALYTICS_DATA[mappedNum];
  }

  return DEFAULT_ANALYTICS;
}
