import React, { useState } from 'react';
import { ArrowRight, ChevronDown, ChevronUp, Layers, UserCheck } from 'lucide-react';
import type { DriverChangeAlert, SeriesCategory } from '../../types/f1';
import { useLanguage } from '../../hooks/useLanguage';
import { useSeries } from '../../hooks/useSeries';

interface DriverChangesAlertProps {
  changes: DriverChangeAlert[];
  series: SeriesCategory;
  onSelectDriver?: (driverName: string) => void;
}

const DRIVER_CHANGE_REASONS_EN: Record<string, string> = {
  'f2-2026-fornaroli-camara':
    'Fornaroli promoted to McLaren F1 reserve; Câmara (F3 Champion) debuts at Invicta.',
  'f2-2026-durksen-invicta':
    'Dürksen joins from AIX Racing to fight for victories; Staněk moves to Super Formula.',
  'f2-2026-herta-hitech':
    'Multiple IndyCar winner and Cadillac F1 test driver joins F2 full-time.',
  'f2-2026-tsolov-campos':
    'Bulgarian Red Bull Junior Team talent promoted from F3 and leads the drivers championship.',
  'f2-2026-beganovic-dams':
    'Beganovic (Ferrari Driver Academy) moves from PREMA to lead the DAMS lineup.',
  'f2-2026-lindblad-f1':
    'Official graduation to Formula 1 as full-time driver for Racing Bulls in 2026.',
  'f3-2026-slater-trident':
    'Reigning FRECA champion debuts with Trident and leads the 2026 drivers championship.',
  'f3-2026-ugochukwu-campos':
    'American McLaren Driver Development prodigy signs with Campos.',
  'f3-2026-nael-campos':
    'Macau GP winner joins Campos and takes multiple wins this season.',
  'f3-2026-rivera-campos':
    'Mexican Red Bull Junior Team talent steps up from Eurocup-3.',
  'f3-2026-colnaghi-mp':
    'Italo-Argentine Spanish F4 champion debuts in F3 with MP Motorsport.',
};

