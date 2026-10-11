/**
 * Track Interpolation and Kinematics Utilities
 * Provides track spline projection, circular progression delta, and smooth kinematic calculations.
 */

export interface TrackProjectionResult {
  t: number; // Progress along track [0, 1)
  distanceToTrack: number; // Distance from point to closest track centerpoint in SVG units
  projectedPoint: [number, number]; // [x, y] in SVG coordinates
}

/**
 * Projects a 2D SVG point onto the track polygon outline and returns the normalized track progress `t` [0, 1).
 * When `prevT` is provided, continuity weighting prevents jumping to adjacent parallel streets or opposite sides of hairpins.
 */
export function projectPointToTrack(
  pt: [number, number],
  pts: [number, number][],
  cumDists: number[],
  totalLength: number,
  prevT?: number,
): TrackProjectionResult {
  const N = pts.length;
  if (N < 2 || totalLength <= 0) {
    return { t: 0, distanceToTrack: 0, projectedPoint: pt };
  }

  let minCost = Infinity;
  let bestSegIdx = 0;
  let bestU = 0;
  let bestProjX = pt[0];
  let bestProjY = pt[1];
  let bestDistSq = 0;

  for (let i = 0; i < N; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % N];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const segLenSq = dx * dx + dy * dy;

    if (segLenSq < 1e-6) continue;

    const u = Math.max(0, Math.min(1, ((pt[0] - a[0]) * dx + (pt[1] - a[1]) * dy) / segLenSq));
    const projX = a[0] + u * dx;
    const projY = a[1] + u * dy;
    const distSq = (pt[0] - projX) ** 2 + (pt[1] - projY) ** 2;

    let cost = distSq;
    if (prevT !== undefined && prevT >= 0) {
      const segDist = cumDists[i + 1] - cumDists[i];
      const candDist = cumDists[i] + u * segDist;
      const candT = ((candDist / totalLength) % 1.0 + 1.0) % 1.0;
      let diff = candT - prevT;
      if (diff < -0.5) diff += 1.0;
      else if (diff > 0.5) diff -= 1.0;

      // In real racing, a car moves forward within [-0.03, +0.08] between 1.5s packets.
      // If a candidate segment is outside this plausible window (e.g. parallel street 1500m away on track),
      // penalize it heavily so the projection stays on the car's actual current street.
      if (diff < -0.03 || diff > 0.08) {
        const mismatchMeters = Math.abs(diff) * totalLength;
        cost += mismatchMeters * mismatchMeters * 4.0;
      }
    }

    if (cost < minCost) {
      minCost = cost;
      bestSegIdx = i;
      bestU = u;
      bestProjX = projX;
      bestProjY = projY;
      bestDistSq = distSq;
    }
  }

  const segDist = cumDists[bestSegIdx + 1] - cumDists[bestSegIdx];
  const distanceAlongTrack = cumDists[bestSegIdx] + bestU * segDist;
  const t = ((distanceAlongTrack / totalLength) % 1.0 + 1.0) % 1.0;

  return {
    t,
    distanceToTrack: Math.sqrt(bestDistSq),
    projectedPoint: [bestProjX, bestProjY],
  };
}

/**
 * Computes shortest forward circular delta between target progress and current progress [0, 1).
 * Handles finish line wrap-around (e.g. 0.99 -> 0.01 = +0.02).
 */
export function computeCircularDelta(targetT: number, currentT: number): number {
  let diff = targetT - currentT;
  if (diff < -0.5) diff += 1.0;
  else if (diff > 0.5) diff -= 1.0;
  return diff;
}

/**
 * Normalizes any progress value to strictly [0, 1).
 */
export function normalizeProgress(t: number): number {
  return ((t % 1.0) + 1.0) % 1.0;
}
