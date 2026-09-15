import type { DriverLive } from '../types/f1';
import { translateSessionName } from './sessionTranslation';

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

const DRIVER_SURNAMES_BY_NUMBER: Record<number, string> = {
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

const DRIVER_SURNAMES_BY_CODE: Record<string, string> = {
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

function extractSurname(fullName?: string): string {
  if (!fullName) return '';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) return parts[0] || '';
  if (parts.length >= 3 && parts[parts.length - 2].toLowerCase() === 'de') {
    return `${parts[parts.length - 2]} ${parts[parts.length - 1]}`;
  }
  return parts[parts.length - 1];
}

function resolveDriverSurname(
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
  text = text.replace(/TRACK LIMITS AT TURN (\d+)/gi, 'límites de pista en curva $1');
  text = text.replace(/TRACK LIMITS/gi, 'límites de pista');
  text = text.replace(/FALSE START/gi, 'largada en falso');
  text = text.replace(/CAUSING A COLLISION/gi, 'provocar una colisión');
  text = text.replace(/LEAVING THE TRACK AND GAINING AN ADVANTAGE/gi, 'ganar ventaja fuera de pista');
  text = text.replace(/SPEEDING IN THE PIT LANE/gi, 'exceso de velocidad en pit lane');
  text = text.replace(/SPEEDING UNDER YELLOW FLAGS/gi, 'exceso de velocidad con banderas amarillas');
  text = text.replace(/SPEEDING UNDER VSC/gi, 'exceso de velocidad bajo VSC');
  text = text.replace(/UNSAFE RELEASE/gi, 'salida peligrosa de boxes');
  text = text.replace(/UNSAFE REJOIN/gi, 'reincorporación peligrosa a pista');
  text = text.replace(/IMPEDING/gi, 'bloquear a otro piloto');
  text = text.replace(/CROSSING WHITE LINE AT PIT EXIT/gi, 'cruzar la línea blanca en salida de boxes');
  text = text.replace(/CROSSING WHITE LINE AT PIT ENTRY/gi, 'cruzar la línea blanca en entrada a boxes');
  text = text.replace(/(?:FAILURE|FAILING) TO FOLLOW RACE DIRECTOR INSTRUCTIONS/gi, 'no acatar instrucciones de dirección de carrera');
  text = text.replace(/FAILING TO RESPECT YELLOW FLAGS/gi, 'no respetar banderas amarillas');
  text = text.replace(/FAILING TO RESPECT RED FLAGS/gi, 'no respetar bandera roja');
  text = text.replace(/OVERTAKING UNDER SAFETY CAR/gi, 'adelantar bajo Auto de Seguridad');
  text = text.replace(/OVERTAKING UNDER VSC/gi, 'adelantar bajo VSC');
  text = text.replace(/OVERTAKING UNDER YELLOW FLAGS/gi, 'adelantar con bandera amarilla');
  text = text.replace(/DELTA TIME VIOLATION/gi, 'infracción de tiempo delta');
  text = text.replace(/FAILING TO STAY ABOVE DELTA TIME/gi, 'no respetar delta de tiempo reglamentario');
  text = text.replace(/TIME PENALTY SERVED/gi, 'penalización cumplida');
  text = text.replace(/OFF TRACK AND CONTINUED/gi, 'fuera de pista y continuó');
  text = text.replace(/SPUN OFF TRACK/gi, 'trompo y salida de pista');
  text = text.replace(/MISSED APEX/gi, 'perdió el ápice');
  text = text.replace(/UNDER INVESTIGATION FOR (.*)/gi, 'bajo investigación por $1');
  return text;
}

export function translateFIAMessage(raw?: string, drivers?: DriverLive[], lang: 'es' | 'en' = 'es'): string {
  if (!raw) return '';
  let text = raw.trim();

  if (lang === 'en') {
    // 1. Blue flags
    text = text.replace(
      /WAVED BLUE FLAG FOR CAR (\d+)(?:\s*\(([A-Z]+)\))?(?: TIMED AT .*)?/gi,
      (_, num, code) => `Waved blue flag for ${resolveDriverSurname(num, code, drivers)}`
    );
    text = text.replace(
      /BLUE FLAG FOR CAR (\d+)(?:\s*\(([A-Z]+)\))?/gi,
      (_, num, code) => `Blue flag for ${resolveDriverSurname(num, code, drivers)}`
    );

    // 2. Direct Driver Investigations & Penalties
    text = text.replace(
      /(?:FIA STEWARDS:\s*)?CAR (\d+)(?:\s*\(([A-Z]+)\))?\s*(?:-\s*)?UNDER INVESTIGATION FOR (.*)/gi,
      (_, num, code, reason) =>
        `${resolveDriverSurname(num, code, drivers)} under investigation for ${reason.trim()}`
    );
    text = text.replace(
      /(?:FIA STEWARDS:\s*)?CAR (\d+)(?:\s*\(([A-Z]+)\))?\s*(?:-\s*)?TIME PENALTY SERVED/gi,
      (_, num, code) => `${resolveDriverSurname(num, code, drivers)} - Time penalty served`
    );
    text = text.replace(
      /(?:FIA STEWARDS:\s*)?CAR (\d+)(?:\s*\(([A-Z]+)\))?\s*(?:-\s*)?INVESTIGATION NOTED(?:\s*-\s*(.*))?/gi,
      (_, num, code, reason) =>
        `Investigation on ${resolveDriverSurname(num, code, drivers)} noted${reason ? ` (${reason.trim()})` : ''}`
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

    // 3. Track conditions, hazards, weather
    text = text.replace(
      /(?:REPORTED\s+)?DEBRIS(?: REPORTED)?(?: IN TURN (\d+)| IN SECTOR (\d+))?/gi,
      (_, turn, sector) => `Debris on track${turn ? ` in Turn ${turn}` : sector ? ` in Sector ${sector}` : ''}`
    );
    text = text.replace(
      /(?:REPORTED\s+)?HAZARD(?: REPORTED)?(?: IN TURN (\d+)| IN SECTOR (\d+))?/gi,
      (_, turn, sector) => `Hazard on track${turn ? ` in Turn ${turn}` : sector ? ` in Sector ${sector}` : ''}`
    );
    text = text.replace(
      /OIL(?: REPORTED)?(?: ON TRACK)?(?: IN TURN (\d+)| IN SECTOR (\d+))?/gi,
      (_, turn, sector) => `Oil on track${turn ? ` in Turn ${turn}` : sector ? ` in Sector ${sector}` : ''}`
    );
    text = text.replace(
      /(?:TRACK SURFACE SLIPPERY|SLIPPERY TRACK)(?: IN TURN (\d+)| IN SECTOR (\d+))?/gi,
      (_, turn, sector) => `Slippery track${turn ? ` in Turn ${turn}` : sector ? ` in Sector ${sector}` : ''}`
    );
    text = text.replace(/LOW GRIP CONDITIONS/gi, 'Low grip conditions');
    text = text.replace(/WET TRACK/gi, 'Wet track');
    text = text.replace(/RAIN EXPECTED IN (\d+) MINUTES/gi, 'Rain expected in $1 minutes');

    // 4. Session phases & restarters
    text = text.replace(/SAFETY CAR DEPLOYED/gi, 'Safety Car deployed');
    text = text.replace(/VIRTUAL SAFETY CAR DEPLOYED/gi, 'Virtual Safety Car deployed');
    text = text.replace(/VIRTUAL SAFETY CAR ENDING/gi, 'Virtual Safety Car ending');
    text = text.replace(/SAFETY CAR IN THIS LAP/gi, 'Safety Car in this lap');
    text = text.replace(/SAFETY CAR PERIOD ENDING/gi, 'Safety Car period ending');
    text = text.replace(
      /LAPPED CARS MAY NOW OVERTAKE(?: THE SAFETY CAR)?/gi,
      'Lapped cars may now overtake Safety Car'
    );
    text = text.replace(/STANDING START/gi, 'Standing start');
    text = text.replace(/ROLLING START/gi, 'Rolling start');
    text = text.replace(/FORMATION LAP(?: STARTED)?/gi, 'Formation lap started');
    text = text.replace(/RECOVERY VEHICLE ON TRACK/gi, 'Recovery vehicle on track');
    text = text.replace(/MEDICAL CAR DEPLOYED/gi, 'Medical Car deployed');
    text = text.replace(/RACE WILL RESUME AT (\d{1,2}:\d{2})/gi, 'Race will resume at $1');
    text = text.replace(/RACE WILL START AT (\d{1,2}:\d{2})/gi, 'Race will start at $1');
    text = text.replace(/ESTIMATED (?:RACE )?RESTART IN (\d+) MINUTES/gi, 'Estimated restart in $1 minutes');

    // 5. Driver incidents on track
    text = text.replace(
      /CAR (\d+)(?:\s*\(([A-Z]+)\))?\s+STOPPED IN PIT\s*-\s*RETIRED/gi,
      (_, num, code) => `${resolveDriverSurname(num, code, drivers)} stopped in pit - Retired`
    );
    text = text.replace(
      /CAR (\d+)(?:\s*\(([A-Z]+)\))?\s+STOPPED AT PIT EXIT/gi,
      (_, num, code) => `${resolveDriverSurname(num, code, drivers)} stopped at pit exit`
    );
    text = text.replace(
      /CAR (\d+)(?:\s*\(([A-Z]+)\))?\s+STOPPED ON TRACK(?: IN SECTOR (\d+))?/gi,
      (_, num, code, sector) =>
        `${resolveDriverSurname(num, code, drivers)} stopped on track${sector ? ` in Sector ${sector}` : ''}`
    );
    text = text.replace(
      /CAR (\d+)(?:\s*\(([A-Z]+)\))?\s+OFF TRACK AND CONTINUED(?: AT TURN (\d+))?/gi,
      (_, num, code, turn) =>
        `${resolveDriverSurname(num, code, drivers)} off track${turn ? ` at Turn ${turn}` : ''} and continued`
    );
    text = text.replace(
      /CAR (\d+)(?:\s*\(([A-Z]+)\))?\s+(?:LAP\s+)?TIME (.*?) DELETED\s*-\s*(.*)/gi,
      (_, num, code, lapTime, reason) =>
        `Lap time deleted (${lapTime}) for ${resolveDriverSurname(num, code, drivers)} - ${reason.trim()}`
    );
    text = text.replace(
      /CAR (\d+)(?:\s*\(([A-Z]+)\))?\s*-\s*(.*)/gi,
      (_, num, code, rest) => `${resolveDriverSurname(num, code, drivers)} - ${rest.trim()}`
    );

    // 6. Flags & Pit
    text = text.replace(
      /(DOUBLE\s+)?YELLOW FLAG IN (?:TRACK\s+)?SECTOR (\d+)/gi,
      (_, dbl, sector) => `${dbl ? 'Double yellow' : 'Yellow'} flag in Sector ${sector}`
    );
    text = text.replace(/CLEAR IN (?:TRACK\s+)?SECTOR (\d+)/gi, (_, sector) => `Sector ${sector} clear`);
    text = text.replace(/(?:DRS|OVERTAKE|MOM) ENABLED(?: IN ALL DETECTION ZONES)?/gi, 'Overtake mode (MOM) enabled');
    text = text.replace(/(?:DRS|OVERTAKE|MOM) DISABLED/gi, 'Overtake mode (MOM) disabled');
    text = text.replace(/GREEN LIGHT\s*-\s*PIT EXIT OPEN/gi, 'Green light - Pit exit open');
    text = text.replace(/PIT EXIT OPEN/gi, 'Pit exit open');
    text = text.replace(/PIT EXIT CLOSED/gi, 'Pit exit closed');
    text = text.replace(/PIT ENTRY OPEN/gi, 'Pit entry open');
    text = text.replace(/PIT ENTRY CLOSED/gi, 'Pit entry closed');
    text = text.replace(/PIT LANE OPEN/gi, 'Pit lane open');
    text = text.replace(/PIT LANE CLOSED/gi, 'Pit lane closed');

    // 7. Simulation messages translation
    text = text.replace(
      /GRILLA DE SALIDA OFICIAL • (.*)/gi,
      (_, session) => `OFFICIAL STARTING GRID • ${translateSessionName(session, 'en').toUpperCase()}`
    );
    text = text.replace(
      /ACTIVIDAD EN PISTA PROGRAMADA PARA LAS (\d{1,2}:\d{2}) HS \(HORA ARGENTINA\)/gi,
      (_, time) => `ON-TRACK ACTIVITY SCHEDULED FOR ${time} (ARGENTINA TIME)`
    );
    text = text.replace(
      /BANDERA A CUADROS • CARRERA FINALIZADA \((.*?)\)/gi,
      (_, loc) => `CHEQUERED FLAG • RACE FINISHED (${loc})`
    );
    text = text.replace(
      /GANADOR OFICIAL: AUTO (\d+)(?:\s*\(([A-Z]+)\))?/gi,
      (_, num, code) => `OFFICIAL WINNER: ${resolveDriverSurname(num, code, drivers).toUpperCase()}`
    );
    text = text.replace(
      /INICIO DE SESIÓN - SEMÁFORO EN VERDE EN PIT EXIT \((.*?)\)/gi,
      (_, loc) => `SESSION START - GREEN LIGHT AT PIT EXIT (${loc})`
    );
    text = text.replace(
      /PISTA LIBRE - SECTOR (\d+) \((.*?)\)/gi,
      (_, sector, loc) => `TRACK CLEAR - SECTOR ${sector} (${loc})`
    );
    text = text.replace(
      /AUTO (\d+)\s*\((.*?)\)\s*-\s*TIEMPO VÁLIDO EN EL TOP 10/gi,
      (_, num, code) => `${resolveDriverSurname(num, code, drivers).toUpperCase()} - VALID TIME IN TOP 10`
    );
    text = text.replace(
      /BANDERA VERDE - REINICIO DE ACTIVIDAD EN PISTA \((.*?)\)/gi,
      (_, loc) => `GREEN FLAG - TRACK ACTIVITY RESUMED (${loc})`
    );
    text = text.replace(
      /BANDERA ROJA - SESIÓN DETENIDA \((.*?)\)/gi,
      (_, loc) => `RED FLAG - SESSION SUSPENDED (${loc})`
    );

    return text;
  }

  // === SPANISH TRANSLATIONS (lang === 'es') ===

  // 1. Blue flags
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

  // 2. Direct Driver Investigations & Penalties
  text = text.replace(
    /(?:FIA STEWARDS:\s*)?CAR (\d+)(?:\s*\(([A-Z]+)\))?\s*(?:-\s*)?UNDER INVESTIGATION FOR (.*)/gi,
    (_, num, code, reason) =>
      `${resolveDriverSurname(num, code, drivers)} bajo investigación por ${translateInfraction(reason)}`
  );
  text = text.replace(
    /(?:FIA STEWARDS:\s*)?CAR (\d+)(?:\s*\(([A-Z]+)\))?\s*(?:-\s*)?TIME PENALTY SERVED/gi,
    (_, num, code) => `${resolveDriverSurname(num, code, drivers)} cumplió su penalización de tiempo`
  );
  text = text.replace(
    /(?:FIA STEWARDS:\s*)?CAR (\d+)(?:\s*\(([A-Z]+)\))?\s*(?:-\s*)?INVESTIGATION NOTED(?:\s*-\s*(.*))?/gi,
    (_, num, code, reason) =>
      `Investigación sobre ${resolveDriverSurname(num, code, drivers)} anotada${reason ? ` (${translateInfraction(reason)})` : ''}`
  );
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

  // 3. Track conditions & hazards
  text = text.replace(
    /(?:REPORTED\s+)?DEBRIS(?: REPORTED)?(?: IN TURN (\d+)| IN SECTOR (\d+))?/gi,
    (_, turn, sector) => `Restos en pista${turn ? ` en curva ${turn}` : sector ? ` en Sector ${sector}` : ''}`
  );
  text = text.replace(
    /(?:REPORTED\s+)?HAZARD(?: REPORTED)?(?: IN TURN (\d+)| IN SECTOR (\d+))?/gi,
    (_, turn, sector) => `Peligro en pista${turn ? ` en curva ${turn}` : sector ? ` en Sector ${sector}` : ''}`
  );
  text = text.replace(
    /OIL(?: REPORTED)?(?: ON TRACK)?(?: IN TURN (\d+)| IN SECTOR (\d+))?/gi,
    (_, turn, sector) => `Aceite en pista${turn ? ` en curva ${turn}` : sector ? ` en Sector ${sector}` : ''}`
  );
  text = text.replace(
    /(?:TRACK SURFACE SLIPPERY|SLIPPERY TRACK)(?: IN TURN (\d+)| IN SECTOR (\d+))?/gi,
    (_, turn, sector) => `Pista resbaladiza${turn ? ` en curva ${turn}` : sector ? ` en Sector ${sector}` : ''}`
  );
  text = text.replace(/LOW GRIP CONDITIONS/gi, 'Condiciones de baja adherencia');
  text = text.replace(/WET TRACK/gi, 'Pista húmeda / mojada');
  text = text.replace(/RAIN EXPECTED IN (\d+) MINUTES/gi, 'Se espera lluvia en $1 minutos');

  // 4. Flags & Sessions
  text = text.replace(/^SESSION FINISHED$/i, 'Sesión finalizada');
  text = text.replace(/^SESSION RESUMED$/i, 'Sesión reanudada');
  text = text.replace(/^SESSION SUSPENDED$/i, 'Sesión suspendida (Bandera roja)');
  text = text.replace(/^SESSION WILL NOT BE RESUMED$/i, 'La sesión no será reanudada');
  text = text.replace(/^CHEQUERED FLAG$/i, 'Bandera a cuadros (Fin de sesión)');
  text = text.replace(/^GREEN FLAG$/i, 'Bandera verde (Pista habilitada)');
  text = text.replace(/^TRACK CLEAR$/i, 'Pista libre / Bandera verde');
  text = text.replace(/^RED FLAG$/i, 'Bandera roja (Sesión detenida)');
  text = text.replace(
    /(DOUBLE\s+)?YELLOW FLAG IN (?:TRACK\s+)?SECTOR (\d+)/gi,
    (_, dbl, sector) => `${dbl ? 'Doble bandera amarilla' : 'Bandera amarilla'} en Sector ${sector}`
  );
  text = text.replace(
    /CLEAR IN (?:TRACK\s+)?SECTOR (\d+)/gi,
    (_, sector) => `Sector ${sector} despejado`
  );

  // 5. Safety Car & VSC
  text = text.replace(/SAFETY CAR DEPLOYED/gi, 'Auto de Seguridad (Safety Car) en pista');
  text = text.replace(/VIRTUAL SAFETY CAR DEPLOYED/gi, 'Auto de Seguridad Virtual (VSC) desplegado');
  text = text.replace(/VIRTUAL SAFETY CAR ENDING/gi, 'Finalizando Auto de Seguridad Virtual (VSC)');
  text = text.replace(/SAFETY CAR IN THIS LAP/gi, 'Safety Car entra a boxes en esta vuelta');
  text = text.replace(/SAFETY CAR PERIOD ENDING/gi, 'Auto de Seguridad se retira en esta vuelta');
  text = text.replace(
    /LAPPED CARS MAY NOW OVERTAKE(?: THE SAFETY CAR)?/gi,
    'Autos rezagados pueden adelantar al Safety Car'
  );
  text = text.replace(/STANDING START/gi, 'Salida detenida');
  text = text.replace(/ROLLING START/gi, 'Salida lanzada');
  text = text.replace(/FORMATION LAP(?: STARTED)?/gi, 'Vuelta de formación en curso');
  text = text.replace(/RECOVERY VEHICLE ON TRACK/gi, 'Vehículo de auxilio en pista');
  text = text.replace(/MEDICAL CAR DEPLOYED/gi, 'Auto Médico desplegado');
  text = text.replace(/RACE WILL RESUME AT (\d{1,2}:\d{2})/gi, 'La carrera se reanudará a las $1 hs');
  text = text.replace(/RACE WILL START AT (\d{1,2}:\d{2})/gi, 'La carrera comenzará a las $1 hs');
  text = text.replace(/ESTIMATED (?:RACE )?RESTART IN (\d+) MINUTES/gi, 'Reinicio estimado en $1 minutos');

  // 6. Overtake Mode & Pit Lane
  text = text.replace(/(?:DRS|OVERTAKE|MOM) ENABLED(?: IN ALL DETECTION ZONES)?/gi, 'Modo Overtake (MOM) habilitado');
  text = text.replace(/(?:DRS|OVERTAKE|MOM) DISABLED/gi, 'Modo Overtake (MOM) deshabilitado');
  text = text.replace(/GREEN LIGHT\s*-\s*PIT EXIT OPEN/gi, 'Luz verde - Salida de boxes abierta');
  text = text.replace(/PIT EXIT OPEN/gi, 'Salida de boxes abierta');
  text = text.replace(/PIT EXIT CLOSED/gi, 'Salida de boxes cerrada');
  text = text.replace(/PIT ENTRY OPEN/gi, 'Entrada a boxes abierta');
  text = text.replace(/PIT ENTRY CLOSED/gi, 'Entrada a boxes cerrada');
  text = text.replace(/PIT LANE OPEN/gi, 'Pit lane abierto');
  text = text.replace(/PIT LANE CLOSED/gi, 'Pit lane cerrado');

  // 7. Driver Actions & Incidents on Track
  text = text.replace(
    /CAR (\d+)(?:\s*\(([A-Z]+)\))?\s+STOPPED IN PIT\s*-\s*RETIRED/gi,
    (_, num, code) => `${resolveDriverSurname(num, code, drivers)} detenido en boxes - Abandono`
  );
  text = text.replace(
    /CAR (\d+)(?:\s*\(([A-Z]+)\))?\s+STOPPED AT PIT EXIT/gi,
    (_, num, code) => `${resolveDriverSurname(num, code, drivers)} detenido en salida de boxes`
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
    /CAR (\d+)(?:\s*\(([A-Z]+)\))?\s+OFF TRACK AND CONTINUED(?: AT TURN (\d+))?/gi,
    (_, num, code, turn) => {
      const driver = resolveDriverSurname(num, code, drivers);
      return turn ? `${driver} fuera de pista en curva ${turn} y continuó` : `${driver} fuera de pista y continuó`;
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
    /CAR (\d+)(?:\s*\(([A-Z]+)\))?\s+(?:LAP\s+)?TIME (.*?) DELETED\s*-\s*(.*)/gi,
    (_, num, code, lapTime, reason) => {
      const driver = resolveDriverSurname(num, code, drivers);
      return `Vuelta eliminada (${lapTime}) para ${driver} por ${translateInfraction(reason)}`;
    }
  );

  // 8. Simulation messages formatting in Spanish
  text = text.replace(
    /GANADOR OFICIAL: AUTO (\d+)(?:\s*\(([A-Z]+)\))?/gi,
    (_, num, code) => `Ganador oficial: ${resolveDriverSurname(num, code, drivers)}`
  );
  text = text.replace(
    /AUTO (\d+)\s*\((.*?)\)\s*-\s*TIEMPO VÁLIDO EN EL TOP 10/gi,
    (_, num, code) => `${resolveDriverSurname(num, code, drivers)} - Tiempo válido en el Top 10`
  );
  text = text.replace(
    /BANDERA A CUADROS • CARRERA FINALIZADA \((.*?)\)/gi,
    (_, loc) => `Bandera a cuadros • Carrera finalizada (${loc})`
  );
  text = text.replace(
    /INICIO DE SESIÓN - SEMÁFORO EN VERDE EN PIT EXIT \((.*?)\)/gi,
    (_, loc) => `Inicio de sesión - Semáforo verde en salida de boxes (${loc})`
  );
  text = text.replace(
    /PISTA LIBRE - SECTOR (\d+) \((.*?)\)/gi,
    (_, sector, loc) => `Pista libre - Sector ${sector} (${loc})`
  );
  text = text.replace(
    /BANDERA VERDE - REINICIO DE ACTIVIDAD EN PISTA \((.*?)\)/gi,
    (_, loc) => `Bandera verde - Reinicio de actividad en pista (${loc})`
  );
  text = text.replace(
    /BANDERA ROJA - SESIÓN DETENIDA \((.*?)\)/gi,
    (_, loc) => `Bandera roja - Sesión detenida (${loc})`
  );
  text = text.replace(
    /ACTIVIDAD EN PISTA PROGRAMADA PARA LAS (\d{1,2}:\d{2}) HS \(HORA ARGENTINA\)/gi,
    (_, time) => `Actividad en pista programada para las ${time} hs (Hora Argentina)`
  );
  text = text.replace(
    /GRILLA DE SALIDA OFICIAL • (.*)/gi,
    (_, session) => `Grilla de salida oficial • ${translateSessionName(session, 'es')}`
  );

  // Fallback for general CAR X - REASON
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
