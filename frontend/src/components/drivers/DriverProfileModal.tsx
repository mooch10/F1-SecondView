import React, { useEffect, useState } from 'react';
import { Award, Calendar, MapPin, Star, Swords, Trophy, X } from 'lucide-react';
import { calculateAge, enrichDriverProfileWithSeason, type F1DriverProfile } from '../../data/f1DriversData';
import { fetchStandings } from '../../services/api';
import type { StandingsData } from '../../types/f1';

interface DriverProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: F1DriverProfile | null;
  onTogglePin?: (driverNumber: number) => void;
  isPinned?: boolean;
  onCompare?: (driverNumber: number) => void;
}

export const DriverProfileModal: React.FC<DriverProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onTogglePin,
  isPinned = false,
  onCompare,
}) => {
  const [failedImageNumber, setFailedImageNumber] = useState<number | null>(null);
  const [standings, setStandings] = useState<StandingsData | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchStandings('f1').then((res) => {
        if (res) setStandings(res);
      });
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !profile) return null;

  const matchingStanding = standings?.drivers.find(
    (s) =>
      s.code.toUpperCase() === profile.code.toUpperCase() ||
      s.name.toLowerCase().includes(profile.lastName.toLowerCase()),
  );

  const activeProfile = enrichDriverProfileWithSeason(profile, matchingStanding);
  const age = calculateAge(activeProfile.birthDate);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 select-none">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Cerrar modal"
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 w-full h-full cursor-pointer"
      />

      {/* Sheet / Modal Container */}
      <div className="relative z-10 w-full max-w-lg bg-[#0E121A] border-t sm:border border-white/15 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200">
        {/* Mobile Pull Handle Indicator */}
        <div className="sm:hidden w-full flex justify-center pt-2.5 pb-1">
          <div className="w-12 h-1.5 rounded-full bg-white/20" />
        </div>

        {/* Top Header with Team Color Accent */}
        <div
          className="relative px-5 pt-4 pb-6 overflow-hidden flex items-center justify-between"
          style={{
            background: `linear-gradient(135deg, ${activeProfile.teamColor}25 0%, #0E121A 85%)`,
          }}
        >
          {/* Background Team Color Glow */}
          <div
            className="absolute -top-10 -left-10 w-40 h-40 rounded-full blur-3xl opacity-30 pointer-events-none"
            style={{ backgroundColor: activeProfile.teamColor }}
          />

          {/* Team and Number Tag */}
          <div className="flex items-center gap-2.5 z-10">
            <span
              className="text-xs font-mono font-black uppercase px-2.5 py-1 rounded-md text-white border shadow-sm"
              style={{
                backgroundColor: activeProfile.teamColor,
                borderColor: `${activeProfile.teamColor}80`,
              }}
            >
              {activeProfile.team}
            </span>
            <span className="text-xs font-mono text-zinc-400 font-bold">FÓRMULA 1</span>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer z-10"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-5 pb-6 space-y-5 -mt-3">
          {/* Driver Portrait & Headline */}
          <div className="flex items-center gap-4">
            {/* Driver Headshot with Team Halo */}
            <div className="relative shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#141924] border-2 border-white/15 overflow-hidden flex items-center justify-center shadow-lg">
              {/* Subtle radial team glow behind portrait */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${activeProfile.teamColor} 0%, transparent 70%)`,
                }}
              />

              {failedImageNumber !== activeProfile.number ? (
                <img
                  src={activeProfile.headshotUrl}
                  alt={activeProfile.fullName}
                  loading="lazy"
                  onError={() => setFailedImageNumber(activeProfile.number)}
                  className="w-full h-full object-cover object-top scale-110 drop-shadow-md"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-2">
                  <span
                    className="font-chakra font-black text-3xl italic"
                    style={{ color: activeProfile.teamColor }}
                  >
                    #{activeProfile.number}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 mt-0.5">
                    {activeProfile.code}
                  </span>
                </div>
              )}
            </div>

            {/* Name, Code & Number */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-2xl" role="img" aria-label={activeProfile.nationality}>
                  {activeProfile.flag}
                </span>
                <span className="text-xs font-mono font-bold tracking-widest text-zinc-400 uppercase">
                  {activeProfile.code} • #{activeProfile.number}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black italic tracking-tight text-white uppercase font-sans truncate mt-0.5">
                {activeProfile.fullName}
              </h2>

              <p className="text-xs font-mono text-zinc-400 mt-1 flex items-center gap-1.5">
                <span className="text-zinc-200">{activeProfile.nationality}</span>
                <span>•</span>
                <span>{age} años</span>
              </p>
            </div>
          </div>

          {/* Personal Info Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-[#131722] border border-white/[0.08] rounded-xl p-2.5 sm:p-3 flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase text-zinc-500 font-bold block">
                  Lugar de Nacimiento
                </span>
                <span className="text-zinc-200 block font-medium mt-0.5 text-xs line-clamp-2 leading-tight">
                  {activeProfile.birthPlace}
                </span>
              </div>
            </div>

            <div className="bg-[#131722] border border-white/[0.08] rounded-xl p-2.5 sm:p-3 flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase text-zinc-500 font-bold block">
                  Fecha de Nacimiento
                </span>
                <div className="mt-0.5">
                  <span className="text-zinc-200 font-medium text-xs">
                    {activeProfile.birthDate}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Live 2026 Championship Status Banner */}
          {matchingStanding && (
            <div className="bg-[#131722] border border-white/[0.08] rounded-xl p-3 flex items-center justify-between font-mono shadow-sm">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded shrink-0">
                  TEMPORADA 2026
                </span>
                <span className="text-xs text-zinc-300 font-bold truncate">
                  {matchingStanding.team}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold shrink-0">
                <span className="text-white">P{matchingStanding.pos}</span>
                <span className="text-zinc-500">•</span>
                <span className="text-[#FFD60A]">{matchingStanding.points} PTS</span>
                {matchingStanding.wins > 0 && (
                  <>
                    <span className="text-zinc-500">•</span>
                    <span className="text-emerald-400">{matchingStanding.wins} {matchingStanding.wins === 1 ? 'VICT.' : 'VICT.'}</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Career Stats Grid */}
          <div className="bg-[#131722] border border-white/[0.08] rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#FFD60A]" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200">
                  Estadísticas en Fórmula 1
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">HISTORIAL</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center font-mono">
              <div className="bg-white/[0.03] rounded-lg p-2 border border-white/[0.04]">
                <span className="text-xs sm:text-sm font-black text-white block">
                  {activeProfile.careerStats.grandsPrix}
                </span>
                <span className="text-[9px] uppercase text-zinc-400 tracking-wider">
                  Grandes Premios
                </span>
              </div>

              <div className="bg-white/[0.03] rounded-lg p-2 border border-white/[0.04]">
                <span className="text-xs sm:text-sm font-black text-[#FFD60A] block">
                  {activeProfile.careerStats.podiums}
                </span>
                <span className="text-[9px] uppercase text-zinc-400 tracking-wider">
                  Podios
                </span>
              </div>

              <div className="bg-white/[0.03] rounded-lg p-2 border border-white/[0.04]">
                <span className="text-xs sm:text-sm font-black text-emerald-400 block">
                  {activeProfile.careerStats.victories}
                </span>
                <span className="text-[9px] uppercase text-zinc-400 tracking-wider">
                  Victorias
                </span>
              </div>

              <div className="bg-white/[0.03] rounded-lg p-2 border border-white/[0.04]">
                <span className="text-xs sm:text-sm font-black text-white block">
                  {activeProfile.careerStats.worldChampionships > 0
                    ? `${activeProfile.careerStats.worldChampionships} 🏆`
                    : '0'}
                </span>
                <span className="text-[9px] uppercase text-zinc-400 tracking-wider">
                  Campeonatos
                </span>
              </div>

              <div className="bg-white/[0.03] rounded-lg p-2 border border-white/[0.04] col-span-2 flex flex-col justify-center">
                <span className="text-xs font-bold text-zinc-200 block truncate">
                  {activeProfile.careerStats.highestFinish}
                </span>
                <span className="text-[9px] uppercase text-zinc-400 tracking-wider">
                  Mejor Resultado
                </span>
              </div>
            </div>
          </div>

          {/* Biography */}
          <div className="bg-[#131722] border border-white/[0.08] rounded-xl p-3.5 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-zinc-300">
              <Award className="w-3.5 h-3.5 text-zinc-400" />
              <span>Biografía & Trayectoria</span>
            </div>
            <p className="text-xs text-zinc-300 font-sans leading-relaxed text-justify">
              {activeProfile.biography}
            </p>
          </div>

          {/* Quick Actions (Pin as My Driver / Compare 1 vs 1) */}
          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            {onTogglePin && (
              <button
                type="button"
                onClick={() => onTogglePin(activeProfile.number)}
                className={`flex-1 py-2.5 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border transition-all cursor-pointer active:scale-98 ${
                  isPinned
                    ? 'bg-[#FFD60A] text-black border-[#FFD60A] shadow-[0_0_15px_rgba(255,214,10,0.3)]'
                    : 'bg-white/[0.06] hover:bg-white/10 text-white border-white/15'
                }`}
              >
                <Star
                  className={`w-4 h-4 ${
                    isPinned ? 'fill-black text-black' : 'text-[#FFD60A]'
                  }`}
                />
                <span>{isPinned ? 'PILOTO FIJADO ⭐' : 'FIJAR COMO TU PILOTO'}</span>
              </button>
            )}

            {onCompare && (
              <button
                type="button"
                onClick={() => onCompare(activeProfile.number)}
                className="py-2.5 px-4 rounded-xl bg-white/[0.06] hover:bg-white/10 text-white border border-white/15 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer active:scale-98"
              >
                <Swords className="w-4 h-4 text-zinc-300" />
                <span>COMPARAR 1 VS 1</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
