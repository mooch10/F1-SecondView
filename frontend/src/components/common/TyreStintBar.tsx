import React from 'react';
import type { TyreCompound } from '../../types/f1';

export interface StintItem {
  compound: TyreCompound;
  laps: number;
  isCurrent?: boolean;
  stintNumber?: number;
}

interface TyreStintBarProps {
  stints: StintItem[];
  lang?: 'es' | 'en';
  className?: string;
  totalRaceLaps?: number;
}

export const TyreStintBar: React.FC<TyreStintBarProps> = ({
  stints,
  lang = 'es',
  className = '',
  totalRaceLaps,
}) => {
  if (!stints || stints.length === 0) return null;

  const totalStintLaps = stints.reduce((acc, s) => acc + s.laps, 0) || totalRaceLaps || 1;

  const getCompoundConfig = (comp: TyreCompound) => {
    const c = (comp || '').toUpperCase();
    if (c.includes('SOFT')) {
      return { letter: 'S', color: '#FF3B30', bg: 'bg-[#FF3B30]/20', border: 'border-[#FF3B30]', text: 'text-[#FF3B30]', name: 'Soft' };
    }
    if (c.includes('MEDIUM')) {
      return { letter: 'M', color: '#FFD60A', bg: 'bg-[#FFD60A]/20', border: 'border-[#FFD60A]', text: 'text-[#FFD60A]', name: 'Medium' };
    }
    if (c.includes('HARD')) {
      return { letter: 'H', color: '#FFFFFF', bg: 'bg-white/20', border: 'border-white', text: 'text-white', name: 'Hard' };
    }
    if (c.includes('INTER')) {
      return { letter: 'I', color: '#34C759', bg: 'bg-[#34C759]/20', border: 'border-[#34C759]', text: 'text-[#34C759]', name: 'Intermediate' };
    }
    if (c.includes('WET')) {
      return { letter: 'W', color: '#007AFF', bg: 'bg-[#007AFF]/20', border: 'border-[#007AFF]', text: 'text-[#007AFF]', name: 'Wet' };
    }
    return { letter: '?', color: '#71717A', bg: 'bg-zinc-700/20', border: 'border-zinc-500', text: 'text-zinc-400', name: 'Unknown' };
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {/* Visual Timeline Bar */}
      <div className="flex w-full h-6 rounded-md overflow-hidden p-0.5 bg-black/40 border border-white/[0.08] gap-1">
        {stints.map((stint, idx) => {
          const cfg = getCompoundConfig(stint.compound);
          const flexShare = Math.max(stint.laps / totalStintLaps, 0.15);

          return (
            <div
              key={idx}
              style={{ flex: flexShare }}
              title={
                lang === 'es'
                  ? `Stint ${stint.stintNumber || idx + 1}: ${cfg.name} (${stint.laps} vueltas)${stint.isCurrent ? ' [En pista]' : ''}`
                  : `Stint ${stint.stintNumber || idx + 1}: ${cfg.name} (${stint.laps} laps)${stint.isCurrent ? ' [Active]' : ''}`
              }
              className={`relative flex items-center justify-center rounded transition-all px-1 select-none overflow-hidden ${cfg.bg} border ${cfg.border}/60 ${
                stint.isCurrent ? 'ring-1 ring-white/50 shadow-xs shadow-white/20' : ''
              }`}
            >
              {/* Badge letter circle */}
              <span
                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center font-mono font-black text-[8px] leading-none shrink-0 ${cfg.border} ${cfg.text} bg-black/50 mr-1`}
              >
                {cfg.letter}
              </span>

              {/* Laps label */}
              <span className={`font-mono text-[10px] font-bold truncate ${cfg.text}`}>
                {stint.laps}{lang === 'es' ? 'v' : 'l'}
              </span>

              {/* Active Stint Pulsing Indicator */}
              {stint.isCurrent && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </div>
          );
        })}
      </div>

      {/* Legend / Stint Breakdown Details */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-[10px] font-mono text-zinc-400">
        {stints.map((stint, idx) => {
          const cfg = getCompoundConfig(stint.compound);
          return (
            <div key={idx} className="flex items-center gap-1 shrink-0">
              <span className="text-zinc-500 font-sans text-[9px] uppercase">
                {lang === 'es' ? `T${idx + 1}:` : `S${idx + 1}:`}
              </span>
              <span className={`font-bold ${cfg.text}`}>{cfg.letter}</span>
              <span>
                {stint.laps}{lang === 'es' ? 'v' : 'l'}
              </span>
              {stint.isCurrent && (
                <span className="text-[8px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 uppercase font-black tracking-tight">
                  {lang === 'es' ? 'ACTUAL' : 'CURRENT'}
                </span>
              )}
              {idx < stints.length - 1 && <span className="text-zinc-600">➔</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
