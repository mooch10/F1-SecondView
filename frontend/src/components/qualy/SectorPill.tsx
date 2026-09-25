import React from 'react';
import type { SectorStatus } from '../../types/f1';
import { useLanguage } from '../../hooks/useLanguage';

interface SectorPillProps {
  sectorNumber: 1 | 2 | 3;
  time?: number | null;
  status?: SectorStatus;
  compact?: boolean;
  showLabel?: boolean;
}

export const SectorPill: React.FC<SectorPillProps> = ({
  sectorNumber,
  time,
  status = 'none',
  compact = false,
  showLabel = true,
}) => {
  const { t } = useLanguage();
  const formatSectorTime = (sec?: number | null) => {
    if (typeof sec !== 'number' || Number.isNaN(sec) || sec <= 0) return '- - -';
    return sec.toFixed(3);
  };

  const getStatusStyles = (st: SectorStatus) => {
    switch (st) {
      case 'purple':
        return {
          container: 'bg-purple-500/25 border-purple-400/60 text-purple-100 shadow-[0_0_10px_rgba(168,85,247,0.45)] ring-1 ring-purple-400/30',
          dot: 'bg-[#D8B4FE] shadow-[0_0_8px_rgba(216,180,254,1)] animate-pulse',
          label: 'text-purple-200 font-black',
        };
      case 'green':
        return {
          container: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200 shadow-[0_0_8px_rgba(16,185,129,0.3)]',
          dot: 'bg-[#10B981] shadow-[0_0_6px_rgba(16,185,129,0.8)]',
          label: 'text-emerald-300',
        };
      case 'yellow':
        return {
          container: 'bg-amber-500/15 border-amber-500/40 text-amber-200',
          dot: 'bg-[#F59E0B]',
          label: 'text-amber-400',
        };
      default:
        return {
          container: 'bg-white/[0.03] border-white/[0.08] text-zinc-400',
          dot: 'bg-zinc-600',
          label: 'text-zinc-500',
        };
    }
  };

  const styles = getStatusStyles(status);

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-0.5 sm:gap-1 font-mono text-[9px] sm:text-[11px] font-bold px-1 sm:px-2 py-0.5 rounded border transition-colors shrink-0 ${styles.container}`}
        title={`Sector ${sectorNumber}: ${time ? `${time.toFixed(3)}s` : 'Sin tiempo'} (${status})`}
      >
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${styles.dot}`} />
        {showLabel && (
          <span className={`hidden xs:inline sm:inline text-[8.5px] sm:text-[10px] font-extrabold ${styles.label}`}>
            S{sectorNumber}
          </span>
        )}
        <span className="inline font-tabular text-[8.5px] sm:text-[11px]">{formatSectorTime(time)}</span>
      </span>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${styles.container}`}
    >
      <div className="flex items-center gap-1.5 mb-0.5">
        <span className={`w-2 h-2 rounded-full ${styles.dot}`} />
        <span className={`text-[10px] uppercase font-bold tracking-wider font-mono ${styles.label}`}>
          Sector {sectorNumber}
        </span>
      </div>
      <span className="font-mono text-xs font-black font-tabular">
        {time ? `${time.toFixed(3)}s` : '--.---'}
      </span>
      <span className="text-[8px] font-mono uppercase tracking-tight mt-0.5 opacity-80">
        {status === 'purple'
          ? t.live.miniSectors.sessionRecordShort
          : status === 'green'
          ? t.live.miniSectors.personalImprovement
          : status === 'yellow'
          ? t.live.miniSectors.noImprovementShort
          : '-'}
      </span>
    </div>
  );
};
