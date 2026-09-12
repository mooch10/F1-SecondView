export type TyreCompound = 'SOFT' | 'MEDIUM' | 'HARD' | 'INTERMEDIATE' | 'WET' | 'UNKNOWN';

export type DriverStatus = 'ACTIVE' | 'PIT' | 'DNF' | 'DNS' | 'DSQ';

export type FlagStatus = 'GREEN' | 'YELLOW' | 'VSC' | 'SC' | 'RED' | 'CHEQUERED';

export type SessionState = 'SCHEDULED' | 'IN_PROGRESS' | 'FINISHED' | 'SUSPENDED';

export type SessionType = 'Race' | 'Qualifying' | 'Practice';

export type SectorStatus = 'purple' | 'green' | 'yellow' | 'none';

export type MiniSectorStatus = 'purple' | 'green' | 'yellow' | 'blue' | 'none';

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
    s1Status?: SectorStatus;
    s2Status?: SectorStatus;
    s3Status?: SectorStatus;
    segments?: {
      s1: MiniSectorStatus[];
      s2: MiniSectorStatus[];
      s3: MiniSectorStatus[];
    };
  };
  speedTrap?: number | null;
  i1Speed?: number | null;
  i2Speed?: number | null;
  location?: {
    x: number;
    y: number;
  } | null;
  q1Time?: string | null;
  q2Time?: string | null;
  q3Time?: string | null;
  q1Duration?: number | null;
  q2Duration?: number | null;
  q3Duration?: number | null;
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

export interface TrackOutline {
  circuitName: string;
  outline: [number, number][];
  bounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
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
  circuitTrack?: TrackOutline | null;
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

export interface JolpicaQualifyingResult {
  pos: number;
  driverNumber: number;
  code: string;
  fullName: string;
  familyName: string;
  teamName: string;
  teamColor: string;
  q1: string;
  q2?: string;
  q3?: string;
  bestLap: string;
  gap: string;
  eliminatedPhase?: 'Q1' | 'Q2' | null;
  isPole?: boolean;
}

export interface JolpicaQualifyingSession {
  round: number;
  raceName: string;
  circuitName: string;
  date: string;
  poleDriver: {
    code: string;
    fullName: string;
    teamName: string;
    time: string;
  };
  results: JolpicaQualifyingResult[];
}

export interface JolpicaRaceResult {
  pos: number;
  grid: number;
  posChange: number;
  driverNumber: number;
  code: string;
  fullName: string;
  familyName: string;
  teamName: string;
  teamColor: string;
  points: number;
  laps: number;
  status: string;
  timeOrStatus: string;
  isWinner?: boolean;
  isPodium?: boolean;
  isFastestLap?: boolean;
  fastestLapTime?: string;
  fastestLapRank?: number;
}

export interface JolpicaRaceDetail {
  round: number;
  season: string;
  raceName: string;
  circuitName: string;
  date: string;
  winner: {
    code: string;
    fullName: string;
    teamName: string;
    time: string;
  };
  fastestLap?: {
    code: string;
    driverName: string;
    teamName: string;
    time: string;
    lap: number;
  };
  results: JolpicaRaceResult[];
  series?: SeriesCategory;
  country?: string;
  sprintRace?: JuniorSessionResult | null;
  featureRace?: JuniorSessionResult | null;
}

export type ActiveTab = 'live' | 'last-race' | 'qualy' | 'schedule' | 'standings';

export type SeriesCategory = 'f1' | 'f2' | 'f3';

export interface DriverChangeAlert {
  id: string;
  series: 'f2' | 'f3';
  team: string;
  teamColor: string;
  carNumber: number;
  originalDriver: string;
  newDriver: string;
  effectiveRound: number;
  roundName: string;
  reason?: string;
}

export interface JuniorSessionResult {
  sessionType: 'Sprint' | 'Feature';
  date?: string;
  fastestLap?: {
    code: string;
    driverName: string;
    teamName: string;
    time: string;
    lap: number;
  };
  results: JolpicaRaceResult[];
}

export interface JuniorRaceDetail {
  round: number | string;
  season: string;
  raceName: string;
  circuitName: string;
  country?: string;
  date: string;
  series: 'f2' | 'f3';
  results: JolpicaRaceResult[];
  winner?: {
    code: string;
    fullName: string;
    teamName: string;
    time: string;
  };
  fastestLap?: {
    code: string;
    driverName: string;
    teamName: string;
    time: string;
    lap: number;
  };
  sprintRace?: JuniorSessionResult | null;
  featureRace?: JuniorSessionResult | null;
}


