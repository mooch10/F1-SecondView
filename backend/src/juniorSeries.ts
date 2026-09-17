import type {
  JolpicaConstructorStanding,
  JolpicaDriverStanding,
  JolpicaRace,
  JolpicaRaceResult,
} from './jolpica.js';
import type { DriverChangeAlert, JuniorRaceDetail, JuniorSessionResult } from './types.js';

const FOM_BASE_URL = 'https://api.formula1.com/v2/core-fom-results';
const FOM_API_KEYS: Record<'f2' | 'f3', string> = {
  f2: 'MsEALPOPbzgjZIWE6GmU2O69VKY8zZpi',
  f3: 'gGX8kMJ7NQmaRfrltWE0xrGgHaEfv1Cn',
};

interface FomSession {
  session: string;
  shortName: string;
  description: string;
  startTime: string;
  endTime: string;
  gmtOffset?: string;
  sessionType: string;
  sessionNumber: number;
  state: string;
}

interface FomMeeting {
  circuitOfficialName?: string;
  meetingCountryName: string;
  meetingCountryCode?: string;
  meetingEndDate: string;
  meetingKey: string | number;
  meetingLocation: string;
  meetingName: string;
  meetingOfficialName: string;
  meetingStartDate: string;
  season: string;
  meetingSessions?: FomSession[];
}

interface FomRaceResult {
  completionStatusCode: string;
  racePoints: number;
  version?: string;
  gapToLeader: string;
  gapToPrevious?: string | null;
  lapsBehindLeader?: string;
  positionValue: string;
  positionNumber: string;
  lapsCompleted: string | number;
  raceTime: string;
  racingNumber: string | number;
  driverFirstName: string;
  driverLastName: string;
  driverShortName?: string;
  driverReference?: string;
  driverTLA: string;
  teamName: string;
  displayPosition: string;
  displayTeamName?: string;
  displayTime: string;
  teamColourCode?: string;
}

interface FomDriverStanding {
  position: string;
  displayPosition: string;
  championshipPoints: number;
  driverReference: string;
  driverTLA: string;
  driverFirstName: string;
  driverLastName: string;
  driverShortName: string;
  points?: Array<Array<number | null>>;
}

interface FomConstructorStanding {
  position: string;
  displayPosition: string;
  championshipPoints: number;
  teamName: string;
  teamKey: string;
  teamColourCode?: string;
  points?: Array<Array<number | null>>;
}

export const F2_TEAM_COLORS: Record<string, string> = {
  invicta: '#FFE000',
  campos: '#FF7700',
  mp_motorsport: '#FF8800',
  prema: '#DC0000',
  rodin: '#9333EA',
  hitech: '#D4D4D8',
  art: '#0059B3',
  dams: '#0099FF',
  van_amersfoort: '#EA580C',
  aix: '#0284C7',
  trident: '#2563EB',
};

export const F3_TEAM_COLORS: Record<string, string> = {
  trident: '#2563EB',
  prema: '#DC0000',
  art: '#0059B3',
  campos: '#FF7700',
  hitech: '#D4D4D8',
  mp_motorsport: '#FF8800',
  van_amersfoort: '#EA580C',
  rodin: '#9333EA',
  aix: '#0284C7',
  jenzer: '#16A34A',
};

export const F2_DRIVER_NUMBERS: Record<string, number> = {
  TSO: 20, // Campos
  MON: 21, // Campos
  CAM: 1, // Invicta
  MAI: 2, // Invicta
  DUR: 3, // Invicta / AIX
  MIN: 4, // PREMA
  BOY: 5, // PREMA
  DUN: 6, // Rodin
  BIL: 7, // Rodin
  LEO: 8, // VAR
  VIL: 9, // VAR
  BEG: 10, // DAMS
  FIT: 11, // DAMS
  HOE: 14, // ART
  INT: 15, // ART
  STE: 16, // Trident
  BEN: 17, // Trident
  MIY: 22, // Hitech
  HER: 23, // Hitech
  GOE: 24, // MP
  VAR: 26, // VAR
  YAM: 26, // VAR
  SHI: 27, // AIX
};

export const F3_DRIVER_NUMBERS: Record<string, number> = {
  SLA: 1, // Trident
  STR: 2, // Trident
  UGO: 4, // Campos
  NAE: 5, // Campos
  RIV: 6, // Campos
  BAD: 7, // PREMA
  DEL: 8, // PREMA
  KAT: 10, // ART
  TAP: 11, // ART
  GLA: 12, // ART
  LE: 14, // ART
  YAM: 15, // VAR
  CLE: 16, // VAR
  PIN: 17, // MP
  COL: 18, // MP
  CNG: 18, // MP
  GIU: 19, // MP
  NAK: 20, // Hitech
  WHA: 21, // Hitech
  DAV: 23, // AIX
  SAG: 24, // AIX
  LAC: 25, // DAMS
  POW: 9, // PREMA
  XIE: 26, // DAMS
  HO: 27, // DAMS
  BIL: 27, // Rodin
  ZAG: 28, // DAMS
  SHA: 28, // Rodin
  VOI: 29, // Rodin
  DOM: 13, // VAR
  FOR: 1, // Trident
  BRO: 14, // Hitech
  TRA: 8, // MP
  MAN: 23, // ART
  MEG: 4, // Trident
  DEP: 3, // Trident
};

export function getTeamColor(teamName: string, series: 'f2' | 'f3'): string {
  const normalized = teamName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const palette = series === 'f2' ? F2_TEAM_COLORS : F3_TEAM_COLORS;

  for (const [key, color] of Object.entries(palette)) {
    if (normalized.includes(key)) {
      return color;
    }
  }
  return series === 'f2' ? '#009CDE' : '#E35205';
}

const KNOWN_F2_DRIVER_CHANGES: DriverChangeAlert[] = [
  {
    id: 'f2-2026-fornaroli-camara',
    series: 'f2',
    team: 'Invicta Racing',
    teamColor: '#FFE000',
    carNumber: 1,
    originalDriver: 'Leonardo Fornaroli',
    newDriver: 'Rafael Câmara',
    effectiveRound: 1,
    roundName: 'Melbourne',
    reason: 'Fornaroli asciende a reserva de McLaren F1; Câmara (Campeón F3) debuta en Invicta.',
  },
  {
    id: 'f2-2026-durksen-invicta',
    series: 'f2',
    team: 'Invicta Racing',
    teamColor: '#FFE000',
    carNumber: 2,
    originalDriver: 'Roman Staněk',
    newDriver: 'Joshua Dürksen',
    effectiveRound: 1,
    roundName: 'Melbourne',
    reason:
      'Dürksen llega desde AIX Racing para luchar por victorias; Staněk pasa a Super Formula.',
  },
  {
    id: 'f2-2026-herta-hitech',
    series: 'f2',
    team: 'Hitech Pulse-Eight',
    teamColor: '#D4D4D8',
    carNumber: 11,
    originalDriver: 'Paul Aron',
    newDriver: 'Colton Herta',
    effectiveRound: 1,
    roundName: 'Melbourne',
    reason:
      'Ganador múltiple de IndyCar y tester de Cadillac F1 se incorpora a tiempo completo a F2.',
  },
  {
    id: 'f2-2026-tsolov-campos',
    series: 'f2',
    team: 'Campos Racing',
    teamColor: '#FF7700',
    carNumber: 7,
    originalDriver: 'Isack Hadjar',
    newDriver: 'Nikola Tsolov',
    effectiveRound: 1,
    roundName: 'Melbourne',
    reason: 'El búlgaro de Red Bull Junior Team asciende de F3 y lidera el campeonato de pilotos.',
  },
  {
    id: 'f2-2026-beganovic-dams',
    series: 'f2',
    team: 'DAMS Lucas Oil',
    teamColor: '#0099FF',
    carNumber: 9,
    originalDriver: 'Jak Crawford',
    newDriver: 'Dino Beganovic',
    effectiveRound: 1,
    roundName: 'Melbourne',
    reason: 'Beganovic (Ferrari Driver Academy) pasa de PREMA a liderar la alineación de DAMS.',
  },
  {
    id: 'f2-2026-lindblad-f1',
    series: 'f2',
    team: 'Visa Cash App Racing Bulls',
    teamColor: '#6692FF',
    carNumber: 40,
    originalDriver: 'Liam Lawson',
    newDriver: 'Arvid Lindblad',
    effectiveRound: 1,
    roundName: 'Melbourne',
    reason: 'Graduación oficial a Fórmula 1 como piloto titular de Racing Bulls para 2026.',
  },
  {
    id: 'f2-2026-yamakoshi-var',
    series: 'f2',
    team: 'Van Amersfoort Racing',
    teamColor: '#EA580C',
    carNumber: 26,
    originalDriver: 'Nico Varrone',
    newDriver: 'Hiyu Yamakoshi',
    effectiveRound: 12,
    roundName: 'Bakú',
    reason:
      'Acuerdo mutuo de desvinculación con VAR; Hiyu Yamakoshi asciende desde F3 para completar la temporada 2026.',
  },
];

const KNOWN_F3_DRIVER_CHANGES: DriverChangeAlert[] = [
  {
    id: 'f3-2026-slater-trident',
    series: 'f3',
    team: 'Trident',
    teamColor: '#2563EB',
    carNumber: 5,
    originalDriver: 'Leonardo Fornaroli',
    newDriver: 'Freddie Slater',
    effectiveRound: 1,
    roundName: 'Melbourne',
    reason:
      'El vigente campeón de FRECA debuta con Trident y lidera el campeonato de pilotos 2026.',
  },
  {
    id: 'f3-2026-ugochukwu-campos',
    series: 'f3',
    team: 'Campos Racing',
    teamColor: '#FF7700',
    carNumber: 10,
    originalDriver: 'Oliver Goethe',
    newDriver: 'Ugo Ugochukwu',
    effectiveRound: 1,
    roundName: 'Melbourne',
    reason: 'La joven promesa estadounidense de McLaren Driver Development firma con Campos.',
  },
  {
    id: 'f3-2026-nael-campos',
    series: 'f3',
    team: 'Campos Racing',
    teamColor: '#FF7700',
    carNumber: 11,
    originalDriver: 'Mari Boya',
    newDriver: 'Théophile Naël',
    effectiveRound: 1,
    roundName: 'Melbourne',
    reason: 'El ganador del GP de Macao se une a Campos y suma múltiples victorias este año.',
  },
  {
    id: 'f3-2026-rivera-campos',
    series: 'f3',
    team: 'Campos Racing',
    teamColor: '#FF7700',
    carNumber: 12,
    originalDriver: 'Sebastián Montoya',
    newDriver: 'Ernesto Rivera',
    effectiveRound: 1,
    roundName: 'Melbourne',
    reason: 'El talento mexicano del Red Bull Junior Team sube desde Eurocup-3.',
  },
  {
    id: 'f3-2026-colnaghi-mp',
    series: 'f3',
    team: 'MP Motorsport',
    teamColor: '#FF8800',
    carNumber: 7,
    originalDriver: 'Tim Tramnitz',
    newDriver: 'Mattia Colnaghi',
    effectiveRound: 1,
    roundName: 'Melbourne',
    reason: 'El piloto italo-argentino campeón de F4 Española desembarca en F3 con MP Motorsport.',
  },
];

const F2_FALLBACK_SCHEDULE: JolpicaRace[] = [
  {
    round: 1,
    raceName: 'Melbourne Grand Prix (F2)',
    circuitName: 'Albert Park Circuit',
    locality: 'Melbourne',
    country: 'Australia',
    raceDateTime: '2026-03-08T00:35:00Z',
    sessions: [
      { name: 'Sprint Race', dateTime: '2026-03-07T03:15:00Z' },
      { name: 'Feature Race', dateTime: '2026-03-08T00:35:00Z' },
    ],
    isNext: false,
  },
  {
    round: 2,
    raceName: 'Miami Grand Prix (F2)',
    circuitName: 'Miami International Autodrome',
    locality: 'Miami',
    country: 'United States',
    raceDateTime: '2026-05-03T14:30:00Z',
    sessions: [
      { name: 'Sprint Race', dateTime: '2026-05-02T16:15:00Z' },
      { name: 'Feature Race', dateTime: '2026-05-03T14:30:00Z' },
    ],
    isNext: false,
  },
  {
    round: 3,
    raceName: 'Montreal Grand Prix (F2)',
    circuitName: 'Circuit Gilles Villeneuve',
    locality: 'Montreal',
    country: 'Canada',
    raceDateTime: '2026-05-24T13:30:00Z',
    sessions: [
      { name: 'Sprint Race', dateTime: '2026-05-23T15:15:00Z' },
      { name: 'Feature Race', dateTime: '2026-05-24T13:30:00Z' },
    ],
    isNext: false,
  },
  {
    round: 4,
    raceName: 'Monaco Grand Prix (F2)',
    circuitName: 'Circuit de Monaco',
    locality: 'Monte Carlo',
    country: 'Monaco',
    raceDateTime: '2026-06-07T07:40:00Z',
    sessions: [
      { name: 'Sprint Race', dateTime: '2026-06-06T12:15:00Z' },
      { name: 'Feature Race', dateTime: '2026-06-07T07:40:00Z' },
    ],
    isNext: false,
  },
  {
    round: 5,
    raceName: 'Barcelona Grand Prix (F2)',
    circuitName: 'Circuit de Barcelona-Catalunya',
    locality: 'Montmeló',
    country: 'Spain',
    raceDateTime: '2026-06-14T09:35:00Z',
    sessions: [
      { name: 'Sprint Race', dateTime: '2026-06-13T12:15:00Z' },
      { name: 'Feature Race', dateTime: '2026-06-14T09:35:00Z' },
    ],
    isNext: false,
  },
  {
    round: 6,
    raceName: 'Spielberg Grand Prix (F2)',
    circuitName: 'Red Bull Ring',
    locality: 'Spielberg',
    country: 'Austria',
    raceDateTime: '2026-06-28T08:05:00Z',
    sessions: [
      { name: 'Sprint Race', dateTime: '2026-06-27T11:30:00Z' },
      { name: 'Feature Race', dateTime: '2026-06-28T08:05:00Z' },
    ],
    isNext: false,
  },
  {
    round: 7,
    raceName: 'Silverstone Grand Prix (F2)',
    circuitName: 'Silverstone Circuit',
    locality: 'Silverstone',
    country: 'United Kingdom',
    raceDateTime: '2026-07-05T08:55:00Z',
    sessions: [
      { name: 'Sprint Race', dateTime: '2026-07-04T12:15:00Z' },
      { name: 'Feature Race', dateTime: '2026-07-05T08:55:00Z' },
    ],
    isNext: false,
  },
  {
    round: 8,
    raceName: 'Spa-Francorchamps Grand Prix (F2)',
    circuitName: 'Circuit de Spa-Francorchamps',
    locality: 'Stavelot',
    country: 'Belgium',
    raceDateTime: '2026-07-19T08:00:00Z',
    sessions: [
      { name: 'Sprint Race', dateTime: '2026-07-18T12:15:00Z' },
      { name: 'Feature Race', dateTime: '2026-07-19T08:00:00Z' },
    ],
    isNext: false,
  },
  {
    round: 9,
    raceName: 'Budapest Grand Prix (F2)',
    circuitName: 'Hungaroring',
    locality: 'Mogyoród',
    country: 'Hungary',
    raceDateTime: '2026-07-26T08:05:00Z',
    sessions: [
      { name: 'Sprint Race', dateTime: '2026-07-25T12:15:00Z' },
      { name: 'Feature Race', dateTime: '2026-07-26T08:05:00Z' },
    ],
    isNext: false,
  },
  {
    round: 10,
    raceName: 'Monza Grand Prix (F2)',
    circuitName: 'Autodromo Nazionale Monza',
    locality: 'Monza',
    country: 'Italy',
    raceDateTime: '2026-09-06T08:05:00Z',
    sessions: [
      { name: 'Sprint Race', dateTime: '2026-09-05T12:15:00Z' },
      { name: 'Feature Race', dateTime: '2026-09-06T08:05:00Z' },
    ],
    isNext: false,
  },
  {
    round: 11,
    raceName: 'Spanish Grand Prix - Madrid (F2)',
    circuitName: 'Circuito de Madrid',
    locality: 'Madrid',
    country: 'Spain',
    raceDateTime: '2026-09-13T09:30:00Z',
    sessions: [
      { name: 'Sprint Race', dateTime: '2026-09-12T12:15:00Z' },
      { name: 'Feature Race', dateTime: '2026-09-13T09:30:00Z' },
    ],
    isNext: false,
  },
  {
    round: 12,
    raceName: 'Baku Grand Prix (F2)',
    circuitName: 'Baku City Circuit',
    locality: 'Baku',
    country: 'Azerbaijan',
    raceDateTime: '2026-09-26T07:35:00Z',
    sessions: [
      { name: 'Sprint Race', dateTime: '2026-09-25T10:15:00Z' },
      { name: 'Feature Race', dateTime: '2026-09-26T07:35:00Z' },
    ],
    isNext: true,
  },
  {
    round: 13,
    raceName: 'Lusail Grand Prix (F2)',
    circuitName: 'Lusail International Circuit',
    locality: 'Lusail',
    country: 'Qatar',
    raceDateTime: '2026-11-29T12:20:00Z',
    sessions: [
      { name: 'Sprint Race', dateTime: '2026-11-28T16:20:00Z' },
      { name: 'Feature Race', dateTime: '2026-11-29T12:20:00Z' },
    ],
    isNext: false,
  },
  {
    round: 14,
    raceName: 'Yas Marina Grand Prix (F2)',
    circuitName: 'Yas Marina Circuit',
    locality: 'Abu Dhabi',
    country: 'United Arab Emirates',
    raceDateTime: '2026-12-06T09:15:00Z',
    sessions: [
      { name: 'Sprint Race', dateTime: '2026-12-05T12:15:00Z' },
      { name: 'Feature Race', dateTime: '2026-12-06T09:15:00Z' },
    ],
    isNext: false,
  },
];

