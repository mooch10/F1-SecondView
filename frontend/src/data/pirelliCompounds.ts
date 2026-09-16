export interface PirelliCompoundSet {
  hard: string;    // e.g. 'C1' or 'C2' or 'C3'
  medium: string;  // e.g. 'C2' or 'C3' or 'C4'
  soft: string;    // e.g. 'C3' or 'C4' or 'C5'
  category: 'High Degradation' | 'Balanced' | 'Low Degradation / Street';
  categoryEs: 'Alta Degradación' | 'Equilibrado' | 'Baja Degradación / Urbano';
}

export const PIRELLI_CIRCUIT_COMPOUNDS: Record<string, PirelliCompoundSet> = {
  // C1 - C2 - C3: High stress, high degradation & fast sweeping corners
  'bahrain': { hard: 'C1', medium: 'C2', soft: 'C3', category: 'High Degradation', categoryEs: 'Alta Degradación' },
  'sakhir': { hard: 'C1', medium: 'C2', soft: 'C3', category: 'High Degradation', categoryEs: 'Alta Degradación' },
  'suzuka': { hard: 'C1', medium: 'C2', soft: 'C3', category: 'High Degradation', categoryEs: 'Alta Degradación' },
  'japan': { hard: 'C1', medium: 'C2', soft: 'C3', category: 'High Degradation', categoryEs: 'Alta Degradación' },
  'barcelona': { hard: 'C1', medium: 'C2', soft: 'C3', category: 'High Degradation', categoryEs: 'Alta Degradación' },
  'catalunya': { hard: 'C1', medium: 'C2', soft: 'C3', category: 'High Degradation', categoryEs: 'Alta Degradación' },
  'silverstone': { hard: 'C1', medium: 'C2', soft: 'C3', category: 'High Degradation', categoryEs: 'Alta Degradación' },
  'spa': { hard: 'C1', medium: 'C2', soft: 'C3', category: 'High Degradation', categoryEs: 'Alta Degradación' },
  'spa-francorchamps': { hard: 'C1', medium: 'C2', soft: 'C3', category: 'High Degradation', categoryEs: 'Alta Degradación' },
  'zandvoort': { hard: 'C1', medium: 'C2', soft: 'C3', category: 'High Degradation', categoryEs: 'Alta Degradación' },
  'losail': { hard: 'C1', medium: 'C2', soft: 'C3', category: 'High Degradation', categoryEs: 'Alta Degradación' },
  'lusail': { hard: 'C1', medium: 'C2', soft: 'C3', category: 'High Degradation', categoryEs: 'Alta Degradación' },
  'qatar': { hard: 'C1', medium: 'C2', soft: 'C3', category: 'High Degradation', categoryEs: 'Alta Degradación' },

  // C2 - C3 - C4: Balanced downforce & mixed high/medium speed circuits
  'albert park': { hard: 'C2', medium: 'C3', soft: 'C4', category: 'Balanced', categoryEs: 'Equilibrado' },
  'melbourne': { hard: 'C2', medium: 'C3', soft: 'C4', category: 'Balanced', categoryEs: 'Equilibrado' },
  'australia': { hard: 'C2', medium: 'C3', soft: 'C4', category: 'Balanced', categoryEs: 'Equilibrado' },
  'shanghai': { hard: 'C2', medium: 'C3', soft: 'C4', category: 'Balanced', categoryEs: 'Equilibrado' },
  'china': { hard: 'C2', medium: 'C3', soft: 'C4', category: 'Balanced', categoryEs: 'Equilibrado' },
  'austin': { hard: 'C2', medium: 'C3', soft: 'C4', category: 'Balanced', categoryEs: 'Equilibrado' },
  'cota': { hard: 'C2', medium: 'C3', soft: 'C4', category: 'Balanced', categoryEs: 'Equilibrado' },
  'circuit of the americas': { hard: 'C2', medium: 'C3', soft: 'C4', category: 'Balanced', categoryEs: 'Equilibrado' },
  'interlagos': { hard: 'C2', medium: 'C3', soft: 'C4', category: 'Balanced', categoryEs: 'Equilibrado' },
  'jose carlos pace': { hard: 'C2', medium: 'C3', soft: 'C4', category: 'Balanced', categoryEs: 'Equilibrado' },
  'brazil': { hard: 'C2', medium: 'C3', soft: 'C4', category: 'Balanced', categoryEs: 'Equilibrado' },
  'madring': { hard: 'C2', medium: 'C3', soft: 'C4', category: 'Balanced', categoryEs: 'Equilibrado' },
  'madrid': { hard: 'C2', medium: 'C3', soft: 'C4', category: 'Balanced', categoryEs: 'Equilibrado' },
  'spain': { hard: 'C2', medium: 'C3', soft: 'C4', category: 'Balanced', categoryEs: 'Equilibrado' },

  // C3 - C4 - C5: Maximum mechanical grip, low abrasion & street circuits
  'monaco': { hard: 'C3', medium: 'C4', soft: 'C5', category: 'Low Degradation / Street', categoryEs: 'Baja Degradación / Urbano' },
  'monte carlo': { hard: 'C3', medium: 'C4', soft: 'C5', category: 'Low Degradation / Street', categoryEs: 'Baja Degradación / Urbano' },
  'jeddah': { hard: 'C3', medium: 'C4', soft: 'C5', category: 'Low Degradation / Street', categoryEs: 'Baja Degradación / Urbano' },
  'saudi arabia': { hard: 'C3', medium: 'C4', soft: 'C5', category: 'Low Degradation / Street', categoryEs: 'Baja Degradación / Urbano' },
  'miami': { hard: 'C3', medium: 'C4', soft: 'C5', category: 'Low Degradation / Street', categoryEs: 'Baja Degradación / Urbano' },
  'imola': { hard: 'C3', medium: 'C4', soft: 'C5', category: 'Low Degradation / Street', categoryEs: 'Baja Degradación / Urbano' },
  'enzo e dino ferrari': { hard: 'C3', medium: 'C4', soft: 'C5', category: 'Low Degradation / Street', categoryEs: 'Baja Degradación / Urbano' },
  'montreal': { hard: 'C3', medium: 'C4', soft: 'C5', category: 'Low Degradation / Street', categoryEs: 'Baja Degradación / Urbano' },
  'gilles villeneuve': { hard: 'C3', medium: 'C4', soft: 'C5', category: 'Low Degradation / Street', categoryEs: 'Baja Degradación / Urbano' },
  'canada': { hard: 'C3', medium: 'C4', soft: 'C5', category: 'Low Degradation / Street', categoryEs: 'Baja Degradación / Urbano' },
  'spielberg': { hard: 'C3', medium: 'C4', soft: 'C5', category: 'Low Degradation / Street', categoryEs: 'Baja Degradación / Urbano' },
  'red bull ring': { hard: 'C3', medium: 'C4', soft: 'C5', category: 'Low Degradation / Street', categoryEs: 'Baja Degradación / Urbano' },
  'austria': { hard: 'C3', medium: 'C4', soft: 'C5', category: 'Low Degradation / Street', categoryEs: 'Baja Degradación / Urbano' },
  'hungaroring': { hard: 'C3', medium: 'C4', soft: 'C5', category: 'Low Degradation / Street', categoryEs: 'Baja Degradación / Urbano' },
  'budapest': { hard: 'C3', medium: 'C4', soft: 'C5', category: 'Low Degradation / Street', categoryEs: 'Baja Degradación / Urbano' },
  'hungary': { hard: 'C3', medium: 'C4', soft: 'C5', category: 'Low Degradation / Street', categoryEs: 'Baja Degradación / Urbano' },
  'monza': { hard: 'C3', medium: 'C4', soft: 'C5', category: 'Low Degradation / Street', categoryEs: 'Baja Degradación / Urbano' },
  'italy': { hard: 'C3', medium: 'C4', soft: 'C5', category: 'Low Degradation / Street', categoryEs: 'Baja Degradación / Urbano' },
  'baku': { hard: 'C3', medium: 'C4', soft: 'C5', category: 'Low Degradation / Street', categoryEs: 'Baja Degradación / Urbano' },
  'azerbaijan': { hard: 'C3', medium: 'C4', soft: 'C5', category: 'Low Degradation / Street', categoryEs: 'Baja Degradación / Urbano' },
  'singapore': { hard: 'C3', medium: 'C4', soft: 'C5', category: 'Low Degradation / Street', categoryEs: 'Baja Degradación / Urbano' },
  'marina bay': { hard: 'C3', medium: 'C4', soft: 'C5', category: 'Low Degradation / Street', categoryEs: 'Baja Degradación / Urbano' },
  'mexico': { hard: 'C3', medium: 'C4', soft: 'C5', category: 'Low Degradation / Street', categoryEs: 'Baja Degradación / Urbano' },
  'hermanos rodriguez': { hard: 'C3', medium: 'C4', soft: 'C5', category: 'Low Degradation / Street', categoryEs: 'Baja Degradación / Urbano' },
  'las vegas': { hard: 'C3', medium: 'C4', soft: 'C5', category: 'Low Degradation / Street', categoryEs: 'Baja Degradación / Urbano' },
  'yas marina': { hard: 'C3', medium: 'C4', soft: 'C5', category: 'Low Degradation / Street', categoryEs: 'Baja Degradación / Urbano' },
  'abu dhabi': { hard: 'C3', medium: 'C4', soft: 'C5', category: 'Low Degradation / Street', categoryEs: 'Baja Degradación / Urbano' },
};

export const DEFAULT_PIRELLI_COMPOUNDS: PirelliCompoundSet = {
  hard: 'C2',
  medium: 'C3',
  soft: 'C4',
  category: 'Balanced',
  categoryEs: 'Equilibrado',
};

export function getPirelliCompounds(circuitName?: string, country?: string, raceName?: string): PirelliCompoundSet {
  const normalize = (s?: string) => (s ? s.toLowerCase().trim() : '');

  const terms = [
    normalize(circuitName),
    normalize(country),
    normalize(raceName),
  ].filter(Boolean);

  for (const term of terms) {
    for (const [key, value] of Object.entries(PIRELLI_CIRCUIT_COMPOUNDS)) {
      if (term.includes(key) || key.includes(term)) {
        return value;
      }
    }
  }

  return DEFAULT_PIRELLI_COMPOUNDS;
}
