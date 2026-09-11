import { useCallback, useEffect, useMemo, useState } from 'react';
import type { DriverLive, FlagStatus, LiveSnapshot, RaceControlMessage, SessionState, TyreCompound } from '../types/f1';

// Base drivers from Monza 2024 grid
interface SimDriverSeed {
  number: number;
  code: string;
  name: string;
  team: string;
  color: string;
  startPos: number;
  endPos: number;
  stint1Compound: TyreCompound;
  pitLap: number;
  stint2Compound: TyreCompound;
  pitLap2?: number;
  stint3Compound?: TyreCompound;
  retireLap?: number;
  retireReason?: string;
  penaltySeconds?: number;
}

const MONZA_GRID: SimDriverSeed[] = [
  { number: 16, code: 'LEC', name: 'Charles Leclerc', team: 'Ferrari', color: '#E8002D', startPos: 4, endPos: 1, stint1Compound: 'MEDIUM', pitLap: 15, stint2Compound: 'HARD' },
  { number: 81, code: 'PIA', name: 'Oscar Piastri', team: 'McLaren', color: '#FF8000', startPos: 2, endPos: 2, stint1Compound: 'MEDIUM', pitLap: 16, stint2Compound: 'HARD', pitLap2: 38, stint3Compound: 'HARD' },
  { number: 4, code: 'NOR', name: 'Lando Norris', team: 'McLaren', color: '#FF8000', startPos: 1, endPos: 3, stint1Compound: 'MEDIUM', pitLap: 14, stint2Compound: 'HARD', pitLap2: 32, stint3Compound: 'HARD' },
  { number: 55, code: 'SAI', name: 'Carlos Sainz', team: 'Ferrari', color: '#E8002D', startPos: 5, endPos: 4, stint1Compound: 'MEDIUM', pitLap: 19, stint2Compound: 'HARD' },
  { number: 44, code: 'HAM', name: 'Lewis Hamilton', team: 'Mercedes', color: '#27F4D2', startPos: 6, endPos: 5, stint1Compound: 'MEDIUM', pitLap: 16, stint2Compound: 'HARD', pitLap2: 37, stint3Compound: 'HARD' },
  { number: 1, code: 'VER', name: 'Max Verstappen', team: 'Red Bull Racing', color: '#3671C6', startPos: 7, endPos: 6, stint1Compound: 'HARD', pitLap: 22, stint2Compound: 'HARD', pitLap2: 41, stint3Compound: 'MEDIUM' },
  { number: 63, code: 'RUS', name: 'George Russell', team: 'Mercedes', color: '#27F4D2', startPos: 3, endPos: 7, stint1Compound: 'MEDIUM', pitLap: 11, stint2Compound: 'HARD', pitLap2: 33, stint3Compound: 'HARD' },
  { number: 11, code: 'PER', name: 'Sergio Perez', team: 'Red Bull Racing', color: '#3671C6', startPos: 8, endPos: 8, stint1Compound: 'HARD', pitLap: 23, stint2Compound: 'MEDIUM', pitLap2: 35, stint3Compound: 'HARD' },
  { number: 23, code: 'ALB', name: 'Alexander Albon', team: 'Williams', color: '#64C4FF', startPos: 9, endPos: 9, stint1Compound: 'MEDIUM', pitLap: 16, stint2Compound: 'HARD' },
  { number: 20, code: 'MAG', name: 'Kevin Magnussen', team: 'Haas', color: '#B6BABD', startPos: 13, endPos: 10, stint1Compound: 'MEDIUM', pitLap: 20, stint2Compound: 'HARD', penaltySeconds: 10 },
  { number: 14, code: 'ALO', name: 'Fernando Alonso', team: 'Aston Martin', color: '#229971', startPos: 11, endPos: 11, stint1Compound: 'MEDIUM', pitLap: 13, stint2Compound: 'HARD', pitLap2: 34, stint3Compound: 'HARD' },
  { number: 43, code: 'COL', name: 'Franco Colapinto', team: 'Williams', color: '#64C4FF', startPos: 18, endPos: 12, stint1Compound: 'MEDIUM', pitLap: 16, stint2Compound: 'HARD' },
  { number: 3, code: 'RIC', name: 'Daniel Ricciardo', team: 'RB', color: '#6692FF', startPos: 12, endPos: 13, stint1Compound: 'MEDIUM', pitLap: 11, stint2Compound: 'HARD', penaltySeconds: 15 },
  { number: 31, code: 'OCO', name: 'Esteban Ocon', team: 'Alpine', color: '#FF87BC', startPos: 14, endPos: 14, stint1Compound: 'MEDIUM', pitLap: 15, stint2Compound: 'HARD' },
  { number: 10, code: 'GAS', name: 'Pierre Gasly', team: 'Alpine', color: '#FF87BC', startPos: 15, endPos: 15, stint1Compound: 'MEDIUM', pitLap: 10, stint2Compound: 'HARD', pitLap2: 31, stint3Compound: 'MEDIUM' },
  { number: 77, code: 'BOT', name: 'Valtteri Bottas', team: 'Sauber', color: '#52E252', startPos: 19, endPos: 16, stint1Compound: 'MEDIUM', pitLap: 13, stint2Compound: 'HARD' },
  { number: 27, code: 'HUL', name: 'Nico Hulkenberg', team: 'Haas', color: '#B6BABD', startPos: 10, endPos: 17, stint1Compound: 'MEDIUM', pitLap: 5, stint2Compound: 'HARD', pitLap2: 33, stint3Compound: 'HARD', penaltySeconds: 10 },
  { number: 24, code: 'ZHO', name: 'Guanyu Zhou', team: 'Sauber', color: '#52E252', startPos: 20, endPos: 18, stint1Compound: 'MEDIUM', pitLap: 17, stint2Compound: 'HARD' },
  { number: 18, code: 'STR', name: 'Lance Stroll', team: 'Aston Martin', color: '#229971', startPos: 16, endPos: 19, stint1Compound: 'MEDIUM', pitLap: 12, stint2Compound: 'HARD', pitLap2: 37, stint3Compound: 'HARD' },
  { number: 22, code: 'TSU', name: 'Yuki Tsunoda', team: 'RB', color: '#6692FF', startPos: 17, endPos: 99, stint1Compound: 'MEDIUM', pitLap: 8, stint2Compound: 'MEDIUM', retireLap: 8, retireReason: 'Colisión / Daños' },
];