const F3_FALLBACK_SCHEDULE: JolpicaRace[] = [
  {
    round: 1,
    raceName: 'Melbourne Grand Prix (F3)',
    circuitName: 'Albert Park Circuit',
    locality: 'Melbourne',
    country: 'Australia',
    raceDateTime: '2026-03-08T09:05:00Z',
    sessions: [
      { name: 'Sprint Race', dateTime: '2026-03-07T00:15:00Z' },
      { name: 'Feature Race', dateTime: '2026-03-08T09:05:00Z' },
    ],
    isNext: false,
  },
  {
    round: 2,
    raceName: 'Monaco Grand Prix (F3)',
    circuitName: 'Circuit de Monaco',
    locality: 'Monte Carlo',
    country: 'Monaco',
    raceDateTime: '2026-06-07T06:00:00Z',
    sessions: [
      { name: 'Sprint Race', dateTime: '2026-06-06T08:45:00Z' },
      { name: 'Feature Race', dateTime: '2026-06-07T06:00:00Z' },
    ],
    isNext: false,
  },
  {
    round: 3,
    raceName: 'Barcelona Grand Prix (F3)',
    circuitName: 'Circuit de Barcelona-Catalunya',
    locality: 'Montmeló',
    country: 'Spain',
    raceDateTime: '2026-06-14T08:05:00Z',
    sessions: [
      { name: 'Sprint Race', dateTime: '2026-06-13T08:40:00Z' },
      { name: 'Feature Race', dateTime: '2026-06-14T08:05:00Z' },
    ],
    isNext: false,
  },
  {
    round: 4,
    raceName: 'Spielberg Grand Prix (F3)',
    circuitName: 'Red Bull Ring',
    locality: 'Spielberg',
    country: 'Austria',
    raceDateTime: '2026-06-28T06:30:00Z',
    sessions: [
      { name: 'Sprint Race', dateTime: '2026-06-27T07:30:00Z' },
      { name: 'Feature Race', dateTime: '2026-06-28T06:30:00Z' },
    ],
    isNext: false,
  },
  {
    round: 5,
    raceName: 'Silverstone Grand Prix (F3)',
    circuitName: 'Silverstone Circuit',
    locality: 'Silverstone',
    country: 'United Kingdom',
    raceDateTime: '2026-07-05T07:20:00Z',
    sessions: [
      { name: 'Sprint Race', dateTime: '2026-07-04T08:20:00Z' },
      { name: 'Feature Race', dateTime: '2026-07-05T07:20:00Z' },
    ],
    isNext: false,
  },
  {
    round: 6,
    raceName: 'Spa-Francorchamps Grand Prix (F3)',
    circuitName: 'Circuit de Spa-Francorchamps',
    locality: 'Stavelot',
    country: 'Belgium',
    raceDateTime: '2026-07-19T06:30:00Z',
    sessions: [
      { name: 'Sprint Race', dateTime: '2026-07-18T07:50:00Z' },
      { name: 'Feature Race', dateTime: '2026-07-19T06:30:00Z' },
    ],
    isNext: false,
  },
  {
    round: 7,
    raceName: 'Budapest Grand Prix (F3)',
    circuitName: 'Hungaroring',
    locality: 'Mogyoród',
    country: 'Hungary',
    raceDateTime: '2026-07-26T06:25:00Z',
    sessions: [
      { name: 'Sprint Race', dateTime: '2026-07-25T07:50:00Z' },
      { name: 'Feature Race', dateTime: '2026-07-26T06:25:00Z' },
    ],
    isNext: false,
  },
  {
    round: 8,
    raceName: 'Monza Grand Prix (F3)',
    circuitName: 'Autodromo Nazionale Monza',
    locality: 'Monza',
    country: 'Italy',
    raceDateTime: '2026-09-06T06:35:00Z',
    sessions: [
      { name: 'Sprint Race', dateTime: '2026-09-05T07:30:00Z' },
      { name: 'Feature Race', dateTime: '2026-09-06T06:35:00Z' },
    ],
    isNext: false,
  },
  {
    round: 9,
    raceName: 'Spanish Grand Prix - Madrid (F3 Season Finale)',
    circuitName: 'Circuito de Madrid',
    locality: 'Madrid',
    country: 'Spain',
    raceDateTime: '2026-09-13T07:30:00Z',
    sessions: [
      { name: 'Sprint Race', dateTime: '2026-09-12T08:30:00Z' },
      { name: 'Feature Race', dateTime: '2026-09-13T07:30:00Z' },
    ],
    isNext: false,
  },
];

const F2_FALLBACK_DRIVERS: JolpicaDriverStanding[] = [
  {
    pos: 1,
    points: 187,
    wins: 4,
    code: 'TSO',
    name: 'Nikola Tsolov',
    nationality: 'Bulgarian',
    team: 'Campos Racing',
    teamColor: '#FF7700',
  },
  {
    pos: 2,
    points: 187,
    wins: 3,
    code: 'CAM',
    name: 'Rafael Câmara',
    nationality: 'Brazilian',
    team: 'Invicta Racing',
    teamColor: '#FFE000',
  },
  {
    pos: 3,
    points: 158,
    wins: 2,
    code: 'DUN',
    name: 'Alex Dunne',
    nationality: 'Irish',
    team: 'Rodin Motorsport',
    teamColor: '#9333EA',
  },
  {
    pos: 4,
    points: 147,
    wins: 2,
    code: 'MIN',
    name: 'Gabriele Minì',
    nationality: 'Italian',
    team: 'PREMA Racing',
    teamColor: '#DC0000',
  },
  {
    pos: 5,
    points: 134,
    wins: 2,
    code: 'BEG',
    name: 'Dino Beganovic',
    nationality: 'Swedish',
    team: 'DAMS Lucas Oil',
    teamColor: '#0099FF',
  },
  {
    pos: 6,
    points: 133,
    wins: 1,
    code: 'LEO',
    name: 'Noel León',
    nationality: 'Mexican',
    team: 'Van Amersfoort Racing',
    teamColor: '#EA580C',
  },
  {
    pos: 7,
    points: 116,
    wins: 1,
    code: 'MAI',
    name: 'Kush Maini',
    nationality: 'Indian',
    team: 'Invicta Racing',
    teamColor: '#FFE000',
  },
  {
    pos: 8,
    points: 98,
    wins: 0,
    code: 'HOE',
    name: 'Laurens van Hoepen',
    nationality: 'Dutch',
    team: 'ART Grand Prix',
    teamColor: '#0059B3',
  },
  {
    pos: 9,
    points: 97,
    wins: 1,
    code: 'DUR',
    name: 'Joshua Dürksen',
    nationality: 'Paraguayan',
    team: 'Invicta Racing',
    teamColor: '#FFE000',
  },
  {
    pos: 10,
    points: 94,
    wins: 1,
    code: 'STE',
    name: 'Martinius Stenshorne',
    nationality: 'Norwegian',
    team: 'Trident',
    teamColor: '#2563EB',
  },
  {
    pos: 11,
    points: 74,
    wins: 0,
    code: 'MIY',
    name: 'Ritomo Miyata',
    nationality: 'Japanese',
    team: 'Hitech Pulse-Eight',
    teamColor: '#D4D4D8',
  },
  {
    pos: 12,
    points: 69,
    wins: 0,
    code: 'INT',
    name: 'Tasanapol Inthraphuvasak',
    nationality: 'Thai',
    team: 'ART Grand Prix',
    teamColor: '#0059B3',
  },
  {
    pos: 13,
    points: 55,
    wins: 0,
    code: 'BEN',
    name: 'John Bennett',
    nationality: 'British',
    team: 'Trident',
    teamColor: '#2563EB',
  },
  {
    pos: 14,
    points: 48,
    wins: 0,
    code: 'VIL',
    name: 'Rafael Villagómez',
    nationality: 'Mexican',
    team: 'Van Amersfoort Racing',
    teamColor: '#EA580C',
  },
  {
    pos: 15,
    points: 44,
    wins: 0,
    code: 'GOE',
    name: 'Oliver Goethe',
    nationality: 'German',
    team: 'MP Motorsport',
    teamColor: '#FF8800',
  },
  {
    pos: 16,
    points: 38,
    wins: 0,
    code: 'MON',
    name: 'Sebastián Montoya',
    nationality: 'Colombian',
    team: 'Campos Racing',
    teamColor: '#FF7700',
  },
  {
    pos: 17,
    points: 35,
    wins: 0,
    code: 'BIL',
    name: 'Roman Bilinski',
    nationality: 'British-Polish',
    team: 'Rodin Motorsport',
    teamColor: '#9333EA',
  },
  {
    pos: 18,
    points: 34,
    wins: 0,
    code: 'HER',
    name: 'Colton Herta',
    nationality: 'American',
    team: 'Hitech Pulse-Eight',
    teamColor: '#D4D4D8',
  },
  {
    pos: 19,
    points: 30,
    wins: 0,
    code: 'FIT',
    name: 'Emerson Fittipaldi Jr.',
    nationality: 'Brazilian',
    team: 'DAMS Lucas Oil',
    teamColor: '#0099FF',
  },
  {
    pos: 20,
    points: 18,
    wins: 0,
    code: 'VAR',
    name: 'Nico Varrone',
    nationality: 'Argentine',
    team: 'AIX Racing',
    teamColor: '#0284C7',
  },
  {
    pos: 21,
    points: 15,
    wins: 0,
    code: 'BOY',
    name: 'Mari Boya',
    nationality: 'Spanish',
    team: 'PREMA Racing',
    teamColor: '#DC0000',
  },
  {
    pos: 22,
    points: 8,
    wins: 0,
    code: 'SHI',
    name: 'Cian Shields',
    nationality: 'British',
    team: 'AIX Racing',
    teamColor: '#0284C7',
  },
];

const F2_FALLBACK_CONSTRUCTORS: JolpicaConstructorStanding[] = [
  { pos: 1, points: 300, wins: 4, name: 'Invicta Racing', teamColor: '#FFE000' },
  { pos: 2, points: 225, wins: 4, name: 'Campos Racing', teamColor: '#FF7700' },
  { pos: 3, points: 193, wins: 2, name: 'Rodin Motorsport', teamColor: '#9333EA' },
  { pos: 4, points: 181, wins: 1, name: 'Van Amersfoort Racing', teamColor: '#EA580C' },
  { pos: 5, points: 167, wins: 0, name: 'ART Grand Prix', teamColor: '#0059B3' },
  { pos: 6, points: 164, wins: 2, name: 'DAMS Lucas Oil', teamColor: '#0099FF' },
  { pos: 7, points: 162, wins: 2, name: 'PREMA Racing', teamColor: '#DC0000' },
  { pos: 8, points: 149, wins: 1, name: 'Trident', teamColor: '#2563EB' },
  { pos: 9, points: 108, wins: 0, name: 'Hitech Pulse-Eight', teamColor: '#D4D4D8' },
  { pos: 10, points: 98, wins: 0, name: 'MP Motorsport', teamColor: '#FF8800' },
  { pos: 11, points: 26, wins: 0, name: 'AIX Racing', teamColor: '#0284C7' },
];

const F3_FALLBACK_DRIVERS: JolpicaDriverStanding[] = [
  {
    pos: 1,
    points: 182,
    wins: 3,
    code: 'SLA',
    name: 'Freddie Slater',
    nationality: 'British',
    team: 'Trident',
    teamColor: '#2563EB',
  },
  {
    pos: 2,
    points: 154,
    wins: 3,
    code: 'NAE',
    name: 'Théophile Naël',
    nationality: 'French',
    team: 'Campos Racing',
    teamColor: '#FF7700',
  },
  {
    pos: 3,
    points: 139,
    wins: 2,
    code: 'UGO',
    name: 'Ugo Ugochukwu',
    nationality: 'American',
    team: 'Campos Racing',
    teamColor: '#FF7700',
  },
  {
    pos: 4,
    points: 118,
    wins: 1,
    code: 'KAT',
    name: 'Taito Kato',
    nationality: 'Japanese',
    team: 'ART Grand Prix',
    teamColor: '#0059B3',
  },
  {
    pos: 5,
    points: 112,
    wins: 1,
    code: 'GIU',
    name: 'Alessandro Giusti',
    nationality: 'French',
    team: 'MP Motorsport',
    teamColor: '#FF8800',
  },
  {
    pos: 6,
    points: 106,
    wins: 1,
    code: 'RIV',
    name: 'Ernesto Rivera',
    nationality: 'Mexican',
    team: 'Campos Racing',
    teamColor: '#FF7700',
  },
  {
    pos: 7,
    points: 104,
    wins: 1,
    code: 'CLE',
    name: 'Pedro Clerot',
    nationality: 'Brazilian',
    team: 'Van Amersfoort Racing',
    teamColor: '#EA580C',
  },
  {
    pos: 8,
    points: 98,
    wins: 1,
    code: 'TAP',
    name: 'Tuukka Taponen',
    nationality: 'Finnish',
    team: 'ART Grand Prix',
    teamColor: '#0059B3',
  },
  {
    pos: 9,
    points: 82,
    wins: 1,
    code: 'BAD',
    name: 'Brando Badoer',
    nationality: 'Italian',
    team: 'PREMA Racing',
    teamColor: '#DC0000',
  },
  {
    pos: 10,
    points: 76,
    wins: 1,
    code: 'YAM',
    name: 'Hiyu Yamakoshi',
    nationality: 'Japanese',
    team: 'Van Amersfoort Racing',
    teamColor: '#EA580C',
  },
  {
    pos: 11,
    points: 70,
    wins: 0,
    code: 'STR',
    name: 'Noah Strømsted',
    nationality: 'Danish',
    team: 'Trident',
    teamColor: '#2563EB',
  },
  {
    pos: 12,
    points: 68,
    wins: 0,
    code: 'PIN',
    name: 'Bruno del Pino',
    nationality: 'Spanish',
    team: 'MP Motorsport',
    teamColor: '#FF8800',
  },
  {
    pos: 13,
    points: 54,
    wins: 0,
    code: 'GLA',
    name: 'Maciej Gładysz',
    nationality: 'Polish',
    team: 'ART Grand Prix',
    teamColor: '#0059B3',
  },
  {
    pos: 14,
    points: 48,
    wins: 0,
    code: 'CNG',
    name: 'Mattia Colnaghi',
    nationality: 'Argentine',
    team: 'MP Motorsport',
    teamColor: '#FF8800',
  },
  {
    pos: 15,
    points: 45,
    wins: 0,
    code: 'WHA',
    name: 'James Wharton',
    nationality: 'Australian',
    team: 'Hitech Pulse-Eight',
    teamColor: '#D4D4D8',
  },
  {
    pos: 16,
    points: 44,
    wins: 0,
    code: 'NAK',
    name: 'Jin Nakamura',
    nationality: 'Japanese',
    team: 'Hitech Pulse-Eight',
    teamColor: '#D4D4D8',
  },
  {
    pos: 17,
    points: 28,
    wins: 0,
    code: 'DAV',
    name: 'Yevan David',
    nationality: 'Sri Lankan',
    team: 'AIX Racing',
    teamColor: '#0284C7',
  },
  {
    pos: 18,
    points: 25,
    wins: 0,
    code: 'DEL',
    name: 'Enzo Deligny',
    nationality: 'French',
    team: 'PREMA Racing',
    teamColor: '#DC0000',
  },
  {
    pos: 19,
    points: 20,
    wins: 0,
    code: 'LAC',
    name: 'Nicola Lacorte',
    nationality: 'Italian',
    team: 'DAMS Lucas Oil',
    teamColor: '#0099FF',
  },
  {
    pos: 20,
    points: 19,
    wins: 0,
    code: 'POW',
    name: 'Alex Powell',
    nationality: 'Jamaican-American',
    team: 'PREMA Racing',
    teamColor: '#DC0000',
  },
  {
    pos: 21,
    points: 16,
    wins: 0,
    code: 'LE',
    name: 'Kanato Le',
    nationality: 'Japanese',
    team: 'ART Grand Prix',
    teamColor: '#0059B3',
  },
  {
    pos: 22,
    points: 10,
    wins: 0,
    code: 'XIE',
    name: 'Gerrard Xie',
    nationality: 'Chinese',
    team: 'DAMS Lucas Oil',
    teamColor: '#0099FF',
  },
  {
    pos: 23,
    points: 8,
    wins: 0,
    code: 'DEP',
    name: 'Matteo De Palo',
    nationality: 'Italian',
    team: 'Trident',
    teamColor: '#2563EB',
  },
];

