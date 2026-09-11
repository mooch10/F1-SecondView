import React from 'react';
import { Pause, Play, RotateCcw, X } from 'lucide-react';

interface RaceSimulatorBarProps {
  isPlaying: boolean;
  simLap: number;
  totalLaps: number;
  simSpeed: number;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onLapChange: (lap: number) => void;
  onSpeedChange: (speed: number) => void;
  onExit: () => void;
}

export const RaceSimulatorBar: React.FC<RaceSimulatorBarProps> = ({
  isPlaying,
  simLap,
  totalLaps,
  simSpeed,
  onPlay,
  onPause,
  onReset,
  onLapChange,
  onSpeedChange,
  onExit,
}) => {
  return (
    <div className="bg-[#14161A] border-2 border-[#27F4D2]/40 rounded-sm p-3 flex flex-col gap-2 font-mono select-none shadow-lg">
      {/* Top row: Mode badge & control buttons */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#27F4D2] animate-ping" />
          <span className="text-xs font-bold text-[#27F4D2] uppercase tracking-wider">
            SIMULADOR EN VIVO (MONZA 2024)
          </span>
          <span className="text-[10px] text-[#8E929B] bg-[#0B0C0E] border border-white/10 px-1.5 py-0.5 rounded-xs">
            VTA {simLap} / {totalLaps}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Play/Pause Button */}
          {isPlaying ? (
            <button
              type="button"
              onClick={onPause}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xs bg-[#FFD800]/20 text-[#FFD800] border border-[#FFD800]/40 font-bold text-xs hover:bg-[#FFD800]/30 transition-colors cursor-pointer"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>PAUSAR</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onPlay}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xs bg-[#27F4D2] text-[#0B0C0E] font-bold text-xs hover:bg-[#20caa9] transition-colors cursor-pointer shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>REPRODUCIR</span>
            </button>
          )}

          {/* Reset button */}
          <button
            type="button"
            onClick={onReset}
            title="Reiniciar a Vuelta 1"
            className="p-1 rounded-xs bg-[#22262E] text-[#8E929B] hover:text-[#F5F5F7] border border-white/5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Speed selectors */}
          <div className="flex items-center bg-[#0B0C0E] border border-white/10 rounded-xs p-0.5">
            {[1, 2, 5].map((speed) => (
              <button
                key={speed}
                type="button"
                onClick={() => onSpeedChange(speed)}
                className={`px-1.5 py-0.5 text-[10px] font-bold rounded-xs transition-colors cursor-pointer ${
                  simSpeed === speed
                    ? 'bg-[#E10600] text-white'
                    : 'text-[#8E929B] hover:text-white'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          {/* Exit simulation */}
          <button
            type="button"
            onClick={onExit}
            title="Salir del modo simulación"
            className="flex items-center gap-1 px-2 py-1 rounded-xs bg-[#22262E] text-[#8E929B] hover:text-[#E10600] border border-white/5 text-[10px] font-bold transition-colors cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span className="hidden sm:inline">SALIR</span>
          </button>
        </div>
      </div>

      {/* Lap Scrubber Slider */}
      <div className="flex items-center gap-2 pt-1 border-t border-[#22262E]">
        <span className="text-[10px] text-[#8E929B] whitespace-nowrap">
          Vta 1
        </span>
        <input
          type="range"
          min="1"
          max={totalLaps}
          value={simLap}
          onChange={(e) => onLapChange(Number(e.target.value))}
          className="w-full accent-[#27F4D2] cursor-pointer h-1.5 bg-[#0B0C0E] rounded-lg"
        />
        <span className="text-[10px] text-[#27F4D2] font-bold whitespace-nowrap">
          Vta {totalLaps}
        </span>
      </div>
    </div>
  );
};
