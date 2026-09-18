import React, { useEffect, useState } from 'react';
import {
  ChevronRight,
  Clock,
  Flag,
  Layers,
  MapPin,
  Radio,
  Swords,
  Trophy,
} from 'lucide-react';
import { fetchScheduleDetails } from '../../services/api';
import type { JolpicaRace, LastRacePodium } from '../../types/f1';
import { useLanguage } from '../../hooks/useLanguage';
import { translateSessionName } from '../../utils/sessionTranslation';
import { useTimezone } from '../../hooks/useTimezone';
import { TrackTimeToggle } from '../common/TrackTimeToggle';
import { CircuitProfileModal } from '../schedule/CircuitProfileModal';

interface BetweenRacesViewProps {
  onSwitchToLiveTiming?: () => void;
  onOpenH2H?: () => void;
}

export const BetweenRacesView: React.FC<BetweenRacesViewProps> = ({
  onSwitchToLiveTiming,
  onOpenH2H,
}) => {
  const { lang, t } = useLanguage();
  const { mode, setTrackCircuit, formatSessionDate, formatSessionTime } = useTimezone();
  const [nextRace, setNextRace] = useState<JolpicaRace | null>(null);
  const [lastRace, setLastRace] = useState<LastRacePodium | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCircuitModalOpen, setIsCircuitModalOpen] = useState(false);
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
    if (nextRace) {
      setTrackCircuit(nextRace.circuitName, nextRace.locality, nextRace.country);
    }
  }, [nextRace, setTrackCircuit]);

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
      return formatSessionDate(dateStr, lang);
    } catch {
      return dateStr.split('T')[0] || t.betweenRaces.toConfirm;
    }
  };

  const formatLocalTime = (dateStr: string) => {
    return formatSessionTime(dateStr);
  };

  const translateSession = (name: string) => translateSessionName(name, lang);

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
          <span className="font-semibold uppercase tracking-wider text-[10px] sm:text-xs leading-tight">
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div className="flex items-center justify-between gap-2 w-full sm:w-auto">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#E10600]/15 text-[#E10600] border border-[#E10600]/30 tracking-widest w-fit whitespace-nowrap shrink-0">
                {t.betweenRaces.nextGp} • {t.betweenRaces.round} {nextRace.round}
              </span>
              <div className="sm:hidden shrink-0">
                <TrackTimeToggle />
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 self-start sm:self-auto shrink-0">
              {onOpenH2H && (
                <button
                  type="button"
                  onClick={onOpenH2H}
                  className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-[11px] sm:text-xs font-mono font-semibold text-amber-300 hover:text-amber-200 transition-colors cursor-pointer shrink-0"
                  title={lang === 'es' ? 'Comparador 1 vs 1 y Telemetría' : '1 vs 1 Comparator & Telemetry'}
                >
                  <Swords className="w-3.5 h-3.5" />
                  <span>1 vs 1</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsCircuitModalOpen(true)}
                className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-[11px] sm:text-xs font-mono font-semibold text-zinc-300 hover:text-white transition-colors cursor-pointer shrink-0"
                title={lang === 'es' ? 'Ver Ficha Técnica del Circuito' : 'View Track Intel'}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{lang === 'es' ? 'Ficha Técnica' : 'Track Intel'}</span>
              </button>
            </div>
          </div>

          <h2 className="text-sm sm:text-2xl font-black text-white tracking-tight uppercase">
            {nextRace.raceName}
          </h2>
          <div className="flex items-center justify-between mt-1 flex-wrap gap-2">
            <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
              <MapPin className="w-3.5 h-3.5 text-[#E10600]" />
              <span>{nextRace.circuitName.toUpperCase()}</span>
              <span>•</span>
              <span>
                {nextRace.locality.toUpperCase()}, {nextRace.country.toUpperCase()}
              </span>
            </div>
            <span className="text-[11px] text-zinc-400 font-mono">
              {mode === 'track'
                ? `⚡ ${lang === 'es' ? 'Horario circuito' : 'Track time'}: ${nextRace.locality}`
                : `📍 ${lang === 'es' ? 'Horario dispositivo' : 'Device time'}`}
            </span>
          </div>

          {/* Countdown Clock Digital Boxes */}
          {timeLeft && (
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mt-3 sm:mt-4 max-w-xs sm:max-w-sm">
              <div className="bg-[#0B0E14] border border-white/[0.08] rounded-lg p-1.5 sm:p-2 text-center">
                <span className="text-base sm:text-2xl font-bold text-white font-mono tabular-nums">
                  {timeLeft.days}
                </span>
                <span className="text-[8px] sm:text-[9px] text-zinc-400 uppercase tracking-wider block font-mono">
                  {t.betweenRaces.countdown.days}
                </span>
              </div>
              <div className="bg-[#0B0E14] border border-white/[0.08] rounded-lg p-1.5 sm:p-2 text-center">
                <span className="text-base sm:text-2xl font-bold text-white font-mono tabular-nums">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[8px] sm:text-[9px] text-zinc-400 uppercase tracking-wider block font-mono">
                  {t.betweenRaces.countdown.hours}
                </span>
              </div>
              <div className="bg-[#0B0E14] border border-white/[0.08] rounded-lg p-1.5 sm:p-2 text-center">
                <span className="text-base sm:text-2xl font-bold text-white font-mono tabular-nums">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[8px] sm:text-[9px] text-zinc-400 uppercase tracking-wider block font-mono">
                  {t.betweenRaces.countdown.minutes}
                </span>
              </div>
              <div className="bg-[#0B0E14] border border-white/[0.08] rounded-lg p-1.5 sm:p-2 text-center">
                <span className="text-base sm:text-2xl font-bold text-[#E10600] font-mono tabular-nums">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[8px] sm:text-[9px] text-zinc-400 uppercase tracking-wider block font-mono">
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
                    className={`flex items-center justify-between p-1.5 sm:p-2 rounded-lg border text-[11px] sm:text-xs font-mono gap-1.5 sm:gap-2 ${
                      s.name.toLowerCase().includes('carrera') || s.name.toLowerCase().includes('race')
                        ? 'bg-[#1C2230] border-l-2 border-l-[#E10600] border-t border-b border-r border-white/[0.08] text-white font-bold'
                        : 'bg-[#0B0E14] border border-white/[0.08] text-zinc-400'
                    }`}
                  >
                    <span className="font-semibold uppercase truncate">{translateSession(s.name)}</span>
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
          <div className="flex items-center justify-between gap-2 mb-3 min-w-0">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-400 min-w-0">
              <Trophy className="w-4 h-4 text-[#FFD60A] shrink-0" />
              <span className="tracking-wider uppercase truncate">
                <span className="sm:hidden">{lastRace.raceName}</span>
                <span className="hidden sm:inline">{t.betweenRaces.lastPodium} • {lastRace.raceName}</span>
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono shrink-0 whitespace-nowrap">
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
                      <span className="text-[10px] text-zinc-400 break-words leading-tight">
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

      {/* Circuit Technical Profile Modal */}
      {nextRace && (
        <CircuitProfileModal
          isOpen={isCircuitModalOpen}
          onClose={() => setIsCircuitModalOpen(false)}
          circuitIdOrName={nextRace.circuitName || nextRace.country}
        />
      )}
    </div>
  );
};
