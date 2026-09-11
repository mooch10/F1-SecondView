import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchLiveSnapshot } from '../services/api';
import type { DriverLive, LiveSnapshot } from '../types/f1';

export function useLiveTelemetry() {
  const [snapshot, setSnapshot] = useState<LiveSnapshot | null>(null);
  const [delaySeconds, setDelaySeconds] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<number>(() => Date.now());
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
        setLastUpdated(Date.now());
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

  // Compute active drivers considering delay slider
  const activeDrivers = useMemo<DriverLive[]>(() => {
    if (!snapshot) return [];
    if (delaySeconds === 0 || !snapshot.history || snapshot.history.length === 0) {
      return snapshot.drivers;
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

    return closest?.drivers || snapshot.drivers;
  }, [snapshot, delaySeconds]);

  return {
    snapshot,
    drivers: activeDrivers,
    delaySeconds,
    setDelaySeconds,
    nudgeDelay,
    isLoading,
    isLiveConnected,
    lastUpdated,
  };
}
