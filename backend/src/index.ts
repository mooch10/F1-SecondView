import { createServer } from 'node:http';
import { buildLiveSnapshot } from './normalizer.js';
import { OpenF1Client } from './openf1.js';
import type { LiveSnapshot } from './types.js';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
const SESSION_KEY = process.env.SESSION_KEY ? Number(process.env.SESSION_KEY) : 9590; // Default: Monza 2024

const client = new OpenF1Client();
let cachedSnapshot: LiveSnapshot | null = null;
let isUpdating = false;

export async function updateSnapshot(): Promise<LiveSnapshot | null> {
  if (isUpdating) return cachedSnapshot;
  isUpdating = true;

  try {
    console.log(`[Worker] Updating snapshot for session ${SESSION_KEY}...`);

    const data = await client.getLiveSessionData(SESSION_KEY);

    const newSnapshot = buildLiveSnapshot(
      data.session,
      data.drivers,
      data.positions,
      data.intervals,
      data.stints,
      data.laps,
      data.raceControl,
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
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url || '/', `http://${req.headers.host}`);

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
  console.log(`[Rebufo API] Live endpoint: http://localhost:${PORT}/api/live.json`);
});