const MONZA_QUALY_GRID = [
  { number: 4, code: 'NOR', name: 'Lando Norris', team: 'McLaren', color: '#FF8000', pos: 1, bestLap: '1:19.327', bestDuration: 79.327, compound: 'SOFT' as TyreCompound, laps: 12 },
  { number: 81, code: 'PIA', name: 'Oscar Piastri', team: 'McLaren', color: '#FF8000', pos: 2, bestLap: '1:19.436', bestDuration: 79.436, compound: 'SOFT' as TyreCompound, laps: 13 },
  { number: 63, code: 'RUS', name: 'George Russell', team: 'Mercedes', color: '#27F4D2', pos: 3, bestLap: '1:19.440', bestDuration: 79.440, compound: 'SOFT' as TyreCompound, laps: 14 },
  { number: 16, code: 'LEC', name: 'Charles Leclerc', team: 'Ferrari', color: '#E8002D', pos: 4, bestLap: '1:19.461', bestDuration: 79.461, compound: 'SOFT' as TyreCompound, laps: 12 },
  { number: 55, code: 'SAI', name: 'Carlos Sainz', team: 'Ferrari', color: '#E8002D', pos: 5, bestLap: '1:19.467', bestDuration: 79.467, compound: 'SOFT' as TyreCompound, laps: 12 },
  { number: 44, code: 'HAM', name: 'Lewis Hamilton', team: 'Mercedes', color: '#27F4D2', pos: 6, bestLap: '1:19.513', bestDuration: 79.513, compound: 'SOFT' as TyreCompound, laps: 14 },
  { number: 1, code: 'VER', name: 'Max Verstappen', team: 'Red Bull Racing', color: '#3671C6', pos: 7, bestLap: '1:19.662', bestDuration: 79.662, compound: 'SOFT' as TyreCompound, laps: 11 },
  { number: 11, code: 'PER', name: 'Sergio Perez', team: 'Red Bull Racing', color: '#3671C6', pos: 8, bestLap: '1:20.062', bestDuration: 80.062, compound: 'SOFT' as TyreCompound, laps: 13 },
  { number: 23, code: 'ALB', name: 'Alexander Albon', team: 'Williams', color: '#64C4FF', pos: 9, bestLap: '1:20.299', bestDuration: 80.299, compound: 'SOFT' as TyreCompound, laps: 11 },
  { number: 27, code: 'HUL', name: 'Nico Hulkenberg', team: 'Haas', color: '#B6BABD', pos: 10, bestLap: '1:20.339', bestDuration: 80.339, compound: 'SOFT' as TyreCompound, laps: 12 },
  { number: 14, code: 'ALO', name: 'Fernando Alonso', team: 'Aston Martin', color: '#229971', pos: 11, bestLap: '1:20.421', bestDuration: 80.421, compound: 'SOFT' as TyreCompound, laps: 10, elimPhase: 'Q2' as const },
  { number: 3, code: 'RIC', name: 'Daniel Ricciardo', team: 'RB', color: '#6692FF', pos: 12, bestLap: '1:20.479', bestDuration: 80.479, compound: 'SOFT' as TyreCompound, laps: 9, elimPhase: 'Q2' as const },
  { number: 20, code: 'MAG', name: 'Kevin Magnussen', team: 'Haas', color: '#B6BABD', pos: 13, bestLap: '1:20.698', bestDuration: 80.698, compound: 'SOFT' as TyreCompound, laps: 10, elimPhase: 'Q2' as const },
  { number: 10, code: 'GAS', name: 'Pierre Gasly', team: 'Alpine', color: '#FF87BC', pos: 14, bestLap: '1:20.738', bestDuration: 80.738, compound: 'SOFT' as TyreCompound, laps: 9, elimPhase: 'Q2' as const },
  { number: 31, code: 'OCO', name: 'Esteban Ocon', team: 'Alpine', color: '#FF87BC', pos: 15, bestLap: '1:20.764', bestDuration: 80.764, compound: 'SOFT' as TyreCompound, laps: 9, elimPhase: 'Q2' as const },
  { number: 22, code: 'TSU', name: 'Yuki Tsunoda', team: 'RB', color: '#6692FF', pos: 16, bestLap: '1:20.945', bestDuration: 80.945, compound: 'SOFT' as TyreCompound, laps: 6, elimPhase: 'Q1' as const },
  { number: 18, code: 'STR', name: 'Lance Stroll', team: 'Aston Martin', color: '#229971', pos: 17, bestLap: '1:21.013', bestDuration: 81.013, compound: 'SOFT' as TyreCompound, laps: 6, elimPhase: 'Q1' as const },
  { number: 43, code: 'COL', name: 'Franco Colapinto', team: 'Williams', color: '#64C4FF', pos: 18, bestLap: '1:21.061', bestDuration: 81.061, compound: 'SOFT' as TyreCompound, laps: 6, elimPhase: 'Q1' as const },
  { number: 77, code: 'BOT', name: 'Valtteri Bottas', team: 'Sauber', color: '#52E252', pos: 19, bestLap: '1:21.101', bestDuration: 81.101, compound: 'SOFT' as TyreCompound, laps: 6, elimPhase: 'Q1' as const },
  { number: 24, code: 'ZHO', name: 'Guanyu Zhou', team: 'Sauber', color: '#52E252', pos: 20, bestLap: '1:21.445', bestDuration: 81.445, compound: 'SOFT' as TyreCompound, laps: 6, elimPhase: 'Q1' as const },
];

