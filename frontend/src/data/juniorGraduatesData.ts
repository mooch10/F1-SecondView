export interface F1AcademyInfo {
  id: string;
  name: string;
  shortName: string;
  color: string;
  f1Team: string;
  badge: string;
}

export const F1_ACADEMIES: Record<string, F1AcademyInfo> = {
  ferrari: {
    id: 'ferrari',
    name: 'Ferrari Driver Academy',
    shortName: 'FDA',
    color: '#E8002D',
    f1Team: 'Ferrari',
    badge: '🐎 Ferrari',
  },
  redbull: {
    id: 'redbull',
    name: 'Red Bull Junior Team',
    shortName: 'RBJT',
    color: '#3671C6',
    f1Team: 'Red Bull Racing',
    badge: '🐂 Red Bull',
  },
  mclaren: {
    id: 'mclaren',
    name: 'McLaren Driver Development',
    shortName: 'MCL',
    color: '#FF8000',
    f1Team: 'McLaren',
    badge: '🧡 McLaren',
  },
  williams: {
    id: 'williams',
    name: 'Williams Racing Driver Academy',
    shortName: 'WIL',
    color: '#00A0DE',
    f1Team: 'Williams',
    badge: '🔷 Williams',
  },
  alpine: {
    id: 'alpine',
    name: 'Alpine Academy',
    shortName: 'ALP',
    color: '#0093CC',
    f1Team: 'Alpine',
    badge: '🔵 Alpine',
  },
  sauber: {
    id: 'sauber',
    name: 'Sauber / Audi Driver Programme',
    shortName: 'SAU',
    color: '#52E252',
    f1Team: 'Kick Sauber / Audi',
    badge: '🟢 Sauber / Audi',
  },
  astonmartin: {
    id: 'astonmartin',
    name: 'Aston Martin Driver Development',
    shortName: 'AMR',
    color: '#229971',
    f1Team: 'Aston Martin',
    badge: '💚 Aston Martin',
  },
  mercedes: {
    id: 'mercedes',
    name: 'Mercedes Junior Team',
    shortName: 'MERC',
    color: '#27F4D2',
    f1Team: 'Mercedes-AMG',
    badge: '⭐ Mercedes',
  },
  cadillac: {
    id: 'cadillac',
    name: 'Cadillac F1 Test Program',
    shortName: 'CAD',
    color: '#EAB308',
    f1Team: 'Cadillac F1',
    badge: '🛡️ Cadillac',
  },
  independent: {
    id: 'independent',
    name: 'Independiente (Sin academia F1)',
    shortName: 'IND',
    color: '#71717A',
    f1Team: 'Independiente',
    badge: '⚡ Independiente',
  },
};

