import { useEffect, useRef, useState } from 'react';
import type { DriverLive, SessionState } from '../types/f1';
import {
  computeCircularDelta,
  normalizeProgress,
  projectPointToTrack,
} from '../utils/trackInterpolator';

export interface AnimatedCarCoord {
  driverNumber: number;
  x: number;
  y: number;
  angle: number;
  progress: number;
  inPit: boolean;
}

interface DriverKinematics {
  driverNumber: number;
  currentProgress: number; // Current visual progress [0, 1) along track
  targetProgress: number; // Latest target from packet
  speed: number; // Progress advancement per second (0 if stationary)
  convergenceSpeed: number; // Smooth speed adjustment (+ or -) to catch up without snapping
  convergenceEndTime: number; // Timestamp (ms) when catch-up finishes
  lastFrameTime: number; // Timestamp (ms) of previous frame
  inPit: boolean;
  currentPos: { x: number; y: number };
  targetPos: { x: number; y: number };
  angle: number;
}

interface TrackGeometryInterface {
  canvasW: number;
  canvasH: number;
  toSvgPoint: (x: number, y: number) => [number, number];
  getPointAtProgress: (t: number) => { x: number; y: number; angle: number; segIdx: number };
  pts?: [number, number][];
  cumDists?: number[];
  totalLength?: number;
}

interface UseTrackAnimationProps {
  drivers: DriverLive[];
  trackGeometry: TrackGeometryInterface | null;
  isGpsClustered: boolean;
  sessionStatus?: SessionState;
  benchmarkLapSec?: number;
}

// Fallback racing benchmark: 1 lap ~ 95 seconds = ~0.0105 progress/sec
const DEFAULT_BENCHMARK_LAP_SEC = 95;

