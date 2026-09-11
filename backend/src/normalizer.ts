import type {
  OpenF1Driver,
  OpenF1Interval,
  OpenF1Lap,
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
  RaceControlMessage,
  SessionLive,
  SessionState,
  SessionType,
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

const CIRCUIT_LAPS: Record<string, number> = {
  bahrain: 57,
  sakhir: 57,
  jeddah: 50,
  melbourne: 58,
  albert_park: 58,
  suzuka: 53,
  shanghai: 56,
  miami: 57,
  imola: 63,
  monaco: 78,
  monte_carlo: 78,
  montreal: 70,
  villeneuve: 70,
  barcelona: 66,
  catalunya: 66,
  spielberg: 71,
  red_bull_ring: 71,
  silverstone: 52,
  hungaroring: 70,
  spa: 44,
  francorchamps: 44,
  zandvoort: 72,
  monza: 53,
  baku: 51,
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

function getCircuitTotalLaps(session: OpenF1Session | null, maxLap: number): number {
  if (!session) return maxLap || 50;
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
  return maxLap || 50;
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
  if (c.includes('SOFT')) return 'SOFT';
  if (c.includes('MEDIUM')) return 'MEDIUM';
  if (c.includes('HARD')) return 'HARD';
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

export function buildLiveSnapshot(
  session: OpenF1Session | null,
  rawDrivers: OpenF1Driver[] = [],
  rawPositions: OpenF1Position[] = [],
  rawIntervals: OpenF1Interval[] = [],
  rawStints: OpenF1Stint[] = [],
  rawLaps: OpenF1Lap[] = [],
  rawRaceControl: OpenF1RaceControl[] = [],
  rawWeather: OpenF1Weather[] = [],
): LiveSnapshot {
  const safeDrivers = Array.isArray(rawDrivers) ? rawDrivers : [];
  const safePositions = Array.isArray(rawPositions) ? rawPositions : [];
  const safeIntervals = Array.isArray(rawIntervals) ? rawIntervals : [];
  const safeStints = Array.isArray(rawStints) ? rawStints : [];
  const safeLaps = Array.isArray(rawLaps) ? rawLaps : [];
  const safeRaceControl = Array.isArray(rawRaceControl) ? rawRaceControl : [];
  const safeWeather = Array.isArray(rawWeather) ? rawWeather : [];

  const sessionType = getSessionType(session?.session_name, session?.session_type);
  const qualifyingPhase = sessionType === 'Qualifying' ? getQualifyingPhase(safeRaceControl) : null;

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
  let fastestLapOverall = Number.POSITIVE_INFINITY;
  let fastestLapDriverNumber: number | null = null;
  let maxLapNumber = 0;

  for (const lap of safeLaps) {
    if (!lapsByDriver.has(lap.driver_number)) {
      lapsByDriver.set(lap.driver_number, []);
    }
    lapsByDriver.get(lap.driver_number)?.push(lap);

    if (lap.lap_number > maxLapNumber) {
      maxLapNumber = lap.lap_number;
    }

    if (lap.lap_duration && lap.lap_duration > 0) {
      const currentBest = bestLapByDriver.get(lap.driver_number) ?? Number.POSITIVE_INFINITY;
      if (lap.lap_duration < currentBest) {
        bestLapByDriver.set(lap.driver_number, lap.lap_duration);
      }

      if (lap.lap_duration < fastestLapOverall) {
        fastestLapOverall = lap.lap_duration;
        fastestLapDriverNumber = lap.driver_number;
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

    // DNF detection: In race, driver stopped recording laps >= 4 behind leader. In qualy, only if explicitly retired
    const isDnf =
      sessionType === 'Race' ? maxLapNumber >= 5 && maxLapNumber - driverMaxLap >= 4 : false;

    let retirementReason: string | undefined;
    if (isDnf) {
      const driverRc = safeRaceControl.find((m) => {
        const msg = m.message.toUpperCase();
        return (
          msg.includes(`CAR ${num}`) ||
          msg.includes(`CARS ${num}`) ||
          (driver.name_acronym && msg.includes(driver.name_acronym.toUpperCase()))
        );
      });

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
        retirementReason = 'Abandono';
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

    const bestLapDuration = bestLapByDriver.get(num) ?? null;
    const bestLapTime = formatLapTime(bestLapDuration);
    const penaltySeconds = penaltiesByDriver.get(num);

    // Delta vs starting grid in race: gridPos - pos (e.g. Started 18, now 12 -> +6)
    const posChange =
      sessionType === 'Race' && typeof gridPos === 'number' && !isDnf ? gridPos - pos : 0;

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
        s1: latestLap?.duration_sector_1 || null,
        s2: latestLap?.duration_sector_2 || null,
        s3: latestLap?.duration_sector_3 || null,
      },
      speedTrap: latestLap?.st_speed || null,
    };
  });

  // Polymorphic sorting and metrics assignment
  if (sessionType === 'Qualifying' || sessionType === 'Practice') {
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

  const messages: RaceControlMessage[] = safeRaceControl
    .slice(-20)
    .reverse()
    .map((m, idx) => ({
      id: idx + 1,
      time: m.date ? m.date.substring(11, 19) : '--:--:--',
      text: m.message,
      flag: m.flag,
    }));

  const totalCircuitLaps = sessionType === 'Race' ? getCircuitTotalLaps(session, maxLapNumber) : 0;
  const currentLap =
    sessionType === 'Race' ? Math.min(maxLapNumber, totalCircuitLaps) : maxLapNumber;
  const progressPercentage =
    sessionType === 'Race'
      ? totalCircuitLaps > 0
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

  const sessionLive: SessionLive = {
    sessionKey: session?.session_key ?? 0,
    sessionName: session?.session_name ?? 'Gran Premio',
    sessionType,
    qualifyingPhase,
    poleDriver,
    poleLapTime,
    location: session?.location ?? 'Circuito',
    country: session?.country_name ?? '',
    circuit: session?.circuit_short_name ?? '',
    status: sessionState,
    flag,
    currentLap,
    totalLaps: totalCircuitLaps,
    progressPercentage,
    timestamp: Math.floor(Date.now() / 1000),
  };

  const weather = parseTrackWeather(safeWeather);

  return {
    session: sessionLive,
    weather,
    messages,
    drivers,
    history: [
      {
        timestamp: sessionLive.timestamp,
        drivers,
      },
    ],
  };
}
