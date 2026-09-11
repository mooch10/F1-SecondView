import React, { useEffect, useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
  Trophy,
  Zap,
} from 'lucide-react';
import { fetchRaceResultsByRound, fetchSchedule } from '../../services/api';
import type { JolpicaRace, JolpicaRaceDetail } from '../../types/f1';
import { useLanguage } from '../../hooks/useLanguage';

export const ScheduleView: React.FC = () => {
  const { lang, t } = useLanguage();
  const [races, setRaces] = useState<JolpicaRace[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedRound, setExpandedRound] = useState<number | null>(null);
  const [roundResults, setRoundResults] = useState<Record<number, JolpicaRaceDetail>>({});
  const [loadingResultRound, setLoadingResultRound] = useState<number | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<Record<number, 'results' | 'schedule'>>({});
  const [showFullGridRound, setShowFullGridRound] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [now] = useState<number>(() => Date.now());

  useEffect(() => {
    fetchSchedule().then((data) => {
      setRaces(data);
      setLoading(false);
      const next = data.find((r) => r.isNext);
      if (next) {
        setExpandedRound(next.round);
      }
    });
  }, []);

  const nextRace = races.find((r) => r.isNext);

  useEffect(() => {
    if (!nextRace?.raceDateTime) return;

    const targetDate = new Date(nextRace.raceDateTime).getTime();
    if (isNaN(targetDate)) return;

    const updateCountdown = () => {
      const currentTime = Date.now();
      const diff = targetDate - currentTime;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [nextRace]);

  const toggleRound = async (round: number, isPast: boolean) => {
    if (expandedRound === round) {
      setExpandedRound(null);
      return;
    }

    setExpandedRound(round);

    if (isPast) {
      if (!activeSubTab[round]) {
        setActiveSubTab((prev) => ({ ...prev, [round]: 'results' }));
      }

      if (!roundResults[round]) {
        setLoadingResultRound(round);
        try {
          const detail = await fetchRaceResultsByRound(round);
          if (detail) {
            setRoundResults((prev) => ({ ...prev, [round]: detail }));
          }
        } finally {
          setLoadingResultRound(null);
        }
      }
    } else {
      setActiveSubTab((prev) => ({ ...prev, [round]: 'schedule' }));
    }
  };

  const formatLocalDate = (dateStr: string) => {
    if (!dateStr) return t.betweenRaces.toConfirm;
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return t.betweenRaces.toConfirm;
      return d.toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
      });
    } catch {
      return t.betweenRaces.toConfirm;
    }
  };

  const formatLocalTime = (dateStr: string): string | null => {
    if (!dateStr) return null;
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return null;
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return null;
    }
  };

  const translateSessionName = (name: string) => {
    if (lang === 'es') return name;
    const map: Record<string, string> = {
      'Carrera': 'Race',
      'Clasificación': 'Qualifying',
      'Práctica 1': 'Practice 1',
      'Práctica 2': 'Practice 2',
      'Práctica 3': 'Practice 3',
      'Sprint': 'Sprint',
      'Clasificación Sprint': 'Sprint Shootout',
    };
    return map[name] || name;
  };

  if (loading) {
    return (
      <div className="bg-[#131722] border border-white/[0.08] rounded-xl p-12 text-center text-zinc-400 font-mono text-xs">
        <Calendar className="w-6 h-6 text-zinc-400 mx-auto mb-2 animate-pulse" />
        <span>{t.schedule.loading}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Next GP Hero Countdown Card */}
      {nextRace && (
        <div className="bg-[#131722] border border-white/[0.08] border-t-2 border-t-[#E10600] rounded-xl p-4 sm:p-5 relative shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#E10600]/15 text-[#E10600] border border-[#E10600]/30 tracking-widest w-fit">
              {t.schedule.nextGp} • {t.betweenRaces.round} {nextRace.round}
            </span>
            <span className="text-[11px] text-zinc-400 font-mono">
              {t.schedule.localTime} ({Intl.DateTimeFormat().resolvedOptions().timeZone})
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
            {nextRace.raceName}
          </h2>
          <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1 font-mono">
            <MapPin className="w-3.5 h-3.5 text-[#E10600]" />
            <span>{nextRace.circuitName.toUpperCase()}</span>
            <span>•</span>
            <span>
              {nextRace.locality.toUpperCase()}, {nextRace.country.toUpperCase()}
            </span>
          </div>

          {/* Countdown Clock Digital Boxes */}
          {timeLeft && (
            <div className="grid grid-cols-4 gap-2 mt-4 max-w-sm">
              <div className="bg-[#0B0E14] border border-white/[0.08] rounded-lg p-2 text-center">
                <span className="text-lg sm:text-2xl font-bold text-white font-mono tabular-nums">
                  {timeLeft.days}
                </span>
                <span className="text-[9px] text-zinc-400 uppercase tracking-wider block font-mono">
                  {t.schedule.countdown.days}
                </span>
              </div>
              <div className="bg-[#0B0E14] border border-white/[0.08] rounded-lg p-2 text-center">
                <span className="text-lg sm:text-2xl font-bold text-white font-mono tabular-nums">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[9px] text-zinc-400 uppercase tracking-wider block font-mono">
                  {t.schedule.countdown.hours}
                </span>
              </div>
              <div className="bg-[#0B0E14] border border-white/[0.08] rounded-lg p-2 text-center">
                <span className="text-lg sm:text-2xl font-bold text-white font-mono tabular-nums">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[9px] text-zinc-400 uppercase tracking-wider block font-mono">
                  {t.schedule.countdown.minutes}
                </span>
              </div>
              <div className="bg-[#0B0E14] border border-white/[0.08] rounded-lg p-2 text-center">
                <span className="text-lg sm:text-2xl font-bold text-[#E10600] font-mono tabular-nums">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[9px] text-zinc-400 uppercase tracking-wider block font-mono">
                  {t.schedule.countdown.seconds}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Season Races List */}
      <div className="bg-[#131722] border border-white/[0.08] rounded-xl overflow-hidden shadow-sm">
        <div className="px-4 py-2.5 bg-[#131722] border-b border-white/[0.08] flex items-center justify-between text-xs font-mono font-bold text-zinc-400">
          <div className="flex items-center gap-2 tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-[#E10600]" />
            <span>{t.schedule.seasonCalendar}</span>
          </div>
          <span className="text-[10px] text-zinc-400 font-mono tracking-widest">
            {races.length} {t.schedule.rounds}
          </span>
        </div>

        <div className="divide-y divide-white/[0.08]">
          {races.map((r) => {
            const isExpanded = expandedRound === r.round;
            const isPast = new Date(r.raceDateTime).getTime() < now;
            const currentTab = activeSubTab[r.round] || (isPast ? 'results' : 'schedule');
            const detail = roundResults[r.round];
            const isLoadingDetail = loadingResultRound === r.round;
            const showFull = showFullGridRound[r.round] || false;

            return (
              <div key={r.round} className="flex flex-col">
                <button
                  type="button"
                  onClick={() => toggleRound(r.round, isPast)}
                  className={`w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors select-none ${
                    r.isNext ? 'bg-[#E10600]/[0.04]' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-xs font-bold text-zinc-400 w-7 text-center tabular-nums shrink-0">
                      R{String(r.round).padStart(2, '0')}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap">
                        <span className="text-xs sm:text-sm font-bold text-white tracking-tight uppercase truncate">
                          {r.raceName}
                        </span>
                        {r.isNext && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-[#E10600]/20 text-[#E10600] border border-[#E10600]/30 shrink-0">
                            {t.schedule.nextBadge}
                          </span>
                        )}
                        {isPast && (
                          <span className="inline-flex items-center gap-1 text-[9px] text-[#39B54A] font-mono font-bold bg-[#39B54A]/10 border border-[#39B54A]/30 px-1.5 py-0.2 rounded shrink-0">
                            <CheckCircle2 className="w-3 h-3" /> {t.schedule.resultsAvailable}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-zinc-400 font-mono truncate block">
                        {r.circuitName} • {r.country}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-zinc-400 tabular-nums hidden sm:inline">
                      {formatLocalDate(r.raceDateTime)}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5 text-zinc-400" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                    )}
                  </div>
                </button>

                {/* Expanded Section */}
                {isExpanded && (
                  <div className="bg-[#0B0E14] border-t border-white/[0.08] px-3.5 sm:px-4 py-3">
                    {/* Subtabs for Past Races (Resultados vs Horarios) */}
                    {isPast && (
                      <div className="flex items-center gap-2 mb-3 border-b border-white/[0.08] pb-2 font-mono text-xs select-none">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveSubTab((prev) => ({ ...prev, [r.round]: 'results' }))
                          }
                          className={`px-3 py-1 rounded-md font-bold uppercase text-[11px] transition-colors cursor-pointer flex items-center gap-1.5 ${
                            currentTab === 'results'
                              ? 'bg-[#E10600] text-white shadow-xs'
                              : 'text-zinc-400 hover:text-white bg-white/[0.04]'
                          }`}
                        >
                          <Trophy className="w-3 h-3" />
                          <span>{t.schedule.raceBreakdownTab}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setActiveSubTab((prev) => ({ ...prev, [r.round]: 'schedule' }))
                          }
                          className={`px-3 py-1 rounded-md font-bold uppercase text-[11px] transition-colors cursor-pointer flex items-center gap-1.5 ${
                            currentTab === 'schedule'
                              ? 'bg-white/15 text-white shadow-xs'
                              : 'text-zinc-400 hover:text-white bg-white/[0.04]'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          <span>{t.schedule.sessionTimesTab}</span>
                        </button>
                      </div>
                    )}

                    {/* Results Tab View */}
                    {isPast && currentTab === 'results' && (
                      <div>
                        {isLoadingDetail ? (
                          <div className="p-6 text-center text-zinc-500 font-mono text-xs">
                            <span className="animate-pulse">{t.schedule.loadingBreakdown}</span>
                          </div>
                        ) : detail && detail.results && detail.results.length > 0 ? (
                          <div className="flex flex-col gap-2.5">
                            {/* Winner & Fastest Lap Quick Banner */}
                            <div className="bg-[#131722] border border-white/[0.08] rounded-lg p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-xs">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-md bg-[#FFD60A] text-black font-black flex items-center justify-center text-xs">
                                  1
                                </span>
                                <span className="text-zinc-400">{t.schedule.winner}</span>
                                <strong className="text-white">
                                  {detail.winner.fullName} ({detail.winner.code})
                                </strong>
                                <span className="text-[11px] text-zinc-400">
                                  • {detail.winner.teamName}
                                </span>
                              </div>
                              {detail.fastestLap && (
                                <div className="flex items-center gap-1.5 text-purple-300 text-[11px]">
                                  <Zap className="w-3 h-3 text-purple-400" />
                                  <span>{t.schedule.fastestLap}</span>
                                  <strong className="text-white">
                                    {detail.fastestLap.code} ({detail.fastestLap.time})
                                  </strong>
                                </div>
                              )}
                            </div>

                            {/* Classification Mini Table */}
                            <div className="bg-[#131722] border border-white/[0.08] rounded-lg overflow-hidden shadow-xs">
                              <div className="grid grid-cols-12 gap-1 px-3 py-1.5 bg-[#1C2230] border-b border-white/[0.06] text-[9px] font-mono font-bold uppercase text-zinc-400 select-none">
                                <div className="col-span-1 text-center">{t.live.table.pos}</div>
                                <div className="col-span-5 sm:col-span-5">{t.live.table.driver}</div>
                                <div className="hidden sm:block sm:col-span-2 text-center">{lang === 'es' ? 'LARGADA' : 'START'}</div>
                                <div className="col-span-3 sm:col-span-2 text-right sm:text-center">{lang === 'es' ? 'TIEMPO' : 'TIME'}</div>
                                <div className="col-span-3 sm:col-span-2 text-right">PTS</div>
                              </div>

                              <div className="divide-y divide-white/[0.04]">
                                {(showFull ? detail.results : detail.results.slice(0, 10)).map(
                                  (d) => (
                                    <div
                                      key={d.driverNumber}
                                      className="grid grid-cols-12 gap-1 px-3 py-1.5 items-center font-mono text-xs text-zinc-300"
                                    >
                                      <div
                                        className={`col-span-1 text-center font-black ${
                                          d.pos === 1
                                            ? 'text-[#FFD60A]'
                                            : d.pos <= 3
                                            ? 'text-white'
                                            : d.pos <= 10
                                            ? 'text-emerald-400'
                                            : 'text-zinc-500'
                                        }`}
                                      >
                                        {d.pos}
                                      </div>
                                      <div className="col-span-5 sm:col-span-5 flex items-center gap-1.5 truncate">
                                        <span
                                          className="w-1 h-4 rounded-full shrink-0"
                                          style={{ backgroundColor: d.teamColor || '#71717A' }}
                                        />
                                        <span className="font-bold text-white">{d.code}</span>
                                        <span className="text-[10px] text-zinc-400 truncate hidden sm:inline">
                                          {d.fullName}
                                        </span>
                                      </div>
                                      <div className="hidden sm:block sm:col-span-2 text-center text-[10px] text-zinc-400">
                                        P{d.grid}{' '}
                                        {d.posChange > 0 ? (
                                          <span className="text-emerald-400 text-[9px]">
                                            ▲+{d.posChange}
                                          </span>
                                        ) : d.posChange < 0 ? (
                                          <span className="text-rose-400 text-[9px]">
                                            ▼{d.posChange}
                                          </span>
                                        ) : (
                                          '='
                                        )}
                                      </div>
                                      <div className="col-span-3 sm:col-span-2 text-right sm:text-center text-[11px] truncate">
                                        <span
                                          className={
                                            d.pos === 1
                                              ? 'text-[#FFD60A] font-bold'
                                              : d.status.toLowerCase().includes('ret')
                                              ? 'text-rose-400 text-[10px]'
                                              : 'text-zinc-300'
                                          }
                                        >
                                          {d.timeOrStatus}
                                        </span>
                                      </div>
                                      <div className="col-span-3 sm:col-span-2 text-right font-bold text-[11px]">
                                        {d.points > 0 ? (
                                          <span className="text-emerald-400">+{d.points}</span>
                                        ) : (
                                          <span className="text-zinc-600">0</span>
                                        )}
                                      </div>
                                    </div>
                                  ),
                                )}
                              </div>

                              {/* Toggle to see full grid P11-P20 */}
                              {detail.results.length > 10 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setShowFullGridRound((prev) => ({
                                      ...prev,
                                      [r.round]: !showFull,
                                    }))
                                  }
                                  className="w-full py-2 bg-white/[0.02] hover:bg-white/[0.05] border-t border-white/[0.06] text-center font-mono text-[10px] font-bold text-zinc-400 hover:text-white uppercase transition-colors cursor-pointer"
                                >
                                  {showFull
                                    ? t.schedule.viewTop10
                                    : lang === 'es'
                                    ? `▼ Ver parrilla completa (P11 - P${detail.results.length})`
                                    : `▼ View full grid (P11 - P${detail.results.length})`}
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 text-center text-zinc-500 font-mono text-xs">
                            <span>{t.schedule.noBreakdownData}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Schedule Tab View */}
                    {(!isPast || currentTab === 'schedule') && (
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-[#E10600]" /> {t.schedule.sessionScheduleTitle}
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {r.sessions?.map((s, idx) => (
                            <div
                              key={idx}
                              className={`flex items-center justify-between p-2 rounded-lg border text-xs font-mono ${
                                s.name === 'Carrera'
                                  ? 'bg-[#1C2230] border-l-2 border-l-[#E10600] border-t border-b border-r border-white/[0.08] text-white font-bold'
                                  : 'bg-[#131722] border border-white/[0.08] text-zinc-400'
                              }`}
                            >
                              <span className="font-semibold uppercase">{translateSessionName(s.name)}</span>
                              <div className="flex items-center gap-2 tabular-nums">
                                <span className="text-zinc-400 text-[11px]">
                                  {formatLocalDate(s.dateTime)}
                                </span>
                                {formatLocalTime(s.dateTime) ? (
                                  <span className="font-bold text-white bg-[#0B0E14] border border-white/[0.08] px-1.5 py-0.5 rounded-md">
                                    {formatLocalTime(s.dateTime)} HS
                                  </span>
                                ) : (
                                  <span className="text-zinc-500 bg-[#0B0E14] border border-white/[0.08] px-1.5 py-0.5 rounded-md text-[10px]">
                                    {t.schedule.toConfirm}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
