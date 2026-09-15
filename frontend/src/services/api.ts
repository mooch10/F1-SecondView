import type {
  DriverChangeAlert,
  JolpicaQualifyingSession,
  JolpicaRace,
  JolpicaRaceDetail,
  LiveSnapshot,
  ScheduleResponse,
  SeriesCategory,
  StandingsData,
} from '../types/f1';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:3001' : 'https://f1-secondview.onrender.com');

export async function fetchLiveSnapshot(): Promise<LiveSnapshot | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/live.json?t=${Date.now()}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return (await res.json()) as LiveSnapshot;
  } catch (err) {
    console.warn('[API] Failed to fetch live telemetry snapshot:', err);
    return null;
  }
}

export async function fetchSchedule(series: SeriesCategory = 'f1'): Promise<JolpicaRace[]> {
  try {
    const query = series !== 'f1' ? `?series=${series}` : '';
    const res = await fetch(`${API_BASE_URL}/api/schedule.json${query}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = (await res.json()) as ScheduleResponse;
    return data.races || [];
  } catch (err) {
    console.warn(`[API] Failed to fetch schedule for ${series}:`, err);
    return [];
  }
}

export async function fetchScheduleDetails(series: SeriesCategory = 'f1'): Promise<ScheduleResponse | null> {
  try {
    const query = series !== 'f1' ? `?series=${series}` : '';
    const res = await fetch(`${API_BASE_URL}/api/schedule.json${query}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return (await res.json()) as ScheduleResponse;
  } catch (err) {
    console.warn(`[API] Failed to fetch schedule details for ${series}:`, err);
    return null;
  }
}

export async function fetchStandings(
  series: SeriesCategory = 'f1',
  year?: number,
): Promise<StandingsData | null> {
  try {
    const params = new URLSearchParams();
    if (series !== 'f1') params.append('series', series);
    if (year && year !== 2026) params.append('year', String(year));
    const query = params.toString() ? `?${params.toString()}` : '';

    const res = await fetch(`${API_BASE_URL}/api/standings.json${query}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return (await res.json()) as StandingsData;
  } catch (err) {
    console.warn(`[API] Failed to fetch standings for ${series}:`, err);
    return null;
  }
}

export async function fetchQualifying(): Promise<JolpicaQualifyingSession | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/qualifying.json`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return (await res.json()) as JolpicaQualifyingSession;
  } catch (err) {
    console.warn('[API] Failed to fetch qualifying results:', err);
    return null;
  }
}

export async function fetchLastRaceDetail(series: SeriesCategory = 'f1'): Promise<JolpicaRaceDetail | null> {
  try {
    const query = series !== 'f1' ? `?series=${series}` : '';
    const res = await fetch(`${API_BASE_URL}/api/last-race.json${query}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return (await res.json()) as JolpicaRaceDetail;
  } catch (err) {
    console.warn(`[API] Failed to fetch last race details for ${series}:`, err);
    return null;
  }
}

export async function fetchRaceResultsByRound(
  round: number,
  series: SeriesCategory = 'f1'
): Promise<JolpicaRaceDetail | null> {
  try {
    const query = series !== 'f1' ? `&series=${series}` : '';
    const res = await fetch(`${API_BASE_URL}/api/race-results.json?round=${round}${query}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return (await res.json()) as JolpicaRaceDetail;
  } catch (err) {
    console.warn(`[API] Failed to fetch race results for round ${round} in ${series}:`, err);
    return null;
  }
}

export async function fetchDriverChanges(series: SeriesCategory = 'f2'): Promise<DriverChangeAlert[]> {
  try {
    const target = series === 'f1' ? 'f2' : series;
    const res = await fetch(`${API_BASE_URL}/api/driver-changes.json?series=${target}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    return data.changes || [];
  } catch (err) {
    console.warn(`[API] Failed to fetch driver changes for ${series}:`, err);
    return [];
  }
}
