// Circuit timezone mappings and utilities for F1, F2 and F3 calendar venues

export interface CircuitTzInfo {
  timeZone: string;
  name: string;
  country: string;
}

export const CIRCUIT_TIMEZONES: Record<string, CircuitTzInfo> = {
  // 2026 Calendar Venues
  baku: { timeZone: 'Asia/Baku', name: 'Baku City Circuit', country: 'Azerbaijan' },
  azerbaijan: { timeZone: 'Asia/Baku', name: 'Baku City Circuit', country: 'Azerbaijan' },
  madrid: { timeZone: 'Europe/Madrid', name: 'Circuito de Madrid IFEMA', country: 'Spain' },
  ifema: { timeZone: 'Europe/Madrid', name: 'Circuito de Madrid IFEMA', country: 'Spain' },
  valdebebas: { timeZone: 'Europe/Madrid', name: 'Circuito de Madrid IFEMA', country: 'Spain' },
  spain: { timeZone: 'Europe/Madrid', name: 'Spain', country: 'Spain' },
  catalunya: { timeZone: 'Europe/Madrid', name: 'Circuit de Barcelona-Catalunya', country: 'Spain' },
  barcelona: { timeZone: 'Europe/Madrid', name: 'Circuit de Barcelona-Catalunya', country: 'Spain' },
  bahrain: { timeZone: 'Asia/Bahrain', name: 'Bahrain International Circuit', country: 'Bahrain' },
  sakhir: { timeZone: 'Asia/Bahrain', name: 'Bahrain International Circuit', country: 'Bahrain' },
  jeddah: { timeZone: 'Asia/Riyadh', name: 'Jeddah Corniche Circuit', country: 'Saudi Arabia' },
  saudi: { timeZone: 'Asia/Riyadh', name: 'Jeddah Corniche Circuit', country: 'Saudi Arabia' },
  melbourne: { timeZone: 'Australia/Melbourne', name: 'Albert Park Circuit', country: 'Australia' },
  albert_park: { timeZone: 'Australia/Melbourne', name: 'Albert Park Circuit', country: 'Australia' },
  australia: { timeZone: 'Australia/Melbourne', name: 'Albert Park Circuit', country: 'Australia' },
  suzuka: { timeZone: 'Asia/Tokyo', name: 'Suzuka International Racing Course', country: 'Japan' },
  japan: { timeZone: 'Asia/Tokyo', name: 'Suzuka International Racing Course', country: 'Japan' },
  shanghai: { timeZone: 'Asia/Shanghai', name: 'Shanghai International Circuit', country: 'China' },
  china: { timeZone: 'Asia/Shanghai', name: 'Shanghai International Circuit', country: 'China' },
  miami: { timeZone: 'America/New_York', name: 'Miami International Autodrome', country: 'USA' },
  imola: { timeZone: 'Europe/Rome', name: 'Autodromo Enzo e Dino Ferrari', country: 'Italy' },
  emilia: { timeZone: 'Europe/Rome', name: 'Autodromo Enzo e Dino Ferrari', country: 'Italy' },
  monaco: { timeZone: 'Europe/Monaco', name: 'Circuit de Monaco', country: 'Monaco' },
  monte_carlo: { timeZone: 'Europe/Monaco', name: 'Circuit de Monaco', country: 'Monaco' },
  montreal: { timeZone: 'America/Toronto', name: 'Circuit Gilles-Villeneuve', country: 'Canada' },
  canada: { timeZone: 'America/Toronto', name: 'Circuit Gilles-Villeneuve', country: 'Canada' },
  villeneuve: { timeZone: 'America/Toronto', name: 'Circuit Gilles-Villeneuve', country: 'Canada' },
  spielberg: { timeZone: 'Europe/Vienna', name: 'Red Bull Ring', country: 'Austria' },
  austria: { timeZone: 'Europe/Vienna', name: 'Red Bull Ring', country: 'Austria' },
  red_bull_ring: { timeZone: 'Europe/Vienna', name: 'Red Bull Ring', country: 'Austria' },
  silverstone: { timeZone: 'Europe/London', name: 'Silverstone Circuit', country: 'Great Britain' },
  britain: { timeZone: 'Europe/London', name: 'Silverstone Circuit', country: 'Great Britain' },
  hungaroring: { timeZone: 'Europe/Budapest', name: 'Hungaroring', country: 'Hungary' },
  hungary: { timeZone: 'Europe/Budapest', name: 'Hungaroring', country: 'Hungary' },
  budapest: { timeZone: 'Europe/Budapest', name: 'Hungaroring', country: 'Hungary' },
  spa: { timeZone: 'Europe/Brussels', name: 'Circuit de Spa-Francorchamps', country: 'Belgium' },
  belgium: { timeZone: 'Europe/Brussels', name: 'Circuit de Spa-Francorchamps', country: 'Belgium' },
  francorchamps: { timeZone: 'Europe/Brussels', name: 'Circuit de Spa-Francorchamps', country: 'Belgium' },
  zandvoort: { timeZone: 'Europe/Amsterdam', name: 'Circuit Zandvoort', country: 'Netherlands' },
  netherlands: { timeZone: 'Europe/Amsterdam', name: 'Circuit Zandvoort', country: 'Netherlands' },
  monza: { timeZone: 'Europe/Rome', name: 'Autodromo Nazionale Monza', country: 'Italy' },
  italy: { timeZone: 'Europe/Rome', name: 'Autodromo Nazionale Monza', country: 'Italy' },
  singapore: { timeZone: 'Asia/Singapore', name: 'Marina Bay Street Circuit', country: 'Singapore' },
  marina_bay: { timeZone: 'Asia/Singapore', name: 'Marina Bay Street Circuit', country: 'Singapore' },
  austin: { timeZone: 'America/Chicago', name: 'Circuit of the Americas', country: 'USA' },
  cota: { timeZone: 'America/Chicago', name: 'Circuit of the Americas', country: 'USA' },
  americas: { timeZone: 'America/Chicago', name: 'Circuit of the Americas', country: 'USA' },
  mexico: { timeZone: 'America/Mexico_City', name: 'Autódromo Hermanos Rodríguez', country: 'Mexico' },
  rodriguez: { timeZone: 'America/Mexico_City', name: 'Autódromo Hermanos Rodríguez', country: 'Mexico' },
  interlagos: { timeZone: 'America/Sao_Paulo', name: 'Autódromo José Carlos Pace', country: 'Brazil' },
  brazil: { timeZone: 'America/Sao_Paulo', name: 'Autódromo José Carlos Pace', country: 'Brazil' },
  sao_paulo: { timeZone: 'America/Sao_Paulo', name: 'Autódromo José Carlos Pace', country: 'Brazil' },
  vegas: { timeZone: 'America/Los_Angeles', name: 'Las Vegas Strip Circuit', country: 'USA' },
  las_vegas: { timeZone: 'America/Los_Angeles', name: 'Las Vegas Strip Circuit', country: 'USA' },
  losail: { timeZone: 'Asia/Qatar', name: 'Lusail International Circuit', country: 'Qatar' },
  qatar: { timeZone: 'Asia/Qatar', name: 'Lusail International Circuit', country: 'Qatar' },
  lusail: { timeZone: 'Asia/Qatar', name: 'Lusail International Circuit', country: 'Qatar' },
  yas_marina: { timeZone: 'Asia/Dubai', name: 'Yas Marina Circuit', country: 'UAE' },
  abu_dhabi: { timeZone: 'Asia/Dubai', name: 'Yas Marina Circuit', country: 'UAE' },
  uae: { timeZone: 'Asia/Dubai', name: 'Yas Marina Circuit', country: 'UAE' },
  sepang: { timeZone: 'Asia/Kuala_Lumpur', name: 'Sepang International Circuit', country: 'Malaysia' },
  malaysia: { timeZone: 'Asia/Kuala_Lumpur', name: 'Sepang International Circuit', country: 'Malaysia' },
};

