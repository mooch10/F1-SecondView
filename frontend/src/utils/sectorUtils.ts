import type { SectorStatus } from '../types/f1';

export interface BestSessionSectors {
  bestS1: number | null;
  bestS2: number | null;
  bestS3: number | null;
}

/**
 * Computes the fastest overall sector times in seconds across all drivers in the session.
 */
export function computeBestSessionSectors(
  drivers: Array<{ sectors?: { s1?: number | null; s2?: number | null; s3?: number | null } }>
): BestSessionSectors {
  let bestS1 = Number.POSITIVE_INFINITY;
  let bestS2 = Number.POSITIVE_INFINITY;
  let bestS3 = Number.POSITIVE_INFINITY;

  for (const d of drivers) {
    const s = d.sectors;
    if (s?.s1 && typeof s.s1 === 'number' && s.s1 > 0 && s.s1 < bestS1) {
      bestS1 = s.s1;
    }
    if (s?.s2 && typeof s.s2 === 'number' && s.s2 > 0 && s.s2 < bestS2) {
      bestS2 = s.s2;
    }
    if (s?.s3 && typeof s.s3 === 'number' && s.s3 > 0 && s.s3 < bestS3) {
      bestS3 = s.s3;
    }
  }

  return {
    bestS1: bestS1 !== Number.POSITIVE_INFINITY ? bestS1 : null,
    bestS2: bestS2 !== Number.POSITIVE_INFINITY ? bestS2 : null,
    bestS3: bestS3 !== Number.POSITIVE_INFINITY ? bestS3 : null,
  };
}

/**
 * Resolves the SectorStatus ('purple' | 'green' | 'yellow' | 'none') based on session bests.
 * - 'purple': Driver holds the overall session record for this sector.
 * - 'green': Personal best sector (or default valid sector).
 * - 'yellow': Slower / no improvement.
 * - 'none': No valid time recorded.
 */
export function resolveSectorStatus(
  sectorNum: 1 | 2 | 3,
  time: number | null | undefined,
  rawStatus: SectorStatus | undefined,
  bestSectors: BestSessionSectors
): SectorStatus {
  if (typeof time !== 'number' || Number.isNaN(time) || time <= 0) {
    return rawStatus || 'none';
  }

  const targetBest =
    sectorNum === 1
      ? bestSectors.bestS1
      : sectorNum === 2
      ? bestSectors.bestS2
      : bestSectors.bestS3;

  // 1. If this driver's time matches the overall fastest sector of the session (with 0.001s tolerance)
  if (targetBest !== null && Math.abs(time - targetBest) <= 0.001) {
    return 'purple';
  }

  // 2. If the server already classified it as purple
  if (rawStatus === 'purple') {
    return 'purple';
  }

  // 3. Respect green or yellow status if already provided
  if (rawStatus === 'green' || rawStatus === 'yellow') {
    return rawStatus;
  }

  return 'green';
}
