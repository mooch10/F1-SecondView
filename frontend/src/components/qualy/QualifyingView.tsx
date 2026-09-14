import React, { useEffect, useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Flag,
  Gauge,
  MapPin,
  Radio,
  Sparkles,
  Timer,
} from 'lucide-react';
import { fetchQualifying } from '../../services/api';
import type {
  DriverLive,
  JolpicaQualifyingResult,
  JolpicaQualifyingSession,
  LiveSnapshot,
  TyreCompound,
} from '../../types/f1';
import { useLanguage } from '../../hooks/useLanguage';
import { MiniSectorsBar } from './MiniSectorsBar';
import { SectorPill } from './SectorPill';
import { DriverProfileModal } from '../drivers/DriverProfileModal';
import { getF1DriverProfile, type F1DriverProfile } from '../../data/f1DriversData';
import { translateSessionName } from '../../utils/sessionTranslation';

function parseLapDuration(lapStr?: string): number | null {
  if (!lapStr || lapStr === '-' || lapStr.includes('NO') || lapStr.includes('---')) return null;
  const parts = lapStr.split(':');
  if (parts.length === 2) {
    const min = Number.parseFloat(parts[0]);
    const sec = Number.parseFloat(parts[1]);
    return Number.isNaN(min) || Number.isNaN(sec) ? null : min * 60 + sec;
  }
  const sec = Number.parseFloat(lapStr);
  return Number.isNaN(sec) ? null : sec;
}

interface QualifyingViewProps {
  liveSnapshot?: LiveSnapshot | null;
  liveDrivers?: DriverLive[];
}

