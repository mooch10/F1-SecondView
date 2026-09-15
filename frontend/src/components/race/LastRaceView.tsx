import React, { useEffect, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Flag,
  MapPin,
  Timer,
  Trophy,
  Zap,
} from 'lucide-react';
import { fetchLastRaceDetail } from '../../services/api';
import type { JolpicaRaceDetail, JolpicaRaceResult } from '../../types/f1';
import { useLanguage } from '../../hooks/useLanguage';
import { useSeries } from '../../hooks/useSeries';
import { DriverProfileModal } from '../drivers/DriverProfileModal';
import { getDriverProfile, type F1DriverProfile } from '../../data/f1DriversData';

export const LastRaceView: React.FC = () => {
  const { lang, t } = useLanguage();
  const { series, theme } = useSeries();
  const [raceDetail, setRaceDetail] = useState<JolpicaRaceDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedDriver, setExpandedDriver] = useState<number | null>(null);
  const [selectedSession, setSelectedSession] = useState<'feature' | 'sprint'>('feature');

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

  const openDriverProfile = (driverNumber?: number | string, code?: string, fullName?: string) => {
    const profile =
      (code ? getDriverProfile(code, series) : undefined) ||
      (fullName ? getDriverProfile(fullName, series) : undefined) ||
      (driverNumber ? getDriverProfile(driverNumber, series) : undefined);
    if (profile) {
      setSelectedProfile(profile);
      setIsProfileOpen(true);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchLastRaceDetail(series).then((data) => {
      setRaceDetail(data);
      setSelectedSession('feature');
      setLoading(false);
    });
  }, [series]);

  if (loading) {
    return (
      <div className="bg-[#131722] border border-white/[0.08] rounded-xl p-12 text-center text-zinc-400 font-mono text-xs">
        <Timer className="w-6 h-6 text-zinc-400 mx-auto mb-2 animate-pulse" />
        <span>{t.lastRace.loading}</span>
      </div>
    );
  }

  if (!raceDetail || !raceDetail.results || raceDetail.results.length === 0) {
    return (
      <div className="bg-[#131722] border border-white/[0.08] rounded-xl p-8 text-center text-zinc-400 font-mono text-xs">
        <Flag className="w-6 h-6 text-zinc-500 mx-auto mb-2" />
        <span>{t.lastRace.noData}</span>
      </div>
    );
  }

  const activeResults =
    selectedSession === 'sprint' && raceDetail.sprintRace
      ? raceDetail.sprintRace.results
      : raceDetail.featureRace?.results || raceDetail.results;

  const activeFastestLap =
    selectedSession === 'sprint' && raceDetail.sprintRace
      ? raceDetail.sprintRace.fastestLap
      : raceDetail.featureRace?.fastestLap || raceDetail.fastestLap;

  const winner = activeResults[0];
  const podium = activeResults.slice(0, 3);
  const hasSprint = Boolean(raceDetail.sprintRace);

  const toggleExpand = (driverNumber: number) => {
    setExpandedDriver((prev) => (prev === driverNumber ? null : driverNumber));
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr.split('T')[0];
      return d.toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr.split('T')[0];
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Session Switcher if Sprint & Feature exist */}
      {hasSprint && (
        <div className="flex items-center gap-1 bg-[#131722] p-1 rounded-xl border border-white/[0.08] text-xs font-mono select-none">
          <button
            type="button"
            onClick={() => setSelectedSession('feature')}
            className={`flex-1 py-1.5 px-3 rounded-lg font-bold uppercase transition-all cursor-pointer text-center ${
              selectedSession === 'feature'
                ? 'text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            style={selectedSession === 'feature' ? { backgroundColor: theme.primary } : undefined}
          >
            {series === 'f1'
              ? (lang === 'es' ? 'Carrera Principal' : 'Grand Prix')
              : (lang === 'es' ? 'Carrera Principal (Feature)' : 'Feature Race')}
          </button>
          <button
            type="button"
            onClick={() => setSelectedSession('sprint')}
            className={`flex-1 py-1.5 px-3 rounded-lg font-bold uppercase transition-all cursor-pointer text-center ${
              selectedSession === 'sprint'
                ? 'text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            style={selectedSession === 'sprint' ? { backgroundColor: theme.primary } : undefined}
          >
            {lang === 'es' ? 'Carrera Sprint' : 'Sprint Race'}
          </button>
        </div>
      )}

      {/* Grand Prix Showcase Hero Card */}
      <div
        className="bg-[#131722] border border-white/[0.08] rounded-xl p-4 sm:p-5 relative shadow-sm"
        style={{ borderTop: `3px solid ${theme.primary}` }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest border"
                style={{
                  backgroundColor: `${theme.primary}20`,
                  color: theme.primary,
                  borderColor: `${theme.primary}40`,
                }}
              >
                {series.toUpperCase()} • {t.lastRace.round} {raceDetail.round} • {t.lastRace.lastGp}
              </span>
              <span className="text-[11px] text-zinc-400 font-mono">
                {formatDisplayDate(raceDetail.date)}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
              {raceDetail.raceName}
            </h2>
            <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5 font-mono">
              <MapPin className="w-3.5 h-3.5" style={{ color: theme.primary }} />
              <span>{raceDetail.circuitName}</span>
            </div>
          </div>

          {/* Winner Showcase Card */}
          {winner && (
            <div
              className="bg-[#0B0E14] border border-[#FFD60A]/30 rounded-xl p-3 sm:min-w-[240px] flex items-center gap-3"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-lg text-black font-mono shadow-sm shrink-0"
                style={{ backgroundColor: winner.teamColor || '#FFD60A' }}
              >
                1
              </div>
              <div className="flex flex-col leading-tight min-w-0">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <Trophy className="w-2.5 h-2.5" /> {t.lastRace.winnerBadge}
                </span>
                <div className="flex items-center gap-1.5 truncate">
                  {series === 'f1' && winner.code ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDriverProfile(undefined, winner.code, winner.fullName);
                      }}
                      className="font-mono font-black text-xs px-1.5 py-0.5 rounded bg-white/10 hover:bg-[#FFD60A] text-white hover:text-black transition-colors cursor-pointer"
                      title={lang === 'es' ? 'Ver ficha del piloto' : 'View driver profile'}
                    >
                      {winner.code}
                    </button>
                  ) : null}
                  <span className="text-sm font-bold text-white truncate font-sans">
                    {winner.fullName}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono mt-0.5">
                  <span className="text-zinc-400 truncate">{winner.teamName}</span>
                  <span className="text-[#FFD60A] font-bold bg-white/[0.08] px-1.5 py-0.2 rounded">
                    {winner.timeOrStatus}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Podium Recap & Fastest Lap Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 border-t border-white/[0.08] pt-3">
          {podium.map((p) => {
            const medalBorder =
              p.pos === 1
                ? 'border-[#FFD60A]/40 bg-[#FFD60A]/[0.05]'
                : p.pos === 2
                ? 'border-zinc-400/30 bg-white/[0.02]'
                : 'border-amber-700/30 bg-amber-900/[0.04]';

            const medalBadge =
              p.pos === 1
                ? 'bg-[#FFD60A] text-black'
                : p.pos === 2
                ? 'bg-zinc-300 text-black'
                : 'bg-amber-700 text-white';

            return (
              <div
                key={p.driverNumber}
                className={`p-2.5 rounded-lg border flex items-center justify-between font-mono text-xs ${medalBorder}`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`w-5 h-5 rounded-full font-black text-[10px] flex items-center justify-center shrink-0 ${medalBadge}`}
                  >
                    {p.pos}
                  </span>
                  <div className="flex flex-col leading-tight truncate">
                    <div className="flex items-center gap-1">
                      {p.code ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDriverProfile(undefined, p.code, p.fullName);
                          }}
                          className="font-bold text-white text-xs hover:text-[#FFD60A] hover:underline cursor-pointer transition-colors"
                          title={lang === 'es' ? 'Ver ficha del piloto' : 'View driver profile'}
                        >
                          {p.code}
                        </button>
                      ) : (
                        <span className="font-bold text-white text-xs">{p.code}</span>
                      )}
                      <span className="text-xs text-zinc-300 truncate">
                        • {p.familyName}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400 truncate">
                      {p.teamName}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] text-zinc-300 font-bold shrink-0 ml-1">
                  {p.timeOrStatus}
                </span>
              </div>
            );
          })}
        </div>

        {/* Fastest Lap Callout */}
        {activeFastestLap && (
          <div className="mt-2.5 bg-purple-950/20 border border-purple-500/30 rounded-lg px-3 py-1.5 flex items-center justify-between font-mono text-xs min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 text-purple-300 min-w-0 flex-1">
              <Zap className="w-3.5 h-3.5 text-purple-400 animate-pulse shrink-0" />
              <span className="font-bold uppercase tracking-wider text-[10px] sm:text-[11px] whitespace-nowrap shrink-0">
                <span className="sm:hidden">{lang === 'es' ? 'V. RÁPIDA:' : 'F. LAP:'}</span>
                <span className="hidden sm:inline">{t.lastRace.fastestLapTitle}</span>
              </span>
              <strong className="text-white font-sans text-xs truncate">
                <span className="hidden sm:inline">{activeFastestLap.driverName} ({activeFastestLap.code})</span>
                <span className="sm:hidden">{activeFastestLap.code} • {activeFastestLap.driverName.split(' ').slice(-1)[0]}</span>
              </strong>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-2">
              <span className="text-zinc-400 text-[10px] hidden sm:inline">
                {t.lastRace.lap} {activeFastestLap.lap}
              </span>
              <span className="font-black text-purple-300 bg-purple-500/20 border border-purple-500/40 px-2 py-0.5 rounded text-[11px] whitespace-nowrap">
                {activeFastestLap.time} 🟣
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main Race Classification Table */}
      <div className="bg-[#131722] border border-white/[0.08] rounded-xl shadow-lg overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-1 px-3 py-2 bg-[#1C2230] border-b border-white/[0.08] text-[10px] font-bold tracking-wider uppercase text-zinc-400 font-mono select-none">
          <div className="col-span-1 text-center whitespace-nowrap">{t.lastRace.headers.pos}</div>
          <div className="col-span-5 sm:col-span-4 whitespace-nowrap">{t.lastRace.headers.driver}</div>
          <div className="hidden sm:block sm:col-span-2 text-center whitespace-nowrap">{t.lastRace.headers.start}</div>
          <div className="hidden sm:block sm:col-span-1 text-center whitespace-nowrap">{t.lastRace.headers.laps}</div>
          <div className="col-span-3 sm:col-span-2 text-right sm:text-center whitespace-nowrap">
            <span className="sm:hidden">{lang === 'es' ? 'TIEMPO' : 'TIME'}</span>
            <span className="hidden sm:inline">{t.lastRace.headers.timeStatus}</span>
          </div>
          <div className="col-span-3 sm:col-span-2 text-right whitespace-nowrap">{t.lastRace.headers.points}</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-white/[0.04]">
          {activeResults.map((d: JolpicaRaceResult, index: number) => {
            const isExpanded = expandedDriver === d.driverNumber;
            const prevDriver = index > 0 ? activeResults[index - 1] : null;
            const pointsCutoff = selectedSession === 'sprint' ? (series === 'f2' ? 8 : 10) : 10;
            const showPointsCutoff = d.pos > pointsCutoff && (!prevDriver || prevDriver.pos <= pointsCutoff);
            const isPointsZone = d.pos <= pointsCutoff;

            return (
              <div key={d.driverNumber} className="flex flex-col">
                {/* Línea divisoria de zona de puntos (Top 10) */}
                {showPointsCutoff && (
                  <div className="h-[2px] bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.5)] my-0" />
                )}

                {/* Main Row */}
                <button
                  type="button"
                  onClick={() => toggleExpand(d.driverNumber)}
                  className={`w-full text-left grid grid-cols-12 gap-1 px-3 py-2.5 items-center transition-colors select-none ${
                    isExpanded ? 'bg-white/[0.05]' : 'hover:bg-white/[0.02]'
                  } ${d.isWinner ? 'bg-[#FFD60A]/[0.03]' : ''}`}
                >
                  {/* Position */}
                  <div className="col-span-1 flex items-center justify-center">
                    <span
                      className={`font-mono text-sm font-black font-tabular text-center ${
                        d.isWinner
                          ? 'text-[#FFD60A]'
                          : d.isPodium
                          ? 'text-white'
                          : isPointsZone
                          ? 'text-emerald-400'
                          : 'text-zinc-500'
                      }`}
                    >
                      {d.pos}
                    </span>
                  </div>

                  {/* Driver & Team */}
                  <div
                    className="col-span-5 sm:col-span-4 flex items-center gap-2 overflow-hidden"
                  >
                    <span
                      className="w-1 h-6 rounded-full flex-shrink-0"
                      style={{ backgroundColor: d.teamColor || '#71717A' }}
                    />
                    <div className="flex flex-col leading-tight truncate">
                      <div className="flex items-center gap-1.5 flex-nowrap">
                        {d.code ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDriverProfile(undefined, d.code, d.fullName);
                            }}
                            className="font-mono text-sm font-bold text-white tracking-tight hover:text-[#FFD60A] hover:underline cursor-pointer transition-colors whitespace-nowrap"
                            title={lang === 'es' ? 'Ver ficha oficial del piloto' : 'View driver profile'}
                          >
                            {d.code}
                          </button>
                        ) : (
                          <span className="font-mono text-sm font-bold text-white tracking-tight whitespace-nowrap">
                            {d.code}
                          </span>
                        )}
                        <span className="text-[10px] text-zinc-500 font-mono whitespace-nowrap">
                          #{d.driverNumber}
                        </span>
                        {d.isFastestLap && (
                          <span className="px-1 sm:px-1.5 py-0.2 rounded text-[8px] sm:text-[9px] font-mono font-black bg-purple-500/20 text-purple-300 border border-purple-500/40 tracking-tight whitespace-nowrap shrink-0">
                            <span className="sm:hidden">🟣 VR</span>
                            <span className="hidden sm:inline">{t.live.table.fastestLap}</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-400 group-hover:text-zinc-200 truncate hidden sm:block transition-colors">
                        {d.fullName}
                      </span>
                    </div>
                  </div>

                  {/* Grid Start & Position Change (Desktop only, mobile visible in drawer) */}
                  <div className="hidden sm:flex sm:col-span-2 items-center justify-center font-mono text-xs font-tabular">
                    <div className="flex items-center gap-1">
                      <span className="text-zinc-500 text-[10px]">P{d.grid}</span>
                      {d.posChange > 0 ? (
                        <span className="px-1 py-0.2 rounded text-[9px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          ▲ +{d.posChange}
                        </span>
                      ) : d.posChange < 0 ? (
                        <span className="px-1 py-0.2 rounded text-[9px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                          ▼ {d.posChange}
                        </span>
                      ) : (
                        <span className="text-zinc-600 text-[10px]">=</span>
                      )}
                    </div>
                  </div>

                  {/* Laps Completed (Desktop only, mobile visible in drawer) */}
                  <div className="hidden sm:block sm:col-span-1 text-center font-mono text-xs font-tabular text-zinc-400">
                    {d.laps}
                  </div>

                  {/* Time / Status / Gap */}
                  <div className="col-span-3 sm:col-span-2 text-right sm:text-center font-mono text-xs font-tabular">
                    <span
                      className={`truncate block ${
                        d.isWinner
                          ? 'text-[#FFD60A] font-bold text-[11px] sm:text-xs'
                          : d.status.toLowerCase().includes('ret') || d.status.toLowerCase().includes('col')
                          ? 'text-rose-400 font-semibold text-[10px]'
                          : 'text-zinc-300 text-[11px] sm:text-xs'
                      }`}
                    >
                      {d.timeOrStatus}
                    </span>
                  </div>

                  {/* Points Badge (Visible on Mobile & Desktop) */}
                  <div className="col-span-3 sm:col-span-2 flex items-center justify-end gap-1.5 font-mono text-xs font-tabular">
                    {d.points > 0 ? (
                      <span
                        className={`px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold whitespace-nowrap shrink-0 ${
                          d.isFastestLap && isPointsZone
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                            : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        +{d.points} PTS
                      </span>
                    ) : (
                      <span className="text-zinc-600 text-[10px] sm:text-[11px] whitespace-nowrap shrink-0">0 PTS</span>
                    )}

                    <div className="text-zinc-500 shrink-0">
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanded Driver Breakdown Drawer */}
                {isExpanded && (
                  <div className="bg-[#0B0E14] border-t border-b border-white/[0.06] px-4 py-3 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: d.teamColor }}
                        />
                        <span className="font-bold text-white text-sm">
                          {d.fullName}
                        </span>
                        <span className="text-zinc-400 text-xs">
                          ({d.teamName})
                        </span>
                      </div>
                      <span className="text-zinc-400 font-mono text-[10px]">
                        {lang === 'es' ? 'Posición final:' : 'Final position:'} <strong className="text-white">P{d.pos}</strong> ({d.points} {lang === 'es' ? 'puntos' : 'points'})
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono mt-2">
                      <div className="bg-[#131722] border border-white/[0.06] rounded-lg p-2">
                        <span className="text-[10px] text-zinc-500 block uppercase font-sans">
                          {t.lastRace.startedFrom}
                        </span>
                        <span className="font-bold text-zinc-200 text-xs font-tabular">
                          P{d.grid} {d.posChange > 0 ? `(▲ +${d.posChange})` : d.posChange < 0 ? `(▼ ${d.posChange})` : '(=)'}
                        </span>
                      </div>

                      <div className="bg-[#131722] border border-white/[0.06] rounded-lg p-2">
                        <span className="text-[10px] text-zinc-500 block uppercase font-sans">
                          {t.lastRace.lapsCompleted}
                        </span>
                        <span className="font-bold text-zinc-200 text-xs font-tabular">
                          {d.laps} {lang === 'es' ? 'vueltas' : 'laps'}
                        </span>
                      </div>

                      <div className="bg-[#131722] border border-white/[0.06] rounded-lg p-2">
                        <span className="text-[10px] text-zinc-500 block uppercase font-sans">
                          {t.lastRace.bestLap}
                        </span>
                        <span className="font-bold text-zinc-200 text-xs font-tabular">
                          {d.fastestLapTime ? (
                            <span className={d.isFastestLap ? 'text-purple-300' : 'text-zinc-200'}>
                              {d.fastestLapTime} {d.isFastestLap && '🟣'}
                            </span>
                          ) : (
                            'N/A'
                          )}
                        </span>
                      </div>

                      <div className="bg-[#131722] border border-white/[0.06] rounded-lg p-2">
                        <span className="text-[10px] text-zinc-500 block uppercase font-sans">
                          {t.lastRace.officialStatus}
                        </span>
                        <span
                          className={`font-bold text-xs font-tabular ${
                            d.status === 'Finished'
                              ? 'text-emerald-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {d.status}
                        </span>
                      </div>
                    </div>

                    {/* View Driver Profile Button */}
                    {series === 'f1' && (
                      <button
                        type="button"
                        onClick={() => openDriverProfile(undefined, d.code, d.fullName)}
                        className="mt-3 w-full py-2 px-3 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-zinc-300 hover:text-white font-mono text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <span>👤</span>
                        <span>{lang === 'es' ? 'Ver Ficha Oficial de Piloto' : 'View Official Driver Profile'}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

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
