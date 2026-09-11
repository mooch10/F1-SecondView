import type { DriverLive } from '../types/f1';

export function formatMessageTime(timeStr?: string): string {
  if (!timeStr) return '--:--:--';

  const trimmed = timeStr.trim();

  // If already in HH:MM:SS or HH:MM format (e.g. "16:13:07" or "16:13")
  if (/^\d{2}:\d{2}(:\d{2})?$/.test(trimmed)) {
    return trimmed;
  }

  // If it is a full ISO date string or timestamp
  const date = new Date(trimmed);
  if (!Number.isNaN(date.getTime())) {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  }

  // Fallback: extract time substring if present (e.g. "2024-09-01T16:13:07")
  const match = trimmed.match(/(\d{2}:\d{2}(:\d{2})?)/);
  if (match) {
    return match[1];
  }

  return trimmed;
}

export const DRIVER_SURNAMES_BY_NUMBER: Record<number, string> = {
  1: 'Verstappen',
  2: 'Sargeant',
  3: 'Ricciardo',
  4: 'Norris',
  5: 'Bortoleto',
  6: 'Hadjar',
  7: 'Doohan',
  10: 'Gasly',
  11: 'Pérez',
  12: 'Antonelli',
  14: 'Alonso',
  16: 'Leclerc',
  18: 'Stroll',
  20: 'Magnussen',
  21: 'De Vries',
  22: 'Tsunoda',
  23: 'Albon',
  24: 'Zhou',
  27: 'Hülkenberg',
  30: 'Lawson',
  31: 'Ocon',
  40: 'Lawson',
  43: 'Colapinto',
  44: 'Hamilton',
  55: 'Sainz',
  63: 'Russell',
  77: 'Bottas',
  81: 'Piastri',
  87: 'Bearman',
};

export const DRIVER_SURNAMES_BY_CODE: Record<string, string> = {
  VER: 'Verstappen',
  SAR: 'Sargeant',
  RIC: 'Ricciardo',
  NOR: 'Norris',
  BOR: 'Bortoleto',
  HAD: 'Hadjar',
  DOO: 'Doohan',
  GAS: 'Gasly',
  PER: 'Pérez',
  ANT: 'Antonelli',
  ALO: 'Alonso',
  LEC: 'Leclerc',
  STR: 'Stroll',
  MAG: 'Magnussen',
  DEV: 'De Vries',
  TSU: 'Tsunoda',
  ALB: 'Albon',
  ZHO: 'Zhou',
  HUL: 'Hülkenberg',
  LAW: 'Lawson',
  OCO: 'Ocon',
  COL: 'Colapinto',
  HAM: 'Hamilton',
  SAI: 'Sainz',
  RUS: 'Russell',
  BOT: 'Bottas',
  PIA: 'Piastri',
  BEA: 'Bearman',
};

export function extractSurname(fullName?: string): string {
  if (!fullName) return '';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) return parts[0] || '';
  if (parts.length >= 3 && parts[parts.length - 2].toLowerCase() === 'de') {
    return `${parts[parts.length - 2]} ${parts[parts.length - 1]}`;
  }
  return parts[parts.length - 1];
}

export function resolveDriverSurname(
  carNum?: string | number | null,
  code?: string | null,
  drivers?: DriverLive[]
): string {
  const num = carNum !== undefined && carNum !== null && carNum !== '' ? Number(carNum) : null;
  const cleanCode = code ? code.trim().toUpperCase() : null;

  if (drivers && drivers.length > 0) {
    if (num && !isNaN(num)) {
      const match = drivers.find((d) => d.driverNumber === num);
      if (match) {
        return extractSurname(match.fullName) || match.code;
      }
    }
    if (cleanCode) {
      const match = drivers.find((d) => d.code.toUpperCase() === cleanCode);
      if (match) {
        return extractSurname(match.fullName) || match.code;
      }
    }
  }

  if (cleanCode && DRIVER_SURNAMES_BY_CODE[cleanCode]) {
    return DRIVER_SURNAMES_BY_CODE[cleanCode];
  }
  if (num && DRIVER_SURNAMES_BY_NUMBER[num]) {
    return DRIVER_SURNAMES_BY_NUMBER[num];
  }

  if (cleanCode) return cleanCode;
  if (num && !isNaN(num)) return `Auto #${num}`;
  return 'Auto';
}

