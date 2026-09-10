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

export function translateFIAMessage(raw?: string): string {
  if (!raw) return '';
  let text = raw.trim();

  // 1. Blue Flags (Banderas azules)
  text = text.replace(
    /WAVED BLUE FLAG FOR CAR (\d+) \(([A-Z]+)\)(?: TIMED AT .*)?/i,
    'Bandera azul para auto $1 ($2)'
  );
  text = text.replace(
    /WAVED BLUE FLAG FOR CAR (\d+)(?: TIMED AT .*)?/i,
    'Bandera azul para auto $1'
  );
  text = text.replace(
    /BLUE FLAG FOR CAR (\d+) \(([A-Z]+)\)/i,
    'Bandera azul para auto $1 ($2)'
  );
  text = text.replace(/BLUE FLAG FOR CAR (\d+)/i, 'Bandera azul para auto $1');

  // 2. Yellow / Double Yellow / Green Flags
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
  text = text.replace(/^GREEN FLAG$/i, 'Bandera verde (Pista habilitada)');
  text = text.replace(/^TRACK CLEAR$/i, 'Pista libre / Bandera verde');
  text = text.replace(/^CHEQUERED FLAG$/i, 'Bandera a cuadros (Fin de sesión)');
  text = text.replace(/^RED FLAG$/i, 'Bandera roja (Sesión detenida)');

  // 3. Safety Car & VSC
  text = text.replace(/^SAFETY CAR DEPLOYED$/i, 'Auto de Seguridad (Safety Car) en pista');
  text = text.replace(/^VIRTUAL SAFETY CAR DEPLOYED$/i, 'Auto de Seguridad Virtual (VSC) desplegado');
  text = text.replace(/^VIRTUAL SAFETY CAR ENDING$/i, 'Finalizando Auto de Seguridad Virtual (VSC)');
  text = text.replace(/^SAFETY CAR IN THIS LAP$/i, 'Safety Car entra a boxes en esta vuelta');

  // 4. DRS
  text = text.replace(/^DRS ENABLED$/i, 'DRS habilitado');
  text = text.replace(/^DRS DISABLED$/i, 'DRS deshabilitado');

  // 5. Pit Lane
  text = text.replace(/^PIT EXIT OPEN$/i, 'Salida de boxes abierta');
  text = text.replace(/^PIT EXIT CLOSED$/i, 'Salida de boxes cerrada');
  text = text.replace(/^PIT ENTRY OPEN$/i, 'Entrada a boxes abierta');
  text = text.replace(/^PIT ENTRY CLOSED$/i, 'Entrada a boxes cerrada');
  text = text.replace(/^PIT LANE OPEN$/i, 'Pit lane abierto');
  text = text.replace(/^PIT LANE CLOSED$/i, 'Pit lane cerrado');

  // 6. Investigations & Penalties
  text = text.replace(
    /INCIDENT INVOLVING CARS? (.*) UNDER INVESTIGATION/i,
    'Incidente de auto(s) $1 bajo investigación'
  );
  text = text.replace(
    /INCIDENT INVOLVING CARS? (.*) - (.*)/i,
    'Incidente de auto(s) $1 - $2'
  );
  text = text.replace(
    /NO FURTHER ACTION FOR CARS? (.*)/i,
    'Sin sanción para auto(s) $1'
  );
  text = text.replace(
    /CAR (\d+) \(([A-Z]+)\) - (\d+) SECOND TIME PENALTY FOR (.*)/i,
    'Auto $1 ($2) - Penalización de $3 seg por $4'
  );
  text = text.replace(
    /CAR (\d+) - (\d+) SECOND TIME PENALTY FOR (.*)/i,
    'Auto $1 - Penalización de $2 seg por $3'
  );
  text = text.replace(
    /CAR (\d+) \(([A-Z]+)\) - DRIVE THROUGH PENALTY/i,
    'Auto $1 ($2) - Penalización de Drive-Through'
  );

  // 7. Common Infractions
  text = text.replace(/\bAND\b/g, 'y');
  text = text.replace(/TRACK LIMITS/gi, 'límites de pista');
  text = text.replace(/FALSE START/gi, 'largada en falso');
  text = text.replace(/CAUSING A COLLISION/gi, 'provocar colisión');
  text = text.replace(/LEAVING THE TRACK AND GAINING AN ADVANTAGE/gi, 'ganar ventaja fuera de pista');
  text = text.replace(/SPEEDING IN THE PIT LANE/gi, 'exceso de velocidad en pit lane');
  text = text.replace(/UNSAFE RELEASE/gi, 'salida peligrosa de boxes');
  text = text.replace(/IMPEDING/gi, 'bloquear el paso a otro piloto');

  return text;
}

export function getFlagBadgeConfig(flag?: string | null): { text: string; badgeClass: string } | null {
  if (!flag) return null;
  const f = flag.toUpperCase().trim();

  switch (f) {
    case 'BLUE':
      return {
        text: 'AZUL',
        badgeClass: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
      };
    case 'YELLOW':
      return {
        text: 'AMARILLA',
        badgeClass: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
      };
    case 'DOUBLE YELLOW':
      return {
        text: 'DOBLE AMARILLA',
        badgeClass: 'bg-amber-500/30 text-amber-200 border border-amber-500/50',
      };
    case 'GREEN':
      return {
        text: 'VERDE',
        badgeClass: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
      };
    case 'RED':
      return {
        text: 'ROJA',
        badgeClass: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
      };
    case 'CHEQUERED':
      return {
        text: 'CUADROS',
        badgeClass: 'bg-white/10 text-white border border-white/20',
      };
    case 'BLACK AND WHITE':
      return {
        text: 'ADVERTENCIA',
        badgeClass: 'bg-zinc-800 text-zinc-200 border border-zinc-600',
      };
    default:
      return {
        text: f,
        badgeClass: 'bg-zinc-800 text-zinc-300 border border-zinc-700',
      };
  }
}
