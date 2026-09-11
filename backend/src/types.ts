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

interface HistorySnapshot {
  timestamp: number;
  drivers: DriverLive[];
}

export interface LiveSnapshot {
  session: SessionLive;
  weather?: TrackWeather | null;
  messages: RaceControlMessage[];
  drivers: DriverLive[];
  circuitTrack?: TrackOutline | null;
  history: HistorySnapshot[];
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