export function useRaceSimulation(initialSnapshot: LiveSnapshot | null) {
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simPreset, setSimPreset] = useState<'race' | 'qualy'>('race');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [simLap, setSimLap] = useState<number>(1);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [simBaseTimestamp] = useState<number>(() => Math.floor(Date.now() / 1000));

  const totalLaps = simPreset === 'race' ? 53 : 15;

  // Auto-step when playing
  useEffect(() => {
    if (!isSimulating || !isPlaying) return;

    const intervalMs = Math.round(2500 / simSpeed);
    const timer = setInterval(() => {
      setSimLap((prev) => {
        if (prev >= totalLaps) {
          setIsPlaying(false);
          return totalLaps;
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isSimulating, isPlaying, simSpeed, totalLaps]);

  const simSnapshot = useMemo<LiveSnapshot | null>(() => {
    if (!isSimulating) return null;

    if (simPreset === 'qualy') {
      const qualifyingPhase: 'Q1' | 'Q2' | 'Q3' =
        simLap <= 5 ? 'Q1' : simLap <= 10 ? 'Q2' : 'Q3';
      const isQualyFinished = simLap >= totalLaps;

      const qualyDrivers: DriverLive[] = MONZA_QUALY_GRID.map((seed, idx) => {
        const isPole = seed.pos === 1;
        const prevDuration = idx > 0 ? MONZA_QUALY_GRID[idx - 1].bestDuration : 79.327;
        const gap = isPole ? 'POLE' : `+${(seed.bestDuration - 79.327).toFixed(3)}`;
        const interval = isPole
          ? 'POLE'
          : `+${(seed.bestDuration - prevDuration).toFixed(3)}`;

        let eliminatedPhase: 'Q1' | 'Q2' | null = null;
        if (qualifyingPhase === 'Q2' && seed.pos > 15) {
          eliminatedPhase = 'Q1';
        } else if (qualifyingPhase === 'Q3') {
          if (seed.pos > 15) eliminatedPhase = 'Q1';
          else if (seed.pos > 10) eliminatedPhase = 'Q2';
        }

        return {
          pos: seed.pos,
          posChange: 0,
          driverNumber: seed.number,
          code: seed.code,
          fullName: seed.name,
          teamName: seed.team,
          teamColor: seed.color,
          gap,
          interval,
          isDrsZone: false,
          lastLapTime: seed.bestLap,
          bestLapTime: seed.bestLap,
          bestLapDuration: seed.bestDuration,
          isPole,
          isFastestLap: isPole,
          eliminatedPhase,
          tyre: {
            compound: seed.compound,
            laps: seed.laps,
          },
          pitStops: 0,
          inPit: false,
          status: 'ACTIVE',
          sectors: { s1: 26.85, s2: 26.24, s3: 26.23 },
          speedTrap: 351,
        };
      });

      const qualyMessages: RaceControlMessage[] = [];
      if (simLap >= 1) {
        qualyMessages.push({
          id: 1,
          time: '16:00:00',
          text: 'GREEN LIGHT - PIT EXIT OPEN (Q1 STARTED)',
          flag: 'GREEN',
        });
      }
      if (simLap >= 5) {
        qualyMessages.push({
          id: 2,
          time: '16:18:00',
          text: 'CHEQUERED FLAG - Q1 FINISHED (TSU, STR, COL, BOT, ZHO ELIMINADOS)',
          flag: 'CHEQUERED',
        });
      }
      if (simLap >= 6) {
        qualyMessages.push({
          id: 3,
          time: '16:29:00',
          text: 'GREEN LIGHT - PIT EXIT OPEN (Q2 STARTED)',
          flag: 'GREEN',
        });
      }
      if (simLap >= 10) {
        qualyMessages.push({
          id: 4,
          time: '16:44:00',
          text: 'CHEQUERED FLAG - Q2 FINISHED (ALO, RIC, MAG, GAS, OCO ELIMINADOS)',
          flag: 'CHEQUERED',
        });
      }
      if (simLap >= 11) {
        qualyMessages.push({
          id: 5,
          time: '16:52:00',
          text: 'GREEN LIGHT - PIT EXIT OPEN (Q3 SHOOTOUT STARTED)',
          flag: 'GREEN',
        });
      }
      if (simLap >= 15) {
        qualyMessages.push({
          id: 6,
          time: '17:04:00',
          text: 'CHEQUERED FLAG - CAR 4 (NOR) OBTIENE LA POLE POSITION (1:19.327)',
          flag: 'CHEQUERED',
        });
      }

      return {
        session: {
          sessionKey: 9586,
          sessionName: 'Clasificación de Italia (Simulación)',
          sessionType: 'Qualifying',
          qualifyingPhase,
          poleDriver: 'NOR',
          poleLapTime: '1:19.327',
          location: 'Monza',
          country: 'Italia',
          circuit: 'Monza',
          status: isQualyFinished ? 'FINISHED' : 'IN_PROGRESS',
          flag: isQualyFinished ? 'CHEQUERED' : 'GREEN',
          currentLap: simLap,
          totalLaps: 0,
          progressPercentage: Math.min(100, Math.round((simLap / totalLaps) * 100)),
          timestamp: simBaseTimestamp + simLap * 60,
        },
        weather: {
          airTemp: 33.1,
          trackTemp: 49.8,
          humidity: 28,
          rainfall: false,
          windSpeed: 1.2,
          windDirection: 180,
        },
        messages: qualyMessages.reverse(),
        drivers: qualyDrivers,
      };
    }

    // Race Simulation Mode
    const lapRatio = simLap / totalLaps;
    let flag: FlagStatus = 'GREEN';
    let sessionStatus: SessionState = 'IN_PROGRESS';

    if (simLap >= totalLaps) {
      flag = 'CHEQUERED';
      sessionStatus = 'FINISHED';
    } else if (simLap === 8 || simLap === 9) {
      flag = 'YELLOW';
    }

    // Calculate positions and drivers based on current simLap
    const driversList: DriverLive[] = MONZA_GRID.map((seed) => {
      const isRetired = Boolean(seed.retireLap && simLap >= seed.retireLap);
      let calculatedPos: number;

      if (isRetired) {
        calculatedPos = 99;
      } else {
        // Interpolate position from startPos to endPos
        const rawInterp = seed.startPos + (seed.endPos - seed.startPos) * lapRatio;
        calculatedPos = Math.round(rawInterp);
      }

      // Tyres and stints
      let compound: TyreCompound = seed.stint1Compound;
      let tyreAge = simLap;
      let pitStops = 0;
      let inPit = false;

      if (isRetired) {
        tyreAge = seed.retireLap || 8;
      } else if (seed.pitLap2 && simLap >= seed.pitLap2) {
        compound = seed.stint3Compound || 'HARD';
        tyreAge = simLap - seed.pitLap2 + 1;
        pitStops = 2;
        inPit = simLap === seed.pitLap2;
      } else if (simLap >= seed.pitLap) {
        compound = seed.stint2Compound;
        tyreAge = simLap - seed.pitLap + 1;
        pitStops = 1;
        inPit = simLap === seed.pitLap;
      }

      return {
        pos: calculatedPos,
        posChange: isRetired ? 0 : seed.startPos - calculatedPos,
        gridPosition: seed.startPos,
        driverNumber: seed.number,
        code: seed.code,
        fullName: seed.name,
        teamName: seed.team,
        teamColor: seed.color,
        gap: '- - -',
        interval: '- - -',
        isDrsZone: false,
        lastLapTime: isRetired ? 'OUT' : '1:21.820',
        bestLapTime: '1:21.432',
        bestLapDuration: 81.432,
        isFastestLap: !isRetired && seed.code === 'NOR' && simLap >= 40,
        penaltySeconds: seed.penaltySeconds,
        tyre: {
          compound,
          laps: tyreAge,
        },
        pitStops,
        inPit,
        status: isRetired ? 'DNF' : inPit ? 'PIT' : 'ACTIVE',
        retiredLap: isRetired ? seed.retireLap : undefined,
        retirementReason: isRetired ? seed.retireReason : undefined,
        sectors: { s1: 27.12, s2: 26.94, s3: 27.76 },
        speedTrap: 348,
      };
    });

    // Sort active drivers by their interpolated rank
    driversList.sort((a, b) => {
      if (a.status === 'DNF' && b.status !== 'DNF') return 1;
      if (a.status !== 'DNF' && b.status === 'DNF') return -1;
      return a.pos - b.pos;
    });

    // Fix discrete ranks 1..19
    let rank = 1;
    let leaderGapAccumulator = 0;

    for (let i = 0; i < driversList.length; i++) {
      const d = driversList[i];
      if (d.status !== 'DNF') {
        d.pos = rank++;
        if (d.pos === 1) {
          d.gap = 'LEADER';
          d.interval = 'LEADER';
        } else {
          // Dynamic realistic gaps
          const stepGap = 0.4 + (i * 0.35 * (simLap / 10));
          leaderGapAccumulator += stepGap;
          d.gap = `+${leaderGapAccumulator.toFixed(3)}`;
          d.interval = `+${stepGap.toFixed(3)}`;
          d.isDrsZone = stepGap < 1.0;
        }
      } else {
        d.gap = 'RET';
        d.interval = 'RET';
      }
    }

    // Build chronological simulated race control messages
    const simMessages: RaceControlMessage[] = [];
    if (simLap >= 1) {
      simMessages.push({ id: 1, time: '15:03:00', text: 'GREEN LIGHT - PIT EXIT OPEN', flag: 'GREEN' });
    }
    if (simLap >= 6) {
      simMessages.push({ id: 2, time: '15:11:21', text: 'TURN 1 INCIDENT INVOLVING CARS 27 AND 22 NOTED', flag: 'YELLOW' });
    }
    if (simLap >= 8) {
      simMessages.push({ id: 3, time: '15:14:30', text: 'CAR 22 (TSU) STOPPED IN PIT - RETIRED', flag: 'YELLOW' });
    }
    if (simLap >= 15) {
      simMessages.push({ id: 4, time: '15:24:10', text: 'CAR 16 (LEC) TAKES LEAD OF THE RACE', flag: null });
    }
    if (simLap >= 38) {
      simMessages.push({ id: 5, time: '15:58:22', text: 'DRS ENABLED IN ALL DETECTION ZONES', flag: 'GREEN' });
    }
    if (simLap >= 53) {
      simMessages.push({ id: 6, time: '16:21:04', text: 'CHEQUERED FLAG - CAR 16 (LEC) WINS ITALIAN GP', flag: 'CHEQUERED' });
    }

    return {
      session: {
        sessionKey: 9590,
        sessionName: 'Gran Premio de Italia (Simulación)',
        sessionType: 'Race',
        location: 'Monza',
        country: 'Italia',
        circuit: 'Monza',
        status: sessionStatus,
        flag,
        currentLap: simLap,
        totalLaps,
        progressPercentage: Math.min(100, Math.round((simLap / totalLaps) * 100)),
        timestamp: simBaseTimestamp + simLap * 82,
      },
      weather: initialSnapshot?.weather || {
        airTemp: 32.2,
        trackTemp: 43.5,
        humidity: 32,
        rainfall: false,
        windSpeed: 1.9,
        windDirection: 229,
      },
      messages: simMessages.reverse(),
      drivers: driversList,
    };
  }, [isSimulating, simPreset, simLap, totalLaps, initialSnapshot, simBaseTimestamp]);

  const toggleSimulation = useCallback(() => {
    setIsSimulating((prev) => {
      const next = !prev;
      if (!next) {
        setIsPlaying(false);
      }
      return next;
    });
  }, []);

  const switchPreset = useCallback((preset: 'race' | 'qualy') => {
    setSimPreset(preset);
    setIsPlaying(false);
    setSimLap(1);
  }, []);

  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);
  const reset = useCallback(() => {
    setIsPlaying(false);
    setSimLap(1);
  }, []);

  return {
    isSimulating,
    isPlaying,
    simLap,
    totalLaps,
    simSpeed,
    simPreset,
    setSimPreset: switchPreset,
    simSnapshot,
    toggleSimulation,
    play,
    pause,
    reset,
    setLap: setSimLap,
    setSpeed: setSimSpeed,
  };
}
