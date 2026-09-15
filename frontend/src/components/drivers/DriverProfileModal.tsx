import React, { useEffect, useState } from 'react';
import { Award, Calendar, MapPin, Star, Swords, Trophy, X } from 'lucide-react';
import { calculateAge, enrichDriverProfileWithSeason, type F1DriverProfile } from '../../data/f1DriversData';
import { fetchStandings } from '../../services/api';
import type { StandingsData } from '../../types/f1';
import { useLanguage } from '../../hooks/useLanguage';

interface DriverProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: F1DriverProfile | null;
  onTogglePin?: (driverNumber: number) => void;
  isPinned?: boolean;
  onCompare?: (driverNumber: number) => void;
}

const F1_BIOS_EN: Record<string, string> = {
  COL: 'Young Argentine sensation who took Formula 1 by storm and secured the official full-time seat at Alpine F1 Team for 2026. Renowned for fearless racecraft, aggressive overtaking, and restoring Argentina to the highest level of motorsport.',
  VER: 'Four-time Formula 1 World Champion celebrated for ruthless consistency, exceptional tire preservation, and dominating race execution with Red Bull Racing.',
  NOR: 'McLaren team leader and race winner known for electrifying qualifying pace, clinical overtakes, and podium consistency.',
  LEC: 'Scuderia Ferrari talisman, celebrated for mind-bending one-lap qualifying pace and passionate loyalty from the Tifosi.',
  PIA: 'Australian sensation and multiple Grand Prix winner at McLaren, hailed for extraordinary mental composure and rapid tire mastery.',
  SAI: 'Seasoned Grand Prix winner joining Williams Racing, revered for meticulous tactical intelligence and smooth, decisive driving.',
  HAM: 'Seven-time World Champion making history as he embarks on his scarlet red chapter with Scuderia Ferrari.',
  RUS: 'Mercedes-AMG leader combining surgical precision, fierce single-lap pace, and authoritative on-track leadership.',
  PER: 'Experienced Mexican driver and master of tire management with multiple Grand Prix victories throughout his career.',
  ALO: 'Two-time World Champion and living icon whose supreme racing intelligence and adaptability continue to lead Aston Martin.',
  GAS: 'French Grand Prix winner bringing sheer grit, fierce determination, and podium experience to Alpine F1 Team.',
  OCO: 'Grand Prix winner with proven tenacity and aggressive wheel-to-wheel skill taking on a new leadership role at Haas F1 Team.',
  STR: 'Aston Martin driver with multiple podiums and exceptional sensitivity in mixed weather conditions.',
  HUL: 'Precision German veteran bringing huge technical feedback and single-lap pace to Kick Sauber ahead of Audi works entry.',
  TSU: 'Dynamic Japanese racer displaying relentless fighting spirit and high speed for Racing Bulls.',
  ALB: 'Team leader at Williams Racing, widely acclaimed for extraordinary defensive masterclasses and leadership.',
  LAW: 'Kiwi racer who proved his fierce racecraft and readiness, securing a full-time seat at Racing Bulls.',
  BEA: 'Exciting British prodigy graduating to a full-time seat at Haas F1 Team after stellar substitute appearances.',
  BOT: 'Ten-time Grand Prix winner and pole position ace bringing immense racecraft and championship pedigree.',
  ANT: 'Italian teenage prodigy making his eagerly anticipated debut with Mercedes-AMG works team.',
  BOR: 'Back-to-back F3 and F2 Champion making his eagerly awaited Formula 1 debut with Kick Sauber.',
  HAD: 'Red Bull Junior Team graduate stepping into Formula 1 with aggressive pace and race-winning caliber.',
};

function getLocalizedNationality(nat: string, lang: 'es' | 'en'): string {
  if (lang !== 'en') return nat;
  const map: Record<string, string> = {
    'Argentina': 'Argentine',
    'Países Bajos': 'Dutch',
    'Paises Bajos': 'Dutch',
    'Reino Unido': 'British',
    'Mónaco': 'Monegasque',
    'Australia': 'Australian',
    'España': 'Spanish',
    'Espana': 'Spanish',
    'México': 'Mexican',
    'Mexico': 'Mexican',
    'Francia': 'French',
    'Canadá': 'Canadian',
    'Canada': 'Canadian',
    'Alemania': 'German',
    'Japón': 'Japanese',
    'Japon': 'Japanese',
    'Tailandia': 'Thai',
    'Nueva Zelanda': 'New Zealander',
    'Finlandia': 'Finnish',
    'Brasil': 'Brazilian',
    'Italia': 'Italian',
    'Dinamarca': 'Danish',
    'Bulgaria': 'Bulgarian',
    'Irlanda': 'Irish',
    'Suecia': 'Swedish',
    'Noruega': 'Norwegian',
    'India': 'Indian',
    'Paraguay': 'Paraguayan',
    'Colombia': 'Colombian',
    'Polonia': 'Polish',
    'Estados Unidos': 'American',
    'Sri Lanka': 'Sri Lankan',
    'Jamaica': 'Jamaican',
    'China': 'Chinese',
  };
  return map[nat] || nat;
}