const F3_FALLBACK_CONSTRUCTORS: JolpicaConstructorStanding[] = [
  { pos: 1, points: 399, wins: 6, name: 'Campos Racing', teamColor: '#FF7700' },
  { pos: 2, points: 260, wins: 3, name: 'Trident', teamColor: '#2563EB' },
  { pos: 3, points: 228, wins: 2, name: 'ART Grand Prix', teamColor: '#0059B3' },
  { pos: 4, points: 228, wins: 1, name: 'MP Motorsport', teamColor: '#FF8800' },
  { pos: 5, points: 180, wins: 2, name: 'Van Amersfoort Racing', teamColor: '#EA580C' },
  { pos: 6, points: 126, wins: 1, name: 'PREMA Racing', teamColor: '#DC0000' },
  { pos: 7, points: 89, wins: 0, name: 'Hitech Pulse-Eight', teamColor: '#D4D4D8' },
  { pos: 8, points: 45, wins: 0, name: 'Rodin Motorsport', teamColor: '#9333EA' },
  { pos: 9, points: 30, wins: 0, name: 'DAMS Lucas Oil', teamColor: '#0099FF' },
  { pos: 10, points: 28, wins: 0, name: 'AIX Racing', teamColor: '#0284C7' },
  { pos: 11, points: 20, wins: 0, name: 'Jenzer Motorsport', teamColor: '#16A34A' },
];

// F2 2025 Official / Curated Season
const F2_2025_DRIVERS: JolpicaDriverStanding[] = [
  {
    pos: 1,
    points: 208,
    wins: 3,
    code: 'FOR',
    name: 'Leonardo Fornaroli',
    nationality: 'Italian',
    team: 'Invicta Racing',
    teamColor: '#FFE000',
  },
  {
    pos: 2,
    points: 186,
    wins: 3,
    code: 'MIN',
    name: 'Gabriele Minì',
    nationality: 'Italian',
    team: 'PREMA Racing',
    teamColor: '#DC0000',
  },
  {
    pos: 3,
    points: 164,
    wins: 2,
    code: 'BRO',
    name: 'Luke Browning',
    nationality: 'British',
    team: 'Hitech Pulse-Eight',
    teamColor: '#D4D4D8',
  },
  {
    pos: 4,
    points: 145,
    wins: 2,
    code: 'BEG',
    name: 'Dino Beganovic',
    nationality: 'Swedish',
    team: 'DAMS Lucas Oil',
    teamColor: '#0099FF',
  },
  {
    pos: 5,
    points: 138,
    wins: 2,
    code: 'LIN',
    name: 'Arvid Lindblad',
    nationality: 'British',
    team: 'Campos Racing',
    teamColor: '#FF7700',
  },
  {
    pos: 6,
    points: 124,
    wins: 1,
    code: 'GOE',
    name: 'Oliver Goethe',
    nationality: 'German',
    team: 'MP Motorsport',
    teamColor: '#FF8800',
  },
  {
    pos: 7,
    points: 118,
    wins: 2,
    code: 'DUR',
    name: 'Joshua Dürksen',
    nationality: 'Paraguayan',
    team: 'AIX Racing',
    teamColor: '#0284C7',
  },
  {
    pos: 8,
    points: 105,
    wins: 1,
    code: 'MAI',
    name: 'Kush Maini',
    nationality: 'Indian',
    team: 'Invicta Racing',
    teamColor: '#FFE000',
  },
  {
    pos: 9,
    points: 92,
    wins: 1,
    code: 'STE',
    name: 'Martinius Stenshorne',
    nationality: 'Norwegian',
    team: 'Trident',
    teamColor: '#2563EB',
  },
  {
    pos: 10,
    points: 86,
    wins: 1,
    code: 'LEO',
    name: 'Noel León',
    nationality: 'Mexican',
    team: 'Van Amersfoort Racing',
    teamColor: '#EA580C',
  },
  {
    pos: 11,
    points: 68,
    wins: 0,
    code: 'MIY',
    name: 'Ritomo Miyata',
    nationality: 'Japanese',
    team: 'Rodin Motorsport',
    teamColor: '#9333EA',
  },
  {
    pos: 12,
    points: 52,
    wins: 0,
    code: 'HOE',
    name: 'Christian Ho',
    nationality: 'Singaporean',
    team: 'ART Grand Prix',
    teamColor: '#0059B3',
  },
  {
    pos: 13,
    points: 45,
    wins: 0,
    code: 'MON',
    name: 'Sebastián Montoya',
    nationality: 'Colombian',
    team: 'Campos Racing',
    teamColor: '#FF7700',
  },
  {
    pos: 14,
    points: 38,
    wins: 0,
    code: 'FIT',
    name: 'Emerson Fittipaldi Jr.',
    nationality: 'Brazilian',
    team: 'DAMS Lucas Oil',
    teamColor: '#0099FF',
  },
  {
    pos: 15,
    points: 28,
    wins: 0,
    code: 'VIL',
    name: 'Rafael Villagómez',
    nationality: 'Mexican',
    team: 'Van Amersfoort Racing',
    teamColor: '#EA580C',
  },
];

const F2_2025_CONSTRUCTORS: JolpicaConstructorStanding[] = [
  { pos: 1, points: 313, wins: 4, name: 'Invicta Racing', teamColor: '#FFE000' },
  { pos: 2, points: 238, wins: 3, name: 'PREMA Racing', teamColor: '#DC0000' },
  { pos: 3, points: 224, wins: 2, name: 'Campos Racing', teamColor: '#FF7700' },
  { pos: 4, points: 201, wins: 2, name: 'Hitech Pulse-Eight', teamColor: '#D4D4D8' },
  { pos: 5, points: 189, wins: 2, name: 'DAMS Lucas Oil', teamColor: '#0099FF' },
  { pos: 6, points: 156, wins: 1, name: 'MP Motorsport', teamColor: '#FF8800' },
  { pos: 7, points: 132, wins: 2, name: 'AIX Racing', teamColor: '#0284C7' },
  { pos: 8, points: 110, wins: 1, name: 'Trident', teamColor: '#2563EB' },
  { pos: 9, points: 98, wins: 0, name: 'Rodin Motorsport', teamColor: '#9333EA' },
  { pos: 10, points: 86, wins: 1, name: 'Van Amersfoort Racing', teamColor: '#EA580C' },
  { pos: 11, points: 74, wins: 0, name: 'ART Grand Prix', teamColor: '#0059B3' },
];

// F2 2024 Official Standings
const F2_2024_DRIVERS: JolpicaDriverStanding[] = [
  {
    pos: 1,
    points: 214.5,
    wins: 2,
    code: 'BOR',
    name: 'Gabriel Bortoleto',
    nationality: 'Brazilian',
    team: 'Invicta Racing',
    teamColor: '#FFE000',
  },
  {
    pos: 2,
    points: 198.5,
    wins: 4,
    code: 'HAD',
    name: 'Isack Hadjar',
    nationality: 'French',
    team: 'Campos Racing',
    teamColor: '#FF7700',
  },
  {
    pos: 3,
    points: 168,
    wins: 1,
    code: 'ARO',
    name: 'Paul Aron',
    nationality: 'Estonian',
    team: 'Hitech Pulse-Eight',
    teamColor: '#D4D4D8',
  },
  {
    pos: 4,
    points: 140,
    wins: 2,
    code: 'MAL',
    name: 'Zane Maloney',
    nationality: 'Barbadian',
    team: 'Rodin Motorsport',
    teamColor: '#9333EA',
  },
  {
    pos: 5,
    points: 125,
    wins: 1,
    code: 'CRA',
    name: 'Jak Crawford',
    nationality: 'American',
    team: 'DAMS Lucas Oil',
    teamColor: '#0099FF',
  },
  {
    pos: 6,
    points: 113,
    wins: 2,
    code: 'ANT',
    name: 'Andrea Kimi Antonelli',
    nationality: 'Italian',
    team: 'PREMA Racing',
    teamColor: '#DC0000',
  },
  {
    pos: 7,
    points: 96,
    wins: 1,
    code: 'COL',
    name: 'Franco Colapinto',
    nationality: 'Argentine',
    team: 'MP Motorsport',
    teamColor: '#FF8800',
  },
  {
    pos: 8,
    points: 85.5,
    wins: 1,
    code: 'HAU',
    name: 'Dennis Hauger',
    nationality: 'Norwegian',
    team: 'MP Motorsport',
    teamColor: '#FF8800',
  },
  {
    pos: 9,
    points: 74,
    wins: 0,
    code: 'MAI',
    name: 'Kush Maini',
    nationality: 'Indian',
    team: 'Invicta Racing',
    teamColor: '#FFE000',
  },
  {
    pos: 10,
    points: 73,
    wins: 1,
    code: 'MAR',
    name: 'Victor Martins',
    nationality: 'French',
    team: 'ART Grand Prix',
    teamColor: '#0059B3',
  },
  {
    pos: 11,
    points: 65,
    wins: 2,
    code: 'BEA',
    name: 'Oliver Bearman',
    nationality: 'British',
    team: 'PREMA Racing',
    teamColor: '#DC0000',
  },
  {
    pos: 12,
    points: 61,
    wins: 1,
    code: 'FIT',
    name: 'Enzo Fittipaldi',
    nationality: 'Brazilian',
    team: 'Van Amersfoort Racing',
    teamColor: '#EA580C',
  },
  {
    pos: 13,
    points: 61,
    wins: 1,
    code: 'DUR',
    name: 'Joshua Dürksen',
    nationality: 'Paraguayan',
    team: 'AIX Racing',
    teamColor: '#0284C7',
  },
  {
    pos: 14,
    points: 34,
    wins: 0,
    code: 'MIY',
    name: 'Ritomo Miyata',
    nationality: 'Japanese',
    team: 'Rodin Motorsport',
    teamColor: '#9333EA',
  },
  {
    pos: 15,
    points: 20,
    wins: 2,
    code: 'OSU',
    name: "Zak O'Sullivan",
    nationality: 'British',
    team: 'ART Grand Prix',
    teamColor: '#0059B3',
  },
];

const F2_2024_CONSTRUCTORS: JolpicaConstructorStanding[] = [
  { pos: 1, points: 288.5, wins: 2, name: 'Invicta Racing', teamColor: '#FFE000' },
  { pos: 2, points: 236.5, wins: 4, name: 'Campos Racing', teamColor: '#FF7700' },
  { pos: 3, points: 181.5, wins: 2, name: 'MP Motorsport', teamColor: '#FF8800' },
  { pos: 4, points: 178, wins: 4, name: 'PREMA Racing', teamColor: '#DC0000' },
  { pos: 5, points: 176, wins: 1, name: 'Hitech Pulse-Eight', teamColor: '#D4D4D8' },
  { pos: 6, points: 174, wins: 2, name: 'Rodin Motorsport', teamColor: '#9333EA' },
  { pos: 7, points: 147, wins: 1, name: 'DAMS Lucas Oil', teamColor: '#0099FF' },
  { pos: 8, points: 93, wins: 3, name: 'ART Grand Prix', teamColor: '#0059B3' },
  { pos: 9, points: 79, wins: 1, name: 'Van Amersfoort Racing', teamColor: '#EA580C' },
  { pos: 10, points: 61, wins: 1, name: 'AIX Racing', teamColor: '#0284C7' },
  { pos: 11, points: 29, wins: 0, name: 'Trident', teamColor: '#2563EB' },
];

// F3 2025 Official / Curated Season
const F3_2025_DRIVERS: JolpicaDriverStanding[] = [
  {
    pos: 1,
    points: 176,
    wins: 4,
    code: 'CAM',
    name: 'Rafael Câmara',
    nationality: 'Brazilian',
    team: 'Trident',
    teamColor: '#2563EB',
  },
  {
    pos: 2,
    points: 148,
    wins: 2,
    code: 'TRA',
    name: 'Tim Tramnitz',
    nationality: 'German',
    team: 'MP Motorsport',
    teamColor: '#FF8800',
  },
  {
    pos: 3,
    points: 142,
    wins: 3,
    code: 'TSO',
    name: 'Nikola Tsolov',
    nationality: 'Bulgarian',
    team: 'Campos Racing',
    teamColor: '#FF7700',
  },
  {
    pos: 4,
    points: 126,
    wins: 2,
    code: 'BOY',
    name: 'Mari Boya',
    nationality: 'Spanish',
    team: 'Campos Racing',
    teamColor: '#FF7700',
  },
  {
    pos: 5,
    points: 114,
    wins: 1,
    code: 'TAP',
    name: 'Tuukka Taponen',
    nationality: 'Finnish',
    team: 'ART Grand Prix',
    teamColor: '#0059B3',
  },
  {
    pos: 6,
    points: 98,
    wins: 1,
    code: 'WHA',
    name: 'James Wharton',
    nationality: 'Australian',
    team: 'Hitech Pulse-Eight',
    teamColor: '#D4D4D8',
  },
  {
    pos: 7,
    points: 89,
    wins: 1,
    code: 'GIU',
    name: 'Alessandro Giusti',
    nationality: 'French',
    team: 'MP Motorsport',
    teamColor: '#FF8800',
  },
  {
    pos: 8,
    points: 84,
    wins: 1,
    code: 'UGO',
    name: 'Ugo Ugochukwu',
    nationality: 'American',
    team: 'PREMA Racing',
    teamColor: '#DC0000',
  },
  {
    pos: 9,
    points: 72,
    wins: 0,
    code: 'BAD',
    name: 'Brando Badoer',
    nationality: 'Italian',
    team: 'Van Amersfoort Racing',
    teamColor: '#EA580C',
  },
  {
    pos: 10,
    points: 68,
    wins: 0,
    code: 'DEL',
    name: 'Enzo Deligny',
    nationality: 'French',
    team: 'PREMA Racing',
    teamColor: '#DC0000',
  },
];

const F3_2025_CONSTRUCTORS: JolpicaConstructorStanding[] = [
  { pos: 1, points: 312, wins: 4, name: 'Trident', teamColor: '#2563EB' },
  { pos: 2, points: 268, wins: 5, name: 'Campos Racing', teamColor: '#FF7700' },
  { pos: 3, points: 237, wins: 3, name: 'MP Motorsport', teamColor: '#FF8800' },
  { pos: 4, points: 210, wins: 1, name: 'ART Grand Prix', teamColor: '#0059B3' },
  { pos: 5, points: 198, wins: 1, name: 'PREMA Racing', teamColor: '#DC0000' },
  { pos: 6, points: 145, wins: 1, name: 'Hitech Pulse-Eight', teamColor: '#D4D4D8' },
  { pos: 7, points: 120, wins: 0, name: 'Van Amersfoort Racing', teamColor: '#EA580C' },
];

