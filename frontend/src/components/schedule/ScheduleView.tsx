import React, { useEffect, useState } from 'react';
import { Calendar, CheckCircle2, ChevronDown, ChevronUp, Clock, MapPin } from 'lucide-react';
import { fetchSchedule } from '../../services/api';
import type { JolpicaRace } from '../../types/f1';

export const ScheduleView: React.FC = () => {
  const [races, setRaces] = useState<JolpicaRace[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedRound, setExpandedRound] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const [now] = useState<number>(() => Date.now());

  useEffect(() => {
    fetchSchedule().then((data) => {
      setRaces(data);
      setLoading(false);
      const nextRace = data.find((r) => r.isNext);
      if (nextRace) {
        setExpandedRound(nextRace.round);
      }
    });
  }, []);

  const nextRace = races.find((r) => r.isNext);

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
      <div className="bg-[#131722] border border-white/[0.08] rounded-xl p-12 text-center text-zinc-400 font-mono text-xs">
        <Calendar className="w-6 h-6 text-zinc-400 mx-auto mb-2 animate-pulse" />
        <span>SINCRONIZANDO CALENDARIO OFICIAL...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Next GP Hero Countdown Card */}
      {nextRace && (
        <div className="bg-[#131722] border border-white/[0.08] border-t-2 border-t-[#E10600] rounded-xl p-4 sm:p-5 relative shadow-sm">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#E10600]/15 text-[#E10600] border border-[#E10600]/30 tracking-widest">
              PRÓXIMO GP • ROUND {nextRace.round}
            </span>
            <span className="text-[11px] text-zinc-400 font-mono">
              HORA LOCAL ({Intl.DateTimeFormat().resolvedOptions().timeZone})
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
            {nextRace.raceName}
          </h2>
          <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1 font-mono">
            <MapPin className="w-3.5 h-3.5 text-[#E10600]" />
            <span>{nextRace.circuitName.toUpperCase()}</span>
            <span>•</span>
            <span>{nextRace.locality.toUpperCase()}, {nextRace.country.toUpperCase()}</span>
          </div>

          {/* Countdown Clock Digital Boxes */}
          {timeLeft && (
            <div className="grid grid-cols-4 gap-2 mt-4 max-w-sm">
              <div className="bg-[#0B0E14] border border-white/[0.08] rounded-lg p-2 text-center">
                <span className="text-lg sm:text-2xl font-bold text-white font-mono tabular-nums">
                  {timeLeft.days}
                </span>
                <span className="text-[9px] text-zinc-400 uppercase tracking-wider block font-mono">
                  DÍAS
                </span>
              </div>
              <div className="bg-[#0B0E14] border border-white/[0.08] rounded-lg p-2 text-center">
                <span className="text-lg sm:text-2xl font-bold text-white font-mono tabular-nums">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[9px] text-zinc-400 uppercase tracking-wider block font-mono">
                  HS
                </span>
              </div>
              <div className="bg-[#0B0E14] border border-white/[0.08] rounded-lg p-2 text-center">
                <span className="text-lg sm:text-2xl font-bold text-white font-mono tabular-nums">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[9px] text-zinc-400 uppercase tracking-wider block font-mono">
                  MIN
                </span>
              </div>
              <div className="bg-[#0B0E14] border border-white/[0.08] rounded-lg p-2 text-center">
                <span className="text-lg sm:text-2xl font-bold text-[#E10600] font-mono tabular-nums">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[9px] text-zinc-400 uppercase tracking-wider block font-mono">
                  SEG
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Season Races List */}
      <div className="bg-[#131722] border border-white/[0.08] rounded-xl overflow-hidden shadow-sm">
        <div className="px-4 py-2.5 bg-[#131722] border-b border-white/[0.08] flex items-center justify-between text-xs font-mono font-bold text-zinc-400">
          <div className="flex items-center gap-2 tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-[#E10600]" />
            <span>CALENDARIO DE LA TEMPORADA</span>
          </div>
          <span className="text-[10px] text-zinc-400 font-mono tracking-widest">
            {races.length} RONDAS
          </span>
        </div>

        <div className="divide-y divide-white/[0.08]">
          {races.map((r) => {
            const isExpanded = expandedRound === r.round;
            const isPast = new Date(r.raceDateTime).getTime() < now;

            return (
              <div key={r.round} className="flex flex-col">
                <button
                  type="button"
                  onClick={() => toggleRound(r.round)}
                  className={`w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors select-none ${
                    r.isNext ? 'bg-[#E10600]/[0.04]' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-zinc-400 w-7 text-center tabular-nums">
                      R{String(r.round).padStart(2, '0')}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-white tracking-tight uppercase">
                          {r.raceName}
                        </span>
                        {r.isNext && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-[#E10600]/20 text-[#E10600] border border-[#E10600]/30">
                            PRÓXIMO
                          </span>
                        )}
                        {isPast && (
                          <span className="inline-flex items-center gap-1 text-[9px] text-zinc-400 font-mono">
                            <CheckCircle2 className="w-3 h-3 text-[#39B54A]" /> FINALIZADO
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-zinc-400 font-mono">
                        {r.circuitName} • {r.country}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-zinc-400 tabular-nums hidden sm:inline">
                      {formatLocalDate(r.raceDateTime)}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5 text-zinc-400" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                    )}
                  </div>
                </button>

                {/* Session Details */}
                {isExpanded && r.sessions && r.sessions.length > 0 && (
                  <div className="bg-[#0B0E14] border-t border-white/[0.08] px-4 py-3">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-[#E10600]" /> HORARIOS DE SESIÓN (HORA LOCAL)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {r.sessions.map((s, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-2 rounded-lg border text-xs font-mono ${
                            s.name === 'Carrera'
                              ? 'bg-[#1C2230] border-l-2 border-l-[#E10600] border-t border-b border-r border-white/[0.08] text-white font-bold'
                              : 'bg-[#131722] border border-white/[0.08] text-zinc-400'
                          }`}
                        >
                          <span className="font-semibold uppercase">{s.name}</span>
                          <div className="flex items-center gap-2 tabular-nums">
                            <span className="text-zinc-400 text-[11px]">
                              {formatLocalDate(s.dateTime)}
                            </span>
                            <span className="font-bold text-white bg-[#0B0E14] border border-white/[0.08] px-1.5 py-0.5 rounded-md">
                              {formatLocalTime(s.dateTime)} HS
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
