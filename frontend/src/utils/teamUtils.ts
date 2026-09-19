/**
 * Utilities for resolving and standardizing Formula 1 team names.
 */

/**
 * Returns the recognizable, concise team name without sponsor prefixes or corporate suffixes.
 * E.g., 'Oracle Red Bull Racing' -> 'Red Bull', 'Scuderia Ferrari HP' -> 'Ferrari'.
 */
export function getShortTeamName(teamName: string | undefined | null): string {
  if (!teamName) return '';
  const upper = teamName.toUpperCase().trim();

  if (upper.includes('RED BULL')) return 'Red Bull';
  if (upper.includes('FERRARI')) return 'Ferrari';
  if (upper.includes('MCLAREN')) return 'McLaren';
  if (upper.includes('MERCEDES')) return 'Mercedes';
  if (upper.includes('ASTON MARTIN')) return 'Aston Martin';
  if (upper.includes('ALPINE')) return 'Alpine';
  if (upper.includes('WILLIAMS')) return 'Williams';
  if (
    upper.includes('RACING BULLS') ||
    upper.includes('CASH APP') ||
    upper.includes('TORO ROSSO') ||
    upper.includes('VCARB') ||
    upper.includes('RB')
  ) {
    return 'Racing Bulls';
  }
  if (upper.includes('SAUBER') || upper.includes('KICK') || upper.includes('STAKE') || upper.includes('AUDI')) {
    return 'Kick Sauber';
  }
  if (upper.includes('HAAS')) return 'Haas';

  // Fallback: strip standard sponsor prefixes and suffixes
  const cleaned = teamName
    .replace(/Oracle|Scuderia|BWT|Stake|MoneyGram|Mercedes-AMG|Petronas|Aramco|HP|F1 Team|Formula 1 Team|Racing/gi, '')
    .trim();

  return cleaned || teamName;
}
