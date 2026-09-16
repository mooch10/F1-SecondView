import React from 'react';
import { LAST_RACE_TYRE_STRATEGIES } from '../../data/lastRaceAnalysisData';
import { useLanguage } from '../../hooks/useLanguage';

export const TyreStrategyGrid: React.FC = () => {
  const { lang, t } = useLanguage();

  const getCompoundStyle = (comp: string) => {
    switch (comp) {
      case 'SOFT':
        return { bg: 'bg-[#FF3B30]', border: 'border-[#FF3B30]', text: 'text-white', label: 'Soft' };
      case 'MEDIUM':
        return { bg: 'bg-[#FFD60A]', border: 'border-[#FFD60A]', text: 'text-black', label: 'Medium' };
      case 'HARD':
        return { bg: 'bg-white', border: 'border-white', text: 'text-black', label: 'Hard' };
      default:
        return { bg: 'bg-zinc-500', border: 'border-zinc-500', text: 'text-white', label: 'Unknown' };
    }
  };

  const totalLaps = 57;

  return (
    <div className="bg-zinc-50 dark:bg-[#10141E] border border-zinc-200 dark:border-white/10 rounded-2xl p-3 sm:p-5 flex flex-col gap-4 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-zinc-200 dark:border-white/[0.08] pb-3">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-red-600 dark:text-red-400 uppercase block">
            PIRELLI TYRE MATRIX 2026
          </span>
          <h3 className="text-sm sm:text-base font-black text-zinc-900 dark:text-white">
            {t.lastRace.stintsTitle}
          </h3>
        </div>

        {/* Compound Legend */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#FF3B30]" />
            <span className="text-zinc-600 dark:text-zinc-300">Soft (C4)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#FFD60A]" />
            <span className="text-zinc-600 dark:text-zinc-300">Medium (C3)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-white border border-zinc-400" />
            <span className="text-zinc-600 dark:text-zinc-300">Hard (C2)</span>
          </div>
        </div>
      </div>

      {/* Grid of All 20 Drivers */}
      <div className="space-y-2">
        {LAST_RACE_TYRE_STRATEGIES.map((strat) => (
          <div
            key={strat.driverNumber}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 p-2 rounded-xl bg-white dark:bg-[#131722] border border-zinc-200 dark:border-white/[0.06] text-xs font-mono"
          >
            {/* Driver Identity */}
            <div className="flex items-center gap-2 sm:w-44 shrink-0 min-w-0">
              <span className="font-bold text-zinc-400 w-6 text-right">P{strat.finishPos}</span>
              <span
                className="w-1 h-5 rounded-full shrink-0"
                style={{ backgroundColor: strat.teamColor }}
              />
              <div className="min-w-0 flex-1">
                <span className="font-bold text-zinc-900 dark:text-white block truncate">
                  {strat.fullName}
                </span>
                <span className="text-[10px] text-zinc-500 block truncate font-sans">
                  {strat.pitStopsCount} {strat.pitStopsCount === 1 ? (lang === 'es' ? 'parada' : 'stop') : (lang === 'es' ? 'paradas' : 'stops')}
                </span>
              </div>
            </div>

            {/* Horizontal Timeline Bar */}
            <div className="flex-1 flex items-center h-6 bg-zinc-100 dark:bg-black/40 border border-zinc-200 dark:border-white/[0.06] rounded-lg p-0.5 gap-1 overflow-hidden">
              {strat.stints.map((stint, sIdx) => {
                const cfg = getCompoundStyle(stint.compound);
                const flexShare = Math.max(stint.lapsCount / totalLaps, 0.1);
                return (
                  <div
                    key={sIdx}
                    style={{ flex: flexShare }}
                    className={`h-full rounded-md flex items-center justify-center px-1 ${cfg.bg} ${cfg.text} font-bold text-[10px] shadow-xs truncate`}
                    title={`Stint ${stint.stintNumber}: ${cfg.label} (${stint.lapsCount} ${lang === 'es' ? 'vueltas' : 'laps'})`}
                  >
                    <span>
                      {cfg.label[0]} • {stint.lapsCount}{lang === 'es' ? 'v' : 'l'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
