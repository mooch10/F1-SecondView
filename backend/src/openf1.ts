export interface OpenF1Session {
  session_key: number;
  session_name: string;
  session_type: string;
  date_start: string;
  date_end: string;
  circuit_short_name: string;
  country_name: string;
  location: string;
  year: number;
}

export interface OpenF1Driver {
  session_key: number;
  driver_number: number;
  broadcast_name?: string;
  name_acronym: string;
  full_name: string;
  team_name: string;
  team_colour: string;
  country_code: string;
}

export interface OpenF1Position {
  date: string;
  driver_number: number;
  position: number;
}

export interface OpenF1Interval {
  date: string;
  driver_number: number;
  gap_to_leader: number | null;
  interval: number | null;
}

export interface OpenF1Stint {
  driver_number: number;
  stint_number: number;
  compound: string;
  lap_start: number;
  lap_end: number | null;
  tyre_age_at_start: number;
}

export interface OpenF1Lap {
  date_start?: string;
  driver_number: number;
  lap_number: number;
  lap_duration: number | null;
  duration_sector_1: number | null;
  duration_sector_2: number | null;
  duration_sector_3: number | null;
  segments_sector_1?: (number | null)[];
  segments_sector_2?: (number | null)[];
  segments_sector_3?: (number | null)[];
  i1_speed?: number | null;
  i2_speed?: number | null;
  st_speed: number | null;
  is_pit_out_lap: boolean;
}

export interface OpenF1Location {
  date: string;
  session_key: number;
  driver_number: number;
  x: number;
  y: number;
  z: number;
}

export interface OpenF1RaceControl {
  date: string;
  category: string;
  flag: string | null;
  message: string;
  scope: string | null;
  qualifying_phase?: number | null;
}

export interface OpenF1Weather {
  date: string;
  session_key: number;
  rainfall: number;
  humidity: number;
  air_temperature: number;
  track_temperature: number;
  wind_speed: number;
  wind_direction: number;
  pressure?: number;
}

export class OpenF1Client {
  private baseUrl = 'https://api.openf1.org/v1';
  private timeoutMs = 8000;
  private driversCache = new Map<number, OpenF1Driver[]>();
  private sessionCache = new Map<number, OpenF1Session>();
  private trackOutlineCache = new Map<
    number,
    {
      circuitName: string;
      outline: [number, number][];
      bounds: { minX: number; maxX: number; minY: number; maxY: number };
    }
  >();

  private yearSessionsCache: { year: number; timestamp: number; data: OpenF1Session[] } | null = null;
  private liveDataCache = new Map<number, { timestamp: number; data: any }>();

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async fetchJson<T>(endpoint: string, retries = 3): Promise<T[]> {
    const url = `${this.baseUrl}${endpoint}`;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, {
          signal: AbortSignal.timeout(this.timeoutMs),
        });

        if (response.status === 429) {
          const waitMs = attempt * 1200;
          console.warn(
            `[OpenF1] 429 Rate limited on ${endpoint}. Waiting ${waitMs}ms (attempt ${attempt}/${retries})...`,
          );
          await this.delay(waitMs);
          continue;
        }

        if (!response.ok) {
          if (response.status !== 404) {
            console.warn(`[OpenF1] Warning: ${endpoint} returned status ${response.status}`);
          }
          return [];
        }

