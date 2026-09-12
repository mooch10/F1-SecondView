import React, { useState } from 'react';
import { ArrowRight, ChevronDown, ChevronUp, UserCheck } from 'lucide-react';
import type { DriverChangeAlert, SeriesCategory } from '../../types/f1';
import { useLanguage } from '../../hooks/useLanguage';
import { useSeries } from '../../hooks/useSeries';

interface DriverChangesAlertProps {
  changes: DriverChangeAlert[];
  series: SeriesCategory;
}

export const DriverChangesAlert: React.FC<DriverChangesAlertProps> = ({
  changes,
  series,
}) => {
  const { lang } = useLanguage();
  const { theme } = useSeries();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  if (!changes || changes.length === 0) return null;

  return (
    <div className="bg-[#131722] border border-white/[0.08] rounded-xl overflow-hidden shadow-sm">
      {/* Accordion Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer select-none text-left"
      >
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded-md flex items-center justify-center text-white"
            style={{ backgroundColor: theme.primary }}
          >
            <UserCheck className="w-3.5 h-3.5" />
          </div>
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-200">
            {lang === 'es' ? 'Avisos de Cambios de Pilotos' : 'Driver Lineup Changes'}
          </span>
          <span
            className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full"
            style={{
              backgroundColor: `${theme.primary}20`,
              color: theme.primary,
              border: `1px solid ${theme.primary}40`,
            }}
          >
            {series.toUpperCase()} • {changes.length}
          </span>
        </div>

        <div className="text-zinc-400">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </button>

      {/* Expanded Alert List */}
      {isExpanded && (
        <div className="divide-y divide-white/[0.06] px-3.5 py-1">
          {changes.map((change) => (
            <div
              key={change.id}
              className="py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs font-mono"
            >
              <div className="flex items-center gap-2 flex-wrap">
                {/* Team Tag */}
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-bold text-white border"
                  style={{
                    backgroundColor: `${change.teamColor}25`,
                    borderColor: `${change.teamColor}60`,
                  }}
                >
                  {change.team} #{change.carNumber}
                </span>

                {/* Driver swap flow */}
                <div className="flex items-center gap-1.5 text-zinc-300 font-semibold">
                  <span className="line-through text-zinc-500">{change.originalDriver}</span>
                  <ArrowRight className="w-3 h-3 text-zinc-400" />
                  <span className="text-white font-bold" style={{ color: theme.primary }}>
                    {change.newDriver}
                  </span>
                </div>
              </div>

              {/* Round and Reason */}
              <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                <span className="text-zinc-500">•</span>
                <span className="text-zinc-300 font-medium">
                  {lang === 'es' ? `Desde ${change.roundName}` : `From ${change.roundName}`}
                </span>
                {change.reason && (
                  <span className="text-zinc-400 hidden md:inline truncate max-w-xs">
                    ({change.reason})
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
