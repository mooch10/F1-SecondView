import { createContext } from 'react';
import type { SeriesCategory } from '../types/f1';
import type { SeriesTheme } from '../hooks/useSeries';

export interface SeriesContextType {
  series: SeriesCategory;
  setSeries: (series: SeriesCategory) => void;
  theme: SeriesTheme;
}

export const SeriesContext = createContext<SeriesContextType | undefined>(undefined);