function replaceCarsWithSurnames(rawCarList: string, drivers?: DriverLive[], lang: 'es' | 'en' = 'es'): string {
  let result = rawCarList;
  result = result.replace(/(?:CAR\s*)?(\d+)\s*\(([A-Z]+)\)/gi, (_, num, code) => {
    return resolveDriverSurname(num, code, drivers);
  });
  result = result.replace(/\b(?:CAR|CARS)\s+(\d+)\b/gi, (_, num) => {
    return resolveDriverSurname(num, null, drivers);
  });
  result = result.replace(/\b(\d{1,2})\b/g, (match) => {
    const num = Number(match);
    if (DRIVER_SURNAMES_BY_NUMBER[num]) {
      return resolveDriverSurname(num, null, drivers);
    }
    return match;
  });
  if (lang === 'es') {
    result = result.replace(/\bAND\b/gi, 'y');
  }
  return result.trim();
}

function translateInfraction(raw: string): string {
  let text = raw.trim();
  text = text.replace(/TRACK LIMITS/gi, 'límites de pista');
  text = text.replace(/FALSE START/gi, 'largada en falso');
  text = text.replace(/CAUSING A COLLISION/gi, 'provocar colisión');
  text = text.replace(/LEAVING THE TRACK AND GAINING AN ADVANTAGE/gi, 'ganar ventaja fuera de pista');
  text = text.replace(/SPEEDING IN THE PIT LANE/gi, 'exceso de velocidad en pit lane');
  text = text.replace(/UNSAFE RELEASE/gi, 'salida peligrosa de boxes');
  text = text.replace(/IMPEDING/gi, 'bloquear a otro piloto');
  return text;
}

