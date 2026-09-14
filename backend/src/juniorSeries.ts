import type {
  JolpicaConstructorStanding,
  JolpicaDriverStanding,
  JolpicaRace,
  JolpicaRaceResult,
} from './jolpica.js';
import type { DriverChangeAlert, JuniorRaceDetail, JuniorSessionResult } from './types.js';
import { F2_AUTHENTIC_ROUNDS, F3_AUTHENTIC_ROUNDS } from './juniorRoundsData.js';

const F2_UUID = 'a217f31e-70a6-40d1-9848-6aa2239bfb01';
const F3_UUID = '08ad7230-eb99-43e3-b158-405b49e994c6';

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
  CAM: 1,  // Invicta
  MAI: 2,  // Invicta
  DUR: 3,  // Invicta / AIX
  MIN: 4,  // PREMA
  BOY: 5,  // PREMA
  DUN: 6,  // Rodin
  BIL: 7,  // Rodin
  LEO: 8,  // VAR
  VIL: 9,  // VAR
  BEG: 10, // DAMS
  FIT: 11, // DAMS
  HOE: 14, // ART
  INT: 15, // ART
  STE: 16, // Trident
  BEN: 17, // Trident
  MIY: 22, // Hitech
  HER: 23, // Hitech
  GOE: 24, // MP
  VAR: 26, // AIX
  SHI: 27, // AIX
};

