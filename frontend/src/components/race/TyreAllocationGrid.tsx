import React, { useState, useMemo } from 'react';
import {
  Clock,
  Disc,
  Sparkles,
  CheckCircle2,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import {
  TYRE_ALLOCATION_DATA_2026,
  type DriverTyreSets,
} from '../../data/tyreAllocationData';

export const TyreAllocationGrid: React.FC = () => {
  const { lang, t } = useLanguage();
  const [filterMode, setFilterMode] = useState<'ALL' | 'TOP10'>('ALL');
  const [selectedCompound, setSelectedCompound] = useState<'ALL' | 'HARD' | 'MEDIUM' | 'SOFT'>('ALL');

  const driversToDisplay = useMemo(() => {
    let list = [...TYRE_ALLOCATION_DATA_2026];
    if (filterMode === 'TOP10') {
      list = list.slice(0, 10);
    }
    return list;
  }, [filterMode]);

  const renderTyreBadge = (
    label: string,
    colorHex: string,
    newCount: number,
    usedCount: number,
    compoundCode: string
  ) => {
    const isHighlighted =
      selectedCompound === 'ALL' ||
      (selectedCompound === 'HARD' && label === 'C2') ||
      (selectedCompound === 'MEDIUM' && label === 'C3') ||
      (selectedCompound === 'SOFT' && label === 'C4');

    return (
      <div
        className={`p-2 rounded-xl border transition-all flex flex-col items-center justify-center font-mono ${
          isHighlighted
            ? 'bg-zinc-50 dark:bg-white/[0.03] border-zinc-200 dark:border-white/[0.08]'
            : 'opacity-40 bg-transparent border-transparent'
        }`}
      >
        <div className="flex items-center gap-1.5 mb-1.5">
          <span
            className="w-3.5 h-3.5 rounded-full inline-block shrink-0 shadow-xs border border-black/20"
            style={{ backgroundColor: colorHex }}
          />
          <span className="text-[11px] font-bold text-zinc-900 dark:text-white uppercase">
            {compoundCode}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {/* New Sets */}
          <div
            className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white dark:bg-white/10 border border-zinc-200 dark:border-white/15 shadow-xs"
            title={`${newCount} ${lang === 'es' ? 'sets nuevos' : 'new sets'}`}
          >
            <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
              {lang === 'es' ? 'N' : 'NEW'}
            </span>
            <span className="font-black text-zinc-900 dark:text-white">{newCount}</span>
          </div>

          {/* Used Sets */}
          <div
            className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-white/[0.04] text-zinc-500 dark:text-zinc-400"
            title={`${usedCount} ${lang === 'es' ? 'sets usados' : 'used sets'}`}
          >
            <span className="text-[9px] font-bold opacity-75 uppercase">
              {lang === 'es' ? 'U' : 'USD'}
            </span>
            <span className="font-bold">{usedCount}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#131722] border border-zinc-200 dark:border-white/[0.08] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                <Disc className="w-3 h-3" />
                {t.tyreAllocation.badge}
              </span>
              <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                13 {lang === 'es' ? 'Sets de Seco por Piloto' : 'Dry Sets per Driver'}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
              {t.tyreAllocation.title}
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl font-sans">
              {t.tyreAllocation.subtitle}
            </p>
          </div>

          {/* Compound Quick Legend */}
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.06] text-xs font-mono">
            <div className="flex items-center gap-1 px-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-white border border-black/30" />
              <span className="text-zinc-700 dark:text-zinc-300 font-bold">C2 Duro</span>
            </div>
            <div className="flex items-center gap-1 px-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-black/20" />
              <span className="text-zinc-700 dark:text-zinc-300 font-bold">C3 Medio</span>
            </div>
            <div className="flex items-center gap-1 px-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-black/20" />
              <span className="text-zinc-700 dark:text-zinc-300 font-bold">C4 Blando</span>
            </div>
          </div>
        </div>

        {/* Strategy Intel Callout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-zinc-100 dark:border-white/[0.06] font-mono text-xs">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
            <div>
              <span className="font-bold uppercase tracking-wider block text-[10px]">
                {t.tyreAllocation.optimalStrategy}
              </span>
              <span className="text-xs font-bold font-sans">
                {lang === 'es' ? '1 Parada: Medio (Vta 18-24) -> Duro (a meta)' : '1 Stop: Medium (L18-24) -> Hard (to end)'}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-800 dark:text-blue-300 flex items-start gap-2.5">
            <Clock className="w-4 h-4 shrink-0 mt-0.5 text-blue-500" />
            <div>
              <span className="font-bold uppercase tracking-wider block text-[10px]">
                {t.tyreAllocation.pitLoss}
              </span>
              <span className="text-xs font-bold font-sans">
                21.8s {lang === 'es' ? '(Madrid Madring verde)' : '(Madrid Madring green)'}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
            <div>
              <span className="font-bold uppercase tracking-wider block text-[10px]">
                {lang === 'es' ? 'Reglamento FIA' : 'FIA Regulation'}
              </span>
              <span className="text-xs font-bold font-sans">
                {t.tyreAllocation.strategyTip}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-white dark:bg-[#131722] border border-zinc-200 dark:border-white/[0.08] shadow-xs">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setFilterMode('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border ${
              filterMode === 'ALL'
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-black keep-white border-transparent shadow-xs'
                : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-white/[0.06]'
            }`}
          >
            {t.tyreAllocation.filterAll} ({TYRE_ALLOCATION_DATA_2026.length})
          </button>

          <button
            type="button"
            onClick={() => setFilterMode('TOP10')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border ${
              filterMode === 'TOP10'
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-black keep-white border-transparent shadow-xs'
                : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-white/[0.06]'
            }`}
          >
            {t.tyreAllocation.filterTop10} (10)
          </button>
        </div>

        {/* Compound Filter Buttons */}
        <div className="flex items-center gap-1 text-xs font-mono">
          <button
            type="button"
            onClick={() => setSelectedCompound('ALL')}
            className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
              selectedCompound === 'ALL'
                ? 'bg-zinc-200 dark:bg-white/20 text-zinc-900 dark:text-white'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            {lang === 'es' ? 'Todos' : 'All'}
          </button>
          <button
            type="button"
            onClick={() => setSelectedCompound('HARD')}
            className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
              selectedCompound === 'HARD'
                ? 'bg-white text-black shadow-xs font-black'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            C2 Duro
          </button>
          <button
            type="button"
            onClick={() => setSelectedCompound('MEDIUM')}
            className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
              selectedCompound === 'MEDIUM'
                ? 'bg-amber-400 text-black shadow-xs font-black'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            C3 Medio
          </button>
          <button
            type="button"
            onClick={() => setSelectedCompound('SOFT')}
            className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
              selectedCompound === 'SOFT'
                ? 'bg-rose-500 text-white keep-white shadow-xs font-black'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            C4 Blando
          </button>
        </div>
      </div>

      {/* Grid of Drivers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {driversToDisplay.map((d: DriverTyreSets) => {
          const totalRemaining =
            d.hard.newSets +
            d.hard.usedSets +
            d.medium.newSets +
            d.medium.usedSets +
            d.soft.newSets +
            d.soft.usedSets;

          const newTotal = d.hard.newSets + d.medium.newSets + d.soft.newSets;

          return (
            <div
              key={d.driverNumber}
              className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#131722] border border-zinc-200 dark:border-white/[0.08] shadow-sm hover:border-zinc-300 dark:hover:border-white/20 transition-all flex flex-col justify-between gap-3"
            >
              {/* Driver Top Row */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-2 h-8 rounded-full shrink-0"
                    style={{ backgroundColor: d.teamColor }}
                  />
                  <div className="flex flex-col leading-tight min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono font-bold text-zinc-400">
                        #{d.driverNumber}
                      </span>
                      <span className="text-xs font-mono font-black px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-white/10 text-zinc-800 dark:text-white">
                        {d.code}
                      </span>
                      <span className="text-sm font-bold text-zinc-900 dark:text-white truncate font-sans">
                        {d.fullName}
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5 font-sans">
                      {d.teamName}
                    </span>
                  </div>
                </div>

                {/* Total Remaining Pill */}
                <div className="text-right shrink-0 font-mono">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-white/[0.05] border border-zinc-200 dark:border-white/[0.08] text-[11px] font-bold text-zinc-800 dark:text-zinc-200">
                    <Layers className="w-3 h-3 text-zinc-400" />
                    <span>{totalRemaining} sets</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-0.5">
                    {newTotal} {lang === 'es' ? 'nuevos' : 'new'}
                  </span>
                </div>
              </div>

              {/* 3 Compound Sets Matrix */}
              <div className="grid grid-cols-3 gap-2">
                {renderTyreBadge('C2', '#FFFFFF', d.hard.newSets, d.hard.usedSets, 'C2 DURO')}
                {renderTyreBadge('C3', '#FFD60A', d.medium.newSets, d.medium.usedSets, 'C3 MEDIO')}
                {renderTyreBadge('C4', '#FF3B30', d.soft.newSets, d.soft.usedSets, 'C4 BLANDO')}
              </div>

              {/* Recommended Strategy Note */}
              <div className="p-2 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-100 dark:border-white/[0.05] flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300 truncate">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="truncate font-sans font-medium text-[11px]">
                    {lang === 'es' ? d.recommendedStrategyEs : d.recommendedStrategy}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