function getLocalizedBirthPlace(place: string, lang: 'es' | 'en'): string {
  if (lang !== 'en') return place;
  let res = place;
  res = res.replace(/Bélgica/g, 'Belgium');
  res = res.replace(/Reino Unido/g, 'United Kingdom');
  res = res.replace(/España/g, 'Spain');
  res = res.replace(/México/g, 'Mexico');
  res = res.replace(/Francia/g, 'France');
  res = res.replace(/Canadá/g, 'Canada');
  res = res.replace(/Alemania/g, 'Germany');
  res = res.replace(/Japón/g, 'Japan');
  res = res.replace(/Nueva Zelanda/g, 'New Zealand');
  res = res.replace(/Finlandia/g, 'Finland');
  res = res.replace(/Italia/g, 'Italy');
  res = res.replace(/Dinamarca/g, 'Denmark');
  return res;
}

function getLocalizedHighestFinish(hf: string, lang: 'es' | 'en'): string {
  if (lang !== 'en') return hf;
  return hf
    .replace(/(\d+)º/g, '$1th')
    .replace(/1th/g, '1st')
    .replace(/2th/g, '2nd')
    .replace(/3th/g, '3rd')
    .replace(/Canadá/g, 'Canada')
    .replace(/España/g, 'Spain')
    .replace(/Bélgica/g, 'Belgium')
    .replace(/Japón/g, 'Japan');
}