export function translateFIAMessage(raw?: string, drivers?: DriverLive[], lang: 'es' | 'en' = 'es'): string {
  if (!raw) return '';
  let text = raw.trim();

  if (lang === 'en') {
    text = text.replace(
      /WAVED BLUE FLAG FOR CAR (\d+)(?:\s*\(([A-Z]+)\))?(?: TIMED AT .*)?/gi,
      (_, num, code) => `Waved blue flag for ${resolveDriverSurname(num, code, drivers)}`
    );
    text = text.replace(
      /BLUE FLAG FOR CAR (\d+)(?:\s*\(([A-Z]+)\))?/gi,
      (_, num, code) => `Blue flag for ${resolveDriverSurname(num, code, drivers)}`
    );
    text = text.replace(
      /(?:FIA STEWARDS:\s*)?CAR (\d+)(?:\s*\(([A-Z]+)\))?\s*-\s*(\d+)\s*SECOND TIME PENALTY FOR (.*)/gi,
      (_, num, code, sec, reason) =>
        `${sec}s time penalty for ${resolveDriverSurname(num, code, drivers)} (${reason.trim()})`
    );
    text = text.replace(
      /(?:FIA STEWARDS:\s*)?(\d+)\s*SECOND TIME PENALTY FOR CAR (\d+)(?:\s*\(([A-Z]+)\))?(?:\s*-\s*(.*))?/gi,
      (_, sec, num, code, reason) =>
        `${sec}s time penalty for ${resolveDriverSurname(num, code, drivers)}${reason ? ` (${reason.trim()})` : ''}`
    );
    text = text.replace(
      /CAR (\d+)(?:\s*\(([A-Z]+)\))?\s*-\s*DRIVE THROUGH PENALTY/gi,
      (_, num, code) => `Drive-through penalty for ${resolveDriverSurname(num, code, drivers)}`
    );
    text = text.replace(
      /(?:TURN\s*(\d+)\s*)?INCIDENT INVOLVING CARS?\s*(.*?)\s*UNDER INVESTIGATION/gi,
      (_, turn, cars) =>
        `Incident${turn ? ` in Turn ${turn}` : ''} involving ${replaceCarsWithSurnames(cars, drivers, 'en')} under investigation`
    );
    text = text.replace(
      /(?:TURN\s*(\d+)\s*)?INCIDENT INVOLVING CARS?\s*(.*?)\s*-\s*NOTED/gi,
      (_, turn, cars) =>
        `Incident${turn ? ` in Turn ${turn}` : ''} involving ${replaceCarsWithSurnames(cars, drivers, 'en')} noted`
    );
    text = text.replace(
      /INCIDENT INVOLVING CARS?\s*(.*?)\s*-\s*NO FURTHER INVESTIGATION/gi,
      (_, cars) => `No further investigation for ${replaceCarsWithSurnames(cars, drivers, 'en')}`
    );
    text = text.replace(
      /NO FURTHER ACTION FOR CARS?\s*(.*)/gi,
      (_, cars) => `No further action for ${replaceCarsWithSurnames(cars, drivers, 'en')}`
    );
    text = text.replace(
      /CAR (\d+)(?:\s*\(([A-Z]+)\))?\s+STOPPED IN PIT\s*-\s*RETIRED/gi,
      (_, num, code) => `${resolveDriverSurname(num, code, drivers)} stopped in pit - Retired`
    );
    text = text.replace(
      /CAR (\d+)(?:\s*\(([A-Z]+)\))?\s+STOPPED ON TRACK(?: IN SECTOR (\d+))?/gi,
      (_, num, code, sector) =>
        `${resolveDriverSurname(num, code, drivers)} stopped on track${sector ? ` in Sector ${sector}` : ''}`
    );
    text = text.replace(
      /CAR (\d+)(?:\s*\(([A-Z]+)\))?\s+LAP TIME (.*?) DELETED\s*-\s*(.*)/gi,
      (_, num, code, lapTime, reason) =>
        `Lap time deleted (${lapTime}) for ${resolveDriverSurname(num, code, drivers)} - ${reason.trim()}`
    );
    text = text.replace(
      /CAR (\d+)(?:\s*\(([A-Z]+)\))?\s*-\s*(.*)/gi,
      (_, num, code, rest) => `${resolveDriverSurname(num, code, drivers)} - ${rest.trim()}`
    );
    return text;
  }

  // 1. Blue Flags (Banderas azules) -> Usar Apellido del corredor
  text = text.replace(
    /WAVED BLUE FLAG FOR CAR (\d+)(?:\s*\(([A-Z]+)\))?(?: TIMED AT .*)?/gi,
    (_, num, code) => `Bandera azul para ${resolveDriverSurname(num, code, drivers)}`
  );
  text = text.replace(
    /BLUE FLAG FOR CAR (\d+)(?:\s*\(([A-Z]+)\))?/gi,
    (_, num, code) => `Bandera azul para ${resolveDriverSurname(num, code, drivers)}`
  );
  text = text.replace(
    /Bandera azul para auto\s*(\d+)(?:\s*\(([A-Z]+)\))?/gi,
    (_, num, code) => `Bandera azul para ${resolveDriverSurname(num, code, drivers)}`
  );

  // 2. Yellow / Double Yellow / Green / Red / Chequered Flags & Sessions
  text = text.replace(/^SESSION FINISHED$/i, 'Sesión finalizada');
  text = text.replace(/^SESSION RESUMED$/i, 'Sesión reanudada');
  text = text.replace(/^SESSION SUSPENDED$/i, 'Sesión suspendida (Bandera roja)');
  text = text.replace(/^SESSION WILL NOT BE RESUMED$/i, 'La sesión no será reanudada');
  text = text.replace(/^CHEQUERED FLAG$/i, 'Bandera a cuadros (Fin de sesión)');
  text = text.replace(/^GREEN FLAG$/i, 'Bandera verde (Pista habilitada)');
  text = text.replace(/^TRACK CLEAR$/i, 'Pista libre / Bandera verde');
  text = text.replace(/^RED FLAG$/i, 'Bandera roja (Sesión detenida)');
  text = text.replace(
    /DOUBLE YELLOW FLAG IN TRACK SECTOR (\d+)/i,
    'Doble bandera amarilla en Sector $1'
  );
  text = text.replace(
    /YELLOW FLAG IN TRACK SECTOR (\d+)/i,
    'Bandera amarilla en Sector $1'
  );
  text = text.replace(
    /CLEAR IN TRACK SECTOR (\d+)/i,
    'Sector $1 despejado'
  );

  // 3. Safety Car & VSC
  text = text.replace(/^SAFETY CAR DEPLOYED$/i, 'Auto de Seguridad (Safety Car) en pista');
  text = text.replace(/^VIRTUAL SAFETY CAR DEPLOYED$/i, 'Auto de Seguridad Virtual (VSC) desplegado');
  text = text.replace(/^VIRTUAL SAFETY CAR ENDING$/i, 'Finalizando Auto de Seguridad Virtual (VSC)');
  text = text.replace(/^SAFETY CAR IN THIS LAP$/i, 'Safety Car entra a boxes en esta vuelta');
  text = text.replace(/^SAFETY CAR PERIOD ENDING$/i, 'Auto de Seguridad se retira en esta vuelta');
  text = text.replace(
    /^LAPPED CARS MAY NOW OVERTAKE THE SAFETY CAR$/i,
    'Autos rezagados pueden adelantar al Safety Car'
  );

  // 4. DRS & Pit Lane
  text = text.replace(/^DRS ENABLED IN ALL DETECTION ZONES$/i, 'DRS habilitado en todas las zonas');
  text = text.replace(/^DRS ENABLED$/i, 'DRS habilitado');
  text = text.replace(/^DRS DISABLED$/i, 'DRS deshabilitado');
  text = text.replace(/^GREEN LIGHT - PIT EXIT OPEN$/i, 'Luz verde - Salida de boxes abierta');
  text = text.replace(/^PIT EXIT OPEN$/i, 'Salida de boxes abierta');
  text = text.replace(/^PIT EXIT CLOSED$/i, 'Salida de boxes cerrada');
  text = text.replace(/^PIT ENTRY OPEN$/i, 'Entrada a boxes abierta');
  text = text.replace(/^PIT ENTRY CLOSED$/i, 'Entrada a boxes cerrada');
  text = text.replace(/^PIT LANE OPEN$/i, 'Pit lane abierto');
  text = text.replace(/^PIT LANE CLOSED$/i, 'Pit lane cerrado');

  // 5. Investigations & Penalties -> Usar Apellidos
  text = text.replace(
    /(?:FIA STEWARDS:\s*)?CAR (\d+)(?:\s*\(([A-Z]+)\))?\s*-\s*(\d+)\s*SECOND TIME PENALTY FOR (.*)/gi,
    (_, num, code, sec, reason) => {
      const driver = resolveDriverSurname(num, code, drivers);
      return `Penalización de ${sec}s para ${driver} por ${translateInfraction(reason)}`;
    }
  );
  text = text.replace(
    /(?:FIA STEWARDS:\s*)?(\d+)\s*SECOND TIME PENALTY FOR CAR (\d+)(?:\s*\(([A-Z]+)\))?(?:\s*-\s*(.*))?/gi,
    (_, sec, num, code, reason) => {
      const driver = resolveDriverSurname(num, code, drivers);
      const r = reason ? ` por ${translateInfraction(reason)}` : '';
      return `Penalización de ${sec}s para ${driver}${r}`;
    }
  );
  text = text.replace(
    /CAR (\d+)(?:\s*\(([A-Z]+)\))?\s*-\s*DRIVE THROUGH PENALTY/gi,
    (_, num, code) => `Penalización de Drive-Through para ${resolveDriverSurname(num, code, drivers)}`
  );
  text = text.replace(
    /(?:TURN\s*(\d+)\s*)?INCIDENT INVOLVING CARS?\s*(.*?)\s*UNDER INVESTIGATION/gi,
    (_, turn, cars) => {
      const translatedCars = replaceCarsWithSurnames(cars, drivers);
      const t = turn ? ` en curva ${turn}` : '';
      return `Incidente${t} de ${translatedCars} bajo investigación`;
    }
  );
  text = text.replace(
    /(?:TURN\s*(\d+)\s*)?INCIDENT INVOLVING CARS?\s*(.*?)\s*-\s*NOTED/gi,
    (_, turn, cars) => {
      const translatedCars = replaceCarsWithSurnames(cars, drivers);
      const t = turn ? ` en curva ${turn}` : '';
      return `Incidente${t} de ${translatedCars} anotado`;
    }
  );
  text = text.replace(
    /INCIDENT INVOLVING CARS?\s*(.*?)\s*-\s*NO FURTHER INVESTIGATION/gi,
    (_, cars) => `Sin investigación para ${replaceCarsWithSurnames(cars, drivers)}`
  );
  text = text.replace(
    /NO FURTHER ACTION FOR CARS?\s*(.*)/gi,
    (_, cars) => `Sin sanción para ${replaceCarsWithSurnames(cars, drivers)}`
  );

  // 6. Driver Actions & Incidents on Track
  text = text.replace(
    /CAR (\d+)(?:\s*\(([A-Z]+)\))?\s+STOPPED IN PIT\s*-\s*RETIRED/gi,
    (_, num, code) => `${resolveDriverSurname(num, code, drivers)} detenido en boxes - Abandono`
  );
  text = text.replace(
    /CAR (\d+)(?:\s*\(([A-Z]+)\))?\s+STOPPED ON TRACK(?: IN SECTOR (\d+))?/gi,
    (_, num, code, sector) => {
      const driver = resolveDriverSurname(num, code, drivers);
      return sector
        ? `${driver} detenido en pista en Sector ${sector}`
        : `${driver} detenido en pista`;
    }
  );
  text = text.replace(
    /CAR (\d+)(?:\s*\(([A-Z]+)\))?\s+TAKES LEAD OF THE RACE/gi,
    (_, num, code) => `${resolveDriverSurname(num, code, drivers)} toma la punta de la carrera`
  );
  text = text.replace(
    /CHEQUERED FLAG\s*-\s*CAR (\d+)(?:\s*\(([A-Z]+)\))?\s+WINS (.*)/gi,
    (_, num, code, race) => {
      const driver = resolveDriverSurname(num, code, drivers);
      return `Bandera a cuadros - ¡${driver} gana la carrera (${race.trim()})!`;
    }
  );
  text = text.replace(
    /BLACK AND WHITE FLAG FOR CAR (\d+)(?:\s*\(([A-Z]+)\))?(?:\s*-\s*(.*))?/gi,
    (_, num, code, reason) => {
      const driver = resolveDriverSurname(num, code, drivers);
      const r = reason ? ` por ${translateInfraction(reason)}` : '';
      return `Bandera de advertencia para ${driver}${r}`;
    }
  );
  text = text.replace(
    /CAR (\d+)(?:\s*\(([A-Z]+)\))?\s+LAP TIME (.*?) DELETED\s*-\s*(.*)/gi,
    (_, num, code, lapTime, reason) => {
      const driver = resolveDriverSurname(num, code, drivers);
      return `Vuelta eliminada (${lapTime}) para ${driver} por ${translateInfraction(reason)}`;
    }
  );
  text = text.replace(
    /CAR (\d+)(?:\s*\(([A-Z]+)\))?\s*-\s*(.*)/gi,
    (_, num, code, rest) => {
      const driver = resolveDriverSurname(num, code, drivers);
      return `${driver} - ${translateInfraction(rest)}`;
    }
  );

  return text;
}

