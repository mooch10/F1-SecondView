import { useContext } from 'react';
import { TimezoneContext, type TimezoneContextType } from '../context/TimezoneContext';

export function useTimezone(): TimezoneContextType {
  const context = useContext(TimezoneContext);
  if (!context) {
    throw new Error('useTimezone must be used within a TimezoneProvider');
  }
  return context;
}
