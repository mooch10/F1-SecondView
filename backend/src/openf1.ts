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
  driver_number: number;
  lap_number: number;
  lap_duration: number | null;
  duration_sector_1: number | null;
  duration_sector_2: number | null;
  duration_sector_3: number | null;
  st_speed: number | null;
  is_pit_out_lap: boolean;
}

export interface OpenF1RaceControl {
  date: string;
  category: string;
  flag: string | null;
  message: string;
  scope: string | null;
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

  async getSession(sessionKey: number): Promise<OpenF1Session | null> {
    if (this.sessionCache.has(sessionKey)) {
      return this.sessionCache.get(sessionKey) || null;
    }
    const list = await this.fetchJson<OpenF1Session>(`/sessions?session_key=${sessionKey}`);
    const session = list[0] || null;
    if (session) this.sessionCache.set(sessionKey, session);
    return session;
  }

  async getLatestRaceSession(year = 2024): Promise<OpenF1Session | null> {
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

  /**
   * Helper that executes requests sequentially or in small batches with spacing
   * to respect OpenF1's free tier rate limits (3 req/sec).
   */
  async getLiveSessionData(sessionKey: number) {
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

    return { session, drivers, positions, intervals, stints, laps, raceControl, weather };
  }
}