export function useTrackAnimation({
  drivers,
  trackGeometry,
  isGpsClustered,
  sessionStatus,
  benchmarkLapSec,
}: UseTrackAnimationProps) {
  const [animatedCoords, setAnimatedCoords] = useState<Map<number, AnimatedCarCoord>>(new Map());

  // Kinematics store preserved across frames without triggering React re-renders
  const kinematicsMapRef = useRef<Map<number, DriverKinematics>>(new Map());
  const rafRef = useRef<number | null>(null);
  const animateRef = useRef<((t: number) => void) | null>(null);

  // Status flags: cars must stay stationary if session hasn't started or is finished
  const isSessionStationary = sessionStatus === 'NOT_STARTED' || sessionStatus === 'FINISHED';

  // 1. Sync telemetry packets when new data arrives from polling/websocket
  useEffect(() => {
    if (!trackGeometry || sessionStatus === 'FINISHED') {
      if (sessionStatus === 'FINISHED') {
        kinematicsMapRef.current.clear();
        queueMicrotask(() => {
          setAnimatedCoords((prev) => (prev.size === 0 ? prev : new Map()));
        });
      }
      return;
    }

    const now = performance.now();
    const kinematicsMap = kinematicsMapRef.current;
    const currentActiveNumbers = new Set<number>();

    drivers.forEach((driver) => {
      const num = driver.driverNumber;
      currentActiveNumbers.add(num);

      const inPit = Boolean(driver.inPit || driver.status === 'DNF' || driver.status === 'DNS' || driver.status === 'DSQ');
      const isStationary = isSessionStationary || inPit || isGpsClustered;

      // Compute target SVG point from coordinates
      let targetX = 0;
      let targetY = 0;

      if (driver.location && (driver.location.x !== 0 || driver.location.y !== 0)) {
        const [gx, gy] = trackGeometry.toSvgPoint(driver.location.x, driver.location.y);
        targetX = gx;
        targetY = gy;
      } else {
        // Driver has no active GPS position on track - do not invent fake coordinates
        return;
      }

      // Project onto track spline
      let targetProgress = 0;
      if (trackGeometry.pts && trackGeometry.cumDists && trackGeometry.totalLength) {
        const proj = projectPointToTrack(
          [targetX, targetY],
          trackGeometry.pts,
          trackGeometry.cumDists,
          trackGeometry.totalLength,
        );
        targetProgress = proj.t;
      }

      // Physical speed estimation anchored to actual driver lap time or circuit benchmark
      let baseSpeed = 0;
      const benchmarkSec =
        benchmarkLapSec && benchmarkLapSec > 50 && benchmarkLapSec < 150
          ? benchmarkLapSec
          : DEFAULT_BENCHMARK_LAP_SEC;

      if (!isStationary) {
        if (driver.bestLapDuration && driver.bestLapDuration > 50 && driver.bestLapDuration < 150) {
          baseSpeed = 1.0 / driver.bestLapDuration;
        } else {
          baseSpeed = 1.0 / benchmarkSec;
        }
      }

      const existing = kinematicsMap.get(num);

      if (!existing) {
        const initialPt = isStationary
          ? { x: targetX, y: targetY }
          : trackGeometry.getPointAtProgress(targetProgress);

        kinematicsMap.set(num, {
          driverNumber: num,
          currentProgress: targetProgress,
          targetProgress,
          speed: isStationary ? 0 : baseSpeed,
          convergenceSpeed: 0,
          convergenceEndTime: now,
          lastFrameTime: now,
          inPit,
          currentPos: { x: initialPt.x, y: initialPt.y },
          targetPos: { x: targetX, y: targetY },
          angle: 'angle' in initialPt ? initialPt.angle : 0,
        });
      } else {
        existing.inPit = inPit;
        existing.targetPos = { x: targetX, y: targetY };
        existing.targetProgress = targetProgress;

        if (isStationary) {
          // Stationary on grid, in pit or parc fermé: lock speed to 0 and snap directly to target box
          existing.speed = 0;
          existing.convergenceSpeed = 0;
          existing.currentProgress = targetProgress;
        } else {
          // Car is in active race: reconcile smoothly without teleporting
          existing.speed = baseSpeed > 0 ? baseSpeed : (existing.speed > 0 ? existing.speed : 1.0 / DEFAULT_BENCHMARK_LAP_SEC);

          // Calculate circular difference: how far targetProgress is ahead of current visual progress
          const delta = computeCircularDelta(targetProgress, existing.currentProgress);

          if (Math.abs(delta) < 0.0005) {
            // Very close / identical packet: maintain base speed smoothly
            existing.convergenceSpeed = 0;
          } else {
            // Reconcile over 1.0s window: extra speed = delta / 1.0s
            // Clamp to [-0.4 * speed, +0.5 * speed] so car never moves backward or at hyperspeed
            const maxBoost = existing.speed * 0.5;
            const maxSlowdown = -existing.speed * 0.4;
            const desiredExtra = delta / 1.0;
            existing.convergenceSpeed = Math.max(maxSlowdown, Math.min(maxBoost, desiredExtra));
            existing.convergenceEndTime = now + 1000;
          }
        }
      }
    });

    // Clean up drivers that left
    for (const num of kinematicsMap.keys()) {
      if (!currentActiveNumbers.has(num)) {
        kinematicsMap.delete(num);
      }
    }

    // Wake up animation loop if it was asleep
    if (rafRef.current === null && animateRef.current) {
      rafRef.current = requestAnimationFrame(animateRef.current);
    }
  }, [drivers, trackGeometry, isGpsClustered, isSessionStationary, sessionStatus, benchmarkLapSec]);

  // 2. High-Performance 60 FPS Continuous Animation Loop
  useEffect(() => {
    if (!trackGeometry) return;

    let isRunning = true;
    const minFrameDeltaMs = 1000 / 60; // 60 FPS cap (protects 120Hz/144Hz high refresh displays)
    let lastFrameTime = performance.now();

    const animate = (currentTime: number) => {
      if (!isRunning) return;
      animateRef.current = animate;

      if (currentTime - lastFrameTime < minFrameDeltaMs) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime = currentTime;

      const kinematicsMap = kinematicsMapRef.current;
      const nextMap = new Map<number, AnimatedCarCoord>();
      let maxMovement = 0;
      let hasActiveRacers = false;

      kinematicsMap.forEach((k) => {
        if (k.inPit || isGpsClustered || isSessionStationary || k.speed === 0) {
          // Stationary cars (Grid, Pits, Parc Fermé): smooth lerp directly to target slot without track progression
          const dt = Math.min(0.05, Math.max(0.001, (currentTime - k.lastFrameTime) / 1000));
          k.lastFrameTime = currentTime;
          const lerpFactor = Math.min(1, dt * 6.0);
          const dx = (k.targetPos.x - k.currentPos.x) * lerpFactor;
          const dy = (k.targetPos.y - k.currentPos.y) * lerpFactor;
          k.currentPos.x += dx;
          k.currentPos.y += dy;
          maxMovement = Math.max(maxMovement, Math.abs(dx), Math.abs(dy));

          nextMap.set(k.driverNumber, {
            driverNumber: k.driverNumber,
            x: k.currentPos.x,
            y: k.currentPos.y,
            angle: 0,
            progress: k.targetProgress,
            inPit: k.inPit,
          });
        } else {
          hasActiveRacers = true;
          const dt = Math.min(0.05, Math.max(0.001, (currentTime - k.lastFrameTime) / 1000));
          k.lastFrameTime = currentTime;

          // Apply extra convergence speed if within reconciliation window
          let effectiveSpeed = k.speed;
          if (currentTime < k.convergenceEndTime) {
            const remainingRatio = Math.max(0, Math.min(1, (k.convergenceEndTime - currentTime) / 1000));
            effectiveSpeed += k.convergenceSpeed * remainingRatio;
          }

          // Advance progress forward strictly monotonically
          k.currentProgress = normalizeProgress(k.currentProgress + effectiveSpeed * dt);

          // Evaluate exact SVG coordinates and tangent angle along track spline
          const splinePt = trackGeometry.getPointAtProgress(k.currentProgress);
          k.currentPos.x = splinePt.x;
          k.currentPos.y = splinePt.y;
          k.angle = splinePt.angle;

          nextMap.set(k.driverNumber, {
            driverNumber: k.driverNumber,
            x: splinePt.x,
            y: splinePt.y,
            angle: splinePt.angle,
            progress: k.currentProgress,
            inPit: false,
          });
        }
      });

      setAnimatedCoords(nextMap);

      // Sleep loop if all cars are stationary and have settled into place (<0.08px movement)
      if (!hasActiveRacers && maxMovement < 0.08) {
        rafRef.current = null;
        return;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    // Pause on tab visibility change to preserve 0% battery/CPU when inactive
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      } else {
        const now = performance.now();
        kinematicsMapRef.current.forEach((k) => {
          k.lastFrameTime = now;
          k.convergenceSpeed = 0;
          k.convergenceEndTime = now;
        });
        if (!rafRef.current) {
          rafRef.current = requestAnimationFrame(animate);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isRunning = false;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [trackGeometry, isGpsClustered, isSessionStationary]);

  return animatedCoords;
}
