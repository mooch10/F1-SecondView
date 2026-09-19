import React from 'react';
import { FASTEST_PIT_STOPS_2026 } from '../../data/lastRaceAnalysisData';
import { useLanguage } from '../../hooks/useLanguage';
import { Trophy } from 'lucide-react';
import { getShortTeamName } from '../../utils/teamUtils';

export const PitStopLeaderboard: React.FC = () => {
  const { lang, t } = useLanguage();

  const getCompoundBadge = (comp: string) => {
    switch (comp) {
      case 'SOFT':
        return { letter: 'S', color: 'text-[#FF3B30] border-[#FF3B30] bg-[#FF3B30]/15' };
      case 'MEDIUM':
        return { letter: 'M', color: 'text-[#FFD60A] border-[#FFD60A] bg-[#FFD60A]/15' };
      case 'HARD':
        return { letter: 'H', color: 'text-white border-white bg-white/15' };
      default:
        return { letter: '?', color: 'text-zinc-400 border-zinc-500 bg-zinc-700/20' };
    }
  };

  const fastest = FASTEST_PIT_STOPS_2026[0];

  return (
    <div className="bg-zinc-50 dark:bg-[#10141E] border border-zinc-200 dark:border-white/10 rounded-2xl p-3 sm:p-5 flex flex-col gap-4 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-zinc-200 dark:border-white/[0.08] pb-3">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-amber-500 uppercase block">
            DHL FASTEST PIT STOP AWARD 2026
          </span>
          <h3 className="text-sm sm:text-base font-black text-zinc-900 dark:text-white">
            {t.lastRace.pitStopsTitle}
          </h3>
        </div>

        {fastest && (
          <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-xl px-3 py-1.5 font-mono text-xs text-purple-300">
            <Trophy className="w-4 h-4 text-purple-400 shrink-0" />
            <div>
              <span className="text-[10px] uppercase block font-sans text-purple-300/80">
                {lang === 'es' ? 'Parada Más Rápida' : 'Fastest Pit Stop'}:
              </span>
              <span className="font-black text-sm text-zinc-100">
                {getShortTeamName(fastest.teamName)} •{' '}
                <span className="text-purple-400 font-extrabold">{fastest.stationaryTimeSec.toFixed(2)}s</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-white/[0.08] text-[10px] uppercase text-zinc-500">
              <th className="py-2 px-2 text-center w-10">POS</th>
              <th className="py-2 px-3">{lang === 'es' ? 'PILOTO & ESCUDERÍA' : 'DRIVER & TEAM'}</th>
              <th className="py-2 px-2 text-center">{lang === 'es' ? 'VTA' : 'LAP'}</th>
              <th className="py-2 px-2 text-center">{lang === 'es' ? 'CAMBIO' : 'TYRES'}</th>
              <th className="py-2 px-3 text-right">{lang === 'es' ? 'TIEMPO EN BOX' : 'STATIONARY TIME'}</th>
              <th className="py-2 px-2 text-center w-12">{lang === 'es' ? 'PTS' : 'PTS'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/60 dark:divide-white/[0.04]">
            {FASTEST_PIT_STOPS_2026.map((record) => {
              const inComp = getCompoundBadge(record.tyresIn);
              const outComp = getCompoundBadge(record.tyresOut);
              const isWinner = record.rank === 1;

              return (
                <tr
                  key={record.rank}
                  className={`transition-colors ${
                    isWinner
                      ? 'bg-purple-500/[0.08] hover:bg-purple-500/[0.12]'
                      : 'hover:bg-zinc-100/60 dark:hover:bg-white/[0.03]'
                  }`}
                >
                  {/* Rank */}
                  <td className="py-2.5 px-2 text-center font-black">
                    {record.rank === 1 ? (
                      <span className="text-purple-400">1º</span>
                    ) : record.rank === 2 ? (
                      <span className="text-zinc-400">2º</span>
                    ) : record.rank === 3 ? (
                      <span className="text-amber-700 dark:text-amber-600">3º</span>
                    ) : (
                      <span className="text-zinc-500">{record.rank}º</span>
                    )}
                  </td>

                  {/* Driver & Team */}
                  <td className="py-2.5 px-3 min-w-[160px]">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-1.5 h-6 rounded-full shrink-0"
                        style={{ backgroundColor: record.teamColor }}
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-zinc-900 dark:text-white block truncate">
                          {record.driverName}{' '}
                          <span className="text-[10px] text-zinc-500 font-normal">#{record.driverNumber}</span>
                        </span>
                        <span className="text-[10px] text-zinc-500 block truncate font-sans">
                          {record.teamName}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Lap */}
                  <td className="py-2.5 px-2 text-center text-zinc-600 dark:text-zinc-400">
                    L{record.lap}
                  </td>

                  {/* Tyre Transition */}
                  <td className="py-2.5 px-2 text-center">
                    <div className="inline-flex items-center gap-1">
                      <span
                        className={`w-4 h-4 rounded-full border text-[9px] font-black flex items-center justify-center ${inComp.color}`}
                      >
                        {inComp.letter}
                      </span>
                      <span className="text-zinc-400 text-[10px]">➔</span>
                      <span
                        className={`w-4 h-4 rounded-full border text-[9px] font-black flex items-center justify-center ${outComp.color}`}
                      >
                        {outComp.letter}
                      </span>
                    </div>
                  </td>

                  {/* Stationary Time */}
                  <td className="py-2.5 px-3 text-right">
                    <span
                      className={`font-black text-sm font-tabular ${
                        isWinner
                          ? 'text-purple-400'
                          : record.stationaryTimeSec <= 2.25
                          ? 'text-emerald-500'
                          : 'text-zinc-800 dark:text-zinc-200'
                      }`}
                    >
                      {record.stationaryTimeSec.toFixed(2)}s
                    </span>
                  </td>

                  {/* Points */}
                  <td className="py-2.5 px-2 text-center">
                    <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-zinc-200 dark:bg-white/[0.08] text-zinc-700 dark:text-zinc-300">
                      +{record.points}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* DHL Fastest Pit Stop Trophy Clarification Footnote */}
      <div className="pt-2 border-t border-zinc-200/60 dark:border-white/[0.06] text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
        <span>
          {lang === 'es'
            ? '* Los puntos corresponden al Trofeo Oficial DHL Fastest Pit Stop de Escuderías (premio anual de paradas, independiente del Campeonato Mundial de F1).'
            : '* Points apply to the official DHL Fastest Pit Stop Award for constructors (annual trophy, independent of the F1 World Championship).'}
        </span>
      </div>
    </div>
  );
};
