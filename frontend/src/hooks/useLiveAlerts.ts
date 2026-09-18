import { useState, useEffect, useRef, useCallback } from 'react';
import type { SessionLive, DriverLive, FlagStatus } from '../types/f1';
import { useLanguage } from './useLanguage';
import {
  isAudioAlertsEnabled,
  setAudioAlertsEnabled,
  playSafetyCarSound,
  playRedFlagSound,
  playPitStopSound,
  playChequeredSound,
  playLeadChangeSound,
} from '../utils/audioAlerts';

export interface LiveAlert {
  id: string;
  type: 'SC' | 'VSC' | 'RED' | 'CHEQUERED' | 'PIT' | 'LEADER';
  title: string;
  subtitle: string;
  timestamp: number;
  color: string;
}

export function useLiveAlerts(
  snapshot: SessionLive | null | undefined,
  drivers: DriverLive[] | undefined,
  favoriteDriverNumber: number | null
) {
  const { lang } = useLanguage();
  const [alerts, setAlerts] = useState<LiveAlert[]>([]);
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => isAudioAlertsEnabled());

  // Tracking refs for deduplicating state transitions
  const lastFlagRef = useRef<FlagStatus | null>(null);
  const lastP1NumberRef = useRef<number | null>(null);
  const lastFavPitRef = useRef<{ inPit: boolean; pitStops: number } | null>(null);
  const isInitialMount = useRef<boolean>(true);

  // Sync sound settings across window events
  useEffect(() => {
    const handleAudioChange = (e: Event) => {
      const custom = e as CustomEvent<{ enabled: boolean }>;
      setSoundEnabledState(custom.detail.enabled);
    };
    window.addEventListener('delta_audio_setting_change', handleAudioChange);
    return () => window.removeEventListener('delta_audio_setting_change', handleAudioChange);
  }, []);

  const toggleSound = useCallback(() => {
    const next = !soundEnabled;
    setAudioAlertsEnabled(next);
    setSoundEnabledState(next);
  }, [soundEnabled]);

  const pushAlert = useCallback((alert: Omit<LiveAlert, 'id' | 'timestamp'>) => {
    const newAlert: LiveAlert = {
      ...alert,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: Date.now(),
    };

    setAlerts((prev) => [newAlert, ...prev].slice(0, 3)); // Keep max 3 active alerts

    // Browser Notification if tab is in background
    if (
      typeof window !== 'undefined' &&
      'Notification' in window &&
      Notification.permission === 'granted' &&
      document.hidden
    ) {
      try {
        new Notification(newAlert.title, {
          body: newAlert.subtitle,
          icon: '/pwa-icon.svg',
          tag: newAlert.type,
        });
      } catch (e) {
        console.warn('[Alerts] Notification failed:', e);
      }
    }
  }, []);

  const dismissAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  // Monitor Live Snapshot & Drivers transitions
  useEffect(() => {
    // Avoid firing alerts on the initial data load
    if (isInitialMount.current) {
      if (snapshot?.flag) {
        lastFlagRef.current = snapshot.flag;
      }
      const currentP1 = drivers?.find((d) => d.pos === 1);
      if (currentP1) {
        lastP1NumberRef.current = currentP1.driverNumber;
      }
      if (favoriteDriverNumber && drivers) {
        const fav = drivers.find((d) => d.driverNumber === favoriteDriverNumber);
        if (fav) {
          lastFavPitRef.current = { inPit: fav.inPit, pitStops: fav.pitStops ?? 0 };
        }
      }
      if (snapshot || (drivers && drivers.length > 0)) {
        isInitialMount.current = false;
      }
      return;
    }

    // 1. Check Flag & Safety Car transitions
    if (snapshot?.flag && snapshot.flag !== lastFlagRef.current) {
      const prevFlag = lastFlagRef.current;
      lastFlagRef.current = snapshot.flag;

      // Do NOT trigger alerts or sounds on first observation of flag
      if (!prevFlag) {
        return;
      }

      if (snapshot.flag === 'SC') {
        playSafetyCarSound();
        queueMicrotask(() => {
          pushAlert({
            type: 'SC',
            title: lang === 'es' ? 'SAFETY CAR EN PISTA' : 'SAFETY CAR DEPLOYED',
            subtitle:
              lang === 'es'
                ? 'Dirección de Carrera ha desplegado el Safety Car físico.'
                : 'Race Control has deployed the physical Safety Car.',
            color: '#FFD60A',
          });
        });
      } else if (snapshot.flag === 'VSC') {
        playSafetyCarSound();
        queueMicrotask(() => {
          pushAlert({
            type: 'VSC',
            title: lang === 'es' ? 'VIRTUAL SAFETY CAR (VSC)' : 'VIRTUAL SAFETY CAR (VSC)',
            subtitle:
              lang === 'es'
                ? 'Todos los pilotos deben reducir su delta de velocidad.'
                : 'All drivers must respect speed delta limits.',
            color: '#FFD60A',
          });
        });
      } else if (snapshot.flag === 'RED') {
        playRedFlagSound();
        queueMicrotask(() => {
          pushAlert({
            type: 'RED',
            title: lang === 'es' ? 'BANDERA ROJA • SESIÓN DETENIDA' : 'RED FLAG • SESSION SUSPENDED',
            subtitle:
              lang === 'es'
                ? 'La sesión ha sido suspendida. Todos los autos a pit lane.'
                : 'Session suspended. All cars returning to pit lane.',
            color: '#E10600',
          });
        });
      } else if (snapshot.flag === 'CHEQUERED' && prevFlag !== 'CHEQUERED') {
        // Only trigger fanfare if race was actively taking place
        if (prevFlag === 'GREEN' || prevFlag === 'YELLOW' || prevFlag === 'SC' || prevFlag === 'VSC') {
          playChequeredSound();
          queueMicrotask(() => {
            pushAlert({
              type: 'CHEQUERED',
              title: lang === 'es' ? 'BANDERA A CUADROS' : 'CHEQUERED FLAG',
              subtitle:
                lang === 'es'
                  ? '¡Sesión y Gran Premio completados!'
                  : 'Session and Grand Prix completed!',
              color: '#FFFFFF',
            });
          });
        }
      }
    }

    // 2. Check Leader Change
    if (drivers && drivers.length > 0) {
      const currentP1 = drivers.find((d) => d.pos === 1);
      if (
        currentP1 &&
        lastP1NumberRef.current !== null &&
        currentP1.driverNumber !== lastP1NumberRef.current
      ) {
        lastP1NumberRef.current = currentP1.driverNumber;
        playLeadChangeSound();
        queueMicrotask(() => {
          pushAlert({
            type: 'LEADER',
            title:
              lang === 'es'
                ? `NUEVO LÍDER: ${currentP1.code} (${currentP1.fullName})`
                : `NEW RACE LEADER: ${currentP1.code} (${currentP1.fullName})`,
            subtitle:
              lang === 'es'
                ? `${currentP1.fullName} toma la primera posición de carrera.`
                : `${currentP1.fullName} takes the lead of the race.`,
            color: currentP1.teamColor || '#39B54A',
          });
        });
      } else if (currentP1 && lastP1NumberRef.current === null) {
        lastP1NumberRef.current = currentP1.driverNumber;
      }
    }

    // 3. Check Favorite Driver Pit Stop
    if (favoriteDriverNumber && drivers) {
      const fav = drivers.find((d) => d.driverNumber === favoriteDriverNumber);
      if (fav) {
        const prev = lastFavPitRef.current;
        const enteredPit = Boolean(prev && !prev.inPit && fav.inPit);
        const didPitStop = Boolean(prev && (fav.pitStops ?? 0) > prev.pitStops);

        if (enteredPit || didPitStop) {
          playPitStopSound();
          const durationStr = fav.lastPitStopDuration
            ? lang === 'es'
              ? ` (${fav.lastPitStopDuration.toFixed(1)}s detenido${fav.lastPitLaneTime ? `, ${fav.lastPitLaneTime.toFixed(1)}s calle` : ''})`
              : ` (${fav.lastPitStopDuration.toFixed(1)}s stop${fav.lastPitLaneTime ? `, ${fav.lastPitLaneTime.toFixed(1)}s lane` : ''})`
            : '';

          queueMicrotask(() => {
            pushAlert({
              type: 'PIT',
              title:
                lang === 'es'
                  ? `¡${fav.fullName} EN BOXES!`
                  : `${fav.fullName} IN THE PITS!`,
              subtitle:
                lang === 'es'
                  ? `Parada #${fav.pitStops || 1}${durationStr} • Compuesto: ${fav.tyre?.compound || 'NUEVO'}`
                  : `Pit Stop #${fav.pitStops || 1}${durationStr} • Compound: ${fav.tyre?.compound || 'NEW'}`,
              color: '#38BDF8',
            });
          });
        }
        lastFavPitRef.current = { inPit: fav.inPit, pitStops: fav.pitStops ?? 0 };
      }
    }
  }, [snapshot, drivers, favoriteDriverNumber, lang, pushAlert]);

  // Request browser notification permission helper
  const requestNotificationPermission = useCallback(async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const res = await Notification.requestPermission();
        return res === 'granted';
      } catch (e) {
        console.warn(e);
        return false;
      }
    }
    return false;
  }, []);

  return {
    alerts,
    dismissAlert,
    soundEnabled,
    toggleSound,
    requestNotificationPermission,
  };
}
