export type TyreCompound = 'SOFT' | 'MEDIUM' | 'HARD' | 'INTERMEDIATE' | 'WET' | 'UNKNOWN';

export type DriverStatus = 'ACTIVE' | 'PIT' | 'DNF' | 'DNS' | 'DSQ';

export type FlagStatus = 'GREEN' | 'YELLOW' | 'VSC' | 'SC' | 'RED' | 'CHEQUERED';

export type SessionState = 'SCHEDULED' | 'IN_PROGRESS' | 'FINISHED' | 'SUSPENDED';

export type SessionType = 'Race' | 'Qualifying' | 'Practice';

export interface TrackWeather {
  airTemp: number;
  trackTemp: number;
  humidity: number;
  rainfall: boolean;
  windSpeed: number;
  windDirection: number;
}

export interface DriverLive {
  pos: number;
  posChange: number;
  gridPosition?: number;
  driverNumber: number;
  code: string;
  fullName: string;
  teamName: string;
  teamColor: string;
  gap: string;
  interval: string;
  isDrsZone: boolean;
  lastLapTime: string;
  bestLapTime?: string;
  bestLapDuration?: number | null;
  isPole?: boolean;
  isFastestLap: boolean;
  penaltySeconds?: number;
  eliminatedPhase?: 'Q1' | 'Q2' | null;
  tyre: {
    compound: TyreCompound;
    laps: number;
  } | null;
  pitStops: number;
  inPit: boolean;
  status: DriverStatus;
  retiredLap?: number;
  retirementReason?: string;
  sectors?: {
    s1?: number | null;
    s2?: number | null;
    s3?: number | null;
  };
  speedTrap?: number | null;
}

export interface SessionLive {
  sessionKey: number;
  sessionName: string;
  sessionType: SessionType;
  qualifyingPhase?: 'Q1' | 'Q2' | 'Q3' | null;
  poleLapTime?: string | null;
  poleDriver?: string | null;
  location: string;
  country: string;
  circuit: string;
  status: SessionState;
  flag: FlagStatus;
  currentLap: number;
  totalLaps: number;
  progressPercentage: number;
  timestamp: number;
}

export interface RaceControlMessage {
  id: number;
  time: string;
  text: string;
  flag?: string | null;
}

export interface HistorySnapshot {
  timestamp: number;
  drivers: DriverLive[];
}

export interface LiveSnapshot {
  session: SessionLive;
  weather?: TrackWeather | null;
  messages: RaceControlMessage[];
  drivers: DriverLive[];
  history?: HistorySnapshot[];
}

export interface JolpicaRace {
  round: number;
  raceName: string;
  circuitName: string;
  locality: string;
  country: string;
  raceDateTime: string;
  sessions: {
    name: string;
    dateTime: string;
  }[];
  isNext: boolean;
}

export interface LastRacePodium {
  raceName: string;
  round: number;
  circuitName: string;
  date: string;
  podium: Array<{
    position: number;
    code: string;
    fullName: string;
    teamName: string;
    teamColor: string;
    timeOrStatus: string;
  }>;
}

export interface ScheduleResponse {
  races: JolpicaRace[];
  total: number;
  lastRace?: LastRacePodium | null;
}

export interface JolpicaDriverStanding {
  pos: number;
  points: number;
  wins: number;
  code: string;
  name: string;
  nationality: string;
  team: string;
  teamColor: string;
}

export interface JolpicaConstructorStanding {
  pos: number;
  points: number;
  wins: number;
  name: string;
  teamColor: string;
}

export interface StandingsData {
  drivers: JolpicaDriverStanding[];
  constructors: JolpicaConstructorStanding[];
}

export type ActiveTab = 'live' | 'schedule' | 'standings';

