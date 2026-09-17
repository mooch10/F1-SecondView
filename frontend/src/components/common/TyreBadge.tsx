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
  let color = '#71717A';

  if (compound.includes('SOFT')) {
    letter = 'S';
    color = '#FF3B30';
  } else if (compound.includes('MEDIUM')) {
    letter = 'M';
    color = '#FFD60A';
  } else if (compound.includes('HARD')) {
    letter = 'H';
    color = '#FFFFFF';
  } else if (compound.includes('INTER')) {
    letter = 'I';
    color = '#34C759';
  } else if (compound.includes('WET')) {
    letter = 'W';
    color = '#007AFF';
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
        className={`inline-flex items-center justify-center rounded-full shrink-0 select-none ${
          isSmall
            ? 'w-4 h-4 text-[8.5px] border-[1.5px]'
            : 'w-5 h-5 text-[10px] border-2'
        }`}
        style={{
          borderColor: color,
          color: color,
          backgroundColor: `${color}18`,
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          fontWeight: 800,
          lineHeight: 1,
        }}
        aria-hidden="true"
      >
        <span className="transform translate-y-[0.5px] leading-none">
          {letter}
        </span>
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
