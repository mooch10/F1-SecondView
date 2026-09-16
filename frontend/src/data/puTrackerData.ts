export interface PUComponentLimits {
  ice: number;
  tc: number;
  mguk: number;
  es: number;
  ce: number;
  gbx: number;
}

export const PU_LIMITS_2026: PUComponentLimits = {
  ice: 4,
  tc: 4,
  mguk: 4,
  es: 2,
  ce: 2,
  gbx: 5,
};

export type PUStatus = 'SAFE' | 'AT_RISK' | 'PENALIZED';

export type EngineSupplier =
  | 'Mercedes-AMG High Performance Powertrains'
  | 'Scuderia Ferrari'
  | 'Red Bull Ford Powertrains'
  | 'Honda HRC'
  | 'Alpine Renault';

export interface DriverPUUsage {
  driverNumber: number;
  code: string;
  fullName: string;
  teamName: string;
  teamColor: string;
  engineSupplier: EngineSupplier;
  engineBrand: 'Mercedes' | 'Ferrari' | 'Red Bull-Ford' | 'Honda' | 'Alpine';
  components: {
    ice: number;
    tc: number;
    mguk: number;
    es: number;
    ce: number;
    gbx: number;
  };
  status: PUStatus;
  notes?: string;
  notesEs?: string;
}

