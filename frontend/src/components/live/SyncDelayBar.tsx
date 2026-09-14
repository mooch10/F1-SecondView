import React from 'react';
import { FastForward, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

interface SyncDelayBarProps {
  delaySeconds: number;
  onDelayChange: (delay: number) => void;
  onNudge: (delta: number) => void;
}
 
const MINOR_TICKS = [5, 10, 20, 25, 35, 40];

export const SyncDelayBar: React.FC<SyncDelayBarProps> = ({
  delaySeconds,
  onDelayChange,
  onNudge,
}) => {
  const { lang, t } = useLanguage();

  return (
    <div className="bg-[#131722] border border-white/[0.08] rounded-xl p-3 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-2 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#E10600] shrink-0" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-100 whitespace-nowrap">
            <span className="sm:hidden">{lang === 'es' ? 'ANTI-SPOILER (TV)' : 'TV SYNC (DELAY)'}</span>
            <span className="hidden sm:inline">{t.live.delay.title}</span>
          </span>
        </div>

        {/* Current Delay Status Badge */}
        <div className="flex items-center gap-1.5 shrink-0">
          {delaySeconds === 0 ? (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#E10600]/15 text-[#E10600] border border-[#E10600]/30 tracking-widest uppercase whitespace-nowrap">
              {t.live.delay.live}
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#1C2230] text-[#FFD60A] border border-white/[0.08] tracking-wider font-tabular whitespace-nowrap">
              -{delaySeconds}s {lang === 'es' ? 'RETRASO' : 'DELAY'}
            </span>
          )}

          {delaySeconds > 0 && (
            <button
              type="button"
              onClick={() => onDelayChange(0)}
              title={lang === 'es' ? 'Restablecer a tiempo real (0s)' : 'Reset to real time (0s)'}
              className="p-1 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-[#1C2230] transition-colors cursor-pointer"
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
          className="h-8 px-3 rounded-lg bg-[#1C2230] border border-white/[0.08] hover:border-white/[0.2] hover:bg-[#232a3b] text-xs font-mono font-semibold text-zinc-100 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer select-none"
          title={lang === 'es' ? 'Restar 2 segundos de retraso' : 'Subtract 2 seconds of delay'}
        >
          -2s
        </button>

        {/* Timeline Scrubber with Subpixel Alignment */}
        <div className="flex-1 flex flex-col justify-center">
          <input
            type="range"
            min="0"
            max="45"
            step="1"
            value={delaySeconds}
            onChange={(e) => onDelayChange(Number(e.target.value))}
            className="f1-range-slider"
            title={`${lang === 'es' ? 'Retraso' : 'Delay'}: ${delaySeconds}s`}
          />

          {/* Broadcast Ruler Marks with Exact Pixel Alignment */}
          <div className="relative w-full h-7 mt-0.5 select-none">
            {/* Minor calibration ticks at every 5s */}
            {MINOR_TICKS.map((tickVal) => (
              <div
                key={tickVal}
                className="absolute top-0 w-px h-1.5 bg-zinc-600 dark:bg-white/20 -translate-x-1/2 pointer-events-none"
                style={{ left: `calc(8px + (100% - 16px) * (${tickVal} / 45))` }}
              />
            ))}

            {/* Major Preset 1: 0s (PISTA) */}
            <button
              type="button"
              onClick={() => onDelayChange(0)}
              title={lang === 'es' ? 'Sincronizar en tiempo real con pista (0s)' : 'Sync live with track (0s)'}
              className="absolute top-0 left-0 flex flex-col items-start cursor-pointer group text-left"
            >
              <span
                className={`w-0.5 h-2 rounded-full mb-0.5 ml-[7px] transition-colors ${
                  delaySeconds === 0
                    ? 'bg-[#E10600] h-2.5 shadow-sm'
                    : 'bg-zinc-400 dark:bg-white/35 group-hover:bg-[#E10600]'
                }`}
              />
              <span
                className={`text-[9px] sm:text-[10px] font-mono leading-none tracking-tight transition-colors ${
                  delaySeconds === 0
                    ? 'text-[#E10600] font-bold'
                    : 'text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100'
                }`}
              >
                0s <span className="hidden sm:inline">({t.live.delay.track})</span>
              </span>
            </button>

            {/* Major Preset 2: 15s (F1 TV) */}
            <button
              type="button"
              onClick={() => onDelayChange(15)}
              title="F1 TV (15s)"
              className="absolute top-0 -translate-x-1/2 flex flex-col items-center cursor-pointer group text-center"
              style={{ left: 'calc(8px + (100% - 16px) * (15 / 45))' }}
            >
              <span
                className={`w-0.5 h-2 rounded-full mb-0.5 transition-colors ${
                  delaySeconds === 15
                    ? 'bg-[#E10600] h-2.5 shadow-sm'
                    : 'bg-zinc-400 dark:bg-white/35 group-hover:bg-[#E10600]'
                }`}
              />
              <span
                className={`text-[9px] sm:text-[10px] font-mono leading-none tracking-tight whitespace-nowrap transition-colors ${
                  delaySeconds === 15
                    ? 'text-[#E10600] font-bold'
                    : 'text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100'
                }`}
              >
                15s <span className="hidden sm:inline">(F1 TV)</span><span className="sm:hidden">(F1)</span>
              </span>
            </button>

            {/* Major Preset 3: 30s (DISNEY+) */}
            <button
              type="button"
              onClick={() => onDelayChange(30)}
              title="Disney+ (30s)"
              className="absolute top-0 -translate-x-1/2 flex flex-col items-center cursor-pointer group text-center"
              style={{ left: 'calc(8px + (100% - 16px) * (30 / 45))' }}
            >
              <span
                className={`w-0.5 h-2 rounded-full mb-0.5 transition-colors ${
                  delaySeconds === 30
                    ? 'bg-[#E10600] h-2.5 shadow-sm'
                    : 'bg-zinc-400 dark:bg-white/35 group-hover:bg-[#E10600]'
                }`}
              />
              <span
                className={`text-[9px] sm:text-[10px] font-mono leading-none tracking-tight whitespace-nowrap transition-colors ${
                  delaySeconds === 30
                    ? 'text-[#E10600] font-bold'
                    : 'text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100'
                }`}
              >
                30s <span className="hidden sm:inline">(DISNEY+)</span><span className="sm:hidden">(D+)</span>
              </span>
            </button>

            {/* Major Preset 4: 45s */}
            <button
              type="button"
              onClick={() => onDelayChange(45)}
              title={lang === 'es' ? 'Retraso máximo (45s)' : 'Max delay (45s)'}
              className="absolute top-0 right-0 flex flex-col items-end cursor-pointer group text-right"
            >
              <span
                className={`w-0.5 h-2 rounded-full mb-0.5 mr-[7px] transition-colors ${
                  delaySeconds === 45
                    ? 'bg-[#E10600] h-2.5 shadow-sm'
                    : 'bg-zinc-400 dark:bg-white/35 group-hover:bg-[#E10600]'
                }`}
              />
              <span
                className={`text-[9px] sm:text-[10px] font-mono leading-none tracking-tight whitespace-nowrap transition-colors ${
                  delaySeconds === 45
                    ? 'text-[#E10600] font-bold'
                    : 'text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100'
                }`}
              >
                45s
              </span>
            </button>
          </div>
        </div>

        {/* Hardware Button +2s */}
        <button
          type="button"
          onClick={() => onNudge(2)}
          disabled={delaySeconds >= 45}
          className="h-8 px-3 rounded-lg bg-[#1C2230] border border-white/[0.08] hover:border-white/[0.2] hover:bg-[#232a3b] text-xs font-mono font-semibold text-zinc-100 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1 cursor-pointer select-none"
          title={lang === 'es' ? 'Sumar 2 segundos de retraso' : 'Add 2 seconds of delay'}
        >
          <span>+2s</span>
          <FastForward className="w-3 h-3 text-[#E10600]" />
        </button>
      </div>
    </div>
  );
};
