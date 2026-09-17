import { useState, useMemo, lazy, Suspense } from 'react';
import { ChevronDown, ChevronUp, Gauge, Star, Swords, X } from 'lucide-react';
import type { DriverLive, SessionType } from '../../types/f1';
import { useLanguage } from '../../hooks/useLanguage';
import { MiniSectorsBar } from '../qualy/MiniSectorsBar';
import { SectorPill } from '../qualy/SectorPill';
import { TyreBadge } from '../common/TyreBadge';
import { TyreStintBar, type StintItem } from '../common/TyreStintBar';
import { getF1DriverProfile, type F1DriverProfile } from '../../data/f1DriversData';
import { computeBestSessionSectors, resolveSectorStatus } from '../../utils/sectorUtils';
import { useFavoriteDriver } from '../../hooks/useFavoriteDriver';

const HeadToHeadModal = lazy(() =>
  import('./HeadToHeadModal').then((m) => ({ default: m.HeadToHeadModal }))
);
const DriverProfileModal = lazy(() =>
  import('../drivers/DriverProfileModal').then((m) => ({ default: m.DriverProfileModal }))
);

interface TimingTableProps {
  drivers: DriverLive[];
  sessionType?: SessionType;
}

const F1_POINTS: Record<number, number> = {
  1: 25,
  2: 18,
  3: 15,
  4: 12,
  5: 10,
  6: 8,
  7: 6,
  8: 4,
  9: 2,
  10: 1,
};

