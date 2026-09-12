import { createContext, useState, useMemo, type ReactNode } from 'react';
import type { SeriesCategory } from '../types/f1';
import { SERIES_THEMES, type SeriesTheme } from '../hooks/useSeries';

export interface SeriesContextType {
  series: SeriesCategory;
  setSeries: (series: SeriesCategory) => void;
  theme: SeriesTheme;
}

export const SeriesContext = createContext<SeriesContextType | undefined>(undefined);

const STORAGE_KEY = 'delta_series';

export function SeriesProvider({ children }: { children: ReactNode }) {
  const [series, setSeriesState] = useState<SeriesCategory>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'f1' || saved === 'f2' || saved === 'f3') {
        return saved;
      }
    } catch {
      // Ignore
    }
    return 'f1';
  });

  const setSeries = (newSeries: SeriesCategory) => {
    setSeriesState(newSeries);
    try {
      localStorage.setItem(STORAGE_KEY, newSeries);
    } catch {
      // Ignore
    }
  };

  const theme = useMemo(() => SERIES_THEMES[series], [series]);

  const value = useMemo(
    () => ({
      series,
      setSeries,
      theme,
    }),
    [series, theme]
  );

  return <SeriesContext.Provider value={value}>{children}</SeriesContext.Provider>;
}