// Map driver codes to their academy ID
export const DRIVER_ACADEMY_MAP: Record<string, string> = {
  // F2 Drivers (2026, 2025, 2024)
  TSO: 'redbull',      // Nikola Tsolov (Red Bull Junior Team)
  CAM: 'ferrari',      // Rafael Câmara (Ferrari Driver Academy)
  FOR: 'mclaren',      // Leonardo Fornaroli (McLaren F1 Reserve)
  DUR: 'independent',  // Joshua Dürksen (Independiente)
  MIN: 'alpine',       // Gabriele Minì (Alpine Academy)
  BEG: 'ferrari',      // Dino Beganovic (Ferrari Driver Academy)
  DUN: 'alpine',       // Alex Dunne (Alpine Academy 2026)
  MAI: 'alpine',       // Kush Maini (Alpine Academy)
  HOE: 'independent',  // Laurens van Hoepen / Christian Ho
  FIT: 'sauber',       // Emerson Fittipaldi Jr (Sauber Academy)
  GOE: 'redbull',      // Oliver Goethe (Red Bull Junior Team)
  BOY: 'astonmartin',  // Mari Boya (Aston Martin Aramco Driver Academy)
  INT: 'independent',  // Tasanapol Inthraphuvasak
  STE: 'mclaren',      // Martinius Stenshorne (McLaren Driver Development)
  BEN: 'independent',  // John Bennett
  MIY: 'independent',  // Ritomo Miyata (Toyota Gazoo)
  HER: 'cadillac',     // Colton Herta (Cadillac F1 Test Program)
  BIL: 'independent',  // Roman Bilinski
  MON: 'independent',  // Sebastián Montoya
  LEO: 'independent',  // Noel León
  VIL: 'independent',  // Rafael Villagómez
  VAR: 'independent',  // Nico Varrone
  SHI: 'independent',  // Cian Shields
  LIN: 'redbull',      // Arvid Lindblad (Red Bull Junior Team)
  BRO: 'williams',     // Luke Browning (Williams Racing Driver Academy)
  TRA: 'redbull',      // Tim Tramnitz (Red Bull Junior Team)

  // F3 Drivers (2026, 2025, 2024)
  SLA: 'sauber',       // Freddie Slater (Audi Driver Development / Sauber)
  NAE: 'independent',  // Théophile Naël
  UGO: 'mclaren',      // Ugo Ugochukwu (McLaren Driver Development)
  KAT: 'redbull',      // Taito Kato (Honda Dream Project / Red Bull)
  KAI: 'redbull',      // Taito Kato (Honda Dream Project / Red Bull - FOM TLA)
  GIU: 'williams',     // Alessandro Giusti (Williams Racing Driver Academy)
  RIV: 'redbull',      // Ernesto Rivera (Red Bull Junior Team)
  CLE: 'independent',  // Pedro Clerot
  TAP: 'ferrari',      // Tuukka Taponen (Ferrari Driver Academy)
  BAD: 'mclaren',      // Brando Badoer (McLaren Driver Development)
  YAM: 'independent',  // Hiyu Yamakoshi
  STR: 'independent',  // Noah Strømsted
  PIN: 'independent',  // Bruno del Pino
  DEL: 'independent',  // Bruno del Pino (FOM TLA)
  GLA: 'sauber',       // Maciej Gładysz (Sauber Academy)
  CNG: 'redbull',      // Mattia Colnaghi (Red Bull Junior Team)
  WHA: 'ferrari',      // James Wharton (Ex-Ferrari Driver Academy)
  NAK: 'independent',  // Jin Nakamura (TGR)
  DAV: 'independent',  // Yevan David
  DIL: 'redbull',      // Enzo Deligny (Red Bull Junior Team - FOM TLA)
  LAC: 'alpine',       // Nicola Lacorte (Alpine Academy)
  POW: 'mercedes',     // Alex Powell (Mercedes Junior Team)
  LE: 'independent',   // Kanato Le
  KLE: 'independent',  // Kanato Le (FOM TLA)
  XIE: 'independent',  // Gerrard Xie
  DEP: 'independent',  // Matteo De Palo
  VOI: 'independent',  // Callum Voisin
  SHA: 'independent',  // Louis Sharp
  HO: 'independent',   // Christian Ho
  CHO: 'independent',  // Christian Ho (FOM TLA)
  ZAG: 'independent',  // Matías Zagazeta
  DOM: 'independent',  // Ivan Domingues
  SAG: 'independent',  // Javier Sagrera
  MAN: 'independent',  // Christian Mansell
  MEG: 'independent',  // Sami Meguetounif
  MCL: 'redbull',      // Fionn McLaughlin (Red Bull Junior Team)
  BAR: 'independent',  // Fernando Barrichello
  GAR: 'independent',  // José Garfias
  BHI: 'independent',  // Nandhavud Bhirombhakdi
  ESC: 'independent',  // Ricardo Escotto
  HEU: 'independent',  // Patrick Heuzenroeder
  HAN: 'independent',  // Salim Hanna
  // Historical F2 & F3 Driver Codes
  POU: 'sauber',       // Théo Pourchaire (Sauber Academy)
  VES: 'mercedes',     // Frederik Vesti (Mercedes Junior Team)
  DOO: 'alpine',       // Jack Doohan (Alpine Academy)
  IWA: 'redbull',      // Ayumu Iwasa (Red Bull Junior Team)
  MAR: 'alpine',       // Victor Martins / Artem Markelov (Alpine Academy)
  BEA: 'ferrari',      // Oliver Bearman (Ferrari Driver Academy)
  MAL: 'independent',  // Zane Maloney (Independiente)
  DAR: 'redbull',      // Jehan Daruvala (Red Bull Junior Team)
  HAD: 'redbull',      // Isack Hadjar (Red Bull Junior Team)
  LEC: 'ferrari',      // Charles Leclerc / Arthur Leclerc (Ferrari Driver Academy)
  DRU: 'astonmartin',  // Felipe Drugovich (Aston Martin Driver Development)
  LAW: 'redbull',      // Liam Lawson (Red Bull Junior Team)
  SAR: 'williams',     // Logan Sargeant (Williams Racing Driver Academy)
  VIP: 'redbull',      // Jüri Vips (Red Bull Junior Team)
  ARM: 'ferrari',      // Marcus Armstrong (Ferrari Driver Academy)
  PIA: 'alpine',       // Oscar Piastri (Alpine Academy)
  SHW: 'ferrari',      // Robert Shwartzman (Ferrari Driver Academy)
  ZHO: 'alpine',       // Guanyu Zhou (Alpine Academy)
  TIC: 'williams',     // Dan Ticktum (Williams Driver Academy)
  MSC: 'ferrari',      // Mick Schumacher (Ferrari Driver Academy)
  ILO: 'ferrari',      // Callum Ilott (Ferrari Driver Academy)
  TSU: 'redbull',      // Yuki Tsunoda (Red Bull Junior Team)
  MAZ: 'independent',  // Nikita Mazepin
  LUN: 'alpine',       // Christian Lundgaard (Alpine Academy)
  GHI: 'independent',  // Luca Ghiotto
  DEV: 'mercedes',     // Nyck de Vries (Mercedes Junior / Reserve)
  LAT: 'williams',     // Nicholas Latifi
  AIT: 'williams',     // Jack Aitken (Williams Reserve)
  HUB: 'alpine',       // Anthoine Hubert (Renault Sport Academy)
  RUS: 'mercedes',     // George Russell (Mercedes Junior Team)
  NOR: 'mclaren',      // Lando Norris (McLaren Driver Development)
  ALB: 'redbull',      // Alexander Albon (Red Bull Junior Team)
  ROW: 'williams',     // Oliver Rowland
  FUO: 'ferrari',      // Antonio Fuoco (Ferrari Driver Academy)
  BOR: 'mclaren',      // Gabriel Bortoleto (McLaren Driver Development)
  OSU: 'williams',     // Zak O'Sullivan (Williams Driver Academy)
  ARO: 'mercedes',     // Paul Aron (Mercedes Junior Team)
  HAU: 'redbull',      // Dennis Hauger (Red Bull Junior Team)
  CLT: 'alpine',       // Caio Collet (Alpine Academy)
  VER: 'independent',  // Richard Verschoor
  BOS: 'independent',  // Ralph Boschung
  NOV: 'independent',  // Clément Novalak
  STA: 'independent',  // Roman Staněk
  COR: 'independent',  // Juan Manuel Correa
  CRD: 'independent',  // Amaury Cordeel
  NIS: 'independent',  // Roy Nissany
  COL: 'williams',     // Franco Colapinto (Williams Racing Driver Academy)
  CRA: 'astonmartin',  // Jak Crawford (Aston Martin Driver Development)
};

export interface F1Graduate {
  name: string;
  code: string;
  f2Team: string;
  f1Team: string;
  yearGraduated: number;
  f2Result: string;
  notes: string;
  notesEn: string;
  currentRole: string;
  flag: string;
}

export interface SeasonHistory {
  year: number;
  series: 'f2' | 'f3';
  champion: {
    name: string;
    code: string;
    team: string;
    points: number;
    wins: number;
    flag: string;
    f1Destination?: string;
  };
  runnerUp: {
    name: string;
    team: string;
    points: number;
    flag: string;
  };
  thirdPlace: {
    name: string;
    team: string;
    points: number;
    flag: string;
  };
  keyFact: string;
  keyFactEn: string;
  graduatesToF1?: F1Graduate[];
}

