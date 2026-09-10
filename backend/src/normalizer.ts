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
  TrackWeather,
  TyreCompound,
} from './types.js';

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
  rawDrivers: OpenF1Driver[],
  rawPositions: OpenF1Position[],
  rawIntervals: OpenF1Interval[],
  rawStints: OpenF1Stint[],
  rawLaps: OpenF1Lap[],
  rawRaceControl: OpenF1RaceControl[],
  rawWeather: OpenF1Weather[] = [],
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

  // 3. Stints grouping & max stint number per driver (to calculate pit stops & tyres)
  const latestStintByDriver = new Map<number, OpenF1Stint>();
  const maxStintByDriver = new Map<number, number>();

  for (const s of rawStints) {
    const prevMax = maxStintByDriver.get(s.driver_number) || 0;
    if (s.stint_number && s.stint_number > prevMax) {
      maxStintByDriver.set(s.driver_number, s.stint_number);
    }
    const existing = latestStintByDriver.get(s.driver_number);
    if (!existing || (s.stint_number && s.stint_number > (existing.stint_number || 0))) {
      latestStintByDriver.set(s.driver_number, s);
    }
  }

  // 4. Group all laps by driver & determine overall fastest lap
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

  // 5. Build DriverLive array with DNF detection and pit stop counts
  const drivers: DriverLive[] = rawDrivers.map((driver) => {
    const num = driver.driver_number;
    const pos = latestPositionByDriver.get(num) ?? 99;
    const intervalData = latestIntervalByDriver.get(num);
    const stint = latestStintByDriver.get(num);
    const driverLaps = lapsByDriver.get(num) || [];
    const latestLap = driverLaps[driverLaps.length - 1];

    const driverMaxLap =
      driverLaps.length > 0 ? Math.max(...driverLaps.map((l) => l.lap_number)) : 0;

    // A driver who stopped recording laps >= 4 laps behind the leader is retired (DNF)
    const isDnf = maxLapNumber >= 5 && maxLapNumber - driverMaxLap >= 4;

    let retirementReason: string | undefined;
    if (isDnf) {
      const driverRc = rawRaceControl.find((m) => {
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
      !isDnf && !isLeader && intervalNum !== null && intervalNum > 0 && intervalNum <= 1.0;

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

    return {
      pos: isDnf ? 99 : pos,
      posChange: 0,
      driverNumber: num,
      code: driver.name_acronym || 'DRV',
      fullName: driver.full_name || driver.broadcast_name || 'Unknown',
      teamName: driver.team_name || 'Independent',
      teamColor: teamColorHex,
      gap,
      interval: intervalStr,
      isDrsZone,
      lastLapTime: isDnf ? 'OUT' : formatLapTime(latestLap?.lap_duration),
      isFastestLap: !isDnf && fastestLapDriverNumber === num,
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

  // Sort drivers: Active drivers by position, DNF drivers at the end
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

  const totalCircuitLaps = getCircuitTotalLaps(session, maxLapNumber);
  const currentLap = Math.min(maxLapNumber, totalCircuitLaps);
  const progressPercentage =
    totalCircuitLaps > 0 ? Math.min(100, Math.round((currentLap / totalCircuitLaps) * 100)) : 0;

  const sessionLive: SessionLive = {
    sessionKey: session?.session_key ?? 0,
    sessionName: session?.session_name ?? 'Gran Premio',
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

  const weather = parseTrackWeather(rawWeather);

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
