import { createServer } from 'node:http';
import { JolpicaClient } from './jolpica.js';
import { buildLiveSnapshot } from './normalizer.js';
import { OpenF1Client } from './openf1.js';
import type { LiveSnapshot } from './types.js';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
const SESSION_KEY = process.env.SESSION_KEY ? Number(process.env.SESSION_KEY) : 9590; // Default: Monza 2024

const openF1 = new OpenF1Client();
const jolpica = new JolpicaClient();

let cachedSnapshot: LiveSnapshot | null = null;
let isUpdating = false;

export async function updateSnapshot(): Promise<LiveSnapshot | null> {
  if (isUpdating) return cachedSnapshot;
  isUpdating = true;

  try {
    console.log(`[Worker] Updating snapshot for session ${SESSION_KEY}...`);

    const data = await openF1.getLiveSessionData(SESSION_KEY);

    const newSnapshot = buildLiveSnapshot(
      data.session,
      data.drivers,
      data.positions,
      data.intervals,
      data.stints,
      data.laps,
      data.raceControl,
      data.weather,
    );

    // Maintain a 45-second sliding history in memory (up to 30 snapshots)
    if (cachedSnapshot?.history) {
      const updatedHistory = [
        { timestamp: newSnapshot.session.timestamp, drivers: newSnapshot.drivers },
        ...cachedSnapshot.history,
      ].slice(0, 30);
      newSnapshot.history = updatedHistory;
    }

    cachedSnapshot = newSnapshot;
    console.log(
      `[Worker] Snapshot updated successfully: ${newSnapshot.drivers.length} drivers, Lap ${newSnapshot.session.currentLap}`,
    );
    return cachedSnapshot;
  } catch (error) {
    console.error('[Worker] Failed to update snapshot:', error);
    return cachedSnapshot;
  } finally {
    isUpdating = false;
  }
}

const server = createServer(async (req, res) => {
  // Global CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url || '/', `http://${req.headers.host}`);

  // Endpoint 1: Live Timing (High-frequency, 1s Edge Cache)
  if (url.pathname === '/api/live.json' || url.pathname === '/api/live') {
    if (!cachedSnapshot) {
      await updateSnapshot();
    }

    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=1, stale-while-revalidate=1',
    });
    res.end(JSON.stringify(cachedSnapshot || { error: 'No data available' }, null, 2));
    return;
  }

  // Endpoint 2: Schedule & Race Calendar (Low-frequency, 1h Edge Cache)
  if (url.pathname === '/api/schedule.json' || url.pathname === '/api/schedule') {
    const [races, lastRace] = await Promise.all([
      jolpica.getSchedule(),
      jolpica.getLastRacePodium(),
    ]);
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    });
    res.end(JSON.stringify({ races, total: races.length, lastRace }, null, 2));
    return;
  }

  // Endpoint 3: World Championship Standings (Low-frequency, 1h Edge Cache)
  if (url.pathname === '/api/standings.json' || url.pathname === '/api/standings') {
    const standings = await jolpica.getStandings();
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    });
    res.end(JSON.stringify(standings, null, 2));
    return;
  }

  // Healthcheck Endpoint
  if (url.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', timestamp: Date.now() }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

// Initial update and server start
await updateSnapshot();

server.listen(PORT, () => {
  console.log(`[Rebufo API] Server running at http://localhost:${PORT}`);
  console.log('[Rebufo API] Endpoints available:');
  console.log(`- GET http://localhost:${PORT}/api/live.json`);
  console.log(`- GET http://localhost:${PORT}/api/schedule.json`);
  console.log(`- GET http://localhost:${PORT}/api/standings.json`);
});
