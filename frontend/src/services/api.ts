import type { JolpicaRace, LiveSnapshot, StandingsData } from '../types/f1';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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
    console.warn('[API] Failed to fetch live snapshot:', err);
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
    const data = await res.json();
    return data.races || [];
  } catch (err) {
    console.warn('[API] Failed to fetch schedule:', err);
    return [];
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
