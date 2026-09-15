import React from 'react';
import type { TyreCompound } from '../../types/f1';

interface TyreBadgeProps {
  tyre: { compound: TyreCompound; laps: number } | null | undefined;
  lang?: 'es' | 'en';
  size?: 'sm' | 'md';
  className?: string;
}

export const TyreBadge: React.FC<TyreBadgeProps> = ({
  tyre,
  lang = 'es',
  size = 'md',
  className = '',
}) => {
  if (!tyre || !tyre.compound) {
    return <span className={`text-[10px] text-zinc-600 font-mono ${className}`}>-</span>;
  }

  const compound = tyre.compound.toUpperCase();
  let letter = '-';
  let ringClass = 'border-zinc-600 text-zinc-400 bg-white/5';

  if (compound.includes('SOFT')) {
    letter = 'S';
    ringClass = 'border-[#FF3B30] text-[#FF3B30] bg-[#FF3B30]/10';
  } else if (compound.includes('MEDIUM')) {
    letter = 'M';
    ringClass = 'border-[#FFD60A] text-[#FFD60A] bg-[#FFD60A]/10';
  } else if (compound.includes('HARD')) {
    letter = 'H';
    ringClass = 'border-white text-white bg-white/10';
  } else if (compound.includes('INTER')) {
    letter = 'I';
    ringClass = 'border-[#34C759] text-[#34C759] bg-[#34C759]/10';
  } else if (compound.includes('WET')) {
    letter = 'W';
    ringClass = 'border-[#007AFF] text-[#007AFF] bg-[#007AFF]/10';
  }

  const isSmall = size === 'sm';

  return (
    <div
      className={`inline-flex items-center select-none ${isSmall ? 'gap-1' : 'gap-1.5'} ${className}`}
      title={
        lang === 'es'
          ? `Compuesto Pirelli ${tyre.compound} (${tyre.laps} vueltas)`
          : `Pirelli compound ${tyre.compound} (${tyre.laps} laps)`
      }
    >
      <span
        className={`rounded-full flex items-center justify-center font-mono font-black leading-none shrink-0 ${
          isSmall ? 'w-4 h-4 text-[9px] border' : 'w-5 h-5 text-[11px] border-2'
        } ${ringClass}`}
      >
        {letter}
      </span>
      <span
        className={`font-mono font-bold tabular-nums ${
          isSmall ? 'text-[10px] text-zinc-400' : 'text-xs text-zinc-300'
        }`}
      >
        {tyre.laps}
        {lang === 'es' ? 'v' : 'l'}
      </span>
    </div>
  );
};
