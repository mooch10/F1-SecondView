import type {
  OpenF1Driver,
  OpenF1Interval,
  OpenF1Lap,
  OpenF1Location,
  OpenF1Position,
  OpenF1RaceControl,
  OpenF1Session,
  OpenF1Stint,
  OpenF1Weather,
} from './openf1.js';
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
  TrackOutline,
  TrackWeather,
  TyreCompound,
} from './types.js';

function getSessionType(sessionName?: string, sessionType?: string): SessionType {
  const text = `${sessionName || ''} ${sessionType || ''}`.toLowerCase();
  if (text.includes('qualifying') || text.includes('shootout') || text.includes('qualy')) {
    return 'Qualifying';
  }
  if (text.includes('practice')) {
    return 'Practice';
  }
  return 'Race';
}

function getQualifyingPhase(messages: OpenF1RaceControl[] = []): 'Q1' | 'Q2' | 'Q3' | null {
  if (!Array.isArray(messages) || messages.length === 0) return 'Q1';
  let phase: 'Q1' | 'Q2' | 'Q3' = 'Q1';
  for (const m of messages) {
    const text = m.message?.toUpperCase() || '';
    if (
      text.includes('Q3 WILL START') ||
      text.includes('START OF Q3') ||
      text.includes('Q3 STARTED')
    ) {
      phase = 'Q3';
    } else if (
      text.includes('Q2 WILL START') ||
      text.includes('START OF Q2') ||
      text.includes('Q2 STARTED')
    ) {
      if (phase !== 'Q3') phase = 'Q2';
    }
  }
  return phase;
}

function getQualifyingPhaseBoundaries(messages: OpenF1RaceControl[] = []): {
  q2StartTime?: string;
  q3StartTime?: string;
} {
  let q2StartTime: string | undefined;
  let q3StartTime: string | undefined;

  for (const m of messages) {
    const text = m.message?.toUpperCase() || '';
    if (
      (m.qualifying_phase === 3 &&
        (m.category === 'SessionStatus' ||
          text.includes('GREEN LIGHT') ||
          text.includes('PIT EXIT OPEN'))) ||
      text.includes('START OF Q3') ||
      text.includes('Q3 STARTED')
    ) {
      if (!q3StartTime && m.date) q3StartTime = m.date;
    } else if (
      (m.qualifying_phase === 2 &&
        (m.category === 'SessionStatus' ||
          text.includes('GREEN LIGHT') ||
          text.includes('PIT EXIT OPEN'))) ||
      text.includes('START OF Q2') ||
      text.includes('Q2 STARTED')
    ) {
      if (!q2StartTime && m.date) q2StartTime = m.date;
    }
  }

  // Fallback: If no explicit green light / session started, check any message with qualifying_phase 2 or 3
  if (!q2StartTime) {
    const q2Msg = messages.find((m) => m.qualifying_phase === 2 && m.date);
    if (q2Msg?.date) q2StartTime = q2Msg.date;
  }
  if (!q3StartTime) {
    const q3Msg = messages.find((m) => m.qualifying_phase === 3 && m.date);
    if (q3Msg?.date) q3StartTime = q3Msg.date;
  }

  return { q2StartTime, q3StartTime };
}

function getLapQualifyingPhase(
  lapDate?: string,
  boundaries?: { q2StartTime?: string; q3StartTime?: string },
): 'Q1' | 'Q2' | 'Q3' {
  if (!lapDate || !boundaries) return 'Q1';
  if (boundaries.q3StartTime && lapDate >= boundaries.q3StartTime) return 'Q3';
  if (boundaries.q2StartTime && lapDate >= boundaries.q2StartTime) return 'Q2';
  return 'Q1';
}

