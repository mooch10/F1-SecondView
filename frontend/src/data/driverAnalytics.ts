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
  // Franco Colapinto (43)
  43: {
    h2h: {
      teammateNumber: 10,
      teammateCode: 'GAS',
      teammateName: 'Pierre Gasly',
      qualy: [12, 11],
      race: [13, 10],
      points: [54, 48],
    },
    form: [
      { race: 'CAN', pos: 'P6', type: 'points' },
      { race: 'ESP', pos: 'P8', type: 'points' },
      { race: 'AUT', pos: 'P7', type: 'points' },
      { race: 'GBR', pos: 'P5', type: 'points' },
      { race: 'BEL', pos: 'P9', type: 'points' },
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

  // Max Verstappen (1)
  1: {
    h2h: {
      teammateNumber: 22,
      teammateCode: 'TSU',
      teammateName: 'Yuki Tsunoda',
      qualy: [20, 3],
      race: [21, 2],
      points: [340, 68],
    },
    form: [
      { race: 'CAN', pos: 'P1', type: 'podium' },
      { race: 'ESP', pos: 'P2', type: 'podium' },
      { race: 'AUT', pos: 'P1', type: 'podium' },
      { race: 'GBR', pos: 'P2', type: 'podium' },
      { race: 'BEL', pos: 'P1', type: 'podium' },
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

  // Lando Norris (4)
  4: {
    h2h: {
      teammateNumber: 81,
      teammateCode: 'PIA',
      teammateName: 'Oscar Piastri',
      qualy: [13, 10],
      race: [12, 11],
      points: [285, 260],
    },
    form: [
      { race: 'CAN', pos: 'P2', type: 'podium' },
      { race: 'ESP', pos: 'P1', type: 'podium' },
      { race: 'AUT', pos: 'P3', type: 'podium' },
      { race: 'GBR', pos: 'P1', type: 'podium' },
      { race: 'BEL', pos: 'P4', type: 'points' },
    ],
    superLicense: {
      points: 2,
      maxPoints: 12,
      status: 'Active (Grade A)',
      statusEs: 'Activa (Grado A)',
      riskLevel: 'clean',
      notes: '2/12 penalty points active for minor track limits breaches.',
      notesEs: '2/12 puntos activos por exceder límites de pista.',
    },
  },

  // Oscar Piastri (81)
  81: {
    h2h: {
      teammateNumber: 4,
      teammateCode: 'NOR',
      teammateName: 'Lando Norris',
      qualy: [10, 13],
      race: [11, 12],
      points: [260, 285],
    },
    form: [
      { race: 'CAN', pos: 'P4', type: 'points' },
      { race: 'ESP', pos: 'P3', type: 'podium' },
      { race: 'AUT', pos: 'P2', type: 'podium' },
      { race: 'GBR', pos: 'P3', type: 'podium' },
      { race: 'BEL', pos: 'P2', type: 'podium' },
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

  // Charles Leclerc (16)
  16: {
    h2h: {
      teammateNumber: 44,
      teammateCode: 'HAM',
      teammateName: 'Lewis Hamilton',
      qualy: [14, 9],
      race: [13, 10],
      points: [242, 210],
    },
    form: [
      { race: 'CAN', pos: 'P3', type: 'podium' },
      { race: 'ESP', pos: 'P5', type: 'points' },
      { race: 'AUT', pos: 'P4', type: 'points' },
      { race: 'GBR', pos: 'P4', type: 'points' },
      { race: 'BEL', pos: 'P3', type: 'podium' },
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

  // Lewis Hamilton (44)
  44: {
    h2h: {
      teammateNumber: 16,
      teammateCode: 'LEC',
      teammateName: 'Charles Leclerc',
      qualy: [9, 14],
      race: [10, 13],
      points: [210, 242],
    },
    form: [
      { race: 'CAN', pos: 'P5', type: 'points' },
      { race: 'ESP', pos: 'P4', type: 'points' },
      { race: 'AUT', pos: 'P5', type: 'points' },
      { race: 'GBR', pos: 'P2', type: 'podium' },
      { race: 'BEL', pos: 'P5', type: 'points' },
    ],
    superLicense: {
      points: 2,
      maxPoints: 12,
      status: 'Active (Grade A)',
      statusEs: 'Activa (Grado A)',
      riskLevel: 'clean',
      notes: '2/12 penalty points active.',
      notesEs: '2/12 puntos activos.',
    },
  },

  // George Russell (63)
  63: {
    h2h: {
      teammateNumber: 12,
      teammateCode: 'ANT',
      teammateName: 'Kimi Antonelli',
      qualy: [16, 7],
      race: [17, 6],
      points: [195, 88],
    },
    form: [
      { race: 'CAN', pos: 'P1', type: 'podium' },
      { race: 'ESP', pos: 'P6', type: 'points' },
      { race: 'AUT', pos: 'P6', type: 'points' },
      { race: 'GBR', pos: 'DNF', type: 'dnf' },
      { race: 'BEL', pos: 'P6', type: 'points' },
    ],
    superLicense: {
      points: 2,
      maxPoints: 12,
      status: 'Active (Grade A)',
      statusEs: 'Activa (Grado A)',
      riskLevel: 'clean',
      notes: '2/12 penalty points active.',
      notesEs: '2/12 puntos activos.',
    },
  },

  // Kimi Antonelli (12)
  12: {
    h2h: {
      teammateNumber: 63,
      teammateCode: 'RUS',
      teammateName: 'George Russell',
      qualy: [7, 16],
      race: [6, 17],
      points: [88, 195],
    },
    form: [
      { race: 'CAN', pos: 'P8', type: 'points' },
      { race: 'ESP', pos: 'P7', type: 'points' },
      { race: 'AUT', pos: 'P8', type: 'points' },
      { race: 'GBR', pos: 'P6', type: 'points' },
      { race: 'BEL', pos: 'P7', type: 'points' },
    ],
    superLicense: {
      points: 2,
      maxPoints: 12,
      status: 'Rookie License (Grade A)',
      statusEs: 'Superlicencia Rookie (Grado A)',
      riskLevel: 'clean',
      notes: '2/12 penalty points.',
      notesEs: '2/12 puntos.',
    },
  },

  // Fernando Alonso (14)
  14: {
    h2h: {
      teammateNumber: 18,
      teammateCode: 'STR',
      teammateName: 'Lance Stroll',
      qualy: [18, 5],
      race: [17, 6],
      points: [78, 26],
    },
    form: [
      { race: 'CAN', pos: 'P7', type: 'points' },
      { race: 'ESP', pos: 'P9', type: 'points' },
      { race: 'AUT', pos: 'P11', type: 'unclassified' },
      { race: 'GBR', pos: 'P8', type: 'points' },
      { race: 'BEL', pos: 'P8', type: 'points' },
    ],
    superLicense: {
      points: 6,
      maxPoints: 12,
      status: 'Active (Grade A)',
      statusEs: 'Activa (Grado A)',
      riskLevel: 'moderate',
      notes: '6/12 penalty points active. Caution advised.',
      notesEs: '6/12 puntos de penalización activos. Precaución aconsejada.',
    },
  },

  // Lance Stroll (18)
  18: {
    h2h: {
      teammateNumber: 14,
      teammateCode: 'ALO',
      teammateName: 'Fernando Alonso',
      qualy: [5, 18],
      race: [6, 17],
      points: [26, 78],
    },
    form: [
      { race: 'CAN', pos: 'P10', type: 'points' },
      { race: 'ESP', pos: 'P12', type: 'unclassified' },
      { race: 'AUT', pos: 'P13', type: 'unclassified' },
      { race: 'GBR', pos: 'P10', type: 'points' },
      { race: 'BEL', pos: 'P11', type: 'unclassified' },
    ],
    superLicense: {
      points: 5,
      maxPoints: 12,
      status: 'Active (Grade A)',
      statusEs: 'Activa (Grado A)',
      riskLevel: 'moderate',
      notes: '5/12 penalty points.',
      notesEs: '5/12 puntos activos.',
    },
  },

  // Pierre Gasly (10)
  10: {
    h2h: {
      teammateNumber: 43,
      teammateCode: 'COL',
      teammateName: 'Franco Colapinto',
      qualy: [11, 12],
      race: [10, 13],
      points: [48, 54],
    },
    form: [
      { race: 'CAN', pos: 'P9', type: 'points' },
      { race: 'ESP', pos: 'P10', type: 'points' },
      { race: 'AUT', pos: 'P9', type: 'points' },
      { race: 'GBR', pos: 'P7', type: 'points' },
      { race: 'BEL', pos: 'P10', type: 'points' },
    ],
    superLicense: {
      points: 2,
      maxPoints: 12,
      status: 'Active (Grade A)',
      statusEs: 'Activa (Grado A)',
      riskLevel: 'clean',
      notes: '2/12 penalty points.',
      notesEs: '2/12 puntos.',
    },
  },

  // Carlos Sainz (55)
  55: {
    h2h: {
      teammateNumber: 23,
      teammateCode: 'ALB',
      teammateName: 'Alexander Albon',
      qualy: [12, 11],
      race: [13, 10],
      points: [52, 38],
    },
    form: [
      { race: 'CAN', pos: 'P7', type: 'points' },
      { race: 'ESP', pos: 'P6', type: 'points' },
      { race: 'AUT', pos: 'P8', type: 'points' },
      { race: 'GBR', pos: 'P9', type: 'points' },
      { race: 'BEL', pos: 'P6', type: 'points' },
    ],
    superLicense: {
      points: 1,
      maxPoints: 12,
      status: 'Active (Grade A)',
      statusEs: 'Activa (Grado A)',
      riskLevel: 'clean',
      notes: '1/12 penalty point.',
      notesEs: '1/12 punto.',
    },
  },

  // Alexander Albon (23)
  23: {
    h2h: {
      teammateNumber: 55,
      teammateCode: 'SAI',
      teammateName: 'Carlos Sainz',
      qualy: [11, 12],
      race: [10, 13],
      points: [38, 52],
    },
    form: [
      { race: 'CAN', pos: 'P8', type: 'points' },
      { race: 'ESP', pos: 'P9', type: 'points' },
      { race: 'AUT', pos: 'P10', type: 'points' },
      { race: 'GBR', pos: 'P11', type: 'unclassified' },
      { race: 'BEL', pos: 'P8', type: 'points' },
    ],
    superLicense: {
      points: 1,
      maxPoints: 12,
      status: 'Active (Grade A)',
      statusEs: 'Activa (Grado A)',
      riskLevel: 'clean',
      notes: '1/12 penalty point.',
      notesEs: '1/12 punto.',
    },
  },
};

export const DEFAULT_DRIVER_ANALYTICS: DriverAnalytics = {
  h2h: {
    teammateNumber: 0,
    teammateCode: '---',
    teammateName: 'Compañero',
    qualy: [10, 10],
    race: [10, 10],
    points: [30, 30],
  },
  form: [
    { race: 'CAN', pos: 'P10', type: 'points' },
    { race: 'ESP', pos: 'P11', type: 'unclassified' },
    { race: 'AUT', pos: 'P9', type: 'points' },
    { race: 'GBR', pos: 'P12', type: 'unclassified' },
    { race: 'BEL', pos: 'P10', type: 'points' },
  ],
  superLicense: {
    points: 2,
    maxPoints: 12,
    status: 'Active (Grade A)',
    statusEs: 'Activa (Grado A)',
    riskLevel: 'clean',
    notes: 'Super License in good standing.',
    notesEs: 'Superlicencia en regla.',
  },
};

export function getDriverAnalytics(numberOrCode: number | string): DriverAnalytics {
  if (typeof numberOrCode === 'number' && DRIVER_ANALYTICS_DATA[numberOrCode]) {
    return DRIVER_ANALYTICS_DATA[numberOrCode];
  }

  // Check code
  const codeStr = String(numberOrCode).toUpperCase();
  const codeMap: Record<string, number> = {
    'COL': 43, 'VER': 1, 'NOR': 4, 'PIA': 81, 'LEC': 16,
    'HAM': 44, 'RUS': 63, 'ANT': 12, 'ALO': 14, 'STR': 18,
    'GAS': 10, 'SAI': 55, 'ALB': 23,
  };

  const num = codeMap[codeStr];
  if (num && DRIVER_ANALYTICS_DATA[num]) {
    return DRIVER_ANALYTICS_DATA[num];
  }

  return DEFAULT_DRIVER_ANALYTICS;
}