        const data = await response.json();
        return Array.isArray(data) ? (data as T[]) : [];
      } catch (error) {
        if (attempt === retries) {
          console.error(`[OpenF1] Failed to fetch ${endpoint} after ${retries} attempts:`, error);
          return [];
        }
        await this.delay(500 * attempt);
      }
    }

    return [];
  }

  async getSessionsForYear(year = 2026): Promise<OpenF1Session[]> {
    if (
      this.yearSessionsCache &&
      this.yearSessionsCache.year === year &&
      Date.now() - this.yearSessionsCache.timestamp < 300000
    ) {
      return this.yearSessionsCache.data;
    }
    const sessions = await this.fetchJson<OpenF1Session>(`/sessions?year=${year}`);
    if (sessions.length > 0) {
      this.yearSessionsCache = { year, timestamp: Date.now(), data: sessions };
    }
    return sessions;
  }

  /**
   * Automatically discovers the active session in progress or the most recently finished
   * session from OpenF1 based on current date/time.
   */
  async findActiveOrRecentSession(now = new Date()): Promise<OpenF1Session | null> {
    const year = now.getUTCFullYear();
    const sessions = await this.getSessionsForYear(year);
    if (!sessions || sessions.length === 0) return null;

    const nowMs = now.getTime();

    // 1. First priority: Is any session LIVE IN PROGRESS right now?
    for (const s of sessions) {
      if (!s.date_start || !s.date_end) continue;
      const startMs = new Date(s.date_start).getTime();
      const endMs = new Date(s.date_end).getTime();

      if (nowMs >= startMs - 15 * 60 * 1000 && nowMs <= endMs + 30 * 60 * 1000) {
        return s;
      }
    }

    // 2. Second priority: Did a session finish in the last 12 hours? (Most recent)
    let latestFinished: OpenF1Session | null = null;
    let maxEndMs = 0;
    for (const s of sessions) {
      if (!s.date_end) continue;
      const endMs = new Date(s.date_end).getTime();
      if (nowMs > endMs && nowMs <= endMs + 12 * 3600 * 1000 && endMs > maxEndMs) {
        maxEndMs = endMs;
        latestFinished = s;
      }
    }
    if (latestFinished) return latestFinished;

    // 3. Fallback for race weekend: pick the latest session for current race weekend that already started
    for (let i = sessions.length - 1; i >= 0; i--) {
      const s = sessions[i];
      if (!s.date_start) continue;
      const startMs = new Date(s.date_start).getTime();
      if (startMs <= nowMs && Math.abs(nowMs - startMs) <= 36 * 3600 * 1000) {
        return s;
      }
    }

    return null;
  }

  async getSession(sessionKey: number): Promise<OpenF1Session | null> {
    if (this.sessionCache.has(sessionKey)) {
      return this.sessionCache.get(sessionKey) || null;
    }
    const list = await this.fetchJson<OpenF1Session>(`/sessions?session_key=${sessionKey}`);
    const session = list[0] || null;
    if (session) this.sessionCache.set(sessionKey, session);
    return session;
  }

  async getLatestRaceSession(year = 2026): Promise<OpenF1Session | null> {
    const list = await this.fetchJson<OpenF1Session>(`/sessions?year=${year}&session_name=Race`);
    return list[list.length - 1] || null;
  }

  async getDrivers(sessionKey: number): Promise<OpenF1Driver[]> {
    if (this.driversCache.has(sessionKey)) {
      return this.driversCache.get(sessionKey) || [];
    }
    const drivers = await this.fetchJson<OpenF1Driver>(`/drivers?session_key=${sessionKey}`);
    if (drivers.length > 0) {
      this.driversCache.set(sessionKey, drivers);
    }
    return drivers;
  }

  async getPositions(sessionKey: number): Promise<OpenF1Position[]> {
    return this.fetchJson<OpenF1Position>(`/position?session_key=${sessionKey}`);
  }

  async getIntervals(sessionKey: number): Promise<OpenF1Interval[]> {
    return this.fetchJson<OpenF1Interval>(`/intervals?session_key=${sessionKey}`);
  }

  async getStints(sessionKey: number): Promise<OpenF1Stint[]> {
    return this.fetchJson<OpenF1Stint>(`/stints?session_key=${sessionKey}`);
  }

  async getLaps(sessionKey: number): Promise<OpenF1Lap[]> {
    return this.fetchJson<OpenF1Lap>(`/laps?session_key=${sessionKey}`);
  }

  async getRaceControl(sessionKey: number): Promise<OpenF1RaceControl[]> {
    return this.fetchJson<OpenF1RaceControl>(`/race_control?session_key=${sessionKey}`);
  }

  async getWeather(sessionKey: number): Promise<OpenF1Weather[]> {
    return this.fetchJson<OpenF1Weather>(`/weather?session_key=${sessionKey}`);
  }

  async getCarLocations(sessionKey: number, dateStart?: string): Promise<OpenF1Location[]> {
    const query = dateStart
      ? `/location?session_key=${sessionKey}&date>=${encodeURIComponent(dateStart)}`
      : `/location?session_key=${sessionKey}`;
    return this.fetchJson<OpenF1Location>(query);
  }

  async getTrackOutline(
    sessionKey: number,
    circuitName: string,
    laps: OpenF1Lap[],
  ): Promise<{
    circuitName: string;
    outline: [number, number][];
    bounds: { minX: number; maxX: number; minY: number; maxY: number };
  } | null> {
    if (this.trackOutlineCache.has(sessionKey)) {
      return this.trackOutlineCache.get(sessionKey) || null;
    }

    const validLap = laps.find(
      (l) =>
        !l.is_pit_out_lap &&
        typeof l.lap_duration === 'number' &&
        l.lap_duration > 60 &&
        l.lap_duration < 130 &&
        Boolean(l.date_start),
    );

    if (!validLap || !validLap.date_start) return null;

    try {
      const startTime = new Date(validLap.date_start);
      const lapDur = typeof validLap.lap_duration === 'number' ? validLap.lap_duration : 90;
      const endTime = new Date(startTime.getTime() + (lapDur + 3) * 1000);

      const locs = await this.fetchJson<OpenF1Location>(
        `/location?session_key=${sessionKey}&driver_number=${validLap.driver_number}&date>=${encodeURIComponent(
          startTime.toISOString(),
        )}&date<=${encodeURIComponent(endTime.toISOString())}`,
      );

      const validPoints = locs.filter((p) => p.x !== 0 || p.y !== 0);
      if (validPoints.length < 30) return null;

      const step = Math.max(1, Math.ceil(validPoints.length / 180));
      const outline: [number, number][] = validPoints
        .filter((_, idx) => idx % step === 0)
        .map((p) => [p.x, p.y]);

      const minX = Math.min(...outline.map((p) => p[0]));
      const maxX = Math.max(...outline.map((p) => p[0]));
      const minY = Math.min(...outline.map((p) => p[1]));
      const maxY = Math.max(...outline.map((p) => p[1]));

      const result = {
        circuitName,
        outline,
        bounds: { minX, maxX, minY, maxY },
      };

      this.trackOutlineCache.set(sessionKey, result);
      return result;
    } catch (err) {
      console.warn('[OpenF1] Failed to generate track outline:', err);
      return null;
    }
  }

  /**
   * Helper that executes requests sequentially or in small batches with spacing
   * to respect OpenF1's free tier rate limits (3 req/sec).
   */
  async getLiveSessionData(sessionKey: number) {
    const cached = this.liveDataCache.get(sessionKey);
    if (cached && Date.now() - cached.timestamp < 3500) {
      return cached.data;
    }

    const session = await this.getSession(sessionKey);
    await this.delay(350);

    const drivers = await this.getDrivers(sessionKey);
    await this.delay(350);

    const positions = await this.getPositions(sessionKey);
    await this.delay(350);

    const intervals = await this.getIntervals(sessionKey);
    await this.delay(350);

    const stints = await this.getStints(sessionKey);
    await this.delay(350);

    const laps = await this.getLaps(sessionKey);
    await this.delay(350);

    const raceControl = await this.getRaceControl(sessionKey);
    await this.delay(350);

    const weather = await this.getWeather(sessionKey);

    // Determine current session timestamp from latest position/interval/lap
    let latestDate: string | undefined;
    if (positions.length > 0) {
      latestDate = positions[positions.length - 1].date;
    } else if (intervals.length > 0) {
      latestDate = intervals[intervals.length - 1].date;
    } else if (laps.length > 0 && laps[laps.length - 1].date_start) {
      latestDate = laps[laps.length - 1].date_start;
    }

    let locations: OpenF1Location[] = [];
    if (latestDate) {
      const dateStart = new Date(new Date(latestDate).getTime() - 25000).toISOString();
      await this.delay(350);
      locations = await this.getCarLocations(sessionKey, dateStart);
    }

    let trackOutline = this.trackOutlineCache.get(sessionKey) || null;
    if (!trackOutline && laps.length > 0) {
      await this.delay(350);
      trackOutline = await this.getTrackOutline(
        sessionKey,
        session?.circuit_short_name || 'Circuito',
        laps,
      );
    }

    const result = {
      session,
      drivers,
      positions,
      intervals,
      stints,
      laps,
      raceControl,
      weather,
      locations,
      trackOutline,
    };

    this.liveDataCache.set(sessionKey, { timestamp: Date.now(), data: result });
    return result;
  }
}