export const F2_HISTORICAL_SEASONS: SeasonHistory[] = [
  {
    year: 2026,
    series: 'f2',
    champion: {
      name: 'Nikola Tsolov',
      code: 'TSO',
      team: 'Campos Racing',
      points: 187,
      wins: 4,
      flag: '🇧🇬',
      f1Destination: 'Red Bull Junior Team',
    },
    runnerUp: {
      name: 'Rafael Câmara',
      team: 'Invicta Racing',
      points: 187,
      flag: '🇧🇷',
    },
    thirdPlace: {
      name: 'Alex Dunne',
      team: 'Rodin Motorsport',
      points: 158,
      flag: '🇮🇪',
    },
    keyFact: 'Temporada 2026 en plena disputa: empate histórico en 187 puntos entre Tsolov y Câmara en la cima, con las academias de Red Bull, Ferrari y McLaren en lucha abierta por la Superlicencia FIA.',
    keyFactEn: '2026 Season currently in progress: historic tie at 187 points between Tsolov and Câmara at the summit, with Red Bull, Ferrari, and McLaren academies battling for FIA Super License honors.',
    graduatesToF1: [
      {
        name: 'Arvid Lindblad',
        code: 'LIN',
        f2Team: 'Campos Racing',
        f1Team: 'Visa Cash App Racing Bulls',
        yearGraduated: 2026,
        f2Result: 'Graduado a F1',
        notes: 'El talento británico del Red Bull Junior Team asciende a piloto titular de Fórmula 1 en 2026.',
        notesEn: 'British prodigy from Red Bull Junior Team promoted to full-time Formula 1 race seat in 2026.',
        currentRole: 'Piloto Titular F1',
        flag: '🇬🇧',
      },
      {
        name: 'Gabriel Bortoleto',
        code: 'BOR',
        f2Team: 'Invicta Racing',
        f1Team: 'Kick Sauber / Audi F1',
        yearGraduated: 2026,
        f2Result: 'Campeón F2',
        notes: 'Debuta como titular en F1 para liderar el proyecto Audi de la mano de Sauber.',
        notesEn: 'Debuting as full-time F1 driver leading the Audi project with Sauber.',
        currentRole: 'Piloto Titular F1',
        flag: '🇧🇷',
      },
      {
        name: 'Andrea Kimi Antonelli',
        code: 'ANT',
        f2Team: 'PREMA Racing',
        f1Team: 'Mercedes-AMG F1',
        yearGraduated: 2026,
        f2Result: 'Graduado a F1',
        notes: 'Sucesor directo de Lewis Hamilton al volante de las Flechas Plateadas de Mercedes.',
        notesEn: 'Direct successor to Lewis Hamilton driving for Mercedes-AMG Silver Arrows.',
        currentRole: 'Piloto Titular F1',
        flag: '🇮🇹',
      },
      {
        name: 'Franco Colapinto',
        code: 'COL',
        f2Team: 'MP Motorsport',
        f1Team: 'Williams Racing / Alpine',
        yearGraduated: 2024,
        f2Result: 'Ganador en Imola / 5º',
        notes: 'Consagrado en la élite de F1 tras sus memorables actuaciones con Williams y Alpine.',
        notesEn: 'Established in the F1 elite after memorable performances with Williams and Alpine.',
        currentRole: 'Piloto Titular F1',
        flag: '🇦🇷',
      },
      {
        name: 'Oliver Bearman',
        code: 'BEA',
        f2Team: 'PREMA Racing',
        f1Team: 'MoneyGram Haas F1',
        yearGraduated: 2025,
        f2Result: 'Graduado a F1',
        notes: 'Piloto titular de Haas F1 tras sus impresionantes sustituciones con Ferrari y Haas.',
        notesEn: 'Full-time Haas F1 driver after dazzling stand-in drives for Ferrari and Haas.',
        currentRole: 'Piloto Titular F1',
        flag: '🇬🇧',
      },
      {
        name: 'Isack Hadjar',
        code: 'HAD',
        f2Team: 'Campos Racing',
        f1Team: 'Visa Cash App Racing Bulls',
        yearGraduated: 2025,
        f2Result: 'Subcampeón F2',
        notes: 'Promovido por Helmut Marko al segundo asiento titular de Racing Bulls en F1.',
        notesEn: 'Promoted by Helmut Marko to the second race seat at Racing Bulls F1.',
        currentRole: 'Piloto Titular F1',
        flag: '🇫🇷',
      },
    ],
  },
  {
    year: 2025,
    series: 'f2',
    champion: {
      name: 'Leonardo Fornaroli',
      code: 'FOR',
      team: 'Invicta Racing',
      points: 208,
      wins: 3,
      flag: '🇮🇹',
      f1Destination: 'McLaren F1 Reserve & Test Driver',
    },
    runnerUp: {
      name: 'Gabriele Minì',
      team: 'PREMA Racing',
      points: 186,
      flag: '🇮🇹',
    },
    thirdPlace: {
      name: 'Luke Browning',
      team: 'Hitech Pulse-Eight',
      points: 164,
      flag: '🇬🇧',
    },
    keyFact: 'Leonardo Fornaroli logra el doblete consecutivo F3 (2024) y F2 (2025) con Invicta Racing, mientras Arvid Lindblad se gana el asiento de F1 2026 con Racing Bulls.',
    keyFactEn: 'Leonardo Fornaroli secures consecutive titles in F3 (2024) and F2 (2025) with Invicta, as Arvid Lindblad seals his 2026 F1 race seat with Racing Bulls.',
    graduatesToF1: [
      {
        name: 'Leonardo Fornaroli',
        code: 'FOR',
        f2Team: 'Invicta Racing',
        f1Team: 'McLaren F1',
        yearGraduated: 2026,
        f2Result: 'Campeón F2',
        notes: 'Piloto de pruebas y reserva oficial de McLaren F1.',
        notesEn: 'Official test and reserve driver for McLaren F1.',
        currentRole: 'Piloto Reserva F1',
        flag: '🇮🇹',
      },
      {
        name: 'Arvid Lindblad',
        code: 'LIN',
        f2Team: 'Campos Racing',
        f1Team: 'Visa Cash App Racing Bulls',
        yearGraduated: 2026,
        f2Result: '5º en F2 (2 victorias)',
        notes: 'Ganador de múltiples carreras en su año de novato antes de su debut en F1 2026.',
        notesEn: 'Multiple race winner in his rookie F2 campaign before making 2026 F1 debut.',
        currentRole: 'Piloto Titular F1',
        flag: '🇬🇧',
      },
      {
        name: 'Gabriele Minì',
        code: 'MIN',
        f2Team: 'PREMA Racing',
        f1Team: 'Alpine F1',
        yearGraduated: 2026,
        f2Result: 'Subcampeón F2',
        notes: 'Subcampeón de F2 y piloto de desarrollo principal de Alpine Academy.',
        notesEn: 'F2 runner-up and principal development driver for Alpine Academy.',
        currentRole: 'Piloto Reserva F1',
        flag: '🇮🇹',
      },
    ],
  },
  {
    year: 2024,
    series: 'f2',
    champion: {
      name: 'Gabriel Bortoleto',
      code: 'BOR',
      team: 'Invicta Racing',
      points: 214.5,
      wins: 2,
      flag: '🇧🇷',
      f1Destination: 'Kick Sauber / Audi F1',
    },
    runnerUp: {
      name: 'Isack Hadjar',
      team: 'Campos Racing',
      points: 198.5,
      flag: '🇫🇷',
    },
    thirdPlace: {
      name: 'Paul Aron',
      team: 'Hitech Pulse-Eight',
      points: 168,
      flag: '🇪🇪',
    },
    keyFact: 'Una de las temporadas más influyentes de la historia: cinco pilotos de la parrilla saltaron directamente a asientos titulares en la Fórmula 1.',
    keyFactEn: 'One of the most impactful seasons in junior history: five drivers from the grid secured full-time race seats in Formula 1.',
    graduatesToF1: [
      {
        name: 'Gabriel Bortoleto',
        code: 'BOR',
        f2Team: 'Invicta Racing',
        f1Team: 'Kick Sauber / Audi',
        yearGraduated: 2025,
        f2Result: 'Campeón F2',
        notes: 'Bicampeón consecutivo debutante de F3 (2023) y F2 (2024).',
        notesEn: 'Back-to-back rookie Champion in F3 (2023) and F2 (2024).',
        currentRole: 'Piloto Titular F1',
        flag: '🇧🇷',
      },
      {
        name: 'Franco Colapinto',
        code: 'COL',
        f2Team: 'MP Motorsport',
        f1Team: 'Williams Racing / Alpine',
        yearGraduated: 2024,
        f2Result: 'Ganador en Imola / 5º',
        notes: 'Debut sensacional en F1 en Monza sumando puntos inmediatos para Williams.',
        notesEn: 'Sensational F1 debut in Monza scoring immediate points for Williams.',
        currentRole: 'Piloto Titular F1',
        flag: '🇦🇷',
      },
      {
        name: 'Andrea Kimi Antonelli',
        code: 'ANT',
        f2Team: 'PREMA Racing',
        f1Team: 'Mercedes-AMG',
        yearGraduated: 2025,
        f2Result: 'Ganador Sprint & Feature',
        notes: 'Prodigio de Mercedes ascendido como sustituto directo de Lewis Hamilton.',
        notesEn: 'Mercedes prodigy promoted as Lewis Hamilton\'s successor.',
        currentRole: 'Piloto Titular F1',
        flag: '🇮🇹',
      },
      {
        name: 'Oliver Bearman',
        code: 'BEA',
        f2Team: 'PREMA Racing',
        f1Team: 'MoneyGram Haas F1',
        yearGraduated: 2025,
        f2Result: 'Ganador de carreras',
        notes: 'Brilló al sustituir a Carlos Sainz en Ferrari (P7 en Jeddah) y a Kevin Magnussen en Haas.',
        notesEn: 'Stunned with Ferrari subbing for Carlos Sainz (P7 in Jeddah) and Haas.',
        currentRole: 'Piloto Titular F1',
        flag: '🇬🇧',
      },
      {
        name: 'Isack Hadjar',
        code: 'HAD',
        f2Team: 'Campos Racing',
        f1Team: 'Racing Bulls / Red Bull',
        yearGraduated: 2025,
        f2Result: 'Subcampeón F2 (4 victorias)',
        notes: 'Subcampeón destacado de Red Bull Junior Team promovido a la F1.',
        notesEn: 'Star Red Bull Junior Team runner-up promoted to F1.',
        currentRole: 'Piloto Titular F1',
        flag: '🇫🇷',
      },
    ],
  },
  {
    year: 2023,
    series: 'f2',
    champion: {
      name: 'Théo Pourchaire',
      code: 'POU',
      team: 'ART Grand Prix',
      points: 203,
      wins: 1,
      flag: '🇫🇷',
      f1Destination: 'Sauber F1 Reserve / Super Formula',
    },
    runnerUp: {
      name: 'Frederik Vesti',
      team: 'PREMA Racing',
      points: 192,
      flag: '🇩🇰',
    },
    thirdPlace: {
      name: 'Jack Doohan',
      team: 'Invicta Virtuosi',
      points: 168,
      flag: '🇦🇺',
    },
    keyFact: 'Pourchaire se consagró campeón tras 3 años en ART con una constancia quirúrgica.',
    keyFactEn: 'Pourchaire captured the title after 3 seasons with ART through clinical consistency.',
    graduatesToF1: [
      {
        name: 'Jack Doohan',
        code: 'DOO',
        f2Team: 'Invicta Virtuosi',
        f1Team: 'Alpine F1 Team',
        yearGraduated: 2025,
        f2Result: '3º en F2 (3 victorias)',
        notes: 'Piloto reserva de Alpine ascendido a la butaca titular.',
        notesEn: 'Alpine reserve driver promoted to full-time race seat.',
        currentRole: 'Piloto Titular F1',
        flag: '🇦🇺',
      },
    ],
  },
  {
    year: 2022,
    series: 'f2',
    champion: {
      name: 'Felipe Drugovich',
      code: 'DRU',
      team: 'MP Motorsport',
      points: 265,
      wins: 5,
      flag: '🇧🇷',
      f1Destination: 'Aston Martin F1 Reserve',
    },
    runnerUp: {
      name: 'Théo Pourchaire',
      team: 'ART Grand Prix',
      points: 164,
      flag: '🇫🇷',
    },
    thirdPlace: {
      name: 'Liam Lawson',
      team: 'Carlin',
      points: 149,
      flag: '🇳🇿',
    },
    keyFact: 'Drugovich arrasó con una ventaja récord de 101 puntos consagrándose en Monza.',
    keyFactEn: 'Drugovich dominated the field with a record 101-point margin, sealing the crown at Monza.',
    graduatesToF1: [
      {
        name: 'Logan Sargeant',
        code: 'SAR',
        f2Team: 'Carlin',
        f1Team: 'Williams Racing',
        yearGraduated: 2023,
        f2Result: '4º en F2 (Rookie del Año)',
        notes: 'Obtuvo la Superlicencia en Abu Dhabi y disputó dos temporadas en Williams.',
        notesEn: 'Secured Super License at Abu Dhabi finale, completing two seasons at Williams.',
        currentRole: 'Ex-Piloto F1',
        flag: '🇺🇸',
      },
      {
        name: 'Liam Lawson',
        code: 'LAW',
        f2Team: 'Carlin',
        f1Team: 'Racing Bulls / Red Bull',
        yearGraduated: 2023,
        f2Result: '3º en F2',
        notes: 'Debutó sumando puntos en Singapur 2023 y se consolidó en la grilla titular de F1.',
        notesEn: 'Points-scoring debut in Singapore 2023, now an established F1 regular.',
        currentRole: 'Piloto Titular F1',
        flag: '🇳🇿',
      },
    ],
  },
  {
    year: 2021,
    series: 'f2',
    champion: {
      name: 'Oscar Piastri',
      code: 'PIA',
      team: 'PREMA Racing',
      points: 252.5,
      wins: 6,
      flag: '🇦🇺',
      f1Destination: 'McLaren F1 Team',
    },
    runnerUp: {
      name: 'Robert Shwartzman',
      team: 'PREMA Racing',
      points: 192,
      flag: '🇮🇱',
    },
    thirdPlace: {
      name: 'Zhou Guanyu',
      team: 'UNI-Virtuosi',
      points: 183,
      flag: '🇨🇳',
    },
    keyFact: 'Oscar Piastri logró la hazaña histórica de ganar la Fórmula Renault, F3 y F2 de manera consecutiva en sus temporadas como debutante.',
    keyFactEn: 'Oscar Piastri completed the historic triple: Formula Renault, F3, and F2 Champion all in consecutive rookie campaigns.',
    graduatesToF1: [
      {
        name: 'Oscar Piastri',
        code: 'PIA',
        f2Team: 'PREMA Racing',
        f1Team: 'McLaren F1 Team',
        yearGraduated: 2023,
        f2Result: 'Campeón F2 (6 victorias)',
        notes: 'Ganador múltiple de Grandes Premios de F1 y podios para McLaren.',
        notesEn: 'Multiple Grand Prix winner and podium finisher with McLaren.',
        currentRole: 'Piloto Estrella F1',
        flag: '🇦🇺',
      },
      {
        name: 'Zhou Guanyu',
        code: 'ZHO',
        f2Team: 'UNI-Virtuosi',
        f1Team: 'Alfa Romeo / Sauber',
        yearGraduated: 2022,
        f2Result: '3º en F2 (4 victorias)',
        notes: 'Primer piloto chino en la historia de la Fórmula 1, sumando puntos en su debut.',
        notesEn: 'First Chinese driver in Formula 1 history, scoring points on debut.',
        currentRole: 'Ex-Piloto F1 / Reserva',
        flag: '🇨🇳',
      },
    ],
  },
  {
    year: 2020,
    series: 'f2',
    champion: {
      name: 'Mick Schumacher',
      code: 'MSC',
      team: 'PREMA Racing',
      points: 215,
      wins: 2,
      flag: '🇩🇪',
      f1Destination: 'Haas F1 Team',
    },
    runnerUp: {
      name: 'Callum Ilott',
      team: 'UNI-Virtuosi',
      points: 201,
      flag: '🇬🇧',
    },
    thirdPlace: {
      name: 'Yuki Tsunoda',
      team: 'Carlin',
      points: 200,
      flag: '🇯🇵',
    },
    keyFact: 'Mick Schumacher devolvió el célebre apellido a lo más alto en Sakhir con un duelo vibrante frente a Ilott y Tsunoda.',
    keyFactEn: 'Mick Schumacher took the historic name to the summit at Sakhir in a dramatic title showdown.',
    graduatesToF1: [
      {
        name: 'Yuki Tsunoda',
        code: 'TSU',
        f2Team: 'Carlin',
        f1Team: 'AlphaTauri / Racing Bulls',
        yearGraduated: 2021,
        f2Result: '3º en F2 (Rookie del Año)',
        notes: 'Ascenso supersónico desde la F4 japonesa hasta consolidarse en F1.',
        notesEn: 'Meteoric rise from Japanese F4 to become an established F1 talent.',
        currentRole: 'Piloto Titular F1',
        flag: '🇯🇵',
      },
    ],
  },
  {
    year: 2019,
    series: 'f2',
    champion: {
      name: 'Nyck de Vries',
      code: 'DEV',
      team: 'ART Grand Prix',
      points: 266,
      wins: 4,
      flag: '🇳🇱',
      f1Destination: 'Williams / AlphaTauri',
    },
    runnerUp: {
      name: 'Nicholas Latifi',
      team: 'DAMS',
      points: 214,
      flag: '🇨🇦',
    },
    thirdPlace: {
      name: 'Luca Ghiotto',
      team: 'UNI-Virtuosi',
      points: 207,
      flag: '🇮🇹',
    },
    keyFact: 'Nyck de Vries se coronó campeón en Sochi de forma contundente con ART Grand Prix tras una campaña de 4 victorias y regularidad impecable.',
    keyFactEn: 'Nyck de Vries clinched the championship in commanding style at Sochi for ART Grand Prix after a four-win, supremely consistent campaign.',
    graduatesToF1: [
      {
        name: 'Nicholas Latifi',
        code: 'LAT',
        f2Team: 'DAMS',
        f1Team: 'Williams Racing',
        yearGraduated: 2020,
        f2Result: 'Subcampeón F2 (4 victorias)',
        notes: 'Graduado a Williams Racing, donde compitió durante tres temporadas de F1.',
        notesEn: 'Graduated to Williams Racing, competing across three full F1 seasons.',
        currentRole: 'Ex-Piloto F1',
        flag: '🇨🇦',
      },
      {
        name: 'Nyck de Vries',
        code: 'DEV',
        f2Team: 'ART Grand Prix',
        f1Team: 'Williams / AlphaTauri',
        yearGraduated: 2022,
        f2Result: 'Campeón F2',
        notes: 'Debut heroico en Monza sumando puntos antes de fichar por AlphaTauri.',
        notesEn: 'Heroic points finish on Monza debut before signing with AlphaTauri.',
        currentRole: 'Ex-Piloto F1',
        flag: '🇳🇱',
      },
    ],
  },
  {
    year: 2018,
    series: 'f2',
    champion: {
      name: 'George Russell',
      code: 'RUS',
      team: 'ART Grand Prix',
      points: 287,
      wins: 7,
      flag: '🇬🇧',
      f1Destination: 'Williams / Mercedes-AMG',
    },
    runnerUp: {
      name: 'Lando Norris',
      team: 'Carlin',
      points: 219,
      flag: '🇬🇧',
    },
    thirdPlace: {
      name: 'Alexander Albon',
      team: 'DAMS',
      points: 212,
      flag: '🇹🇭',
    },
    keyFact: 'Considerada la generación dorada de la F2: los tres primeros del campeonato son hoy figuras consolidadas y ganadores de carreras en la Fórmula 1.',
    keyFactEn: 'Widely hailed as F2\'s golden generation: the top 3 finishers are now premier Formula 1 winners and leaders.',
    graduatesToF1: [
      {
        name: 'George Russell',
        code: 'RUS',
        f2Team: 'ART Grand Prix',
        f1Team: 'Mercedes-AMG',
        yearGraduated: 2019,
        f2Result: 'Campeón F2 (7 victorias)',
        notes: 'Ganador de Grandes Premios de F1 y líder de Mercedes.',
        notesEn: 'Grand Prix winner and leader of Mercedes-AMG.',
        currentRole: 'Piloto Estrella F1',
        flag: '🇬🇧',
      },
      {
        name: 'Lando Norris',
        code: 'NOR',
        f2Team: 'Carlin',
        f1Team: 'McLaren F1 Team',
        yearGraduated: 2019,
        f2Result: 'Subcampeón F2',
        notes: 'Polesitter y ganador de Grandes Premios peleando por el Campeonato Mundial de F1.',
        notesEn: 'Polesitter and Grand Prix winner contending for the F1 World Championship.',
        currentRole: 'Piloto Estrella F1',
        flag: '🇬🇧',
      },
      {
        name: 'Alexander Albon',
        code: 'ALB',
        f2Team: 'DAMS',
        f1Team: 'Williams Racing',
        yearGraduated: 2019,
        f2Result: '3º en F2 (4 victorias)',
        notes: 'Múltiples podios en Red Bull Racing y líder indiscutido de Williams Racing.',
        notesEn: 'Multiple podium finisher at Red Bull Racing and team leader at Williams.',
        currentRole: 'Piloto Titular F1',
        flag: '🇹🇭',
      },
    ],
  },
  {
    year: 2017,
    series: 'f2',
    champion: {
      name: 'Charles Leclerc',
      code: 'LEC',
      team: 'PREMA Racing',
      points: 282,
      wins: 8,
      flag: '🇲🇨',
      f1Destination: 'Alfa Romeo / Ferrari',
    },
    runnerUp: {
      name: 'Artem Markelov',
      team: 'Russian Time',
      points: 210,
      flag: '🇷🇺',
    },
    thirdPlace: {
      name: 'Oliver Rowland',
      team: 'DAMS',
      points: 191,
      flag: '🇬🇧',
    },
    keyFact: 'Charles Leclerc firmó la campaña más dominante de un debutante en la era moderna de la categoría con 8 victorias y 8 poles consecutivas.',
    keyFactEn: 'Charles Leclerc delivered the most dominant rookie campaign in modern history with 8 wins and 8 consecutive poles.',
    graduatesToF1: [
      {
        name: 'Charles Leclerc',
        code: 'LEC',
        f2Team: 'PREMA Racing',
        f1Team: 'Scuderia Ferrari',
        yearGraduated: 2018,
        f2Result: 'Campeón F2 (8 victorias, 8 poles)',
        notes: 'Ganador en Monza, Mónaco, Spa y subcampeón mundial de Fórmula 1.',
        notesEn: 'Winner at Monza, Monaco, Spa and Formula 1 World Vice-Champion.',
        currentRole: 'Piloto Estrella Ferrari',
        flag: '🇲🇨',
      },
    ],
  },
];