export const PU_USAGE_DATA_2026: DriverPUUsage[] = [
  {
    driverNumber: 1,
    code: 'VER',
    fullName: 'Max Verstappen',
    teamName: 'Oracle Red Bull Racing',
    teamColor: '#3671C6',
    engineSupplier: 'Red Bull Ford Powertrains',
    engineBrand: 'Red Bull-Ford',
    components: { ice: 4, tc: 4, mguk: 4, es: 2, ce: 2, gbx: 4 },
    status: 'AT_RISK',
    notes: 'On the limit on all ICE, TC and MGU-K. Next unit penalizes +10 on grid.',
    notesEs: 'Al límite en ICE, TC y MGU-K. Próxima unidad penaliza +10 puestos en grilla.',
  },
  {
    driverNumber: 12,
    code: 'ANT',
    fullName: 'Andrea Kimi Antonelli',
    teamName: 'Mercedes-AMG PETRONAS F1 Team',
    teamColor: '#27F4D2',
    engineSupplier: 'Mercedes-AMG High Performance Powertrains',
    engineBrand: 'Mercedes',
    components: { ice: 3, tc: 3, mguk: 3, es: 2, ce: 2, gbx: 3 },
    status: 'AT_RISK',
    notes: 'Energy Store (ES) and Control Electronics (CE) at 2/2 allocation limit.',
    notesEs: 'Batería (ES) y Electrónica (CE) al límite reglamentario de 2/2.',
  },
  {
    driverNumber: 4,
    code: 'NOR',
    fullName: 'Lando Norris',
    teamName: 'McLaren Formula 1 Team',
    teamColor: '#FF8000',
    engineSupplier: 'Mercedes-AMG High Performance Powertrains',
    engineBrand: 'Mercedes',
    components: { ice: 3, tc: 3, mguk: 3, es: 1, ce: 2, gbx: 3 },
    status: 'SAFE',
    notes: 'Comfortable pool across all major ICE and hybrid elements.',
    notesEs: 'Margen seguro en todos los componentes principales de combustión e híbridos.',
  },
  {
    driverNumber: 44,
    code: 'HAM',
    fullName: 'Lewis Hamilton',
    teamName: 'Scuderia Ferrari HP',
    teamColor: '#E8002D',
    engineSupplier: 'Scuderia Ferrari',
    engineBrand: 'Ferrari',
    components: { ice: 4, tc: 4, mguk: 3, es: 2, ce: 2, gbx: 4 },
    status: 'AT_RISK',
    notes: '4th ICE introduced in Silverstone. Next combustion unit penalizes.',
    notesEs: '4to ICE introducido en Silverstone. Próximo motor de combustión penaliza.',
  },
  {
    driverNumber: 16,
    code: 'LEC',
    fullName: 'Charles Leclerc',
    teamName: 'Scuderia Ferrari HP',
    teamColor: '#E8002D',
    engineSupplier: 'Scuderia Ferrari',
    engineBrand: 'Ferrari',
    components: { ice: 3, tc: 3, mguk: 3, es: 2, ce: 2, gbx: 3 },
    status: 'AT_RISK',
    notes: 'Both electrical units (ES/CE) on maximum allowed limit (2/2).',
    notesEs: 'Ambas unidades eléctricas (ES/CE) en el límite permitido (2/2).',
  },
  {
    driverNumber: 63,
    code: 'RUS',
    fullName: 'George Russell',
    teamName: 'Mercedes-AMG PETRONAS F1 Team',
    teamColor: '#27F4D2',
    engineSupplier: 'Mercedes-AMG High Performance Powertrains',
    engineBrand: 'Mercedes',
    components: { ice: 3, tc: 3, mguk: 3, es: 2, ce: 1, gbx: 3 },
    status: 'SAFE',
    notes: 'Healthy engine cycle for the remaining European and overseas rounds.',
    notesEs: 'Ciclo de motor saludable para las rondas restantes del campeonato.',
  },
  {
    driverNumber: 43,
    code: 'COL',
    fullName: 'Franco Colapinto',
    teamName: 'BWT Alpine F1 Team',
    teamColor: '#00A1E8',
    engineSupplier: 'Alpine Renault',
    engineBrand: 'Alpine',
    components: { ice: 3, tc: 3, mguk: 3, es: 1, ce: 1, gbx: 3 },
    status: 'SAFE',
    notes: 'Impeccable power unit preservation. Only 1 ES and 1 CE utilized to date.',
    notesEs: 'Impecable preservación de unidad de potencia. Solo 1 ES y 1 CE utilizados a la fecha.',
  },
  {
    driverNumber: 81,
    code: 'PIA',
    fullName: 'Oscar Piastri',
    teamName: 'McLaren Formula 1 Team',
    teamColor: '#FF8000',
    engineSupplier: 'Mercedes-AMG High Performance Powertrains',
    engineBrand: 'Mercedes',
    components: { ice: 3, tc: 3, mguk: 3, es: 2, ce: 2, gbx: 3 },
    status: 'AT_RISK',
    notes: '2/2 on Energy Store and Control Electronics. ICE in optimal operating window.',
    notesEs: '2/2 en Batería y Electrónica. ICE en ventana de operación óptima.',
  },
  {
    driverNumber: 10,
    code: 'GAS',
    fullName: 'Pierre Gasly',
    teamName: 'BWT Alpine F1 Team',
    teamColor: '#00A1E8',
    engineSupplier: 'Alpine Renault',
    engineBrand: 'Alpine',
    components: { ice: 4, tc: 3, mguk: 4, es: 2, ce: 2, gbx: 4 },
    status: 'AT_RISK',
    notes: '4th ICE fitted after power drop in Monaco. Next ICE triggers +10 grid drop.',
    notesEs: '4to ICE montado tras caída de potencia en Mónaco. Próximo ICE penaliza +10 puestos.',
  },
  {
    driverNumber: 55,
    code: 'SAI',
    fullName: 'Carlos Sainz',
    teamName: 'Williams Racing',
    teamColor: '#00A0DE',
    engineSupplier: 'Mercedes-AMG High Performance Powertrains',
    engineBrand: 'Mercedes',
    components: { ice: 3, tc: 3, mguk: 3, es: 2, ce: 2, gbx: 3 },
    status: 'AT_RISK',
    notes: 'Battery and electronics at 2/2. Engine cycle scheduled for Baku update.',
    notesEs: 'Batería y electrónica en 2/2. Ciclo de motor programado para actualización en Bakú.',
  },
  {
    driverNumber: 23,
    code: 'ALB',
    fullName: 'Alexander Albon',
    teamName: 'Williams Racing',
    teamColor: '#00A0DE',
    engineSupplier: 'Mercedes-AMG High Performance Powertrains',
    engineBrand: 'Mercedes',
    components: { ice: 3, tc: 3, mguk: 3, es: 1, ce: 2, gbx: 3 },
    status: 'SAFE',
    notes: 'Clean allocation state with 1 fresh ES available.',
    notesEs: 'Estado de asignación limpio con 1 batería nueva disponible.',
  },
  {
    driverNumber: 14,
    code: 'ALO',
    fullName: 'Fernando Alonso',
    teamName: 'Aston Martin Aramco F1 Team',
    teamColor: '#229971',
    engineSupplier: 'Honda HRC',
    engineBrand: 'Honda',
    components: { ice: 4, tc: 4, mguk: 4, es: 2, ce: 2, gbx: 4 },
    status: 'AT_RISK',
    notes: 'At absolute ceiling across all Honda PU elements. High risk of penalty in Baku/Singapore.',
    notesEs: 'Al techo absoluto en todos los elementos Honda. Alto riesgo de penalización en Bakú/Singapur.',
  },
  {
    driverNumber: 18,
    code: 'STR',
    fullName: 'Lance Stroll',
    teamName: 'Aston Martin Aramco F1 Team',
    teamColor: '#229971',
    engineSupplier: 'Honda HRC',
    engineBrand: 'Honda',
    components: { ice: 3, tc: 3, mguk: 3, es: 2, ce: 2, gbx: 3 },
    status: 'AT_RISK',
    notes: 'ES and CE exhausted at 2/2. ICE within standard limits.',
    notesEs: 'ES y CE agotados en 2/2. ICE dentro de los límites habituales.',
  },
  {
    driverNumber: 30,
    code: 'LAW',
    fullName: 'Liam Lawson',
    teamName: 'Visa Cash App Racing Bulls F1 Team',
    teamColor: '#6692FF',
    engineSupplier: 'Red Bull Ford Powertrains',
    engineBrand: 'Red Bull-Ford',
    components: { ice: 3, tc: 3, mguk: 3, es: 2, ce: 2, gbx: 3 },
    status: 'AT_RISK',
    notes: '2/2 on electronics and battery. Power unit operating smoothly.',
    notesEs: '2/2 en electrónica y batería. Unidad de potencia rindiendo con suavidad.',
  },
  {
    driverNumber: 22,
    code: 'TSU',
    fullName: 'Yuki Tsunoda',
    teamName: 'Visa Cash App Racing Bulls F1 Team',
    teamColor: '#6692FF',
    engineSupplier: 'Red Bull Ford Powertrains',
    engineBrand: 'Red Bull-Ford',
    components: { ice: 4, tc: 4, mguk: 3, es: 2, ce: 2, gbx: 4 },
    status: 'AT_RISK',
    notes: '4th ICE and 4th TC in use. Next replacement will penalize on grid.',
    notesEs: '4to ICE y 4to TC en uso. Próximo reemplazo penalizará en parrilla.',
  },
  {
    driverNumber: 27,
    code: 'HUL',
    fullName: 'Stake F1 Team Kick Sauber',
    teamName: 'Stake F1 Team Kick Sauber',
    teamColor: '#52E252',
    engineSupplier: 'Scuderia Ferrari',
    engineBrand: 'Ferrari',
    components: { ice: 4, tc: 4, mguk: 4, es: 2, ce: 2, gbx: 4 },
    status: 'AT_RISK',
    notes: 'Ferrari customer allocation maxed out on all key powertrain elements.',
    notesEs: 'Asignación Ferrari cliente al tope en los elementos clave del tren motriz.',
  },
  {
    driverNumber: 5,
    code: 'BOR',
    fullName: 'Gabriel Bortoleto',
    teamName: 'Stake F1 Team Kick Sauber',
    teamColor: '#52E252',
    engineSupplier: 'Scuderia Ferrari',
    engineBrand: 'Ferrari',
    components: { ice: 3, tc: 3, mguk: 3, es: 1, ce: 2, gbx: 3 },
    status: 'SAFE',
    notes: 'Excellent rookie component preservation with battery headroom remaining.',
    notesEs: 'Excelente preservación de componentes con margen de batería disponible.',
  },
  {
    driverNumber: 31,
    code: 'OCO',
    fullName: 'Esteban Ocon',
    teamName: 'MoneyGram Haas F1 Team',
    teamColor: '#B6BABD',
    engineSupplier: 'Scuderia Ferrari',
    engineBrand: 'Ferrari',
    components: { ice: 3, tc: 3, mguk: 3, es: 2, ce: 2, gbx: 3 },
    status: 'AT_RISK',
    notes: 'Reached 2/2 ES and CE ceiling in Spa. Next electrical component penalizes.',
    notesEs: 'Alcanzó el tope de 2/2 en ES y CE en Spa. Próximo componente eléctrico penaliza.',
  },
  {
    driverNumber: 87,
    code: 'BEA',
    fullName: 'Oliver Bearman',
    teamName: 'MoneyGram Haas F1 Team',
    teamColor: '#B6BABD',
    engineSupplier: 'Scuderia Ferrari',
    engineBrand: 'Ferrari',
    components: { ice: 3, tc: 3, mguk: 3, es: 2, ce: 1, gbx: 3 },
    status: 'SAFE',
    notes: 'Within safe allocation margins for the upcoming flyaway rounds.',
    notesEs: 'Dentro de márgenes seguros de asignación para las próximas rondas lejanas.',
  },
  {
    driverNumber: 6,
    code: 'HAD',
    fullName: 'Isack Hadjar',
    teamName: 'Oracle Red Bull Racing',
    teamColor: '#3671C6',
    engineSupplier: 'Red Bull Ford Powertrains',
    engineBrand: 'Red Bull-Ford',
    components: { ice: 3, tc: 3, mguk: 3, es: 2, ce: 2, gbx: 3 },
    status: 'AT_RISK',
    notes: 'Red Bull rookie with 2/2 Energy Store and Control Electronics.',
    notesEs: 'Debutante de Red Bull con 2/2 en Batería y Electrónica de Control.',
  },
];

export const getDriverPUStatus = (driverNumberOrCode: number | string): DriverPUUsage | undefined => {
  if (typeof driverNumberOrCode === 'number') {
    return PU_USAGE_DATA_2026.find((d) => d.driverNumber === driverNumberOrCode);
  }
  const codeUpper = String(driverNumberOrCode).toUpperCase();
  return PU_USAGE_DATA_2026.find(
    (d) => d.code === codeUpper || String(d.driverNumber) === driverNumberOrCode
  );
};

export const getPUStatsSummary = () => {
  let safeCount = 0;
  let atRiskCount = 0;
  let penalizedCount = 0;

  for (const d of PU_USAGE_DATA_2026) {
    if (d.status === 'SAFE') safeCount++;
    else if (d.status === 'AT_RISK') atRiskCount++;
    else if (d.status === 'PENALIZED') penalizedCount++;
  }

  return {
    totalDrivers: PU_USAGE_DATA_2026.length,
    safeCount,
    atRiskCount,
    penalizedCount,
    limits: PU_LIMITS_2026,
  };
};
