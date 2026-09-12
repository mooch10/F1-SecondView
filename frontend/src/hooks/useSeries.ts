import { useContext } from 'react';
import { SeriesContext, type SeriesContextType } from '../context/SeriesContext';
import type { SeriesCategory } from '../types/f1';

export interface SeriesTheme {
  name: string;
  shortName: string;
  badge: string;
  primary: string;
  glow: string;
  border: string;
  borderActive: string;
  text: string;
  bg: string;
  bgSubtle: string;
}

export const SERIES_THEMES: Record<SeriesCategory, SeriesTheme> = {
  f1: {
    name: 'Formula 1',
    shortName: 'F1',
    badge: 'F1 TELEMETRY',
    primary: '#E10600',
    glow: 'rgba(225, 6, 0, 0.3)',
    border: 'border-[#E10600]',
    borderActive: 'border-b-[#E10600]',
    text: 'text-[#E10600]',
    bg: 'bg-[#E10600]',
    bgSubtle: 'bg-[#E10600]/10',
  },
  f2: {
    name: 'Formula 2',
    shortName: 'F2',
    badge: 'F2 CHAMPIONSHIP',
    primary: '#009CDE',
    glow: 'rgba(0, 156, 222, 0.3)',
    border: 'border-[#009CDE]',
    borderActive: 'border-b-[#009CDE]',
    text: 'text-[#009CDE]',
    bg: 'bg-[#009CDE]',
    bgSubtle: 'bg-[#009CDE]/10',
  },
  f3: {
    name: 'Formula 3',
    shortName: 'F3',
    badge: 'F3 CHAMPIONSHIP',
    primary: '#E35205',
    glow: 'rgba(227, 82, 5, 0.3)',
    border: 'border-[#E35205]',
    borderActive: 'border-b-[#E35205]',
    text: 'text-[#E35205]',
    bg: 'bg-[#E35205]',
    bgSubtle: 'bg-[#E35205]/10',
  },
};

export function useSeries(): SeriesContextType {
  const context = useContext(SeriesContext);
  if (!context) {
    throw new Error('useSeries must be used within a SeriesProvider');
  }
  return context;
}

