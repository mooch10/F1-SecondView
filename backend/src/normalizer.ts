import type {
  OpenF1Driver,
  OpenF1Interval,
  OpenF1Lap,
  OpenF1Position,
  OpenF1RaceControl,
  OpenF1Session,
  OpenF1Stint,
} from './openf1.js';
import type {
  DriverLive,
  FlagStatus,
  LiveSnapshot,
  RaceControlMessage,
  SessionLive,
  SessionState,
  TyreCompound,
} from './types.js';

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

export function buildLiveSnapshot(
  session: OpenF1Session | null,
  rawDrivers: OpenF1Driver[],
  rawPositions: OpenF1Position[],
  rawIntervals: OpenF1Interval[],
  rawStints: OpenF1Stint[],
  rawLaps: OpenF1Lap[],
  rawRaceControl: OpenF1RaceControl[],
): LiveSnapshot {
  // 1. Get latest position per driver
  const latestPositionByDriver = new Map<number, number>();
  for (const p of rawPositions) {
    latestPositionByDriver.set(p.driver_number, p.position);
  }

  // 2. Get latest interval per driver
  const latestIntervalByDriver = new Map<number, OpenF1Interval>();
  for (const item of rawIntervals) {
    latestIntervalByDriver.set(item.driver_number, item);
  }

  // 3. Get latest stint per driver
  const latestStintByDriver = new Map<number, OpenF1Stint>();
  for (const s of rawStints) {
    const existing = latestStintByDriver.get(s.driver_number);
    if (!existing || (s.stint_number && s.stint_number > (existing.stint_number || 0))) {
      latestStintByDriver.set(s.driver_number, s);
    }
  }

  // 4. Get all laps grouped by driver & determine overall fastest lap
  const lapsByDriver = new Map<number, OpenF1Lap[]>();
  let fastestLapOverall = Number.POSITIVE_INFINITY;
  let fastestLapDriverNumber: number | null = null;
  let maxLapNumber = 0;

  for (const lap of rawLaps) {
    if (!lapsByDriver.has(lap.driver_number)) {
      lapsByDriver.set(lap.driver_number, []);
    }
    lapsByDriver.get(lap.driver_number)?.push(lap);

    if (lap.lap_number > maxLapNumber) {
      maxLapNumber = lap.lap_number;
    }

    if (lap.lap_duration && lap.lap_duration > 0 && lap.lap_duration < fastestLapOverall) {
      fastestLapOverall = lap.lap_duration;
      fastestLapDriverNumber = lap.driver_number;
    }
  }

  // 5. Build DriverLive array
  const drivers: DriverLive[] = rawDrivers.map((driver) => {
    const num = driver.driver_number;
    const pos = latestPositionByDriver.get(num) ?? 99;
    const intervalData = latestIntervalByDriver.get(num);
    const stint = latestStintByDriver.get(num);
    const driverLaps = lapsByDriver.get(num) || [];
    const latestLap = driverLaps[driverLaps.length - 1];

    const isLeader = pos === 1;
    const gap = formatGap(intervalData?.gap_to_leader, isLeader);
    const intervalStr = isLeader
      ? 'LEADER'
      : typeof intervalData?.interval === 'number'
        ? `+${intervalData.interval.toFixed(3)}`
        : '- - -';

    const intervalNum = intervalData?.interval ?? null;
    const isDrsZone = !isLeader && intervalNum !== null && intervalNum > 0 && intervalNum <= 1.0;

    // Tyre calculations
    let tyreInfo = null;
    if (stint) {
      const stintLaps = stint.lap_end
        ? stint.lap_end - stint.lap_start + 1
        : Math.max(0, maxLapNumber - stint.lap_start + 1);
      tyreInfo = {
        compound: parseCompound(stint.compound),
        laps: (stint.tyre_age_at_start || 0) + stintLaps,
      };
    }

    const teamColorHex = driver.team_colour
      ? driver.team_colour.startsWith('#')
        ? driver.team_colour
        : `#${driver.team_colour}`
      : '#71717A';

    return {
      pos,
      posChange: 0,
      driverNumber: num,
      code: driver.name_acronym || 'DRV',
      fullName: driver.full_name || driver.broadcast_name || 'Unknown',
      teamName: driver.team_name || 'Independent',
      teamColor: teamColorHex,
      gap,
      interval: intervalStr,
      isDrsZone,
      lastLapTime: formatLapTime(latestLap?.lap_duration),
      isFastestLap: fastestLapDriverNumber === num,
      tyre: tyreInfo,
      inPit: latestLap?.is_pit_out_lap || false,
      status: 'ACTIVE',
      sectors: {
        s1: latestLap?.duration_sector_1 || null,
        s2: latestLap?.duration_sector_2 || null,
        s3: latestLap?.duration_sector_3 || null,
      },
      speedTrap: latestLap?.st_speed || null,
    };
  });

  // Sort drivers by position
  drivers.sort((a, b) => a.pos - b.pos);

  // 6. Build Session Status & Flags
  let flag: FlagStatus = 'GREEN';
  let sessionState: SessionState = 'IN_PROGRESS';

  const messages: RaceControlMessage[] = rawRaceControl
    .slice(-20)
    .reverse()
    .map((m, idx) => {
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

      return {
        id: idx + 1,
        time: m.date ? m.date.substring(11, 19) : '--:--:--',
        text: m.message,
        flag: m.flag,
      };
    });

  const sessionLive: SessionLive = {
    sessionKey: session?.session_key ?? 0,
    sessionName: session?.session_name ?? 'Gran Premio',
    location: session?.location ?? 'Circuito',
    country: session?.country_name ?? '',
    circuit: session?.circuit_short_name ?? '',
    status: sessionState,
    flag,
    currentLap: maxLapNumber,
    totalLaps: maxLapNumber,
    timestamp: Math.floor(Date.now() / 1000),
  };

  return {
    session: sessionLive,
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
