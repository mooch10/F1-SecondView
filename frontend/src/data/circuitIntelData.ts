// Circuit Intelligence & Technical Track Profiles (Official 2026 F1 Regulations)

export interface PirelliRating {
  tyreStress: number; // 1 to 5
  asphaltGrip: number; // 1 to 5
  asphaltAbrasion: number; // 1 to 5
  downforce: number; // 1 to 5
  braking: number; // 1 to 5
}

export interface CircuitIntel {
  id: string;
  name: string;
  officialGpName: string;
  country: string;
  city: string;
  flag: string;
  trackLengthKm: number;
  totalLaps: number;
  raceDistanceKm: number;
  corners: {
    total: number;
    left: number;
    right: number;
  };
  lapRecord: {
    time: string;
    driver: string;
    team: string;
    year: number;
  };
  activeAeroZones: number;
  downforceLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'MAXIMUM';
  downforceLevelEs: 'Baja' | 'Media' | 'Alta' | 'Máxima';
  pirelliRatings: PirelliRating;
  characteristics: {
    es: string;
    en: string;
  };
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
  outline: Array<[number, number]>;
}

export const CIRCUIT_INTEL_CATALOG: Record<string, CircuitIntel> = {
  madrid: {
    id: 'madrid',
    name: 'Circuito de Madrid (IFEMA - Valdebebas)',
    officialGpName: 'Gran Premio de España 2026',
    country: 'España',
    city: 'Madrid',
    flag: '🇪🇸',
    trackLengthKm: 5.474,
    totalLaps: 57,
    raceDistanceKm: 312.018,
    corners: { total: 20, left: 12, right: 8 },
    lapRecord: {
      time: '1:31.824',
      driver: 'Lando Norris',
      team: 'McLaren',
      year: 2026,
    },
    activeAeroZones: 3,
    downforceLevel: 'HIGH',
    downforceLevelEs: 'Alta',
    pirelliRatings: { tyreStress: 4, asphaltGrip: 4, asphaltAbrasion: 3, downforce: 4, braking: 4 },
    characteristics: {
      es: 'Trazado semiurbano híbrido de alta velocidad con un espectacular peralte en Valdebebas y túneles que cruzan la M-11.',
      en: 'Hybrid semi-street high-speed circuit featuring a dramatic banked corner at Valdebebas and M-11 underpasses.',
    },
    bounds: { minX: -381, maxX: 374, minY: -612, maxY: 621 },
    outline: [
      [-130.0, 510.0], [-99.2, 514.2], [-60.0, 520.0], [-7.0, 525.6], [16.4, 562.2],
      [43.2, 600.6], [77.6, 598.6], [112.0, 586.0], [132.6, 562.0], [158.6, 518.4],
      [180.0, 480.0], [204.4, 436.8], [230.0, 390.0], [255.8, 339.2], [280.0, 290.0],
      [301.8, 249.8], [318.0, 212.0], [323.8, 169.8], [322.0, 130.0], [305.6, 81.2],
      [287.0, 30.4], [304.4, -15.0], [328.2, -90.8], [351.0, -157.8], [346.0, -196.0],
      [324.2, -209.4], [327.6, -240.8], [351.4, -260.4], [334.0, -280.0], [316.4, -298.8],
      [338.4, -332.2], [354.0, -370.0], [332.6, -401.8], [308.2, -459.4], [303.8, -537.8],
      [297.8, -586.4], [260.4, -591.8], [218.6, -577.6], [193.8, -533.2], [180.2, -482.4],
      [193.6, -433.2], [223.0, -375.2], [245.0, -314.2], [270.6, -262.6], [266.0, -226.8],
      [232.4, -207.6], [207.2, -156.2], [206.6, -89.4], [171.8, -54.2], [130.6, -44.4],
      [81.8, -44.4], [42.2, -63.2], [-8.0, -17.4], [-45.0, 52.4], [-88.6, 65.6],
      [-129.4, 59.8], [-179.6, 87.4], [-203.0, 152.4], [-215.0, 215.2], [-226.0, 279.6],
      [-267.4, 287.4], [-317.0, 271.0], [-335.8, 306.6], [-347.4, 355.8], [-354.8, 407.4],
      [-360.8, 454.6], [-348.4, 483.8], [-296.6, 491.2], [-246.2, 495.6], [-188.8, 502.6],
      [-130.0, 510.0]
    ],
  },
  baku: {
    id: 'baku',
    name: 'Baku City Circuit',
    officialGpName: 'Azerbaijan Grand Prix 2026',
    country: 'Azerbaiyán',
    city: 'Bakú',
    flag: '🇦🇿',
    trackLengthKm: 6.003,
    totalLaps: 51,
    raceDistanceKm: 306.049,
    corners: { total: 20, left: 12, right: 8 },
    lapRecord: {
      time: '1:43.009',
      driver: 'Charles Leclerc',
      team: 'Ferrari',
      year: 2019,
    },
    activeAeroZones: 2,
    downforceLevel: 'LOW',
    downforceLevelEs: 'Baja',
    pirelliRatings: { tyreStress: 3, asphaltGrip: 2, asphaltAbrasion: 2, downforce: 1, braking: 5 },
    characteristics: {
      es: 'La recta más larga de la F1 (2.2 km) combinada con la estrechísima sección del castillo amurallado de solo 7.6 metros.',
      en: 'The longest straight in F1 (2.2 km) coupled with the narrow medieval castle section of just 7.6 meters.',
    },
    bounds: { minX: -470, maxX: 470, minY: -210, maxY: 210 },
    outline: [
      [-450, 180], [-250, 180], [-100, 175], [50, 170], [280, 160], [420, 150],
      [460, 120], [450, -50], [410, -130], [320, -180], [150, -190], [-50, -180],
      [-150, -150], [-220, -90], [-240, -10], [-290, 50], [-350, 90], [-420, 120], [-450, 180]
    ],
  },
  monza: {
    id: 'monza',
    name: 'Autodromo Nazionale Monza',
    officialGpName: 'Gran Premio d\'Italia 2026',
    country: 'Italia',
    city: 'Monza',
    flag: '🇮🇹',
    trackLengthKm: 5.793,
    totalLaps: 53,
    raceDistanceKm: 306.720,
    corners: { total: 11, left: 4, right: 7 },
    lapRecord: {
      time: '1:21.046',
      driver: 'Rubens Barrichello',
      team: 'Ferrari',
      year: 2004,
    },
    activeAeroZones: 2,
    downforceLevel: 'LOW',
    downforceLevelEs: 'Baja',
    pirelliRatings: { tyreStress: 4, asphaltGrip: 2, asphaltAbrasion: 3, downforce: 1, braking: 5 },
    characteristics: {
      es: 'El Templo de la Velocidad: casi el 80% de la vuelta con el acelerador a fondo, chicanas míticas y la Curva Parabólica.',
      en: 'The Temple of Speed: nearly 80% full throttle, legendary chicanes, and the iconic Curva Parabolica.',
    },
    bounds: { minX: -470, maxX: 470, minY: -200, maxY: 200 },
    outline: [
      [-400, 160], [-200, 165], [100, 170], [350, 160], [440, 130], [460, 40],
      [420, -60], [310, -130], [120, -160], [-60, -150], [-180, -110], [-290, -40],
      [-370, 40], [-400, 160]
    ],
  },
  spa: {
    id: 'spa',
    name: 'Circuit de Spa-Francorchamps',
    officialGpName: 'Belgian Grand Prix 2026',
    country: 'Bélgica',
    city: 'Stavelot',
    flag: '🇧🇪',
    trackLengthKm: 7.004,
    totalLaps: 44,
    raceDistanceKm: 308.052,
    corners: { total: 19, left: 10, right: 9 },
    lapRecord: {
      time: '1:46.286',
      driver: 'Valtteri Bottas',
      team: 'Mercedes',
      year: 2018,
    },
    activeAeroZones: 2,
    downforceLevel: 'MEDIUM',
    downforceLevelEs: 'Media',
    pirelliRatings: { tyreStress: 5, asphaltGrip: 3, asphaltAbrasion: 4, downforce: 3, braking: 3 },
    characteristics: {
      es: 'El trazado más largo y emblemático del año, célebre por la brutal subida de Eau Rouge / Raidillon y su clima impredecible.',
      en: 'The longest and most iconic circuit, world-renowned for the Eau Rouge / Raidillon roller-coaster and microclimates.',
    },
    bounds: { minX: -450, maxX: 450, minY: -320, maxY: 320 },
    outline: [
      [-380, 220], [-220, 240], [-50, 260], [150, 230], [320, 160], [420, 60],
      [380, -100], [280, -220], [100, -280], [-80, -260], [-230, -190], [-350, -80],
      [-410, 40], [-380, 220]
    ],
  },
  silverstone: {
    id: 'silverstone',
    name: 'Silverstone Circuit',
    officialGpName: 'British Grand Prix 2026',
    country: 'Gran Bretaña',
    city: 'Silverstone',
    flag: '🇬🇧',
    trackLengthKm: 5.891,
    totalLaps: 52,
    raceDistanceKm: 306.198,
    corners: { total: 18, left: 8, right: 10 },
    lapRecord: {
      time: '1:27.097',
      driver: 'Max Verstappen',
      team: 'Red Bull',
      year: 2020,
    },
    activeAeroZones: 2,
    downforceLevel: 'HIGH',
    downforceLevelEs: 'Alta',
    pirelliRatings: { tyreStress: 5, asphaltGrip: 3, asphaltAbrasion: 4, downforce: 4, braking: 3 },
    characteristics: {
      es: 'Cuna histórica de la F1 con las curvas de alta carga aerodinámica más espectaculares: Maggotts, Becketts y Chapel.',
      en: 'The historic home of F1 with world-class high-speed G-force corners: Maggotts, Becketts, and Chapel.',
    },
    bounds: { minX: -420, maxX: 420, minY: -300, maxY: 300 },
    outline: [
      [-320, 220], [-150, 250], [80, 240], [260, 180], [380, 80], [390, -70],
      [290, -190], [120, -250], [-70, -240], [-220, -170], [-330, -60], [-320, 220]
    ],
  },
  monaco: {
    id: 'monaco',
    name: 'Circuit de Monaco',
    officialGpName: 'Grand Prix de Monaco 2026',
    country: 'Mónaco',
    city: 'Monte Carlo',
    flag: '🇲🇨',
    trackLengthKm: 3.337,
    totalLaps: 78,
    raceDistanceKm: 260.286,
    corners: { total: 19, left: 8, right: 11 },
    lapRecord: {
      time: '1:12.909',
      driver: 'Lewis Hamilton',
      team: 'Mercedes',
      year: 2021,
    },
    activeAeroZones: 1,
    downforceLevel: 'MAXIMUM',
    downforceLevelEs: 'Máxima',
    pirelliRatings: { tyreStress: 1, asphaltGrip: 1, asphaltAbrasion: 1, downforce: 5, braking: 2 },
    characteristics: {
      es: 'La joya de la corona: muros implacables, la horquilla más lenta del mundial y el túnel al borde de los yates.',
      en: 'The crown jewel: unforgiving barriers, the slowest hairpin in Formula 1, and the harbor tunnel section.',
    },
    bounds: { minX: -360, maxX: 360, minY: -470, maxY: 470 },
    outline: [
      [104.1, -274.2], [210.9, -439.8], [248.9, -406.8], [294.2, -368.5], [264.3, -427.1],
      [339.8, -433.6], [307.3, -240.6], [164.5, -105.8], [27.9, -57.9], [-26.5, -34.9],
      [-156, -20.5], [-268.3, 1.5], [-295.8, 85], [-263.9, 175.5], [-246.8, 274.4],
      [-265.1, 303.6], [-227.9, 380.4], [-170.6, 429.9], [-232.1, 450], [-254.5, 417.2],
      [-326.5, 243.5], [-339.8, 103.1], [-326.1, 22.1], [-314.1, -23.9], [-214.5, -38.3],
      [-89.2, -70.3], [17.6, -109.4], [112.1, -128.9], [155.1, -180.6], [140, -236],
      [104.1, -274.2]
    ],
  },
  albert_park: {
    id: 'albert_park',
    name: 'Albert Park Grand Prix Circuit',
    officialGpName: 'Australian Grand Prix 2026',
    country: 'Australia',
    city: 'Melbourne',
    flag: '🇦🇺',
    trackLengthKm: 5.278,
    totalLaps: 58,
    raceDistanceKm: 306.124,
    corners: { total: 14, left: 5, right: 9 },
    lapRecord: {
      time: '1:19.813',
      driver: 'Charles Leclerc',
      team: 'Ferrari',
      year: 2024,
    },
    activeAeroZones: 3,
    downforceLevel: 'MEDIUM',
    downforceLevelEs: 'Media',
    pirelliRatings: { tyreStress: 3, asphaltGrip: 3, asphaltAbrasion: 2, downforce: 3, braking: 4 },
    characteristics: {
      es: 'Trazado veloz bordeando el lago de Albert Park con chicanas rápidas y asfalto que engoma vuelta a vuelta.',
      en: 'Fast, flowing parkland circuit encircling Albert Park Lake with rapid chicane transitions.',
    },
    bounds: { minX: -388, maxX: 388, minY: -470, maxY: 470 },
    outline: [
      [-76.8, 214.3], [-193.3, 97], [-225, -14.4], [-305.1, -102.8], [-367.2, -208],
      [-341, -222.9], [-297.9, -317.6], [-233.2, -394.5], [-131.4, -440.6], [-50.6, -420.4],
      [16, -397.2], [50.4, -336], [63, -240.4], [28.9, -179.4], [10.9, -66.8],
      [28.4, 9.4], [113.1, 105.1], [163.3, 120.3], [220.9, 136.3], [308, 215.6],
      [363.5, 383.1], [308.5, 429.5], [237.1, 446.4], [171.3, 345.7], [117.1, 389.9],
      [-76.8, 214.3]
    ],
  },
  interlagos: {
    id: 'interlagos',
    name: 'Autódromo José Carlos Pace (Interlagos)',
    officialGpName: 'Grande Prêmio de São Paulo 2026',
    country: 'Brasil',
    city: 'São Paulo',
    flag: '🇧🇷',
    trackLengthKm: 4.309,
    totalLaps: 71,
    raceDistanceKm: 305.879,
    corners: { total: 15, left: 10, right: 5 },
    lapRecord: {
      time: '1:10.540',
      driver: 'Valtteri Bottas',
      team: 'Mercedes',
      year: 2018,
    },
    activeAeroZones: 2,
    downforceLevel: 'HIGH',
    downforceLevelEs: 'Alta',
    pirelliRatings: { tyreStress: 4, asphaltGrip: 3, asphaltAbrasion: 4, downforce: 4, braking: 3 },
    characteristics: {
      es: 'Trazado antihorario con el famoso "Senna S", fuertes desniveles naturales y clima típicamente cambiante.',
      en: 'Counter-clockwise circuit featuring the famous "Senna S", natural undulation, and sudden rain showers.',
    },
    bounds: { minX: -380, maxX: 380, minY: -320, maxY: 320 },
    outline: [
      [-300, 200], [-120, 240], [100, 220], [280, 160], [360, 60], [320, -80],
      [220, -180], [80, -250], [-90, -220], [-220, -150], [-310, -40], [-300, 200]
    ],
  },
  suzuka: {
    id: 'suzuka',
    name: 'Suzuka International Racing Course',
    officialGpName: 'Japanese Grand Prix 2026',
    country: 'Japón',
    city: 'Suzuka',
    flag: '🇯🇵',
    trackLengthKm: 5.807,
    totalLaps: 53,
    raceDistanceKm: 307.471,
    corners: { total: 18, left: 8, right: 10 },
    lapRecord: {
      time: '1:30.983',
      driver: 'Lewis Hamilton',
      team: 'Mercedes',
      year: 2019,
    },
    activeAeroZones: 2,
    downforceLevel: 'HIGH',
    downforceLevelEs: 'Alta',
    pirelliRatings: { tyreStress: 5, asphaltGrip: 4, asphaltAbrasion: 4, downforce: 4, braking: 3 },
    characteristics: {
      es: 'Único circuito en forma de 8 del mundial, con las legendarias Eses del Sector 1, la curva 130R y el paso elevado.',
      en: 'The world\'s only figure-eight circuit, famed for Sector 1 Esses, 130R, and the crossover flyover.',
    },
    bounds: { minX: -470, maxX: 470, minY: -261, maxY: 261 },
    outline: [
      [318.6, 16.4], [439, 162.8], [420.2, 240.2], [351.9, 161.4], [284.4, 130.8],
      [241.2, 70], [188.5, -45.2], [127.2, -71.5], [67.2, -55.3], [2.1, 17.1],
      [-68.5, 27.2], [-101.1, -96.1], [-94.6, -181.1], [-139.7, -117.9], [-181.3, -89.9],
      [-244.8, -90.9], [-312.4, -121.7], [-361.7, -204.7], [-406.9, -240], [-450, -211.9],
      [-428.7, -173.6], [-387.1, -139.6], [-329, -105.4], [-225.3, -64.2], [-113.7, -26.6],
      [-26.7, -20.2], [35.5, -66.4], [94.8, -114.4], [118.3, -102], [149.1, -122.4],
      [183.5, -120.4], [228.6, -92.3], [318.6, 16.4]
    ],
  },
};

export const getCircuitIntel = (circuitIdOrName?: string): CircuitIntel => {
  if (!circuitIdOrName) return CIRCUIT_INTEL_CATALOG['madrid'];
  const clean = circuitIdOrName.toLowerCase().trim();

  for (const [key, data] of Object.entries(CIRCUIT_INTEL_CATALOG)) {
    if (
      clean.includes(key) ||
      key.includes(clean) ||
      clean.includes(data.country.toLowerCase()) ||
      clean.includes(data.city.toLowerCase()) ||
      clean.includes(data.name.toLowerCase()) ||
      data.name.toLowerCase().includes(clean)
    ) {
      return data;
    }
  }

  return CIRCUIT_INTEL_CATALOG['madrid'];
};