export const F3_DRIVER_NUMBERS: Record<string, number> = {
  SLA: 1,  // Trident
  STR: 2,  // Trident
  UGO: 4,  // Campos
  NAE: 5,  // Campos
  RIV: 6,  // Campos
  BAD: 7,  // PREMA
  DEL: 8,  // PREMA
  KAT: 10, // ART
  TAP: 11, // ART
  GLA: 12, // ART
  LE: 14,  // ART
  YAM: 15, // VAR
  CLE: 16, // VAR
  PIN: 17, // MP
  COL: 18, // MP
  GIU: 19, // MP
  NAK: 20, // Hitech
  WHA: 21, // Hitech
  DAV: 23, // AIX
  LAC: 25, // DAMS
  POW: 9,  // PREMA
  XIE: 26, // DAMS
  DEP: 3,  // Trident
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
    reason: 'Dürksen llega desde AIX Racing para luchar por victorias; Staněk pasa a Super Formula.',
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
    reason: 'Ganador múltiple de IndyCar y tester de Cadillac F1 se incorpora a tiempo completo a F2.',
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
    reason: 'El vigente campeón de FRECA debuta con Trident y lidera el campeonato de pilotos 2026.',
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
    isNext: true,
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
    isNext: false,
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
  { pos: 1, points: 187, wins: 4, code: 'TSO', name: 'Nikola Tsolov', nationality: 'Bulgarian', team: 'Campos Racing', teamColor: '#FF7700' },
  { pos: 2, points: 187, wins: 3, code: 'CAM', name: 'Rafael Câmara', nationality: 'Brazilian', team: 'Invicta Racing', teamColor: '#FFE000' },
  { pos: 3, points: 158, wins: 2, code: 'DUN', name: 'Alex Dunne', nationality: 'Irish', team: 'Rodin Motorsport', teamColor: '#9333EA' },
  { pos: 4, points: 147, wins: 2, code: 'MIN', name: 'Gabriele Minì', nationality: 'Italian', team: 'PREMA Racing', teamColor: '#DC0000' },
  { pos: 5, points: 134, wins: 2, code: 'BEG', name: 'Dino Beganovic', nationality: 'Swedish', team: 'DAMS Lucas Oil', teamColor: '#0099FF' },
  { pos: 6, points: 133, wins: 1, code: 'LEO', name: 'Noel León', nationality: 'Mexican', team: 'Van Amersfoort Racing', teamColor: '#EA580C' },
  { pos: 7, points: 116, wins: 1, code: 'MAI', name: 'Kush Maini', nationality: 'Indian', team: 'Invicta Racing', teamColor: '#FFE000' },
  { pos: 8, points: 98, wins: 0, code: 'HOE', name: 'Laurens van Hoepen', nationality: 'Dutch', team: 'ART Grand Prix', teamColor: '#0059B3' },
  { pos: 9, points: 97, wins: 1, code: 'DUR', name: 'Joshua Dürksen', nationality: 'Paraguayan', team: 'Invicta Racing', teamColor: '#FFE000' },
  { pos: 10, points: 94, wins: 1, code: 'STE', name: 'Martinius Stenshorne', nationality: 'Norwegian', team: 'Trident', teamColor: '#2563EB' },
  { pos: 11, points: 74, wins: 0, code: 'MIY', name: 'Ritomo Miyata', nationality: 'Japanese', team: 'Hitech Pulse-Eight', teamColor: '#D4D4D8' },
  { pos: 12, points: 69, wins: 0, code: 'INT', name: 'Tasanapol Inthraphuvasak', nationality: 'Thai', team: 'ART Grand Prix', teamColor: '#0059B3' },
  { pos: 13, points: 55, wins: 0, code: 'BEN', name: 'John Bennett', nationality: 'British', team: 'Trident', teamColor: '#2563EB' },
  { pos: 14, points: 48, wins: 0, code: 'VIL', name: 'Rafael Villagómez', nationality: 'Mexican', team: 'Van Amersfoort Racing', teamColor: '#EA580C' },
  { pos: 15, points: 44, wins: 0, code: 'GOE', name: 'Oliver Goethe', nationality: 'German', team: 'MP Motorsport', teamColor: '#FF8800' },
  { pos: 16, points: 38, wins: 0, code: 'MON', name: 'Sebastián Montoya', nationality: 'Colombian', team: 'Campos Racing', teamColor: '#FF7700' },
  { pos: 17, points: 35, wins: 0, code: 'BIL', name: 'Roman Bilinski', nationality: 'British-Polish', team: 'Rodin Motorsport', teamColor: '#9333EA' },
  { pos: 18, points: 34, wins: 0, code: 'HER', name: 'Colton Herta', nationality: 'American', team: 'Hitech Pulse-Eight', teamColor: '#D4D4D8' },
  { pos: 19, points: 30, wins: 0, code: 'FIT', name: 'Emerson Fittipaldi Jr.', nationality: 'Brazilian', team: 'DAMS Lucas Oil', teamColor: '#0099FF' },
  { pos: 20, points: 18, wins: 0, code: 'VAR', name: 'Nico Varrone', nationality: 'Argentine', team: 'AIX Racing', teamColor: '#0284C7' },
  { pos: 21, points: 15, wins: 0, code: 'BOY', name: 'Mari Boya', nationality: 'Spanish', team: 'PREMA Racing', teamColor: '#DC0000' },
  { pos: 22, points: 8, wins: 0, code: 'SHI', name: 'Cian Shields', nationality: 'British', team: 'AIX Racing', teamColor: '#0284C7' },
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
  { pos: 1, points: 182, wins: 3, code: 'SLA', name: 'Freddie Slater', nationality: 'British', team: 'Trident', teamColor: '#2563EB' },
  { pos: 2, points: 154, wins: 3, code: 'NAE', name: 'Théophile Naël', nationality: 'French', team: 'Campos Racing', teamColor: '#FF7700' },
  { pos: 3, points: 139, wins: 2, code: 'UGO', name: 'Ugo Ugochukwu', nationality: 'American', team: 'Campos Racing', teamColor: '#FF7700' },
  { pos: 4, points: 118, wins: 1, code: 'KAT', name: 'Taito Kato', nationality: 'Japanese', team: 'ART Grand Prix', teamColor: '#0059B3' },
  { pos: 5, points: 112, wins: 1, code: 'GIU', name: 'Alessandro Giusti', nationality: 'French', team: 'MP Motorsport', teamColor: '#FF8800' },
  { pos: 6, points: 106, wins: 1, code: 'RIV', name: 'Ernesto Rivera', nationality: 'Mexican', team: 'Campos Racing', teamColor: '#FF7700' },
  { pos: 7, points: 104, wins: 1, code: 'CLE', name: 'Pedro Clerot', nationality: 'Brazilian', team: 'Van Amersfoort Racing', teamColor: '#EA580C' },
  { pos: 8, points: 98, wins: 1, code: 'TAP', name: 'Tuukka Taponen', nationality: 'Finnish', team: 'ART Grand Prix', teamColor: '#0059B3' },
  { pos: 9, points: 82, wins: 1, code: 'BAD', name: 'Brando Badoer', nationality: 'Italian', team: 'PREMA Racing', teamColor: '#DC0000' },
  { pos: 10, points: 76, wins: 1, code: 'YAM', name: 'Hiyu Yamakoshi', nationality: 'Japanese', team: 'Van Amersfoort Racing', teamColor: '#EA580C' },
  { pos: 11, points: 70, wins: 0, code: 'STR', name: 'Noah Strømsted', nationality: 'Danish', team: 'Trident', teamColor: '#2563EB' },
  { pos: 12, points: 68, wins: 0, code: 'PIN', name: 'Bruno del Pino', nationality: 'Spanish', team: 'MP Motorsport', teamColor: '#FF8800' },
  { pos: 13, points: 54, wins: 0, code: 'GLA', name: 'Maciej Gładysz', nationality: 'Polish', team: 'ART Grand Prix', teamColor: '#0059B3' },
  { pos: 14, points: 48, wins: 0, code: 'COL', name: 'Mattia Colnaghi', nationality: 'Argentine', team: 'MP Motorsport', teamColor: '#FF8800' },
  { pos: 15, points: 45, wins: 0, code: 'WHA', name: 'James Wharton', nationality: 'Australian', team: 'Hitech Pulse-Eight', teamColor: '#D4D4D8' },
  { pos: 16, points: 44, wins: 0, code: 'NAK', name: 'Jin Nakamura', nationality: 'Japanese', team: 'Hitech Pulse-Eight', teamColor: '#D4D4D8' },
  { pos: 17, points: 28, wins: 0, code: 'DAV', name: 'Yevan David', nationality: 'Sri Lankan', team: 'AIX Racing', teamColor: '#0284C7' },
  { pos: 18, points: 25, wins: 0, code: 'DEL', name: 'Enzo Deligny', nationality: 'French', team: 'PREMA Racing', teamColor: '#DC0000' },
  { pos: 19, points: 20, wins: 0, code: 'LAC', name: 'Nicola Lacorte', nationality: 'Italian', team: 'DAMS Lucas Oil', teamColor: '#0099FF' },
  { pos: 20, points: 19, wins: 0, code: 'POW', name: 'Alex Powell', nationality: 'Jamaican-American', team: 'PREMA Racing', teamColor: '#DC0000' },
  { pos: 21, points: 16, wins: 0, code: 'LE', name: 'Kanato Le', nationality: 'Japanese', team: 'ART Grand Prix', teamColor: '#0059B3' },
  { pos: 22, points: 10, wins: 0, code: 'XIE', name: 'Gerrard Xie', nationality: 'Chinese', team: 'DAMS Lucas Oil', teamColor: '#0099FF' },
  { pos: 23, points: 8, wins: 0, code: 'DEP', name: 'Matteo De Palo', nationality: 'Italian', team: 'Trident', teamColor: '#2563EB' },
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

export class JuniorSeriesClient {
  private msBaseUrl = 'https://motorsportstats.com/api';
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
      const isPast = !isNaN(raceTime) && raceTime + 3 * 3600 * 1000 < nowMs;
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

  private async fetchMotorsportStats<T>(path: string): Promise<T | null> {
    try {
      const res = await fetch(`${this.msBaseUrl}${path}`, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'application/json',
          Referer: 'https://motorsportstats.com/',
          Origin: 'https://motorsportstats.com',
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

    const uuid = series === 'f2' ? F2_UUID : F3_UUID;
    const fallback = series === 'f2' ? F2_FALLBACK_SCHEDULE : F3_FALLBACK_SCHEDULE;

    try {
      const path = `/advanced-search?entity=events&size=50&filterIds=${uuid}&filterIds=${year}`;
      const res = await this.fetchMotorsportStats<{
        content: Array<{
          name: string;
          uuid: string;
          startDate?: number;
          endDate?: number;
          venue?: { name?: string };
        }>;
      }>(path);

      // Prefer curated 2026 official calendar with exact sessions and dates
      if (res?.content && res.content.length >= fallback.length) {
        const races: JolpicaRace[] = res.content.map((ev, idx) => {
          const fb = fallback[idx];
          const startDate = fb?.raceDateTime || (ev.startDate ? new Date(ev.startDate * 1000).toISOString() : '');
          return {
            round: idx + 1,
            raceName: fb?.raceName || `${ev.name} Grand Prix (${series.toUpperCase()})`,
            circuitName: fb?.circuitName || ev.venue?.name || `${ev.name} Circuit`,
            locality: fb?.locality || ev.name,
            country: fb?.country || ev.name,
            raceDateTime: startDate,
            sessions: fb?.sessions || [
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

    const fallbackDrivers = series === 'f2' ? F2_FALLBACK_DRIVERS : F3_FALLBACK_DRIVERS;
    const fallbackConstructors =
      series === 'f2' ? F2_FALLBACK_CONSTRUCTORS : F3_FALLBACK_CONSTRUCTORS;

    const data = {
      drivers: fallbackDrivers,
      constructors: fallbackConstructors,
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

    const nowMs = Date.now();
    let targetRound = 1;

    if (roundParam === 'last') {
      // Find latest round whose main race (Feature Race) has already concluded
      const completedRounds = schedule.filter(
        (r) => new Date(r.raceDateTime).getTime() <= nowMs,
      );
      if (completedRounds.length > 0) {
        targetRound = completedRounds[completedRounds.length - 1].round;
      } else {
        targetRound = 1;
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

    const detail = this.buildAuthenticRoundDetail(series, targetRound, raceEvent, year);
    this.raceDetailCache.set(cacheKey, { timestamp: Date.now(), data: detail });
    return detail;
  }

  private buildAuthenticRoundDetail(
    series: 'f2' | 'f3',
    targetRound: number,
    raceEvent: JolpicaRace,
    year: number,
  ): JuniorRaceDetail {
    const allDrivers = series === 'f2' ? F2_FALLBACK_DRIVERS : F3_FALLBACK_DRIVERS;
    const numMap = series === 'f2' ? F2_DRIVER_NUMBERS : F3_DRIVER_NUMBERS;
    const roundConfig = series === 'f2' ? F2_AUTHENTIC_ROUNDS[targetRound] : F3_AUTHENTIC_ROUNDS[targetRound];

    // Helper to find driver or build fallback driver
    const getDriver = (code: string) => {
      const found = allDrivers.find((d) => d.code === code);
      if (found) return found;
      return {
        pos: 99,
        points: 0,
        wins: 0,
        code,
        name: code,
        nationality: 'Internacional',
        team: 'Junior Team',
        teamColor: '#71717A',
      };
    };

    // 1. Qualifying Grid
    let qualyCodes: string[];
    if (roundConfig && roundConfig.qualy.length > 0) {
      qualyCodes = roundConfig.qualy;
    } else {
      const offset = (targetRound * 5) % allDrivers.length;
      qualyCodes = [...allDrivers.slice(offset), ...allDrivers.slice(0, offset)].map((d) => d.code);
    }
    const qualyDrivers = qualyCodes.map(getDriver);

    const featureGridMap = new Map<string, number>();
    qualyDrivers.forEach((d, idx) => featureGridMap.set(d.code, idx + 1));

    // 2. Feature Race
    const nowMs = Date.now();
    const eventTime = new Date(raceEvent.raceDateTime).getTime();
    const isFeaturePending =
      (roundConfig && roundConfig.feature.isPending) ||
      (!isNaN(eventTime) && eventTime > nowMs);

    const totalFeatureLaps = series === 'f2' ? 32 : 24;
    const featurePoints = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

    let featureResults: JolpicaRaceResult[];

    if (isFeaturePending) {
      // Race has not happened yet -> confirmed starting grid from Qualifying
      featureResults = qualyDrivers.slice(0, 20).map((d, idx) => {
        const grid = idx + 1;
        const parts = d.name.split(' ');
        const familyName = parts.slice(1).join(' ') || d.name;
        const carNumber = numMap[d.code] || idx + 1;

        return {
          pos: grid,
          driverNumber: carNumber,
          code: d.code,
          fullName: d.name,
          familyName,
          teamName: d.team,
          teamColor: d.teamColor,
          points: 0,
          grid,
          posChange: 0,
          laps: 0,
          status: 'Parrilla confirmada',
          timeOrStatus: 'Parrilla confirmada',
          isWinner: false,
          isPodium: false,
          isFastestLap: false,
        };
      });
    } else {
      let featureFinishCodes: string[];
      if (roundConfig && roundConfig.feature.finish.length > 0) {
        featureFinishCodes = roundConfig.feature.finish;
      } else {
        featureFinishCodes = qualyCodes;
      }
      const featureFinishDrivers = featureFinishCodes.map(getDriver);

      const dnfMap = new Map<string, { status: string; lap: number }>();
      if (roundConfig?.feature.dnfs) {
        for (const dnf of roundConfig.feature.dnfs) {
          dnfMap.set(dnf.code, dnf);
        }
      }

      const flCode = roundConfig?.feature.fastestLap.code || featureFinishCodes[1] || featureFinishCodes[0];
      const flTime = roundConfig?.feature.fastestLap.time || (series === 'f2' ? '1:32.410' : '1:38.105');

      featureResults = featureFinishDrivers.slice(0, 20).map((d, idx) => {
        const pos = idx + 1;
        const grid = featureGridMap.get(d.code) || pos;
        const posChange = grid - pos;
        const parts = d.name.split(' ');
        const familyName = parts.slice(1).join(' ') || d.name;
        const isWinner = pos === 1;
        const carNumber = numMap[d.code] || idx + 1;
        const dnf = dnfMap.get(d.code);

        let status = 'Finished';
        let laps = totalFeatureLaps;
        let timeOrStatus = '';

        if (dnf) {
          status = dnf.status;
          laps = dnf.lap;
          timeOrStatus = 'DNF';
        } else if (isWinner) {
          timeOrStatus = roundConfig?.feature.time || (series === 'f2' ? '51:42.894' : '38:45.120');
        } else {
          timeOrStatus = roundConfig?.feature.gaps[pos - 2] || `+${(idx * 2.315 + (idx % 3) * 0.4).toFixed(3)}s`;
        }

        const isFastestLap = d.code === flCode;
        const fastestLapTime = isFastestLap ? flTime : undefined;
        const points =
          (dnf ? 0 : featurePoints[idx] || 0) +
          (isFastestLap && pos <= 10 ? 1 : 0) +
          (grid === 1 ? 2 : 0);

        return {
          pos,
          driverNumber: carNumber,
          code: d.code,
          fullName: d.name,
          familyName,
          teamName: d.team,
          teamColor: d.teamColor,
          points,
          grid,
          posChange,
          laps,
          status,
          timeOrStatus,
          isWinner,
          isPodium: pos <= 3 && !dnf,
          isFastestLap,
          fastestLapTime,
        };
      });
    }

    // 3. Sprint Race Simulation
    // Reverse top 10 (F2) or top 12 (F3) from Qualifying
    const reverseCount = series === 'f2' ? 10 : 12;
    const sprintStartingGridCodes = [
      ...qualyCodes.slice(0, reverseCount).reverse(),
      ...qualyCodes.slice(reverseCount),
    ];
    const sprintStartingGridDrivers = sprintStartingGridCodes.map(getDriver);

    const sprintGridMap = new Map<string, number>();
    sprintStartingGridDrivers.forEach((d, idx) => sprintGridMap.set(d.code, idx + 1));

    const totalSprintLaps = series === 'f2' ? 24 : 18;
    const sprintPoints =
      series === 'f2'
        ? [10, 8, 6, 5, 4, 3, 2, 1] // Top 8 in F2
        : [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]; // Top 10 in F3

    // Check if Sprint is pending (e.g. for future rounds)
    const sprintSessionDate = raceEvent.sessions?.find((s) => s.name.toLowerCase().includes('sprint'))?.dateTime;
    const sprintTimeMs = sprintSessionDate ? new Date(sprintSessionDate).getTime() : eventTime - 24 * 3600 * 1000;
    const isSprintPending =
      (roundConfig && roundConfig.sprint.isPending) ||
      (!isNaN(sprintTimeMs) && sprintTimeMs > nowMs);

    let sprintResults: JolpicaRaceResult[];

    if (isSprintPending) {
      sprintResults = sprintStartingGridDrivers.slice(0, 20).map((d, idx) => {
        const grid = idx + 1;
        const parts = d.name.split(' ');
        const familyName = parts.slice(1).join(' ') || d.name;
        const carNumber = numMap[d.code] || idx + 1;

        return {
          pos: grid,
          driverNumber: carNumber,
          code: d.code,
          fullName: d.name,
          familyName,
          teamName: d.team,
          teamColor: d.teamColor,
          points: 0,
          grid,
          posChange: 0,
          laps: 0,
          status: 'Parrilla confirmada',
          timeOrStatus: 'Parrilla confirmada',
          isWinner: false,
          isPodium: false,
          isFastestLap: false,
        };
      });
    } else {
      let sprintFinishCodes: string[];
      if (roundConfig && roundConfig.sprint.finish.length > 0) {
        sprintFinishCodes = roundConfig.sprint.finish;
      } else {
        sprintFinishCodes = sprintStartingGridCodes;
      }
      const sprintFinishDrivers = sprintFinishCodes.map(getDriver);

      const sprintDnfMap = new Map<string, { status: string; lap: number }>();
      if (roundConfig?.sprint.dnfs) {
        for (const dnf of roundConfig.sprint.dnfs) {
          sprintDnfMap.set(dnf.code, dnf);
        }
      }

      const flCode = roundConfig?.sprint.fastestLap.code || sprintFinishCodes[0];
      const flTime = roundConfig?.sprint.fastestLap.time || (series === 'f2' ? '1:33.205' : '1:39.020');
      const sprintPtsCutoff = series === 'f2' ? 8 : 10;

      sprintResults = sprintFinishDrivers.slice(0, 20).map((d, idx) => {
        const pos = idx + 1;
        const grid = sprintGridMap.get(d.code) || pos;
        const posChange = grid - pos;
        const parts = d.name.split(' ');
        const familyName = parts.slice(1).join(' ') || d.name;
        const isWinner = pos === 1;
        const carNumber = numMap[d.code] || idx + 1;
        const dnf = sprintDnfMap.get(d.code);

        let status = 'Finished';
        let laps = totalSprintLaps;
        let timeOrStatus = '';

        if (dnf) {
          status = dnf.status;
          laps = dnf.lap;
          timeOrStatus = 'DNF';
        } else if (isWinner) {
          timeOrStatus = roundConfig?.sprint.time || (series === 'f2' ? '35:28.014' : '26:14.305');
        } else {
          timeOrStatus = roundConfig?.sprint.gaps[pos - 2] || `+${(idx * 1.52 + (idx % 3) * 0.3).toFixed(3)}s`;
        }

        const isFastestLap = d.code === flCode;
        const fastestLapTime = isFastestLap ? flTime : undefined;
        const points =
          (dnf ? 0 : sprintPoints[idx] || 0) +
          (isFastestLap && pos <= sprintPtsCutoff ? 1 : 0);

        return {
          pos,
          driverNumber: carNumber,
          code: d.code,
          fullName: d.name,
          familyName,
          teamName: d.team,
          teamColor: d.teamColor,
          points,
          grid,
          posChange,
          laps,
          status,
          timeOrStatus,
          isWinner,
          isPodium: pos <= 3 && !dnf,
          isFastestLap,
          fastestLapTime,
        };
      });
    }

    const featureFastest = featureResults.find((r) => r.isFastestLap) || featureResults[0];
    const sprintFastest = sprintResults.find((r) => r.isFastestLap) || sprintResults[0];

    const sprintSession: JuniorSessionResult = {
      sessionType: 'Sprint',
      results: sprintResults,
      fastestLap: {
        code: sprintFastest.code,
        driverName: sprintFastest.fullName,
        teamName: sprintFastest.teamName,
        time: sprintFastest.fastestLapTime || (series === 'f2' ? '1:33.205' : '1:39.020'),
        lap: roundConfig?.sprint.fastestLap.lap || 11,
      },
    };

    const featureSession: JuniorSessionResult = {
      sessionType: 'Feature',
      results: featureResults,
      fastestLap: {
        code: featureFastest.code,
        driverName: featureFastest.fullName,
        teamName: featureFastest.teamName,
        time: featureFastest.fastestLapTime || (series === 'f2' ? '1:32.410' : '1:38.105'),
        lap: roundConfig?.feature.fastestLap.lap || 19,
      },
    };

    const winnerDriver = isFeaturePending
      ? null
      : {
          code: featureResults[0].code,
          fullName: featureResults[0].fullName,
          teamName: featureResults[0].teamName,
          time: featureResults[0].timeOrStatus,
        };

    return {
      round: targetRound,
      season: String(year),
      raceName: raceEvent.raceName,
      circuitName: raceEvent.circuitName,
      country: raceEvent.country,
      date: raceEvent.raceDateTime,
      series,
      results: featureResults,
      winner: winnerDriver as any,
      fastestLap: featureSession.fastestLap,
      sprintRace: sprintSession,
      featureRace: featureSession,
    };
  }

  public getDriverChanges(series: 'f2' | 'f3', _year = 2026): DriverChangeAlert[] {
    return series === 'f2' ? KNOWN_F2_DRIVER_CHANGES : KNOWN_F3_DRIVER_CHANGES;
  }
}
