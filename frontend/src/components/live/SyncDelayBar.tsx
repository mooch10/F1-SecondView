import React from 'react';
import { FastForward, RotateCcw, SlidersHorizontal } from 'lucide-react';

interface SyncDelayBarProps {
  delaySeconds: number;
  onDelayChange: (delay: number) => void;
  onNudge: (delta: number) => void;
}

export const SyncDelayBar: React.FC<SyncDelayBarProps> = ({
  delaySeconds,
  onDelayChange,
  onNudge,
}) => {
  return (
    <div className="bg-[#131722] border border-white/[0.08] rounded-xl p-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#E10600]" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-100">
            Sincronización TV (Anti-Spoilers)
          </span>
        </div>

        {/* Current Delay Status Badge */}
        <div className="flex items-center gap-1.5">
          {delaySeconds === 0 ? (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#E10600]/15 text-[#E10600] border border-[#E10600]/30 tracking-widest uppercase">
              EN VIVO (0s)
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#1C2230] text-[#FFD60A] border border-white/[0.08] tracking-wider">
              -{delaySeconds}s RETRASO
            </span>
          )}

          {delaySeconds > 0 && (
            <button
              type="button"
              onClick={() => onDelayChange(0)}
              title="Restablecer a tiempo real (0s)"
              className="p-1 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-[#1C2230] transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Production Scrubber & Hardware Nudge Controls */}
      <div className="flex items-center gap-2 pt-1">
        {/* Hardware Button -2s */}
        <button
          type="button"
          onClick={() => onNudge(-2)}
          disabled={delaySeconds <= 0}
          className="h-8 px-3 rounded-lg bg-[#1C2230] border border-white/[0.08] hover:border-white/[0.2] hover:bg-[#232a3b] text-xs font-mono font-semibold text-zinc-100 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all"
          title="Restar 2 segundos de retraso"
        >
          -2s
        </button>

        {/* Timeline Scrubber */}
        <div className="flex-1 flex flex-col justify-center px-1">
          <input
            type="range"
            min="0"
            max="45"
            step="1"
            value={delaySeconds}
            onChange={(e) => onDelayChange(Number(e.target.value))}
            className="w-full h-2 bg-[#0B0E14] rounded-lg appearance-none cursor-pointer accent-[#E10600] border border-white/[0.08]"
          />
          {/* Broadcast Ruler Marks */}
          <div className="flex justify-between text-[9px] text-zinc-400 font-mono mt-1 tabular-nums select-none">
            <span className="flex flex-col items-start">
              <span className="w-px h-1 bg-white/[0.12] mb-0.5" />
              0s (PISTA)
            </span>
            <span className="flex flex-col items-center">
              <span className="w-px h-1 bg-white/[0.12] mb-0.5" />
              15s (F1 TV)
            </span>
            <span className="flex flex-col items-center">
              <span className="w-px h-1 bg-white/[0.12] mb-0.5" />
              30s (DISNEY+)
            </span>
            <span className="flex flex-col items-end">
              <span className="w-px h-1 bg-white/[0.12] mb-0.5" />
              45s
            </span>
          </div>
        </div>

        {/* Hardware Button +2s */}
        <button
          type="button"
          onClick={() => onNudge(2)}
          disabled={delaySeconds >= 45}
          className="h-8 px-3 rounded-lg bg-[#1C2230] border border-white/[0.08] hover:border-white/[0.2] hover:bg-[#232a3b] text-xs font-mono font-semibold text-zinc-100 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1"
          title="Sumar 2 segundos de retraso"
        >
          <span>+2s</span>
          <FastForward className="w-3 h-3 text-[#E10600]" />
        </button>
      </div>
    </div>
  );
};
