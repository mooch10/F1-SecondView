import { useCallback, useEffect, useRef, useState } from 'react';

export function useWakeLock() {
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const supported = typeof navigator !== 'undefined' && 'wakeLock' in navigator;

  const requestLock = useCallback(async () => {
    if (!supported) return false;
    try {
      wakeLockRef.current = await navigator.wakeLock.request('screen');
      setIsLocked(true);
      wakeLockRef.current.addEventListener('release', () => {
        setIsLocked(false);
        wakeLockRef.current = null;
      });
      return true;
    } catch (err) {
      console.warn('[WakeLock] Could not acquire lock:', err);
      setIsLocked(false);
      return false;
    }
  }, [supported]);

  const releaseLock = useCallback(async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
      } catch (err) {
        console.warn('[WakeLock] Release error:', err);
      }
      wakeLockRef.current = null;
      setIsLocked(false);
    }
  }, []);

  const toggleWakeLock = useCallback(() => {
    if (isLocked) {
      releaseLock();
    } else {
      requestLock();
    }
  }, [isLocked, releaseLock, requestLock]);

  // Re-acquire lock if user returns to the tab
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && isLocked) {
        await requestLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      releaseLock();
    };
  }, [isLocked, requestLock, releaseLock]);

  return { isLocked, toggleWakeLock, supported, requestLock, releaseLock };
}