export const DriverChangesAlert: React.FC<DriverChangesAlertProps> = ({
  changes,
  series,
  onSelectDriver,
}) => {
  const { lang, t } = useLanguage();
  const { theme } = useSeries();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [showDetailedBreakdown, setShowDetailedBreakdown] = useState<boolean>(false);

  if (!changes || changes.length === 0) return null;

  const getReason = (change: DriverChangeAlert) => {
    if (lang === 'en') {
      return DRIVER_CHANGE_REASONS_EN[change.id] || change.reason || '';
    }
    return change.reason || '';
  };

  return (
    <div className="bg-[#131722] border border-white/[0.08] rounded-xl overflow-hidden shadow-sm">
      {/* Accordion Header */}
      <div className="w-full flex items-center justify-between px-3.5 py-2.5 bg-zinc-50 dark:bg-white/[0.02] border-b border-zinc-200 dark:border-white/[0.04]">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 sm:gap-2 hover:opacity-90 transition-opacity cursor-pointer select-none text-left min-w-0"
        >
          <div
            className="w-5 h-5 rounded-md flex items-center justify-center text-white shrink-0 keep-white"
            style={{ backgroundColor: theme.primary }}
          >
            <UserCheck className="w-3.5 h-3.5" />
          </div>
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 whitespace-nowrap">
            <span className="sm:hidden">{lang === 'es' ? 'CAMBIOS PILOTOS' : 'DRIVER CHANGES'}</span>
            <span className="hidden sm:inline">{t.driverChanges.title}</span>
          </span>
          <span
            className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap shrink-0"
            style={{
              backgroundColor: `${theme.primary}20`,
              color: theme.primary,
              border: `1px solid ${theme.primary}40`,
            }}
          >
            {series.toUpperCase()} • {changes.length}
          </span>
        </button>

        <div className="flex items-center gap-2">
          {isExpanded && (
            <button
              type="button"
              onClick={() => setShowDetailedBreakdown(!showDetailedBreakdown)}
              className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-white/[0.06] hover:bg-zinc-200 dark:hover:bg-white/[0.12] text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1 border border-zinc-200 dark:border-white/[0.08]"
              title={
                showDetailedBreakdown
                  ? t.driverChanges.hideBreakdown
                  : t.driverChanges.breakdown
              }
            >
              <Layers className="w-3 h-3 text-zinc-500 dark:text-zinc-400" />
              <span className="hidden sm:inline">
                {showDetailedBreakdown
                  ? t.driverChanges.hideBreakdown
                  : t.driverChanges.breakdown}
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white p-1 transition-colors cursor-pointer"
            aria-label={isExpanded ? 'Colapsar avisos' : 'Expandir avisos'}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Alert List */}
      {isExpanded && (
        <div className="p-3">
          {showDetailedBreakdown ? (
            /* Rich Detailed Breakdown View */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {changes.map((change) => {
                const reason = getReason(change);
                return (
                  <div
                    key={`detail-${change.id}`}
                    className="bg-[#0B0E14] border border-white/[0.08] rounded-lg p-3 flex flex-col justify-between gap-2 shadow-xs"
                    style={{ borderLeft: `3px solid ${change.teamColor || theme.primary}` }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-bold text-white border"
                        style={{
                          backgroundColor: `${change.teamColor}25`,
                          borderColor: `${change.teamColor}60`,
                        }}
                      >
                        {change.team} #{change.carNumber}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
                        {t.driverChanges.fromRound} {change.roundName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-xs my-0.5">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-zinc-500 uppercase">{t.driverChanges.originalDriver}</span>
                        <span className="line-through text-zinc-400 font-semibold">{change.originalDriver}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-500 shrink-0 mx-1" />
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase" style={{ color: theme.primary }}>{t.driverChanges.newDriver}</span>
                        {onSelectDriver ? (
                          <button
                            type="button"
                            onClick={() => onSelectDriver(change.newDriver)}
                            className="text-white font-black hover:text-[#FFD60A] hover:underline cursor-pointer text-left"
                            title={lang === 'es' ? 'Ver ficha del piloto' : 'View driver profile'}
                          >
                            {change.newDriver}
                          </button>
                        ) : (
                          <span className="text-white font-black">{change.newDriver}</span>
                        )}
                      </div>
                    </div>

                    {reason && (
                      <p className="text-[11px] font-mono text-zinc-300 leading-relaxed bg-white/[0.02] p-2 rounded border border-white/[0.04]">
                        {reason}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* Standard Clean Row View with FULL Parentheses Text (No Truncate) */
            <div className="divide-y divide-zinc-200 dark:divide-white/[0.06]">
              {changes.map((change) => {
                const reason = getReason(change);
                return (
                  <div
                    key={change.id}
                    className="py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs font-mono"
                  >
                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                      {/* Team Tag */}
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-bold text-white border shrink-0"
                        style={{
                          backgroundColor: `${change.teamColor}25`,
                          borderColor: `${change.teamColor}60`,
                        }}
                      >
                        {change.team} #{change.carNumber}
                      </span>

                      {/* Driver swap flow */}
                      <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 font-semibold shrink-0">
                        <span className="line-through text-zinc-500">{change.originalDriver}</span>
                        <ArrowRight className="w-3 h-3 text-zinc-400" />
                        {onSelectDriver ? (
                          <button
                            type="button"
                            onClick={() => onSelectDriver(change.newDriver)}
                            className="font-bold hover:text-amber-500 dark:hover:text-[#FFD60A] hover:underline cursor-pointer text-left"
                            style={{ color: theme.primary }}
                            title={lang === 'es' ? 'Ver ficha del piloto' : 'View driver profile'}
                          >
                            {change.newDriver}
                          </button>
                        ) : (
                          <span className="font-bold" style={{ color: theme.primary }}>
                            {change.newDriver}
                          </span>
                        )}
                      </div>

                      {/* Explanation Reason - Fully visible, wraps cleanly without truncation */}
                      {reason && (
                        <span className="text-zinc-600 dark:text-zinc-400 text-[11px] leading-snug break-words">
                          ({reason})
                        </span>
                      )}
                    </div>

                    {/* Round Badge */}
                    <div className="shrink-0 flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400 self-start md:self-auto">
                      <span className="text-zinc-700 dark:text-zinc-300 font-medium px-2 py-0.5 rounded bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.06] whitespace-nowrap">
                        {t.driverChanges.fromRound} {change.roundName}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
