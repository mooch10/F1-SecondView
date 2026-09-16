export interface DriverTyreSets {
  driverNumber: number;
  code: string;
  fullName: string;
  teamName: string;
  teamColor: string;
  hard: {
    compound: string; // 'C2'
    newSets: number;
    usedSets: number;
  };
  medium: {
    compound: string; // 'C3'
    newSets: number;
    usedSets: number;
  };
  soft: {
    compound: string; // 'C4'
    newSets: number;
    usedSets: number;
  };
  recommendedStrategy: string;
  recommendedStrategyEs: string;
  pitLossSeconds: number;
}

export const TYRE_ALLOCATION_DATA_2026: DriverTyreSets[] = [
  {
    driverNumber: 12,
    code: 'ANT',
    fullName: 'Andrea Kimi Antonelli',
    teamName: 'Mercedes-AMG PETRONAS F1 Team',
    teamColor: '#27F4D2',
    hard: { compound: 'C2', newSets: 2, usedSets: 0 },
    medium: { compound: 'C3', newSets: 1, usedSets: 1 },
    soft: { compound: 'C4', newSets: 0, usedSets: 3 },
    recommendedStrategy: '1 Stop: Medium (L17-21) -> Hard (to finish)',
    recommendedStrategyEs: '1 Parada: Medio (Vta 17-21) -> Duro (hasta el final)',
    pitLossSeconds: 21.8,
  },
  {
    driverNumber: 1,
    code: 'VER',
    fullName: 'Max Verstappen',
    teamName: 'Oracle Red Bull Racing',
    teamColor: '#3671C6',
    hard: { compound: 'C2', newSets: 1, usedSets: 1 },
    medium: { compound: 'C3', newSets: 2, usedSets: 0 },
    soft: { compound: 'C4', newSets: 1, usedSets: 2 },
    recommendedStrategy: '2 Stops: Medium -> Hard -> Soft (Aggressive sprint)',
    recommendedStrategyEs: '2 Paradas: Medio -> Duro -> Blando (Sprint agresivo)',
    pitLossSeconds: 21.8,
  },
  {
    driverNumber: 4,
    code: 'NOR',
    fullName: 'Lando Norris',
    teamName: 'McLaren Formula 1 Team',
    teamColor: '#FF8000',
    hard: { compound: 'C2', newSets: 1, usedSets: 1 },
    medium: { compound: 'C3', newSets: 1, usedSets: 1 },
    soft: { compound: 'C4', newSets: 1, usedSets: 3 },
    recommendedStrategy: '2 Stops: Soft -> Medium -> Hard',
    recommendedStrategyEs: '2 Paradas: Blando -> Medio -> Duro',
    pitLossSeconds: 21.8,
  },
  {
    driverNumber: 44,
    code: 'HAM',
    fullName: 'Lewis Hamilton',
    teamName: 'Scuderia Ferrari HP',
    teamColor: '#E8002D',
    hard: { compound: 'C2', newSets: 2, usedSets: 0 },
    medium: { compound: 'C3', newSets: 1, usedSets: 1 },
    soft: { compound: 'C4', newSets: 0, usedSets: 3 },
    recommendedStrategy: '1 Stop: Medium -> Hard (Tyre conservation)',
    recommendedStrategyEs: '1 Parada: Medio -> Duro (Conservación de gomas)',
    pitLossSeconds: 21.8,
  },
  {
    driverNumber: 16,
    code: 'LEC',
    fullName: 'Charles Leclerc',
    teamName: 'Scuderia Ferrari HP',
    teamColor: '#E8002D',
    hard: { compound: 'C2', newSets: 1, usedSets: 1 },
    medium: { compound: 'C3', newSets: 2, usedSets: 0 },
    soft: { compound: 'C4', newSets: 0, usedSets: 4 },
    recommendedStrategy: '2 Stops: Medium -> Hard -> Medium',
    recommendedStrategyEs: '2 Paradas: Medio -> Duro -> Medio',
    pitLossSeconds: 21.8,
  },
  {
    driverNumber: 63,
    code: 'RUS',
    fullName: 'George Russell',
    teamName: 'Mercedes-AMG PETRONAS F1 Team',
    teamColor: '#27F4D2',
    hard: { compound: 'C2', newSets: 2, usedSets: 0 },
    medium: { compound: 'C3', newSets: 1, usedSets: 1 },
    soft: { compound: 'C4', newSets: 1, usedSets: 2 },
    recommendedStrategy: '1 Stop: Medium -> Hard + Fast Lap Soft scrub',
    recommendedStrategyEs: '1 Parada: Medio -> Duro + Blando para Vuelta Rápida',
    pitLossSeconds: 21.8,
  },
  {
    driverNumber: 43,
    code: 'COL',
    fullName: 'Franco Colapinto',
    teamName: 'BWT Alpine F1 Team',
    teamColor: '#00A1E8',
    hard: { compound: 'C2', newSets: 2, usedSets: 0 },
    medium: { compound: 'C3', newSets: 1, usedSets: 1 },
    soft: { compound: 'C4', newSets: 1, usedSets: 2 },
    recommendedStrategy: '1 Stop: Medium (L20-23) -> Hard (L34-37 stint to P7)',
    recommendedStrategyEs: '1 Parada: Medio (Vta 20-23) -> Duro (35v de gestión magistral a P7)',
    pitLossSeconds: 21.8,
  },
  {
    driverNumber: 81,
    code: 'PIA',
    fullName: 'Oscar Piastri',
    teamName: 'McLaren Formula 1 Team',
    teamColor: '#FF8000',
    hard: { compound: 'C2', newSets: 1, usedSets: 1 },
    medium: { compound: 'C3', newSets: 1, usedSets: 1 },
    soft: { compound: 'C4', newSets: 1, usedSets: 3 },
    recommendedStrategy: '2 Stops: Medium -> Hard -> Soft attack',
    recommendedStrategyEs: '2 Paradas: Medio -> Duro -> Ataque final con Blando',
    pitLossSeconds: 21.8,
  },
  {
    driverNumber: 10,
    code: 'GAS',
    fullName: 'Pierre Gasly',
    teamName: 'BWT Alpine F1 Team',
    teamColor: '#00A1E8',
    hard: { compound: 'C2', newSets: 2, usedSets: 0 },
    medium: { compound: 'C3', newSets: 1, usedSets: 1 },
    soft: { compound: 'C4', newSets: 0, usedSets: 3 },
    recommendedStrategy: '1 Stop: Medium (L18) -> Hard (L39v endurance)',
    recommendedStrategyEs: '1 Parada: Medio (Vta 18) -> Duro (39v de resistencia)',
    pitLossSeconds: 21.8,
  },
  {
    driverNumber: 55,
    code: 'SAI',
    fullName: 'Carlos Sainz',
    teamName: 'Williams Racing',
    teamColor: '#00A0DE',
    hard: { compound: 'C2', newSets: 1, usedSets: 1 },
    medium: { compound: 'C3', newSets: 2, usedSets: 0 },
    soft: { compound: 'C4', newSets: 1, usedSets: 2 },
    recommendedStrategy: '1 Stop: Hard (Long Start L28) -> Medium',
    recommendedStrategyEs: '1 Parada: Duro (Largada larga Vta 28) -> Medio',
    pitLossSeconds: 21.8,
  },
  {
    driverNumber: 23,
    code: 'ALB',
    fullName: 'Alexander Albon',
    teamName: 'Williams Racing',
    teamColor: '#00A0DE',
    hard: { compound: 'C2', newSets: 2, usedSets: 0 },
    medium: { compound: 'C3', newSets: 1, usedSets: 1 },
    soft: { compound: 'C4', newSets: 0, usedSets: 3 },
    recommendedStrategy: '1 Stop: Medium -> Hard',
    recommendedStrategyEs: '1 Parada: Medio -> Duro',
    pitLossSeconds: 21.8,
  },
  {
    driverNumber: 14,
    code: 'ALO',
    fullName: 'Fernando Alonso',
    teamName: 'Aston Martin Aramco F1 Team',
    teamColor: '#229971',
    hard: { compound: 'C2', newSets: 1, usedSets: 1 },
    medium: { compound: 'C3', newSets: 1, usedSets: 1 },
    soft: { compound: 'C4', newSets: 1, usedSets: 3 },
    recommendedStrategy: '2 Stops: Soft (Start punch) -> Hard -> Medium',
    recommendedStrategyEs: '2 Paradas: Blando (Salida agresiva) -> Duro -> Medio',
    pitLossSeconds: 21.8,
  },
];

export const getDriverTyreSets = (codeOrNumber: string | number): DriverTyreSets | undefined => {
  const query = String(codeOrNumber).toUpperCase();
  return TYRE_ALLOCATION_DATA_2026.find(
    (d) => d.code === query || String(d.driverNumber) === query
  );
};