// F3 2024 Official Standings
const F3_2024_DRIVERS: JolpicaDriverStanding[] = [
  {
    pos: 1,
    points: 153,
    wins: 0,
    code: 'FOR',
    name: 'Leonardo Fornaroli',
    nationality: 'Italian',
    team: 'Trident',
    teamColor: '#2563EB',
  },
  {
    pos: 2,
    points: 150,
    wins: 1,
    code: 'MIN',
    name: 'Gabriele Minì',
    nationality: 'Italian',
    team: 'PREMA Racing',
    teamColor: '#DC0000',
  },
  {
    pos: 3,
    points: 128,
    wins: 2,
    code: 'BRO',
    name: 'Luke Browning',
    nationality: 'British',
    team: 'Hitech Pulse-Eight',
    teamColor: '#D4D4D8',
  },
  {
    pos: 4,
    points: 113,
    wins: 4,
    code: 'LIN',
    name: 'Arvid Lindblad',
    nationality: 'British',
    team: 'PREMA Racing',
    teamColor: '#DC0000',
  },
  {
    pos: 5,
    points: 109,
    wins: 2,
    code: 'BEG',
    name: 'Dino Beganovic',
    nationality: 'Swedish',
    team: 'PREMA Racing',
    teamColor: '#DC0000',
  },
  {
    pos: 6,
    points: 112,
    wins: 0,
    code: 'MAN',
    name: 'Christian Mansell',
    nationality: 'Australian',
    team: 'ART Grand Prix',
    teamColor: '#0059B3',
  },
  {
    pos: 7,
    points: 94,
    wins: 1,
    code: 'GOE',
    name: 'Oliver Goethe',
    nationality: 'German',
    team: 'Campos Racing',
    teamColor: '#FF7700',
  },
  {
    pos: 8,
    points: 84,
    wins: 2,
    code: 'MEG',
    name: 'Sami Meguetounif',
    nationality: 'French',
    team: 'Trident',
    teamColor: '#2563EB',
  },
  {
    pos: 9,
    points: 81,
    wins: 1,
    code: 'TRA',
    name: 'Tim Tramnitz',
    nationality: 'German',
    team: 'MP Motorsport',
    teamColor: '#FF8800',
  },
  {
    pos: 10,
    points: 82,
    wins: 1,
    code: 'BOY',
    name: 'Mari Boya',
    nationality: 'Spanish',
    team: 'Campos Racing',
    teamColor: '#FF7700',
  },
  {
    pos: 11,
    points: 75,
    wins: 3,
    code: 'TSO',
    name: 'Nikola Tsolov',
    nationality: 'Bulgarian',
    team: 'ART Grand Prix',
    teamColor: '#0059B3',
  },
];

const F3_2024_CONSTRUCTORS: JolpicaConstructorStanding[] = [
  { pos: 1, points: 352, wins: 7, name: 'PREMA Racing', teamColor: '#DC0000' },
  { pos: 2, points: 281, wins: 2, name: 'Trident', teamColor: '#2563EB' },
  { pos: 3, points: 245, wins: 3, name: 'ART Grand Prix', teamColor: '#0059B3' },
  { pos: 4, points: 179, wins: 2, name: 'Campos Racing', teamColor: '#FF7700' },
  { pos: 5, points: 166, wins: 2, name: 'Hitech Pulse-Eight', teamColor: '#D4D4D8' },
  { pos: 6, points: 138, wins: 1, name: 'MP Motorsport', teamColor: '#FF8800' },
];

const F2_HISTORICAL_STANDINGS: Record<
  number,
  { drivers: JolpicaDriverStanding[]; constructors: JolpicaConstructorStanding[] }
