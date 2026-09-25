import { createServer } from 'node:http';
import { f1LiveCdnClient } from './f1LiveCdnClient.js';
import { JolpicaClient } from './jolpica.js';
import { JuniorSeriesClient } from './juniorSeries.js';
import { liveStreamClient } from './liveStreamClient.js';
import { buildLiveSnapshot } from './normalizer.js';
import { OpenF1Client } from './openf1.js';
import type { LiveSnapshot, SeriesCategory } from './types.js';
import { generateUniversalLiveSnapshot, resolveActiveSession } from './universalLiveEngine.js';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

const openF1 = new OpenF1Client();
const jolpica = new JolpicaClient();
const juniorSeries = new JuniorSeriesClient();

let cachedSnapshot: LiveSnapshot | null = null;
let isUpdating = false;

export async function updateSnapshot(): Promise<LiveSnapshot | null> {
  if (isUpdating) return cachedSnapshot;
  isUpdating = true;

  try {
    let newSnapshot: LiveSnapshot | null = null;

    // 1. Primary Live Source: Official F1 Live Timing CDN (livetiming.formula1.com/static/)
    // Free, zero auth required, authentic sectors, tyre stints, FIA race control and Team Radio MP3s
    try {
      const cdnSnapshot = await f1LiveCdnClient.getLiveRaceSnapshot();
      if (cdnSnapshot && cdnSnapshot.drivers.length > 0) {
        newSnapshot = cdnSnapshot;
      }
    } catch (err) {
      console.warn('[Worker] F1 CDN Live fetch error:', err);
    }

    // 2. Secondary Source: OpenF1 (only if explicit SESSION_KEY or OPENF1_TOKEN is provided)
    if (!newSnapshot && (process.env.SESSION_KEY || process.env.OPENF1_TOKEN)) {
      let targetSessionKey: number | null = process.env.SESSION_KEY
        ? Number(process.env.SESSION_KEY)
        : null;
      if (!targetSessionKey) {
        const activeOrRecent = await openF1.findActiveOrRecentSession(new Date());
        if (activeOrRecent) {
          targetSessionKey = activeOrRecent.session_key;
        }
      }

      if (targetSessionKey) {
        try {
          const data = await openF1.getLiveSessionData(targetSessionKey);
          if (
            data.session &&
            data.drivers.length > 0 &&
            (data.laps.length > 0 || data.positions.length > 0)
          ) {
            newSnapshot = buildLiveSnapshot(
              data.session,
              data.drivers,
              data.positions,
              data.intervals,
              data.stints,
              data.laps,
              data.raceControl,
              data.weather,
              data.locations,
              data.trackOutline,
              data.pits,
            );
          }
        } catch (err) {
          console.warn(`[Worker] Failed to fetch session ${targetSessionKey} from OpenF1:`, err);
        }
      }
    }

    // 3. Fallback A: Universal Live Engine + ESPN Scoreboard
    if (!newSnapshot) {
      try {
        const schedule = await jolpica.getSchedule();
        const activeSession = resolveActiveSession(schedule);
        const liveStream = await liveStreamClient.getLiveStream();

        if (activeSession) {
          newSnapshot = generateUniversalLiveSnapshot(activeSession, new Date(), liveStream);
        }
      } catch (err) {
        console.warn('[Worker] Universal engine fallback error:', err);
      }
    }

    // 4. Fallback B: If no active session detected, try OpenF1 default session
    if (!newSnapshot) {
      try {
        const defaultKey = 9590;
        const data = await openF1.getLiveSessionData(defaultKey);
        if (data.session && data.drivers.length > 0) {
          newSnapshot = buildLiveSnapshot(
            data.session,
            data.drivers,
            data.positions,
            data.intervals,
            data.stints,
            data.laps,
            data.raceControl,
            data.weather,
            data.locations,
            data.trackOutline,
            data.pits,
          );
        }
      } catch (err) {
        console.warn('[Worker] OpenF1 default fallback error:', err);
      }
    }

    if (newSnapshot) {
      // Maintain a 45-second sliding history in memory (up to 30 snapshots)
      const prevHistory = cachedSnapshot?.history || [];
      const updatedHistory = [
        {
          timestamp: newSnapshot.session.timestamp,
          drivers: [...newSnapshot.drivers],
          session: { ...newSnapshot.session },
          messages: [...newSnapshot.messages],
          weather: newSnapshot.weather ? { ...newSnapshot.weather } : null,
        },
        ...prevHistory,
      ].slice(0, 30);
      newSnapshot.history = updatedHistory;

      cachedSnapshot = newSnapshot;
      console.log(
        `[Worker] Snapshot updated: ${newSnapshot.session.sessionName} (${newSnapshot.session.circuit}), ${newSnapshot.drivers.length} drivers, Phase ${newSnapshot.session.qualifyingPhase || 'N/A'}, Status ${newSnapshot.session.status}`,
      );
    }

    return cachedSnapshot;
  } catch (error) {
    console.error('[Worker] Failed to update snapshot:', error);
    return cachedSnapshot;
  } finally {
    isUpdating = false;
  }
}

