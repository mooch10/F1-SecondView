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
  let bgColor = '#71717A';
  let textColor = '#FFFFFF';

  if (compound.includes('SOFT')) {
    letter = 'S';
    bgColor = '#E10600';
    textColor = '#FFFFFF';
  } else if (compound.includes('MEDIUM')) {
    letter = 'M';
    bgColor = '#FFD60A';
    textColor = '#000000';
  } else if (compound.includes('HARD')) {
    letter = 'H';
    bgColor = '#FFFFFF';
    textColor = '#000000';
  } else if (compound.includes('INTER')) {
    letter = 'I';
    bgColor = '#34C759';
    textColor = '#000000';
  } else if (compound.includes('WET')) {
    letter = 'W';
    bgColor = '#007AFF';
    textColor = '#FFFFFF';
  }

  const isSmall = size === 'sm';

  return (
    <div
      className={`inline-flex items-center select-none ${isSmall ? 'gap-1' : 'gap-1 sm:gap-1.5'} ${className}`}
      title={
        lang === 'es'
          ? `Compuesto Pirelli ${tyre.compound} (${tyre.laps} vueltas)`
          : `Pirelli compound ${tyre.compound} (${tyre.laps} laps)`
      }
    >
      <span
        className={`inline-flex items-center justify-center rounded-full shrink-0 select-none ${
          isSmall
            ? 'w-4 h-4 text-[9px]'
            : 'w-[19px] h-[19px] text-[11px]'
        }`}
        style={{
          backgroundColor: bgColor,
          color: textColor,
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          fontWeight: 900,
          lineHeight: 1,
        }}
        aria-hidden="true"
      >
        {letter}
      </span>
      <span
        className={`font-mono font-bold tabular-nums text-left shrink-0 ${
          isSmall
            ? 'w-[19px] text-[9.5px] text-zinc-400'
            : 'w-[19px] sm:w-[23px] text-[10px] sm:text-xs text-zinc-300'
        }`}
      >
        {tyre.laps}
        {lang === 'es' ? 'v' : 'l'}
      </span>
    </div>
  );
};
