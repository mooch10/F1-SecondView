import React from 'react';
import { useTimezone } from '../../context/TimezoneContext';

interface TrackTimeToggleProps {
  className?: string;
  showBorder?: boolean;
}

export const TrackTimeToggle: React.FC<TrackTimeToggleProps> = ({
  className = '',
  showBorder = true,
}) => {
  const { mode, setMode, myClock, trackClock } = useTimezone();

  return (
    <div
      className={`inline-flex flex-col justify-center bg-[#0B0E14] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg select-none text-[9px] sm:text-[11px] font-mono leading-tight tracking-tight whitespace-nowrap shrink-0 ${
        showBorder ? 'border border-white/[0.08] shadow-xs' : ''
      } ${className}`}
      title="Alternar referencia horaria: Mi Hora (local) vs Hora del Circuito (Track)"
    >
      {/* Row 1: MY TIME */}
      <button
        type="button"
        onClick={() => setMode('my')}
        className="flex items-center justify-between gap-2 sm:gap-3 group cursor-pointer transition-colors py-0.5 text-left focus:outline-none"
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className={`w-1.5 h-1.5 rounded-full shrink-0 transition-opacity ${
              mode === 'my'
                ? 'bg-white opacity-100'
                : 'opacity-0'
            }`}
          />
          <span
            className={`font-black uppercase tracking-wider transition-colors ${
              mode === 'my'
                ? 'text-white'
                : 'text-zinc-500 group-hover:text-zinc-300'
            }`}
          >
            MY TIME
          </span>
        </div>
        <span
          className={`font-black tabular-nums transition-colors ${
            mode === 'my'
              ? 'text-white font-bold'
              : 'text-zinc-500 group-hover:text-zinc-300'
          }`}
        >
          {myClock}
        </span>
      </button>

      {/* Row 2: TRACK TIME */}
      <button
        type="button"
        onClick={() => setMode('track')}
        className="flex items-center justify-between gap-2 sm:gap-3 group cursor-pointer transition-colors py-0.5 text-left focus:outline-none"
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className={`w-1.5 h-1.5 rounded-full shrink-0 transition-opacity ${
              mode === 'track'
                ? 'bg-white opacity-100'
                : 'opacity-0'
            }`}
          />
          <span
            className={`font-bold uppercase tracking-wider transition-colors ${
              mode === 'track'
                ? 'text-white font-black'
                : 'text-zinc-500 group-hover:text-zinc-300'
            }`}
          >
            TRACK TIME
          </span>
        </div>
        <span
          className={`font-bold tabular-nums transition-colors ${
            mode === 'track'
              ? 'text-white font-black'
              : 'text-zinc-500 group-hover:text-zinc-300'
          }`}
        >
          {trackClock}
        </span>
      </button>
    </div>
  );
};