> = {
  2023: {
    drivers: [
      {
        pos: 1,
        points: 203,
        wins: 1,
        code: 'POU',
        name: 'Théo Pourchaire',
        nationality: 'French',
        team: 'ART Grand Prix',
        teamColor: '#0059B3',
      },
      {
        pos: 2,
        points: 192,
        wins: 6,
        code: 'VES',
        name: 'Frederik Vesti',
        nationality: 'Danish',
        team: 'PREMA Racing',
        teamColor: '#DC0000',
      },
      {
        pos: 3,
        points: 168,
        wins: 3,
        code: 'DOO',
        name: 'Jack Doohan',
        nationality: 'Australian',
        team: 'Invicta Virtuosi Racing',
        teamColor: '#FFE000',
      },
      {
        pos: 4,
        points: 165,
        wins: 3,
        code: 'IWA',
        name: 'Ayumu Iwasa',
        nationality: 'Japanese',
        team: 'DAMS',
        teamColor: '#0099FF',
      },
      {
        pos: 5,
        points: 150,
        wins: 1,
        code: 'MAR',
        name: 'Victor Martins',
        nationality: 'French',
        team: 'ART Grand Prix',
        teamColor: '#0059B3',
      },
      {
        pos: 6,
        points: 130,
        wins: 4,
        code: 'BEA',
        name: 'Oliver Bearman',
        nationality: 'British',
        team: 'PREMA Racing',
        teamColor: '#DC0000',
      },
      {
        pos: 7,
        points: 124,
        wins: 1,
        code: 'FIT',
        name: 'Enzo Fittipaldi',
        nationality: 'Brazilian',
        team: 'Rodin Carlin',
        teamColor: '#002F6C',
      },
      {
        pos: 8,
        points: 113,
        wins: 2,
        code: 'HAU',
        name: 'Dennis Hauger',
        nationality: 'Norwegian',
        team: 'MP Motorsport',
        teamColor: '#FF8800',
      },
      {
        pos: 9,
        points: 108,
        wins: 1,
        code: 'VER',
        name: 'Richard Verschoor',
        nationality: 'Dutch',
        team: 'Van Amersfoort Racing',
        teamColor: '#EA580C',
      },
      {
        pos: 10,
        points: 96,
        wins: 0,
        code: 'MAL',
        name: 'Zane Maloney',
        nationality: 'Barbadian',
        team: 'Rodin Carlin',
        teamColor: '#002F6C',
      },
      {
        pos: 11,
        points: 62,
        wins: 0,
        code: 'MAI',
        name: 'Kush Maini',
        nationality: 'Indian',
        team: 'Campos Racing',
        teamColor: '#FF7700',
      },
      {
        pos: 12,
        points: 59,
        wins: 0,
        code: 'DAR',
        name: 'Jehan Daruvala',
        nationality: 'Indian',
        team: 'MP Motorsport',
        teamColor: '#FF8800',
      },
      {
        pos: 13,
        points: 57,
        wins: 1,
        code: 'CRA',
        name: 'Jak Crawford',
        nationality: 'American',
        team: 'Hitech Pulse-Eight',
        teamColor: '#D4D4D8',
      },
      {
        pos: 14,
        points: 55,
        wins: 1,
        code: 'HAD',
        name: 'Isack Hadjar',
        nationality: 'French',
        team: 'Hitech Pulse-Eight',
        teamColor: '#D4D4D8',
      },
      {
        pos: 15,
        points: 49,
        wins: 0,
        code: 'LEC',
        name: 'Arthur Leclerc',
        nationality: 'Monegasque',
        team: 'DAMS',
        teamColor: '#0099FF',
      },
      {
        pos: 16,
        points: 37,
        wins: 1,
        code: 'BOS',
        name: 'Ralph Boschung',
        nationality: 'Swiss',
        team: 'Campos Racing',
        teamColor: '#FF7700',
      },
      {
        pos: 17,
        points: 28,
        wins: 1,
        code: 'NOV',
        name: 'Clément Novalak',
        nationality: 'French',
        team: 'Trident',
        teamColor: '#2563EB',
      },
      {
        pos: 18,
        points: 15,
        wins: 0,
        code: 'STA',
        name: 'Roman Staněk',
        nationality: 'Czech',
        team: 'Trident',
        teamColor: '#2563EB',
      },
      {
        pos: 19,
        points: 13,
        wins: 0,
        code: 'COR',
        name: 'Juan Manuel Correa',
        nationality: 'American',
        team: 'Van Amersfoort Racing',
        teamColor: '#EA580C',
      },
      {
        pos: 20,
        points: 8,
        wins: 0,
        code: 'CRD',
        name: 'Amaury Cordeel',
        nationality: 'Belgian',
        team: 'Invicta Virtuosi Racing',
        teamColor: '#FFE000',
      },
      {
        pos: 21,
        points: 0,
        wins: 0,
        code: 'NIS',
        name: 'Roy Nissany',
        nationality: 'Israeli',
        team: 'PHM Racing by Charouz',
        teamColor: '#881337',
      },
      {
        pos: 22,
        points: 0,
        wins: 0,
        code: 'COL',
        name: 'Franco Colapinto',
        nationality: 'Argentine',
        team: 'MP Motorsport',
        teamColor: '#FF8800',
      },
    ],
    constructors: [
      { pos: 1, points: 353, wins: 2, name: 'ART Grand Prix', teamColor: '#0059B3' },
      { pos: 2, points: 322, wins: 10, name: 'PREMA Racing', teamColor: '#DC0000' },
      { pos: 3, points: 220, wins: 1, name: 'Rodin Carlin', teamColor: '#002F6C' },
      { pos: 4, points: 214, wins: 3, name: 'DAMS', teamColor: '#0099FF' },
      { pos: 5, points: 176, wins: 3, name: 'Invicta Virtuosi Racing', teamColor: '#FFE000' },
      { pos: 6, points: 172, wins: 2, name: 'MP Motorsport', teamColor: '#FF8800' },
      { pos: 7, points: 121, wins: 1, name: 'Van Amersfoort Racing', teamColor: '#EA580C' },
      { pos: 8, points: 112, wins: 2, name: 'Hitech Pulse-Eight', teamColor: '#D4D4D8' },
      { pos: 9, points: 99, wins: 1, name: 'Campos Racing', teamColor: '#FF7700' },
      { pos: 10, points: 43, wins: 1, name: 'Trident', teamColor: '#2563EB' },
      { pos: 11, points: 0, wins: 0, name: 'PHM Racing by Charouz', teamColor: '#881337' },
    ],
  },
  2022: {
    drivers: [
      {
        pos: 1,
        points: 265,
        wins: 5,
        code: 'DRU',
        name: 'Felipe Drugovich',
        nationality: 'Brazilian',
        team: 'MP Motorsport',
        teamColor: '#FF8800',
      },
      {
        pos: 2,
        points: 164,
        wins: 3,
        code: 'POU',
        name: 'Théo Pourchaire',
        nationality: 'French',
        team: 'ART Grand Prix',
        teamColor: '#0059B3',
      },
      {
        pos: 3,
        points: 149,
        wins: 4,
        code: 'LAW',
        name: 'Liam Lawson',
        nationality: 'New Zealander',
        team: 'Carlin',
        teamColor: '#002F6C',
      },
      {
        pos: 4,
        points: 148,
        wins: 2,
        code: 'SAR',
        name: 'Logan Sargeant',
        nationality: 'American',
        team: 'Carlin',
        teamColor: '#002F6C',
      },
      {
        pos: 5,
        points: 141,
        wins: 2,
        code: 'IWA',
        name: 'Ayumu Iwasa',
        nationality: 'Japanese',
        team: 'DAMS',
        teamColor: '#0099FF',
      },
      {
        pos: 6,
        points: 128,
        wins: 3,
        code: 'DOO',
        name: 'Jack Doohan',
        nationality: 'Australian',
        team: 'Virtuosi Racing',
        teamColor: '#FFE000',
      },
      {
        pos: 7,
        points: 126,
        wins: 1,
        code: 'DAR',
        name: 'Jehan Daruvala',
        nationality: 'Indian',
        team: 'PREMA Racing',
        teamColor: '#DC0000',
      },
      {
        pos: 8,
        points: 126,
        wins: 0,
        code: 'FIT',
        name: 'Enzo Fittipaldi',
        nationality: 'Brazilian',
        team: 'Charouz Racing System',
        teamColor: '#881337',
      },
      {
        pos: 9,
        points: 117,
        wins: 1,
        code: 'VES',
        name: 'Frederik Vesti',
        nationality: 'Danish',
        team: 'ART Grand Prix',
        teamColor: '#0059B3',
      },
      {
        pos: 10,
        points: 115,
        wins: 2,
        code: 'HAU',
        name: 'Dennis Hauger',
        nationality: 'Norwegian',
        team: 'PREMA Racing',
        teamColor: '#DC0000',
      },
      {
        pos: 11,
        points: 114,
        wins: 1,
        code: 'VIP',
        name: 'Jüri Vips',
        nationality: 'Estonian',
        team: 'Hitech Grand Prix',
        teamColor: '#D4D4D8',
      },
      {
        pos: 12,
        points: 103,
        wins: 1,
        code: 'VER',
        name: 'Richard Verschoor',
        nationality: 'Dutch',
        team: 'Trident',
        teamColor: '#2563EB',
      },
      {
        pos: 13,
        points: 93,
        wins: 3,
        code: 'ARM',
        name: 'Marcus Armstrong',
        nationality: 'New Zealander',
        team: 'Hitech Grand Prix',
        teamColor: '#D4D4D8',
      },
      {
        pos: 14,
        points: 40,
        wins: 0,
        code: 'NOV',
        name: 'Clément Novalak',
        nationality: 'French',
        team: 'MP Motorsport',
        teamColor: '#FF8800',
      },
      {
        pos: 15,
        points: 40,
        wins: 0,
        code: 'BOS',
        name: 'Ralph Boschung',
        nationality: 'Swiss',
        team: 'Campos Racing',
        teamColor: '#FF7700',
      },
      {
        pos: 16,
        points: 26,
        wins: 0,
        code: 'HUG',
        name: 'Jake Hughes',
        nationality: 'British',
        team: 'Van Amersfoort Racing',
        teamColor: '#EA580C',
      },
      {
        pos: 17,
        points: 26,
        wins: 0,
        code: 'CRD',
        name: 'Amaury Cordeel',
        nationality: 'Belgian',
        team: 'Van Amersfoort Racing',
        teamColor: '#EA580C',
      },
      {
        pos: 18,
        points: 25,
        wins: 0,
        code: 'BEC',
        name: 'David Beckmann',
        nationality: 'German',
        team: 'Van Amersfoort Racing',
        teamColor: '#EA580C',
      },
      {
        pos: 19,
        points: 20,
        wins: 0,
        code: 'NIS',
        name: 'Roy Nissany',
        nationality: 'Israeli',
        team: 'DAMS',
        teamColor: '#0099FF',
      },
      {
        pos: 20,
        points: 15,
        wins: 0,
        code: 'MER',
        name: 'Roberto Merhi',
        nationality: 'Spanish',
        team: 'Campos Racing',
        teamColor: '#FF7700',
      },
    ],
    constructors: [
      { pos: 1, points: 305, wins: 5, name: 'MP Motorsport', teamColor: '#FF8800' },
      { pos: 2, points: 297, wins: 6, name: 'Carlin', teamColor: '#002F6C' },
      { pos: 3, points: 281, wins: 4, name: 'ART Grand Prix', teamColor: '#0059B3' },
      { pos: 4, points: 241, wins: 3, name: 'PREMA Racing', teamColor: '#DC0000' },
      { pos: 5, points: 207, wins: 4, name: 'Hitech Grand Prix', teamColor: '#D4D4D8' },
      { pos: 6, points: 161, wins: 2, name: 'DAMS', teamColor: '#0099FF' },
      { pos: 7, points: 134, wins: 3, name: 'Virtuosi Racing', teamColor: '#FFE000' },
      { pos: 8, points: 130, wins: 0, name: 'Charouz Racing System', teamColor: '#881337' },
      { pos: 9, points: 108, wins: 1, name: 'Trident', teamColor: '#2563EB' },
      { pos: 10, points: 73, wins: 0, name: 'Van Amersfoort Racing', teamColor: '#EA580C' },
      { pos: 11, points: 67, wins: 0, name: 'Campos Racing', teamColor: '#FF7700' },
    ],
  },
  2021: {
    drivers: [
      {
        pos: 1,
        points: 252.5,
        wins: 6,
        code: 'PIA',
        name: 'Oscar Piastri',
        nationality: 'Australian',
        team: 'PREMA Racing',
        teamColor: '#DC0000',
      },
      {
        pos: 2,
        points: 192,
        wins: 2,
        code: 'SHW',
        name: 'Robert Shwartzman',
        nationality: 'Russian',
        team: 'PREMA Racing',
        teamColor: '#DC0000',
      },
      {
        pos: 3,
        points: 183,
        wins: 4,
        code: 'ZHO',
        name: 'Guanyu Zhou',
        nationality: 'Chinese',
        team: 'UNI-Virtuosi',
        teamColor: '#FFE000',
      },
      {
        pos: 4,
        points: 159.5,
        wins: 2,
        code: 'TIC',
        name: 'Dan Ticktum',
        nationality: 'British',
        team: 'Carlin',
        teamColor: '#002F6C',
      },
      {
        pos: 5,
        points: 140,
        wins: 2,
        code: 'POU',
        name: 'Théo Pourchaire',
        nationality: 'French',
        team: 'ART Grand Prix',
        teamColor: '#0059B3',
      },
      {
        pos: 6,
        points: 138,
        wins: 2,
        code: 'VIP',
        name: 'Jüri Vips',
        nationality: 'Estonian',
        team: 'Hitech Grand Prix',
        teamColor: '#D4D4D8',
      },
      {
        pos: 7,
        points: 113,
        wins: 2,
        code: 'DAR',
        name: 'Jehan Daruvala',
        nationality: 'Indian',
        team: 'Carlin',
        teamColor: '#002F6C',
      },
      {
        pos: 8,
        points: 105.5,
        wins: 0,
        code: 'DRU',
        name: 'Felipe Drugovich',
        nationality: 'Brazilian',
        team: 'UNI-Virtuosi',
        teamColor: '#FFE000',
      },
      {
        pos: 9,
        points: 103,
        wins: 1,
        code: 'LAW',
        name: 'Liam Lawson',
        nationality: 'New Zealander',
        team: 'Hitech Grand Prix',
        teamColor: '#D4D4D8',
      },
      {
        pos: 10,
        points: 59.5,
        wins: 0,
        code: 'BOS',
        name: 'Ralph Boschung',
        nationality: 'Swiss',
        team: 'Campos Racing',
        teamColor: '#FF7700',
      },
      {
        pos: 11,
        points: 56,
        wins: 1,
        code: 'VER',
        name: 'Richard Verschoor',
        nationality: 'Dutch',
        team: 'MP Motorsport',
        teamColor: '#FF8800',
      },
      {
        pos: 12,
        points: 50,
        wins: 0,
        code: 'LUN',
        name: 'Christian Lundgaard',
        nationality: 'Danish',
        team: 'ART Grand Prix',
        teamColor: '#0059B3',
      },
      {
        pos: 13,
        points: 49,
        wins: 1,
        code: 'ARM',
        name: 'Marcus Armstrong',
        nationality: 'New Zealander',
        team: 'DAMS',
        teamColor: '#0099FF',
      },
      {
        pos: 14,
        points: 34,
        wins: 0,
        code: 'VIS',
        name: 'Bent Viscaal',
        nationality: 'Dutch',
        team: 'Trident',
        teamColor: '#2563EB',
      },
      {
        pos: 15,
        points: 32,
        wins: 0,
        code: 'BEC',
        name: 'David Beckmann',
        nationality: 'German',
        team: 'Campos Racing',
        teamColor: '#FF7700',
      },
      {
        pos: 16,
        points: 16,
        wins: 0,
        code: 'NIS',
        name: 'Roy Nissany',
        nationality: 'Israeli',
        team: 'DAMS',
        teamColor: '#0099FF',
      },
      {
        pos: 17,
        points: 13,
        wins: 0,
        code: 'ZEN',
        name: 'Lirim Zendeli',
        nationality: 'German',
        team: 'MP Motorsport',
        teamColor: '#FF8800',
      },
      {
        pos: 18,
        points: 8,
        wins: 0,
        code: 'HUG',
        name: 'Jake Hughes',
        nationality: 'British',
        team: 'HWA RACELAB',
        teamColor: '#F472B6',
      },
      {
        pos: 19,
        points: 7,
        wins: 0,
        code: 'DOO',
        name: 'Jack Doohan',
        nationality: 'Australian',
        team: 'MP Motorsport',
        teamColor: '#FF8800',
      },
      {
        pos: 20,
        points: 2,
        wins: 0,
        code: 'FIT',
        name: 'Enzo Fittipaldi',
        nationality: 'Brazilian',
        team: 'Charouz Racing System',
        teamColor: '#881337',
      },
    ],
    constructors: [
      { pos: 1, points: 444.5, wins: 8, name: 'PREMA Racing', teamColor: '#DC0000' },
      { pos: 2, points: 288.5, wins: 4, name: 'UNI-Virtuosi', teamColor: '#FFE000' },
      { pos: 3, points: 272.5, wins: 4, name: 'Carlin', teamColor: '#002F6C' },
      { pos: 4, points: 241, wins: 3, name: 'Hitech Grand Prix', teamColor: '#D4D4D8' },
      { pos: 5, points: 190, wins: 2, name: 'ART Grand Prix', teamColor: '#0059B3' },
      { pos: 6, points: 76, wins: 1, name: 'MP Motorsport', teamColor: '#FF8800' },
      { pos: 7, points: 66.5, wins: 0, name: 'Campos Racing', teamColor: '#FF7700' },
      { pos: 8, points: 65, wins: 1, name: 'DAMS', teamColor: '#0099FF' },
      { pos: 9, points: 35, wins: 0, name: 'Trident', teamColor: '#2563EB' },
      { pos: 10, points: 28, wins: 0, name: 'Charouz Racing System', teamColor: '#881337' },
      { pos: 11, points: 9, wins: 0, name: 'HWA RACELAB', teamColor: '#F472B6' },
    ],
  },
  2020: {
    drivers: [
      {
        pos: 1,
        points: 215,
        wins: 2,
        code: 'MSC',
        name: 'Mick Schumacher',
        nationality: 'German',
        team: 'PREMA Racing',
        teamColor: '#DC0000',
      },
      {
        pos: 2,
        points: 201,
        wins: 3,
        code: 'ILO',
        name: 'Callum Ilott',
        nationality: 'British',
        team: 'UNI-Virtuosi',
        teamColor: '#FFE000',
      },
      {
        pos: 3,
        points: 200,
        wins: 3,
        code: 'TSU',
        name: 'Yuki Tsunoda',
        nationality: 'Japanese',
        team: 'Carlin',
        teamColor: '#002F6C',
      },
      {
        pos: 4,
        points: 177,
        wins: 4,
        code: 'SHW',
        name: 'Robert Shwartzman',
        nationality: 'Russian',
        team: 'PREMA Racing',
        teamColor: '#DC0000',
      },
      {
        pos: 5,
        points: 164,
        wins: 2,
        code: 'MAZ',
        name: 'Nikita Mazepin',
        nationality: 'Russian',
        team: 'Hitech Grand Prix',
        teamColor: '#D4D4D8',
      },
      {
        pos: 6,
        points: 151.5,
        wins: 1,
        code: 'ZHO',
        name: 'Guanyu Zhou',
        nationality: 'Chinese',
        team: 'UNI-Virtuosi',
        teamColor: '#FFE000',
      },
      {
        pos: 7,
        points: 149,
        wins: 2,
        code: 'LUN',
        name: 'Christian Lundgaard',
        nationality: 'Danish',
        team: 'ART Grand Prix',
        teamColor: '#0059B3',
      },
      {
        pos: 8,
        points: 134,
        wins: 0,
        code: 'DEL',
        name: 'Louis Delétraz',
        nationality: 'Swiss',
        team: 'Charouz Racing System',
        teamColor: '#881337',
      },
      {
        pos: 9,
        points: 121,
        wins: 3,
        code: 'DRU',
        name: 'Felipe Drugovich',
        nationality: 'Brazilian',
        team: 'MP Motorsport',
        teamColor: '#FF8800',
      },
      {
        pos: 10,
        points: 106,
        wins: 1,
        code: 'GHI',
        name: 'Luca Ghiotto',
        nationality: 'Italian',
        team: 'Hitech Grand Prix',
        teamColor: '#D4D4D8',
      },
      {
        pos: 11,
        points: 96.5,
        wins: 1,
        code: 'TIC',
        name: 'Dan Ticktum',
        nationality: 'British',
        team: 'DAMS',
        teamColor: '#0099FF',
      },
      {
        pos: 12,
        points: 72,
        wins: 1,
        code: 'DAR',
        name: 'Jehan Daruvala',
        nationality: 'Indian',
        team: 'Carlin',
        teamColor: '#002F6C',
      },
      {
        pos: 13,
        points: 52,
        wins: 0,
        code: 'ARM',
        name: 'Marcus Armstrong',
        nationality: 'New Zealander',
        team: 'ART Grand Prix',
        teamColor: '#0059B3',
      },
      {
        pos: 14,
        points: 48,
        wins: 0,
        code: 'AIT',
        name: 'Jack Aitken',
        nationality: 'British',
        team: 'Campos Racing',
        teamColor: '#FF7700',
      },
      {
        pos: 15,
        points: 42,
        wins: 1,
        code: 'MAT',
        name: 'Nobuharu Matsushita',
        nationality: 'Japanese',
        team: 'MP Motorsport',
        teamColor: '#FF8800',
      },
    ],
    constructors: [
      { pos: 1, points: 392, wins: 6, name: 'PREMA Racing', teamColor: '#DC0000' },
      { pos: 2, points: 352.5, wins: 4, name: 'UNI-Virtuosi', teamColor: '#FFE000' },
      { pos: 3, points: 272, wins: 4, name: 'Carlin', teamColor: '#002F6C' },
      { pos: 4, points: 270, wins: 3, name: 'Hitech Grand Prix', teamColor: '#D4D4D8' },
      { pos: 5, points: 201, wins: 2, name: 'ART Grand Prix', teamColor: '#0059B3' },
      { pos: 6, points: 167, wins: 4, name: 'MP Motorsport', teamColor: '#FF8800' },
      { pos: 7, points: 137, wins: 0, name: 'Charouz Racing System', teamColor: '#881337' },
      { pos: 8, points: 115.5, wins: 1, name: 'DAMS', teamColor: '#0099FF' },
      { pos: 9, points: 48, wins: 0, name: 'Campos Racing', teamColor: '#FF7700' },
      { pos: 10, points: 13, wins: 0, name: 'BWT HWA RACELAB', teamColor: '#F472B6' },
      { pos: 11, points: 6, wins: 0, name: 'Trident', teamColor: '#2563EB' },
    ],
  },
  2019: {
    drivers: [
      {
        pos: 1,
        points: 266,
        wins: 4,
        code: 'DEV',
        name: 'Nyck de Vries',
        nationality: 'Dutch',
        team: 'ART Grand Prix',
        teamColor: '#0059B3',
      },
      {
        pos: 2,
        points: 214,
        wins: 4,
        code: 'LAT',
        name: 'Nicholas Latifi',
        nationality: 'Canadian',
        team: 'DAMS',
        teamColor: '#0099FF',
      },
      {
        pos: 3,
        points: 207,
        wins: 4,
        code: 'GHI',
        name: 'Luca Ghiotto',
        nationality: 'Italian',
        team: 'UNI-Virtuosi',
        teamColor: '#FFE000',
      },
      {
        pos: 4,
        points: 204,
        wins: 2,
        code: 'SET',
        name: 'Sérgio Sette Câmara',
        nationality: 'Brazilian',
        team: 'DAMS',
        teamColor: '#0099FF',
      },
      {
        pos: 5,
        points: 159,
        wins: 3,
        code: 'AIT',
        name: 'Jack Aitken',
        nationality: 'British',
        team: 'Campos Racing',
        teamColor: '#FF7700',
      },
      {
        pos: 6,
        points: 144,
        wins: 2,
        code: 'MAT',
        name: 'Nobuharu Matsushita',
        nationality: 'Japanese',
        team: 'Carlin',
        teamColor: '#002F6C',
      },
      {
        pos: 7,
        points: 140,
        wins: 0,
        code: 'ZHO',
        name: 'Guanyu Zhou',
        nationality: 'Chinese',
        team: 'UNI-Virtuosi',
        teamColor: '#FFE000',
      },
      {
        pos: 8,
        points: 92,
        wins: 0,
        code: 'DEL',
        name: 'Louis Delétraz',
        nationality: 'Swiss',
        team: 'Carlin',
        teamColor: '#002F6C',
      },
      {
        pos: 9,
        points: 79,
        wins: 0,
        code: 'KIN',
        name: 'Jordan King',
        nationality: 'British',
        team: 'MP Motorsport',
        teamColor: '#FF8800',
      },
      {
        pos: 10,
        points: 77,
        wins: 2,
        code: 'HUB',
        name: 'Anthoine Hubert',
        nationality: 'French',
        team: 'BWT Arden',
        teamColor: '#F472B6',
      },
      {
        pos: 11,
        points: 74,
        wins: 0,
        code: 'ILO',
        name: 'Callum Ilott',
        nationality: 'British',
        team: 'Sauber Junior Team by Charouz',
        teamColor: '#881337',
      },
      {
        pos: 12,
        points: 53,
        wins: 1,
        code: 'MSC',
        name: 'Mick Schumacher',
        nationality: 'German',
        team: 'PREMA Racing',
        teamColor: '#DC0000',
      },
      {
        pos: 13,
        points: 36,
        wins: 0,
        code: 'COR',
        name: 'Juan Manuel Correa',
        nationality: 'American',
        team: 'Sauber Junior Team by Charouz',
        teamColor: '#881337',
      },
      {
        pos: 14,
        points: 30,
        wins: 0,
        code: 'BOC',
        name: 'Dorian Boccolacci',
        nationality: 'French',
        team: 'Campos Racing',
        teamColor: '#FF7700',
      },
      {
        pos: 15,
        points: 20,
        wins: 0,
        code: 'ALE',
        name: 'Giuliano Alesi',
        nationality: 'French',
        team: 'Trident',
        teamColor: '#2563EB',
      },
    ],
    constructors: [
      { pos: 1, points: 418, wins: 6, name: 'DAMS', teamColor: '#0099FF' },
      { pos: 2, points: 347, wins: 4, name: 'UNI-Virtuosi', teamColor: '#FFE000' },
      { pos: 3, points: 277, wins: 4, name: 'ART Grand Prix', teamColor: '#0059B3' },
      { pos: 4, points: 236, wins: 2, name: 'Carlin', teamColor: '#002F6C' },
      { pos: 5, points: 189, wins: 3, name: 'Campos Racing', teamColor: '#FF7700' },
      { pos: 6, points: 110, wins: 0, name: 'Sauber Junior Team by Charouz', teamColor: '#881337' },
      { pos: 7, points: 96, wins: 0, name: 'MP Motorsport', teamColor: '#FF8800' },
      { pos: 8, points: 77, wins: 2, name: 'BWT Arden', teamColor: '#F472B6' },
      { pos: 9, points: 68, wins: 1, name: 'PREMA Racing', teamColor: '#DC0000' },
      { pos: 10, points: 23, wins: 0, name: 'Trident', teamColor: '#2563EB' },
    ],
  },
  2018: {
    drivers: [
      {
        pos: 1,
        points: 287,
        wins: 7,
        code: 'RUS',
        name: 'George Russell',
        nationality: 'British',
        team: 'ART Grand Prix',
        teamColor: '#0059B3',
      },
      {
        pos: 2,
        points: 219,
        wins: 1,
        code: 'NOR',
        name: 'Lando Norris',
        nationality: 'British',
        team: 'Carlin',
        teamColor: '#002F6C',
      },
      {
        pos: 3,
        points: 212,
        wins: 4,
        code: 'ALB',
        name: 'Alexander Albon',
        nationality: 'Thai',
        team: 'DAMS',
        teamColor: '#0099FF',
      },
      {
        pos: 4,
        points: 202,
        wins: 3,
        code: 'DEV',
        name: 'Nyck de Vries',
        nationality: 'Dutch',
        team: 'PERTAMINA PREMA Theodore Racing',
        teamColor: '#DC0000',
      },
      {
        pos: 5,
        points: 186,
        wins: 3,
        code: 'MAR',
        name: 'Artem Markelov',
        nationality: 'Russian',
        team: 'Russian Time',
        teamColor: '#1D4ED8',
      },
      {
        pos: 6,
        points: 164,
        wins: 0,
        code: 'SET',
        name: 'Sérgio Sette Câmara',
        nationality: 'Brazilian',
        team: 'Carlin',
        teamColor: '#002F6C',
      },
      {
        pos: 7,
        points: 141,
        wins: 2,
        code: 'FUO',
        name: 'Antonio Fuoco',
        nationality: 'Italian',
        team: 'Charouz Racing System',
        teamColor: '#881337',
      },
      {
        pos: 8,
        points: 111,
        wins: 0,
        code: 'GHI',
        name: 'Luca Ghiotto',
        nationality: 'Italian',
        team: 'Campos Vextec Racing',
        teamColor: '#FF7700',
      },
      {
        pos: 9,
        points: 105,
        wins: 0,
        code: 'ROW',
        name: 'Oliver Rowland',
        nationality: 'British',
        team: 'DAMS',
        teamColor: '#0099FF',
      },
      {
        pos: 10,
        points: 91,
        wins: 1,
        code: 'LAT',
        name: 'Nicholas Latifi',
        nationality: 'Canadian',
        team: 'DAMS',
        teamColor: '#0099FF',
      },
      {
        pos: 11,
        points: 74,
        wins: 0,
        code: 'DEL',
        name: 'Louis Delétraz',
        nationality: 'Swiss',
        team: 'Charouz Racing System',
        teamColor: '#881337',
      },
      {
        pos: 12,
        points: 63,
        wins: 1,
        code: 'AIT',
        name: 'Jack Aitken',
        nationality: 'British',
        team: 'ART Grand Prix',
        teamColor: '#0059B3',
      },
      {
        pos: 13,
        points: 61,
        wins: 0,
        code: 'MER',
        name: 'Roberto Merhi',
        nationality: 'Spanish',
        team: 'Campos Vextec Racing',
        teamColor: '#FF7700',
      },
      {
        pos: 14,
        points: 48,
        wins: 1,
        code: 'MAK',
        name: 'Tadasuke Makino',
        nationality: 'Japanese',
        team: 'Russian Time',
        teamColor: '#1D4ED8',
      },
      {
        pos: 15,
        points: 29,
        wins: 0,
        code: 'GEL',
        name: 'Sean Gelael',
        nationality: 'Indonesian',
        team: 'PERTAMINA PREMA Theodore Racing',
        teamColor: '#DC0000',
      },
    ],
    constructors: [
      { pos: 1, points: 383, wins: 1, name: 'Carlin', teamColor: '#002F6C' },
      { pos: 2, points: 350, wins: 8, name: 'ART Grand Prix', teamColor: '#0059B3' },
      { pos: 3, points: 303, wins: 5, name: 'DAMS', teamColor: '#0099FF' },
      { pos: 4, points: 234, wins: 4, name: 'Russian Time', teamColor: '#1D4ED8' },
      {
        pos: 5,
        points: 231,
        wins: 3,
        name: 'PERTAMINA PREMA Theodore Racing',
        teamColor: '#DC0000',
      },
      { pos: 6, points: 215, wins: 2, name: 'Charouz Racing System', teamColor: '#881337' },
      { pos: 7, points: 132, wins: 0, name: 'Campos Vextec Racing', teamColor: '#FF7700' },
      { pos: 8, points: 61, wins: 1, name: 'MP Motorsport', teamColor: '#FF8800' },
      { pos: 9, points: 43, wins: 1, name: 'BWT Arden', teamColor: '#F472B6' },
      { pos: 10, points: 37, wins: 0, name: 'Trident', teamColor: '#2563EB' },
    ],
  },
  2017: {
    drivers: [
      {
        pos: 1,
        points: 282,
        wins: 8,
        code: 'LEC',
        name: 'Charles Leclerc',
        nationality: 'Monegasque',
        team: 'PREMA Racing',
        teamColor: '#DC0000',
      },
      {
        pos: 2,
        points: 210,
        wins: 5,
        code: 'MAR',
        name: 'Artem Markelov',
        nationality: 'Russian',
        team: 'Russian Time',
        teamColor: '#1D4ED8',
      },
      {
        pos: 3,
        points: 191,
        wins: 2,
        code: 'ROW',
        name: 'Oliver Rowland',
        nationality: 'British',
        team: 'DAMS',
        teamColor: '#0099FF',
      },
      {
        pos: 4,
        points: 185,
        wins: 1,
        code: 'GHI',
        name: 'Luca Ghiotto',
        nationality: 'Italian',
        team: 'Russian Time',
        teamColor: '#1D4ED8',
      },
      {
        pos: 5,
        points: 178,
        wins: 1,
        code: 'LAT',
        name: 'Nicholas Latifi',
        nationality: 'Canadian',
        team: 'DAMS',
        teamColor: '#0099FF',
      },
      {
        pos: 6,
        points: 131,
        wins: 2,
        code: 'MAT',
        name: 'Nobuharu Matsushita',
        nationality: 'Japanese',
        team: 'ART Grand Prix',
        teamColor: '#0059B3',
      },
      {
        pos: 7,
        points: 114,
        wins: 1,
        code: 'DEV',
        name: 'Nyck de Vries',
        nationality: 'Dutch',
        team: 'Racing Engineering',
        teamColor: '#DC2626',
      },
      {
        pos: 8,
        points: 98,
        wins: 1,
        code: 'FUO',
        name: 'Antonio Fuoco',
        nationality: 'Italian',
        team: 'PREMA Racing',
        teamColor: '#DC0000',
      },
      {
        pos: 9,
        points: 91,
        wins: 1,
        code: 'NAT',
        name: 'Norman Nato',
        nationality: 'French',
        team: 'Pertamina Arden',
        teamColor: '#EF4444',
      },
      {
        pos: 10,
        points: 86,
        wins: 0,
        code: 'ALB',
        name: 'Alexander Albon',
        nationality: 'Thai',
        team: 'ART Grand Prix',
        teamColor: '#0059B3',
      },
      {
        pos: 11,
        points: 62,
        wins: 0,
        code: 'KIN',
        name: 'Jordan King',
        nationality: 'British',
        team: 'MP Motorsport',
        teamColor: '#FF8800',
      },
      {
        pos: 12,
        points: 44,
        wins: 0,
        code: 'MAL',
        name: 'Gustav Malja',
        nationality: 'Swedish',
        team: 'Racing Engineering',
        teamColor: '#DC2626',
      },
      {
        pos: 13,
        points: 21,
        wins: 0,
        code: 'CAN',
        name: 'Sergio Canamasas',
        nationality: 'Spanish',
        team: 'Rapax',
        teamColor: '#EAB308',
      },
      {
        pos: 14,
        points: 17,
        wins: 0,
        code: 'GEL',
        name: 'Sean Gelael',
        nationality: 'Indonesian',
        team: 'Pertamina Arden',
        teamColor: '#EF4444',
      },
      {
        pos: 15,
        points: 16,
        wins: 0,
        code: 'CEC',
        name: 'Johnny Cecotto Jr.',
        nationality: 'Venezuelan',
        team: 'Rapax',
        teamColor: '#EAB308',
      },
    ],
    constructors: [
      { pos: 1, points: 395, wins: 6, name: 'Russian Time', teamColor: '#1D4ED8' },
      { pos: 2, points: 380, wins: 9, name: 'PREMA Racing', teamColor: '#DC0000' },
      { pos: 3, points: 369, wins: 3, name: 'DAMS', teamColor: '#0099FF' },
      { pos: 4, points: 222, wins: 2, name: 'ART Grand Prix', teamColor: '#0059B3' },
      { pos: 5, points: 137, wins: 1, name: 'Rapax', teamColor: '#EAB308' },
      { pos: 6, points: 109, wins: 0, name: 'MP Motorsport', teamColor: '#FF8800' },
      { pos: 7, points: 108, wins: 1, name: 'Pertamina Arden', teamColor: '#EF4444' },
      { pos: 8, points: 87, wins: 1, name: 'Racing Engineering', teamColor: '#DC2626' },
      { pos: 9, points: 17, wins: 0, name: 'Campos Racing', teamColor: '#FF7700' },
      { pos: 10, points: 9, wins: 0, name: 'Trident', teamColor: '#2563EB' },
    ],
  },
};

