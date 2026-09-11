import React from 'react';
import { CloudRain, Droplets, Sun, Thermometer, Wind } from 'lucide-react';
import type { TrackWeather } from '../../types/f1';

interface TrackWeatherBarProps {
  weather: TrackWeather | null | undefined;
}

export const TrackWeatherBar: React.FC<TrackWeatherBarProps> = ({ weather }) => {
  if (!weather) return null;

  return (
    <div className="bg-[#131722] border border-white/[0.08] rounded-xl px-3 py-2 flex items-center justify-between overflow-x-auto text-[11px] font-mono select-none gap-3 sm:gap-4 no-scrollbar shadow-sm">
      {/* 1. Track / Asphalt Temperature */}
      <div className="flex items-center gap-1.5 whitespace-nowrap" title="Temperatura de Asfalto">
        <span className="w-2 h-2 rounded-full bg-[#E10600] inline-block shadow-sm" />
        <span className="text-zinc-400 text-[10px] sm:text-[11px]">PISTA</span>
        <span className="font-bold text-zinc-100 tabular-nums">
          {weather.trackTemp ? `${weather.trackTemp.toFixed(1)}°C` : '--°C'}
        </span>
      </div>

      <span className="text-white/20 select-none">•</span>

      {/* 2. Air Temperature */}
      <div className="flex items-center gap-1.5 whitespace-nowrap" title="Temperatura Ambiente">
        <Thermometer className="w-3.5 h-3.5 text-zinc-400" />
        <span className="text-zinc-400 text-[10px] sm:text-[11px]">AIRE</span>
        <span className="font-bold text-zinc-100 tabular-nums">
          {weather.airTemp ? `${weather.airTemp.toFixed(1)}°C` : '--°C'}
        </span>
      </div>

      <span className="text-white/20 select-none">•</span>

      {/* 3. Humidity */}
      <div className="flex items-center gap-1.5 whitespace-nowrap" title="Humedad Relativa">
        <Droplets className="w-3.5 h-3.5 text-[#27F4D2]" />
        <span className="text-zinc-400 text-[10px] sm:text-[11px]">HUM</span>
        <span className="font-bold text-zinc-100 tabular-nums">
          {weather.humidity !== undefined ? `${weather.humidity}%` : '--%'}
        </span>
      </div>

      <span className="text-white/20 select-none">•</span>

      {/* 4. Rain Status */}
      <div className="flex items-center gap-1.5 whitespace-nowrap" title="Estado de Precipitación">
        {weather.rainfall ? (
          <>
            <CloudRain className="w-3.5 h-3.5 text-[#00AEEF] animate-pulse" />
            <span className="font-bold text-[#00AEEF] px-1.5 py-0.5 bg-[#00AEEF]/10 rounded-md border border-[#00AEEF]/30">
              LLUVIA
            </span>
          </>
        ) : (
          <>
            <Sun className="w-3.5 h-3.5 text-[#FFD60A]" />
            <span className="font-bold text-[#39B54A] px-1.5 py-0.5 bg-[#39B54A]/10 rounded-md border border-[#39B54A]/30">
              SECO
            </span>
          </>
        )}
      </div>

      <span className="text-white/20 select-none">•</span>

      {/* 5. Wind */}
      <div className="flex items-center gap-1.5 whitespace-nowrap" title="Velocidad del Viento">
        <Wind className="w-3.5 h-3.5 text-zinc-400" />
        <span className="text-zinc-400 text-[10px] sm:text-[11px]">VIENTO</span>
        <span className="font-bold text-zinc-100 tabular-nums">
          {weather.windSpeed !== undefined ? `${weather.windSpeed.toFixed(1)} m/s` : '-- m/s'}
        </span>
      </div>
    </div>
  );
};