export const DriverProfileModal: React.FC<DriverProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onTogglePin,
  isPinned = false,
  onCompare,
}) => {
  const { lang, t } = useLanguage();
  const [failedImageNumber, setFailedImageNumber] = useState<number | null>(null);
  const [standings, setStandings] = useState<StandingsData | null>(null);

  useEffect(() => {
    if (isOpen && profile) {
      const targetSeries = profile.series || 'f1';
      fetchStandings(targetSeries).then((res) => {
        if (res) setStandings(res);
      });
    }
  }, [isOpen, profile]);

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
  const localizedNat = getLocalizedNationality(activeProfile.nationality, lang);
  const localizedPlace = getLocalizedBirthPlace(activeProfile.birthPlace, lang);
  const localizedBio =
    lang === 'en'
      ? activeProfile.biographyEn || F1_BIOS_EN[activeProfile.code] || activeProfile.biography
      : activeProfile.biography;
  const localizedFinish = getLocalizedHighestFinish(activeProfile.careerStats.highestFinish, lang);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 select-none">
      {/* Backdrop */}
      <button
        type="button"
        aria-label={t.driverProfile.closeAria}
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
            <span className="text-xs font-mono text-zinc-400 font-bold uppercase">
              {activeProfile.series === 'f2'
                ? 'FIA FÓRMULA 2'
                : activeProfile.series === 'f3'
                ? 'FIA FÓRMULA 3'
                : t.driverProfile.formula1}
            </span>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer z-10"
            aria-label={t.driverProfile.closeAria}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-5 pb-10 sm:pb-6 space-y-5 -mt-3 overscroll-contain">
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
                <span className="text-2xl" role="img" aria-label={localizedNat}>
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
                <span className="text-zinc-200">{localizedNat}</span>
                <span>•</span>
                <span>{age} {t.driverProfile.ageYears}</span>
              </p>
            </div>
          </div>

          {/* Personal Info Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-[#131722] border border-white/[0.08] rounded-xl p-2.5 sm:p-3 flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase text-zinc-500 font-bold block">
                  {t.driverProfile.birthPlace}
                </span>
                <span className="text-zinc-200 block font-medium mt-0.5 text-xs line-clamp-2 leading-tight">
                  {localizedPlace}
                </span>
              </div>
            </div>

            <div className="bg-[#131722] border border-white/[0.08] rounded-xl p-2.5 sm:p-3 flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase text-zinc-500 font-bold block">
                  {t.driverProfile.birthDate}
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
                  {t.driverProfile.seasonBadge}
                </span>
                <span className="text-xs text-zinc-300 font-bold truncate">
                  {matchingStanding.team}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold shrink-0">
                <span className="text-white">P{matchingStanding.pos}</span>
                <span className="text-zinc-500">•</span>
                <span className="text-[#FFD60A]">{matchingStanding.points} {t.driverProfile.pts}</span>
                {matchingStanding.wins > 0 && (
                  <>
                    <span className="text-zinc-500">•</span>
                    <span className="text-emerald-400">{matchingStanding.wins} {t.driverProfile.victShort}</span>
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
                  {activeProfile.series === 'f2'
                    ? (lang === 'en' ? 'Formula 2 Career Stats' : 'Estadísticas en Fórmula 2')
                    : activeProfile.series === 'f3'
                    ? (lang === 'en' ? 'Formula 3 Career Stats' : 'Estadísticas en Fórmula 3')
                    : t.driverProfile.statsTitle}
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">
                {t.driverProfile.careerBadge}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center font-mono">
              <div className="bg-white/[0.03] rounded-lg p-2 border border-white/[0.04]">
                <span className="text-xs sm:text-sm font-black text-white block">
                  {activeProfile.careerStats.grandsPrix}
                </span>
                <span className="text-[9px] uppercase text-zinc-400 tracking-wider">
                  {t.driverProfile.grandsPrix}
                </span>
              </div>

              <div className="bg-white/[0.03] rounded-lg p-2 border border-white/[0.04]">
                <span className="text-xs sm:text-sm font-black text-[#FFD60A] block">
                  {activeProfile.careerStats.podiums}
                </span>
                <span className="text-[9px] uppercase text-zinc-400 tracking-wider">
                  {t.driverProfile.podiums}
                </span>
              </div>

              <div className="bg-white/[0.03] rounded-lg p-2 border border-white/[0.04]">
                <span className="text-xs sm:text-sm font-black text-emerald-400 block">
                  {activeProfile.careerStats.victories}
                </span>
                <span className="text-[9px] uppercase text-zinc-400 tracking-wider">
                  {t.driverProfile.victories}
                </span>
              </div>

              <div className="bg-white/[0.03] rounded-lg p-2 border border-white/[0.04]">
                <span className="text-xs sm:text-sm font-black text-white block">
                  {activeProfile.careerStats.worldChampionships > 0
                    ? `${activeProfile.careerStats.worldChampionships} 🏆`
                    : '0'}
                </span>
                <span className="text-[9px] uppercase text-zinc-400 tracking-wider">
                  {t.driverProfile.championships}
                </span>
              </div>

              <div className="bg-white/[0.03] rounded-lg p-2 border border-white/[0.04] col-span-2 flex flex-col justify-center">
                <span className="text-xs font-bold text-zinc-200 block truncate">
                  {localizedFinish}
                </span>
                <span className="text-[9px] uppercase text-zinc-400 tracking-wider">
                  {t.driverProfile.bestFinish}
                </span>
              </div>
            </div>
          </div>

          {/* Biography */}
          <div className="bg-[#131722] border border-white/[0.08] rounded-xl p-3.5 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-zinc-300">
              <Award className="w-3.5 h-3.5 text-zinc-400" />
              <span>{t.driverProfile.bioTitle}</span>
            </div>
            <p className="text-xs text-zinc-300 font-sans leading-relaxed text-justify">
              {localizedBio}
            </p>
          </div>

          {/* Quick Actions (Pin as My Driver / Compare 1 vs 1) */}
          <div className="flex flex-col sm:flex-row gap-2 pt-1 pb-4 sm:pb-0">
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
                <span>{isPinned ? t.driverProfile.pinnedDriver : t.driverProfile.pinDriver}</span>
              </button>
            )}

            {onCompare && (
              <button
                type="button"
                onClick={() => onCompare(activeProfile.number)}
                className="py-2.5 px-4 rounded-xl bg-white/[0.06] hover:bg-white/10 text-white border border-white/15 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer active:scale-98"
              >
                <Swords className="w-4 h-4 text-zinc-300" />
                <span>{t.driverProfile.compareBtn}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