export function getFlagBadgeConfig(
  flag?: string | null,
  lang: 'es' | 'en' = 'es'
): { text: string; badgeClass: string } | null {
  if (!flag) return null;
  const f = flag.toUpperCase().trim();

  switch (f) {
    case 'BLUE':
      return {
        text: lang === 'es' ? 'AZUL' : 'BLUE',
        badgeClass: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
      };
    case 'YELLOW':
      return {
        text: lang === 'es' ? 'AMARILLA' : 'YELLOW',
        badgeClass: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
      };
    case 'DOUBLE YELLOW':
      return {
        text: lang === 'es' ? 'DOBLE AMARILLA' : 'DBL YELLOW',
        badgeClass: 'bg-amber-500/30 text-amber-200 border border-amber-500/50',
      };
    case 'GREEN':
      return {
        text: lang === 'es' ? 'VERDE' : 'GREEN',
        badgeClass: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
      };
    case 'RED':
      return {
        text: lang === 'es' ? 'ROJA' : 'RED',
        badgeClass: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
      };
    case 'CHEQUERED':
      return {
        text: lang === 'es' ? 'CUADROS' : 'CHEQUERED',
        badgeClass: 'bg-white/10 text-white border border-white/20',
      };
    case 'BLACK AND WHITE':
      return {
        text: lang === 'es' ? 'ADVERTENCIA' : 'WARNING',
        badgeClass: 'bg-zinc-800 text-zinc-200 border border-zinc-600',
      };
    default:
      return {
        text: f,
        badgeClass: 'bg-zinc-800 text-zinc-300 border border-zinc-700',
      };
  }
}
