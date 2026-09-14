import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchLiveSnapshot } from '../services/api';
import type { DriverLive, LiveSnapshot } from '../types/f1';

export function useLiveTelemetry() {
  const [snapshot, setSnapshot] = useState<LiveSnapshot | null>(null);
  const [delaySeconds, setDelaySeconds] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(true);

  // Polling loop
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      const data = await fetchLiveSnapshot();
      if (!isMounted) return;

      if (data) {
        setSnapshot(data);
        setIsLiveConnected(true);
      } else {
        setIsLiveConnected(false);
      }
      setIsLoading(false);
    };

    loadData();

    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        loadData();
      }
    }, 1500);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isMounted = false;
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Nudge helper (+2s, -2s)
  const nudgeDelay = useCallback((delta: number) => {
    setDelaySeconds((prev) => Math.max(0, Math.min(45, prev + delta)));
  }, []);

  // Compute fully synchronized snapshot and active drivers considering delay slider
  const delayedData = useMemo(() => {
    if (!snapshot) {
      return {
        snapshot: null,
        drivers: [] as DriverLive[],
      };
    }

    // Helper to deduplicate drivers strictly by driverNumber
    const dedupeDrivers = (list: DriverLive[]): DriverLive[] => {
      const seen = new Set<number>();
      return (list || []).filter((d) => {
        if (!d || seen.has(d.driverNumber)) return false;
        seen.add(d.driverNumber);
        return true;
      });
    };

    if (delaySeconds === 0 || !snapshot.history || snapshot.history.length === 0) {
      const cleanDrivers = dedupeDrivers(snapshot.drivers);
      return {
        snapshot: {
          ...snapshot,
          drivers: cleanDrivers,
        },
        drivers: cleanDrivers,
      };
    }

    const currentTimestamp = snapshot.session.timestamp;
    const targetTimestamp = currentTimestamp - delaySeconds;

    // Find the closest snapshot in history
    let closest = snapshot.history[0];
    let minDiff = Math.abs(closest.timestamp - targetTimestamp);

    for (const item of snapshot.history) {
      const diff = Math.abs(item.timestamp - targetTimestamp);
      if (diff < minDiff) {
        minDiff = diff;
        closest = item;
      }
    }

    const effectiveDrivers = dedupeDrivers(closest?.drivers || snapshot.drivers);
    const effectiveSession = closest?.session || snapshot.session;
    const effectiveWeather = closest?.weather ?? snapshot.weather;
    const effectiveMessages = closest?.messages ?? snapshot.messages;

    const synchedSnapshot: LiveSnapshot = {
      ...snapshot,
      session: effectiveSession,
      weather: effectiveWeather,
      messages: effectiveMessages,
      drivers: effectiveDrivers,
    };

    return {
      snapshot: synchedSnapshot,
      drivers: effectiveDrivers,
    };
  }, [snapshot, delaySeconds]);

  return {
    snapshot: delayedData.snapshot,
    drivers: delayedData.drivers,
    delaySeconds,
    setDelaySeconds,
    nudgeDelay,
    isLoading,
    isLiveConnected,
  };
}