export const TimingTable: React.FC<TimingTableProps> = ({
  drivers,
  sessionType = 'Race',
}) => {
  const { lang, t } = useLanguage();
  const [expandedDriver, setExpandedDriver] = useState<number | null>(null);

  // 👤 Driver Profile Modal
  const [selectedProfile, setSelectedProfile] = useState<F1DriverProfile | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const openDriverProfile = (_driverNumber?: number | string, code?: string, fullName?: string) => {
    const profile =
      (code ? getF1DriverProfile(code) : undefined) ||
      (fullName ? getF1DriverProfile(fullName) : undefined);
    if (profile) {
      setSelectedProfile(profile);
      setIsProfileOpen(true);
    }
  };

  // ⭐ Favorite Driver Hook (synced with localStorage, Navbar and Live Alerts)
  const { favoriteDriverNumber: pinnedDriverNumber, toggleFavoriteDriver: togglePin } = useFavoriteDriver();

  // ⚔️ 1 vs 1 Head-to-Head Modal state
  const [isH2HOpen, setIsH2HOpen] = useState(false);
  const [h2hDriverA, setH2hDriverA] = useState<number | null>(null);
  const [h2hDriverB, setH2hDriverB] = useState<number | null>(null);

  const openH2HWithDriver = (driverNumber: number) => {
    setH2hDriverA(driverNumber);
    const current = drivers.find((d) => d.driverNumber === driverNumber);
    if (current) {
      const targetPos = current.pos > 1 ? current.pos - 1 : 2;
      const opponent = drivers.find((d) => d.pos === targetPos && d.driverNumber !== driverNumber);
      setH2hDriverB(opponent?.driverNumber ?? (drivers.find((d) => d.driverNumber !== driverNumber)?.driverNumber ?? null));
    } else {
      setH2hDriverB(drivers.find((d) => d.driverNumber !== driverNumber)?.driverNumber ?? null);
    }
    setIsH2HOpen(true);
  };

  const openH2HWithTeammate = (driverNumber: number, teammateNumber: number) => {
    setH2hDriverA(driverNumber);
    setH2hDriverB(teammateNumber);
    setIsH2HOpen(true);
  };

  const openGeneralH2H = () => {
    if (pinnedDriverNumber && drivers.some((d) => d.driverNumber === pinnedDriverNumber)) {
      openH2HWithDriver(pinnedDriverNumber);
    } else {
      setH2hDriverA(drivers[0]?.driverNumber ?? null);
      setH2hDriverB(drivers[1]?.driverNumber ?? null);
      setIsH2HOpen(true);
    }
  };

  const isQualy = sessionType === 'Qualifying';
  const isRace = sessionType !== 'Qualifying' && sessionType !== 'Practice';

  const toggleExpand = (driverNumber: number) => {
    setExpandedDriver((prev) => (prev === driverNumber ? null : driverNumber));
  };

  const isCloseInterval = (interval: string) => {
    if (!interval || interval === 'LEADER' || interval.includes('LAP') || interval === 'RET') return false;
    const num = parseFloat(interval.replace('+', '').replace('s', ''));
    return !isNaN(num) && num > 0 && num <= 1.0;
  };

  const getLiveDriverStints = (d: DriverLive): StintItem[] => {
    if (!d.tyre) return [];
    const pits = d.pitStops ?? 0;
    const currentCompound = d.tyre.compound;
    const currentLaps = d.tyre.laps;

    if (pits === 0) {
      return [{ compound: currentCompound, laps: currentLaps, isCurrent: true, stintNumber: 1 }];
    }

    if (pits === 1) {
      const prevComp = currentCompound === 'HARD' ? 'MEDIUM' : 'HARD';
      const prevLaps = Math.max(Math.round(currentLaps * 1.1), 18);
      return [
        { compound: prevComp, laps: prevLaps, stintNumber: 1 },
        { compound: currentCompound, laps: currentLaps, isCurrent: true, stintNumber: 2 },
      ];
    }

    // 2 or more pits
    return [
      { compound: 'MEDIUM', laps: 18, stintNumber: 1 },
      { compound: 'HARD', laps: 24, stintNumber: 2 },
      { compound: currentCompound, laps: currentLaps, isCurrent: true, stintNumber: 3 },
    ];
  };

  const isDriverRetired = (d: DriverLive) =>
    d.status === 'DNF' ||
    d.status === 'DNS' ||
    d.status === 'DSQ' ||
    d.gap === 'RET' ||
    d.interval === 'RET' ||
    d.pos >= 90;

  // Deduplicate drivers strictly by driverNumber to prevent duplicate rows when lapped or overtaken
  const activeDrivers = useMemo(() => {
    if (!drivers || drivers.length === 0) return [];
    return drivers
      .filter((d) => !isDriverRetired(d))
      .reduce<DriverLive[]>((acc, current) => {
        if (!acc.some((item) => item.driverNumber === current.driverNumber)) {
          acc.push(current);
        }
        return acc;
      }, []);
  }, [drivers]);

  const activeDriverNumbers = useMemo(
    () => new Set(activeDrivers.map((d) => d.driverNumber)),
    [activeDrivers]
  );

  const retiredDrivers = useMemo(() => {
    if (!drivers || drivers.length === 0) return [];
    return drivers
      .filter((d) => isDriverRetired(d))
      .reduce<DriverLive[]>((acc, current) => {
        if (!activeDriverNumbers.has(current.driverNumber) && !acc.some((item) => item.driverNumber === current.driverNumber)) {
          acc.push(current);
        }
        return acc;
      }, []);
  }, [drivers, activeDriverNumbers]);

  const pinnedDriver = drivers?.find((d) => d.driverNumber === pinnedDriverNumber) || null;

  // Dynamic computation of fastest overall sector times in this session
  const bestSectors = useMemo(() => {
    return computeBestSessionSectors(activeDrivers);
  }, [activeDrivers]);

  // Dynamic computation of fastest pit stop in this session
  const fastestPitStop = useMemo(() => {
    if (!drivers || drivers.length === 0 || isQualy) return null;
    let best: { driver: DriverLive; time: number } | null = null;
    for (const drv of drivers) {
      if (drv.pitHistory && drv.pitHistory.length > 0) {
        for (const p of drv.pitHistory) {
          if (!best || p.stationaryTimeSec < best.time) {
            best = { driver: drv, time: p.stationaryTimeSec };
          }
        }
      } else if (typeof drv.lastPitStopDuration === 'number' && drv.lastPitStopDuration > 0) {
        if (!best || drv.lastPitStopDuration < best.time) {
          best = { driver: drv, time: drv.lastPitStopDuration };
        }
      }
    }
    return best;
  }, [drivers, isQualy]);

  if (!drivers || drivers.length === 0) {
    return (
      <div className="bg-[#131722] border border-white/[0.08] rounded-xl p-8 text-center text-zinc-500 text-sm">
        {lang === 'es'
          ? 'No hay datos de telemetría disponibles en este momento.'
          : 'No telemetry data available at this moment.'}
      </div>
    );
  }

  return (
    <div className="bg-[#131722] border border-white/[0.08] rounded-xl shadow-lg overflow-hidden">
      {/* Top Utility / Action Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#171C28] border-b border-white/[0.08] text-xs font-mono select-none">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            {isQualy ? t.live.qualyProgress : t.live.liveTimes}
          </span>
          {pinnedDriver && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20 font-bold">
              <span>⭐</span> {pinnedDriver.code}
            </span>
          )}
          {fastestPitStop && (
            <span
              className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold tracking-tight shadow-xs"
              title={
                lang === 'es'
                  ? `Parada más rápida oficial DHL: ${fastestPitStop.driver.fullName} (${fastestPitStop.time.toFixed(2)}s)`
                  : `DHL Fastest Pit Stop: ${fastestPitStop.driver.fullName} (${fastestPitStop.time.toFixed(2)}s)`
              }
            >
              <span className="text-amber-400">⚡</span>
              <span className="hidden sm:inline text-zinc-400 font-normal">DHL:</span>
              <span className="text-white font-black">{fastestPitStop.driver.code}</span>
              <span className="text-amber-400 font-mono font-black">
                {fastestPitStop.time.toFixed(2)}s
              </span>
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={openGeneralH2H}
          className="px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
          title={t.live.h2h.title}
        >
          <span>{t.live.h2hBtn}</span>
        </button>
      </div>

      {/* ⭐ TU PILOTO Sticky Highlight Card */}
      {pinnedDriver && (
        <div className="bg-[#151A25] border-b-2 border-amber-500/40 px-3 py-2.5 relative select-none">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center gap-1 tracking-wider uppercase shadow-xs">
                {t.live.yourDriver}
              </span>
              <span className="text-[10px] text-zinc-400 font-mono hidden sm:inline">
                {pinnedDriver.teamName}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => openH2HWithDriver(pinnedDriver.driverNumber)}
                className="px-2 py-0.5 rounded-md bg-white/[0.08] hover:bg-white/[0.14] text-white font-mono text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer border border-white/10"
                title={t.live.h2h.title}
              >
                <span>⚔️</span>
                <span>1 vs 1</span>
              </button>

              <button
                type="button"
                onClick={() => togglePin(pinnedDriver.driverNumber)}
                className="w-6 h-6 rounded flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title={t.live.unpinDriver}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Pinned Driver Data Row */}
          <div className="grid grid-cols-12 gap-1 items-center">
            {/* Position */}
            <div className="col-span-1 flex flex-col items-center justify-center leading-none">
              <span className="font-mono text-xs sm:text-sm font-black text-amber-300">
                P{pinnedDriver.pos}
              </span>
              {!isQualy && pinnedDriver.posChange > 0 && (
                <span className="text-[8px] sm:text-[9px] text-emerald-400 font-bold font-mono mt-0.5">
                  ▲{pinnedDriver.posChange}
                </span>
              )}
              {!isQualy && pinnedDriver.posChange < 0 && (
                <span className="text-[8px] sm:text-[9px] text-rose-400 font-bold font-mono mt-0.5">
                  ▼{Math.abs(pinnedDriver.posChange)}
                </span>
              )}
            </div>

            {/* Code, Number & Name */}
            <div
              className="col-span-4 sm:col-span-3 flex items-center gap-1.5 overflow-hidden"
            >
              <span
                className="w-1.5 h-6 sm:h-7 rounded-full shrink-0"
                style={{ backgroundColor: pinnedDriver.teamColor || '#E10600' }}
              />
              <div className="flex flex-col leading-tight truncate">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openDriverProfile(undefined, pinnedDriver.code, pinnedDriver.fullName);
                    }}
                    className="font-mono text-sm font-black text-white hover:text-[#FFD60A] transition-colors underline decoration-white/20 hover:decoration-[#FFD60A]/60 cursor-pointer"
                    title={lang === 'es' ? 'Ver ficha oficial del piloto' : 'View driver profile'}
                  >
                    {pinnedDriver.code}
                  </button>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    #{pinnedDriver.driverNumber}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400 group-hover:text-zinc-200 truncate transition-colors">
                  {pinnedDriver.fullName}
                </span>
              </div>
            </div>

            {/* Tyres */}
            <div className="col-span-2 sm:col-span-2 text-center flex justify-center">
              <TyreBadge tyre={pinnedDriver.tyre} lang={lang} />
            </div>

            {/* Pit Stop (Hidden on narrow mobile) */}
            <div className="hidden sm:flex sm:col-span-1 flex-col items-center justify-center font-mono text-xs text-zinc-400 leading-tight">
              <span className="font-bold text-white">{pinnedDriver.pitStops ?? 0}P</span>
              {pinnedDriver.lastPitStopDuration ? (
                <span
                  className={`text-[8.5px] mt-0.5 ${
                    fastestPitStop && fastestPitStop.time === pinnedDriver.lastPitStopDuration
                      ? 'text-amber-400 font-extrabold'
                      : 'text-zinc-400 font-medium'
                  }`}
                >
                  {pinnedDriver.lastPitStopDuration.toFixed(1)}s
                </span>
              ) : null}
            </div>

            {/* Interval & Gap */}
            <div className="col-span-2 sm:col-span-3 text-right flex flex-col justify-center leading-tight pr-1">
              <span className="font-mono text-xs font-bold text-zinc-200 truncate">
                {pinnedDriver.gap}
              </span>
              {pinnedDriver.interval && pinnedDriver.interval !== 'LEADER' && (
                <div className="flex items-center justify-end gap-1">
                  {!isQualy && (pinnedDriver.isOvertakeZone || isCloseInterval(pinnedDriver.interval)) && (
                    <span
                      className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[7px] sm:text-[8px] font-mono font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider animate-pulse select-none shrink-0"
                      title={lang === 'es' ? 'Modo Overtake (MOM) habilitado (< 1.0s)' : 'Overtake Mode (MOM) active (< 1.0s)'}
                    >
                      OVERTAKE
                    </span>
                  )}
                  <span
                    className={`font-mono text-[10px] truncate ${
                      !isQualy && (pinnedDriver.isOvertakeZone || isCloseInterval(pinnedDriver.interval))
                        ? 'text-emerald-400 font-extrabold'
                        : 'text-zinc-400'
                    }`}
                  >
                    INT {pinnedDriver.interval}
                  </span>
                </div>
              )}
            </div>

            {/* Last Lap Time */}
            <div className="col-span-3 sm:col-span-2 text-right flex flex-col justify-center leading-tight">
              <span className="font-mono text-xs font-bold text-zinc-300">
                {pinnedDriver.lastLapTime || '--:--.---'}
              </span>
              {pinnedDriver.isFastestLap && (
                <span className="text-[8px] sm:text-[9px] font-bold text-purple-400 uppercase">
                  {t.live.table.fastestLap}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Table Header (Polymorphic: Qualy vs Race) */}
      {isQualy ? (
        <div className="grid grid-cols-12 gap-2 sm:gap-4 px-3.5 sm:px-5 py-3 bg-[#1C2230] border-b border-white/[0.08] text-[10px] sm:text-xs font-bold tracking-wider uppercase text-zinc-400 font-mono select-none items-center">
          <div className="col-span-1 text-center whitespace-nowrap">{t.live.table.pos}</div>
          <div className="col-span-4 sm:col-span-3 whitespace-nowrap">{t.live.table.driver}</div>
          <div className="col-span-3 sm:col-span-5 text-center whitespace-nowrap">
            <span className="hidden sm:inline">SECTORES & MINI-SECTORES</span>
            <span className="sm:hidden">SECTORES</span>
          </div>
          <div className="col-span-4 sm:col-span-3 text-right whitespace-nowrap">{lang === 'es' ? 'TIEMPO / GAP' : 'TIME / GAP'}</div>
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-2 sm:gap-4 px-3.5 sm:px-5 py-3 bg-[#1C2230] border-b border-white/[0.08] text-[10px] sm:text-xs font-bold tracking-wider uppercase text-zinc-400 font-mono select-none">
          <div className="col-span-1 text-center whitespace-nowrap">{t.live.table.pos}</div>
          <div className="col-span-3 sm:col-span-3 whitespace-nowrap">{t.live.table.driver}</div>
          <div className="col-span-2 sm:col-span-2 text-center whitespace-nowrap">{t.live.table.tyre}</div>
          <div className="hidden sm:block sm:col-span-1 text-center whitespace-nowrap">{t.live.table.pit}</div>
          <div className="col-span-3 sm:col-span-3 text-right pr-2 whitespace-nowrap">GAP / INT</div>
          <div className="col-span-3 sm:col-span-2 text-right whitespace-nowrap">{t.live.table.lastLap}</div>
        </div>
      )}

      {/* Active Driver Rows (P1..P19) */}
      <div className="divide-y divide-white/[0.04]">
        {activeDrivers.map((d, index) => {
          const isExpanded = expandedDriver === d.driverNumber;
          const closeInterval = !isQualy && (d.isOvertakeZone || isCloseInterval(d.interval));
          const isPinned = pinnedDriverNumber === d.driverNumber;
          const prevDriver = index > 0 ? activeDrivers[index - 1] : null;
          const isPointsZone = isRace && d.pos <= 10;
          const totalPoints = isRace ? F1_POINTS[d.pos] || 0 : 0;
          const showPointsCutoff = isRace && d.pos > 10 && (!prevDriver || prevDriver.pos <= 10);
          const showQ2Cutoff = isQualy && d.pos > 10 && (!prevDriver || prevDriver.pos <= 10);
          const showQ1Cutoff = isQualy && d.pos > 15 && (!prevDriver || prevDriver.pos <= 15);

          return (
            <div key={d.driverNumber} className="flex flex-col">
              {/* Reborde divisorio que delimita la zona de puntos (Top 10) */}
              {showPointsCutoff && (
                <div className="relative flex items-center justify-center my-1.5 px-3 select-none">
                  <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500/80 to-transparent shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="absolute px-2.5 py-0.5 rounded-full text-[9px] font-mono font-black uppercase tracking-wider bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 shadow-xs flex items-center gap-1.5 backdrop-blur-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {lang === 'es' ? 'LÍMITE ZONA DE PUNTOS' : 'POINTS CUTOFF'}
                  </span>
                </div>
              )}

              {/* Línea divisoria de corte Q2 (eliminación P11 a P15) */}
              {showQ2Cutoff && (
                <div className="relative flex items-center justify-center my-1.5 px-3 select-none">
                  <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-rose-500/80 to-transparent shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                  <span className="absolute px-2.5 py-0.5 rounded-full text-[9px] font-mono font-black uppercase tracking-wider bg-rose-950/90 text-rose-300 border border-rose-500/50 shadow-xs flex items-center gap-1.5 backdrop-blur-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    {lang === 'es' ? 'ZONA DE ELIMINACIÓN Q2' : 'Q2 ELIMINATION ZONE'}
                  </span>
                </div>
              )}

              {/* Línea divisoria de corte Q1 (eliminación P16 a P20) */}
              {showQ1Cutoff && (
                <div className="relative flex items-center justify-center my-1.5 px-3 select-none">
                  <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-rose-500/80 to-transparent shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                  <span className="absolute px-2.5 py-0.5 rounded-full text-[9px] font-mono font-black uppercase tracking-wider bg-rose-950/90 text-rose-300 border border-rose-500/50 shadow-xs flex items-center gap-1.5 backdrop-blur-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    {lang === 'es' ? 'ZONA DE ELIMINACIÓN Q1' : 'Q1 ELIMINATION ZONE'}
                  </span>
                </div>
              )}

              {/* Level 1: Main Row (Tap to expand) */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => toggleExpand(d.driverNumber)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleExpand(d.driverNumber);
                  }
                }}
                className={`w-full text-left grid grid-cols-12 gap-2 sm:gap-4 px-3.5 sm:px-5 py-3.5 sm:py-3 items-center transition-colors select-none cursor-pointer ${
                  isExpanded ? 'bg-white/[0.05]' : 'hover:bg-white/[0.02]'
                } ${closeInterval ? 'bg-emerald-950/15' : ''} ${
                  isPinned
                    ? 'border-l-2 border-amber-400 bg-amber-500/[0.04]'
                    : isPointsZone
                    ? 'border-l-2 border-emerald-500/60'
                    : 'border-l-2 border-transparent'
                }`}
              >
                {/* Pos & Movement (Columna limpia sin solapamiento con la barra de equipo) */}
                <div className="col-span-1 flex items-center justify-center">
                  <div className="flex flex-col items-center justify-center leading-none select-none">
                    <span
                      className={`font-mono text-xs sm:text-sm font-black font-tabular text-center leading-none ${
                        d.pos === 1
                          ? 'text-[#FFD60A]'
                          : d.pos <= 3
                          ? 'text-white'
                          : isPointsZone
                          ? 'text-emerald-300'
                          : 'text-zinc-400'
                      }`}
                    >
                      {d.pos}
                    </span>
                    {!isQualy && d.posChange > 0 && (
                      <span
                        className="text-[8px] sm:text-[9px] text-emerald-400 font-bold font-mono leading-none mt-1 select-none tabular-nums"
                        title={lang === 'es' ? `Largó P${d.gridPosition ?? d.pos} (+${d.posChange})` : `Started P${d.gridPosition ?? d.pos} (+${d.posChange})`}
                      >
                        ▲{d.posChange}
                      </span>
                    )}
                    {!isQualy && d.posChange < 0 && (
                      <span
                        className="text-[8px] sm:text-[9px] text-rose-400 font-bold font-mono leading-none mt-1 select-none tabular-nums"
                        title={lang === 'es' ? `Largó P${d.gridPosition ?? d.pos} (-${Math.abs(d.posChange)})` : `Started P${d.gridPosition ?? d.pos} (-${Math.abs(d.posChange)})`}
                      >
                        ▼{Math.abs(d.posChange)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Team stripe + Star Pin + Code & Number */}
                <div className={`${isQualy ? 'col-span-4' : 'col-span-3'} sm:col-span-3 flex items-center gap-1 sm:gap-1.5 overflow-hidden`}>
                  <span
                    className="w-1 h-6 rounded-full flex-shrink-0"
                    style={{ backgroundColor: d.teamColor || '#E10600' }}
                  />
                  {/* Star Pin Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePin(d.driverNumber);
                    }}
                    className={`p-0.5 rounded transition-colors cursor-pointer shrink-0 ${
                      isPinned
                        ? 'text-amber-400'
                        : 'text-zinc-600 hover:text-amber-400/80'
                    }`}
                    title={
                      isPinned
                        ? t.live.unpinDriver
                        : `${t.live.pinDriver} (${d.code})`
                    }
                  >
                    <Star
                      className={`w-3.5 h-3.5 ${
                        isPinned ? 'fill-amber-400 text-amber-400' : ''
                      }`}
                    />
                  </button>

                  <div
                    className="flex flex-col leading-tight truncate min-w-0"
                  >
                    <div className="flex items-center gap-1 sm:gap-1.5 flex-nowrap min-w-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDriverProfile(undefined, d.code, d.fullName);
                        }}
                        className="font-mono text-xs sm:text-sm font-bold text-white tracking-tight hover:text-[#FFD60A] transition-colors underline decoration-white/20 hover:decoration-[#FFD60A]/60 shrink-0 cursor-pointer"
                        title={lang === 'es' ? 'Ver ficha oficial del piloto' : 'View driver profile'}
                      >
                        {d.code}
                      </button>
                      <span className="text-[10px] text-zinc-400 font-mono shrink-0">
                        #{d.driverNumber}
                      </span>
                      {/* Official Championship Points Badge in Race (Desktop) */}
                      {isRace && totalPoints > 0 && (
                        <span
                          className="px-1.5 py-0.5 rounded text-[9px] font-mono font-black border tracking-tight shrink-0 select-none shadow-xs hidden sm:inline-block bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                          title={
                            lang === 'es'
                              ? `Zona de puntos: +${totalPoints} pts para el Campeonato Mundial`
                              : `Points zone: +${totalPoints} pts for World Championship`
                          }
                        >
                          +{totalPoints} PTS
                        </span>
                      )}
                      {/* Active FIA Penalty Badge in Race (En rojo oficial de sanción) */}
                      {!isQualy && d.penaltySeconds && d.penaltySeconds > 0 && (
                        <span
                          className="px-1 py-0.2 sm:px-1.5 sm:py-0.5 rounded text-[8px] sm:text-[9px] font-mono font-black bg-rose-500/20 text-rose-400 border border-rose-500/40 tracking-tight shrink-0 select-none shadow-xs"
                          title={lang === 'es' ? `Penalización oficial FIA: +${d.penaltySeconds}s` : `Official FIA penalty: +${d.penaltySeconds}s`}
                        >
                          +{d.penaltySeconds}s
                        </span>
                      )}
                      {/* Elimination Phase Tag in Qualy */}
                      {isQualy && d.eliminatedPhase && (
                        <span className="px-1 py-0.2 rounded text-[8px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0">
                          {d.eliminatedPhase}
                        </span>
                      )}
                      {d.inPit && (
                        <span className="px-1 py-0.2 sm:px-1.5 sm:py-0.5 rounded text-[8px] sm:text-[9px] font-mono font-bold bg-zinc-800 text-zinc-400 border border-white/10 shrink-0">
                          PIT
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-zinc-400 group-hover/driver:text-zinc-200 truncate hidden sm:block transition-colors">
                      {d.fullName}
                    </span>
                  </div>
                </div>

                {isQualy ? (
                  <>
                    {/* Qualy Sectors & Mini-Sectors Center Column */}
                    <div className="col-span-3 sm:col-span-5 flex flex-col items-center justify-center gap-1 px-0.5 sm:px-1">
                      {/* 3 Sector Pills (Mobile & Desktop) */}
                      <div className="flex items-center justify-center gap-1 w-full flex-nowrap">
                        <SectorPill
                          sectorNumber={1}
                          time={d.sectors?.s1}
                          status={resolveSectorStatus(1, d.sectors?.s1, d.sectors?.s1Status, bestSectors)}
                          compact
                        />
                        <SectorPill
                          sectorNumber={2}
                          time={d.sectors?.s2}
                          status={resolveSectorStatus(2, d.sectors?.s2, d.sectors?.s2Status, bestSectors)}
                          compact
                        />
                        <SectorPill
                          sectorNumber={3}
                          time={d.sectors?.s3}
                          status={resolveSectorStatus(3, d.sectors?.s3, d.sectors?.s3Status, bestSectors)}
                          compact
                        />
                      </div>
                      {/* Mini-Sectors Track Bar (Desktop only) */}
                      <div className="hidden sm:block w-full max-w-[240px]">
                        <MiniSectorsBar segments={d.sectors?.segments} />
                      </div>
                    </div>

                    {/* Qualy MEJOR TIEMPO / GAP */}
                    <div className="col-span-4 sm:col-span-3 text-right flex items-center justify-end gap-1 sm:gap-1.5 shrink-0">
                      <div className="flex flex-col leading-tight">
                        <span
                          className={`font-mono text-xs font-tabular whitespace-nowrap ${
                            d.isPole
                              ? 'text-[#FFD60A] font-black'
                              : 'text-zinc-100 font-bold'
                          }`}
                        >
                          {d.bestLapTime || d.lastLapTime || '--:--.---'}
                        </span>
                        <span
                          className={`font-mono text-[10px] font-tabular whitespace-nowrap ${
                            d.isPole ? 'text-[#FFD60A] font-bold' : 'text-zinc-400'
                          }`}
                        >
                          {d.gap}
                        </span>
                      </div>
                      <div className="text-zinc-500 shrink-0">
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Columna GOMA: Círculo Oficial Pirelli (letra S/M/H/I/W) + xxV al costado (+ pit badge en mobile) */}
                    <div className="col-span-2 sm:col-span-2 flex items-center justify-center gap-0.5 sm:gap-1.5">
                      <TyreBadge tyre={d.tyre} lang={lang} />
                      {/* En mobile, badge compacto de pit integrado al lado */}
                      <div className="sm:hidden">
                        {d.inPit ? (
                          <span
                            className="px-1 py-0.5 rounded text-[8px] font-mono font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse whitespace-nowrap leading-none"
                            title={lang === 'es' ? 'En calle de boxes' : 'In pit lane'}
                          >
                            {lang === 'es' ? 'BOX' : 'PIT'}
                          </span>
                        ) : (d.pitStops ?? 0) > 0 ? (
                          <span
                            className="font-mono text-[8px] font-bold text-zinc-400 bg-[#1C2230] px-1 py-0.5 rounded border border-white/[0.08] whitespace-nowrap leading-none"
                            title={
                              d.lastPitStopDuration
                                ? lang === 'es'
                                  ? `${d.pitStops} ${d.pitStops === 1 ? 'parada' : 'paradas'} en boxes • Última: ${d.lastPitStopDuration.toFixed(1)}s detenido${d.lastPitLaneTime ? ` (${d.lastPitLaneTime.toFixed(1)}s calle)` : ''}`
                                  : `${d.pitStops} pit ${d.pitStops === 1 ? 'stop' : 'stops'} • Last: ${d.lastPitStopDuration.toFixed(1)}s stationary${d.lastPitLaneTime ? ` (${d.lastPitLaneTime.toFixed(1)}s lane)` : ''}`
                                : `${d.pitStops}P`
                            }
                          >
                            {d.pitStops}P
                          </span>
                        ) : null}
                      </div>
                    </div>

                    {/* Race PIT Stop Counter (Desktop dedicado) */}
                    <div className="hidden sm:flex sm:col-span-1 items-center justify-center">
                      {d.inPit ? (
                        <span
                          className="px-1.5 py-0.5 rounded text-[9px] font-mono font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse"
                          title={lang === 'es' ? 'En calle de boxes' : 'In pit lane'}
                        >
                          {lang === 'es' ? 'BOX' : 'PIT'}
                        </span>
                      ) : (
                        <div
                          className={`inline-flex flex-col items-center justify-center font-mono rounded-md px-1.5 py-0.5 border ${
                            (d.pitStops ?? 0) > 0
                              ? 'bg-[#1C2230] text-zinc-200 border-white/[0.12] shadow-xs'
                              : 'bg-[#0B0E14] text-zinc-500 border-white/[0.05]'
                          }`}
                          title={
                            d.lastPitStopDuration
                              ? lang === 'es'
                                ? `${d.pitStops ?? 0} ${d.pitStops === 1 ? 'parada' : 'paradas'} en boxes • Última: ${d.lastPitStopDuration.toFixed(1)}s detenido${d.lastPitLaneTime ? ` (${d.lastPitLaneTime.toFixed(1)}s pit lane)` : ''}`
                                : `${d.pitStops ?? 0} pit ${d.pitStops === 1 ? 'stop' : 'stops'} • Last: ${d.lastPitStopDuration.toFixed(1)}s stationary${d.lastPitLaneTime ? ` (${d.lastPitLaneTime.toFixed(1)}s pit lane)` : ''}`
                              : (d.pitStops ?? 0) > 0
                                ? `${d.pitStops} ${d.pitStops === 1 ? 'parada' : 'paradas'} en boxes`
                                : lang === 'es' ? 'Sin paradas en boxes' : '0 pit stops'
                          }
                        >
                          <span className="text-[10px] font-bold leading-none">{d.pitStops ?? 0}P</span>
                          {d.lastPitStopDuration ? (
                            <span
                              className={`text-[8px] leading-tight mt-0.5 ${
                                fastestPitStop && fastestPitStop.time === d.lastPitStopDuration
                                  ? 'text-amber-400 font-extrabold'
                                  : d.lastPitStopDuration <= 2.3
                                  ? 'text-amber-300/90 font-bold'
                                  : 'text-zinc-400'
                              }`}
                            >
                              {d.lastPitStopDuration.toFixed(1)}s
                            </span>
                          ) : null}
                        </div>
                      )}
                    </div>

                    {/* Race Gap & Interval - 3 columnas con espacio suficiente */}
                    <div className="col-span-3 sm:col-span-3 text-right flex flex-col justify-center leading-tight pr-1 sm:pr-2">
                      <span className="font-mono text-xs font-semibold text-zinc-200 font-tabular truncate">
                        {d.gap}
                      </span>
                      {d.interval && d.interval !== 'LEADER' && (
                        <div className="flex items-center justify-end gap-1">
                          {/* Quick H2H Battle Launcher */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openH2HWithDriver(d.driverNumber);
                            }}
                            className="p-0.5 rounded bg-white/[0.04] hover:bg-amber-500/20 text-zinc-500 hover:text-amber-300 border border-white/[0.06] hover:border-amber-500/30 transition-all shrink-0 cursor-pointer"
                            title={
                              lang === 'es'
                                ? `Comparar batalla 1 vs 1 con ${prevDriver ? prevDriver.code : 'auto rival'}`
                                : `Compare 1 vs 1 battle with ${prevDriver ? prevDriver.code : 'rival'}`
                            }
                          >
                            <Swords className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          </button>
                          {closeInterval && (
                            <span
                              className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[8px] font-mono font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 tracking-wider uppercase animate-pulse select-none shrink-0"
                              title={lang === 'es' ? 'Modo Overtake (MOM) habilitado (< 1.0s del auto de adelante)' : 'Overtake Mode (MOM) active (< 1.0s behind car ahead)'}
                            >
                              OVERTAKE
                            </span>
                          )}
                          <span
                            className={`font-mono text-[10px] font-tabular ${
                              closeInterval
                                ? 'text-emerald-400 font-extrabold'
                                : 'text-zinc-500'
                            }`}
                          >
                            {d.interval}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Race Last Lap & Fastest Lap Badge - 3 columnas en mobile con separación clara */}
                    <div className="col-span-3 sm:col-span-2 text-right flex items-center justify-end gap-1 pl-1">
                      <div className="flex flex-col leading-tight">
                        <span
                          className={`font-mono text-xs font-tabular ${
                            d.isFastestLap
                              ? 'text-purple-400 font-extrabold'
                              : 'text-zinc-300'
                          }`}
                        >
                          {d.lastLapTime || '--:--.---'}
                        </span>
                        {d.isFastestLap && (
                          <span className="text-[8px] sm:text-[9px] font-bold text-purple-400 uppercase tracking-tighter">
                            <span className="hidden sm:inline">{t.live.table.fastestLap}</span>
                            <span className="sm:hidden">{t.live.table.fastestLapShort}</span>
                          </span>
                        )}
                      </div>
                      <div className="text-zinc-500 hidden sm:block">
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Level 2: Expanded Micro-Sectors & Details */}
              {isExpanded && (
                <div className="bg-[#0B0E14] border-t border-b border-white/[0.06] px-4 py-3 text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: d.teamColor }}
                      />
                      <span className="font-bold text-white text-sm">
                        {d.fullName}
                      </span>
                      <span className="text-zinc-400 text-xs">
                        ({d.teamName})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {isRace && (
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                            totalPoints > 0
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                              : 'bg-white/[0.04] text-zinc-500 border border-white/[0.06]'
                          }`}
                        >
                          {totalPoints > 0
                            ? `+${totalPoints} ${t.live.table.pointsChampionship}`
                            : t.live.table.outOfPoints}
                        </span>
                      )}
                      {!isQualy && d.penaltySeconds && d.penaltySeconds > 0 && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-rose-500/20 text-rose-400 border border-rose-500/40">
                          {lang === 'es' ? 'PENALIZACIÓN' : 'PENALTY'}: +{d.penaltySeconds}s
                        </span>
                      )}
                      {closeInterval && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {lang === 'es' ? 'OVERTAKE HABILITADO (< 1.0s)' : 'OVERTAKE AVAILABLE (< 1.0s)'}
                        </span>
                      )}
                      <span className="font-mono text-[10px] text-zinc-400">
                        {t.live.table.pitStops} <strong className="text-white">{d.pitStops ?? 0}</strong>
                      </span>
                      {d.status !== 'ACTIVE' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          {d.status}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Driver Quick Actions: ⭐ Tu Piloto & ⚔️ 1 vs 1 */}
                  <div className="flex items-center gap-2 mb-2.5 pb-2.5 border-b border-white/[0.06] flex-wrap">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePin(d.driverNumber);
                      }}
                      className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        pinnedDriverNumber === d.driverNumber
                          ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                          : 'bg-white/[0.04] text-zinc-300 border-white/10 hover:bg-white/[0.08]'
                      }`}
                    >
                      <Star
                        className={`w-3 h-3 ${
                          pinnedDriverNumber === d.driverNumber ? 'fill-amber-400 text-amber-400' : ''
                        }`}
                      />
                      <span>
                        {pinnedDriverNumber === d.driverNumber
                          ? t.live.unpinDriver
                          : t.live.pinDriver}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openH2HWithDriver(d.driverNumber);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.04] text-zinc-300 hover:text-white border border-white/10 hover:bg-white/[0.08] text-[11px] font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>⚔️</span>
                      <span>{t.live.h2hBtn}</span>
                    </button>

                    {(() => {
                      const teammate = drivers.find(
                        (other) =>
                          other.driverNumber !== d.driverNumber &&
                          other.teamName &&
                          d.teamName &&
                          (other.teamName.toLowerCase() === d.teamName.toLowerCase() ||
                            other.teamName.toLowerCase().includes(d.teamName.toLowerCase()) ||
                            d.teamName.toLowerCase().includes(other.teamName.toLowerCase()))
                      );
                      if (!teammate) return null;
                      return (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openH2HWithTeammate(d.driverNumber, teammate.driverNumber);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 hover:text-amber-200 border border-amber-400/30 text-[11px] font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                          title={lang === 'es' ? `Comparar duelo directo con su compañero ${teammate.fullName || teammate.code}` : `Direct duel vs teammate ${teammate.fullName || teammate.code}`}
                        >
                          <Swords className="w-3 h-3 text-amber-400" />
                          <span>{lang === 'es' ? `vs Compañero (${teammate.code})` : `vs Teammate (${teammate.code})`}</span>
                        </button>
                      );
                    })()}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDriverProfile(d.driverNumber, d.code, d.fullName);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.04] text-zinc-300 hover:text-white border border-white/10 hover:bg-white/[0.08] text-[11px] font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>👤</span>
                      <span>{lang === 'es' ? 'Ficha de Piloto' : 'Driver Profile'}</span>
                    </button>
                  </div>

                  {/* Detailed Mini-Sectors Bar */}
                  <MiniSectorsBar segments={d.sectors?.segments} detailed />

                  {/* Sectors and Speed Trap Grid with SectorPill */}
                  <div className="grid grid-cols-3 gap-2">
                    <SectorPill
                      sectorNumber={1}
                      time={d.sectors?.s1}
                      status={resolveSectorStatus(1, d.sectors?.s1, d.sectors?.s1Status, bestSectors)}
                    />
                    <SectorPill
                      sectorNumber={2}
                      time={d.sectors?.s2}
                      status={resolveSectorStatus(2, d.sectors?.s2, d.sectors?.s2Status, bestSectors)}
                    />
                    <SectorPill
                      sectorNumber={3}
                      time={d.sectors?.s3}
                      status={resolveSectorStatus(3, d.sectors?.s3, d.sectors?.s3Status, bestSectors)}
                    />
                  </div>

                  {/* Speed Traps & Telemetry Grid */}
                  <div className="grid grid-cols-3 gap-2 font-mono text-center">
                    <div className="bg-[#131722] border border-white/[0.06] rounded-lg p-2 flex flex-col items-center justify-center">
                      <span className="text-[10px] text-zinc-500 uppercase flex items-center gap-1">
                        <Gauge className="w-2.5 h-2.5 text-[#27F4D2]" /> Speed Trap
                      </span>
                      <span className="font-bold text-[#27F4D2] text-xs font-tabular mt-0.5">
                        {d.speedTrap ? `${d.speedTrap} km/h` : '---'}
                      </span>
                    </div>

                    <div className="bg-[#131722] border border-white/[0.06] rounded-lg p-2 flex flex-col items-center justify-center">
                      <span className="text-[10px] text-zinc-500 uppercase">
                        Trap Sector 1 (I1)
                      </span>
                      <span className="font-bold text-zinc-300 text-xs font-tabular mt-0.5">
                        {d.i1Speed ? `${d.i1Speed} km/h` : '---'}
                      </span>
                    </div>

                    <div className="bg-[#131722] border border-white/[0.06] rounded-lg p-2 flex flex-col items-center justify-center">
                      <span className="text-[10px] text-zinc-500 uppercase">
                        Trap Sector 2 (I2)
                      </span>
                      <span className="font-bold text-zinc-300 text-xs font-tabular mt-0.5">
                        {d.i2Speed ? `${d.i2Speed} km/h` : '---'}
                      </span>
                    </div>
                  </div>

                  {/* Live Tyre Stints Strategy Bar */}
                  {!isQualy && d.tyre && (
                    <div className="bg-[#131722] border border-white/[0.06] rounded-lg p-2.5 mt-2">
                      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-1.5 uppercase font-semibold">
                        <span>{lang === 'es' ? 'Estrategia de Neumáticos en Carrera' : 'Race Tyre Stints'}</span>
                        <span className="text-zinc-500">
                          {(d.pitStops ?? 0) > 0
                            ? `${d.pitStops} ${d.pitStops === 1 ? (lang === 'es' ? 'parada' : 'stop') : (lang === 'es' ? 'paradas' : 'stops')}`
                            : (lang === 'es' ? 'Sin paradas' : '0 stops')}
                        </span>
                      </div>
                      <TyreStintBar
                        stints={getLiveDriverStints(d)}
                        lang={lang}
                      />
                    </div>
                  )}

                  {/* Detalle de Paradas en Boxes (Pit Stops Breakdown) */}
                  {!isQualy &&
                    ((d.pitHistory && d.pitHistory.length > 0) ||
                      (typeof d.lastPitStopDuration === 'number' && d.lastPitStopDuration > 0)) && (
                      <div className="bg-[#131722] border border-white/[0.06] rounded-lg p-2.5 mt-2">
                        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-2 uppercase font-semibold">
                          <div className="flex items-center gap-1.5">
                            <span className="text-amber-400">⏱️</span>
                            <span>
                              {lang === 'es'
                                ? 'Detalle de Paradas en Boxes'
                                : 'Pit Stop Breakdown'}
                            </span>
                          </div>
                          <span className="text-zinc-500">
                            {(d.pitStops ?? 0) > 0
                              ? `${d.pitStops} ${d.pitStops === 1 ? (lang === 'es' ? 'parada registrada' : 'stop recorded') : (lang === 'es' ? 'paradas registradas' : 'stops recorded')}`
                              : ''}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {d.pitHistory && d.pitHistory.length > 0 ? (
                            d.pitHistory.map((pit) => {
                              const isFastestInSession =
                                fastestPitStop && fastestPitStop.time === pit.stationaryTimeSec;
                              return (
                                <div
                                  key={pit.stopNumber}
                                  className={`flex items-center justify-between p-2 rounded-lg border text-xs font-mono transition-colors ${
                                    isFastestInSession
                                      ? 'bg-amber-500/[0.08] border-amber-500/30'
                                      : 'bg-[#0B0E14] border-white/[0.06]'
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="px-1.5 py-0.5 rounded bg-white/10 text-white font-black text-[10px]">
                                      #{pit.stopNumber}
                                    </span>
                                    <span className="text-zinc-400 text-[11px]">
                                      {lang === 'es' ? `Vuelta ${pit.lap}` : `Lap ${pit.lap}`}
                                    </span>
                                    {pit.tyresIn && pit.tyresOut && (
                                      <span className="text-[10px] text-zinc-400 flex items-center gap-1 bg-white/[0.04] px-1.5 py-0.5 rounded">
                                        <span className="font-bold text-zinc-300">
                                          {pit.tyresIn[0]}
                                        </span>
                                        <span className="text-zinc-500 text-[8px]">➔</span>
                                        <span className="font-bold text-white">
                                          {pit.tyresOut[0]}
                                        </span>
                                      </span>
                                    )}
                                  </div>

                                  <div className="text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                      <span
                                        className={`font-black text-xs ${
                                          isFastestInSession ? 'text-amber-400' : 'text-zinc-100'
                                        }`}
                                      >
                                        {pit.stationaryTimeSec.toFixed(2)}s
                                      </span>
                                      {isFastestInSession && (
                                        <span className="text-[8px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 uppercase font-black tracking-wider select-none">
                                          DHL Best
                                        </span>
                                      )}
                                    </div>
                                    {pit.pitLaneDurationSec && (
                                      <span className="text-[9px] text-zinc-500 block">
                                        {lang === 'es'
                                          ? `${pit.pitLaneDurationSec.toFixed(1)}s en calle`
                                          : `${pit.pitLaneDurationSec.toFixed(1)}s lane`}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="flex items-center justify-between p-2 rounded-lg border border-white/[0.06] bg-[#0B0E14] text-xs font-mono">
                              <span className="text-zinc-400">
                                {lang === 'es' ? 'Última parada' : 'Last pit stop'}
                              </span>
                              <div className="text-right">
                                <span className="font-black text-white">
                                  {d.lastPitStopDuration?.toFixed(2)}s
                                </span>
                                {d.lastPitLaneTime && (
                                  <span className="text-[9px] text-zinc-500 block">
                                    {lang === 'es'
                                      ? `${d.lastPitLaneTime.toFixed(1)}s en calle`
                                      : `${d.lastPitLaneTime.toFixed(1)}s lane`}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Abandonos / DNF Segregated Section */}
      {retiredDrivers.length > 0 && (
        <div className="border-t-2 border-white/[0.1] bg-[#0E1118]">
          {/* Section Header */}
          <div className="flex items-center justify-between px-3 py-2 bg-[#171B26] border-b border-white/[0.08] select-none">
            <div className="flex items-center gap-2 font-mono text-[10px] font-bold tracking-wider text-rose-400 uppercase">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>{lang === 'es' ? 'Abandonos / DNF' : 'Retirements / DNF'}</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30 tracking-widest uppercase">
              {retiredDrivers.length} {retiredDrivers.length === 1 ? (lang === 'es' ? 'PILOTO' : 'DRIVER') : (lang === 'es' ? 'PILOTOS' : 'DRIVERS')}
            </span>
          </div>

          {/* Retired Driver Rows */}
          <div className="divide-y divide-white/[0.04]">
            {retiredDrivers.map((d) => {
              const isExpanded = expandedDriver === d.driverNumber;

              return (
                <div
                  key={d.driverNumber}
                  className="flex flex-col opacity-85 hover:opacity-100 transition-opacity"
                >
                  <button
                    type="button"
                    onClick={() => toggleExpand(d.driverNumber)}
                    className={`w-full text-left grid grid-cols-12 gap-1 px-3 py-2.5 items-center transition-colors select-none ${
                      isExpanded ? 'bg-white/[0.05]' : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    {/* DNF Badge in Position column */}
                    <div className="col-span-1 flex items-center justify-center">
                      <span className="font-mono text-[10px] font-black text-rose-400 bg-rose-500/15 px-1 py-0.5 rounded border border-rose-500/30">
                        DNF
                      </span>
                    </div>

                    {/* Team stripe + Code & Number */}
                    <div className="col-span-4 sm:col-span-3 flex items-center gap-2 overflow-hidden">
                      <span
                        className="w-1 h-6 rounded-full flex-shrink-0"
                        style={{ backgroundColor: d.teamColor || '#71717A' }}
                      />
                      <div className="flex flex-col leading-tight truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-sm font-bold text-zinc-300 tracking-tight">
                            {d.code}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            #{d.driverNumber}
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-400 truncate hidden sm:block">
                          {d.fullName}
                        </span>
                      </div>
                    </div>

                    {/* Columna GOMA: Círculo Oficial Pirelli + Vueltas */}
                    <div className="col-span-2 sm:col-span-2 flex items-center justify-center">
                      <TyreBadge tyre={d.tyre} lang={lang} />
                    </div>

                    {/* Columna PIT: Separada, conteo de paradas */}
                    <div className="col-span-1 sm:col-span-1 flex items-center justify-center">
                      <span className="inline-flex items-center justify-center font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-md border bg-[#0B0E14] text-zinc-500 border-white/[0.05]">
                        {d.pitStops ?? 0}P
                      </span>
                    </div>

                    {/* Retired Lap / Status */}
                    <div className="col-span-2 sm:col-span-2 text-right flex flex-col justify-center leading-tight">
                      <span className="font-mono text-xs font-semibold text-zinc-300">
                        {d.retiredLap ? `${lang === 'es' ? 'Vta' : 'Lap'} ${d.retiredLap}` : 'RET'}
                      </span>
                      <span className="text-[9px] text-zinc-500 font-mono">
                        {lang === 'es' ? 'RETIRO' : 'RETIRED'}
                      </span>
                    </div>

                    {/* Retirement Cause Badge */}
                    <div className="col-span-2 sm:col-span-3 text-right flex items-center justify-end gap-1.5">
                      <span
                        className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium text-rose-300 bg-rose-500/10 border border-rose-500/20 truncate max-w-[120px] sm:max-w-[170px]"
                        title={d.retirementReason || (lang === 'es' ? 'Abandono' : 'Retired')}
                      >
                        {d.retirementReason || (lang === 'es' ? 'Abandono' : 'Retired')}
                      </span>
                      <div className="text-zinc-500 hidden sm:block">
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Level 2: Expanded Details for Retired Driver */}
                  {isExpanded && (
                    <div className="bg-[#0B0E14] border-t border-b border-white/[0.06] px-4 py-3 text-xs">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: d.teamColor }}
                          />
                          <span className="font-bold text-white text-sm">
                            {d.fullName}
                          </span>
                          <span className="text-zinc-400 text-xs">
                            ({d.teamName})
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          {d.retirementReason ? `DNF • ${d.retirementReason}` : 'DNF'}
                        </span>
                      </div>
                      <div className="text-zinc-400 text-xs font-mono">
                        {lang === 'es' ? (
                          <>
                            Cese de telemetría registrado en la vuelta{' '}
                            <strong className="text-white">{d.retiredLap || '--'}</strong>. Motivo:{' '}
                            <span className="text-rose-300 font-semibold">
                              {d.retirementReason || 'Abandono'}
                            </span>
                            .
                          </>
                        ) : (
                          <>
                            Telemetry loss recorded on lap{' '}
                            <strong className="text-white">{d.retiredLap || '--'}</strong>. Reason:{' '}
                            <span className="text-rose-300 font-semibold">
                              {d.retirementReason || 'Retired'}
                            </span>
                            .
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ⚔️ Head-to-Head 1 vs 1 Modal */}
      {isH2HOpen && (
        <Suspense fallback={null}>
          <HeadToHeadModal
            isOpen={isH2HOpen}
            onClose={() => setIsH2HOpen(false)}
            drivers={drivers}
            driverAId={h2hDriverA}
            driverBId={h2hDriverB}
            onSelectDriverA={setH2hDriverA}
            onSelectDriverB={setH2hDriverB}
          />
        </Suspense>
      )}

      {/* 👤 Official Driver Profile Modal */}
      {isProfileOpen && (
        <Suspense fallback={null}>
          <DriverProfileModal
            isOpen={isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
            profile={selectedProfile}
            isPinned={selectedProfile ? pinnedDriverNumber === selectedProfile.number : false}
            onTogglePin={(num) => togglePin(num)}
            onCompare={(num, teammateNum) => {
              setIsProfileOpen(false);
              if (teammateNum) {
                openH2HWithTeammate(num, teammateNum);
              } else {
                openH2HWithDriver(num);
              }
            }}
          />
        </Suspense>
      )}
    </div>
  );
};
