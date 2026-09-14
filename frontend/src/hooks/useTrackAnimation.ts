import { useEffect, useRef, useState } from 'react';
import type { DriverLive } from '../types/f1';
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
  packetProgress: number; // Base progress from latest received telemetry packet
  lastPacketTime: number; // Timestamp (ms) when packet was received
  speed: number; // Progress advancement per second (e.g. 1 / 82s = ~0.0122/s)
  inPit: boolean;
  blendError: number; // Discrepancy between projected position and newly arrived packet
  blendStartTime: number; // Timestamp (ms) when blend started
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
}

// Typical racing benchmark: 1 lap ~ 85 seconds = ~0.0118 progress/sec
const DEFAULT_PROGRESS_SPEED = 1 / 85;

export function useTrackAnimation({
  drivers,
  trackGeometry,
  isGpsClustered,
}: UseTrackAnimationProps) {
  const [animatedCoords, setAnimatedCoords] = useState<Map<number, AnimatedCarCoord>>(new Map());

  // Kinematics store preserved across frames without triggering React re-renders
  const kinematicsMapRef = useRef<Map<number, DriverKinematics>>(new Map());
  const rafRef = useRef<number | null>(null);

  // 1. Sync telemetry packets when new data arrives from polling/websocket
  useEffect(() => {
    if (!trackGeometry) return;

    const now = performance.now();
    const kinematicsMap = kinematicsMapRef.current;
    const currentActiveNumbers = new Set<number>();

    drivers.forEach((driver, idx) => {
      const num = driver.driverNumber;
      currentActiveNumbers.add(num);

      const inPit = Boolean(driver.inPit || driver.status === 'DNF' || driver.status === 'DNS' || driver.status === 'DSQ');

      // Compute target SVG point from coordinates
      let targetX = 0;
      let targetY = 0;

      if (driver.location && (driver.location.x !== 0 || driver.location.y !== 0)) {
        const [gx, gy] = trackGeometry.toSvgPoint(driver.location.x, driver.location.y);
        targetX = gx;
        targetY = gy;
      } else {
        // Fallback for cars without active GPS: position cleanly along grid
        const pt = trackGeometry.getPointAtProgress(0.98 - ((idx * 0.02) % 0.25));
        targetX = pt.x;
        targetY = pt.y;
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

      // Initial speed estimation from lap duration if available
      let baseSpeed = DEFAULT_PROGRESS_SPEED;
      if (driver.bestLapDuration && driver.bestLapDuration > 45 && driver.bestLapDuration < 140) {
        baseSpeed = 1.0 / driver.bestLapDuration;
      }

      const existing = kinematicsMap.get(num);

      if (!existing) {
        const initialPt =
          inPit || isGpsClustered
            ? { x: targetX, y: targetY }
            : trackGeometry.getPointAtProgress(targetProgress);

        kinematicsMap.set(num, {
          driverNumber: num,
          packetProgress: targetProgress,
          lastPacketTime: now,
          speed: baseSpeed,
          inPit,
          blendError: 0,
          blendStartTime: now,
          currentPos: { x: initialPt.x, y: initialPt.y },
          targetPos: { x: targetX, y: targetY },
          angle: 0,
        });
      } else {
        // Dynamic speed calibration based on delta and time between packets
        const dtSeconds = Math.max(0.3, (now - existing.lastPacketTime) / 1000);
        const progressDelta = computeCircularDelta(targetProgress, existing.packetProgress);

        let calibratedSpeed = existing.speed;
        if (progressDelta > 0.001 && progressDelta < 0.15) {
          const measuredSpeed = progressDelta / dtSeconds;
          calibratedSpeed = Math.max(0.006, Math.min(0.025, measuredSpeed));
        } else if (baseSpeed !== DEFAULT_PROGRESS_SPEED) {
          calibratedSpeed = baseSpeed;
        }

        // Calculate current extrapolated position before replacing baseline
        const elapsedSinceLast = Math.min(2.5, (now - existing.lastPacketTime) / 1000);
        const currentExtrapolated = normalizeProgress(existing.packetProgress + existing.speed * elapsedSinceLast);

        // Difference between where we were rendering and the new packet
        const error = computeCircularDelta(currentExtrapolated, targetProgress);

        existing.packetProgress = targetProgress;
        existing.lastPacketTime = now;
        existing.speed = calibratedSpeed;
        existing.inPit = inPit;
        // Smoothly blend if error is reasonable (< 15% track length); snap if huge reset
        existing.blendError = Math.abs(error) < 0.15 ? error : 0;
        existing.blendStartTime = now;
        existing.targetPos = { x: targetX, y: targetY };
      }
    });

    // Clean up drivers that left
    for (const num of kinematicsMap.keys()) {
      if (!currentActiveNumbers.has(num)) {
        kinematicsMap.delete(num);
      }
    }
  }, [drivers, trackGeometry, isGpsClustered]);

  // 2. High-Performance 60 FPS Continuous Dead-Reckoning Animation Loop
  useEffect(() => {
    if (!trackGeometry) return;

    let isRunning = true;

    const animate = (currentTime: number) => {
      if (!isRunning) return;

      const kinematicsMap = kinematicsMapRef.current;
      const nextMap = new Map<number, AnimatedCarCoord>();

      kinematicsMap.forEach((k) => {
        if (k.inPit || isGpsClustered) {
          // Direct smooth lerp for pitlane and parc fermé
          const dt = 0.016; // approximate frame delta
          const lerpFactor = Math.min(1, dt * 5.0);
          k.currentPos.x += (k.targetPos.x - k.currentPos.x) * lerpFactor;
          k.currentPos.y += (k.targetPos.y - k.currentPos.y) * lerpFactor;

          nextMap.set(k.driverNumber, {
            driverNumber: k.driverNumber,
            x: k.currentPos.x,
            y: k.currentPos.y,
            angle: 0,
            progress: k.packetProgress,
            inPit: true,
          });
        } else {
          // Dead reckoning forward along track spline based on time elapsed since packet
          const timeSincePacket = Math.min(3.0, (currentTime - k.lastPacketTime) / 1000);
          let currentProgress = normalizeProgress(k.packetProgress + k.speed * timeSincePacket);

          // Apply smooth reconciliation decay over 350ms to absorb telemetry jumps seamlessly
          const blendElapsed = (currentTime - k.blendStartTime) / 1000;
          if (blendElapsed < 0.35 && k.blendError !== 0) {
            const blendFactor = 1.0 - (blendElapsed / 0.35);
            currentProgress = normalizeProgress(currentProgress + k.blendError * blendFactor);
          }

          // Evaluate exact SVG coordinates and tangent angle along track spline
          const splinePt = trackGeometry.getPointAtProgress(currentProgress);
          k.currentPos.x = splinePt.x;
          k.currentPos.y = splinePt.y;
          k.angle = splinePt.angle;

          nextMap.set(k.driverNumber, {
            driverNumber: k.driverNumber,
            x: splinePt.x,
            y: splinePt.y,
            angle: splinePt.angle,
            progress: currentProgress,
            inPit: false,
          });
        }
      });

      setAnimatedCoords(nextMap);

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
        // When tab is restored, sync last packet timestamp so cars don't jump ahead
        const now = performance.now();
        kinematicsMapRef.current.forEach((k) => {
          k.lastPacketTime = now;
          k.blendStartTime = now;
          k.blendError = 0;
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
  }, [trackGeometry, isGpsClustered]);

  return animatedCoords;
}
