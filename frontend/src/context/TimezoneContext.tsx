import { createContext, useState, useEffect, useMemo, useContext, type ReactNode } from 'react';
import {
  getCircuitTimezone,
  getCurrentClock,
  formatSessionTimeToZone,
  formatSessionDateToZone,
} from '../utils/circuitTimezones';

export type TimezoneMode = 'my' | 'track';

export interface TimezoneContextType {
  mode: TimezoneMode;
  setMode: (mode: TimezoneMode) => void;
  toggleMode: () => void;
  trackTimezone: string;
  setTrackCircuit: (circuit?: string, locality?: string, country?: string) => void;
  myClock: string;
  trackClock: string;
  formatSessionTime: (isoStr: string, overrideTimezone?: string) => string | null;
  formatSessionDate: (isoStr: string, lang?: 'es' | 'en', overrideTimezone?: string) => string;
}

export const TimezoneContext = createContext<TimezoneContextType | undefined>(undefined);

const STORAGE_KEY = 'delta_timezone_mode';

export function TimezoneProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<TimezoneMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'my' || saved === 'track') {
        return saved;
      }
    } catch {
      // Ignore
    }
    return 'my';
  });

  const [trackTimezone, setTrackTimezone] = useState<string>('Asia/Baku');
  const [myClock, setMyClock] = useState<string>(() => getCurrentClock());
  const [trackClock, setTrackClock] = useState<string>(() => getCurrentClock('Asia/Baku'));

  const setMode = (newMode: TimezoneMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem(STORAGE_KEY, newMode);
    } catch {
      // Ignore
    }
  };

  const toggleMode = () => {
    setMode(mode === 'my' ? 'track' : 'my');
  };

  const setTrackCircuit = (circuit?: string, locality?: string, country?: string) => {
    const tz = getCircuitTimezone(circuit, locality, country);
    setTrackTimezone(tz);
  };

  // Keep clocks ticking live every 5 seconds (smooth and battery efficient)
  useEffect(() => {
    const updateClocks = () => {
      setMyClock(getCurrentClock());
      setTrackClock(getCurrentClock(trackTimezone));
    };

    updateClocks();
    const interval = setInterval(updateClocks, 5000);
    return () => clearInterval(interval);
  }, [trackTimezone]);

  const formatSessionTime = (isoStr: string, overrideTimezone?: string): string | null => {
    if (mode === 'track') {
      return formatSessionTimeToZone(isoStr, overrideTimezone || trackTimezone);
    }
    return formatSessionTimeToZone(isoStr);
  };

  const formatSessionDate = (isoStr: string, lang: 'es' | 'en' = 'es', overrideTimezone?: string): string => {
    if (mode === 'track') {
      return formatSessionDateToZone(isoStr, overrideTimezone || trackTimezone, lang);
    }
    return formatSessionDateToZone(isoStr, undefined, lang);
  };

  const value = useMemo(
    () => ({
      mode,
      setMode,
      toggleMode,
      trackTimezone,
      setTrackCircuit,
      myClock,
      trackClock,
      formatSessionTime,
      formatSessionDate,
    }),
    [mode, trackTimezone, myClock, trackClock]
  );

  return <TimezoneContext.Provider value={value}>{children}</TimezoneContext.Provider>;
}

export function useTimezone(): TimezoneContextType {
  const context = useContext(TimezoneContext);
  if (!context) {
    throw new Error('useTimezone must be used within a TimezoneProvider');
  }
  return context;
}
