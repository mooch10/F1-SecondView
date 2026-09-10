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
    <div className="bg-[#131722] border border-white/[0.08] rounded-xl p-3 shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#27F4D2]" />
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
            Sincronización TV (Anti-Spoilers)
          </span>
        </div>

        {/* Current Delay Badge */}
        <div className="flex items-center gap-1.5">
          {delaySeconds === 0 ? (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-[#E10600]/20 text-[#E10600] border border-[#E10600]/30 tracking-wide uppercase">
              EN VIVO (0s)
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 tracking-wide font-mono">
              -{delaySeconds}s TV Delay
            </span>
          )}

          {delaySeconds > 0 && (
            <button
              type="button"
              onClick={() => onDelayChange(0)}
              title="Volver a tiempo real (0s)"
              className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Slider & Nudge Buttons Container */}
      <div className="flex items-center gap-2">
        {/* Nudge -2s button */}
        <button
          type="button"
          onClick={() => onNudge(-2)}
          disabled={delaySeconds <= 0}
          className="h-10 px-2.5 rounded-lg bg-[#1C2230] border border-white/[0.08] text-xs font-mono font-bold text-zinc-200 hover:bg-white/[0.08] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1"
          title="Restar 2 segundos de retraso"
        >
          <span>-2s</span>
        </button>

        {/* Range slider */}
        <div className="flex-1 flex flex-col justify-center px-1">
          <input
            type="range"
            min="0"
            max="45"
            step="1"
            value={delaySeconds}
            onChange={(e) => onDelayChange(Number(e.target.value))}
            className="w-full h-2 bg-[#0B0E14] rounded-lg appearance-none cursor-pointer accent-[#27F4D2] border border-white/[0.1]"
          />
          <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-1 font-tabular">
            <span>0s (Pista)</span>
            <span>15s (F1 TV)</span>
            <span>30s (Disney+)</span>
            <span>45s</span>
          </div>
        </div>

        {/* Nudge +2s button */}
        <button
          type="button"
          onClick={() => onNudge(2)}
          disabled={delaySeconds >= 45}
          className="h-10 px-2.5 rounded-lg bg-[#1C2230] border border-white/[0.08] text-xs font-mono font-bold text-zinc-200 hover:bg-white/[0.08] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1"
          title="Sumar 2 segundos de retraso"
        >
          <span>+2s</span>
          <FastForward className="w-3 h-3 text-[#27F4D2]" />
        </button>
      </div>
    </div>
  );
};
