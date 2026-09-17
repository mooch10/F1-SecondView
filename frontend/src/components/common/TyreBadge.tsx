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
      <svg
        viewBox="0 0 20 20"
        className={`${isSmall ? 'w-4 h-4' : 'w-5 h-5'} shrink-0 select-none`}
        aria-hidden="true"
      >
        <circle
          cx="10"
          cy="10"
          r={isSmall ? 8.5 : 8}
          stroke={color}
          strokeWidth={isSmall ? 1.5 : 2}
          fill={color}
          fillOpacity={0.12}
        />
        <text
          x="10"
          y="10"
          textAnchor="middle"
          dominantBaseline="central"
          fill={color}
          className="select-none"
          style={{
            fontSize: isSmall ? '9.5px' : '11px',
            fontWeight: 900,
            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
          }}
        >
          {letter}
        </text>
      </svg>
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
