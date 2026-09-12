export interface CareerStats {
  grandsPrix: number;
  podiums: number;
  victories: number;
  worldChampionships: number;
  highestFinish: string;
  highestGrid: string;
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
    team: 'Williams / Alpine',
    teamColor: '#00A1E8',
    headshotUrl:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/F/FRACOL01_Franco_Colapinto/fracol01.png.transform/1col/image.png',
    biography:
      'Joven prodigio argentino que revolucionó la Fórmula 1 en 2024 tras debutar con Williams en Monza. Sumó puntos históricos en Bakú (P8) y Austin (P10) con maniobras memorables, devolviendo a la Argentina al mapa grande del automovilismo mundial tras más de dos décadas.',
    careerStats: {
      grandsPrix: 9,
      podiums: 0,
      victories: 0,
      worldChampionships: 0,
      highestFinish: 'P8 (Azerbaiyán 2024)',
      highestGrid: 'P8 (Azerbaiyán 2024)',
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
      grandsPrix: 209,
      podiums: 111,
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
      'Líder natural de McLaren y subcampeón del mundo. Con su primera victoria en Miami 2024 y triunfos categóricos en Zandvoort y Singapur, se consagró como uno de los pilotos más rápidos a una vuelta de la grilla moderna.',
    careerStats: {
      grandsPrix: 128,
      podiums: 26,
      victories: 3,
      worldChampionships: 0,
      highestFinish: 'P1 (Miami 2024)',
      highestGrid: 'P1 (x8)',
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
    teamColor: '#E80020',
    headshotUrl:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png.transform/1col/image.png',
    biography:
      'El "Predestinado" de Ferrari. Maestro indiscutido de las sesiones de clasificación con más de 25 poles. Cumplió el sueño de su vida ganando el Gran Premio de Mónaco en casa y desató la fiesta tifosi venciendo en Monza en 2024.',
    careerStats: {
      grandsPrix: 146,
      podiums: 42,
      victories: 8,
      worldChampionships: 0,
      highestFinish: 'P1 (x8)',
      highestGrid: 'P1 (x26)',
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
      'Una de las irrupciones más impactantes de las últimas décadas. Tras ganar Fórmula Renault, F3 y F2 en años consecutivos como debutante, logró sus primeras victorias en F1 en Hungría y con una defensa colosal ante Leclerc en Bakú 2024.',
    careerStats: {
      grandsPrix: 46,
      podiums: 9,
      victories: 2,
      worldChampionships: 0,
      highestFinish: 'P1 (Hungría 2024)',
      highestGrid: 'P2 (x5)',
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
    team: 'Williams / Ferrari',
    teamColor: '#64C4FF',
    headshotUrl:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png.transform/1col/image.png',
    biography:
      'Apodado "Smooth Operator". Conocido por su inteligencia estratégica desde el habitáculo y precisión quirúrgica. Único piloto no-Red Bull en ganar una carrera en 2023 (Singapur) y vencedor épico en Australia y México 2024.',
    careerStats: {
      grandsPrix: 206,
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
    teamColor: '#E80020',
    headshotUrl:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png.transform/1col/image.png',
    biography:
      'Leyenda absoluta del deporte y heptacampeón del mundo. Máximo ganador histórico con 105 victorias y 104 poles. Emocionó al mundo entero con su victoria récord en Silverstone 2024 antes de su traspaso estelar a la Scuderia Ferrari.',
    careerStats: {
      grandsPrix: 356,
      podiums: 201,
      victories: 105,
      worldChampionships: 7,
      highestFinish: 'P1 (x105)',
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
      '"Mr. Saturday". Campeón de GP3 y F2, líder de la escudería de las flechas plateadas. Vencedor en Brasil 2022, Austria y Las Vegas 2024, destaca por su velocidad pura en clasificación y temperamento competitivo.',
    careerStats: {
      grandsPrix: 128,
      podiums: 15,
      victories: 3,
      worldChampionships: 0,
      highestFinish: 'P1 (x3)',
      highestGrid: 'P1 (x4)',
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
    team: 'Red Bull Racing',
    teamColor: '#3671C6',
    headshotUrl:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/S/SERPER01_Sergio_Perez/serper01.png.transform/1col/image.png',
    biography:
      '"Checo", el "Ministro de Defensa" mexicano y rey de los circuitos callejeros (Mónaco, Bakú, Singapur, Jeddah). Subcampeón del mundo en 2023 y pilar clave en los títulos de constructores de Red Bull Racing.',
    careerStats: {
      grandsPrix: 281,
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
    team: 'Aston Martin F1 Team',
    teamColor: '#229971',
    headshotUrl:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/F/FERALO01_Fernando_Alonso/feralo01.png.transform/1col/image.png',
    biography:
      '"El Nano", bicampeón del mundo (2005, 2006) y el piloto con más carreras disputadas en la historia de la F1 (+400 GPs). Su lectura de carrera, gestión de neumáticos y garra competitiva siguen asombrando a generaciones de aficionados.',
    careerStats: {
      grandsPrix: 401,
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
    teamColor: '#0093CC',
    headshotUrl:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/P/PIEGAS01_Pierre_Gasly/piegas01.png.transform/1col/image.png',
    biography:
      'Vencedor de Monza 2020 con AlphaTauri en una de las victorias más emotivas de la era híbrida. Líder de Alpine, logró un podio doble histórico en el diluvio de Interlagos 2024 junto a Ocon.',
    careerStats: {
      grandsPrix: 153,
      podiums: 5,
      victories: 1,
      worldChampionships: 0,
      highestFinish: 'P1 (Italia 2020)',
      highestGrid: 'P2 (x2)',
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
      'Ganador del Gran Premio de Hungría 2021. Piloto aguerrido y tenaz en el combate rueda a rueda. Tras su paso por Alpine con podio en São Paulo 2024, comanda el nuevo proyecto de Haas F1 Team.',
    careerStats: {
      grandsPrix: 156,
      podiums: 4,
      victories: 1,
      worldChampionships: 0,
      highestFinish: 'P1 (Hungría 2021)',
      highestGrid: 'P3 (x2)',
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
    team: 'Aston Martin F1 Team',
    teamColor: '#229971',
    headshotUrl:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANSTR01_Lance_Stroll/lanstr01.png.transform/1col/image.png',
    biography:
      'Piloto canadiense que logró podio en su temporada debut en Bakú 2017 con 18 años. Especialista en condiciones de lluvia extrema, con una pole position magistral en el Gran Premio de Turquía 2020.',
    careerStats: {
      grandsPrix: 166,
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
    team: 'Kick Sauber / Audi',
    teamColor: '#52E252',
    headshotUrl:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/N/NICHUL01_Nico_Hulkenberg/nichul01.png.transform/1col/image.png',
    biography:
      '"Hulk". Campeón de GP2 y ganador de las 24 Horas de Le Mans en su debut. Famoso por su velocidad estelar los sábados y regularidad implacable en zona de puntos, liderando el camino de transición hacia Audi.',
    careerStats: {
      grandsPrix: 227,
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
    team: 'Visa Cash App RB',
    teamColor: '#6692FF',
    headshotUrl:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/Y/YUKTSU01_Yuki_Tsunoda/yuktsu01.png.transform/1col/image.png',
    biography:
      'El piloto japonés más veloz de su generación. Formado en el programa junior de Honda y Red Bull, ha madurado hasta convertirse en el referente de Racing Bulls con adelantamientos osados y gran velocidad.',
    careerStats: {
      grandsPrix: 87,
      podiums: 0,
      victories: 0,
      worldChampionships: 0,
      highestFinish: 'P4 (Abu Dhabi 2021)',
      highestGrid: 'P3 (Brasil 2024)',
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
    teamColor: '#00A0DE',
    headshotUrl:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/A/ALEALB01_Alexander_Albon/alealb01.png.transform/1col/image.png',
    biography:
      'Líder del resurgimiento de Williams Racing. Consiguió podios con Red Bull en Mugello y Baréin, y desde 2022 ha exprimido al máximo el monoplaza de Grove, defendiendo posiciones con uñas y dientes.',
    careerStats: {
      grandsPrix: 104,
      podiums: 2,
      victories: 0,
      worldChampionships: 0,
      highestFinish: 'P3 (x2)',
      highestGrid: 'P4 (x3)',
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
    team: 'Red Bull Racing / RB',
    teamColor: '#3671C6',
    headshotUrl:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LIALAW01_Liam_Lawson/lialaw01.png.transform/1col/image.png',
    biography:
      'Joven neozelandés que impresionó al sustituir a Ricciardo en 2023 sumando puntos en Singapur. Con su estilo combativo sin miedo a los consagrados, ascendió a la estructura mayor de Red Bull.',
    careerStats: {
      grandsPrix: 11,
      podiums: 0,
      victories: 0,
      worldChampionships: 0,
      highestFinish: 'P9 (x2)',
      highestGrid: 'P10',
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
      '"Ollie". Protagonizó uno de los debuts más estelares de la historia al subirse a Ferrari con 18 años en Jeddah 2024 y finalizar P7. También sumó puntos con Haas en Bakú, sellando su contrato titular.',
    careerStats: {
      grandsPrix: 3,
      podiums: 0,
      victories: 0,
      worldChampionships: 0,
      highestFinish: 'P7 (Arabia Saudita 2024)',
      highestGrid: 'P11',
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
    team: 'Kick Sauber / Cadillac',
    teamColor: '#52E252',
    headshotUrl:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/V/VALBOT01_Valtteri_Bottas/valbot01.png.transform/1col/image.png',
    biography:
      'Subcampeón del mundo en 2019 y 2020 con Mercedes-AMG. Ganador de 10 Grandes Premios y autor de 67 podios. Uno de los pilotos más veloces y experimentados de la era moderna.',
    careerStats: {
      grandsPrix: 246,
      podiums: 67,
      victories: 10,
      worldChampionships: 0,
      highestFinish: 'P1 (x10)',
      highestGrid: 'P1 (x20)',
    },
  },
  24: {
    number: 24,
    code: 'ZHO',
    firstName: 'Guanyu',
    lastName: 'Zhou',
    fullName: 'Guanyu Zhou',
    nationality: 'China',
    countryCode: 'CN',
    flag: '🇨🇳',
    birthDate: '1999-05-30',
    birthPlace: 'Shanghái, China',
    team: 'Kick Sauber',
    teamColor: '#52E252',
    headshotUrl:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GUAZHO01_Guanyu_Zhou/guazho01.png.transform/1col/image.png',
    biography:
      'Primer piloto de la República Popular China en competir en la Fórmula 1, sumando puntos en su carrera debut en Baréin 2022. Respetado por su solidez al volante y técnica limpia.',
    careerStats: {
      grandsPrix: 68,
      podiums: 0,
      victories: 0,
      worldChampionships: 0,
      highestFinish: 'P8 (Canadá 2022)',
      highestGrid: 'P5 (Hungría 2023)',
    },
  },
  20: {
    number: 20,
    code: 'MAG',
    firstName: 'Kevin',
    lastName: 'Magnussen',
    fullName: 'Kevin Magnussen',
    nationality: 'Dinamarca',
    countryCode: 'DK',
    flag: '🇩🇰',
    birthDate: '1992-10-05',
    birthPlace: 'Roskilde, Dinamarca',
    team: 'Haas F1 Team',
    teamColor: '#B6BABD',
    headshotUrl:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/K/KEVMAG01_Kevin_Magnussen/kevmag01.png.transform/1col/image.png',
    biography:
      '"K-Mag". Logró podio en su primera carrera en F1 (Australia 2014) y una inolvidable pole position bajo la lluvia en Interlagos 2022 con Haas. Célebre por su defensa férrea y valentía.',
    careerStats: {
      grandsPrix: 185,
      podiums: 1,
      victories: 0,
      worldChampionships: 0,
      highestFinish: 'P2 (Australia 2014)',
      highestGrid: 'P1 (Brasil 2022)',
    },
  },
  3: {
    number: 3,
    code: 'RIC',
    firstName: 'Daniel',
    lastName: 'Ricciardo',
    fullName: 'Daniel Ricciardo',
    nationality: 'Australia',
    countryCode: 'AU',
    flag: '🇦🇺',
    birthDate: '1989-07-01',
    birthPlace: 'Perth, Australia',
    team: 'Visa Cash App RB',
    teamColor: '#6692FF',
    headshotUrl:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/D/DANRIC01_Daniel_Ricciardo/danric01.png.transform/1col/image.png',
    biography:
      '"The Honey Badger". Dueño de una de las sonrisas más famosas del paddock y de los adelantamientos más espectaculares en frenada profunda. Ganador de 8 Grandes Premios, incluyendo Mónaco 2018 y Monza 2021.',
    careerStats: {
      grandsPrix: 257,
      podiums: 32,
      victories: 8,
      worldChampionships: 0,
      highestFinish: 'P1 (x8)',
      highestGrid: 'P1 (x3)',
    },
  },
  2: {
    number: 2,
    code: 'SAR',
    firstName: 'Logan',
    lastName: 'Sargeant',
    fullName: 'Logan Sargeant',
    nationality: 'Estados Unidos',
    countryCode: 'US',
    flag: '🇺🇸',
    birthDate: '2000-12-31',
    birthPlace: 'Fort Lauderdale, Florida, EE.UU.',
    team: 'Williams Racing',
    teamColor: '#00A0DE',
    headshotUrl:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LOGSAR01_Logan_Sargeant/logsar01.png.transform/1col/image.png',
    biography:
      'Primer piloto estadounidense en sumar puntos en la Fórmula 1 en 30 años al terminar décimo en el Gran Premio de los Estados Unidos en Austin 2023 con Williams Racing.',
    careerStats: {
      grandsPrix: 36,
      podiums: 0,
      victories: 0,
      worldChampionships: 0,
      highestFinish: 'P10 (EE.UU. 2023)',
      highestGrid: 'P6',
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
      'La gran promesa italiana y joya de la academia Mercedes. Con solo 18 años, el protegido de Toto Wolff fue elegido para suceder a Lewis Hamilton en las flechas plateadas tras una brillante trayectoria.',
    careerStats: {
      grandsPrix: 0,
      podiums: 0,
      victories: 0,
      worldChampionships: 0,
      highestFinish: 'Debut 2025/2026',
      highestGrid: 'Debut 2025/2026',
    },
  },
  7: {
    number: 7,
    code: 'DOO',
    firstName: 'Jack',
    lastName: 'Doohan',
    fullName: 'Jack Doohan',
    nationality: 'Australia',
    countryCode: 'AU',
    flag: '🇦🇺',
    birthDate: '2003-01-20',
    birthPlace: 'Gold Coast, Australia',
    team: 'Alpine F1 Team',
    teamColor: '#0093CC',
    headshotUrl:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/J/JACDOO01_Jack_Doohan/jacdoo01.png.transform/1col/image.png',
    biography:
      'Hijo del legendario pentacampeón mundial de motociclismo Mick Doohan. Subcampeón de F3 y ganador múltiple de carreras en F2, ascendido a piloto titular de Alpine.',
    careerStats: {
      grandsPrix: 1,
      podiums: 0,
      victories: 0,
      worldChampionships: 0,
      highestFinish: 'P15',
      highestGrid: 'P17',
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
    team: 'Kick Sauber / Audi',
    teamColor: '#52E252',
    headshotUrl:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GABBOR01_Gabriel_Bortoleto/gabbor01.png.transform/1col/image.png',
    biography:
      'Campeón dominante de Fórmula 3 en 2023 y estrella de F2, respaldado por Fernando Alonso. Elegido por Audi/Sauber para encabezar su nueva era en la Fórmula 1.',
    careerStats: {
      grandsPrix: 0,
      podiums: 0,
      victories: 0,
      worldChampionships: 0,
      highestFinish: 'Debut 2025',
      highestGrid: 'Debut 2025',
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
    team: 'Racing Bulls',
    teamColor: '#6692FF',
    headshotUrl:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/I/ISAHAD01_Isack_Hadjar/isahad01.png.transform/1col/image.png',
    biography:
      'Apodado por Helmut Marko como el "pequeño Prost". Subcampeón de F2 en 2024 con cuatro victorias soberbias, ascendiendo al programa oficial de Fórmula 1 de Red Bull.',
    careerStats: {
      grandsPrix: 0,
      podiums: 0,
      victories: 0,
      worldChampionships: 0,
      highestFinish: 'Debut 2025',
      highestGrid: 'Debut 2025',
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
      'Joven maravilla británico-sueco formado en el Red Bull Junior Team. Con apenas 18 años ascendió directamente a la Fórmula 1 como piloto titular de Racing Bulls en 2026 tras deslumbrar en las categorías formativas con múltiples victorias épicas en F3 y F2.',
    careerStats: {
      grandsPrix: 0,
      podiums: 0,
      victories: 0,
      worldChampionships: 0,
      highestFinish: 'Debut 2026',
      highestGrid: 'Debut 2026',
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
  // Crucial: 3-letter codes in F1 are 100% unique. Never substring match them!
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
  // Prevents short strings (like "ant") from erroneously matching inside "sargeant"
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
