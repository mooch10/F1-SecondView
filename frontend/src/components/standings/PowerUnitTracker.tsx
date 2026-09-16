import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Filter,
  Info,
  ShieldCheck,
  Zap,
  AlertCircle,
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import {
  PU_LIMITS_2026,
  PU_USAGE_DATA_2026,
  getPUStatsSummary,
  type DriverPUUsage,
  type PUStatus,
} from '../../data/puTrackerData';

interface PowerUnitTrackerProps {
  onSelectDriver?: (driverCode: string) => void;
}

export const PowerUnitTracker: React.FC<PowerUnitTrackerProps> = ({ onSelectDriver }) => {
  const { lang, t } = useLanguage();
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'AT_RISK' | 'PENALIZED'>('ALL');
  const [selectedBrand, setSelectedBrand] = useState<string>('ALL');
  const [showRegulations, setShowRegulations] = useState<boolean>(false);

  const stats = useMemo(() => getPUStatsSummary(), []);

  const brands = useMemo(() => {
    const list = Array.from(new Set(PU_USAGE_DATA_2026.map((d) => d.engineBrand)));
    return ['ALL', ...list];
  }, []);

  const filteredDrivers = useMemo(() => {
    return PU_USAGE_DATA_2026.filter((d) => {
      if (statusFilter === 'AT_RISK' && d.status === 'SAFE') return false;
      if (statusFilter === 'PENALIZED' && d.status !== 'PENALIZED') return false;
      if (selectedBrand !== 'ALL' && d.engineBrand !== selectedBrand) return false;
      return true;
    });
  }, [statusFilter, selectedBrand]);

  const renderComponentPill = (
    label: string,
    used: number,
    limit: number,
    fullName: string
  ) => {
    const isExceeded = used > limit;
    const isAtLimit = used === limit;

    let badgeClass =
      'bg-zinc-100 dark:bg-white/[0.04] text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-white/[0.08]';
    let countClass = 'text-zinc-900 dark:text-white font-bold';

    if (isExceeded) {
      badgeClass =
        'bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/40 shadow-xs animate-pulse';
      countClass = 'text-rose-600 dark:text-rose-300 font-black';
    } else if (isAtLimit) {
      badgeClass =
        'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30';
      countClass = 'text-amber-600 dark:text-amber-300 font-black';
    }

    return (
      <div
        className={`flex flex-col items-center justify-center p-1 sm:p-1.5 rounded-md sm:rounded-lg border text-center font-mono ${badgeClass}`}
        title={`${fullName}: ${used}/${limit} ${lang === 'es' ? 'usados' : 'used'}`}
      >
        <span className="text-[8px] sm:text-[10px] uppercase tracking-wider font-semibold opacity-80">
          {label}
        </span>
        <span className={`text-[11px] sm:text-xs ${countClass}`}>
          {used}
          <span className="text-[9px] sm:text-[10px] font-normal opacity-60">/{limit}</span>
        </span>
      </div>
    );
  };

  const renderStatusBadge = (status: PUStatus) => {
    if (status === 'PENALIZED') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/40">
          <AlertCircle className="w-3 h-3 shrink-0" />
          {t.puTracker.statusPenalized}
        </span>
      );
    }
    if (status === 'AT_RISK') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
          <AlertTriangle className="w-3 h-3 shrink-0" />
          {lang === 'es' ? 'En el Límite' : 'At Risk'}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
        <CheckCircle2 className="w-3 h-3 shrink-0" />
        {lang === 'es' ? 'Dentro del Límite' : 'Safe'}
      </span>
    );
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-white dark:bg-[#131722] border border-zinc-200 dark:border-white/[0.08] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                <Zap className="w-3 h-3" />
                {t.puTracker.badge2026}
              </span>
              <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                {lang === 'es' ? 'R14 España • R15 Azerbaiyán' : 'R14 Spain • R15 Azerbaijan'}
              </span>
            </div>
            <h2 className="text-base sm:text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
              {t.puTracker.title}
            </h2>
            <p className="text-[11px] sm:text-xs text-zinc-600 dark:text-zinc-400 mt-0.5 sm:mt-1 max-w-2xl font-sans">
              {t.puTracker.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowRegulations((prev) => !prev)}
            className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-white/[0.08] transition-colors cursor-pointer shrink-0"
          >
            <Info className="w-3.5 h-3.5 text-amber-500" />
            <span>{showRegulations ? (lang === 'es' ? 'Ocultar Reglas' : 'Hide Rules') : (lang === 'es' ? 'Ver Reglas FIA' : 'View FIA Rules')}</span>
          </button>
        </div>

        {/* 2026 PU Regulation Limit Cards */}
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-1.5 sm:gap-2 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-zinc-100 dark:border-white/[0.06]">
          <div className="p-1 sm:p-2 rounded-lg sm:rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200/80 dark:border-white/[0.05] text-center font-mono">
            <span className="text-[8px] sm:text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold uppercase block leading-tight">
              ICE (1.6L V6)
            </span>
            <span className="text-sm sm:text-base font-black text-zinc-900 dark:text-white leading-tight block my-0.5">
              {PU_LIMITS_2026.ice}
            </span>
            <span className="text-[8px] sm:text-[9px] text-zinc-400 block">{lang === 'es' ? 'máx temp.' : 'max season'}</span>
          </div>

          <div className="p-1 sm:p-2 rounded-lg sm:rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200/80 dark:border-white/[0.05] text-center font-mono">
            <span className="text-[8px] sm:text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold uppercase block leading-tight">
              TC (Turbo)
            </span>
            <span className="text-sm sm:text-base font-black text-zinc-900 dark:text-white leading-tight block my-0.5">
              {PU_LIMITS_2026.tc}
            </span>
            <span className="text-[8px] sm:text-[9px] text-zinc-400 block">{lang === 'es' ? 'máx temp.' : 'max season'}</span>
          </div>

          <div className="p-1 sm:p-2 rounded-lg sm:rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200/80 dark:border-white/[0.05] text-center font-mono">
            <span className="text-[8px] sm:text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold uppercase block leading-tight">
              MGU-K (350kW)
            </span>
            <span className="text-sm sm:text-base font-black text-zinc-900 dark:text-white leading-tight block my-0.5">
              {PU_LIMITS_2026.mguk}
            </span>
            <span className="text-[8px] sm:text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold block">50% Pot.</span>
          </div>

          <div className="p-1 sm:p-2 rounded-lg sm:rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200/80 dark:border-white/[0.05] text-center font-mono">
            <span className="text-[8px] sm:text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold uppercase block leading-tight">
              ES (Batería)
            </span>
            <span className="text-sm sm:text-base font-black text-zinc-900 dark:text-white leading-tight block my-0.5">
              {PU_LIMITS_2026.es}
            </span>
            <span className="text-[8px] sm:text-[9px] text-zinc-400 block">{lang === 'es' ? 'máx temp.' : 'max season'}</span>
          </div>

          <div className="p-1 sm:p-2 rounded-lg sm:rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200/80 dark:border-white/[0.05] text-center font-mono">
            <span className="text-[8px] sm:text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold uppercase block leading-tight">
              CE (Centralita)
            </span>
            <span className="text-sm sm:text-base font-black text-zinc-900 dark:text-white leading-tight block my-0.5">
              {PU_LIMITS_2026.ce}
            </span>
            <span className="text-[8px] sm:text-[9px] text-zinc-400 block">{lang === 'es' ? 'máx temp.' : 'max season'}</span>
          </div>

          <div className="p-1 sm:p-2 rounded-lg sm:rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200/80 dark:border-white/[0.05] text-center font-mono">
            <span className="text-[8px] sm:text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold uppercase block leading-tight">
              GBX (Caja)
            </span>
            <span className="text-sm sm:text-base font-black text-zinc-900 dark:text-white leading-tight block my-0.5">
              {PU_LIMITS_2026.gbx}
            </span>
            <span className="text-[8px] sm:text-[9px] text-zinc-400 block">{lang === 'es' ? 'máx temp.' : 'max season'}</span>
          </div>
        </div>

        {/* Collapsible Regulations Details */}
        {showRegulations && (
          <div className="mt-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-mono space-y-2 animate-fadeIn">
            <div className="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-400 uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>{t.puTracker.limitsTitle}</span>
            </div>
            <p className="text-zinc-700 dark:text-zinc-300 font-sans">
              {t.puTracker.limitsDesc}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-amber-500/20 text-[11px]">
              <div>• {t.puTracker.legend.ice}</div>
              <div>• {t.puTracker.legend.tc}</div>
              <div>• {t.puTracker.legend.mguk}</div>
              <div>• {t.puTracker.legend.es}</div>
              <div>• {t.puTracker.legend.ce}</div>
              <div>• {t.puTracker.legend.gbx}</div>
            </div>
            <div className="text-[11px] font-bold text-purple-700 dark:text-purple-400 pt-1">
              ✨ {t.puTracker.legend.noMguh}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2.5 p-2 sm:p-3 rounded-xl bg-white dark:bg-[#131722] border border-zinc-200 dark:border-white/[0.08] shadow-xs">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            type="button"
            onClick={() => setStatusFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border ${
              statusFilter === 'ALL'
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-black keep-white border-transparent shadow-xs'
                : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-white/[0.06]'
            }`}
          >
            {t.puTracker.filterAll} ({stats.totalDrivers})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('AT_RISK')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border flex items-center gap-1 ${
              statusFilter === 'AT_RISK'
                ? 'bg-amber-500 text-black border-amber-400 shadow-xs'
                : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-white/[0.06]'
            }`}
          >
            <AlertTriangle className="w-3 h-3 text-amber-500" />
            <span>{t.puTracker.filterAtRisk} ({stats.atRiskCount + stats.penalizedCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('PENALIZED')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border flex items-center gap-1 ${
              statusFilter === 'PENALIZED'
                ? 'bg-rose-500 text-white keep-white border-rose-400 shadow-xs'
                : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-white/[0.06]'
            }`}
          >
            <AlertCircle className="w-3 h-3 text-rose-500" />
            <span>{t.puTracker.filterPenalized} ({stats.penalizedCount})</span>
          </button>
        </div>

        {/* Engine Supplier Filter */}
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <Filter className="w-3.5 h-3.5 text-zinc-400" />
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="bg-zinc-50 dark:bg-white/[0.06] border border-zinc-200 dark:border-white/[0.1] rounded-lg px-2.5 py-1 text-zinc-800 dark:text-zinc-200 font-mono text-xs focus:outline-hidden cursor-pointer"
            aria-label="Filter by engine manufacturer"
          >
            <option value="ALL">{t.puTracker.allEngines}</option>
            {brands.filter((b) => b !== 'ALL').map((b) => (
              <option key={b} value={b}>
                Motor {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid Table for Desktop & Cards for Mobile */}
      <div className="bg-white dark:bg-[#131722] border border-zinc-200 dark:border-white/[0.08] rounded-2xl overflow-hidden shadow-sm">
        {/* Desktop Header */}
        <div className="hidden lg:grid grid-cols-12 gap-2 px-4 py-3 bg-zinc-50 dark:bg-[#1C2230] border-b border-zinc-200 dark:border-white/[0.08] text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 select-none">
          <div className="col-span-3">{t.puTracker.headers.driver}</div>
          <div className="col-span-2">{t.puTracker.headers.teamEngine}</div>
          <div className="col-span-2 text-center">{t.puTracker.headers.status}</div>
          <div className="col-span-3 text-center">{t.puTracker.headers.components}</div>
          <div className="col-span-2 text-right">{t.puTracker.headers.penalties}</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-zinc-200 dark:divide-white/[0.06]">
          {filteredDrivers.map((d: DriverPUUsage) => {
            const hasPenaltyRisk = d.status !== 'SAFE';

            return (
              <div
                key={d.driverNumber}
                className="p-2.5 sm:p-4 hover:bg-zinc-50/80 dark:hover:bg-white/[0.02] transition-colors"
              >
                {/* Desktop View */}
                <div className="hidden lg:grid grid-cols-12 gap-2 items-center font-mono">
                  {/* Driver Name & Code */}
                  <div className="col-span-3 flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-1.5 h-7 rounded-full shrink-0"
                      style={{ backgroundColor: d.teamColor }}
                    />
                    <span className="text-xs text-zinc-400 font-bold w-5 shrink-0">
                      {d.driverNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectDriver?.(d.code)}
                      className="text-xs px-1.5 py-0.5 rounded bg-zinc-100 hover:bg-amber-400 dark:bg-white/10 dark:hover:bg-amber-400 text-zinc-800 dark:text-white hover:text-black font-black transition-colors cursor-pointer shrink-0"
                      title={lang === 'es' ? 'Ver ficha del piloto' : 'View driver profile'}
                    >
                      {d.code}
                    </button>
                    <span className="text-xs font-bold text-zinc-900 dark:text-white truncate font-sans">
                      {d.fullName}
                    </span>
                  </div>

                  {/* Engine Supplier */}
                  <div className="col-span-2 text-xs truncate">
                    <span className="text-zinc-700 dark:text-zinc-300 font-medium font-sans block truncate">
                      {d.teamName}
                    </span>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block font-mono">
                      {d.engineBrand}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="col-span-2 flex justify-center">
                    {renderStatusBadge(d.status)}
                  </div>

                  {/* 6 Components Grid */}
                  <div className="col-span-3 grid grid-cols-6 gap-1">
                    {renderComponentPill('ICE', d.components.ice, PU_LIMITS_2026.ice, 'ICE')}
                    {renderComponentPill('TC', d.components.tc, PU_LIMITS_2026.tc, 'Turbo')}
                    {renderComponentPill('MGU-K', d.components.mguk, PU_LIMITS_2026.mguk, 'MGU-K')}
                    {renderComponentPill('ES', d.components.es, PU_LIMITS_2026.es, 'Batería')}
                    {renderComponentPill('CE', d.components.ce, PU_LIMITS_2026.ce, 'Centralita')}
                    {renderComponentPill('GBX', d.components.gbx, PU_LIMITS_2026.gbx, 'Caja')}
                  </div>

                  {/* Penalty Alert / Notes */}
                  <div className="col-span-2 text-right">
                    {hasPenaltyRisk ? (
                      <span className="text-[11px] font-sans font-semibold text-amber-600 dark:text-amber-400 block leading-tight">
                        {lang === 'es' ? d.notesEs : d.notes}
                      </span>
                    ) : (
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
                        {t.puTracker.safeNotice}
                      </span>
                    )}
                  </div>
                </div>

                {/* Mobile Card Layout */}
                <div className="lg:hidden flex flex-col gap-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-1.5 h-6 rounded-full shrink-0"
                        style={{ backgroundColor: d.teamColor }}
                      />
                      <span className="text-xs font-mono text-zinc-400 font-bold">
                        #{d.driverNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() => onSelectDriver?.(d.code)}
                        className="text-xs font-mono px-1.5 py-0.5 rounded bg-zinc-100 hover:bg-amber-400 dark:bg-white/10 dark:hover:bg-amber-400 text-zinc-800 dark:text-white hover:text-black font-black transition-colors cursor-pointer shrink-0"
                      >
                        {d.code}
                      </button>
                      <span className="text-xs font-bold text-zinc-900 dark:text-white truncate font-sans">
                        {d.fullName}
                      </span>
                    </div>

                    <div className="shrink-0">{renderStatusBadge(d.status)}</div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                    <span className="truncate font-sans">{d.teamName}</span>
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                      {d.engineSupplier}
                    </span>
                  </div>

                  {/* 6 Components mini grid */}
                  <div className="grid grid-cols-6 gap-1">
                    {renderComponentPill('ICE', d.components.ice, PU_LIMITS_2026.ice, 'ICE')}
                    {renderComponentPill('TC', d.components.tc, PU_LIMITS_2026.tc, 'Turbo')}
                    {renderComponentPill('MGU-K', d.components.mguk, PU_LIMITS_2026.mguk, 'MGU-K')}
                    {renderComponentPill('ES', d.components.es, PU_LIMITS_2026.es, 'Batería')}
                    {renderComponentPill('CE', d.components.ce, PU_LIMITS_2026.ce, 'Centralita')}
                    {renderComponentPill('GBX', d.components.gbx, PU_LIMITS_2026.gbx, 'Caja')}
                  </div>

                  {hasPenaltyRisk && (
                    <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] font-sans font-medium text-amber-700 dark:text-amber-300 leading-snug">
                      ⚠️ {lang === 'es' ? d.notesEs : d.notes}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