/**
 * Resolves the IANA timezone for a given circuit, locality, or country string.
 * Defaults to 'Europe/Madrid' if unresolvable.
 */
export function getCircuitTimezone(circuit?: string, locality?: string, country?: string): string {
  const terms = [circuit, locality, country]
    .filter(Boolean)
    .map((t) =>
      t!
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .replace(/[\s-]+/g, '_'),
    );

  for (const term of terms) {
    for (const [key, info] of Object.entries(CIRCUIT_TIMEZONES)) {
      if (term.includes(key) || key.includes(term)) {
        return info.timeZone;
      }
    }
  }

  return 'Europe/Madrid';
}

/**
 * Returns current time formatted as "HH:MM" in the specified timezone (or local browser time).
 */
export function getCurrentClock(timeZone?: string): string {
  try {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };
    if (timeZone) {
      options.timeZone = timeZone;
    }
    return new Intl.DateTimeFormat('en-GB', options).format(now);
  } catch {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }
}

/**
 * Formats an ISO session date/time to "HH:MM" in the chosen timezone (or user local).
 */
export function formatSessionTimeToZone(
  isoDateStr: string,
  timeZone?: string,
): string | null {
  if (!isoDateStr || !isoDateStr.includes('T')) return null;
  if (isoDateStr.includes('T00:00:00')) return null;

  try {
    const d = new Date(isoDateStr);
    if (Number.isNaN(d.getTime())) return null;
    if (d.getUTCHours() === 0 && d.getUTCMinutes() === 0) return null;

    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };
    if (timeZone) {
      options.timeZone = timeZone;
    }
    return new Intl.DateTimeFormat('en-GB', options).format(d);
  } catch {
    return null;
  }
}

/**
 * Formats an ISO session date string to a localized date (e.g. "vie., 18 sept.") in the chosen timezone.
 */
export function formatSessionDateToZone(
  isoDateStr: string,
  timeZone?: string,
  lang: 'es' | 'en' = 'es',
): string {
  if (!isoDateStr) return lang === 'es' ? 'A confirmar' : 'TBC';
  try {
    const d = new Date(isoDateStr);
    if (Number.isNaN(d.getTime())) return isoDateStr.split('T')[0] || (lang === 'es' ? 'A confirmar' : 'TBC');

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
    };
    if (timeZone) {
      options.timeZone = timeZone;
    }
    return new Intl.DateTimeFormat(lang === 'es' ? 'es-ES' : 'en-US', options).format(d);
  } catch {
    return isoDateStr.split('T')[0] || (lang === 'es' ? 'A confirmar' : 'TBC');
  }
}
