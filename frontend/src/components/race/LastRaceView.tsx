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

export const LastRaceView: React.FC = () => {
  const { lang, t } = useLanguage();
  const [raceDetail, setRaceDetail] = useState<JolpicaRaceDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedDriver, setExpandedDriver] = useState<number | null>(null);

  useEffect(() => {
    fetchLastRaceDetail().then((data) => {
      setRaceDetail(data);
      setLoading(false);
    });
  }, []);

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

  const winner = raceDetail.results[0];
  const podium = raceDetail.results.slice(0, 3);
  const fastestLap = raceDetail.fastestLap;

  const toggleExpand = (driverNumber: number) => {
    setExpandedDriver((prev) => (prev === driverNumber ? null : driverNumber));
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Grand Prix Showcase Hero Card */}
      <div className="bg-[#131722] border border-white/[0.08] border-t-2 border-t-[#E10600] rounded-xl p-4 sm:p-5 relative shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#E10600]/15 text-[#E10600] border border-[#E10600]/30 tracking-widest">
                {t.lastRace.round} {raceDetail.round} • {t.lastRace.lastGp}
              </span>
              <span className="text-[11px] text-zinc-400 font-mono">
                {raceDetail.date}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
              {raceDetail.raceName}
            </h2>
            <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5 font-mono">
              <MapPin className="w-3.5 h-3.5 text-[#E10600]" />
              <span>{raceDetail.circuitName}</span>
            </div>
          </div>

          {/* Winner Showcase Card */}
          {winner && (
            <div className="bg-[#0B0E14] border border-[#FFD60A]/30 rounded-xl p-3 sm:min-w-[240px] flex items-center gap-3">
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
                <span className="text-sm font-bold text-white truncate font-sans">
                  {winner.fullName}
                </span>
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
                    <span className="font-bold text-white text-xs truncate">
                      {p.code} • {p.familyName}
                    </span>
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
        {fastestLap && (
          <div className="mt-2.5 bg-purple-950/20 border border-purple-500/30 rounded-lg px-3 py-1.5 flex items-center justify-between font-mono text-xs">
            <div className="flex items-center gap-2 text-purple-300">
              <Zap className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span className="font-bold uppercase tracking-wider text-[10px] sm:text-[11px]">
                {t.lastRace.fastestLapTitle}
              </span>
              <strong className="text-white font-sans">
                {fastestLap.driverName} ({fastestLap.code})
              </strong>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-400 text-[10px] hidden sm:inline">
                {t.lastRace.lap} {fastestLap.lap}
              </span>
              <span className="font-black text-purple-300 bg-purple-500/20 border border-purple-500/40 px-2 py-0.5 rounded text-[11px]">
                {fastestLap.time} 🟣
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main Race Classification Table */}
      <div className="bg-[#131722] border border-white/[0.08] rounded-xl shadow-lg overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-1 px-3 py-2 bg-[#1C2230] border-b border-white/[0.08] text-[10px] font-bold tracking-wider uppercase text-zinc-400 font-mono select-none">
          <div className="col-span-1 text-center">{t.lastRace.headers.pos}</div>
          <div className="col-span-5 sm:col-span-4">{t.lastRace.headers.driver}</div>
          <div className="hidden sm:block sm:col-span-2 text-center">{t.lastRace.headers.start}</div>
          <div className="hidden sm:block sm:col-span-1 text-center">{t.lastRace.headers.laps}</div>
          <div className="col-span-3 sm:col-span-2 text-right sm:text-center">{t.lastRace.headers.timeStatus}</div>
          <div className="col-span-3 sm:col-span-2 text-right">{t.lastRace.headers.points}</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-white/[0.04]">
          {raceDetail.results.map((d: JolpicaRaceResult, index: number) => {
            const isExpanded = expandedDriver === d.driverNumber;
            const prevDriver = index > 0 ? raceDetail.results[index - 1] : null;
            const showPointsCutoff = d.pos > 10 && (!prevDriver || prevDriver.pos <= 10);
            const isPointsZone = d.pos <= 10;

            return (
              <div key={d.driverNumber} className="flex flex-col">
                {/* Promiedos-Style Points Cutoff Barrier between P10 and P11 */}
                {showPointsCutoff && (
                  <div className="bg-[#152018] border-y border-emerald-500/30 px-3 py-1.5 flex items-center justify-between text-[10px] font-mono font-bold text-emerald-300 select-none shadow-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{t.lastRace.pointsCutoff}</span>
                    </div>
                    <span className="text-[9px] uppercase tracking-wider text-emerald-200 bg-emerald-900/50 border border-emerald-500/30 px-1.5 py-0.5 rounded font-bold">
                      P11 - P{raceDetail.results.length} {t.lastRace.noPoints}
                    </span>
                  </div>
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
                  <div className="col-span-5 sm:col-span-4 flex items-center gap-2 overflow-hidden">
                    <span
                      className="w-1 h-6 rounded-full flex-shrink-0"
                      style={{ backgroundColor: d.teamColor || '#71717A' }}
                    />
                    <div className="flex flex-col leading-tight truncate">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono text-sm font-bold text-white tracking-tight">
                          {d.code}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          #{d.driverNumber}
                        </span>
                        {d.isWinner && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 tracking-tight">
                            {t.lastRace.victory}
                          </span>
                        )}
                        {d.isFastestLap && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-black bg-purple-500/20 text-purple-300 border border-purple-500/40 tracking-tight">
                            {t.live.table.fastestLap}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-400 truncate hidden sm:block">
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
                        className={`px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold ${
                          d.isFastestLap && isPointsZone
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                            : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        +{d.points} PTS
                      </span>
                    ) : (
                      <span className="text-zinc-600 text-[10px] sm:text-[11px]">0 PTS</span>
                    )}

                    <div className="text-zinc-500">
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
