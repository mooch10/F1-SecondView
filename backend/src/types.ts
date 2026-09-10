export type TyreCompound = 'SOFT' | 'MEDIUM' | 'HARD' | 'INTERMEDIATE' | 'WET' | 'UNKNOWN';

export type DriverStatus = 'ACTIVE' | 'PIT' | 'DNF' | 'DNS' | 'DSQ';

export type FlagStatus = 'GREEN' | 'YELLOW' | 'VSC' | 'SC' | 'RED' | 'CHEQUERED';

export type SessionState = 'SCHEDULED' | 'IN_PROGRESS' | 'FINISHED' | 'SUSPENDED';

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
  driverNumber: number;
  code: string;
  fullName: string;
  teamName: string;
  teamColor: string;
  gap: string;
  interval: string;
  isDrsZone: boolean;
  lastLapTime: string;
  isFastestLap: boolean;
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

interface HistorySnapshot {
  timestamp: number;
  drivers: DriverLive[];
}

export interface LiveSnapshot {
  session: SessionLive;
  weather?: TrackWeather | null;
  messages: RaceControlMessage[];
  drivers: DriverLive[];
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