const F3_HISTORICAL_STANDINGS: Record<
  number,
  { drivers: JolpicaDriverStanding[]; constructors: JolpicaConstructorStanding[] }
> = {
  2023: {
    drivers: [
      {
        pos: 1,
        points: 164,
        wins: 2,
        code: 'BOR',
        name: 'Gabriel Bortoleto',
        nationality: 'Brazilian',
        team: 'Trident',
        teamColor: '#2563EB',
      },
      {
        pos: 2,
        points: 119,
        wins: 4,
        code: 'OSU',
        name: "Zak O'Sullivan",
        nationality: 'British',
        team: 'PREMA Racing',
        teamColor: '#DC0000',
      },
      {
        pos: 3,
        points: 112,
        wins: 1,
        code: 'ARO',
        name: 'Paul Aron',
        nationality: 'Estonian',
        team: 'PREMA Racing',
        teamColor: '#DC0000',
      },
      {
        pos: 4,
        points: 110,
        wins: 2,
        code: 'COL',
        name: 'Franco Colapinto',
        nationality: 'Argentine',
        team: 'MP Motorsport',
        teamColor: '#FF8800',
      },
      {
        pos: 5,
        points: 105,
        wins: 3,
        code: 'MAR',
        name: 'Pepe Martí',
        nationality: 'Spanish',
        team: 'Campos Racing',
        teamColor: '#FF7700',
      },
      {
        pos: 6,
        points: 96,
        wins: 0,
        code: 'BEG',
        name: 'Dino Beganovic',
        nationality: 'Swedish',
        team: 'PREMA Racing',
        teamColor: '#DC0000',
      },
      {
        pos: 7,
        points: 92,
        wins: 2,
        code: 'MIN',
        name: 'Gabriele Minì',
        nationality: 'Italian',
        team: 'Hitech Pulse-Eight',
        teamColor: '#D4D4D8',
      },
      {
        pos: 8,
        points: 75,
        wins: 1,
        code: 'GOE',
        name: 'Oliver Goethe',
        nationality: 'German',
        team: 'Trident',
        teamColor: '#2563EB',
      },
      {
        pos: 9,
        points: 72,
        wins: 1,
        code: 'BAR',
        name: 'Taylor Barnard',
        nationality: 'British',
        team: 'Jenzer Motorsport',
        teamColor: '#10B981',
      },
      {
        pos: 10,
        points: 69,
        wins: 0,
        code: 'FOR',
        name: 'Leonardo Fornaroli',
        nationality: 'Italian',
        team: 'Trident',
        teamColor: '#2563EB',
      },
      {
        pos: 11,
        points: 60,
        wins: 0,
        code: 'MAN',
        name: 'Christian Mansell',
        nationality: 'Australian',
        team: 'Campos Racing',
        teamColor: '#FF7700',
      },
      {
        pos: 12,
        points: 54,
        wins: 0,
        code: 'SAU',
        name: 'Grégoire Saucy',
        nationality: 'Swiss',
        team: 'ART Grand Prix',
        teamColor: '#0059B3',
      },
      {
        pos: 13,
        points: 41,
        wins: 0,
        code: 'BRO',
        name: 'Luke Browning',
        nationality: 'British',
        team: 'Hitech Pulse-Eight',
        teamColor: '#D4D4D8',
      },
      {
        pos: 14,
        points: 37,
        wins: 0,
        code: 'MON',
        name: 'Sebastián Montoya',
        nationality: 'Colombian',
        team: 'Hitech Pulse-Eight',
        teamColor: '#D4D4D8',
      },
      {
        pos: 15,
        points: 29,
        wins: 0,
        code: 'BOY',
        name: 'Mari Boya',
        nationality: 'Spanish',
        team: 'MP Motorsport',
        teamColor: '#FF8800',
      },
      {
        pos: 16,
        points: 6,
        wins: 0,
        code: 'TSO',
        name: 'Nikola Tsolov',
        nationality: 'Bulgarian',
        team: 'ART Grand Prix',
        teamColor: '#0059B3',
      },
    ],
    constructors: [
      { pos: 1, points: 327, wins: 5, name: 'PREMA Racing', teamColor: '#DC0000' },
      { pos: 2, points: 308, wins: 3, name: 'Trident', teamColor: '#2563EB' },
      { pos: 3, points: 194, wins: 2, name: 'MP Motorsport', teamColor: '#FF8800' },
      { pos: 4, points: 179, wins: 3, name: 'Campos Racing', teamColor: '#FF7700' },
      { pos: 5, points: 170, wins: 2, name: 'Hitech Pulse-Eight', teamColor: '#D4D4D8' },
      { pos: 6, points: 108, wins: 1, name: 'Jenzer Motorsport', teamColor: '#10B981' },
      { pos: 7, points: 71, wins: 0, name: 'ART Grand Prix', teamColor: '#0059B3' },
      { pos: 8, points: 57, wins: 0, name: 'Van Amersfoort Racing', teamColor: '#EA580C' },
      { pos: 9, points: 2, wins: 0, name: 'Rodin Carlin', teamColor: '#002F6C' },
      { pos: 10, points: 0, wins: 0, name: 'PHM Racing by Charouz', teamColor: '#881337' },
    ],
  },
  2022: {
    drivers: [
      {
        pos: 1,
        points: 139,
        wins: 2,
        code: 'MAR',
        name: 'Victor Martins',
        nationality: 'French',
        team: 'ART Grand Prix',
        teamColor: '#0059B3',
      },
      {
        pos: 2,
        points: 134,
        wins: 3,
        code: 'MAL',
        name: 'Zane Maloney',
        nationality: 'Barbadian',
        team: 'Trident',
        teamColor: '#2563EB',
      },
      {
        pos: 3,
        points: 132,
        wins: 1,
        code: 'BEA',
        name: 'Oliver Bearman',
        nationality: 'British',
        team: 'PREMA Racing',
        teamColor: '#DC0000',
      },
      {
        pos: 4,
        points: 123,
        wins: 3,
        code: 'HAD',
        name: 'Isack Hadjar',
        nationality: 'French',
        team: 'Hitech Grand Prix',
        teamColor: '#D4D4D8',
      },
      {
        pos: 5,
        points: 117,
        wins: 1,
        code: 'STA',
        name: 'Roman Staněk',
        nationality: 'Czech',
        team: 'Trident',
        teamColor: '#2563EB',
      },
      {
        pos: 6,
        points: 114,
        wins: 1,
        code: 'LEC',
        name: 'Arthur Leclerc',
        nationality: 'Monegasque',
        team: 'PREMA Racing',
        teamColor: '#DC0000',
      },
      {
        pos: 7,
        points: 109,
        wins: 1,
        code: 'CRA',
        name: 'Jak Crawford',
        nationality: 'American',
        team: 'PREMA Racing',
        teamColor: '#DC0000',
      },
      {
        pos: 8,
        points: 88,
        wins: 2,
        code: 'CLT',
        name: 'Caio Collet',
        nationality: 'Brazilian',
        team: 'MP Motorsport',
        teamColor: '#FF8800',
      },
      {
        pos: 9,
        points: 76,
        wins: 2,
        code: 'COL',
        name: 'Franco Colapinto',
        nationality: 'Argentine',
        team: 'Van Amersfoort Racing',
        teamColor: '#EA580C',
      },
      {
        pos: 10,
        points: 76,
        wins: 1,
        code: 'SMO',
        name: 'Alexander Smolyar',
        nationality: 'Russian',
        team: 'MP Motorsport',
        teamColor: '#FF8800',
      },
      {
        pos: 11,
        points: 54,
        wins: 0,
        code: 'OSU',
        name: "Zak O'Sullivan",
        nationality: 'British',
        team: 'Carlin',
        teamColor: '#002F6C',
      },
      {
        pos: 12,
        points: 46,
        wins: 0,
        code: 'EDG',
        name: 'Jonny Edgar',
        nationality: 'British',
        team: 'Trident',
        teamColor: '#2563EB',
      },
      {
        pos: 13,
        points: 39,
        wins: 0,
        code: 'COR',
        name: 'Juan Manuel Correa',
        nationality: 'American',
        team: 'ART Grand Prix',
        teamColor: '#0059B3',
      },
      {
        pos: 14,
        points: 31,
        wins: 0,
        code: 'MAI',
        name: 'Kush Maini',
        nationality: 'Indian',
        team: 'MP Motorsport',
        teamColor: '#FF8800',
      },
      {
        pos: 15,
        points: 30,
        wins: 0,
        code: 'SAU',
        name: 'Grégoire Saucy',
        nationality: 'Swiss',
        team: 'ART Grand Prix',
        teamColor: '#0059B3',
      },
    ],
    constructors: [
      { pos: 1, points: 355, wins: 3, name: 'PREMA Racing', teamColor: '#DC0000' },
      { pos: 2, points: 301, wins: 4, name: 'Trident', teamColor: '#2563EB' },
      { pos: 3, points: 208, wins: 2, name: 'ART Grand Prix', teamColor: '#0059B3' },
      { pos: 4, points: 150, wins: 3, name: 'Hitech Grand Prix', teamColor: '#D4D4D8' },
      { pos: 5, points: 145, wins: 2, name: 'MP Motorsport', teamColor: '#FF8800' },
      { pos: 6, points: 91, wins: 2, name: 'Van Amersfoort Racing', teamColor: '#EA580C' },
      { pos: 7, points: 57, wins: 0, name: 'Carlin', teamColor: '#002F6C' },
      { pos: 8, points: 53, wins: 1, name: 'Campos Racing', teamColor: '#FF7700' },
      { pos: 9, points: 26, wins: 0, name: 'Jenzer Motorsport', teamColor: '#10B981' },
      { pos: 10, points: 1, wins: 0, name: 'Charouz Racing System', teamColor: '#881337' },
    ],
  },
  2021: {
    drivers: [
      {
        pos: 1,
        points: 205,
        wins: 4,
        code: 'HAU',
        name: 'Dennis Hauger',
        nationality: 'Norwegian',
        team: 'PREMA Racing',
        teamColor: '#DC0000',
      },
      {
        pos: 2,
        points: 179,
        wins: 4,
        code: 'DOO',
        name: 'Jack Doohan',
        nationality: 'Australian',
        team: 'Trident',
        teamColor: '#2563EB',
      },
      {
        pos: 3,
        points: 147,
        wins: 0,
        code: 'NOV',
        name: 'Clément Novalak',
        nationality: 'French',
        team: 'Trident',
        teamColor: '#2563EB',
      },
      {
        pos: 4,
        points: 138,
        wins: 1,
        code: 'VES',
        name: 'Frederik Vesti',
        nationality: 'Danish',
        team: 'ART Grand Prix',
        teamColor: '#0059B3',
      },
      {
        pos: 5,
        points: 131,
        wins: 1,
        code: 'MAR',
        name: 'Victor Martins',
        nationality: 'French',
        team: 'MP Motorsport',
        teamColor: '#FF8800',
      },
      {
        pos: 6,
        points: 107,
        wins: 2,
        code: 'SMO',
        name: 'Alexander Smolyar',
        nationality: 'Russian',
        team: 'ART Grand Prix',
        teamColor: '#0059B3',
      },
      {
        pos: 7,
        points: 102,
        wins: 1,
        code: 'SAR',
        name: 'Logan Sargeant',
        nationality: 'American',
        team: 'Charouz Racing System',
        teamColor: '#881337',
      },
      {
        pos: 8,
        points: 93,
        wins: 1,
        code: 'CAL',
        name: 'Olli Caldwell',
        nationality: 'British',
        team: 'PREMA Racing',
        teamColor: '#DC0000',
      },
      {
        pos: 9,
        points: 93,
        wins: 0,
        code: 'CLT',
        name: 'Caio Collet',
        nationality: 'Brazilian',
        team: 'MP Motorsport',
        teamColor: '#FF8800',
      },
      {
        pos: 10,
        points: 79,
        wins: 2,
        code: 'LEC',
        name: 'Arthur Leclerc',
        nationality: 'Monegasque',
        team: 'PREMA Racing',
        teamColor: '#DC0000',
      },
      {
        pos: 11,
        points: 55,
        wins: 1,
        code: 'SCH',
        name: 'David Schumacher',
        nationality: 'German',
        team: 'Trident',
        teamColor: '#2563EB',
      },
      {
        pos: 12,
        points: 52,
        wins: 1,
        code: 'IWA',
        name: 'Ayumu Iwasa',
        nationality: 'Japanese',
        team: 'Hitech Grand Prix',
        teamColor: '#D4D4D8',
      },
      {
        pos: 13,
        points: 45,
        wins: 0,
        code: 'CRA',
        name: 'Jak Crawford',
        nationality: 'American',
        team: 'Hitech Grand Prix',
        teamColor: '#D4D4D8',
      },
      {
        pos: 14,
        points: 44,
        wins: 1,
        code: 'NAN',
        name: 'Matteo Nannini',
        nationality: 'Italian',
        team: 'HWA RACELAB',
        teamColor: '#F472B6',
      },
      {
        pos: 15,
        points: 29,
        wins: 0,
        code: 'STA',
        name: 'Roman Staněk',
        nationality: 'Czech',
        team: 'Hitech Grand Prix',
        teamColor: '#D4D4D8',
      },
    ],
    constructors: [
      { pos: 1, points: 381, wins: 5, name: 'Trident', teamColor: '#2563EB' },
      { pos: 2, points: 377, wins: 7, name: 'PREMA Racing', teamColor: '#DC0000' },
      { pos: 3, points: 256, wins: 3, name: 'ART Grand Prix', teamColor: '#0059B3' },
      { pos: 4, points: 224, wins: 1, name: 'MP Motorsport', teamColor: '#FF8800' },
      { pos: 5, points: 127, wins: 1, name: 'Charouz Racing System', teamColor: '#881337' },
      { pos: 6, points: 126, wins: 1, name: 'Hitech Grand Prix', teamColor: '#D4D4D8' },
      { pos: 7, points: 44, wins: 1, name: 'HWA RACELAB', teamColor: '#F472B6' },
      { pos: 8, points: 32, wins: 0, name: 'Campos Racing', teamColor: '#FF7700' },
      { pos: 9, points: 29, wins: 0, name: 'Jenzer Motorsport', teamColor: '#10B981' },
      { pos: 10, points: 25, wins: 0, name: 'Carlin', teamColor: '#002F6C' },
    ],
  },
  2020: {
    drivers: [
      {
        pos: 1,
        points: 164,
        wins: 2,
        code: 'PIA',
        name: 'Oscar Piastri',
        nationality: 'Australian',
        team: 'PREMA Racing',
        teamColor: '#DC0000',
      },
      {
        pos: 2,
        points: 161,
        wins: 2,
        code: 'POU',
        name: 'Théo Pourchaire',
        nationality: 'French',
        team: 'ART Grand Prix',
        teamColor: '#0059B3',
      },
      {
        pos: 3,
        points: 160,
        wins: 2,
        code: 'SAR',
        name: 'Logan Sargeant',
        nationality: 'American',
        team: 'PREMA Racing',
        teamColor: '#DC0000',
      },
      {
        pos: 4,
        points: 146.5,
        wins: 3,
        code: 'VES',
        name: 'Frederik Vesti',
        nationality: 'Danish',
        team: 'PREMA Racing',
        teamColor: '#DC0000',
      },
      {
        pos: 5,
        points: 143,
        wins: 3,
        code: 'LAW',
        name: 'Liam Lawson',
        nationality: 'New Zealander',
        team: 'Hitech Grand Prix',
        teamColor: '#D4D4D8',
      },
      {
        pos: 6,
        points: 139.5,
        wins: 2,
        code: 'BEC',
        name: 'David Beckmann',
        nationality: 'German',
        team: 'Trident',
        teamColor: '#2563EB',
      },
      {
        pos: 7,
        points: 111.5,
        wins: 2,
        code: 'HUG',
        name: 'Jake Hughes',
        nationality: 'British',
        team: 'HWA RACELAB',
        teamColor: '#F472B6',
      },
      {
        pos: 8,
        points: 104,
        wins: 1,
        code: 'ZEN',
        name: 'Lirim Zendeli',
        nationality: 'German',
        team: 'Trident',
        teamColor: '#2563EB',
      },
      {
        pos: 9,
        points: 69,
        wins: 0,
        code: 'VER',
        name: 'Richard Verschoor',
        nationality: 'Dutch',
        team: 'MP Motorsport',
        teamColor: '#FF8800',
      },
      {
        pos: 10,
        points: 59,
        wins: 0,
        code: 'SMO',
        name: 'Alexander Smolyar',
        nationality: 'Russian',
        team: 'ART Grand Prix',
        teamColor: '#0059B3',
      },
      {
        pos: 11,
        points: 45,
        wins: 0,
        code: 'NOV',
        name: 'Clément Novalak',
        nationality: 'French',
        team: 'Carlin',
        teamColor: '#002F6C',
      },
      {
        pos: 12,
        points: 40,
        wins: 1,
        code: 'VIS',
        name: 'Bent Viscaal',
        nationality: 'Dutch',
        team: 'MP Motorsport',
        teamColor: '#FF8800',
      },
      {
        pos: 13,
        points: 31,
        wins: 0,
        code: 'FER',
        name: 'Sebastián Fernández',
        nationality: 'Spanish',
        team: 'ART Grand Prix',
        teamColor: '#0059B3',
      },
      {
        pos: 14,
        points: 27,
        wins: 0,
        code: 'FIT',
        name: 'Enzo Fittipaldi',
        nationality: 'Brazilian',
        team: 'HWA RACELAB',
        teamColor: '#F472B6',
      },
      {
        pos: 15,
        points: 18,
        wins: 0,
        code: 'CAL',
        name: 'Olli Caldwell',
        nationality: 'British',
        team: 'Trident',
        teamColor: '#2563EB',
      },
    ],
    constructors: [
      { pos: 1, points: 470.5, wins: 7, name: 'PREMA Racing', teamColor: '#DC0000' },
      { pos: 2, points: 261.5, wins: 3, name: 'Trident', teamColor: '#2563EB' },
      { pos: 3, points: 251, wins: 2, name: 'ART Grand Prix', teamColor: '#0059B3' },
      { pos: 4, points: 167, wins: 3, name: 'Hitech Grand Prix', teamColor: '#D4D4D8' },
      { pos: 5, points: 138.5, wins: 2, name: 'HWA RACELAB', teamColor: '#F472B6' },
      { pos: 6, points: 109, wins: 1, name: 'MP Motorsport', teamColor: '#FF8800' },
      { pos: 7, points: 46, wins: 0, name: 'Carlin', teamColor: '#002F6C' },
      { pos: 8, points: 11, wins: 0, name: 'Jenzer Motorsport', teamColor: '#10B981' },
      { pos: 9, points: 6, wins: 0, name: 'Campos Racing', teamColor: '#FF7700' },
      { pos: 10, points: 5, wins: 0, name: 'Charouz Racing System', teamColor: '#881337' },
    ],
  },
  2019: {
    drivers: [
      {
        pos: 1,
        points: 212,
        wins: 3,
        code: 'SHW',
        name: 'Robert Shwartzman',
        nationality: 'Russian',
        team: 'PREMA Racing',
        teamColor: '#DC0000',
      },
      {
        pos: 2,
        points: 158,
        wins: 3,
        code: 'ARM',
        name: 'Marcus Armstrong',
        nationality: 'New Zealander',
        team: 'PREMA Racing',
        teamColor: '#DC0000',
      },
      {
        pos: 3,
        points: 157,
        wins: 2,
        code: 'DAR',
        name: 'Jehan Daruvala',
        nationality: 'Indian',
        team: 'PREMA Racing',
        teamColor: '#DC0000',
      },
      {
        pos: 4,
        points: 141,
        wins: 3,
        code: 'VIP',
        name: 'Jüri Vips',
        nationality: 'Estonian',
        team: 'Hitech Grand Prix',
        teamColor: '#D4D4D8',
      },
      {
        pos: 5,
        points: 98,
        wins: 1,
        code: 'PIQ',
        name: 'Pedro Piquet',
        nationality: 'Brazilian',
        team: 'Trident',
        teamColor: '#2563EB',
      },
      {
        pos: 6,
        points: 97,
        wins: 1,
        code: 'LUN',
        name: 'Christian Lundgaard',
        nationality: 'Danish',
        team: 'ART Grand Prix',
        teamColor: '#0059B3',
      },
      {
        pos: 7,
        points: 90,
        wins: 1,
        code: 'HUG',
        name: 'Jake Hughes',
        nationality: 'British',
        team: 'HWA RACELAB',
        teamColor: '#F472B6',
      },
      {
        pos: 8,
        points: 78,
        wins: 1,
        code: 'PUL',
        name: 'Leonardo Pulcini',
        nationality: 'Italian',
        team: 'Hitech Grand Prix',
        teamColor: '#D4D4D8',
      },
      {
        pos: 9,
        points: 67,
        wins: 1,
        code: 'TSU',
        name: 'Yuki Tsunoda',
        nationality: 'Japanese',
        team: 'Jenzer Motorsport',
        teamColor: '#10B981',
      },
      {
        pos: 10,
        points: 57,
        wins: 0,
        code: 'FEW',
        name: 'Max Fewtrell',
        nationality: 'British',
        team: 'ART Grand Prix',
        teamColor: '#0059B3',
      },
      {
        pos: 11,
        points: 41,
        wins: 0,
        code: 'LAW',
        name: 'Liam Lawson',
        nationality: 'New Zealander',
        team: 'MP Motorsport',
        teamColor: '#FF8800',
      },
      {
        pos: 12,
        points: 34,
        wins: 0,
        code: 'VER',
        name: 'Richard Verschoor',
        nationality: 'Dutch',
        team: 'MP Motorsport',
        teamColor: '#FF8800',
      },
      {
        pos: 13,
        points: 20,
        wins: 0,
        code: 'BEC',
        name: 'David Beckmann',
        nationality: 'German',
        team: 'ART Grand Prix',
        teamColor: '#0059B3',
      },
      {
        pos: 14,
        points: 6,
        wins: 0,
        code: 'ZEN',
        name: 'Lirim Zendeli',
        nationality: 'German',
        team: 'Sauber Junior Team by Charouz',
        teamColor: '#881337',
      },
      {
        pos: 15,
        points: 0,
        wins: 0,
        code: 'DEF',
        name: 'Devlin DeFrancesco',
        nationality: 'Canadian',
        team: 'Trident',
        teamColor: '#2563EB',
      },
    ],
    constructors: [
      { pos: 1, points: 527, wins: 8, name: 'PREMA Racing', teamColor: '#DC0000' },
      { pos: 2, points: 223, wins: 4, name: 'Hitech Grand Prix', teamColor: '#D4D4D8' },
      { pos: 3, points: 174, wins: 1, name: 'ART Grand Prix', teamColor: '#0059B3' },
      { pos: 4, points: 125, wins: 1, name: 'Trident', teamColor: '#2563EB' },
      { pos: 5, points: 100, wins: 1, name: 'HWA RACELAB', teamColor: '#F472B6' },
      { pos: 6, points: 77, wins: 0, name: 'MP Motorsport', teamColor: '#FF8800' },
      { pos: 7, points: 67, wins: 1, name: 'Jenzer Motorsport', teamColor: '#10B981' },
      { pos: 8, points: 15, wins: 0, name: 'Sauber Junior Team by Charouz', teamColor: '#881337' },
      { pos: 9, points: 14, wins: 0, name: 'Carlin', teamColor: '#002F6C' },
      { pos: 10, points: 10, wins: 0, name: 'Campos Racing', teamColor: '#FF7700' },
    ],
  },
};