// In-memory IP Rate Limiter (sliding window 60s, max 120 reqs/min, bounded 5000 entries)
const MAX_RATE_LIMIT_ENTRIES = 5000;
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function extractClientIp(req: import('node:http').IncomingMessage): string {
  const rawXForwarded = req.headers['x-forwarded-for'];
  if (typeof rawXForwarded === 'string') {
    const firstIp = rawXForwarded.split(',')[0]?.trim();
    // Validate that it looks like a valid IP (IPv4 or IPv6) and avoid arbitrary header spoofing
    if (firstIp && /^[\d.a-fA-F:]+$/.test(firstIp) && firstIp.length <= 45) {
      return firstIp;
    }
  }
  return req.socket.remoteAddress || '127.0.0.1';
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    if (rateLimitMap.size >= MAX_RATE_LIMIT_ENTRIES) {
      // Evict oldest 500 entries if map is saturated
      const it = rateLimitMap.keys();
      for (let i = 0; i < 500; i++) {
        const key = it.next().value;
        if (key) rateLimitMap.delete(key);
        else break;
      }
    }
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 });
    return true;
  }
  if (record.count >= 120) {
    return false;
  }
  record.count++;
  return true;
}

// Clean up expired rate limit entries every 5 minutes
setInterval(
  () => {
    const now = Date.now();
    for (const [ip, record] of rateLimitMap.entries()) {
      if (now > record.resetTime) {
        rateLimitMap.delete(ip);
      }
    }
  },
  5 * 60 * 1000,
);

function resolveSeriesAndPath(url: URL): { series: SeriesCategory; cleanPath: string } {
  let cleanPath = url.pathname;
  let series: SeriesCategory = 'f1';

  if (url.pathname.startsWith('/api/f2/') || url.pathname === '/api/f2') {
    series = 'f2';
    cleanPath = url.pathname.replace(/^\/api\/f2/, '/api');
  } else if (url.pathname.startsWith('/api/f3/') || url.pathname === '/api/f3') {
    series = 'f3';
    cleanPath = url.pathname.replace(/^\/api\/f3/, '/api');
  } else {
    const q = url.searchParams.get('series')?.toLowerCase();
    if (q === 'f2' || q === 'f3') {
      series = q;
    }
  }

  return { series, cleanPath };
}

