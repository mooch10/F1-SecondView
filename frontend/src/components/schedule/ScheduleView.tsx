import React, { useEffect, useState } from 'react';
import { Calendar, CheckCircle2, ChevronDown, ChevronUp, Clock, MapPin } from 'lucide-react';
import { fetchSchedule } from '../../services/api';
import type { JolpicaRace } from '../../types/f1';

export const ScheduleView: React.FC = () => {
  const [races, setRaces] = useState<JolpicaRace[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedRound, setExpandedRound] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    fetchSchedule().then((data) => {
      setRaces(data);
      setLoading(false);
      // Automatically expand the next race
      const nextRace = data.find((r) => r.isNext);
      if (nextRace) {
        setExpandedRound(nextRace.round);
      }
    });
  }, []);

  const nextRace = races.find((r) => r.isNext);

  // Live countdown timer for the next race
  useEffect(() => {
    if (!nextRace?.raceDateTime) return;

    const targetDate = new Date(nextRace.raceDateTime).getTime();

    const updateCountdown = () => {
      const now = Date.now();
      const diff = targetDate - now;

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

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [nextRace]);

  const toggleRound = (round: number) => {
    setExpandedRound((prev) => (prev === round ? null : round));
  };

  const formatLocalDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
      });
    } catch {
      return dateStr;
    }
  };

  const formatLocalTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  if (loading) {
    return (
      <div className="bg-[#131722] border border-white/[0.08] rounded-xl p-12 text-center text-zinc-500">
        <Calendar className="w-8 h-8 text-zinc-600 mx-auto mb-2 animate-spin" />
        <span className="text-xs">Cargando calendario de la temporada...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Next GP Hero Countdown Card */}
      {nextRace && (
        <div className="bg-gradient-to-br from-[#131722] to-[#1C2230] border border-[#27F4D2]/30 rounded-xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#27F4D2]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black uppercase bg-[#27F4D2]/15 text-[#27F4D2] border border-[#27F4D2]/30 tracking-wider">
              PRÓXIMO GRAN PREMIO • R{nextRace.round}
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              Hora local ({Intl.DateTimeFormat().resolvedOptions().timeZone})
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {nextRace.raceName}
          </h2>
          <div className="flex items-center gap-2 text-xs text-zinc-300 mt-1">
            <MapPin className="w-3.5 h-3.5 text-[#E10600]" />
            <span>{nextRace.circuitName}</span>
            <span>•</span>
            <span>{nextRace.locality}, {nextRace.country}</span>
          </div>

          {/* Countdown Clock */}
          {timeLeft && (
            <div className="grid grid-cols-4 gap-2 mt-4 max-w-sm">
              <div className="bg-[#0B0E14]/80 border border-white/[0.08] rounded-lg p-2 text-center">
                <span className="text-lg sm:text-2xl font-black text-white font-mono font-tabular">
                  {timeLeft.days}
                </span>
                <span className="text-[9px] text-zinc-500 uppercase tracking-wider block font-sans">
                  DÍAS
                </span>
              </div>
              <div className="bg-[#0B0E14]/80 border border-white/[0.08] rounded-lg p-2 text-center">
                <span className="text-lg sm:text-2xl font-black text-white font-mono font-tabular">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[9px] text-zinc-500 uppercase tracking-wider block font-sans">
                  HS
                </span>
              </div>
              <div className="bg-[#0B0E14]/80 border border-white/[0.08] rounded-lg p-2 text-center">
                <span className="text-lg sm:text-2xl font-black text-white font-mono font-tabular">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[9px] text-zinc-500 uppercase tracking-wider block font-sans">
                  MIN
                </span>
              </div>
              <div className="bg-[#0B0E14]/80 border border-white/[0.08] rounded-lg p-2 text-center">
                <span className="text-lg sm:text-2xl font-black text-[#27F4D2] font-mono font-tabular">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[9px] text-zinc-500 uppercase tracking-wider block font-sans">
                  SEG
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Season Races List (Promiedos Calendar Style) */}
      <div className="bg-[#131722] border border-white/[0.08] rounded-xl overflow-hidden shadow-sm">
        <div className="px-4 py-2.5 bg-[#1C2230] border-b border-white/[0.08] flex items-center justify-between text-xs font-bold text-zinc-300">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#27F4D2]" />
            <span>CALENDARIO DE CARRERAS</span>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">
            {races.length} RONDAS
          </span>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {races.map((r) => {
            const isExpanded = expandedRound === r.round;
            const isPast = new Date(r.raceDateTime).getTime() < Date.now();

            return (
              <div key={r.round} className="flex flex-col">
                <button
                  type="button"
                  onClick={() => toggleRound(r.round)}
                  className={`w-full px-3.5 py-3 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors ${
                    r.isNext ? 'bg-[#27F4D2]/[0.03]' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-black text-zinc-500 w-6 text-center font-tabular">
                      R{r.round}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white tracking-tight">
                          {r.raceName}
                        </span>
                        {r.isNext && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-[#27F4D2]/20 text-[#27F4D2] border border-[#27F4D2]/30">
                            Próximo
                          </span>
                        )}
                        {isPast && (
                          <span className="inline-flex items-center gap-1 text-[9px] text-zinc-500 font-medium">
                            <CheckCircle2 className="w-3 h-3 text-zinc-600" /> Finalizado
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-zinc-400">
                        {r.circuitName} • {r.country}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-zinc-300 font-semibold hidden sm:inline">
                      {formatLocalDate(r.raceDateTime)}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-zinc-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-zinc-400" />
                    )}
                  </div>
                </button>

                {/* Session details (Local Timetable) */}
                {isExpanded && r.sessions && r.sessions.length > 0 && (
                  <div className="bg-[#0B0E14] border-t border-white/[0.06] px-4 py-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2 block font-mono flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> Cronograma de Sesiones (Hora Local)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {r.sessions.map((s, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-2 rounded-lg border text-xs font-mono ${
                            s.name === 'Carrera'
                              ? 'bg-[#E10600]/10 border-[#E10600]/30 text-white font-bold'
                              : 'bg-[#131722] border-white/[0.06] text-zinc-300'
                          }`}
                        >
                          <span className="font-sans font-semibold">{s.name}</span>
                          <div className="flex items-center gap-2 font-tabular">
                            <span className="text-zinc-400 text-[11px]">
                              {formatLocalDate(s.dateTime)}
                            </span>
                            <span className="font-bold text-white bg-black/40 px-1.5 py-0.5 rounded">
                              {formatLocalTime(s.dateTime)} hs
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
