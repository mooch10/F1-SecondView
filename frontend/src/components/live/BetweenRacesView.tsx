import React, { useEffect, useState } from 'react';
import {
  ChevronRight,
  Clock,
  Flag,
  MapPin,
  Radio,
  Trophy,
} from 'lucide-react';
import { fetchScheduleDetails } from '../../services/api';
import type { JolpicaRace, LastRacePodium } from '../../types/f1';
import { useLanguage } from '../../hooks/useLanguage';

interface BetweenRacesViewProps {
  onSwitchToLiveTiming?: () => void;
}

export const BetweenRacesView: React.FC<BetweenRacesViewProps> = ({
  onSwitchToLiveTiming,
}) => {
  const { lang, t } = useLanguage();
  const [nextRace, setNextRace] = useState<JolpicaRace | null>(null);
  const [lastRace, setLastRace] = useState<LastRacePodium | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    fetchScheduleDetails().then((data) => {
      if (data) {
        const next = data.races.find((r) => r.isNext) || data.races[0] || null;
        setNextRace(next);
        setLastRace(data.lastRace || null);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!nextRace?.raceDateTime) return;
    const target = new Date(nextRace.raceDateTime).getTime();

    const updateTimer = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [nextRace]);

  const formatLocalDate = (dateStr: string) => {
    if (!dateStr) return t.betweenRaces.toConfirm;
    try {
      const d = new Date(dateStr);
      if (Number.isNaN(d.getTime())) return t.betweenRaces.toConfirm;
      return d.toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
      });
    } catch {
      return t.betweenRaces.toConfirm;
    }
  };

  const formatLocalTime = (dateStr: string) => {
    if (!dateStr) return null;
    try {
      const d = new Date(dateStr);
      if (Number.isNaN(d.getTime())) return null;
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return null;
    }
  };

  const translateSessionName = (name: string) => {
    if (lang === 'es') return name;
    const map: Record<string, string> = {
      'Carrera': 'Race',
      'Clasificación': 'Qualifying',
      'Práctica 1': 'Practice 1',
      'Práctica 2': 'Practice 2',
      'Práctica 3': 'Practice 3',
      'Sprint': 'Sprint',
      'Clasificación Sprint': 'Sprint Shootout',
    };
    return map[name] || name;
  };

  if (loading) {
    return (
      <div className="bg-[#131722] border border-white/[0.08] rounded-xl p-12 text-center text-zinc-400 font-mono text-xs">
        <span>{lang === 'es' ? 'SINTONIZANDO DATOS DEL CAMPEONATO...' : 'TUNING CHAMPIONSHIP DATA...'}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Standby Status Bar */}
      <div className="bg-[#131722] border border-white/[0.08] border-l-4 border-l-zinc-500 rounded-xl px-3 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono shadow-sm">
        <div className="flex items-center gap-2 text-zinc-400 min-w-0">
          <Flag className="w-4 h-4 text-zinc-400 shrink-0" />
          <span className="font-semibold uppercase tracking-wider text-[10px] sm:text-xs truncate">
            {lang === 'es'
              ? 'MODO ENTRE CARRERAS • SIN ACTIVIDAD EN PISTA'
              : 'BETWEEN RACES MODE • NO ACTIVE TRACK SESSION'}
          </span>
        </div>
        <button
          type="button"
          onClick={onSwitchToLiveTiming}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg bg-[#E10600]/15 hover:bg-[#E10600]/25 text-[#E10600] font-bold text-[10px] border border-[#E10600]/30 transition-colors uppercase cursor-pointer w-full sm:w-auto shrink-0"
        >
          <Radio className="w-3 h-3 text-[#E10600] animate-pulse" />
          <span>{lang === 'es' ? 'Ver Telemetría / Replay' : 'View Telemetry / Replay'}</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Next GP Countdown Hero Card */}
      {nextRace && (
        <div className="bg-[#131722] border border-white/[0.08] border-t-2 border-t-[#E10600] rounded-xl p-4 sm:p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#E10600]/15 text-[#E10600] border border-[#E10600]/30 tracking-widest w-fit">
              {t.betweenRaces.nextGp} • {t.betweenRaces.round} {nextRace.round}
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">
              {t.betweenRaces.localTime} (Argentina)
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
            {nextRace.raceName}
          </h2>
          <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1 font-mono">
            <MapPin className="w-3.5 h-3.5 text-[#E10600]" />
            <span>{nextRace.circuitName.toUpperCase()}</span>
            <span>•</span>
            <span>
              {nextRace.locality.toUpperCase()}, {nextRace.country.toUpperCase()}
            </span>
          </div>

          {/* Countdown Clock Digital Boxes */}
          {timeLeft && (
            <div className="grid grid-cols-4 gap-2 mt-4 max-w-sm">
              <div className="bg-[#0B0E14] border border-white/[0.08] rounded-lg p-2 text-center">
                <span className="text-xl sm:text-2xl font-bold text-white font-mono tabular-nums">
                  {timeLeft.days}
                </span>
                <span className="text-[9px] text-zinc-400 uppercase tracking-wider block font-mono">
                  {t.betweenRaces.countdown.days}
                </span>
              </div>
              <div className="bg-[#0B0E14] border border-white/[0.08] rounded-lg p-2 text-center">
                <span className="text-xl sm:text-2xl font-bold text-white font-mono tabular-nums">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[9px] text-zinc-400 uppercase tracking-wider block font-mono">
                  {t.betweenRaces.countdown.hours}
                </span>
              </div>
              <div className="bg-[#0B0E14] border border-white/[0.08] rounded-lg p-2 text-center">
                <span className="text-xl sm:text-2xl font-bold text-white font-mono tabular-nums">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[9px] text-zinc-400 uppercase tracking-wider block font-mono">
                  {t.betweenRaces.countdown.minutes}
                </span>
              </div>
              <div className="bg-[#0B0E14] border border-white/[0.08] rounded-lg p-2 text-center">
                <span className="text-xl sm:text-2xl font-bold text-[#E10600] font-mono tabular-nums">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[9px] text-zinc-400 uppercase tracking-wider block font-mono">
                  {t.betweenRaces.countdown.seconds}
                </span>
              </div>
            </div>
          )}

          {/* Weekend Sessions Preview */}
          {nextRace.sessions && nextRace.sessions.length > 0 && (
            <div className="mt-4 pt-3 border-t border-white/[0.08]">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-[#E10600]" /> {t.betweenRaces.weekendSchedule}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {nextRace.sessions.map((s, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-2 rounded-lg border text-xs font-mono gap-2 ${
                      s.name === 'Carrera'
                        ? 'bg-[#1C2230] border-l-2 border-l-[#E10600] border-t border-b border-r border-white/[0.08] text-white font-bold'
                        : 'bg-[#0B0E14] border border-white/[0.08] text-zinc-400'
                    }`}
                  >
                    <span className="font-semibold uppercase truncate">{translateSessionName(s.name)}</span>
                    <div className="flex items-center gap-1.5 sm:gap-2 tabular-nums shrink-0">
                      <span className="text-zinc-400 text-[10px] sm:text-[11px] whitespace-nowrap">
                        {formatLocalDate(s.dateTime)}
                      </span>
                      <span className="font-bold text-white bg-[#131722] border border-white/[0.08] px-1.5 py-0.5 rounded-md whitespace-nowrap text-[10px] sm:text-xs">
                        {formatLocalTime(s.dateTime)} HS
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Last Race Podium Summary Card */}
      {lastRace && (
        <div className="bg-[#131722] border border-white/[0.08] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-400">
              <Trophy className="w-4 h-4 text-[#FFD60A]" />
              <span className="tracking-wider uppercase">
                {t.betweenRaces.lastPodium} • {lastRace.raceName}
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono">
              {t.betweenRaces.round} {lastRace.round}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {lastRace.podium.map((p) => {
              const medalColor =
                p.position === 1
                  ? 'border-[#FFD60A] text-[#FFD60A]'
                  : p.position === 2
                    ? 'border-[#C0C0C0] text-[#C0C0C0]'
                    : 'border-[#CD7F32] text-[#CD7F32]';

              return (
                <div
                  key={p.position}
                  className="bg-[#0B0E14] border border-white/[0.08] rounded-lg p-2.5 flex items-center justify-between font-mono"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center font-black text-xs ${medalColor}`}
                    >
                      {p.position}
                    </span>
                    <div className="flex flex-col leading-tight">
                      <span className="font-bold text-xs text-white">
                        {p.code}
                      </span>
                      <span className="text-[10px] text-zinc-400 truncate max-w-[110px]">
                        {p.teamName}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-zinc-400 tabular-nums font-semibold">
                    {p.timeOrStatus}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
