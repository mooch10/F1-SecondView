import React from 'react';
import { CloudRain, Droplets, Sun, Thermometer, Wind } from 'lucide-react';
import type { TrackWeather } from '../../types/f1';
import { useLanguage } from '../../hooks/useLanguage';

interface TrackWeatherBarProps {
  weather: TrackWeather | null | undefined;
}

export const TrackWeatherBar: React.FC<TrackWeatherBarProps> = ({ weather }) => {
  const { lang, t } = useLanguage();
  if (!weather) return null;

  return (
    <div className="bg-[#131722] border border-white/[0.08] rounded-xl px-2.5 sm:px-3 py-1 sm:py-2 text-[10px] sm:text-[11px] font-mono select-none shadow-sm">
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-y-1 gap-x-2 sm:gap-4">
        {/* 1. Track / Asphalt Temperature */}
        <div className="flex items-center gap-1.5 whitespace-nowrap" title={lang === 'es' ? 'Temperatura de Asfalto' : 'Track Temperature'}>
          <span className="w-2 h-2 rounded-full bg-[#E10600] inline-block shadow-sm" />
          <span className="text-zinc-400 text-[10px] sm:text-[11px]">{t.live.weather.track}</span>
          <span className="font-bold text-zinc-100 tabular-nums">
            {weather.trackTemp ? `${weather.trackTemp.toFixed(1)}°C` : '--°C'}
          </span>
        </div>

        <span className="text-white/20 select-none hidden sm:inline">•</span>

        {/* 2. Air Temperature */}
        <div className="flex items-center gap-1.5 whitespace-nowrap" title={lang === 'es' ? 'Temperatura Ambiente' : 'Ambient Temperature'}>
          <Thermometer className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-zinc-400 text-[10px] sm:text-[11px]">{t.live.weather.air}</span>
          <span className="font-bold text-zinc-100 tabular-nums">
            {weather.airTemp ? `${weather.airTemp.toFixed(1)}°C` : '--°C'}
          </span>
        </div>

        <span className="text-white/20 select-none hidden sm:inline">•</span>

        {/* 3. Humidity */}
        <div className="flex items-center gap-1.5 whitespace-nowrap" title={lang === 'es' ? 'Humedad Relativa' : 'Relative Humidity'}>
          <Droplets className="w-3.5 h-3.5 text-[#27F4D2]" />
          <span className="text-zinc-400 text-[10px] sm:text-[11px]">{t.live.weather.humidity}</span>
          <span className="font-bold text-zinc-100 tabular-nums">
            {weather.humidity !== undefined ? `${weather.humidity}%` : '--%'}
          </span>
        </div>

        <span className="text-white/20 select-none hidden sm:inline">•</span>

        {/* 4. Track Surface / Weather Status */}
        <div className="flex items-center gap-1.5 whitespace-nowrap" title={lang === 'es' ? 'Condición de Pista / Clima' : 'Track Condition / Weather'}>
          {weather.rainfall ? (
            <>
              <CloudRain className="w-3.5 h-3.5 text-[#00AEEF] animate-pulse" />
              <span className="text-zinc-400 text-[10px] sm:text-[11px]">{t.live.weather.weather}</span>
              <span className="font-bold text-[#00AEEF] tabular-nums">
                {t.live.weather.rain}
              </span>
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5 text-[#FFD60A]" />
              <span className="text-zinc-400 text-[10px] sm:text-[11px]">{t.live.weather.weather}</span>
              <span className="font-bold text-zinc-100 tabular-nums">
                {t.live.weather.dryTrack}
              </span>
            </>
          )}
        </div>

        <span className="text-white/20 select-none hidden sm:inline">•</span>

        {/* 5. Wind */}
        <div className="flex items-center gap-1.5 whitespace-nowrap" title={lang === 'es' ? 'Velocidad del Viento' : 'Wind Speed'}>
          <Wind className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-zinc-400 text-[10px] sm:text-[11px]">{t.live.weather.wind}</span>
          <span className="font-bold text-zinc-100 tabular-nums">
            {weather.windSpeed !== undefined ? `${weather.windSpeed.toFixed(1)} m/s` : '-- m/s'}
          </span>
        </div>
      </div>
    </div>
  );
};
