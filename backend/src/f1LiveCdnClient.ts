import type {
  DriverLive,
  DriverStatus,
  FlagStatus,
  LiveSnapshot,
  MiniSectorStatus,
  RaceControlMessage,
  SectorStatus,
  SessionLive,
  SessionState,
  SessionType,
  TeamRadioCapture,
  TyreCompound,
} from './types.js';
import { getCircuitData } from './universalLiveEngine.js';

export interface F1CdnSessionInfo {
  Meeting?: {
    Key: number;
    Name: string;
    OfficialName: string;
    Location: string;
    Number: number;
    Country: {
      Key: number;
      Code: string;
      Name: string;
    };
    Circuit: {
      Key: number;
      ShortName: string;
    };
  };
  SessionStatus?: string;
  ArchiveStatus?: {
    Status: string;
  };
  Key?: number;
  Type?: string;
  Name?: string;
  StartDate?: string;
  EndDate?: string;
  GmtOffset?: string;
  Path?: string;
}

export interface F1CdnSector {
  Value?: string;
  PreviousValue?: string;
  OverallFastest?: boolean;
  PersonalFastest?: boolean;
  Segments?: Array<{ Status?: number }>;
}

export interface F1CdnSpeeds {
  I1?: { Value?: string; OverallFastest?: boolean; PersonalFastest?: boolean };
  I2?: { Value?: string; OverallFastest?: boolean; PersonalFastest?: boolean };
  FL?: { Value?: string; OverallFastest?: boolean; PersonalFastest?: boolean };
  ST?: { Value?: string; OverallFastest?: boolean; PersonalFastest?: boolean };
}

export interface F1CdnTimingLine {
  Position?: string;
  Line?: number;
  RacingNumber?: string;
  GapToLeader?: string;
  IntervalToPositionAhead?: { Value?: string; Catching?: boolean };
  NumberOfLaps?: number;
  NumberOfPitStops?: number;
  InPit?: boolean;
  PitOut?: boolean;
  Stopped?: boolean;
  Retired?: boolean;
  Status?: number;
  Sectors?: F1CdnSector[];
  Speeds?: F1CdnSpeeds;
  BestLapTime?: {
    Value?: string;
    Lap?: number;
    OverallFastest?: boolean;
    PersonalFastest?: boolean;
  };
  LastLapTime?: {
    Value?: string;
    Status?: number;
    OverallFastest?: boolean;
    PersonalFastest?: boolean;
  };
}

export interface F1CdnTimingData {
  Lines?: Record<string, F1CdnTimingLine>;
  Withheld?: boolean;
}

export interface F1CdnStint {
  LapTime?: string;
  LapNumber?: number;
  LapFlags?: number;
  Compound?: string;
  New?: string;
  TyresNotChanged?: string;
  TotalLaps?: number;
  StartLaps?: number;
}

export interface F1CdnTimingAppLine {
  RacingNumber?: string;
  Line?: number;
  GridPos?: string;
  Stints?: F1CdnStint[];
}

export interface F1CdnTimingAppData {
  Lines?: Record<string, F1CdnTimingAppLine>;
}

export interface F1CdnDriverEntry {
  RacingNumber?: string;
  BroadcastName?: string;
  FullName?: string;
  Tla?: string;
  Line?: number;
  TeamName?: string;
  TeamColour?: string;
  FirstName?: string;
  LastName?: string;
  Reference?: string;
  HeadshotUrl?: string;
}

export type F1CdnDriverList = Record<string, F1CdnDriverEntry>;

export interface F1CdnRaceControlMsg {
  Utc?: string;
  Lap?: number;
  Category?: string;
  Flag?: string;
  Scope?: string;
  Sector?: number;
  RacingNumber?: string;
  Message?: string;
}

export interface F1CdnRaceControl {
  Messages?: F1CdnRaceControlMsg[];
}

export interface F1CdnRadioCapture {
  Utc?: string;
  RacingNumber?: string;
  Path?: string;
}

export interface F1CdnTeamRadio {
  Captures?: F1CdnRadioCapture[] | Record<string, F1CdnRadioCapture>;
}

export class F1LiveCdnClient {
  private readonly baseUrl = 'https://livetiming.formula1.com/static';
  private readonly timeoutMs = 3500;
  private readonly userAgent =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

  private cachedSessionInfo: { timestamp: number; data: F1CdnSessionInfo | null } = {
    timestamp: 0,
    data: null,
  };