export class JuniorSeriesClient {
  private timeoutMs = 6000;

  private scheduleCache = new Map<string, { timestamp: number; data: JolpicaRace[] }>();
  private standingsCache = new Map<
    string,
    {
      timestamp: number;
      data: {
        drivers: JolpicaDriverStanding[];
        constructors: JolpicaConstructorStanding[];
      };
    }
  >();
  private raceDetailCache = new Map<string, { timestamp: number; data: JuniorRaceDetail | null }>();

  private getTtl(): number {
    const day = new Date().getDay();
    return day === 0 || day === 6 ? 10 * 60 * 1000 : 60 * 60 * 1000;
  }

  private computeDynamicSchedule(races: JolpicaRace[]): JolpicaRace[] {
    const nowMs = Date.now();
    let nextFound = false;

    const updated = races.map((race) => {
      const raceTime = new Date(race.raceDateTime).getTime();
      // A race event is completed once the Sunday race window ends (~3 hours after race start)
      const isPast = !Number.isNaN(raceTime) && raceTime + 3 * 3600 * 1000 < nowMs;
      let isNext = false;

      if (!nextFound && !isPast) {
        isNext = true;
        nextFound = true;
      }

      return {
        ...race,
        isNext,
      };
    });

    return updated;
  }

  private async fetchFom<T>(series: 'f2' | 'f3', path: string): Promise<T | null> {
    const apiKey = FOM_API_KEYS[series];
    try {
      const res = await fetch(`${FOM_BASE_URL}/${series}${path}`, {
        headers: {
          apikey: apiKey,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(this.timeoutMs),
      });

      if (!res.ok) {
        return null;
      }
      return (await res.json()) as T;
    } catch {
      return null;
    }
  }

  public async getSchedule(series: 'f2' | 'f3', year = 2026): Promise<JolpicaRace[]> {
    const cacheKey = `${series}-${year}`;
    const cached = this.scheduleCache.get(cacheKey);
    const ttl = this.getTtl();

    if (cached && Date.now() - cached.timestamp < ttl) {
      return this.computeDynamicSchedule(cached.data);
    }

    const fallback = series === 'f2' ? F2_FALLBACK_SCHEDULE : F3_FALLBACK_SCHEDULE;

    try {
      const res = await this.fetchFom<{ meetings: FomMeeting[] }>(
        series,
        `/meetings?season=${year}`,
      );
      if (res?.meetings && res.meetings.length > 0) {
        const races: JolpicaRace[] = res.meetings.map((m, idx) => {
          const featureSession = m.meetingSessions?.find(
            (s) => s.sessionNumber === 2 || s.shortName === 'Feature Race',
          );
          const startDate = featureSession?.startTime || m.meetingStartDate || '';
          const sessions = (m.meetingSessions || []).map((s) => ({
            name: s.shortName || s.session,
            dateTime: s.startTime || '',
          }));

          return {
            round: idx + 1,
            raceName: `${m.meetingName} (${series.toUpperCase()})`,
            circuitName: m.circuitOfficialName || `${m.meetingLocation} Circuit`,
            locality: m.meetingLocation,
            country: m.meetingCountryName,
            raceDateTime: startDate,
            sessions:
              sessions.length > 0
                ? sessions
                : [
                    { name: 'Sprint Race', dateTime: startDate },
                    { name: 'Feature Race', dateTime: startDate },
                  ],
            isNext: false,
          };
        });

        const dynamicRaces = this.computeDynamicSchedule(races);
        this.scheduleCache.set(cacheKey, { timestamp: Date.now(), data: dynamicRaces });
        return dynamicRaces;
      }
    } catch {
      // Fallback
    }

    const dynamicFallback = this.computeDynamicSchedule(fallback);
    this.scheduleCache.set(cacheKey, {
      timestamp: Date.now(),
      data: dynamicFallback,
    });
    return dynamicFallback;
  }

  public async getStandings(
    series: 'f2' | 'f3',
    year = 2026,
  ): Promise<{
    drivers: JolpicaDriverStanding[];
    constructors: JolpicaConstructorStanding[];
  }> {
    const cacheKey = `${series}-${year}`;
    const cached = this.standingsCache.get(cacheKey);
    const ttl = this.getTtl();

    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data;
    }

    let drivers = series === 'f2' ? F2_FALLBACK_DRIVERS : F3_FALLBACK_DRIVERS;
    let constructors = series === 'f2' ? F2_FALLBACK_CONSTRUCTORS : F3_FALLBACK_CONSTRUCTORS;

    if (year === 2026) {
      try {
        const [dRes, cRes] = await Promise.all([
          this.fetchFom<{ standings: FomDriverStanding[] }>(
            series,
            `/driver-standings-breakdown?season=${year}`,
          ),
          this.fetchFom<{ standings: FomConstructorStanding[] }>(
            series,
            `/constructor-standings-breakdown?season=${year}`,
          ),
        ]);

        if (dRes?.standings && dRes.standings.length > 0) {
          const fallbackList = series === 'f2' ? F2_FALLBACK_DRIVERS : F3_FALLBACK_DRIVERS;
          drivers = dRes.standings.map((d, idx) => {
            const pos = Number(d.displayPosition || d.position?.replace(/\D/g, '') || idx + 1);
            const fullName = `${d.driverFirstName} ${d.driverLastName}`.trim();
            const fallbackDriver = fallbackList.find((fd) => fd.code === d.driverTLA);
            const team = fallbackDriver?.team || 'Junior Team';
            const teamColor = fallbackDriver?.teamColor || getTeamColor(team, series);

            return {
              pos,
              points: Number(d.championshipPoints || 0),
              wins: 0,
              code: d.driverTLA,
              name: fullName,
              nationality: fallbackDriver?.nationality || 'Internacional',
              team,
              teamColor,
            };
          });
        }

        if (cRes?.standings && cRes.standings.length > 0) {
          constructors = cRes.standings.map((c, idx) => {
            const pos = Number(c.displayPosition || c.position?.replace(/\D/g, '') || idx + 1);
            const teamColor = c.teamColourCode
              ? `#${c.teamColourCode}`
              : getTeamColor(c.teamName, series);

            return {
              pos,
              points: Number(c.championshipPoints || 0),
              wins: 0,
              name: c.teamName,
              teamColor,
            };
          });
        }
      } catch (err) {
        console.warn(`[JuniorSeries] Failed to fetch FOM standings for ${series}:`, err);
      }
    } else if (series === 'f2') {
      if (year === 2025) {
        drivers = F2_2025_DRIVERS;
        constructors = F2_2025_CONSTRUCTORS;
      } else if (year === 2024) {
        drivers = F2_2024_DRIVERS;
        constructors = F2_2024_CONSTRUCTORS;
      } else if (F2_HISTORICAL_STANDINGS[year]) {
        drivers = F2_HISTORICAL_STANDINGS[year].drivers;
        constructors = F2_HISTORICAL_STANDINGS[year].constructors;
      }
    } else {
      if (year === 2025) {
        drivers = F3_2025_DRIVERS;
        constructors = F3_2025_CONSTRUCTORS;
      } else if (year === 2024) {
        drivers = F3_2024_DRIVERS;
        constructors = F3_2024_CONSTRUCTORS;
      } else if (F3_HISTORICAL_STANDINGS[year]) {
        drivers = F3_HISTORICAL_STANDINGS[year].drivers;
        constructors = F3_HISTORICAL_STANDINGS[year].constructors;
      }
    }

    const data = {
      drivers,
      constructors,
    };

    this.standingsCache.set(cacheKey, { timestamp: Date.now(), data });
    return data;
  }

