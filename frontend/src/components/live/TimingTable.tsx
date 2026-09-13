import { useState } from 'react';
import { ChevronDown, ChevronUp, Gauge, Star, X } from 'lucide-react';
import type { DriverLive, SessionType, TyreCompound } from '../../types/f1';
import { useLanguage } from '../../hooks/useLanguage';
import { MiniSectorsBar } from '../qualy/MiniSectorsBar';
import { SectorPill } from '../qualy/SectorPill';
import { HeadToHeadModal } from './HeadToHeadModal';
import { DriverProfileModal } from '../drivers/DriverProfileModal';
import { getF1DriverProfile, type F1DriverProfile } from '../../data/f1DriversData';

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

  const openDriverProfile = (driverNumber?: number | string, code?: string, fullName?: string) => {
    const profile =
      (code ? getF1DriverProfile(code) : undefined) ||
      (fullName ? getF1DriverProfile(fullName) : undefined) ||
      (driverNumber !== undefined ? getF1DriverProfile(driverNumber) : undefined);
    if (profile) {
      setSelectedProfile(profile);
      setIsProfileOpen(true);
    }
  };

  // 📌 Driver Pinning (⭐ TU PILOTO)
  const [pinnedDriverNumber, setPinnedDriverNumber] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem('f1_pinned_driver');
      return saved ? parseInt(saved, 10) : null;
    } catch {
      return null;
    }
  });

  // ⚔️ 1 vs 1 Head-to-Head Modal state
  const [isH2HOpen, setIsH2HOpen] = useState(false);
  const [h2hDriverA, setH2hDriverA] = useState<number | null>(null);
  const [h2hDriverB, setH2hDriverB] = useState<number | null>(null);

  const togglePin = (driverNumber: number) => {
    setPinnedDriverNumber((prev) => {
      const next = prev === driverNumber ? null : driverNumber;
      try {
        if (next === null) {
          localStorage.removeItem('f1_pinned_driver');
        } else {
          localStorage.setItem('f1_pinned_driver', String(next));
        }
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

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

  const getTyreBadge = (tyre: { compound: TyreCompound; laps: number } | null) => {
    if (!tyre) return null;
    const compound = tyre.compound.toUpperCase();
    let letter = 'H';
    let ringClass = 'border-white text-white bg-white/10';

    if (compound.includes('SOFT')) {
      letter = 'S';
      ringClass = 'border-[#FF3B30] text-[#FF3B30] bg-[#FF3B30]/10';
    } else if (compound.includes('MEDIUM')) {
      letter = 'M';
      ringClass = 'border-[#FFD60A] text-[#FFD60A] bg-[#FFD60A]/10';
    } else if (compound.includes('HARD')) {
      letter = 'H';
      ringClass = 'border-white text-white bg-white/10';
    } else if (compound.includes('INTER')) {
      letter = 'I';
      ringClass = 'border-[#34C759] text-[#34C759] bg-[#34C759]/10';
    } else if (compound.includes('WET')) {
      letter = 'W';
      ringClass = 'border-[#007AFF] text-[#007AFF] bg-[#007AFF]/10';
    }

    return (
      <div
        className="inline-flex items-center gap-1.5 select-none"
        title={
          lang === 'es'
            ? `Compuesto Pirelli ${tyre.compound} (${tyre.laps} vueltas)`
            : `Pirelli compound ${tyre.compound} (${tyre.laps} laps)`
        }
      >
        {/* Círculo oficial Pirelli con la letra S / M / H / I / W */}
        <span
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center font-mono font-black text-[11px] leading-none shrink-0 ${ringClass}`}
        >
          {letter}
        </span>
        {/* Vueltas al costado, bien legible (ej: 38v / 38l) */}
        <span className="font-mono text-xs font-bold text-zinc-300 tabular-nums">
          {tyre.laps}{lang === 'es' ? 'v' : 'l'}
        </span>
      </div>
    );
  };

  const isCloseInterval = (interval: string) => {
    if (!interval || interval === 'LEADER' || interval.includes('LAP') || interval === 'RET') return false;
    const num = parseFloat(interval.replace('+', '').replace('s', ''));
    return !isNaN(num) && num > 0 && num <= 1.0;
  };

  if (!drivers || drivers.length === 0) {
    return (
      <div className="bg-[#131722] border border-white/[0.08] rounded-xl p-8 text-center text-zinc-500 text-sm">
        {lang === 'es'
          ? 'No hay datos de telemetría disponibles en este momento.'
          : 'No telemetry data available at this moment.'}
      </div>
    );
  }

  const isDriverRetired = (d: DriverLive) =>
    d.status === 'DNF' ||
    d.status === 'DNS' ||
    d.status === 'DSQ' ||
    d.gap === 'RET' ||
    d.interval === 'RET' ||
    d.pos >= 90;

  const activeDrivers = drivers.filter((d) => !isDriverRetired(d));
  const retiredDrivers = drivers.filter((d) => isDriverRetired(d));
  const pinnedDriver = drivers.find((d) => d.driverNumber === pinnedDriverNumber) || null;

  return (
    <div className="bg-[#131722] border border-white/[0.08] rounded-xl shadow-lg overflow-hidden">
      {/* Top Utility / Action Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#171C28] border-b border-white/[0.08] text-xs font-mono select-none">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            {isQualy ? t.live.qualyProgress : t.live.liveTimes}
          </span>
          {pinnedDriver && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20 font-bold">
              <span>⭐</span> {pinnedDriver.code}
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
              className="col-span-4 sm:col-span-3 flex items-center gap-1.5 overflow-hidden cursor-pointer group"
              onClick={() => openDriverProfile(pinnedDriver.driverNumber, pinnedDriver.code, pinnedDriver.fullName)}
              title={lang === 'es' ? 'Ver ficha oficial del piloto' : 'View driver profile'}
            >
              <span
                className="w-1.5 h-6 sm:h-7 rounded-full shrink-0 group-hover:scale-y-110 transition-transform"
                style={{ backgroundColor: pinnedDriver.teamColor || '#E10600' }}
              />
              <div className="flex flex-col leading-tight truncate">
                <div className="flex items-center gap-1">
                  <span className="font-mono text-sm font-black text-white group-hover:text-[#FFD60A] transition-colors underline decoration-white/20 group-hover:decoration-[#FFD60A]/60">
                    {pinnedDriver.code}
                  </span>
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
              {getTyreBadge(pinnedDriver.tyre)}
            </div>

            {/* Pit Stop (Hidden on narrow mobile) */}
            <div className="hidden sm:block sm:col-span-1 text-center font-mono text-xs text-zinc-400">
              <span className="font-bold text-white">{pinnedDriver.pitStops ?? 0}</span>
            </div>

            {/* Interval & Gap */}
            <div className="col-span-2 sm:col-span-3 text-right flex flex-col justify-center leading-tight pr-1">
              <span className="font-mono text-xs font-bold text-zinc-200 truncate">
                {pinnedDriver.gap}
              </span>
              {pinnedDriver.interval && pinnedDriver.interval !== 'LEADER' && (
                <div className="flex items-center justify-end gap-1">
                  {!isQualy && (pinnedDriver.isOvertakeZone || pinnedDriver.isDrsZone || isCloseInterval(pinnedDriver.interval)) && (
                    <span
                      className="px-1 py-0.2 rounded text-[7px] font-mono font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider animate-pulse"
                      title={lang === 'es' ? 'Modo Overtake habilitado (< 1.0s)' : 'Overtake Mode active (< 1.0s)'}
                    >
                      OVERTAKE
                    </span>
                  )}
                  <span className="font-mono text-[10px] text-zinc-400 truncate">
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
          <div className="col-span-1 text-center">{t.live.table.pos}</div>
          <div className="col-span-4 sm:col-span-3">{t.live.table.driver}</div>
          <div className="col-span-3 sm:col-span-5 text-center">
            <span className="hidden sm:inline">SECTORES & MINI-SECTORES</span>
            <span className="sm:hidden">SECTORES</span>
          </div>
          <div className="col-span-4 sm:col-span-3 text-right">{lang === 'es' ? 'TIEMPO / GAP' : 'TIME / GAP'}</div>
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-2 sm:gap-4 px-3.5 sm:px-5 py-3 bg-[#1C2230] border-b border-white/[0.08] text-[10px] sm:text-xs font-bold tracking-wider uppercase text-zinc-400 font-mono select-none">
          <div className="col-span-1 text-center">{t.live.table.pos}</div>
          <div className="col-span-3 sm:col-span-3">{t.live.table.driver}</div>
          <div className="col-span-2 sm:col-span-2 text-center">{t.live.table.tyre}</div>
          <div className="hidden sm:block sm:col-span-1 text-center">{t.live.table.pit}</div>
          <div className="col-span-3 sm:col-span-3 text-right pr-2">GAP / INT</div>
          <div className="col-span-3 sm:col-span-2 text-right">{t.live.table.lastLap}</div>
        </div>
      )}

      {/* Active Driver Rows (P1..P19) */}
      <div className="divide-y divide-white/[0.04]">
        {activeDrivers.map((d, index) => {
          const isExpanded = expandedDriver === d.driverNumber;
          const closeInterval = !isQualy && (d.isOvertakeZone || d.isDrsZone || isCloseInterval(d.interval));
          const isPinned = pinnedDriverNumber === d.driverNumber;
          const prevDriver = index > 0 ? activeDrivers[index - 1] : null;
          const isPointsZone = isRace && d.pos <= 10;
          const basePoints = isRace ? F1_POINTS[d.pos] || 0 : 0;
          const hasFastestLapBonus = isRace && d.isFastestLap && d.pos <= 10;
          const totalPoints = basePoints + (hasFastestLapBonus ? 1 : 0);
          const showPointsCutoff = isRace && d.pos > 10 && (!prevDriver || prevDriver.pos <= 10);
          const showQ2Cutoff = isQualy && d.pos > 10 && (!prevDriver || prevDriver.pos <= 10);
          const showQ1Cutoff = isQualy && d.pos > 15 && (!prevDriver || prevDriver.pos <= 15);

          return (
            <div key={d.driverNumber} className="flex flex-col">
              {/* Reborde verde divisorio que delimita la zona de puntos (Top 10) */}
              {showPointsCutoff && (
                <div className="h-[2px] bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.5)] my-0" />
              )}

              {/* Línea divisoria de corte Q2 (eliminación P11 a P15) */}
              {showQ2Cutoff && (
                <div className="h-[2px] bg-rose-500/80 shadow-[0_0_8px_rgba(244,63,94,0.5)] my-0" />
              )}

              {/* Línea divisoria de corte Q1 (eliminación P16 a P20) */}
              {showQ1Cutoff && (
                <div className="h-[2px] bg-rose-500/80 shadow-[0_0_8px_rgba(244,63,94,0.5)] my-0" />
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
                <div className="col-span-4 sm:col-span-3 flex items-center gap-1 sm:gap-1.5 overflow-hidden">
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
                    className="flex flex-col leading-tight truncate cursor-pointer group/driver"
                    onClick={(e) => {
                      e.stopPropagation();
                      openDriverProfile(d.driverNumber, d.code, d.fullName);
                    }}
                    title={lang === 'es' ? 'Ver ficha oficial del piloto' : 'View driver profile'}
                  >
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono text-sm font-bold text-white tracking-tight group-hover/driver:text-[#FFD60A] transition-colors underline decoration-white/20 group-hover/driver:decoration-[#FFD60A]/60">
                        {d.code}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        #{d.driverNumber}
                      </span>
                      {/* Official Championship Points Badge in Race (incluye punto de Vuelta Rápida en Top 10) */}
                      {isRace && totalPoints > 0 && (
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-black border tracking-tight shrink-0 select-none shadow-xs ${
                            hasFastestLapBonus
                              ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                              : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          }`}
                          title={
                            hasFastestLapBonus
                              ? lang === 'es'
                                ? `Zona de puntos: +${basePoints} pts (P${d.pos}) + 1 pt (Vuelta Rápida) = +${totalPoints} pts`
                                : `Points zone: +${basePoints} pts (P${d.pos}) + 1 pt (Fastest Lap) = +${totalPoints} pts`
                              : lang === 'es'
                              ? `Zona de puntos: +${basePoints} pts para el Campeonato Mundial`
                                : `Points zone: +${basePoints} pts for World Championship`
                          }
                        >
                          +{totalPoints} PTS
                        </span>
                      )}
                      {/* Active FIA Penalty Badge in Race (En rojo oficial de sanción) */}
                      {!isQualy && d.penaltySeconds && d.penaltySeconds > 0 && (
                        <span
                          className="px-1.5 py-0.5 rounded text-[9px] font-mono font-black bg-rose-500/20 text-rose-400 border border-rose-500/40 tracking-tight shrink-0 select-none shadow-xs"
                          title={lang === 'es' ? `Penalización oficial FIA: +${d.penaltySeconds}s` : `Official FIA penalty: +${d.penaltySeconds}s`}
                        >
                          +{d.penaltySeconds}s {t.live.table.penalty}
                        </span>
                      )}
                      {/* Elimination Phase Tag in Qualy */}
                      {isQualy && d.eliminatedPhase && (
                        <span className="px-1 py-0.2 rounded text-[8px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          {d.eliminatedPhase}
                        </span>
                      )}
                      {d.inPit && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-zinc-800 text-zinc-400 border border-white/10 shrink-0">
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
                          status={d.sectors?.s1Status}
                          compact
                        />
                        <SectorPill
                          sectorNumber={2}
                          time={d.sectors?.s2}
                          status={d.sectors?.s2Status}
                          compact
                        />
                        <SectorPill
                          sectorNumber={3}
                          time={d.sectors?.s3}
                          status={d.sectors?.s3Status}
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
                    <div className="col-span-2 sm:col-span-2 flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5">
                      {getTyreBadge(d.tyre) || (
                        <span className="text-[10px] text-zinc-600 font-mono">-</span>
                      )}
                      {/* En mobile, badge compacto de pit integrado */}
                      <div className="sm:hidden">
                        {d.inPit ? (
                          <span
                            className="px-1 py-0.2 rounded text-[8px] font-mono font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse"
                            title={lang === 'es' ? 'En calle de boxes' : 'In pit lane'}
                          >
                            {lang === 'es' ? 'BOX' : 'PIT'}
                          </span>
                        ) : (d.pitStops ?? 0) > 0 ? (
                          <span
                            className="font-mono text-[8px] font-bold text-zinc-400 bg-[#1C2230] px-1 py-0.2 rounded border border-white/[0.08]"
                            title={
                              lang === 'es'
                                ? `${d.pitStops} ${d.pitStops === 1 ? 'parada' : 'paradas'} en boxes`
                                : `${d.pitStops} pit ${d.pitStops === 1 ? 'stop' : 'stops'}`
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
                        <span
                          className={`inline-flex items-center justify-center font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${
                            (d.pitStops ?? 0) > 0
                              ? 'bg-[#1C2230] text-zinc-200 border-white/[0.12] shadow-xs'
                              : 'bg-[#0B0E14] text-zinc-500 border-white/[0.05]'
                          }`}
                          title={
                            lang === 'es'
                              ? `${d.pitStops ?? 0} ${d.pitStops === 1 ? 'parada' : 'paradas'} en boxes`
                              : `${d.pitStops ?? 0} pit ${d.pitStops === 1 ? 'stop' : 'stops'}`
                          }
                        >
                          {d.pitStops ?? 0}P
                        </span>
                      )}
                    </div>

                    {/* Race Gap & Interval - 3 columnas con espacio suficiente */}
                    <div className="col-span-3 sm:col-span-3 text-right flex flex-col justify-center leading-tight pr-1.5 sm:pr-2">
                      <span className="font-mono text-xs font-semibold text-zinc-200 font-tabular truncate">
                        {d.gap}
                      </span>
                      {d.interval && d.interval !== 'LEADER' && (
                        <div className="flex items-center justify-end gap-1 sm:gap-1.5">
                          {closeInterval && (
                            <span
                              className="px-1 sm:px-1.5 py-0.2 rounded text-[7px] sm:text-[8px] font-mono font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 tracking-wider uppercase animate-pulse select-none shrink-0"
                              title={lang === 'es' ? 'Modo Overtake habilitado (< 1.0s del auto de adelante)' : 'Overtake Mode active (< 1.0s behind car ahead)'}
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
                    <div className="col-span-3 sm:col-span-2 text-right flex items-center justify-end gap-1 sm:gap-1.5 pl-1">
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
                          <span className="text-[9px] font-bold text-purple-400 uppercase tracking-tighter">
                            {t.live.table.fastestLap}
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
                              ? hasFastestLapBonus
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                                : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                              : 'bg-white/[0.04] text-zinc-500 border border-white/[0.06]'
                          }`}
                        >
                          {totalPoints > 0
                            ? hasFastestLapBonus
                              ? `+${basePoints} PTS (P${d.pos}) + 1 PT (${lang === 'es' ? 'V. RÁPIDA' : 'FASTEST LAP'}) = ${totalPoints} PTS`
                              : `+${totalPoints} ${t.live.table.pointsChampionship}`
                            : d.isFastestLap
                            ? lang === 'es'
                              ? 'V. RÁPIDA (0 PTS · FUERA DEL TOP 10)'
                              : 'FASTEST LAP (0 PTS · OUT OF TOP 10)'
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
                      status={d.sectors?.s1Status}
                    />
                    <SectorPill
                      sectorNumber={2}
                      time={d.sectors?.s2}
                      status={d.sectors?.s2Status}
                    />
                    <SectorPill
                      sectorNumber={3}
                      time={d.sectors?.s3}
                      status={d.sectors?.s3Status}
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
                      {getTyreBadge(d.tyre) || (
                        <span className="text-[10px] text-zinc-600 font-mono">-</span>
                      )}
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
      <HeadToHeadModal
        isOpen={isH2HOpen}
        onClose={() => setIsH2HOpen(false)}
        drivers={drivers}
        driverAId={h2hDriverA}
        driverBId={h2hDriverB}
        onSelectDriverA={setH2hDriverA}
        onSelectDriverB={setH2hDriverB}
      />

      {/* 👤 Official Driver Profile Modal */}
      <DriverProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={selectedProfile}
        isPinned={selectedProfile ? pinnedDriverNumber === selectedProfile.number : false}
        onTogglePin={(num) => togglePin(num)}
        onCompare={(num) => {
          setIsProfileOpen(false);
          openH2HWithDriver(num);
        }}
      />
    </div>
  );
};