export const QualifyingView: React.FC<QualifyingViewProps> = ({
  liveSnapshot,
  liveDrivers = [],
}) => {
  const { lang, t } = useLanguage();
  const [session, setSession] = useState<JolpicaQualifyingSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [phaseFilter, setPhaseFilter] = useState<'ALL' | 'Q3' | 'Q2' | 'Q1'>('ALL');
  const [expandedDriver, setExpandedDriver] = useState<number | null>(null);

  // 👤 Driver Profile Modal
  const [selectedProfile, setSelectedProfile] = useState<F1DriverProfile | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [pinnedDriverNumber, setPinnedDriverNumber] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem('f1_pinned_driver');
      return saved ? parseInt(saved, 10) : null;
    } catch {
      return null;
    }
  });

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

  const openDriverProfile = (_driverNumber?: number | string, code?: string, fullName?: string) => {
    const profile =
      (code ? getF1DriverProfile(code) : undefined) ||
      (fullName ? getF1DriverProfile(fullName) : undefined);
    if (profile) {
      setSelectedProfile(profile);
      setIsProfileOpen(true);
    }
  };

  const hasLiveSession =
    Boolean(liveSnapshot?.session.sessionType === 'Qualifying') ||
    (liveDrivers.length > 0 && liveSnapshot?.session.status === 'IN_PROGRESS');

  const [userViewMode, setUserViewMode] = useState<'LIVE' | 'RESULTS' | null>(null);
  const viewMode = userViewMode ?? (hasLiveSession ? 'LIVE' : 'RESULTS');

  // Official F1 Qualifying Classification for Live Telemetry
  const displayedLiveDrivers = useMemo(() => {
    if (!liveDrivers || liveDrivers.length === 0) return [];

    if (phaseFilter === 'ALL') {
      return liveDrivers.map((d, idx) => {
        const prev = idx > 0 ? liveDrivers[idx - 1] : null;
        const showCutoff =
          (d.pos > 10 && (!prev || prev.pos <= 10)) ||
          (d.pos > 15 && (!prev || prev.pos <= 15));
        return {
          driver: d,
          displayPos: d.pos,
          displayTime: d.bestLapTime || d.lastLapTime || '--:--.---',
          displayGap: d.gap,
          isPhaseLeader: idx === 0,
          showCutoff,
        };
      });
    }

    if (phaseFilter === 'Q3') {
      const q3Drivers = liveDrivers.filter(
        (d) => typeof d.q3Duration === 'number' || Boolean(d.q3Time) || d.pos <= 10,
      );
      q3Drivers.sort((a, b) => {
        const aDur = a.q3Duration ?? a.bestLapDuration ?? Number.POSITIVE_INFINITY;
        const bDur = b.q3Duration ?? b.bestLapDuration ?? Number.POSITIVE_INFINITY;
        return aDur - bDur;
      });

      const leaderDur = q3Drivers[0]?.q3Duration ?? q3Drivers[0]?.bestLapDuration ?? null;

      return q3Drivers.map((d, idx) => {
        const dur = d.q3Duration ?? d.bestLapDuration;
        const gap =
          idx === 0
            ? 'POLE'
            : leaderDur !== null && dur !== null && typeof dur === 'number'
              ? `+${(dur - leaderDur).toFixed(3)}`
              : '- - -';
        return {
          driver: d,
          displayPos: idx + 1,
          displayTime: d.q3Time || d.bestLapTime || '--:--.---',
          displayGap: gap,
          isPhaseLeader: idx === 0,
          showCutoff: false,
        };
      });
    }

    if (phaseFilter === 'Q2') {
      const q2Drivers = liveDrivers.filter(
        (d) => typeof d.q2Duration === 'number' || Boolean(d.q2Time) || d.pos <= 15,
      );
      q2Drivers.sort((a, b) => {
        const aDur = a.q2Duration ?? Number.POSITIVE_INFINITY;
        const bDur = b.q2Duration ?? Number.POSITIVE_INFINITY;
        return aDur - bDur;
      });

      const leaderDur = q2Drivers[0]?.q2Duration ?? null;

      return q2Drivers.map((d, idx) => {
        const dur = d.q2Duration;
        const gap =
          idx === 0
            ? (lang === 'es' ? 'LÍDER' : 'LEADER')
            : leaderDur !== null && dur !== null && typeof dur === 'number'
              ? `+${(dur - leaderDur).toFixed(3)}`
              : '- - -';
        const showCutoff = idx === 10;
        return {
          driver: d,
          displayPos: idx + 1,
          displayTime: d.q2Time || '--:--.---',
          displayGap: gap,
          isPhaseLeader: idx === 0,
          showCutoff,
        };
      });
    }

    // phaseFilter === 'Q1'
    const q1Drivers = [...liveDrivers];
    q1Drivers.sort((a, b) => {
      const aDur = a.q1Duration ?? Number.POSITIVE_INFINITY;
      const bDur = b.q1Duration ?? Number.POSITIVE_INFINITY;
      return aDur - bDur;
    });

    const leaderDur = q1Drivers[0]?.q1Duration ?? null;

    return q1Drivers.map((d, idx) => {
      const dur = d.q1Duration;
      const gap =
        idx === 0
          ? (lang === 'es' ? 'LÍDER' : 'LEADER')
          : leaderDur !== null && dur !== null && typeof dur === 'number'
            ? `+${(dur - leaderDur).toFixed(3)}`
            : '- - -';
      const showCutoff = idx === 15;
      return {
        driver: d,
        displayPos: idx + 1,
        displayTime: d.q1Time || '--:--.---',
        displayGap: gap,
        isPhaseLeader: idx === 0,
        showCutoff,
      };
    });
  }, [liveDrivers, phaseFilter]);

  // Official F1 Qualifying Classification for Historical Jolpica Results
  const displayedResults = useMemo(() => {
    if (!session?.results) return [];

    if (phaseFilter === 'ALL') {
      return session.results.map((d, idx) => {
        const prev = idx > 0 ? session.results[idx - 1] : null;
        const showCutoff =
          (d.pos > 10 && (!prev || prev.pos <= 10)) ||
          (d.pos > 15 && (!prev || prev.pos <= 15));
        return {
          result: d,
          displayPos: d.pos,
          displayTime: d.q3 || d.q2 || d.q1 || d.bestLap,
          displayGap: d.gap,
          isPhaseLeader: idx === 0,
          showCutoff,
        };
      });
    }

    if (phaseFilter === 'Q3') {
      const q3List = session.results
        .filter((d) => Boolean(d.q3))
        .map((d) => ({ d, dur: parseLapDuration(d.q3) }))
        .filter((item): item is { d: JolpicaQualifyingResult; dur: number } => item.dur !== null);

      q3List.sort((a, b) => a.dur - b.dur);
      const leaderDur = q3List[0]?.dur ?? null;

      return q3List.map((item, idx) => ({
        result: item.d,
        displayPos: idx + 1,
        displayTime: item.d.q3 || '',
        displayGap:
          idx === 0
            ? 'POLE'
            : leaderDur !== null
              ? `+${(item.dur - leaderDur).toFixed(3)}`
              : '- - -',
        isPhaseLeader: idx === 0,
        showCutoff: false,
      }));
    }

    if (phaseFilter === 'Q2') {
      const q2List = session.results
        .filter((d) => Boolean(d.q2))
        .map((d) => ({ d, dur: parseLapDuration(d.q2) }))
        .filter((item): item is { d: JolpicaQualifyingResult; dur: number } => item.dur !== null);

      q2List.sort((a, b) => a.dur - b.dur);
      const leaderDur = q2List[0]?.dur ?? null;

      return q2List.map((item, idx) => ({
        result: item.d,
        displayPos: idx + 1,
        displayTime: item.d.q2 || '',
        displayGap:
          idx === 0
            ? (lang === 'es' ? 'LÍDER' : 'LEADER')
            : leaderDur !== null
              ? `+${(item.dur - leaderDur).toFixed(3)}`
              : '- - -',
        isPhaseLeader: idx === 0,
        showCutoff: idx === 10,
      }));
    }

    // Q1
    const q1List = session.results
      .filter((d) => Boolean(d.q1))
      .map((d) => ({ d, dur: parseLapDuration(d.q1) }))
      .filter((item): item is { d: JolpicaQualifyingResult; dur: number } => item.dur !== null);

    q1List.sort((a, b) => a.dur - b.dur);
    const leaderDur = q1List[0]?.dur ?? null;

    return q1List.map((item, idx) => ({
      result: item.d,
      displayPos: idx + 1,
      displayTime: item.d.q1 || '',
      displayGap:
        idx === 0
          ? (lang === 'es' ? 'LÍDER' : 'LEADER')
          : leaderDur !== null
            ? `+${(item.dur - leaderDur).toFixed(3)}`
            : '- - -',
      isPhaseLeader: idx === 0,
      showCutoff: idx === 15,
    }));
  }, [session, phaseFilter]);

  useEffect(() => {
    fetchQualifying().then((data) => {
      setSession(data);
      setLoading(false);
    });
  }, []);

  const toggleExpand = (driverNumber: number) => {
    setExpandedDriver((prev) => (prev === driverNumber ? null : driverNumber));
  };

  const getTyreBadge = (tyre: { compound: TyreCompound; laps: number } | null) => {
    if (!tyre) return null;
    const compound = tyre.compound.toUpperCase();
    let letter = 'S';
    let ringClass = 'border-[#FF3B30] text-[#FF3B30] bg-[#FF3B30]/10';

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
        className="inline-flex items-center gap-1 font-mono text-[10px] font-bold select-none"
        title={
          lang === 'es'
            ? `Compuesto ${tyre.compound} (${tyre.laps} vueltas)`
            : `Pirelli ${tyre.compound} Compound (${tyre.laps} laps)`
        }
      >
        <span
          className={`w-4 h-4 rounded-full border flex items-center justify-center text-[9px] font-black shrink-0 ${ringClass}`}
        >
          {letter}
        </span>
        <span className="text-zinc-400 tabular-nums">
          {tyre.laps}{lang === 'es' ? 'v' : 'l'}
        </span>
      </div>
    );
  };

  // ----------------------------------------------------
  // RENDER: LIVE QUALIFYING VIEW (TELEMETRÍA OPENF1)
  // ----------------------------------------------------
  const renderLiveQualifying = () => {
    if (!liveDrivers || liveDrivers.length === 0) {
      return (
        <div className="bg-[#131722] border border-white/[0.08] rounded-xl p-8 text-center text-zinc-400 font-mono text-xs">
          <Radio className="w-6 h-6 text-zinc-500 mx-auto mb-2 animate-pulse" />
          <span>
            {lang === 'es'
              ? 'Esperando telemetría de calificación en vivo...'
              : 'Waiting for live qualifying telemetry...'}
          </span>
        </div>
      );
    }

    const poleDriver = liveDrivers[0];
    const qualyPhase = liveSnapshot?.session.qualifyingPhase || 'Q1';

    return (
      <div className="flex flex-col gap-3">
        {/* Grand Prix & Poleman Hero Showcase */}
        <div className="bg-[#131722] border border-white/[0.08] border-t-2 border-t-[#FFD60A] rounded-xl p-4 sm:p-5 relative shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {lang === 'es' ? 'TELEMETRÍA EN VIVO' : 'LIVE TELEMETRY'} • {qualyPhase}
                </span>
                <span className="text-[11px] text-zinc-400 font-mono">
                  {liveSnapshot?.session.circuit || 'Circuito F1'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase font-chakra">
                {liveSnapshot?.session.sessionName
                  ? translateSessionName(liveSnapshot.session.sessionName, lang)
                  : (lang === 'es' ? 'Sesión de Clasificación' : 'Qualifying Session')}
              </h2>
              <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5 font-mono">
                <MapPin className="w-3.5 h-3.5 text-[#E10600]" />
                <span>
                  {liveSnapshot?.session.location}, {liveSnapshot?.session.country}
                </span>
              </div>
            </div>

            {/* Pole Position Winner Pill Card */}
            {poleDriver && (
              <div className="bg-[#0B0E14] border border-amber-500/30 rounded-xl p-3 sm:min-w-[240px] flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-lg text-black font-mono shadow-sm shrink-0"
                  style={{ backgroundColor: poleDriver.teamColor || '#FFD60A' }}
                >
                  1
                </div>
                <div className="flex flex-col leading-tight min-w-0">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />{' '}
                    {lang === 'es' ? 'POLE PROVISIONAL' : 'PROVISIONAL POLE'}
                  </span>
                  <span className="text-sm font-bold text-white truncate font-sans">
                    {poleDriver.fullName}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] font-mono mt-0.5">
                    <span className="text-zinc-400 truncate">{poleDriver.teamName}</span>
                    <span className="text-[#FFD60A] font-bold bg-[#FFD60A]/10 border border-[#FFD60A]/20 px-1.5 py-0.2 rounded font-tabular">
                      {poleDriver.bestLapTime || '--:--.---'}
                    </span>
                    {poleDriver.speedTrap && (
                      <span className="text-zinc-400 text-[10px] hidden sm:inline">
                        {poleDriver.speedTrap} km/h
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Phase Selector Tabs (Adaptive to Q1, Q2, Q3) */}
          <div className="flex items-center justify-between gap-1.5 border-t border-white/[0.08] pt-3 overflow-x-auto no-scrollbar select-none">
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setPhaseFilter('ALL')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  phaseFilter === 'ALL'
                    ? 'bg-white/10 text-white border border-white/20 shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200 bg-transparent'
                }`}
              >
                {lang === 'es' ? 'TODOS' : 'ALL'}
              </button>
              <button
                type="button"
                onClick={() => setPhaseFilter('Q3')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                  phaseFilter === 'Q3'
                    ? 'bg-[#FFD60A]/20 text-[#FFD60A] border border-[#FFD60A]/40 shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200 bg-transparent'
                }`}
              >
                <span>Q3<span className="hidden sm:inline"> (TOP 10)</span></span>
              </button>
              <button
                type="button"
                onClick={() => setPhaseFilter('Q2')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  phaseFilter === 'Q2'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200 bg-transparent'
                }`}
              >
                <span>Q2<span className="hidden sm:inline"> (P1 - P15)</span></span>
              </button>
              <button
                type="button"
                onClick={() => setPhaseFilter('Q1')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  phaseFilter === 'Q1'
                    ? 'bg-rose-900/30 text-rose-300 border border-rose-700/40 shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200 bg-transparent'
                }`}
              >
                <span>Q1</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Qualy Table */}
        <div className="bg-[#131722] border border-white/[0.08] rounded-xl shadow-lg overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-2 sm:gap-4 px-3.5 sm:px-5 py-3 bg-[#1C2230] border-b border-white/[0.08] text-[10px] sm:text-xs font-bold tracking-wider uppercase text-zinc-400 font-mono select-none items-center">
            <div className="col-span-1 text-center">{t.qualy.headers.pos}</div>
            <div className="col-span-3 sm:col-span-3">{t.qualy.headers.driver}</div>
            <div className="col-span-4 sm:col-span-5 text-center">
              <span className="hidden sm:inline">{t.qualy.headers.sectorsAndMini}</span>
              <span className="sm:hidden">{t.qualy.headers.sectors}</span>
            </div>
            <div className="col-span-4 sm:col-span-3 text-right">{t.qualy.headers.timeGap}</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/[0.04]">
            {displayedLiveDrivers.map((item) => {
              const d = item.driver;
              const isExpanded = expandedDriver === d.driverNumber;

              return (
                <div key={d.driverNumber} className="flex flex-col">
                  {/* Línea divisoria de corte */}
                  {item.showCutoff && (
                    <div className="h-[2px] bg-rose-500/80 shadow-[0_0_8px_rgba(244,63,94,0.5)] my-0" />
                  )}

                  {/* Driver Row (Clickable) */}
                  <button
                    type="button"
                    onClick={() => toggleExpand(d.driverNumber)}
                    className={`w-full text-left grid grid-cols-12 gap-2 sm:gap-4 px-3.5 sm:px-5 py-3.5 sm:py-3 items-center transition-colors select-none ${
                      isExpanded ? 'bg-white/[0.05]' : 'hover:bg-white/[0.02]'
                    } ${item.isPhaseLeader ? 'bg-[#FFD60A]/[0.03]' : ''}`}
                  >
                    {/* Position */}
                    <div className="col-span-1 flex items-center justify-center">
                      <span
                        className={`font-mono text-sm sm:text-base font-black font-tabular text-center ${
                          item.isPhaseLeader
                            ? 'text-[#FFD60A]'
                            : item.displayPos <= 3
                            ? 'text-white'
                            : item.displayPos <= 10
                            ? 'text-zinc-200'
                            : 'text-zinc-400'
                        }`}
                      >
                        {item.displayPos}
                      </span>
                    </div>

                    {/* Driver & Team */}
                    <div
                      className="col-span-3 sm:col-span-3 flex items-center gap-1.5 sm:gap-2.5 overflow-hidden"
                    >
                      <span
                        className="w-1.5 h-7 rounded-full flex-shrink-0"
                        style={{ backgroundColor: d.teamColor || '#71717A' }}
                      />
                      <div className="flex flex-col leading-snug truncate">
                        <div className="flex items-center gap-1.5 flex-nowrap shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDriverProfile(undefined, d.code, d.fullName);
                            }}
                            className="font-mono text-sm sm:text-base font-black text-white tracking-tight hover:text-[#FFD60A] transition-colors underline decoration-white/20 hover:decoration-[#FFD60A]/60 cursor-pointer"
                            title={lang === 'es' ? 'Ver ficha oficial del piloto' : 'View driver profile'}
                          >
                            {d.code}
                          </button>
                          <span className="text-[10px] sm:text-xs text-zinc-500 font-mono">
                            #{d.driverNumber}
                          </span>
                          {item.isPhaseLeader && (
                            <span className="px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-mono font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
                              POLE
                            </span>
                          )}
                          {d.inPit && (
                            <span className="px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-mono font-bold bg-zinc-800 text-zinc-400 border border-white/10 shrink-0">
                              PIT
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-zinc-400 group-hover:text-zinc-200 truncate hidden sm:block transition-colors">
                          {d.fullName}
                        </span>
                      </div>
                    </div>

                    {/* Sectors & Mini-Sectors Center Column */}
                    <div className="col-span-4 sm:col-span-5 flex flex-col items-center justify-center gap-1 sm:gap-1.5 px-0.5 sm:px-2 min-w-0">
                      {/* 3 Sector Badges (Mobile & Desktop) */}
                      <div className="flex items-center justify-center gap-1 sm:gap-2 w-full flex-nowrap">
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

                      {/* Mini-Sectors Track Bar (Desktop & Tablet) */}
                      <div className="hidden sm:block w-full max-w-[260px]">
                        <MiniSectorsBar segments={d.sectors?.segments} />
                      </div>
                    </div>

                    {/* Best Lap Time & Gap */}
                    <div className="col-span-4 sm:col-span-3 text-right flex items-center justify-end gap-1.5 sm:gap-2 shrink-0">
                      <div className="flex flex-col leading-snug">
                        <span
                          className={`font-mono text-xs sm:text-sm font-tabular whitespace-nowrap ${
                            item.isPhaseLeader
                              ? 'text-[#FFD60A] font-black'
                              : 'text-zinc-100 font-bold'
                          }`}
                        >
                          {item.displayTime}
                        </span>
                        <span
                          className={`font-mono text-[10px] sm:text-xs font-tabular whitespace-nowrap ${
                            item.isPhaseLeader ? 'text-[#FFD60A] font-bold' : 'text-zinc-400'
                          }`}
                        >
                          {item.displayGap}
                        </span>
                      </div>
                      <div className="text-zinc-500 shrink-0">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Level 2: Expanded Driver Details */}
                  {isExpanded && (
                    <div className="bg-[#0B0E14] border-t border-b border-white/[0.06] px-4 py-3 text-xs flex flex-col gap-3">
                      {/* Driver Info Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: d.teamColor }}
                          />
                          <span className="font-bold text-white text-sm">
                            {d.fullName}
                          </span>
                          <span className="text-zinc-400 text-xs">({d.teamName})</span>
                          {getTyreBadge(d.tyre)}
                        </div>
                        <span className="text-zinc-400 font-mono text-[10px]">
                          {lang === 'es' ? 'Grilla provisional' : 'Provisional grid'}:{' '}
                          <strong className="text-white">P{item.displayPos}</strong> • Gap:{' '}
                          <strong className="text-white">{item.displayGap}</strong>
                        </span>
                      </div>

                      {/* Detailed Mini-Sectors Bar */}
                      <MiniSectorsBar segments={d.sectors?.segments} detailed />

                      {/* 3 Detailed Sector Cards */}
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

                      {/* View Driver Profile Button */}
                      <button
                        type="button"
                        onClick={() => openDriverProfile(undefined, d.code, d.fullName)}
                        className="w-full py-2 px-3 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-zinc-300 hover:text-white font-mono text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <span>👤</span>
                        <span>{lang === 'es' ? 'Ver Ficha Oficial de Piloto' : 'View Official Driver Profile'}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // ----------------------------------------------------
  // RENDER: HISTORICAL QUALIFYING VIEW (JOLPICA RESULTS)
  // ----------------------------------------------------
  const renderHistoricalQualifying = () => {
    if (loading) {
      return (
        <div className="bg-[#131722] border border-white/[0.08] rounded-xl p-12 text-center text-zinc-400 font-mono text-xs">
          <Timer className="w-6 h-6 text-zinc-400 mx-auto mb-2 animate-pulse" />
          <span>{t.qualy.loading}</span>
        </div>
      );
    }

    if (!session || !session.results || session.results.length === 0) {
      return (
        <div className="bg-[#131722] border border-white/[0.08] rounded-xl p-8 text-center text-zinc-400 font-mono text-xs">
          <Flag className="w-6 h-6 text-zinc-500 mx-auto mb-2" />
          <span>{t.qualy.noData}</span>
        </div>
      );
    }

    const poleDriver = session.results[0];

    return (
      <div className="flex flex-col gap-3">
        {/* Grand Prix & Poleman Hero Showcase */}
        <div className="bg-[#131722] border border-white/[0.08] border-t-2 border-t-[#FFD60A] rounded-xl p-4 sm:p-5 relative shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#FFD60A]/15 text-[#FFD60A] border border-[#FFD60A]/30 tracking-widest whitespace-nowrap shrink-0">
                  {t.qualy.round} {session.round} • {t.qualy.qualyTitle}
                </span>
                <span className="text-[11px] text-zinc-400 font-mono whitespace-nowrap">
                  {session.date}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                {session.raceName}
              </h2>
              <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5 font-mono">
                <MapPin className="w-3.5 h-3.5 text-[#E10600]" />
                <span>{session.circuitName}</span>
              </div>
            </div>

            {poleDriver && (
              <div
                className="bg-[#0B0E14] border border-amber-500/30 rounded-xl p-3 sm:min-w-[240px] flex items-center gap-3"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-lg text-black font-mono shadow-sm shrink-0"
                  style={{ backgroundColor: poleDriver.teamColor || '#FFD60A' }}
                >
                  1
                </div>
                <div className="flex flex-col leading-tight min-w-0">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> {t.qualy.poleBadge}
                  </span>
                  <div className="flex items-center gap-1.5 truncate">
                    {poleDriver.code ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDriverProfile(undefined, poleDriver.code, poleDriver.fullName);
                        }}
                        className="font-mono font-black text-xs px-1.5 py-0.5 rounded bg-white/10 hover:bg-[#FFD60A] text-white hover:text-black transition-colors cursor-pointer"
                        title={lang === 'es' ? 'Ver ficha del piloto' : 'View driver profile'}
                      >
                        {poleDriver.code}
                      </button>
                    ) : null}
                    <span className="text-sm font-bold text-white truncate font-sans">
                      {poleDriver.fullName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-mono mt-0.5">
                    <span className="text-zinc-400 truncate">{poleDriver.teamName}</span>
                    <span className="text-white font-bold bg-white/[0.08] px-1.5 py-0.2 rounded font-tabular">
                      {poleDriver.q3 || poleDriver.bestLap}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Phase Selector Tabs */}
          <div className="flex items-center gap-1.5 border-t border-white/[0.08] pt-3 overflow-x-auto select-none">
            <button
              type="button"
              onClick={() => setPhaseFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                phaseFilter === 'ALL'
                  ? 'bg-white/10 text-white border border-white/20 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200 bg-transparent'
              }`}
            >
              {t.qualy.filters.all}
            </button>
            <button
              type="button"
              onClick={() => setPhaseFilter('Q3')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                phaseFilter === 'Q3'
                  ? 'bg-[#FFD60A]/20 text-[#FFD60A] border border-[#FFD60A]/40 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200 bg-transparent'
              }`}
            >
              <span>{t.qualy.filters.q3}</span>
            </button>
            <button
              type="button"
              onClick={() => setPhaseFilter('Q2')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                phaseFilter === 'Q2'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200 bg-transparent'
              }`}
            >
              <span>{t.qualy.filters.q2}</span>
            </button>
            <button
              type="button"
              onClick={() => setPhaseFilter('Q1')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                phaseFilter === 'Q1'
                  ? 'bg-rose-900/30 text-rose-300 border border-rose-700/40 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200 bg-transparent'
              }`}
            >
              <span>{t.qualy.filters.q1}</span>
            </button>
          </div>
        </div>

        {/* Historical Qualifying Table */}
        <div className="bg-[#131722] border border-white/[0.08] rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-12 gap-2 sm:gap-4 px-3.5 sm:px-5 py-3 bg-[#1C2230] border-b border-white/[0.08] text-[10px] sm:text-xs font-bold tracking-wider uppercase text-zinc-400 font-mono select-none">
            <div className="col-span-1 text-center whitespace-nowrap">{t.qualy.headers.pos}</div>
            <div className="col-span-5 sm:col-span-3 whitespace-nowrap">{t.qualy.headers.driver}</div>

            <div className="col-span-3 text-right sm:hidden whitespace-nowrap">{t.qualy.headers.time}</div>
            <div className="col-span-3 text-right sm:hidden whitespace-nowrap">{t.qualy.headers.gap}</div>

            <div className="hidden sm:block sm:col-span-2 text-center whitespace-nowrap">{t.qualy.headers.q1}</div>
            <div className="hidden sm:block sm:col-span-2 text-center whitespace-nowrap">{t.qualy.headers.q2}</div>
            <div className="hidden sm:block sm:col-span-2 text-center whitespace-nowrap">{t.qualy.headers.q3}</div>
            <div className="hidden sm:block sm:col-span-2 text-right whitespace-nowrap">{t.qualy.headers.gap}</div>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {displayedResults.map((item) => {
              const d = item.result;
              const isExpanded = expandedDriver === d.driverNumber;

              return (
                <div key={d.driverNumber} className="flex flex-col">
                  {item.showCutoff && (
                    <div className="h-[2px] bg-rose-500/80 shadow-[0_0_8px_rgba(244,63,94,0.5)] my-0" />
                  )}

                  <button
                    type="button"
                    onClick={() => toggleExpand(d.driverNumber)}
                    className={`w-full text-left grid grid-cols-12 gap-2 sm:gap-4 px-3.5 sm:px-5 py-3.5 sm:py-3 items-center transition-colors select-none ${
                      isExpanded ? 'bg-white/[0.05]' : 'hover:bg-white/[0.02]'
                    } ${item.isPhaseLeader ? 'bg-[#FFD60A]/[0.03]' : ''}`}
                  >
                    <div className="col-span-1 flex items-center justify-center">
                      <span
                        className={`font-mono text-sm font-black font-tabular text-center ${
                          item.isPhaseLeader
                            ? 'text-[#FFD60A]'
                            : item.displayPos <= 3
                            ? 'text-white'
                            : item.displayPos <= 10
                            ? 'text-zinc-200'
                            : 'text-zinc-400'
                        }`}
                      >
                        {item.displayPos}
                      </span>
                    </div>

                    <div
                      className="col-span-5 sm:col-span-3 flex items-center gap-2 overflow-hidden"
                    >
                      <span
                        className="w-1 h-6 rounded-full flex-shrink-0"
                        style={{ backgroundColor: d.teamColor || '#71717A' }}
                      />
                      <div className="flex flex-col leading-tight truncate">
                        <div className="flex items-center gap-1.5 flex-nowrap">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDriverProfile(undefined, d.code, d.fullName);
                            }}
                            className="font-mono text-sm font-bold text-white tracking-tight hover:text-[#FFD60A] transition-colors underline decoration-white/20 hover:decoration-[#FFD60A]/60 cursor-pointer whitespace-nowrap shrink-0"
                            title={lang === 'es' ? 'Ver ficha oficial del piloto' : 'View driver profile'}
                          >
                            {d.code}
                          </button>
                          <span className="text-[10px] text-zinc-500 font-mono whitespace-nowrap shrink-0">
                            #{d.driverNumber}
                          </span>
                          {item.isPhaseLeader && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 tracking-tight whitespace-nowrap shrink-0">
                              {phaseFilter === 'ALL' || phaseFilter === 'Q3' ? 'POLE 🥇' : (lang === 'es' ? 'LÍDER' : 'LEADER')}
                            </span>
                          )}
                          {d.eliminatedPhase && phaseFilter === 'ALL' && (
                            <span className="px-1 py-0.2 rounded text-[8px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 whitespace-nowrap shrink-0">
                              {d.eliminatedPhase}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-zinc-400 group-hover:text-zinc-200 truncate hidden sm:block transition-colors">
                          {d.fullName}
                        </span>
                      </div>
                    </div>

                    {/* Mobile Time and Gap */}
                    <div className="col-span-3 text-right sm:hidden flex flex-col justify-center leading-tight">
                      <span
                        className={`font-mono text-xs font-tabular ${
                          item.isPhaseLeader ? 'text-[#FFD60A] font-black' : 'text-zinc-200 font-bold'
                        }`}
                      >
                        {item.displayTime}
                      </span>
                      <span className="font-mono text-[9px] text-zinc-500 uppercase">
                        {phaseFilter === 'ALL' ? (d.q3 ? 'Q3' : d.q2 ? 'Q2' : d.q1 ? 'Q1' : '') : phaseFilter}
                      </span>
                    </div>

                    <div className="col-span-3 text-right sm:hidden flex items-center justify-end gap-1 font-mono text-xs font-tabular">
                      <span
                        className={`truncate ${
                          item.isPhaseLeader ? 'text-[#FFD60A] font-bold text-[11px]' : 'text-zinc-400'
                        }`}
                      >
                        {item.displayGap}
                      </span>
                      <div className="text-zinc-500">
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </div>
                    </div>

                    {/* Desktop Columns */}
                    <div className="hidden sm:block sm:col-span-2 text-center font-mono text-xs font-tabular">
                      <span className={d.q1 ? 'text-zinc-300' : 'text-zinc-600'}>
                        {d.q1 || '-'}
                      </span>
                    </div>

                    <div className="hidden sm:block sm:col-span-2 text-center font-mono text-xs font-tabular">
                      <span
                        className={
                          d.q2
                            ? d.eliminatedPhase === 'Q2'
                              ? 'text-rose-300 font-semibold'
                              : 'text-zinc-300'
                            : 'text-zinc-600'
                        }
                      >
                        {d.q2 || '-'}
                      </span>
                    </div>

                    <div className="hidden sm:block sm:col-span-2 text-center font-mono text-xs font-tabular">
                      <span
                        className={
                          d.q3
                            ? d.isPole
                              ? 'text-[#FFD60A] font-black'
                              : 'text-white font-bold'
                            : 'text-zinc-600'
                        }
                      >
                        {d.q3 || '-'}
                      </span>
                    </div>

                    <div className="hidden sm:flex sm:col-span-2 text-right items-center justify-end gap-1 font-mono text-xs font-tabular">
                      <span
                        className={
                          item.isPhaseLeader ? 'text-[#FFD60A] font-bold text-[11px]' : 'text-zinc-400'
                        }
                      >
                        {item.displayGap}
                      </span>
                      <div className="text-zinc-500">
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="bg-[#0B0E14] border-t border-b border-white/[0.06] px-4 py-3 text-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: d.teamColor }}
                          />
                          <span className="font-bold text-white text-sm">{d.fullName}</span>
                          <span className="text-zinc-400 text-xs">({d.teamName})</span>
                        </div>
                        <span className="text-zinc-400 font-mono text-[10px]">
                          {t.qualy.provisionalGrid} <strong className="text-white">P{item.displayPos}</strong>
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center font-mono mt-2">
                        <div className="bg-[#131722] border border-white/[0.06] rounded-lg p-2">
                          <span className="text-[10px] text-zinc-500 block uppercase font-sans">
                            {t.qualy.q1Run}
                          </span>
                          <span className="font-bold text-zinc-200 text-xs font-tabular">
                            {d.q1 || t.qualy.noTime}
                          </span>
                        </div>
                        <div className="bg-[#131722] border border-white/[0.06] rounded-lg p-2">
                          <span className="text-[10px] text-zinc-500 block uppercase font-sans">
                            {t.qualy.q2Run}
                          </span>
                          <span className="font-bold text-zinc-200 text-xs font-tabular">
                            {d.q2 || (d.pos >= 16 ? t.qualy.noQ2 : '-')}
                          </span>
                        </div>
                        <div className="bg-[#131722] border border-white/[0.06] rounded-lg p-2">
                          <span className="text-[10px] text-zinc-500 block uppercase font-sans">
                            {t.qualy.q3Run}
                          </span>
                          <span className="font-bold text-zinc-200 text-xs font-tabular">
                            {d.q3 || (d.pos >= 11 ? t.qualy.noQ3 : '-')}
                          </span>
                        </div>
                      </div>

                      {/* View Driver Profile Button */}
                      <button
                        type="button"
                        onClick={() => openDriverProfile(undefined, d.code, d.fullName)}
                        className="mt-3 w-full py-2 px-3 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-zinc-300 hover:text-white font-mono text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <span>👤</span>
                        <span>{lang === 'es' ? 'Ver Ficha Oficial de Piloto' : 'View Official Driver Profile'}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Sub-navigation Switcher: LIVE vs RESULTS (available when live data exists) */}
      {liveDrivers.length > 0 && (
        <div className="flex items-center justify-between bg-[#131722] border border-white/[0.08] rounded-xl p-1 select-none text-xs font-mono gap-1">
          <button
            type="button"
            onClick={() => setUserViewMode('LIVE')}
            className={`flex-1 py-1.5 px-2.5 rounded-lg font-bold text-center transition-colors cursor-pointer truncate flex items-center justify-center gap-1.5 ${
              viewMode === 'LIVE'
                ? 'bg-emerald-500/15 text-emerald-300 shadow-sm border border-emerald-500/30'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              {lang === 'es' ? 'TELEMETRÍA EN VIVO' : 'LIVE TELEMETRY'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setUserViewMode('RESULTS')}
            className={`flex-1 py-1.5 px-2.5 rounded-lg font-bold text-center transition-colors cursor-pointer truncate ${
              viewMode === 'RESULTS'
                ? 'bg-[#1C2230] text-white shadow-sm border border-white/10'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {lang === 'es' ? 'RESULTADOS OFICIALES' : 'OFFICIAL RESULTS'}
          </button>
        </div>
      )}

      {viewMode === 'LIVE' && liveDrivers.length > 0
        ? renderLiveQualifying()
        : renderHistoricalQualifying()}

      {/* Driver Profile Modal */}
      <DriverProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={selectedProfile}
        isPinned={selectedProfile ? pinnedDriverNumber === selectedProfile.number : false}
        onTogglePin={togglePin}
      />
    </div>
  );
};