  public async getRaceResults(
    series: 'f2' | 'f3',
    roundParam: string,
    year = 2026,
  ): Promise<JuniorRaceDetail | null> {
    const schedule = await this.getSchedule(series, year);
    if (!schedule || schedule.length === 0) return null;

    let fomMeetings: FomMeeting[] = [];
    try {
      const meetRes = await this.fetchFom<{ meetings: FomMeeting[] }>(
        series,
        `/meetings?season=${year}`,
      );
      if (meetRes?.meetings) {
        fomMeetings = meetRes.meetings;
      }
    } catch {
      // ignore
    }

    let targetRound = 1;
    if (roundParam === 'last') {
      if (fomMeetings.length > 0) {
        let lastCompleted = 1;
        fomMeetings.forEach((m, idx) => {
          const isComp = m.meetingSessions?.some(
            (s) => s.state === 'completed' && (s.sessionNumber === 2 || s.sessionNumber === 1),
          );
          if (isComp) lastCompleted = idx + 1;
        });
        targetRound = lastCompleted;
      } else {
        const nowMs = Date.now();
        const completedRounds = schedule.filter((r) => new Date(r.raceDateTime).getTime() <= nowMs);
        targetRound =
          completedRounds.length > 0 ? completedRounds[completedRounds.length - 1].round : 1;
      }
    } else {
      const parsed = Number.parseInt(roundParam, 10);
      if (!Number.isNaN(parsed) && parsed >= 1 && parsed <= schedule.length) {
        targetRound = parsed;
      }
    }

    const raceEvent =
      schedule.find((r) => r.round === targetRound) || schedule[schedule.length - 1];
    const cacheKey = `${series}-${year}-r${targetRound}`;
    const cached = this.raceDetailCache.get(cacheKey);
    const ttl = this.getTtl();

    if (cached && Date.now() - cached.timestamp < ttl && cached.data) {
      return cached.data;
    }

    const targetMeeting = fomMeetings[targetRound - 1];
    if (targetMeeting) {
      const meetingKey = targetMeeting.meetingKey;
      try {
        const [featureRes, sprintRes] = await Promise.all([
          this.fetchFom<{
            sessionResults?: { results?: FomRaceResult[]; state?: string; startTime?: string };
          }>(series, `/race?meeting=${meetingKey}&session=2`),
          this.fetchFom<{
            sessionResults?: { results?: FomRaceResult[]; state?: string; startTime?: string };
          }>(series, `/race?meeting=${meetingKey}&session=1`),
        ]);

        const featureResults = featureRes?.sessionResults?.results || [];
        const sprintResults = sprintRes?.sessionResults?.results || [];

        if (featureResults.length > 0 || sprintResults.length > 0) {
          const detail = this.buildFomRaceDetail(
            series,
            targetRound,
            raceEvent,
            year,
            featureRes?.sessionResults,
            sprintRes?.sessionResults,
          );
          this.raceDetailCache.set(cacheKey, { timestamp: Date.now(), data: detail });
          return detail;
        }
      } catch (err) {
        console.warn(
          `[JuniorSeries] Failed to fetch FOM race results for ${series} r${targetRound}:`,
          err,
        );
      }
    }

    // Pending/Scheduled round fallback (strictly real, NO fake times)
    const detail = this.buildPendingRoundDetail(series, targetRound, raceEvent, year);
    this.raceDetailCache.set(cacheKey, { timestamp: Date.now(), data: detail });
    return detail;
  }

  private buildFomRaceDetail(
    series: 'f2' | 'f3',
    targetRound: number,
    raceEvent: JolpicaRace,
    year: number,
    featureSessionData?: { results?: FomRaceResult[]; state?: string; startTime?: string },
    sprintSessionData?: { results?: FomRaceResult[]; state?: string; startTime?: string },
  ): JuniorRaceDetail {
    const totalFeatureLaps = series === 'f2' ? 32 : 24;
    const totalSprintLaps = series === 'f2' ? 24 : 18;

    const mapResult = (
      r: FomRaceResult,
      idx: number,
      totalLaps: number,
      isSprint: boolean,
    ): JolpicaRaceResult => {
      const pos = Number(r.positionValue || r.positionNumber || idx + 1);
      const isDnf =
        r.completionStatusCode === 'DNF' ||
        r.completionStatusCode === 'Retired' ||
        r.completionStatusCode === 'NC';
      const isWinner = pos === 1 && !isDnf;
      const displayTime = r.displayTime || r.raceTime || (isWinner ? 'Winner' : r.gapToLeader);
      const timeOrStatus = isDnf
        ? 'DNF'
        : displayTime && displayTime !== '0'
          ? displayTime
          : isWinner
            ? 'Winner'
            : '- - -';

      // Detect fastest lap bonus point (Feature: P1-P10, Sprint: P1-P8/P10)
      const basePoints = isSprint
        ? (series === 'f2' ? [10, 8, 6, 5, 4, 3, 2, 1] : [10, 9, 8, 7, 6, 5, 4, 3, 2, 1])[
            pos - 1
          ] || 0
        : [25, 18, 15, 12, 10, 8, 6, 4, 2, 1][pos - 1] || 0;
      const isFastestLap = Number(r.racePoints || 0) > basePoints;

      return {
        pos: Number.isNaN(pos) ? idx + 1 : pos,
        driverNumber: Number(r.racingNumber || 0),
        code: r.driverTLA || r.driverLastName?.slice(0, 3).toUpperCase() || 'DRV',
        fullName: `${r.driverFirstName || ''} ${r.driverLastName || ''}`.trim(),
        familyName: r.driverLastName || '',
        teamName: r.teamName || 'Junior Team',
        teamColor: r.teamColourCode
          ? `#${r.teamColourCode}`
          : getTeamColor(r.teamName || '', series),
        points: Number(r.racePoints || 0),
        grid: pos,
        posChange: 0,
        laps: Number(r.lapsCompleted || totalLaps),
        status: isDnf
          ? 'DNF'
          : r.completionStatusCode === 'OK'
            ? 'Finished'
            : r.completionStatusCode || 'Finished',
        timeOrStatus,
        isWinner,
        isPodium: pos <= 3 && !isDnf,
        isFastestLap,
      };
    };

    const rawFeature = featureSessionData?.results || [];
    const mappedFeature: JolpicaRaceResult[] = rawFeature.map((r, idx) =>
      mapResult(r, idx, totalFeatureLaps, false),
    );

    const rawSprint = sprintSessionData?.results || [];
    const mappedSprint: JolpicaRaceResult[] = rawSprint.map((r, idx) =>
      mapResult(r, idx, totalSprintLaps, true),
    );

    const featureWinner = mappedFeature.find((r) => r.isWinner) || mappedFeature[0];
    const featureFl = mappedFeature.find((r) => r.isFastestLap);
    const sprintFl = mappedSprint.find((r) => r.isFastestLap);

    const sprintSession: JuniorSessionResult = {
      sessionType: 'Sprint',
      date:
        sprintSessionData?.startTime ||
        raceEvent.sessions?.find((s) => s.name.includes('Sprint'))?.dateTime,
      results: mappedSprint,
      fastestLap: sprintFl
        ? {
            code: sprintFl.code,
            driverName: sprintFl.fullName,
            teamName: sprintFl.teamName,
            time: sprintFl.timeOrStatus,
            lap: sprintFl.laps,
          }
        : undefined,
    };

    const featureSession: JuniorSessionResult = {
      sessionType: 'Feature',
      date: featureSessionData?.startTime || raceEvent.raceDateTime,
      results: mappedFeature,
      fastestLap: featureFl
        ? {
            code: featureFl.code,
            driverName: featureFl.fullName,
            teamName: featureFl.teamName,
            time: featureFl.timeOrStatus,
            lap: featureFl.laps,
          }
        : undefined,
    };

    return {
      round: targetRound,
      season: String(year),
      raceName: raceEvent.raceName,
      circuitName: raceEvent.circuitName,
      country: raceEvent.country,
      date: raceEvent.raceDateTime,
      series,
      results: mappedFeature.length > 0 ? mappedFeature : mappedSprint,
      winner: featureWinner
        ? {
            code: featureWinner.code,
            fullName: featureWinner.fullName,
            teamName: featureWinner.teamName,
            time: featureWinner.timeOrStatus,
          }
        : null,
      fastestLap: featureSession.fastestLap || sprintSession.fastestLap,
      sprintRace: mappedSprint.length > 0 ? sprintSession : null,
      featureRace: mappedFeature.length > 0 ? featureSession : null,
    };
  }

  private buildPendingRoundDetail(
    series: 'f2' | 'f3',
    targetRound: number,
    raceEvent: JolpicaRace,
    year: number,
  ): JuniorRaceDetail {
    const allDrivers = series === 'f2' ? F2_FALLBACK_DRIVERS : F3_FALLBACK_DRIVERS;
    const numMap = series === 'f2' ? F2_DRIVER_NUMBERS : F3_DRIVER_NUMBERS;

    // Confirmed entry list / grid: strictly status 'Programada', timeOrStatus '- - -'
    const pendingResults: JolpicaRaceResult[] = allDrivers.slice(0, 22).map((d, idx) => {
      const parts = d.name.split(' ');
      const familyName = parts.slice(1).join(' ') || d.name;
      const carNumber = numMap[d.code] || idx + 1;

      return {
        pos: idx + 1,
        driverNumber: carNumber,
        code: d.code,
        fullName: d.name,
        familyName,
        teamName: d.team,
        teamColor: d.teamColor,
        points: 0,
        grid: idx + 1,
        posChange: 0,
        laps: 0,
        status: 'Programada',
        timeOrStatus: '- - -',
        isWinner: false,
        isPodium: false,
        isFastestLap: false,
      };
    });

    const sprintSession: JuniorSessionResult = {
      sessionType: 'Sprint',
      date: raceEvent.sessions?.find((s) => s.name.includes('Sprint'))?.dateTime,
      results: pendingResults,
    };

    const featureSession: JuniorSessionResult = {
      sessionType: 'Feature',
      date: raceEvent.raceDateTime,
      results: pendingResults,
    };

    return {
      round: targetRound,
      season: String(year),
      raceName: raceEvent.raceName,
      circuitName: raceEvent.circuitName,
      country: raceEvent.country,
      date: raceEvent.raceDateTime,
      series,
      results: pendingResults,
      winner: null,
      fastestLap: undefined,
      sprintRace: sprintSession,
      featureRace: featureSession,
    };
  }

  public getDriverChanges(series: 'f2' | 'f3', _year = 2026): DriverChangeAlert[] {
    return series === 'f2' ? KNOWN_F2_DRIVER_CHANGES : KNOWN_F3_DRIVER_CHANGES;
  }
}