export const F3_HISTORICAL_SEASONS: SeasonHistory[] = [
  {
    year: 2026,
    series: 'f3',
    champion: {
      name: 'Freddie Slater',
      code: 'SLA',
      team: 'Trident',
      points: 182,
      wins: 3,
      flag: '🇬🇧',
      f1Destination: 'Líder F3 • Candidato F2 / F1',
    },
    runnerUp: {
      name: 'Théophile Naël',
      team: 'Campos Racing',
      points: 154,
      flag: '🇫🇷',
    },
    thirdPlace: {
      name: 'Ugo Ugochukwu',
      team: 'Campos Racing',
      points: 139,
      flag: '🇺🇸',
    },
    keyFact: 'Temporada 2026 en curso: Freddie Slater (Audi/Sauber) lidera la F3 frente al asalto de las academias Red Bull (Rivera, Colnaghi, Deligny), Ferrari (Taponen), Mercedes (Powell), Williams (Giusti) y McLaren (Ugochukwu, Badoer).',
    keyFactEn: '2026 Season in progress: Freddie Slater (Audi/Sauber) leads F3 against top academy talents from Red Bull (Rivera, Colnaghi, Deligny), Ferrari (Taponen), Mercedes (Powell), Williams (Giusti) and McLaren (Ugochukwu, Badoer).',
    graduatesToF1: [
      {
        name: 'Freddie Slater',
        code: 'SLA',
        f2Team: 'Trident',
        f1Team: 'Audi Driver Development / Sauber',
        yearGraduated: 2026,
        f2Result: 'Líder F3 2026',
        notes: 'Dominador de la primera mitad del certamen con 3 victorias para Trident.',
        notesEn: 'Three-time winner dominating the first half of the 2026 championship.',
        currentRole: 'Audi / Sauber Junior',
        flag: '🇬🇧',
      },
      {
        name: 'Ernesto Rivera',
        code: 'RIV',
        f2Team: 'Campos Racing',
        f1Team: 'Red Bull Junior Team',
        yearGraduated: 2026,
        f2Result: 'Ganador en F3',
        notes: 'Talento mexicano de Helmut Marko sumando podios y victorias en su año de debut.',
        notesEn: 'Mexican Red Bull talent claiming podiums and wins in his debut season.',
        currentRole: 'Red Bull Junior',
        flag: '🇲🇽',
      },
      {
        name: 'Alex Powell',
        code: 'POW',
        f2Team: 'PREMA Racing',
        f1Team: 'Mercedes Junior Team',
        yearGraduated: 2026,
        f2Result: 'Top 10 F3',
        notes: 'Protegido de Mercedes-AMG F1 desplegando gran ritmo de carrera con PREMA.',
        notesEn: 'Mercedes-AMG F1 protégé showing strong race craft with PREMA.',
        currentRole: 'Mercedes Junior',
        flag: '🇯🇲',
      },
      {
        name: 'Tuukka Taponen',
        code: 'TAP',
        f2Team: 'MP Motorsport',
        f1Team: 'Ferrari Driver Academy',
        yearGraduated: 2026,
        f2Result: 'Ganador en F3',
        notes: 'Finés volador de Ferrari Driver Academy con brillante victoria en lluvia.',
        notesEn: 'Flying Finn of the Ferrari Driver Academy with brilliant wet-weather victory.',
        currentRole: 'Ferrari Junior',
        flag: '🇫🇮',
      },
      {
        name: 'Alessandro Giusti',
        code: 'GIU',
        f2Team: 'MP Motorsport',
        f1Team: 'Williams Racing Driver Academy',
        yearGraduated: 2026,
        f2Result: 'Ganador en F3',
        notes: 'Promesa francesa del programa de jóvenes pilotos de Williams.',
        notesEn: 'French talent from Williams Racing Driver Academy.',
        currentRole: 'Williams Junior',
        flag: '🇫🇷',
      },
      {
        name: 'Ugo Ugochukwu',
        code: 'UGO',
        f2Team: 'Campos Racing',
        f1Team: 'McLaren Driver Development',
        yearGraduated: 2026,
        f2Result: 'Top 3 F3',
        notes: 'Ganador del GP de Macao y puntal de McLaren en el certamen.',
        notesEn: 'Macau GP winner and McLaren Driver Development star in F3.',
        currentRole: 'McLaren Junior',
        flag: '🇺🇸',
      },
    ],
  },
  {
    year: 2025,
    series: 'f3',
    champion: {
      name: 'Rafael Câmara',
      code: 'CAM',
      team: 'Trident',
      points: 176,
      wins: 4,
      flag: '🇧🇷',
      f1Destination: 'Ferrari Driver Academy -> Ascenso a F2 Invicta 2026',
    },
    runnerUp: {
      name: 'Tim Tramnitz',
      team: 'MP Motorsport',
      points: 148,
      flag: '🇩🇪',
    },
    thirdPlace: {
      name: 'Nikola Tsolov',
      team: 'Campos Racing',
      points: 142,
      flag: '🇧🇬',
    },
    keyFact: 'Rafael Câmara conquista el título de F3 con 4 victorias contundentes para Trident, ganándose su promoción inmediata a la F2 2026 con Invicta Racing.',
    keyFactEn: 'Rafael Câmara claims the F3 crown with 4 commanding victories for Trident, earning his immediate promotion to F2 2026 with Invicta Racing.',
    graduatesToF1: [
      {
        name: 'Rafael Câmara',
        code: 'CAM',
        f2Team: 'Trident',
        f1Team: 'Ferrari Driver Academy',
        yearGraduated: 2025,
        f2Result: 'Campeón F3',
        notes: 'Campeón F3 2025 y promovido a Invicta Racing en F2 para 2026.',
        notesEn: 'F3 2025 Champion promoted to Invicta Racing in F2 for 2026.',
        currentRole: 'Piloto F2 Invicta',
        flag: '🇧🇷',
      },
      {
        name: 'Nikola Tsolov',
        code: 'TSO',
        f2Team: 'Campos Racing',
        f1Team: 'Red Bull Junior Team',
        yearGraduated: 2025,
        f2Result: '3º en F3 (3 victorias)',
        notes: 'El "León Búlgaro" salta a la F2 con Campos para liderar el certamen 2026.',
        notesEn: 'The "Bulgarian Lion" steps up to F2 with Campos to lead the 2026 championship.',
        currentRole: 'Piloto F2 Campos',
        flag: '🇧🇬',
      },
      {
        name: 'Tim Tramnitz',
        code: 'TRA',
        f2Team: 'MP Motorsport',
        f1Team: 'Red Bull Junior Team',
        yearGraduated: 2025,
        f2Result: 'Subcampeón F3',
        notes: 'Asciende a F2 tras luchar el título hasta la fecha decisiva.',
        notesEn: 'Steps up to F2 after contending for the title down to the finale.',
        currentRole: 'Piloto F2 MP',
        flag: '🇩🇪',
      },
    ],
  },
  {
    year: 2024,
    series: 'f3',
    champion: {
      name: 'Leonardo Fornaroli',
      code: 'FOR',
      team: 'Trident',
      points: 153,
      wins: 0,
      flag: '🇮🇹',
      f1Destination: 'F2 Invicta / McLaren Development',
    },
    runnerUp: {
      name: 'Gabriele Minì',
      team: 'PREMA Racing',
      points: 151,
      flag: '🇮🇹',
    },
    thirdPlace: {
      name: 'Luke Browning',
      team: 'Hitech Pulse-Eight',
      points: 128,
      flag: '🇬🇧',
    },
    keyFact: 'Fornaroli se consagró con un adelantamiento milagroso en la última curva de Monza, ganando el campeonato por 2 puntos con pura regularidad.',
    keyFactEn: 'Fornaroli clinched the title on the final corner of Monza with a heroic pass, winning the crown through supreme consistency.',
  },
  {
    year: 2023,
    series: 'f3',
    champion: {
      name: 'Gabriel Bortoleto',
      code: 'BOR',
      team: 'Trident',
      points: 164,
      wins: 2,
      flag: '🇧🇷',
      f1Destination: 'F2 Champion -> Kick Sauber F1',
    },
    runnerUp: {
      name: 'Zak O\'Sullivan',
      team: 'PREMA Racing',
      points: 119,
      flag: '🇬🇧',
    },
    thirdPlace: {
      name: 'Paul Aron',
      team: 'PREMA Racing',
      points: 112,
      flag: '🇪🇪',
    },
    keyFact: 'Bortoleto lideró la tabla desde la primera fecha en Bahrein con una ventaja de 45 puntos antes de dar el salto a ganar la F2.',
    keyFactEn: 'Bortoleto led from Round 1 in Bahrain with a 45-point buffer before moving up to conquer F2.',
  },
  {
    year: 2022,
    series: 'f3',
    champion: {
      name: 'Victor Martins',
      code: 'MAR',
      team: 'ART Grand Prix',
      points: 139,
      wins: 2,
      flag: '🇫🇷',
      f1Destination: 'F2 ART / Alpine Academy',
    },
    runnerUp: {
      name: 'Zane Maloney',
      team: 'Trident',
      points: 134,
      flag: '🇧🇧',
    },
    thirdPlace: {
      name: 'Oliver Bearman',
      team: 'PREMA Racing',
      points: 132,
      flag: '🇬🇧',
    },
    keyFact: 'Final de infarto en Monza con 7 pilotos con chances matemáticas de campeonato hasta la última vuelta.',
    keyFactEn: 'Heart-stopping Monza finale where 7 drivers held mathematical chances of the title until the checkered flag.',
  },
  {
    year: 2021,
    series: 'f3',
    champion: {
      name: 'Dennis Hauger',
      code: 'HAU',
      team: 'PREMA Racing',
      points: 205,
      wins: 4,
      flag: '🇳🇴',
      f1Destination: 'F2 MP Motorsport / Red Bull',
    },
    runnerUp: {
      name: 'Jack Doohan',
      team: 'Trident',
      points: 179,
      flag: '🇦🇺',
    },
    thirdPlace: {
      name: 'Clément Novalak',
      team: 'Trident',
      points: 147,
      flag: '🇫🇷',
    },
    keyFact: 'El noruego dominó el certamen con 9 podios y 4 victorias para la escudería PREMA.',
    keyFactEn: 'The Norwegian dominated the season with 9 podiums and 4 race victories for PREMA.',
  },
  {
    year: 2020,
    series: 'f3',
    champion: {
      name: 'Oscar Piastri',
      code: 'PIA',
      team: 'PREMA Racing',
      points: 164,
      wins: 2,
      flag: '🇦🇺',
      f1Destination: 'F2 Champion -> McLaren F1',
    },
    runnerUp: {
      name: 'Théo Pourchaire',
      team: 'ART Grand Prix',
      points: 161,
      flag: '🇫🇷',
    },
    thirdPlace: {
      name: 'Logan Sargeant',
      team: 'PREMA Racing',
      points: 160,
      flag: '🇺🇸',
    },
    keyFact: 'Definición dramática en Mugello: apenas 4 puntos separaron a los tres primeros del campeonato (Piastri, Pourchaire y Sargeant).',
    keyFactEn: 'Dramatic Mugello finale: just 4 points separated the top 3 drivers in the championship.',
  },
  {
    year: 2019,
    series: 'f3',
    champion: {
      name: 'Robert Shwartzman',
      code: 'SHW',
      team: 'PREMA Racing',
      points: 212,
      wins: 3,
      flag: '🇷🇺',
      f1Destination: 'Ferrari F1 Reserve & IndyCar',
    },
    runnerUp: {
      name: 'Marcus Armstrong',
      team: 'PREMA Racing',
      points: 158,
      flag: '🇳🇿',
    },
    thirdPlace: {
      name: 'Jehan Daruvala',
      team: 'PREMA Racing',
      points: 157,
      flag: '🇮🇳',
    },
    keyFact: 'Temporada inaugural de la FIA Fórmula 3 moderna: PREMA Racing copó el podio completo del certamen con Shwartzman, Armstrong y Daruvala.',
    keyFactEn: 'Inaugural season of modern FIA Formula 3: PREMA Racing locked out the entire championship podium with Shwartzman, Armstrong, and Daruvala.',
    graduatesToF1: [
      {
        name: 'Yuki Tsunoda',
        code: 'TSU',
        f2Team: 'Jenzer Motorsport',
        f1Team: 'AlphaTauri / Racing Bulls',
        yearGraduated: 2021,
        f2Result: '9º en F3 (1 victoria en Monza)',
        notes: 'Victoria estelar con Jenzer en Monza que catapultó su carrera hacia la F1.',
        notesEn: 'Stellar win with Jenzer at Monza launching his trajectory toward F1.',
        currentRole: 'Piloto Titular F1',
        flag: '🇯🇵',
      },
      {
        name: 'Liam Lawson',
        code: 'LAW',
        f2Team: 'MP Motorsport',
        f1Team: 'Racing Bulls / Red Bull',
        yearGraduated: 2023,
        f2Result: '11º en F3 (2 podios)',
        notes: 'Destacada actuación en su primer año europeo con MP Motorsport.',
        notesEn: 'Impressive rookie European campaign with MP Motorsport.',
        currentRole: 'Piloto Titular F1',
        flag: '🇳🇿',
      },
    ],
  },
];