const CIRCUIT_LAPS: Record<string, number> = {
  madrid: 57,
  madring: 57,
  ifema: 57,
  valdebebas: 57,
  spain: 57,
  bahrain: 57,
  sakhir: 57,
  jeddah: 50,
  saudi: 50,
  melbourne: 58,
  albert_park: 58,
  suzuka: 53,
  japan: 53,
  shanghai: 56,
  china: 56,
  miami: 57,
  imola: 63,
  monaco: 78,
  monte_carlo: 78,
  montreal: 70,
  villeneuve: 70,
  barcelona: 66,
  catalunya: 66,
  montmelo: 66,
  spielberg: 71,
  red_bull_ring: 71,
  silverstone: 52,
  hungaroring: 70,
  spa: 44,
  francorchamps: 44,
  zandvoort: 72,
  monza: 53,
  italy: 53,
  baku: 51,
  azerbaijan: 51,
  sepang: 56,
  malaysia: 56,
  singapore: 62,
  marina_bay: 62,
  austin: 56,
  americas: 56,
  mexico: 71,
  rodriguez: 71,
  interlagos: 71,
  sao_paulo: 71,
  vegas: 50,
  las_vegas: 50,
  losail: 57,
  qatar: 57,
  yas_marina: 58,
  abu_dhabi: 58,
};

function getCircuitTotalLaps(session: OpenF1Session | null, maxLapNumber?: number): number {
  if (!session) return 58;
  const terms = [session.circuit_short_name, session.location, session.country_name]
    .filter(Boolean)
    .map((t) =>
      t
        .toLowerCase()
        .trim()
        .replace(/[\s-]+/g, '_'),
    );

  for (const term of terms) {
    for (const [key, laps] of Object.entries(CIRCUIT_LAPS)) {
      if (term.includes(key) || key.includes(term)) {
        return laps;
      }
    }
  }
  if (maxLapNumber && maxLapNumber >= 40 && maxLapNumber <= 80) {
    return maxLapNumber;
  }
  return 58;
}

function formatLapTime(seconds: number | null | undefined): string {
  if (typeof seconds !== 'number' || Number.isNaN(seconds) || seconds <= 0) {
    return '- - -';
  }
  const mins = Math.floor(seconds / 60);
  const remSecs = (seconds % 60).toFixed(3);
  return `${mins}:${remSecs.padStart(6, '0')}`;
}

function formatGap(gap: number | null | undefined, isLeader: boolean): string {
  if (isLeader) return 'LEADER';
  if (typeof gap !== 'number' || Number.isNaN(gap)) return '- - -';
  return `+${gap.toFixed(3)}`;
}

function parseCompound(raw: string | null | undefined): TyreCompound {
  if (!raw) return 'UNKNOWN';
  const c = raw.toUpperCase().trim();
  if (c.includes('SOFT') || c === 'C4' || c === 'C5' || c === 'C6') return 'SOFT';
  if (c.includes('MEDIUM') || c === 'C3') return 'MEDIUM';
  if (c.includes('HARD') || c === 'C1' || c === 'C2') return 'HARD';
  if (c.includes('INTER')) return 'INTERMEDIATE';
  if (c.includes('WET')) return 'WET';
  return 'UNKNOWN';
}

function parseTrackWeather(rawWeather?: OpenF1Weather[]): TrackWeather | null {
  if (!rawWeather || rawWeather.length === 0) return null;
  const latest = rawWeather[rawWeather.length - 1];
  return {
    airTemp: latest.air_temperature,
    trackTemp: latest.track_temperature,
    humidity: latest.humidity,
    rainfall: Boolean(latest.rainfall && latest.rainfall > 0),
    windSpeed: latest.wind_speed,
    windDirection: latest.wind_direction,
  };
}

function mapSegmentStatus(val: number | null | undefined): MiniSectorStatus {
  if (val === 2051) return 'purple';
  if (val === 2049) return 'green';
  if (val === 2048 || val === 2050) return 'yellow';
  if (val === 2064) return 'blue';
  return 'none';
}

