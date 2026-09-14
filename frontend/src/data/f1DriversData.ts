export interface CareerStats {
  grandsPrix: number;
  podiums: number;
  victories: number;
  worldChampionships: number;
  highestFinish: string;
  highestGrid: string;
}

export interface SeasonStats2026 {
  position?: number;
  points?: number;
  wins?: number;
  teamName?: string;
}

export interface F1DriverProfile {
  number: number;
  code: string;
  firstName: string;
  lastName: string;
  fullName: string;
  nationality: string;
  countryCode: string;
  flag: string;
  birthDate: string; // YYYY-MM-DD
  birthPlace: string;
  team: string;
  teamColor: string;
  headshotUrl: string;
  biography: string;
  careerStats: CareerStats;
  season2026?: SeasonStats2026;
}

export const F1_DRIVERS_DATA: Record<number, F1DriverProfile> = {
  43: {
    number: 43,
    code: 'COL',
    firstName: 'Franco',
    lastName: 'Colapinto',
    fullName: 'Franco Colapinto',
    nationality: 'Argentina',
    countryCode: 'AR',
    flag: '🇦🇷',
    birthDate: '2003-05-27',
    birthPlace: 'Pilar, Buenos Aires, Argentina',
    team: 'Alpine F1 Team',
    teamColor: '#00A1E8',
    headshotUrl:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/F/FRACOL01_Franco_Colapinto/fracol01.png.transform/1col/image.png',
    biography:
      'Joven prodigio argentino que revolucionó la Fórmula 1 y se consagró como piloto titular oficial de Alpine F1 Team en 2026. Protagonista de memorables batallas rueda a rueda, consolidando a la Argentina en la élite del automovilismo mundial con ritmo implacable.',
    careerStats: {
      grandsPrix: 23,
      podiums: 0,
      victories: 0,
      worldChampionships: 0,
      highestFinish: 'P6 (Canadá 2026)',
      highestGrid: 'P7 (Canadá 2026)',
    },
  },
  1: {
    number: 1,
    code: 'VER',
    firstName: 'Max',
    lastName: 'Verstappen',
    fullName: 'Max Verstappen',
    nationality: 'Países Bajos',
    countryCode: 'NL',
    flag: '🇳🇱',
    birthDate: '1997-09-30',
    birthPlace: 'Hasselt, Bélgica',
    team: 'Red Bull Racing',
    teamColor: '#3671C6',
    headshotUrl:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/1col/image.png',
    biography:
      'Tetracampeón del mundo con Red Bull Racing. Poseedor de los récords de victorias consecutivas (10) y puntos en una sola temporada. Famoso por su agresividad implacable en los adelantamientos, consistencia de máquina y ritmo demoledor bajo cualquier condición meteorológica.',
    careerStats: {
      grandsPrix: 223,
      podiums: 112,
      victories: 63,
      worldChampionships: 4,
      highestFinish: 'P1 (x63)',
      highestGrid: 'P1 (x40)',
    },
  },
  4: {
    number: 4,
    code: 'NOR',
    firstName: 'Lando',
    lastName: 'Norris',
    fullName: 'Lando Norris',
    nationality: 'Reino Unido',
    countryCode: 'GB',
    flag: '🇬🇧',
    birthDate: '1999-11-13',
    birthPlace: 'Bristol, Reino Unido',
    team: 'McLaren',
    teamColor: '#FF8000',
    headshotUrl:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png.transform/1col/image.png',
    biography:
      'Líder natural de McLaren y subcampeón del mundo. Con múltiples triunfos en Miami, Zandvoort, Singapur y victorias estelares en 2026, se consagró como uno de los pilotos más rápidos y consistentes de la grilla de Fórmula 1.',
    careerStats: {
      grandsPrix: 142,
      podiums: 30,
      victories: 5,
      worldChampionships: 0,
      highestFinish: 'P1 (x5)',
      highestGrid: 'P1 (x10)',
    },
  },
  16: {
    number: 16,
    code: 'LEC',
    firstName: 'Charles',
    lastName: 'Leclerc',
    fullName: 'Charles Leclerc',
    nationality: 'Mónaco',
    countryCode: 'MC',
    flag: '🇲🇨',
    birthDate: '1997-10-16',
    birthPlace: 'Montecarlo, Mónaco',
    team: 'Scuderia Ferrari',
    teamColor: '#E8002D',
    headshotUrl:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png.transform/1col/image.png',
    biography:
      'El "Predestinado" de Ferrari. Maestro indiscutido de las sesiones de clasificación con más de 25 poles. Cumplió el sueño de su vida ganando en Mónaco y Monza, y encabeza a la Scuderia Ferrari en 2026 en una dupla histórica junto a Lewis Hamilton.',
    careerStats: {
      grandsPrix: 160,
      podiums: 46,
      victories: 9,
      worldChampionships: 0,
      highestFinish: 'P1 (x9)',
      highestGrid: 'P1 (x27)',
    },
  },
  81: {
    number: 81,
    code: 'PIA',
    firstName: 'Oscar',
    lastName: 'Piastri',
    fullName: 'Oscar Piastri',
    nationality: 'Australia',
    countryCode: 'AU',
    flag: '🇦🇺',
    birthDate: '2001-04-06',
    birthPlace: 'Melbourne, Australia',
    team: 'McLaren',
    teamColor: '#FF8000',
    headshotUrl:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png.transform/1col/image.png',
    biography:
      'Una de las irrupciones más impactantes de las últimas décadas. Tras ganar Fórmula Renault, F3 y F2 en años consecutivos como debutante, consolidó su posición en la cima de McLaren con múltiples victorias y podios en la Fórmula 1 moderna.',
    careerStats: {
      grandsPrix: 60,
      podiums: 13,
      victories: 2,
      worldChampionships: 0,
      highestFinish: 'P1 (x2)',
      highestGrid: 'P2 (x6)',
    },
  },
  55: {
    number: 55,
    code: 'SAI',
    firstName: 'Carlos',
    lastName: 'Sainz',
    fullName: 'Carlos Sainz',
    nationality: 'España',
    countryCode: 'ES',
    flag: '🇪🇸',
    birthDate: '1994-09-01',
    birthPlace: 'Madrid, España',
    team: 'Williams Racing',
    teamColor: '#64C4FF',
    headshotUrl:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png.transform/1col/image.png',
    biography:
      'Apodado "Smooth Operator". Conocido por su inteligencia estratégica desde el habitáculo y precisión quirúrgica. Ganador de Grandes Premios con Ferrari, lidera en 2026 el nuevo y ambicioso proyecto de Williams Racing junto a Alex Albon.',
    careerStats: {
      grandsPrix: 220,
      podiums: 25,
      victories: 4,
      worldChampionships: 0,
      highestFinish: 'P1 (x4)',
      highestGrid: 'P1 (x6)',
    },
  },
  44: {
    number: 44,
    code: 'HAM',
    firstName: 'Lewis',
    lastName: 'Hamilton',
    fullName: 'Lewis Hamilton',
    nationality: 'Reino Unido',
    countryCode: 'GB',
    flag: '🇬🇧',
    birthDate: '1985-01-07',
    birthPlace: 'Stevenage, Reino Unido',
    team: 'Scuderia Ferrari',
    teamColor: '#E8002D',
    headshotUrl:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png.transform/1col/image.png',
    biography:
      'Leyenda absoluta del automovilismo y heptacampeón del mundo. Máximo ganador histórico con más de 105 victorias y 104 poles. Viste el legendario rojo de la Scuderia Ferrari en 2026 en busca de su octava corona mundial.',
    careerStats: {
      grandsPrix: 370,
      podiums: 204,
      victories: 106,
      worldChampionships: 7,
      highestFinish: 'P1 (x106)',
      highestGrid: 'P1 (x104)',
    },
  },
  63: {
    number: 63,
    code: 'RUS',
    firstName: 'George',
    lastName: 'Russell',
    fullName: 'George Russell',
    nationality: 'Reino Unido',
    countryCode: 'GB',
    flag: '🇬🇧',
    birthDate: '1998-02-15',
    birthPlace: "King's Lynn, Reino Unido",
    team: 'Mercedes-AMG Petronas',
    teamColor: '#27F4D2',
    headshotUrl:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png.transform/1col/image.png',
    biography:
      '"Mr. Saturday". Campeón de GP3 y F2, líder experimentado de las flechas plateadas. Con victorias en Brasil, Austria, Las Vegas y triunfos en 2026, comanda a Mercedes-AMG Petronas en una dupla estelar con Kimi Antonelli.',
    careerStats: {
      grandsPrix: 142,
      podiums: 20,
      victories: 5,
      worldChampionships: 0,
      highestFinish: 'P1 (x5)',
      highestGrid: 'P1 (x6)',
    },
  },
  11: {
    number: 11,
    code: 'PER',
    firstName: 'Sergio',
    lastName: 'Pérez',
    fullName: 'Sergio Pérez',
    nationality: 'México',
    countryCode: 'MX',
    flag: '🇲🇽',
    birthDate: '1990-01-26',
    birthPlace: 'Guadalajara, México',
    team: 'Cadillac F1 Team',
    teamColor: '#D4D4D8',
    headshotUrl:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/S/SERPER01_Sergio_Perez/serper01.png.transform/1col/image.png',
    biography:
      '"Checo", el "Ministro de Defensa" mexicano y rey de los circuitos callejeros (Mónaco, Bakú, Singapur, Jeddah). Seis veces ganador de Grandes Premios, comanda en 2026 la histórica entrada de Cadillac F1 Team a la Fórmula 1.',
    careerStats: {
      grandsPrix: 295,
      podiums: 39,
      victories: 6,
      worldChampionships: 0,
      highestFinish: 'P1 (x6)',
      highestGrid: 'P1 (x3)',
    },
  },
  14: {
    number: 14,
    code: 'ALO',
    firstName: 'Fernando',
    lastName: 'Alonso',
    fullName: 'Fernando Alonso',
    nationality: 'España',
    countryCode: 'ES',
    flag: '🇪🇸',
    birthDate: '1981-07-29',
    birthPlace: 'Oviedo, Asturias, España',
    team: 'Aston Martin Aramco',
    teamColor: '#229971',
    headshotUrl:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/F/FERALO01_Fernando_Alonso/feralo01.png.transform/1col/image.png',
    biography:
      '"El Nano", bicampeón del mundo (2005, 2006) y el piloto con más carreras disputadas en la historia de la F1 (+415 GPs). Su lectura de carrera, gestión de neumáticos y garra competitiva siguen asombrando a generaciones de aficionados.',
    careerStats: {
      grandsPrix: 418,
      podiums: 106,
      victories: 32,
      worldChampionships: 2,
      highestFinish: 'P1 (x32)',
      highestGrid: 'P1 (x22)',
    },
  },
  10: {
    number: 10,
    code: 'GAS',
    firstName: 'Pierre',
    lastName: 'Gasly',
    fullName: 'Pierre Gasly',
    nationality: 'Francia',
    countryCode: 'FR',
    flag: '🇫🇷',
    birthDate: '1996-02-07',
    birthPlace: 'Ruan, Francia',
    team: 'Alpine F1 Team',
    teamColor: '#00A1E8',
    headshotUrl:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/P/PIEGAS01_Pierre_Gasly/piegas01.png.transform/1col/image.png',
    biography:
      'Vencedor de Monza 2020 y pilar fundamental de Alpine F1 Team. Líder consistente del equipo francés en 2026, formando una combativa dupla con Franco Colapinto.',
    careerStats: {
      grandsPrix: 164,
      podiums: 5,
      victories: 1,
      worldChampionships: 0,
      highestFinish: 'P1 (Monza 2020)',
      highestGrid: 'P2',
    },
  },
  31: {
    number: 31,
    code: 'OCO',
    firstName: 'Esteban',
    lastName: 'Ocon',
    fullName: 'Esteban Ocon',
    nationality: 'Francia',
    countryCode: 'FR',
    flag: '🇫🇷',
    birthDate: '1996-09-17',
    birthPlace: 'Évreux, Francia',
    team: 'Haas F1 Team',
    teamColor: '#B6BABD',
    headshotUrl:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/E/ESTOCO01_Esteban_Ocon/estoco01.png.transform/1col/image.png',
    biography:
      'Ganador del Gran Premio de Hungría 2021. Piloto aguerrido y tenaz en el combate rueda a rueda. Tras su paso por Force India y Alpine, comanda el proyecto de Haas F1 Team en 2026.',
    careerStats: {
      grandsPrix: 168,
      podiums: 4,
      victories: 1,
      worldChampionships: 0,
      highestFinish: 'P1 (Hungría 2021)',
      highestGrid: 'P3',
    },
  },
  18: {
    number: 18,
    code: 'STR',
    firstName: 'Lance',
    lastName: 'Stroll',
    fullName: 'Lance Stroll',
    nationality: 'Canadá',
    countryCode: 'CA',
    flag: '🇨🇦',
    birthDate: '1998-10-29',
    birthPlace: 'Montreal, Canadá',
    team: 'Aston Martin Aramco',
    teamColor: '#229971',
    headshotUrl:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANSTR01_Lance_Stroll/lanstr01.png.transform/1col/image.png',
    biography:
      'Piloto canadiense con podios históricos desde su debut en 2017 (Bakú, Monza, Sakhir) y pole position en Turquía. Piloto de Aston Martin Aramco junto a Fernando Alonso.',
    careerStats: {
      grandsPrix: 180,
      podiums: 3,
      victories: 0,
      worldChampionships: 0,
      highestFinish: 'P3 (x3)',
      highestGrid: 'P1 (Turquía 2020)',
    },
  },
  27: {
    number: 27,
    code: 'HUL',
    firstName: 'Nico',
    lastName: 'Hülkenberg',
    fullName: 'Nico Hülkenberg',
    nationality: 'Alemania',
    countryCode: 'DE',
    flag: '🇩🇪',
    birthDate: '1987-08-19',
    birthPlace: 'Emmerich am Rhein, Alemania',
    team: 'Audi F1 Team',
    teamColor: '#52E252',
    headshotUrl:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/N/NICHUL01_Nico_Hulkenberg/nichul01.png.transform/1col/image.png',
    biography:
      '"Hulk". Campeón de GP2 y ganador absoluto de las 24 Horas de Le Mans. Veterano respetadísimo de la parrilla que encabeza el desembarco de Audi en la Fórmula 1 en 2026 junto a Gabriel Bortoleto.',
    careerStats: {
      grandsPrix: 241,
      podiums: 0,
      victories: 0,
      worldChampionships: 0,
      highestFinish: 'P4 (x3)',
      highestGrid: 'P1 (Brasil 2010)',
    },
  },
  22: {
    number: 22,
    code: 'TSU',
    firstName: 'Yuki',
    lastName: 'Tsunoda',
    fullName: 'Yuki Tsunoda',
    nationality: 'Japón',
    countryCode: 'JP',
    flag: '🇯🇵',
    birthDate: '2000-05-11',
    birthPlace: 'Sagamihara, Kanagawa, Japón',
    team: 'Racing Bulls',
    teamColor: '#6692FF',
    headshotUrl:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/Y/YUKTSU01_Yuki_Tsunoda/yuktsu01.png.transform/1col/image.png',
    biography:
      'Piloto japonés impulsado por Honda y Red Bull. Conocido por su agresividad combativa y velocidad pura en clasificación, referente de Racing Bulls.',
    careerStats: {
      grandsPrix: 101,
      podiums: 0,
      victories: 0,
      worldChampionships: 0,
      highestFinish: 'P4 (Abu Dhabi 2021)',
      highestGrid: 'P6',
    },
  },
  23: {
    number: 23,
    code: 'ALB',
    firstName: 'Alexander',
    lastName: 'Albon',
    fullName: 'Alexander Albon',
    nationality: 'Tailandia',
    countryCode: 'TH',
    flag: '🇹🇭',
    birthDate: '1996-03-23',
    birthPlace: 'Londres, Reino Unido',
    team: 'Williams Racing',
    teamColor: '#64C4FF',
    headshotUrl:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/A/ALEALB01_Alexander_Albon/alealb01.png.transform/1col/image.png',
    biography:
      'Piloto tailandés con podios en Mugello y Bahréin. Pilar fundamental de la reestructuración de Williams Racing, donde forma una temible dupla con Carlos Sainz en 2026.',
    careerStats: {
      grandsPrix: 118,
      podiums: 2,
      victories: 0,
      worldChampionships: 0,
      highestFinish: 'P3 (x2)',
      highestGrid: 'P2',
    },
  },
  30: {
    number: 30,
    code: 'LAW',
    firstName: 'Liam',
    lastName: 'Lawson',
    fullName: 'Liam Lawson',
    nationality: 'Nueva Zelanda',
    countryCode: 'NZ',
    flag: '🇳🇿',
    birthDate: '2002-02-11',
    birthPlace: 'Hastings, Nueva Zelanda',
    team: 'Racing Bulls',
    teamColor: '#6692FF',
    headshotUrl:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LIALAW01_Liam_Lawson/lialaw01.png.transform/1col/image.png',
    biography:
      'Joven neozelandés forjado en el Red Bull Junior Team y subcampeón de Super Fórmula. Consagrado como titular de Racing Bulls en 2026 sumando puntos valiosos con gran temple.',
    careerStats: {
      grandsPrix: 25,
      podiums: 0,
      victories: 0,
      worldChampionships: 0,
      highestFinish: 'P7 (Melbourne 2026)',
      highestGrid: 'P7',
    },
  },
  87: {
    number: 87,
    code: 'BEA',
    firstName: 'Oliver',
    lastName: 'Bearman',
    fullName: 'Oliver Bearman',
    nationality: 'Reino Unido',
    countryCode: 'GB',
    flag: '🇬🇧',
    birthDate: '2005-05-08',
    birthPlace: 'Chelmsford, Reino Unido',
    team: 'Haas F1 Team',
    teamColor: '#B6BABD',
    headshotUrl:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/O/OLIBEA01_Oliver_Bearman/olibea01.png.transform/1col/image.png',
    biography:
      '"Ollie". Protagonizó uno de los debuts más estelares de la historia sumando con Ferrari en Jeddah y con Haas en Bakú. Titular a tiempo completo en Haas F1 Team en 2026 puntuando de forma constante.',
    careerStats: {
      grandsPrix: 17,
      podiums: 0,
      victories: 0,
      worldChampionships: 0,
      highestFinish: 'P5 (Miami 2026)',
      highestGrid: 'P6',
    },
  },
  77: {
    number: 77,
    code: 'BOT',
    firstName: 'Valtteri',
    lastName: 'Bottas',
    fullName: 'Valtteri Bottas',
    nationality: 'Finlandia',
    countryCode: 'FI',
    flag: '🇫🇮',
    birthDate: '1989-08-28',
    birthPlace: 'Nastola, Finlandia',
    team: 'Cadillac F1 Team',
    teamColor: '#D4D4D8',
    headshotUrl:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/V/VALBOT01_Valtteri_Bottas/valbot01.png.transform/1col/image.png',
    biography:
      'Subcampeón del mundo y 10 veces ganador de Grandes Premios con Mercedes. Aporta su vasta jerarquía para encabezar la llegada de Cadillac F1 Team a la Fórmula 1 en 2026.',
    careerStats: {
      grandsPrix: 260,
      podiums: 67,
      victories: 10,
      worldChampionships: 0,
      highestFinish: 'P1 (x10)',
      highestGrid: 'P1 (x20)',
    },
  },
  12: {
    number: 12,
    code: 'ANT',
    firstName: 'Andrea Kimi',
    lastName: 'Antonelli',
    fullName: 'Andrea Kimi Antonelli',
    nationality: 'Italia',
    countryCode: 'IT',
    flag: '🇮🇹',
    birthDate: '2006-08-25',
    birthPlace: 'Bolonia, Italia',
    team: 'Mercedes-AMG Petronas',
    teamColor: '#27F4D2',
    headshotUrl:
      'https://media.formula1.com/image/upload/c_fill,w_720/q_auto/v1740000001/common/f1/2026/mercedes/andant01/2026mercedesandant01right.webp',
    biography:
      'La gran sensación italiana de la Fórmula 1 y prodigio de Mercedes-AMG Petronas. Con solo 19 años debutó como sucesor de Lewis Hamilton y conmocionó al mundo del deporte liderando el Campeonato Mundial 2026 con 8 victorias categóricas.',
    careerStats: {
      grandsPrix: 14,
      podiums: 10,
      victories: 8,
      worldChampionships: 0,
      highestFinish: 'P1 (x8)',
      highestGrid: 'P1 (x6)',
    },
  },
  5: {
    number: 5,
    code: 'BOR',
    firstName: 'Gabriel',
    lastName: 'Bortoleto',
    fullName: 'Gabriel Bortoleto',
    nationality: 'Brasil',
    countryCode: 'BR',
    flag: '🇧🇷',
    birthDate: '2004-10-14',
    birthPlace: 'São Paulo, Brasil',
    team: 'Audi F1 Team',
    teamColor: '#52E252',
    headshotUrl:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GABBOR01_Gabriel_Bortoleto/gabbor01.png.transform/1col/image.png',
    biography:
      'Campeón dominante de Fórmula 3 en 2023 y campeón de Fórmula 2, respaldado por Fernando Alonso. Elegido por Audi para encabezar su nueva era oficial en la Fórmula 1 en 2026.',
    careerStats: {
      grandsPrix: 14,
      podiums: 0,
      victories: 0,
      worldChampionships: 0,
      highestFinish: 'P9 (Miami 2026)',
      highestGrid: 'P9',
    },
  },
  6: {
    number: 6,
    code: 'HAD',
    firstName: 'Isack',
    lastName: 'Hadjar',
    fullName: 'Isack Hadjar',
    nationality: 'Francia',
    countryCode: 'FR',
    flag: '🇫🇷',
    birthDate: '2004-09-28',
    birthPlace: 'París, Francia',
    team: 'Red Bull Racing',
    teamColor: '#3671C6',
    headshotUrl:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/I/ISAHAD01_Isack_Hadjar/isahad01.png.transform/1col/image.png',
    biography:
      'Apodado por Helmut Marko como el "pequeño Prost". Subcampeón de F2 y ascendido directamente como piloto oficial de Red Bull Racing en la Fórmula 1 en 2026, destacándose por su combatividad rueda a rueda.',
    careerStats: {
      grandsPrix: 14,
      podiums: 1,
      victories: 0,
      worldChampionships: 0,
      highestFinish: 'P4 (Imola 2026)',
      highestGrid: 'P3',
    },
  },
  41: {
    number: 41,
    code: 'LIN',
    firstName: 'Arvid',
    lastName: 'Lindblad',
    fullName: 'Arvid Lindblad',
    nationality: 'Reino Unido',
    countryCode: 'GB',
    flag: '🇬🇧',
    birthDate: '2007-08-08',
    birthPlace: 'Londres, Reino Unido',
    team: 'Racing Bulls',
    teamColor: '#6692FF',
    headshotUrl:
      'https://media.formula1.com/image/upload/c_fill,w_720/q_auto/v1740000001/common/f1/2026/racingbulls/arvlin01/2026racingbullsarvlin01right.webp',
    biography:
      'Joven maravilla británico-sueco formado en el Red Bull Junior Team. Con apenas 18 años ascendió directamente a la Fórmula 1 como piloto titular de Racing Bulls en 2026 tras deslumbrar en F3 y F2.',
    careerStats: {
      grandsPrix: 14,
      podiums: 0,
      victories: 0,
      worldChampionships: 0,
      highestFinish: 'P8 (Suzuka 2026)',
      highestGrid: 'P8',
    },
  },
};

