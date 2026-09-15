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
import { useSeries } from '../../hooks/useSeries';
import { translateSessionName } from '../../utils/sessionTranslation';
import { useTimezone } from '../../hooks/useTimezone';
import { TrackTimeToggle } from '../common/TrackTimeToggle';
import { getCircuitTimezone } from '../../utils/circuitTimezones';

export const ScheduleView: React.FC = () => {
  const { lang, t } = useLanguage();
  const { series, theme } = useSeries();
  const { mode, setTrackCircuit, formatSessionDate, formatSessionTime } = useTimezone();
  const [races, setRaces] = useState<JolpicaRace[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedRound, setExpandedRound] = useState<number | null>(null);
  const [roundResults, setRoundResults] = useState<Record<number, JolpicaRaceDetail>>({});
  const [loadingResultRound, setLoadingResultRound] = useState<number | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<Record<number, 'results' | 'schedule'>>({});
  const [subSessionTab, setSubSessionTab] = useState<Record<number, 'feature' | 'sprint'>>({});
  const [showFullGridRound, setShowFullGridRound] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [now] = useState<number>(() => Date.now());

  useEffect(() => {
    let cancelled = false;
    fetchSchedule(series).then((data) => {
      if (cancelled) return;
      setRaces(data);
      setLoading(false);
      const next = data.find((r) => r.isNext);
      if (next) {
        setExpandedRound(next.round);
      } else if (data.length > 0) {
        setExpandedRound(data[data.length - 1].round);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [series]);


  const nextRace = races.find((r) => r.isNext);

  useEffect(() => {
    if (nextRace) {
      setTrackCircuit(nextRace.circuitName, nextRace.locality, nextRace.country);
    }
  }, [nextRace, setTrackCircuit]);

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
          const detail = await fetchRaceResultsByRound(round, series);
          if (detail && detail.results && detail.results.length > 0) {
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

  const formatLocalDate = (dateStr: string, roundTz?: string) => {
    if (!dateStr) return t.betweenRaces.toConfirm;
    try {
      return formatSessionDate(dateStr, lang, roundTz);
    } catch {
      return dateStr.split('T')[0] || t.betweenRaces.toConfirm;
    }
  };

  const formatLocalDateShort = (dateStr: string, roundTz?: string) => {
    if (!dateStr) return '';
    try {
      const full = formatSessionDate(dateStr, lang, roundTz);
      const parts = full.replace(',', '').split(' ').filter(Boolean);
      if (parts.length >= 3) {
        return `${parts[1]} ${parts[2]}`.toUpperCase();
      }
      return full.toUpperCase();
    } catch {
      return dateStr.split('T')[0] || '';
    }
  };

  const formatLocalTime = (dateStr: string, roundTz?: string): string | null => {
    return formatSessionTime(dateStr, roundTz);
  };

  const translateSession = (name: string) => translateSessionName(name, lang);

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
      {/* Next GP Countdown Header */}
      {nextRace && (
        <div
          className="bg-[#131722] border border-white/[0.08] rounded-xl p-4 sm:p-5 relative overflow-hidden shadow-sm"
          style={{ borderTop: `3px solid ${theme.primary}` }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest border"
                style={{
                  backgroundColor: `${theme.primary}20`,
                  color: theme.primary,
                  borderColor: `${theme.primary}40`,
                }}
              >
                {series.toUpperCase()} • {t.schedule.nextGp} • {t.betweenRaces.round} {nextRace.round}
              </span>

              {(series !== 'f1' || nextRace.sessions?.some((s) => s.name.toLowerCase().includes('sprint'))) && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  <Zap className="w-2.5 h-2.5" />
                  <span>{t.schedule.doubleRaceFormat}</span>
                </span>
              )}
            </div>

            {/* Dual Clock Track Time Switcher in Next GP Hero Card (Visible only on mobile since desktop navbar already displays it) */}
            <div className="flex items-center self-end sm:self-auto gap-2 shrink-0 sm:hidden">
              <TrackTimeToggle />
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
            {nextRace.raceName}
          </h2>
          <div className="flex items-center justify-between mt-1 flex-wrap gap-2">
            <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
              <MapPin className="w-3.5 h-3.5" style={{ color: theme.primary }} />
              <span>{nextRace.circuitName.toUpperCase()}</span>
              <span>•</span>
              <span>
                {nextRace.locality.toUpperCase()}, {nextRace.country.toUpperCase()}
              </span>
            </div>
            <span className="text-[11px] text-zinc-400 font-mono">
              {mode === 'track'
                ? `⚡ ${t.schedule.trackTimeHint}: ${nextRace.locality}`
                : `📍 ${t.schedule.deviceTimeHint}`}
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
                <span
                  className="text-lg sm:text-2xl font-bold font-mono tabular-nums"
                  style={{ color: theme.primary }}
                >
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

      {/* Season Completed Hero Card (when all rounds have completed, e.g. F3) */}
      {!nextRace && races.length > 0 && (
        <div
          className="bg-[#131722] border border-white/[0.08] rounded-xl p-4 sm:p-5 relative shadow-sm overflow-hidden"
          style={{ borderTop: `3px solid ${theme.primary}` }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest w-fit border"
              style={{
                backgroundColor: `${theme.primary}20`,
                color: theme.primary,
                borderColor: `${theme.primary}40`,
              }}
            >
              <Trophy className="w-3 h-3 text-amber-400" />
              {series.toUpperCase()} • {t.schedule.seasonCompletedTitle}
            </span>
            <span className="text-[11px] text-zinc-400 font-mono">
              {races.length} {t.schedule.rounds} • {lang === 'es' ? 'CAMPEONATO CONCLUIDO' : 'SEASON FINISHED'}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
            {series === 'f3'
              ? (lang === 'es' ? 'Freddie Slater • Campeón Mundial FIA F3 2026' : 'Freddie Slater • 2026 FIA F3 Champion')
              : `${series.toUpperCase()} • ${t.schedule.seasonCompletedTitle}`}
          </h2>
          <p className="text-xs text-zinc-400 mt-1 font-mono">
            {series === 'f3'
              ? (lang === 'es'
                  ? 'Trident Racing (182 pts) · Subcampeón: Théophile Naël (Campos Racing, 154 pts) · Campeón Constructores: Campos Racing (399 pts)'
                  : 'Trident Racing (182 pts) · Runner-up: Théophile Naël (Campos Racing, 154 pts) · Constructors Champion: Campos Racing (399 pts)')
              : t.schedule.seasonCompletedSubtitle}
          </p>

          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-white/[0.06] text-xs font-mono">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0B0E14] border border-amber-500/30 text-amber-300 font-bold whitespace-nowrap">
              🥇 <span className="sm:hidden">{series === 'f3' ? 'Slater (182 pts)' : '---'}</span>
              <span className="hidden sm:inline">{t.schedule.driverChampion}: {series === 'f3' ? 'Freddie Slater (182 pts)' : '---'}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0B0E14] border border-white/[0.08] text-zinc-300 whitespace-nowrap">
              🥈 <span className="sm:hidden">{series === 'f3' ? 'Naël (154 pts)' : '---'}</span>
              <span className="hidden sm:inline">{t.schedule.runnerUp}: {series === 'f3' ? 'Théophile Naël (154 pts)' : '---'}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0B0E14] border border-white/[0.08] text-zinc-300 whitespace-nowrap">
              🏆 <span className="sm:hidden">{series === 'f3' ? 'Campos (399 pts)' : '---'}</span>
              <span className="hidden sm:inline">{t.schedule.constructorsChampion}: {series === 'f3' ? 'Campos Racing (399 pts)' : '---'}</span>
            </span>
          </div>
        </div>
      )}

      {/* Season Races List */}
      <div className="bg-[#131722] border border-white/[0.08] rounded-xl overflow-hidden shadow-sm">
        <div className="px-4 py-2.5 bg-[#131722] border-b border-white/[0.08] flex items-center justify-between text-xs font-mono font-bold text-zinc-400">
          <div className="flex items-center gap-2 tracking-wider">
            <Calendar className="w-3.5 h-3.5" style={{ color: theme.primary }} />
            <span>{t.schedule.seasonCalendar}</span>
          </div>
          <span className="text-[10px] text-zinc-400 font-mono tracking-widest">
            {races.length} {t.schedule.rounds}
          </span>
        </div>

        <div className="divide-y divide-white/[0.08]">
          {races.map((r) => {
            const isExpanded = expandedRound === r.round;
            const isPast = r.status ? r.status === 'COMPLETED' : new Date(r.raceDateTime).getTime() + 3 * 3600 * 1000 < now;
            const isDoubleRace = series !== 'f1' || r.sessions?.some((s) => s.name.toLowerCase().includes('sprint'));
            const currentTab = activeSubTab[r.round] || (isPast ? 'results' : 'schedule');
            const detail = roundResults[r.round];
            const isLoadingDetail = loadingResultRound === r.round;
            const showFull = showFullGridRound[r.round] || false;

            return (
              <div key={r.round} className="flex flex-col">
                <button
                  type="button"
                  onClick={() => toggleRound(r.round, isPast)}
                  className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors select-none"
                  style={r.isNext ? { backgroundColor: `${theme.primary}12` } : undefined}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                    <span className="font-mono text-xs font-bold text-zinc-400 w-7 text-center tabular-nums shrink-0">
                      R{String(r.round).padStart(2, '0')}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap min-w-0">
                        <span className="text-xs sm:text-sm font-bold text-white tracking-tight uppercase truncate">
                          {r.raceName}
                        </span>
                        <div className="flex items-center gap-1 flex-nowrap shrink-0">
                          {isDoubleRace && (
                            <span
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30 shrink-0 whitespace-nowrap"
                              title={lang === 'es' ? 'Formato de fin de semana con Carrera Sprint y Carrera Principal' : 'Double race format weekend'}
                            >
                              <Zap className="w-2.5 h-2.5" />
                              <span className="hidden sm:inline">{t.schedule.doubleRaceFormat}</span>
                              <span className="sm:hidden">{lang === 'es' ? 'DOBLE' : '2-RACE'}</span>
                            </span>
                          )}
                          {r.isNext && (
                            <span
                              className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase border shrink-0 whitespace-nowrap"
                              style={{
                                backgroundColor: `${theme.primary}25`,
                                color: theme.primary,
                                borderColor: `${theme.primary}45`,
                              }}
                            >
                              {t.schedule.nextBadge}
                            </span>
                          )}
                          {isPast && (
                            <span className="inline-flex items-center gap-1 text-[9px] text-[#39B54A] font-mono font-bold bg-[#39B54A]/10 border border-[#39B54A]/30 px-1.5 py-0.5 rounded shrink-0 whitespace-nowrap">
                              <CheckCircle2 className="w-3 h-3 shrink-0" />
                              <span className="hidden sm:inline">{t.schedule.resultsAvailable}</span>
                              <span className="sm:hidden">{lang === 'es' ? 'RESULTADO' : 'RESULTS'}</span>
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-[11px] text-zinc-400 font-mono truncate block mt-0.5">
                        {r.circuitName} • {r.country}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2">
                    <span className="font-mono text-xs text-zinc-400 tabular-nums hidden sm:inline">
                      {formatLocalDate(r.raceDateTime)}
                    </span>
                    <span className="font-mono text-[10px] font-bold text-zinc-400 tabular-nums uppercase sm:hidden">
                      {formatLocalDateShort(r.raceDateTime)}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
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
                              ? 'keep-white text-white shadow-xs'
                              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-white/[0.04]'
                          }`}
                          style={currentTab === 'results' ? { backgroundColor: theme.primary } : undefined}
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
                              ? 'bg-zinc-200 dark:bg-white/15 text-zinc-900 dark:text-white shadow-xs'
                              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-white/[0.04]'
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
                          (() => {
                            const hasSprint = Boolean(detail.sprintRace);
                            const selectedSubSession = subSessionTab[r.round] || 'feature';
                            const activeResults =
                              selectedSubSession === 'sprint' && detail.sprintRace
                                ? detail.sprintRace.results
                                : detail.results;

                            const activeWinner =
                              selectedSubSession === 'sprint' && detail.sprintRace && detail.sprintRace.results?.[0]
                                ? {
                                    code: detail.sprintRace.results[0].code,
                                    fullName: detail.sprintRace.results[0].fullName,
                                    teamName: detail.sprintRace.results[0].teamName,
                                    time: detail.sprintRace.results[0].timeOrStatus,
                                  }
                                : detail.winner || (detail.results?.[0] ? {
                                    code: detail.results[0].code,
                                    fullName: detail.results[0].fullName,
                                    teamName: detail.results[0].teamName,
                                    time: detail.results[0].timeOrStatus,
                                  } : null);

                            const activeFastestLap =
                              selectedSubSession === 'sprint' && detail.sprintRace
                                ? detail.sprintRace.fastestLap
                                : detail.fastestLap;

                            return (
                              <div className="flex flex-col gap-2.5">
                                {/* Sprint / Feature selector for F2/F3 */}
                                {hasSprint && (
                                  <div className="flex items-center gap-1 bg-[#131722] p-0.5 rounded-lg border border-white/[0.08] text-[10px] font-mono select-none w-fit">
                                    <button
                                      type="button"
                                      onClick={() => setSubSessionTab((prev) => ({ ...prev, [r.round]: 'feature' }))}
                                      className={`px-2.5 py-1 rounded font-bold uppercase transition-colors cursor-pointer ${
                                        selectedSubSession === 'feature'
                                          ? 'keep-white text-white shadow-xs'
                                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                                      }`}
                                      style={selectedSubSession === 'feature' ? { backgroundColor: theme.primary } : undefined}
                                    >
                                      {series === 'f1'
                                        ? (lang === 'es' ? 'Carrera Principal' : 'Grand Prix')
                                        : (lang === 'es' ? 'Carrera Principal' : 'Feature Race')}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setSubSessionTab((prev) => ({ ...prev, [r.round]: 'sprint' }))}
                                      className={`px-2.5 py-1 rounded font-bold uppercase transition-colors cursor-pointer ${
                                        selectedSubSession === 'sprint'
                                          ? 'keep-white text-white shadow-xs'
                                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                                      }`}
                                      style={selectedSubSession === 'sprint' ? { backgroundColor: theme.primary } : undefined}
                                    >
                                      {lang === 'es' ? 'Carrera Sprint' : 'Sprint Race'}
                                    </button>
                                  </div>
                                )}

                                {/* Winner & Fastest Lap Quick Banner */}
                                {activeWinner && (
                                  <div className="bg-[#131722] border border-white/[0.08] rounded-lg p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-xs">
                                    <div className="flex items-center gap-2">
                                      <span className="w-5 h-5 rounded-md bg-[#FFD60A] text-black font-black flex items-center justify-center text-xs shrink-0">
                                        1
                                      </span>
                                      <span className="text-zinc-400">{t.schedule.winner}</span>
                                      <strong className="text-white">
                                        {activeWinner.fullName} ({activeWinner.code})
                                      </strong>
                                      <span className="text-[11px] text-zinc-400 hidden sm:inline">
                                        • {activeWinner.teamName}
                                      </span>
                                    </div>
                                    {activeFastestLap && (
                                      <div className="flex items-center gap-1.5 text-purple-300 text-[11px]">
                                        <Zap className="w-3 h-3 text-purple-400" />
                                        <span>{t.schedule.fastestLap}</span>
                                        <strong className="text-white">
                                          {activeFastestLap.code} ({activeFastestLap.time})
                                        </strong>
                                      </div>
                                    )}
                                  </div>
                                )}

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
                                    {(showFull ? activeResults : activeResults.slice(0, 10)).map(
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
                                                  : d.status?.toLowerCase().includes('ret')
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
                                  {activeResults.length > 10 && (
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
                                        ? `▼ Ver parrilla completa (P11 - P${activeResults.length})`
                                        : `▼ View full grid (P11 - P${activeResults.length})`}
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })()
                        ) : (
                          <div className="p-4 text-center text-zinc-500 font-mono text-xs">
                            <span>{t.schedule.noBreakdownData}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Schedule Tab View */}
                    {(!isPast || currentTab === 'schedule') && (() => {
                      const roundTz = getCircuitTimezone(r.circuitName, r.locality, r.country);
                      return (
                        <div>
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                              <Clock className="w-3 h-3" style={{ color: theme.primary }} /> {t.schedule.sessionScheduleTitle}
                            </span>
                            <div className="flex items-center gap-2 flex-wrap">
                              {isDoubleRace && (
                                <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-amber-400 uppercase bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded shrink-0">
                                  <Zap className="w-2.5 h-2.5" />
                                  <span>{t.schedule.doubleRaceFormat}</span>
                                </span>
                              )}
                              <TrackTimeToggle className="scale-90 origin-right shrink-0" />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {r.sessions?.map((s, idx) => {
                              const isSprint = s.name.toLowerCase().includes('sprint');
                              const isFeatureOrMain =
                                s.name.toLowerCase().includes('feature') ||
                                (!isSprint && (s.name.toLowerCase().includes('carrera') || s.name.toLowerCase().includes('race')));
                              return (
                                <div
                                  key={idx}
                                  className={`flex items-center justify-between p-2 rounded-lg border text-xs font-mono ${
                                    isFeatureOrMain || isSprint
                                      ? 'bg-[#1C2230] border-t border-b border-r border-white/[0.08] text-white font-bold'
                                      : 'bg-[#131722] border border-white/[0.08] text-zinc-400'
                                  }`}
                                  style={
                                    isFeatureOrMain || isSprint
                                      ? { borderLeft: `3px solid ${isSprint ? '#F59E0B' : theme.primary}` }
                                      : undefined
                                  }
                                >
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <span className="font-semibold uppercase truncate">{translateSession(s.name)}</span>
                                    {isSprint && (
                                      <span className="text-[8px] font-bold px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                                        {lang === 'es' ? 'CARRERA 1' : 'RACE 1'}
                                      </span>
                                    )}
                                    {isFeatureOrMain && series !== 'f1' && (
                                      <span className="text-[8px] font-bold px-1 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 shrink-0">
                                        {lang === 'es' ? 'CARRERA 2' : 'RACE 2'}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 tabular-nums shrink-0">
                                    <span className="text-zinc-400 text-[11px]">
                                      {formatLocalDate(s.dateTime, roundTz)}
                                    </span>
                                    {formatLocalTime(s.dateTime, roundTz) ? (
                                      <span className="font-bold text-white bg-[#0B0E14] border border-white/[0.08] px-1.5 py-0.5 rounded-md">
                                        {formatLocalTime(s.dateTime, roundTz)} HS
                                      </span>
                                    ) : (
                                      <span className="text-zinc-500 bg-[#0B0E14] border border-white/[0.08] px-1.5 py-0.5 rounded-md text-[10px]">
                                        {t.schedule.toConfirm}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}
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
