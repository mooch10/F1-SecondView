import type {
  JolpicaQualifyingSession,
  JolpicaRace,
  JolpicaRaceDetail,
  LiveSnapshot,
  ScheduleResponse,
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

export async function fetchSchedule(): Promise<JolpicaRace[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/schedule.json`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = (await res.json()) as ScheduleResponse;
    return data.races || [];
  } catch (err) {
    console.warn('[API] Failed to fetch schedule:', err);
    return [];
  }
}

export async function fetchScheduleDetails(): Promise<ScheduleResponse | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/schedule.json`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return (await res.json()) as ScheduleResponse;
  } catch (err) {
    console.warn('[API] Failed to fetch schedule details:', err);
    return null;
  }
}

export async function fetchStandings(): Promise<StandingsData | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/standings.json`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return (await res.json()) as StandingsData;
  } catch (err) {
    console.warn('[API] Failed to fetch standings:', err);
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

export async function fetchLastRaceDetail(): Promise<JolpicaRaceDetail | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/last-race.json`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return (await res.json()) as JolpicaRaceDetail;
  } catch (err) {
    console.warn('[API] Failed to fetch last race details:', err);
    return null;
  }
}

export async function fetchRaceResultsByRound(round: number): Promise<JolpicaRaceDetail | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/race-results.json?round=${round}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return (await res.json()) as JolpicaRaceDetail;
  } catch (err) {
    console.warn(`[API] Failed to fetch race results for round ${round}:`, err);
    return null;
  }
}