const server = createServer(async (req, res) => {
  const clientIp = extractClientIp(req);

  // Global Security & CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Rate Limiting (Healthcheck is exempted)
  if (req.url !== '/health' && !checkRateLimit(clientIp)) {
    res.writeHead(429, {
      'Content-Type': 'application/json',
      'Retry-After': '60',
    });
    res.end(JSON.stringify({ error: 'Too Many Requests. Rate limit exceeded.' }));
    return;
  }

  try {
    const url = new URL(req.url || '/', `http://${req.headers.host}`);
    const { series, cleanPath } = resolveSeriesAndPath(url);

    // Endpoint 1: Live Timing (High-frequency, instant in-memory response) - F1
    if (cleanPath === '/api/live.json' || cleanPath === '/api/live') {
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

    // Endpoint 1b: Dedicated Team Radios feed - F1
    if (cleanPath === '/api/live/radios.json' || cleanPath === '/api/live/radios') {
      if (!cachedSnapshot) {
        await updateSnapshot();
      }

      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=2, stale-while-revalidate=5',
      });
      res.end(
        JSON.stringify(
          {
            session: cachedSnapshot?.session?.sessionName || 'Live Session',
            circuit: cachedSnapshot?.session?.circuit || 'F1 Circuit',
            count: cachedSnapshot?.teamRadios?.length || 0,
            radios: cachedSnapshot?.teamRadios || [],
          },
          null,
          2,
        ),
      );
      return;
    }

    const yearParam = Number.parseInt(url.searchParams.get('year') || '2026', 10) || 2026;

    // Endpoint 2: Schedule & Race Calendar (Low-frequency, 1h Edge Cache) - Multi-series
    if (cleanPath === '/api/schedule.json' || cleanPath === '/api/schedule') {
      if (series === 'f2' || series === 'f3') {
        const races = await juniorSeries.getSchedule(series, yearParam);
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        });
        res.end(JSON.stringify({ races, total: races.length, series, year: yearParam }, null, 2));
        return;
      }

      const [races, lastRace] = await Promise.all([
        jolpica.getSchedule(),
        jolpica.getLastRacePodium(),
      ]);
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      });
      res.end(JSON.stringify({ races, total: races.length, lastRace, series: 'f1' }, null, 2));
      return;
    }

    // Endpoint 3: World Championship Standings (Low-frequency, 1h Edge Cache) - Multi-series
    if (cleanPath === '/api/standings.json' || cleanPath === '/api/standings') {
      if (series === 'f2' || series === 'f3') {
        const standings = await juniorSeries.getStandings(series, yearParam);
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        });
        res.end(JSON.stringify({ ...standings, series, year: yearParam }, null, 2));
        return;
      }

      const standings = await jolpica.getStandings(yearParam);
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      });
      res.end(JSON.stringify({ ...standings, series: 'f1', year: yearParam }, null, 2));
      return;
    }

    // Endpoint 4: Driver Changes Alerts (F2 / F3)
    if (cleanPath === '/api/driver-changes.json' || cleanPath === '/api/driver-changes') {
      const targetSeries = series === 'f1' ? 'f2' : series;
      const changes = juniorSeries.getDriverChanges(targetSeries, yearParam);
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      });
      res.end(JSON.stringify({ changes, series: targetSeries, year: yearParam }, null, 2));
      return;
    }

    // Endpoint 5: Qualifying Session Results (Low-frequency, 1h Edge Cache)
    if (cleanPath === '/api/qualifying.json' || cleanPath === '/api/qualifying') {
      const qualifying = await jolpica.getQualifying();
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      });
      res.end(JSON.stringify(qualifying || { error: 'No data available' }, null, 2));
      return;
    }

    // Endpoint 6: Race Results (Last GP or by ?round=X) (Low-frequency, 1h Edge Cache) - Multi-series
    if (
      cleanPath === '/api/race-results.json' ||
      cleanPath === '/api/race-results' ||
      cleanPath === '/api/last-race.json' ||
      cleanPath === '/api/last-race'
    ) {
      let roundParam = url.searchParams.get('round') || 'last';
      if (roundParam !== 'last') {
        const roundNum = Number.parseInt(roundParam, 10);
        if (Number.isNaN(roundNum) || roundNum < 1 || roundNum > 35) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Parámetro de ronda inválido (1-35 o "last")' }));
          return;
        }
        roundParam = String(roundNum);
      }

      if (series === 'f2' || series === 'f3') {
        const raceDetail = await juniorSeries.getRaceResults(series, roundParam, yearParam);
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        });
        res.end(JSON.stringify(raceDetail || { error: 'No data available' }, null, 2));
        return;
      }

      const raceDetail = await jolpica.getRaceResults(roundParam);
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      });
      res.end(JSON.stringify(raceDetail || { error: 'No data available' }, null, 2));
      return;
    }

    // Root / Status Endpoint
    if (cleanPath === '/' || cleanPath === '') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify(
          {
            name: 'Delta • F1, F2 & F3 Telemetry API',
            status: 'online',
            seriesSupported: ['f1', 'f2', 'f3'],
            endpoints: [
              '/health',
              '/api/live.json',
              '/api/schedule.json (supports ?series=f2|f3 or /api/f2/schedule.json)',
              '/api/standings.json (supports ?series=f2|f3 or /api/f2/standings.json)',
              '/api/race-results.json (supports ?series=f2|f3 or /api/f2/race-results.json)',
              '/api/driver-changes.json (supports ?series=f2|f3)',
              '/api/qualifying.json',
              '/api/last-race.json',
            ],
          },
          null,
          2,
        ),
      );
      return;
    }

    // Healthcheck Endpoint
    if (url.pathname === '/health' || url.pathname === '/api/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', timestamp: Date.now() }));
      return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  } catch (error) {
    console.error('[Server] Unhandled request error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
});

// Initial update and server start
const initialSnapshot = await updateSnapshot();

// Adaptive background loop: fast 2.5s interval during IN_PROGRESS or SUSPENDED sessions,
// relaxed 30s interval during FINISHED or idle periods between race weekends
const initialIsLive =
  initialSnapshot?.session?.status === 'IN_PROGRESS' ||
  initialSnapshot?.session?.status === 'SUSPENDED';
let nextPollDelayMs = initialIsLive ? 2500 : 30000;
async function adaptiveWorkerTick() {
  try {
    const snap = await updateSnapshot();
    const isLive = snap?.session?.status === 'IN_PROGRESS' || snap?.session?.status === 'SUSPENDED';
    nextPollDelayMs = isLive ? 2500 : 30000;
  } catch (err) {
    console.error('[Worker adaptive error]:', err);
    nextPollDelayMs = 15000;
  } finally {
    setTimeout(adaptiveWorkerTick, nextPollDelayMs);
  }
}
setTimeout(adaptiveWorkerTick, nextPollDelayMs);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[Delta API] Server running at http://localhost:${PORT}`);
  console.log('[Delta API] Endpoints available:');
  console.log(`- GET http://localhost:${PORT}/api/live.json`);
  console.log(`- GET http://localhost:${PORT}/api/live/radios.json`);
  console.log(`- GET http://localhost:${PORT}/api/schedule.json`);
  console.log(`- GET http://localhost:${PORT}/api/standings.json`);
  console.log(`- GET http://localhost:${PORT}/api/qualifying.json`);
  console.log(`- GET http://localhost:${PORT}/api/last-race.json`);
  console.log(`- GET http://localhost:${PORT}/api/race-results.json?round=X`);
});
