import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'delta_favorite_driver';
const LEGACY_STORAGE_KEY = 'f1_pinned_driver';

export function getStoredFavoriteDriver(): number | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    return saved ? parseInt(saved, 10) : null;
  } catch {
    return null;
  }
}

export function setStoredFavoriteDriver(driverNumber: number | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (driverNumber === null) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, String(driverNumber));
      localStorage.setItem(LEGACY_STORAGE_KEY, String(driverNumber));
    }
    window.dispatchEvent(
      new CustomEvent('delta_favorite_driver_change', {
        detail: { driverNumber },
      })
    );
  } catch (err) {
    console.error('Error saving favorite driver to localStorage:', err);
  }
}

export function useFavoriteDriver() {
  const [favoriteDriverNumber, setFavoriteDriverNumberState] = useState<number | null>(() =>
    getStoredFavoriteDriver()
  );

  useEffect(() => {
    const handleLocalChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ driverNumber: number | null }>;
      setFavoriteDriverNumberState(customEvent.detail.driverNumber);
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY || e.key === LEGACY_STORAGE_KEY) {
        setFavoriteDriverNumberState(e.newValue ? parseInt(e.newValue, 10) : null);
      }
    };

    window.addEventListener('delta_favorite_driver_change', handleLocalChange);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('delta_favorite_driver_change', handleLocalChange);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const setFavoriteDriver = useCallback((driverNumber: number | null) => {
    setStoredFavoriteDriver(driverNumber);
    setFavoriteDriverNumberState(driverNumber);
  }, []);

  const toggleFavoriteDriver = useCallback((driverNumber: number) => {
    setFavoriteDriverNumberState((prev) => {
      const next = prev === driverNumber ? null : driverNumber;
      setStoredFavoriteDriver(next);
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (driverNumber: number) => favoriteDriverNumber === driverNumber,
    [favoriteDriverNumber]
  );

  return {
    favoriteDriverNumber,
    setFavoriteDriver,
    toggleFavoriteDriver,
    isFavorite,
  };
}