/**
 * Normalizes an input (driver number, surname, acronym or full name)
 * to find the corresponding F1DriverProfile with strict priority:
 * 1. Exact 3-letter driver code (VER, NOR, ANT, LIN, etc.)
 * 2. Exact full name or last name
 * 3. Driver number match
 * 4. Safe substring match (length >= 4 only)
 */
export function getF1DriverProfile(
  identifier: number | string | undefined | null,
): F1DriverProfile | undefined {
  if (identifier === undefined || identifier === null || identifier === '') {
    return undefined;
  }

  const allDrivers = Object.values(F1_DRIVERS_DATA);

  // 1. Direct number passed as number type
  if (typeof identifier === 'number') {
    if (F1_DRIVERS_DATA[identifier]) return F1_DRIVERS_DATA[identifier];
    const byNum = allDrivers.find((d) => d.number === identifier);
    if (byNum) return byNum;
  }

  const rawStr = String(identifier).trim();
  if (!rawStr) return undefined;

  const normalized = rawStr
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  // 2. Exact 3-letter code match (VER, NOR, ANT, LIN, COL, etc.)
  if (normalized.length === 3) {
    const byCode = allDrivers.find((d) => d.code.toLowerCase() === normalized);
    if (byCode) return byCode;
  }

  // 3. Exact full name or last name match
  const exactName = allDrivers.find((d) => {
    const dLast = d.lastName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const dFull = d.fullName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const dFirstLast = `${d.firstName} ${d.lastName}`.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return dLast === normalized || dFull === normalized || dFirstLast === normalized;
  });
  if (exactName) return exactName;

  // 4. Numeric string match (e.g. "43", "12", "41")
  const parsedNum = parseInt(rawStr, 10);
  if (!Number.isNaN(parsedNum) && String(parsedNum) === rawStr) {
    if (F1_DRIVERS_DATA[parsedNum]) return F1_DRIVERS_DATA[parsedNum];
    const byNum = allDrivers.find((d) => d.number === parsedNum);
    if (byNum) return byNum;
  }

  // 5. Smart Substring / Name Match (Only for strings of length >= 4)
  if (normalized.length >= 4) {
    const matchContained = allDrivers.find((d) => {
      const dLast = d.lastName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const dFull = d.fullName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return dFull.includes(normalized) || normalized.includes(dLast);
    });
    if (matchContained) return matchContained;
  }

  return undefined;
}

/**
 * Enriches a static driver profile with live/season data from current championship standings
 * so the driver card stays dynamically synchronized with the latest disputed Grand Prix.
 */
export function enrichDriverProfileWithSeason(
  profile: F1DriverProfile,
  standing?: { pos: number; points: number; wins: number; team?: string; teamColor?: string },
  totalCompletedRounds = 14,
): F1DriverProfile {
  if (!standing) return profile;

  const currentWins = standing.wins || 0;
  const victories = Math.max(profile.careerStats.victories, currentWins);
  const grandsPrix = Math.max(profile.careerStats.grandsPrix, totalCompletedRounds);

  return {
    ...profile,
    team: standing.team || profile.team,
    teamColor: standing.teamColor || profile.teamColor,
    careerStats: {
      ...profile.careerStats,
      grandsPrix,
      victories,
      highestFinish: currentWins > 0 && !profile.careerStats.highestFinish.startsWith('P1')
        ? `P1 (x${victories})`
        : profile.careerStats.highestFinish,
    },
    season2026: {
      position: standing.pos,
      points: standing.points,
      wins: standing.wins,
      teamName: standing.team || profile.team,
    },
  };
}

/**
 * Calculates current age from a YYYY-MM-DD birthDate string.
 */
export function calculateAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}