export interface TechSpecsData {
  series: 'f2' | 'f3';
  chassis: string;
  engine: string;
  power: string;
  weight: string;
  topSpeed: string;
  acceleration: string;
  brakes: string;
  gearbox: string;
  tires: string;
  weekendFormat: {
    qualifying: string;
    sprintRace: string;
    featureRace: string;
  };
  pointsSystem: {
    pole: string;
    sprint: string;
    feature: string;
    fastestLap: string;
  };
  superlicense: string;
}

export const TECH_SPECS: Record<'f2' | 'f3', TechSpecsData> = {
  f2: {
    series: 'f2',
    chassis: 'Dallara F2 2024 (Específico, monomarca FIA)',
    engine: 'Mecachrome 3.4L V6 Single-Turbocharged (Combustible 55% sostenible)',
    power: '620 CV @ 8.750 RPM',
    weight: '795 kg (mínimo con piloto y fluidos)',
    topSpeed: '335 km/h (Monza aero spec)',
    acceleration: '0 - 100 km/h en 2.9 segundos | 0 - 200 km/h en 6.6 segundos',
    brakes: 'Discos y pastillas Brembo de carbono ventilado (6 pistones)',
    gearbox: 'Hewland secuencial de 6 velocidades con levas al volante',
    tires: 'Pirelli 18 pulgadas (compuestos Prime y Option por fin de semana)',
    weekendFormat: {
      qualifying: 'Sesión única de 30 minutos. El 1º logra la Pole para la Feature del domingo (+2 pts).',
      sprintRace: 'Sábado (120 km o 45 min). Parrilla invertida del Top 10 de clasificación.',
      featureRace: 'Domingo (170 km o 60 min). Parrilla según la clasificación. Parada en boxes obligatoria (usar ambos compuestos).',
    },
    pointsSystem: {
      pole: '2 puntos al autor de la Pole Position en Clasificación.',
      sprint: 'Top 8: 10, 8, 6, 5, 4, 3, 2, 1.',
      feature: 'Top 10 (escala F1): 25, 18, 15, 12, 10, 8, 6, 4, 2, 1.',
      fastestLap: '1 punto por carrera si el piloto finaliza en el Top 10.',
    },
    superlicense: 'El Top 3 del Campeonato recibe 40 puntos FIA (Pase directo automático a la F1). P4: 30 pts, P5: 20 pts, P6: 10 pts, P7: 8 pts, P8: 6 pts, P9: 4 pts, P10: 3 pts.',
  },
  f3: {
    series: 'f3',
    chassis: 'Dallara F3 2025 (Específico, monomarca FIA)',
    engine: 'Mecachrome 3.4L V6 Atmosférico de aspiración natural',
    power: '380 CV @ 8.000 RPM',
    weight: '698 kg (mínimo con piloto y fluidos)',
    topSpeed: '300 km/h (Monza aero spec)',
    acceleration: '0 - 100 km/h en 3.0 segundos | 0 - 200 km/h en 7.7 segundos',
    brakes: 'Discos y pastillas Brembo de acero ranurado',
    gearbox: 'Hewland secuencial de 6 velocidades con levas al volante',
    tires: 'Pirelli 13 pulgadas monomarca (un solo compuesto por fin de semana)',
    weekendFormat: {
      qualifying: 'Sesión única de 30 minutos. El 1º logra la Pole para la Feature del domingo (+2 pts).',
      sprintRace: 'Sábado (40 min). Parrilla invertida del Top 12 de clasificación.',
      featureRace: 'Domingo (45 min). Parrilla según la clasificación. Sin parada en boxes obligatoria.',
    },
    pointsSystem: {
      pole: '2 puntos al autor de la Pole Position en Clasificación.',
      sprint: 'Top 10: 10, 9, 8, 7, 6, 5, 4, 3, 2, 1.',
      feature: 'Top 10 (escala F1): 25, 18, 15, 12, 10, 8, 6, 4, 2, 1.',
      fastestLap: '1 punto por carrera si el piloto finaliza en el Top 10.',
    },
    superlicense: 'El Campeón recibe 30 puntos FIA. P2: 25 pts, P3: 20 pts, P4: 15 pts, P5: 12 pts, P6: 9 pts, P7: 7 pts, P8: 5 pts, P9: 3 pts, P10: 2 pts.',
  },
};
