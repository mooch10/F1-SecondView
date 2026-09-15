import { createContext } from 'react';

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
