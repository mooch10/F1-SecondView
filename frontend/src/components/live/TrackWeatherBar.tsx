import React from 'react';
import { CloudRain, Droplets, Sun, Thermometer, Wind } from 'lucide-react';
import type { TrackWeather } from '../../types/f1';

interface TrackWeatherBarProps {
  weather: TrackWeather | null | undefined;
}

export const TrackWeatherBar: React.FC<TrackWeatherBarProps> = ({ weather }) => {
  if (!weather) return null;

  return (
    <div className="bg-[#131722] border border-white/[0.08] rounded-xl px-3 py-1.5 flex items-center justify-between overflow-x-auto text-[11px] font-mono select-none gap-2 sm:gap-4">
      {/* Air Temperature */}
      <div className="flex items-center gap-1.5 whitespace-nowrap" title="Temperatura Ambiente">
        <Thermometer className="w-3.5 h-3.5 text-zinc-400" />
        <span className="text-zinc-400 hidden sm:inline">AIRE</span>
        <span className="font-bold text-zinc-100 tabular-nums">
          {weather.airTemp ? `${weather.airTemp.toFixed(1)}°C` : '--°C'}
        </span>
      </div>

      <span className="text-white/20">•</span>

      {/* Track Temperature */}
      <div className="flex items-center gap-1.5 whitespace-nowrap" title="Temperatura de Asfalto">
        <span className="w-2 h-2 rounded-full bg-[#E10600] inline-block" />
        <span className="text-zinc-400 hidden sm:inline">PISTA</span>
        <span className="font-bold text-zinc-100 tabular-nums">
          {weather.trackTemp ? `${weather.trackTemp.toFixed(1)}°C` : '--°C'}
        </span>
      </div>

      <span className="text-white/20">•</span>

      {/* Rain Status */}
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
            <span className="font-bold text-[#39B54A]">SECO</span>
          </>
        )}
      </div>

      <span className="text-white/20">•</span>

      {/* Wind */}
      <div className="flex items-center gap-1.5 whitespace-nowrap" title="Velocidad del Viento">
        <Wind className="w-3.5 h-3.5 text-zinc-400" />
        <span className="text-zinc-400 hidden sm:inline">VIENTO</span>
        <span className="font-bold text-zinc-100 tabular-nums">
          {weather.windSpeed !== undefined ? `${weather.windSpeed.toFixed(1)} m/s` : '-- m/s'}
        </span>
      </div>

      <span className="text-white/20 hidden xs:inline">•</span>

      {/* Humidity */}
      <div className="flex items-center gap-1.5 whitespace-nowrap hidden xs:flex" title="Humedad Relativa">
        <Droplets className="w-3.5 h-3.5 text-zinc-400" />
        <span className="text-zinc-400 hidden sm:inline">HUM</span>
        <span className="font-bold text-zinc-100 tabular-nums">
          {weather.humidity !== undefined ? `${weather.humidity}%` : '--%'}
        </span>
      </div>
    </div>
  );
};