  // In-memory cache for static driver metadata per GP session (no need to re-fetch 15KB every 2s)
  private driverListCache = new Map<string, F1CdnDriverList>();

  // Long-term cache for completed races (prevents thousands of requests between GP weekends)
  private finalizedSnapshotCache: {
    sessionPath: string;
    timestamp: number;
    snapshot: LiveSnapshot;
  } | null = null;
  private readonly FINALIZED_CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

  private async fetchCdnJson<T>(path: string, cacheBust = true): Promise<T | null> {
    const bustParam = cacheBust ? `?_=${Date.now()}` : '';
    const url = `${this.baseUrl}/${path.replace(/^\//, '')}${bustParam}`;

    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': this.userAgent,
          Accept: 'application/json',
          'Cache-Control': 'no-cache',
        },
        signal: AbortSignal.timeout(this.timeoutMs),
      });

      if (!res.ok) {
        if (res.status !== 404) {
          console.warn(`[F1 CDN] ${path} returned HTTP ${res.status}`);
        }
        return null;
      }

      const text = await res.text();
      // Handle potential BOM (Byte Order Mark) from Microsoft/F1 IIS/CloudFront
      const sanitized = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
      return JSON.parse(sanitized) as T;
    } catch (err) {
      console.warn(`[F1 CDN] Request to ${path} failed:`, err instanceof Error ? err.message : err);
      return null;
    }
  }

  /**
   * Retrieves the currently active or most recent session metadata.
   */
  public async getSessionInfo(forceFresh = false): Promise<F1CdnSessionInfo | null> {
    const now = Date.now();
    // Cache SessionInfo for 5 seconds to reduce edge roundtrips
    if (
      !forceFresh &&
      this.cachedSessionInfo.data &&
      now - this.cachedSessionInfo.timestamp < 5000
    ) {
      return this.cachedSessionInfo.data;
    }

    const data = await this.fetchCdnJson<F1CdnSessionInfo>('SessionInfo.json');
    if (data) {
      this.cachedSessionInfo = { timestamp: now, data };
    }
    return data || this.cachedSessionInfo.data;
  }

  /**
   * Checks if an official session is currently in progress or recently finalised.
   */
  public async isLiveSessionActive(): Promise<boolean> {
    const session = await this.getSessionInfo();
    if (!session || !session.Path) return false;
    const status = session.SessionStatus?.toLowerCase() || '';
    return status === 'started' || status === 'ends';
  }

  /**
   * Builds an authentic, rich LiveSnapshot using official F1 CDN feeds.
   * Utilizes adaptive caching and parallel settled fetches to ensure maximum speed and stability.
   */
  public async getLiveRaceSnapshot(providedPath?: string): Promise<LiveSnapshot | null> {
    const sessionInfo = await this.getSessionInfo();
    const sessionPath = providedPath || sessionInfo?.Path;

    if (!sessionPath) {
      return null;
    }

    // Standardize trailing slash
    const normalizedPath = sessionPath.endsWith('/') ? sessionPath : `${sessionPath}/`;
    const isFinalised = sessionInfo?.SessionStatus?.toLowerCase() === 'finalised';

    // 1. Adaptive Cache: If session is finalised and cached, return immediately
    if (
      isFinalised &&
      this.finalizedSnapshotCache &&
      this.finalizedSnapshotCache.sessionPath === normalizedPath &&
      Date.now() - this.finalizedSnapshotCache.timestamp < this.FINALIZED_CACHE_TTL_MS
    ) {
      return this.finalizedSnapshotCache.snapshot;
    }

    // 2. Fetch DriverList: Only if not already cached in memory for this session
    let driverListMap = this.driverListCache.get(normalizedPath);
    const needDriverList = !driverListMap;

    // 3. Parallel Settled Feeds
    const [timingSettled, appDataSettled, driverListSettled, raceControlSettled, teamRadioSettled] =
      await Promise.allSettled([
        this.fetchCdnJson<F1CdnTimingData>(`${normalizedPath}TimingData.json`),
        this.fetchCdnJson<F1CdnTimingAppData>(`${normalizedPath}TimingAppData.json`),
        needDriverList
          ? this.fetchCdnJson<F1CdnDriverList>(`${normalizedPath}DriverList.json`, false)
          : Promise.resolve(null),
        this.fetchCdnJson<F1CdnRaceControl>(`${normalizedPath}RaceControlMessages.json`),
        this.fetchCdnJson<F1CdnTeamRadio>(`${normalizedPath}TeamRadio.json`),
      ]);

    const timingDataRaw = timingSettled.status === 'fulfilled' ? timingSettled.value : null;
    const timingAppDataRaw = appDataSettled.status === 'fulfilled' ? appDataSettled.value : null;
    const freshDriverList =
      driverListSettled.status === 'fulfilled' ? driverListSettled.value : null;
    const raceControlRaw =
      raceControlSettled.status === 'fulfilled' ? raceControlSettled.value : null;
    const teamRadioRaw = teamRadioSettled.status === 'fulfilled' ? teamRadioSettled.value : null;

    if (freshDriverList && Object.keys(freshDriverList).length > 0) {
      driverListMap = freshDriverList;
      this.driverListCache.set(normalizedPath, freshDriverList);
    }

    if (!timingDataRaw || !timingDataRaw.Lines) {
      return null;
    }

    const timingLines = timingDataRaw.Lines || {};
    const appDataLines = timingAppDataRaw?.Lines || {};
    const safeDriverList: F1CdnDriverList = driverListMap || {};

    const circuitName =
      sessionInfo?.Meeting?.Circuit?.ShortName || sessionInfo?.Meeting?.Name || '';
    const locationName = sessionInfo?.Meeting?.Location || '';
    const countryName = sessionInfo?.Meeting?.Country?.Name || '';
    const circuitMeta = getCircuitData(circuitName, locationName, countryName);

    // Track state detection (flag)
    let currentFlag: FlagStatus = 'GREEN';
    const messages: RaceControlMessage[] = [];
    if (raceControlRaw && Array.isArray(raceControlRaw.Messages)) {
      for (let i = 0; i < raceControlRaw.Messages.length; i++) {
        const m = raceControlRaw.Messages[i];
        if (!m) continue;

        messages.push({
          id: i + 1,
          time: m.Utc ? new Date(m.Utc).toLocaleTimeString('es-ES', { hour12: false }) : '',
          text: m.Message || '',
          flag: m.Flag || null,
        });

        const flagUpper = (m.Flag || '').toUpperCase();
        if (flagUpper.includes('CHEQUERED')) {
          currentFlag = 'CHEQUERED';
        } else if (flagUpper.includes('RED')) {
          currentFlag = 'RED';
        } else if (
          flagUpper.includes('SAFETY CAR') ||
          (m.Message || '').toUpperCase().includes('SAFETY CAR')
        ) {
          currentFlag = 'SC';
        } else if (
          flagUpper.includes('VIRTUAL') ||
          (m.Message || '').toUpperCase().includes('VIRTUAL SAFETY CAR')
        ) {
          currentFlag = 'VSC';
        } else if (flagUpper.includes('YELLOW') && currentFlag === 'GREEN') {
          currentFlag = 'YELLOW';
        }
      }
    }

    const isQualy =
      (sessionInfo?.Type || '').toLowerCase().includes('qual') ||
      (sessionInfo?.Name || '').toLowerCase().includes('qual');
    const sessionType: SessionType = isQualy ? 'Qualifying' : 'Race';

    // Parse drivers and normalize to DriverLive[]
    const parsedDrivers: DriverLive[] = [];
    let maxLapsCompleted = 0;

    for (const [racingNumStr, timing] of Object.entries(timingLines)) {
      if (!timing) continue;

      const num = Number.parseInt(racingNumStr, 10);
      if (Number.isNaN(num)) continue;

      const dInfo = safeDriverList[racingNumStr] || {};
      const appInfo = appDataLines[racingNumStr] || {};

      const pos = Number.parseInt(timing.Position || String(timing.Line || 99), 10) || 99;
      const isLeader = pos === 1;

      const numLaps = timing.NumberOfLaps ?? 0;
      if (numLaps > maxLapsCompleted) {
        maxLapsCompleted = numLaps;
      }

      // Sectors
      const sectorsRaw = Array.isArray(timing.Sectors) ? timing.Sectors : [];
      const s1Val = sectorsRaw[0]?.Value ? Number.parseFloat(sectorsRaw[0].Value) : null;
      const s2Val = sectorsRaw[1]?.Value ? Number.parseFloat(sectorsRaw[1].Value) : null;
      const s3Val = sectorsRaw[2]?.Value ? Number.parseFloat(sectorsRaw[2].Value) : null;

      const s1Status: SectorStatus = sectorsRaw[0]?.OverallFastest
        ? 'purple'
        : sectorsRaw[0]?.PersonalFastest
          ? 'green'
          : s1Val
            ? 'yellow'
            : 'none';
      const s2Status: SectorStatus = sectorsRaw[1]?.OverallFastest
        ? 'purple'
        : sectorsRaw[1]?.PersonalFastest
          ? 'green'
          : s2Val
            ? 'yellow'
            : 'none';
      const s3Status: SectorStatus = sectorsRaw[2]?.OverallFastest
        ? 'purple'
        : sectorsRaw[2]?.PersonalFastest
          ? 'green'
          : s3Val
            ? 'yellow'
            : 'none';

      // Parse mini-sectors if available
      const parseMiniSectors = (sectorObj: F1CdnSector | undefined): MiniSectorStatus[] => {
        if (!sectorObj?.Segments || !Array.isArray(sectorObj.Segments)) return [];
        return sectorObj.Segments.map((seg) => {
          const st = seg?.Status;
          if (st === 2049) return 'purple';
          if (st === 2048) return 'green';
          if (st === 2052 || st === 2064) return 'yellow';
          if (st === 2051) return 'blue';
          return 'none';
        });
      };

      // Tyres
      let tyreCompound: TyreCompound = 'UNKNOWN';
      let tyreLaps = 0;
      if (Array.isArray(appInfo.Stints) && appInfo.Stints.length > 0) {
        const latestStint = appInfo.Stints[appInfo.Stints.length - 1];
        const compoundStr = (latestStint.Compound || '').toUpperCase();
        if (compoundStr.includes('SOFT')) tyreCompound = 'SOFT';
        else if (compoundStr.includes('MED')) tyreCompound = 'MEDIUM';
        else if (compoundStr.includes('HARD')) tyreCompound = 'HARD';
        else if (compoundStr.includes('INTER')) tyreCompound = 'INTERMEDIATE';
        else if (compoundStr.includes('WET')) tyreCompound = 'WET';

        tyreLaps = latestStint.TotalLaps ?? 0;
      }

      // Status
      let driverStatus: DriverStatus = 'ACTIVE';
      if (timing.Retired) {
        driverStatus = 'DNF';
      } else if (timing.InPit) {
        driverStatus = 'PIT';
      } else if (timing.Stopped) {
        driverStatus = 'DNF';
      }

      // Colors
      let teamColor = '#E10600';
      if (dInfo.TeamColour) {
        teamColor = dInfo.TeamColour.startsWith('#') ? dInfo.TeamColour : `#${dInfo.TeamColour}`;
      }

      // Gap & Interval
      let gap = timing.GapToLeader || (isLeader ? (isQualy ? 'POLE' : 'LÍDER') : '- - -');
      if (isLeader && !gap) {
        gap = isQualy ? 'POLE' : 'LÍDER';
      }

      let interval =
        timing.IntervalToPositionAhead?.Value ||
        (isLeader ? (isQualy ? 'POLE' : 'LÍDER') : '- - -');
      if (isLeader && !interval) {
        interval = isQualy ? 'POLE' : 'LÍDER';
      }

      // Speed Trap & Speeds
      const speedTrap = timing.Speeds?.ST?.Value ? Number.parseFloat(timing.Speeds.ST.Value) : null;
      const i1Speed = timing.Speeds?.I1?.Value ? Number.parseFloat(timing.Speeds.I1.Value) : null;
      const i2Speed = timing.Speeds?.I2?.Value ? Number.parseFloat(timing.Speeds.I2.Value) : null;

      // Track location coordinate: only during active live session, NEVER when finalised
      const outlineLen = circuitMeta.outline.length;
      const stepOffset = outlineLen > 0 ? (((pos * 7) % outlineLen) + outlineLen) % outlineLen : 0;
      const location = !isFinalised && circuitMeta.outline[stepOffset]
        ? { x: circuitMeta.outline[stepOffset][0], y: circuitMeta.outline[stepOffset][1] }
        : null;

      const intervalSec = typeof interval === 'string' ? parseFloat(interval.replace('+', '').replace('s', '')) : NaN;
      const isOvertakeZone = !isQualy && !isLeader && !isNaN(intervalSec) && intervalSec > 0 && intervalSec <= 1.0;

      parsedDrivers.push({
        pos,
        posChange: 0,
        gridPosition: appInfo.GridPos ? Number.parseInt(appInfo.GridPos, 10) : undefined,
        driverNumber: num,
        code: dInfo.Tla || `C${num}`,
        fullName: dInfo.FullName || dInfo.BroadcastName || `Driver ${num}`,
        teamName: dInfo.TeamName || 'F1 Team',
        teamColor,
        gap,
        interval,
        isOvertakeZone,
        lastLapTime: timing.LastLapTime?.Value || '',
        bestLapTime: timing.BestLapTime?.Value || '',
        isFastestLap: Boolean(
          timing.BestLapTime?.OverallFastest || timing.LastLapTime?.OverallFastest,
        ),
        isPole: isLeader,
        pitStops: timing.NumberOfPitStops ?? 0,
        inPit: Boolean(timing.InPit),
        status: driverStatus,
        tyre: tyreCompound !== 'UNKNOWN' ? { compound: tyreCompound, laps: tyreLaps } : null,
        sectors: {
          s1: s1Val,
          s2: s2Val,
          s3: s3Val,
          s1Status,
          s2Status,
          s3Status,
          segments: {
            s1: parseMiniSectors(sectorsRaw[0]),
            s2: parseMiniSectors(sectorsRaw[1]),
            s3: parseMiniSectors(sectorsRaw[2]),
          },
        },
        speedTrap,
        i1Speed,
        i2Speed,
        location,
      });
    }

    // Sort by position ascending
    parsedDrivers.sort((a, b) => a.pos - b.pos);

    // Normalize Team Radios
    const teamRadios: TeamRadioCapture[] = [];
    if (teamRadioRaw?.Captures) {
      const rawCaptures: F1CdnRadioCapture[] = Array.isArray(teamRadioRaw.Captures)
        ? teamRadioRaw.Captures
        : Object.values(teamRadioRaw.Captures);

      for (const cap of rawCaptures) {
        if (!cap || !cap.Path || !cap.RacingNumber) continue;

        const dNum = Number.parseInt(String(cap.RacingNumber), 10);
        const matchingDriver = parsedDrivers.find((d) => d.driverNumber === dNum);
        const dInfo = safeDriverList[String(cap.RacingNumber)];

        const audioUrl = `${this.baseUrl}/${normalizedPath}${cap.Path.replace(/^\//, '')}`;
        teamRadios.push({
          id: `${cap.RacingNumber}_${cap.Utc}_${cap.Path}`,
          utc: cap.Utc || '',
          driverNumber: dNum,
          driverCode: matchingDriver?.code || dInfo?.Tla || `#${dNum}`,
          driverName: matchingDriver?.fullName || dInfo?.FullName || `Piloto ${dNum}`,
          teamName: matchingDriver?.teamName || dInfo?.TeamName || 'F1 Team',
          teamColor:
            matchingDriver?.teamColor || (dInfo?.TeamColour ? `#${dInfo.TeamColour}` : '#E10600'),
          audioUrl,
        });
      }

      // Most recent first
      teamRadios.reverse();
    }

    const totalLaps = circuitMeta.totalLaps > 0 ? circuitMeta.totalLaps : 57;
    const progressPercentage = Math.min(100, Math.round((maxLapsCompleted / totalLaps) * 100));

    const sessionState: SessionState =
      sessionInfo?.SessionStatus?.toLowerCase() === 'finalised'
        ? 'FINISHED'
        : sessionInfo?.SessionStatus?.toLowerCase() === 'started'
          ? 'IN_PROGRESS'
          : 'IN_PROGRESS';

    const sessionLive: SessionLive = {
      sessionKey: sessionInfo?.Key || 9999,
      sessionName: sessionInfo?.Name || 'Carrera Oficial',
      sessionType,
      location: locationName || 'Circuito',
      country: countryName || 'F1',
      circuit: circuitName || 'Circuito Oficial',
      status: sessionState,
      flag: currentFlag,
      currentLap: maxLapsCompleted,
      totalLaps,
      progressPercentage,
      timestamp: Math.floor(Date.now() / 1000),
    };

    const snapshotResult: LiveSnapshot = {
      session: sessionLive,
      drivers: parsedDrivers,
      messages: messages.slice(-25).reverse(),
      teamRadios,
      circuitTrack: {
        circuitName: circuitMeta.bounds ? circuitName : 'Circuito Oficial',
        outline: circuitMeta.outline,
        bounds: circuitMeta.bounds,
      },
      history: [],
    };

    // Store in finalized cache if session is complete
    if (isFinalised) {
      this.finalizedSnapshotCache = {
        sessionPath: normalizedPath,
        timestamp: Date.now(),
        snapshot: snapshotResult,
      };
    }

    return snapshotResult;
  }
}

export const f1LiveCdnClient = new F1LiveCdnClient();