export function buildLiveSnapshot(
  session: OpenF1Session | null,
  rawDrivers: OpenF1Driver[] = [],
  rawPositions: OpenF1Position[] = [],
  rawIntervals: OpenF1Interval[] = [],
  rawStints: OpenF1Stint[] = [],
  rawLaps: OpenF1Lap[] = [],
  rawRaceControl: OpenF1RaceControl[] = [],
  rawWeather: OpenF1Weather[] = [],
  rawLocations: OpenF1Location[] = [],
  trackOutline: TrackOutline | null = null,
): LiveSnapshot {
  const rawSafeDrivers = Array.isArray(rawDrivers) ? rawDrivers : [];
  const uniqueDriversMap = new Map<number, OpenF1Driver>();
  for (const d of rawSafeDrivers) {
    if (d.driver_number) {
      uniqueDriversMap.set(d.driver_number, d);
    }
  }
  const safeDrivers = Array.from(uniqueDriversMap.values());
  const safePositions = Array.isArray(rawPositions) ? rawPositions : [];
  const safeIntervals = Array.isArray(rawIntervals) ? rawIntervals : [];
  const safeStints = Array.isArray(rawStints) ? rawStints : [];
  const safeLaps = Array.isArray(rawLaps) ? rawLaps : [];
  const safeRaceControl = Array.isArray(rawRaceControl) ? rawRaceControl : [];
  const safeWeather = Array.isArray(rawWeather) ? rawWeather : [];
  const safeLocations = Array.isArray(rawLocations) ? rawLocations : [];

  const sessionType = getSessionType(session?.session_name, session?.session_type);
  const qualifyingPhase = sessionType === 'Qualifying' ? getQualifyingPhase(safeRaceControl) : null;
  const qualyBoundaries =
    sessionType === 'Qualifying' ? getQualifyingPhaseBoundaries(safeRaceControl) : undefined;

  // Latest car location coordinates mapping
  const latestLocationByDriver = new Map<number, { x: number; y: number }>();
  for (const loc of safeLocations) {
    if (loc.x !== 0 || loc.y !== 0) {
      latestLocationByDriver.set(loc.driver_number, { x: loc.x, y: loc.y });
    }
  }

  // 1. Starting grid mapping (earliest recorded position per driver)
  const gridPositionByDriver = new Map<number, number>();
  for (const p of safePositions) {
    if (!gridPositionByDriver.has(p.driver_number)) {
      gridPositionByDriver.set(p.driver_number, p.position);
    }
  }

  // 2. Steward penalties mapping (sum of time penalties from race control)
  const penaltiesByDriver = new Map<number, number>();
  for (const msg of safeRaceControl) {
    const text = msg.message;
    const match = text.match(/(\d+)\s*SECOND\s*TIME\s*PENALTY.*?FOR\s*CAR\s*(\d+)/i);
    if (match) {
      const sec = Number.parseInt(match[1], 10);
      const carNum = Number.parseInt(match[2], 10);
      penaltiesByDriver.set(carNum, (penaltiesByDriver.get(carNum) || 0) + sec);
    }
  }

  // 3. Get latest position per driver
  const latestPositionByDriver = new Map<number, number>();
  for (const p of safePositions) {
    latestPositionByDriver.set(p.driver_number, p.position);
  }

  // 4. Get latest interval per driver
  const latestIntervalByDriver = new Map<number, OpenF1Interval>();
  for (const item of safeIntervals) {
    latestIntervalByDriver.set(item.driver_number, item);
  }

  // 5. Stints grouping & max stint number per driver (to calculate pit stops & tyres)
  const latestStintByDriver = new Map<number, OpenF1Stint>();
  const maxStintByDriver = new Map<number, number>();

  for (const s of safeStints) {
    const prevMax = maxStintByDriver.get(s.driver_number) || 0;
    if (s.stint_number && s.stint_number > prevMax) {
      maxStintByDriver.set(s.driver_number, s.stint_number);
    }
    const existing = latestStintByDriver.get(s.driver_number);
    if (!existing || (s.stint_number && s.stint_number > (existing.stint_number || 0))) {
      latestStintByDriver.set(s.driver_number, s);
    }
  }

  // 6. Group all laps by driver & determine overall fastest lap and best lap per driver
  const lapsByDriver = new Map<number, OpenF1Lap[]>();
  const bestLapByDriver = new Map<number, number>();
  const bestLapObjByDriver = new Map<number, OpenF1Lap>();
  const bestQ1ByDriver = new Map<number, number>();
  const bestQ2ByDriver = new Map<number, number>();
  const bestQ3ByDriver = new Map<number, number>();
  let fastestLapOverall = Number.POSITIVE_INFINITY;
  let fastestLapDriverNumber: number | null = null;
  let maxLapNumber = 0;

  let overallBestS1 = Number.POSITIVE_INFINITY;
  let overallBestS2 = Number.POSITIVE_INFINITY;
  let overallBestS3 = Number.POSITIVE_INFINITY;
  const bestS1ByDriver = new Map<number, number>();
  const bestS2ByDriver = new Map<number, number>();
  const bestS3ByDriver = new Map<number, number>();

  for (const lap of safeLaps) {
    if (!lapsByDriver.has(lap.driver_number)) {
      lapsByDriver.set(lap.driver_number, []);
    }
    lapsByDriver.get(lap.driver_number)?.push(lap);

    if (lap.lap_number > maxLapNumber) {
      maxLapNumber = lap.lap_number;
    }

    if (lap.duration_sector_1 && lap.duration_sector_1 > 0) {
      if (lap.duration_sector_1 < overallBestS1) {
        overallBestS1 = lap.duration_sector_1;
      }
      const curS1 = bestS1ByDriver.get(lap.driver_number) ?? Number.POSITIVE_INFINITY;
      if (lap.duration_sector_1 < curS1) {
        bestS1ByDriver.set(lap.driver_number, lap.duration_sector_1);
      }
    }

    if (lap.duration_sector_2 && lap.duration_sector_2 > 0) {
      if (lap.duration_sector_2 < overallBestS2) {
        overallBestS2 = lap.duration_sector_2;
      }
      const curS2 = bestS2ByDriver.get(lap.driver_number) ?? Number.POSITIVE_INFINITY;
      if (lap.duration_sector_2 < curS2) {
        bestS2ByDriver.set(lap.driver_number, lap.duration_sector_2);
      }
    }

    if (lap.duration_sector_3 && lap.duration_sector_3 > 0) {
      if (lap.duration_sector_3 < overallBestS3) {
        overallBestS3 = lap.duration_sector_3;
      }
      const curS3 = bestS3ByDriver.get(lap.driver_number) ?? Number.POSITIVE_INFINITY;
      if (lap.duration_sector_3 < curS3) {
        bestS3ByDriver.set(lap.driver_number, lap.duration_sector_3);
      }
    }

    if (lap.lap_duration && lap.lap_duration > 0) {
      const currentBest = bestLapByDriver.get(lap.driver_number) ?? Number.POSITIVE_INFINITY;
      if (lap.lap_duration < currentBest) {
        bestLapByDriver.set(lap.driver_number, lap.lap_duration);
        bestLapObjByDriver.set(lap.driver_number, lap);
      }

      if (lap.lap_duration < fastestLapOverall) {
        fastestLapOverall = lap.lap_duration;
        fastestLapDriverNumber = lap.driver_number;
      }

      if (sessionType === 'Qualifying') {
        const phase = getLapQualifyingPhase(lap.date_start, qualyBoundaries);
        if (phase === 'Q1') {
          const cQ1 = bestQ1ByDriver.get(lap.driver_number) ?? Number.POSITIVE_INFINITY;
          if (lap.lap_duration < cQ1) {
            bestQ1ByDriver.set(lap.driver_number, lap.lap_duration);
          }
        } else if (phase === 'Q2') {
          const cQ2 = bestQ2ByDriver.get(lap.driver_number) ?? Number.POSITIVE_INFINITY;
          if (lap.lap_duration < cQ2) {
            bestQ2ByDriver.set(lap.driver_number, lap.lap_duration);
          }
        } else if (phase === 'Q3') {
          const cQ3 = bestQ3ByDriver.get(lap.driver_number) ?? Number.POSITIVE_INFINITY;
          if (lap.lap_duration < cQ3) {
            bestQ3ByDriver.set(lap.driver_number, lap.lap_duration);
          }
        }
      }
    }
  }

  // 7. Build DriverLive array with DNF detection, grid deltas and penalties
  const drivers: DriverLive[] = safeDrivers.map((driver) => {
    const num = driver.driver_number;
    const pos = latestPositionByDriver.get(num) ?? 99;
    const gridPos = gridPositionByDriver.get(num);
    const intervalData = latestIntervalByDriver.get(num);
    const stint = latestStintByDriver.get(num);
    const driverLaps = lapsByDriver.get(num) || [];
    const latestLap = driverLaps[driverLaps.length - 1];

    const driverMaxLap =
      driverLaps.length > 0 ? Math.max(...driverLaps.map((l) => l.lap_number)) : 0;

    // DNF detection: Only if car is explicitly retired, stopped on track, had incident,
    // or driver is in pits and stopped recording laps >= 10 laps behind leader while race continues.
    // Lapped/rezagado cars that are still actively circulating are NEVER marked DNF.
    const driverRc = safeRaceControl.find((m) => {
      const msg = m.message.toUpperCase();
      return (
        msg.includes(`CAR ${num}`) ||
        msg.includes(`CARS ${num}`) ||
        (driver.name_acronym && msg.includes(driver.name_acronym.toUpperCase()))
      );
    });

    const isRcRetired = Boolean(
      driverRc &&
        (driverRc.message.toUpperCase().includes('STOPPED') ||
          driverRc.message.toUpperCase().includes('RETIRED') ||
          driverRc.message.toUpperCase().includes('OUT OF THE RACE') ||
          driverRc.message.toUpperCase().includes('COLLISION') ||
          driverRc.message.toUpperCase().includes('ACCIDENT')),
    );

    const isLongStoppedInPit =
      sessionType === 'Race' &&
      maxLapNumber >= 15 &&
      maxLapNumber - driverMaxLap >= 10 &&
      latestLap?.is_pit_out_lap === false;

    const isDnf = isRcRetired || isLongStoppedInPit;

    let retirementReason: string | undefined;
    if (isDnf) {
      if (driverRc) {
        const msg = driverRc.message.toUpperCase();
        if (msg.includes('COLLISION') || msg.includes('INCIDENT')) {
          retirementReason = 'Colisión / Daños';
        } else if (msg.includes('STOPPED')) {
          retirementReason = 'Detenido en pista';
        } else if (msg.includes('MECHANICAL') || msg.includes('ENGINE')) {
          retirementReason = 'Fallo mecánico';
        } else {
          retirementReason = 'Abandono';
        }
      } else {
        retirementReason = 'Abandono en boxes';
      }
    }

    const driverStatus: DriverStatus = isDnf ? 'DNF' : latestLap?.is_pit_out_lap ? 'PIT' : 'ACTIVE';

    const isLeader = pos === 1;
    const gap = isDnf ? 'RET' : formatGap(intervalData?.gap_to_leader, isLeader);
    const intervalStr = isDnf
      ? 'RET'
      : isLeader
        ? 'LEADER'
        : typeof intervalData?.interval === 'number'
          ? `+${intervalData.interval.toFixed(3)}`
          : '- - -';

    const intervalNum = intervalData?.interval ?? null;
    const isDrsZone =
      sessionType === 'Race' &&
      !isDnf &&
      !isLeader &&
      intervalNum !== null &&
      intervalNum > 0 &&
      intervalNum <= 1.0;
    const isOvertakeZone = isDrsZone;

    // Tyre calculations
    let tyreInfo = null;
    if (stint) {
      const stintLaps = stint.lap_end
        ? stint.lap_end - stint.lap_start + 1
        : Math.max(0, driverMaxLap - stint.lap_start + 1);
      tyreInfo = {
        compound: parseCompound(stint.compound),
        laps: (stint.tyre_age_at_start || 0) + stintLaps,
      };
    }

    // Pit stop count from stints
    const maxStint = maxStintByDriver.get(num) || 1;
    const pitStops = Math.max(0, maxStint - 1);

    const teamColorHex = driver.team_colour
      ? driver.team_colour.startsWith('#')
        ? driver.team_colour
        : `#${driver.team_colour}`
      : '#71717A';

    const rawBestLapDuration = bestLapByDriver.get(num) ?? null;
    const q1Dur = bestQ1ByDriver.get(num) ?? null;
    const q2Dur = bestQ2ByDriver.get(num) ?? null;
    const q3Dur = bestQ3ByDriver.get(num) ?? null;

    // For Qualifying, official final time is their time in the furthest phase reached
    const bestLapDuration =
      sessionType === 'Qualifying'
        ? (q3Dur ?? q2Dur ?? q1Dur ?? rawBestLapDuration)
        : rawBestLapDuration;
    const bestLapTime = formatLapTime(bestLapDuration);

    const q1Time = q1Dur ? formatLapTime(q1Dur) : null;
    const q2Time = q2Dur ? formatLapTime(q2Dur) : null;
    const q3Time = q3Dur ? formatLapTime(q3Dur) : null;

    const carLocation = latestLocationByDriver.get(num) ?? null;
    const penaltySeconds = penaltiesByDriver.get(num);

    // Delta vs starting grid in race: gridPos - pos (e.g. Started 18, now 12 -> +6)
    const posChange =
      sessionType === 'Race' && typeof gridPos === 'number' && !isDnf ? gridPos - pos : 0;

    const bestLapObj = bestLapObjByDriver.get(num);

    const isQualyOrPractice = sessionType === 'Qualifying' || sessionType === 'Practice';
    const isFlyingLap = Boolean(
      latestLap &&
        !latestLap.is_pit_out_lap &&
        latestLap.lap_duration === null &&
        latestLap.duration_sector_1 !== null &&
        (!bestS1ByDriver.has(num) ||
          latestLap.duration_sector_1 <= (bestS1ByDriver.get(num) || 0) + 3.0),
    );

    const targetLap = isQualyOrPractice
      ? isFlyingLap
        ? latestLap
        : bestLapObj || latestLap
      : latestLap || bestLapObj;

    const s1Val = targetLap?.duration_sector_1 ?? null;
    const s2Val = targetLap?.duration_sector_2 ?? null;
    const s3Val = targetLap?.duration_sector_3 ?? null;

    const calcStatus = (
      val: number | null,
      overallBest: number,
      driverBest?: number,
    ): SectorStatus => {
      if (typeof val !== 'number' || Number.isNaN(val) || val <= 0) return 'none';
      if (val <= overallBest + 0.001) return 'purple';
      if (driverBest && val <= driverBest + 0.001) return 'green';
      return 'yellow';
    };

    const s1Status = calcStatus(s1Val, overallBestS1, bestS1ByDriver.get(num));
    const s2Status = calcStatus(s2Val, overallBestS2, bestS2ByDriver.get(num));
    const s3Status = calcStatus(s3Val, overallBestS3, bestS3ByDriver.get(num));

    const segments = {
      s1: (targetLap?.segments_sector_1 || []).map(mapSegmentStatus),
      s2: (targetLap?.segments_sector_2 || []).map(mapSegmentStatus),
      s3: (targetLap?.segments_sector_3 || []).map(mapSegmentStatus),
    };

    const speedTrap = targetLap?.st_speed ?? bestLapObj?.st_speed ?? null;
    const i1Speed = targetLap?.i1_speed ?? bestLapObj?.i1_speed ?? null;
    const i2Speed = targetLap?.i2_speed ?? bestLapObj?.i2_speed ?? null;

    return {
      pos: isDnf ? 99 : pos,
      posChange,
      gridPosition: gridPos,
      driverNumber: num,
      code: driver.name_acronym || 'DRV',
      fullName: driver.full_name || driver.broadcast_name || 'Unknown',
      teamName: driver.team_name || 'Independent',
      teamColor: teamColorHex,
      gap,
      interval: intervalStr,
      isDrsZone,
      isOvertakeZone,
      lastLapTime: isDnf ? 'OUT' : formatLapTime(latestLap?.lap_duration),
      bestLapTime,
      bestLapDuration,
      isFastestLap: !isDnf && fastestLapDriverNumber === num,
      penaltySeconds,
      tyre: tyreInfo,
      pitStops,
      inPit: latestLap?.is_pit_out_lap || false,
      status: driverStatus,
      retiredLap: isDnf ? driverMaxLap : undefined,
      retirementReason,
      sectors: {
        s1: s1Val,
        s2: s2Val,
        s3: s3Val,
        s1Status,
        s2Status,
        s3Status,
        segments,
      },
      speedTrap,
      i1Speed,
      i2Speed,
      location: carLocation,
      q1Time,
      q2Time,
      q3Time,
      q1Duration: q1Dur,
      q2Duration: q2Dur,
      q3Duration: q3Dur,
    };
  });

  // Polymorphic sorting and metrics assignment
  if (sessionType === 'Qualifying' || sessionType === 'Practice') {
    if (sessionType === 'Qualifying') {
      // Sort drivers according to official F1 Qualifying rules:
      // Drivers reaching Q3 (Tier 3), then drivers eliminated in Q2 (Tier 2), then drivers eliminated in Q1 (Tier 1)
      drivers.sort((a, b) => {
        const aTier = a.q3Duration ? 3 : a.q2Duration ? 2 : a.q1Duration ? 1 : 0;
        const bTier = b.q3Duration ? 3 : b.q2Duration ? 2 : b.q1Duration ? 1 : 0;
        if (aTier !== bTier) {
          return bTier - aTier;
        }

        const aDur =
          aTier === 3
            ? a.q3Duration
            : aTier === 2
              ? a.q2Duration
              : aTier === 1
                ? a.q1Duration
                : a.bestLapDuration;
        const bDur =
          bTier === 3
            ? b.q3Duration
            : bTier === 2
              ? b.q2Duration
              : bTier === 1
                ? b.q1Duration
                : b.bestLapDuration;

        if (aDur !== null && bDur !== null && aDur !== undefined && bDur !== undefined) {
          return aDur - bDur;
        }
        if (aDur !== null && aDur !== undefined) return -1;
        if (bDur !== null && bDur !== undefined) return 1;
        return a.driverNumber - b.driverNumber;
      });
    } else {
      // Sort by bestLapDuration ascending (valid lap times first, then drivers without times)
      drivers.sort((a, b) => {
        const aDur = typeof a.bestLapDuration === 'number' ? a.bestLapDuration : null;
        const bDur = typeof b.bestLapDuration === 'number' ? b.bestLapDuration : null;
        if (aDur !== null && bDur !== null) {
          return aDur - bDur;
        }
        if (aDur !== null && bDur === null) return -1;
        if (aDur === null && bDur !== null) return 1;
        return a.driverNumber - b.driverNumber;
      });
    }

    const poleLapDuration =
      drivers.length > 0 && typeof drivers[0].bestLapDuration === 'number'
        ? drivers[0].bestLapDuration
        : null;

    drivers.forEach((driver, idx) => {
      driver.pos = idx + 1;
      const driverDuration =
        typeof driver.bestLapDuration === 'number' ? driver.bestLapDuration : null;

      if (idx === 0 && poleLapDuration !== null) {
        driver.isPole = sessionType === 'Qualifying';
        driver.gap = sessionType === 'Qualifying' ? 'POLE' : 'LÍDER';
        driver.interval = sessionType === 'Qualifying' ? 'POLE' : 'LÍDER';
      } else if (poleLapDuration !== null && driverDuration !== null) {
        driver.isPole = false;
        driver.gap = formatGap(driverDuration - poleLapDuration, false);
        const prevDuration =
          typeof drivers[idx - 1]?.bestLapDuration === 'number'
            ? (drivers[idx - 1].bestLapDuration as number)
            : null;
        driver.interval =
          prevDuration !== null ? formatGap(driverDuration - prevDuration, false) : '- - -';
      } else {
        driver.gap = 'SIN TIEMPO';
        driver.interval = '- - -';
      }

      if (sessionType === 'Qualifying') {
        if (driver.pos > 15) {
          driver.eliminatedPhase = 'Q1';
        } else if (driver.pos > 10) {
          driver.eliminatedPhase = 'Q2';
        } else {
          driver.eliminatedPhase = null;
        }
      }
    });
  } else {
    // Race: Sort active drivers by position, DNF drivers at the end
    drivers.sort((a, b) => {
      if (a.status === 'DNF' && b.status !== 'DNF') return 1;
      if (a.status !== 'DNF' && b.status === 'DNF') return -1;
      return a.pos - b.pos;
    });

    // Re-index positions for active drivers
    let currentActivePos = 1;
    for (const d of drivers) {
      if (d.status !== 'DNF') {
        d.pos = currentActivePos++;
      }
    }
  }

  // 8. Build Session Status & Flags
  let flag: FlagStatus = 'GREEN';
  let sessionState: SessionState = 'IN_PROGRESS';

  for (const m of safeRaceControl) {
    const textUpper = m.message.toUpperCase();
    if (textUpper.includes('CHEQUERED')) {
      flag = 'CHEQUERED';
      sessionState = 'FINISHED';
    } else if (textUpper.includes('RED FLAG')) {
      flag = 'RED';
      sessionState = 'SUSPENDED';
    } else if (textUpper.includes('SAFETY CAR') && !textUpper.includes('VIRTUAL')) {
      flag = 'SC';
    } else if (textUpper.includes('VIRTUAL SAFETY CAR')) {
      flag = 'VSC';
    } else if (textUpper.includes('YELLOW')) {
      flag = 'YELLOW';
    }
  }

  const totalCircuitLaps = sessionType === 'Race' ? getCircuitTotalLaps(session, maxLapNumber) : 0;

  // Check if session has passed its scheduled end time
  const isPastEndTime = session?.date_end
    ? Date.now() > new Date(session.date_end).getTime() + 10 * 60 * 1000
    : false;

  const isRaceFinished =
    sessionType === 'Race' &&
    (sessionState === 'FINISHED' ||
      flag === 'CHEQUERED' ||
      isPastEndTime ||
      (totalCircuitLaps > 0 && maxLapNumber >= totalCircuitLaps));

  if (sessionState === 'FINISHED' || isPastEndTime || isRaceFinished || drivers.length === 0) {
    sessionState = 'FINISHED';
    flag = 'CHEQUERED';
  }

  const currentLap =
    sessionType === 'Race'
      ? sessionState === 'FINISHED' && totalCircuitLaps > 0
        ? totalCircuitLaps
        : Math.min(maxLapNumber, totalCircuitLaps || maxLapNumber)
      : maxLapNumber;

  const messages: RaceControlMessage[] = safeRaceControl
    .slice(-20)
    .reverse()
    .map((m, idx) => ({
      id: idx + 1,
      time: m.date ? m.date.substring(11, 19) : '--:--:--',
      text: m.message,
      flag: m.flag,
    }));

  const progressPercentage =
    sessionType === 'Race'
      ? sessionState === 'FINISHED' || isRaceFinished
        ? 100
        : totalCircuitLaps > 0
          ? Math.min(100, Math.round((currentLap / totalCircuitLaps) * 100))
          : 0
      : sessionState === 'FINISHED'
        ? 100
        : qualifyingPhase === 'Q3'
          ? 80
          : qualifyingPhase === 'Q2'
            ? 50
            : 20;

  const poleDriver =
    sessionType !== 'Race' && drivers.length > 0 && drivers[0].bestLapDuration
      ? drivers[0].code
      : null;
  const poleLapTime =
    sessionType !== 'Race' && drivers.length > 0 && drivers[0].bestLapDuration
      ? drivers[0].bestLapTime
      : null;

  const rawCircuit = session?.circuit_short_name ?? '';
  const circuitNameClean = rawCircuit.toLowerCase().includes('madring')
    ? 'Circuito de Madrid'
    : rawCircuit;

  const sessionLive: SessionLive = {
    sessionKey: session?.session_key ?? 0,
    sessionName: session?.session_name ?? 'Gran Premio',
    sessionType,
    qualifyingPhase,
    poleDriver,
    poleLapTime,
    location: session?.location ?? '',
    country: session?.country_name ?? '',
    circuit: circuitNameClean,
    status: sessionState,
    flag,
    currentLap,
    totalLaps: totalCircuitLaps,
    progressPercentage: sessionState === 'FINISHED' || isRaceFinished ? 100 : progressPercentage,
    timestamp: Math.floor(Date.now() / 1000),
  };

  const weather = parseTrackWeather(safeWeather);

  return {
    session: sessionLive,
    weather,
    messages,
    drivers,
    circuitTrack: trackOutline,
    history: [
      {
        timestamp: sessionLive.timestamp,
        drivers,
        session: sessionLive,
        messages,
        weather,
      },
    ],
  };
}
