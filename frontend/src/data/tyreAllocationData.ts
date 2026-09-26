export interface DriverTyreSets {
  driverNumber: number;
  code: string;
  fullName: string;
  teamName: string;
  teamColor: string;
  hard: {
    compound: string; // 'C3'
    newSets: number;
    usedSets: number;
  };
  medium: {
    compound: string; // 'C4'
    newSets: number;
    usedSets: number;
  };
  soft: {
    compound: string; // 'C5'
    newSets: number;
    usedSets: number;
  };
  recommendedStrategy: string;
  recommendedStrategyEs: string;
  pitLossSeconds: number;
}

export const TYRE_ALLOCATION_DATA_2026: DriverTyreSets[] = [
  {
    driverNumber: 63,
    code: 'RUS',
    fullName: 'George Russell',
    teamName: 'Mercedes-AMG PETRONAS F1 Team',
    teamColor: '#00D7B6',
    hard: { compound: 'C3', newSets: 2, usedSets: 0 },
    medium: { compound: 'C4', newSets: 2, usedSets: 1 },
    soft: { compound: 'C5', newSets: 1, usedSets: 3 },
    recommendedStrategy: '2 Stops: Medium (L1-35) -> Soft -> Soft',
    recommendedStrategyEs: '2 Paradas: Medio (Vta 1-35) -> Blando -> Blando',
    pitLossSeconds: 20.6,
  },
  {
    driverNumber: 3,
    code: 'VER',
    fullName: 'Max Verstappen',
    teamName: 'Oracle Red Bull Racing',
    teamColor: '#4781D7',
    hard: { compound: 'C3', newSets: 1, usedSets: 1 },
    medium: { compound: 'C4', newSets: 2, usedSets: 1 },
    soft: { compound: 'C5', newSets: 1, usedSets: 3 },
    recommendedStrategy: '2 Stops: Medium -> Soft -> Soft (Aggressive sprint)',
    recommendedStrategyEs: '2 Paradas: Medio -> Blando -> Blando (Sprint agresivo)',
    pitLossSeconds: 20.6,
  },
  {
    driverNumber: 6,
    code: 'HAD',
    fullName: 'Isack Hadjar',
    teamName: 'Oracle Red Bull Racing',
    teamColor: '#4781D7',
    hard: { compound: 'C3', newSets: 1, usedSets: 1 },
    medium: { compound: 'C4', newSets: 2, usedSets: 0 },
    soft: { compound: 'C5', newSets: 1, usedSets: 3 },
    recommendedStrategy: '2 Stops: Soft -> Medium -> Medium',
    recommendedStrategyEs: '2 Paradas: Blando -> Medio -> Medio',
    pitLossSeconds: 20.6,
  },
  {
    driverNumber: 16,
    code: 'LEC',
    fullName: 'Charles Leclerc',
    teamName: 'Scuderia Ferrari HP',
    teamColor: '#ED1131',
    hard: { compound: 'C3', newSets: 1, usedSets: 1 },
    medium: { compound: 'C4', newSets: 2, usedSets: 1 },
    soft: { compound: 'C5', newSets: 0, usedSets: 4 },
    recommendedStrategy: '2 Stops: Soft -> Medium -> Medium',
    recommendedStrategyEs: '2 Paradas: Blando -> Medio -> Medio',
    pitLossSeconds: 20.6,
  },
  {
    driverNumber: 12,
    code: 'ANT',
    fullName: 'Andrea Kimi Antonelli',
    teamName: 'Mercedes-AMG PETRONAS F1 Team',
    teamColor: '#00D7B6',
    hard: { compound: 'C3', newSets: 2, usedSets: 0 },
    medium: { compound: 'C4', newSets: 1, usedSets: 1 },
    soft: { compound: 'C5', newSets: 1, usedSets: 3 },
    recommendedStrategy: '2 Stops: Medium -> Soft -> Soft',
    recommendedStrategyEs: '2 Paradas: Medio -> Blando -> Blando',
    pitLossSeconds: 20.6,
  },
  {
    driverNumber: 44,
    code: 'HAM',
    fullName: 'Lewis Hamilton',
    teamName: 'Scuderia Ferrari HP',
    teamColor: '#ED1131',
    hard: { compound: 'C3', newSets: 2, usedSets: 0 },
    medium: { compound: 'C4', newSets: 2, usedSets: 0 },
    soft: { compound: 'C5', newSets: 0, usedSets: 4 },
    recommendedStrategy: '2 Stops: Soft -> Medium -> Medium',
    recommendedStrategyEs: '2 Paradas: Blando -> Medio -> Medio',
    pitLossSeconds: 20.6,
  },
  {
    driverNumber: 41,
    code: 'LIN',
    fullName: 'Arvid Lindblad',
    teamName: 'Visa Cash App RB',
    teamColor: '#6C98FF',
    hard: { compound: 'C3', newSets: 1, usedSets: 1 },
    medium: { compound: 'C4', newSets: 2, usedSets: 0 },
    soft: { compound: 'C5', newSets: 1, usedSets: 3 },
    recommendedStrategy: '2 Stops: Medium -> Soft -> Soft',
    recommendedStrategyEs: '2 Paradas: Medio -> Blando -> Blando',
    pitLossSeconds: 20.6,
  },
  {
    driverNumber: 31,
    code: 'OCO',
    fullName: 'Esteban Ocon',
    teamName: 'MoneyGram Haas F1 Team',
    teamColor: '#9C9FA2',
    hard: { compound: 'C3', newSets: 1, usedSets: 1 },
    medium: { compound: 'C4', newSets: 2, usedSets: 1 },
    soft: { compound: 'C5', newSets: 1, usedSets: 3 },
    recommendedStrategy: '2 Stops: Soft -> Medium -> Medium',
    recommendedStrategyEs: '2 Paradas: Blando -> Medio -> Medio',
    pitLossSeconds: 20.6,
  },
  {
    driverNumber: 87,
    code: 'BEA',
    fullName: 'Oliver Bearman',
    teamName: 'MoneyGram Haas F1 Team',
    teamColor: '#9C9FA2',
    hard: { compound: 'C3', newSets: 1, usedSets: 1 },
    medium: { compound: 'C4', newSets: 2, usedSets: 1 },
    soft: { compound: 'C5', newSets: 1, usedSets: 3 },
    recommendedStrategy: '2 Stops: Soft -> Medium -> Medium',
    recommendedStrategyEs: '2 Paradas: Blando -> Medio -> Medio',
    pitLossSeconds: 20.6,
  },
  {
    driverNumber: 55,
    code: 'SAI',
    fullName: 'Carlos Sainz',
    teamName: 'Williams Racing',
    teamColor: '#1868DB',
    hard: { compound: 'C3', newSets: 1, usedSets: 1 },
    medium: { compound: 'C4', newSets: 2, usedSets: 1 },
    soft: { compound: 'C5', newSets: 1, usedSets: 4 },
    recommendedStrategy: '3 Stops: Medium -> Soft -> Soft -> Soft',
    recommendedStrategyEs: '3 Paradas: Medio -> Blando -> Blando -> Blando',
    pitLossSeconds: 20.6,
  },
  {
    driverNumber: 43,
    code: 'COL',
    fullName: 'Franco Colapinto',
    teamName: 'BWT Alpine F1 Team',
    teamColor: '#00A1E8',
    hard: { compound: 'C3', newSets: 2, usedSets: 0 },
    medium: { compound: 'C4', newSets: 2, usedSets: 1 },
    soft: { compound: 'C5', newSets: 1, usedSets: 3 },
    recommendedStrategy: '1 Stop: Medium (L1-31) -> Hard/Soft (to finish)',
    recommendedStrategyEs: '1 Parada: Medio (Vta 1-31) -> Duro/Blando (hasta el final)',
    pitLossSeconds: 20.6,
  },
  {
    driverNumber: 1,
    code: 'NOR',
    fullName: 'Lando Norris',
    teamName: 'McLaren Formula 1 Team',
    teamColor: '#F47600',
    hard: { compound: 'C3', newSets: 1, usedSets: 1 },
    medium: { compound: 'C4', newSets: 2, usedSets: 1 },
    soft: { compound: 'C5', newSets: 1, usedSets: 3 },
    recommendedStrategy: '2 Stops: Medium -> Soft',
    recommendedStrategyEs: '2 Paradas: Medio -> Blando',
    pitLossSeconds: 20.6,
  },
  {
    driverNumber: 81,
    code: 'PIA',
    fullName: 'Oscar Piastri',
    teamName: 'McLaren Formula 1 Team',
    teamColor: '#F47600',
    hard: { compound: 'C3', newSets: 1, usedSets: 1 },
    medium: { compound: 'C4', newSets: 2, usedSets: 1 },
    soft: { compound: 'C5', newSets: 1, usedSets: 3 },
    recommendedStrategy: '2 Stops: Soft -> Medium -> Medium',
    recommendedStrategyEs: '2 Paradas: Blando -> Medio -> Medio',
    pitLossSeconds: 20.6,
  }
];
