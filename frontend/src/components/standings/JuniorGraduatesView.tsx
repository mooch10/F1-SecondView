import React, { useState } from 'react';
import { Sparkles, UserCheck } from 'lucide-react';
import {
  F2_HISTORICAL_SEASONS,
  F3_HISTORICAL_SEASONS,
  type SeasonHistory,
} from '../../data/juniorGraduatesData';
import { useLanguage } from '../../hooks/useLanguage';
import { useSeries } from '../../hooks/useSeries';

interface JuniorGraduatesViewProps {
  onSelectDriver?: (name: string) => void;
}

export const JuniorGraduatesView: React.FC<JuniorGraduatesViewProps> = ({
  onSelectDriver,
}) => {
  const { lang } = useLanguage();
  const { series, theme } = useSeries();
  const seasonsData = series === 'f2' ? F2_HISTORICAL_SEASONS : F3_HISTORICAL_SEASONS;
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');

  const availableYears = seasonsData.map((s) => s.year);

  const displayedSeasons =
    selectedYear === 'all'
      ? seasonsData
      : seasonsData.filter((s) => s.year === selectedYear);

  return (
    <div className="flex flex-col gap-4 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-[#131722] border border-white/[0.08] rounded-xl p-4 sm:p-5 relative overflow-hidden shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border shadow-xs"
                style={{
                  backgroundColor: `${theme.primary}15`,
                  color: theme.primary,
                  borderColor: `${theme.primary}30`,
                }}
              >
                {series.toUpperCase()} • {lang === 'es' ? 'SALÓN DE LA FAMA' : 'HALL OF FAME'}
              </span>
              <span className="text-[11px] text-zinc-400 font-mono">
                {lang === 'es' ? 'Semillero hacia la F1' : 'The Path to F1'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
              {lang === 'es' ? 'CAMPEONES Y GRADUADOS A F1' : 'CHAMPIONS & F1 GRADUATES'}
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
              {lang === 'es'
                ? 'Historial de los pilotos que conquistaron la categoría y las estrellas que dieron el salto a los Grandes Premios de Fórmula 1.'
                : 'History of drivers who clinched the championship and the rising stars who made the leap to Formula 1 race seats.'}
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="bg-[#0B0E14] border border-white/[0.08] rounded-xl p-3 flex items-center gap-3 shrink-0">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-lg text-black font-mono shadow-sm"
              style={{ backgroundColor: theme.primary }}
            >
              🎓
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase">
                {lang === 'es' ? 'Graduados Recientes' : 'Recent Graduates'}
              </span>
              <span className="text-sm font-extrabold text-white font-mono mt-0.5">
                {series === 'f2' ? '18+ Pilotos en F1' : 'Campeones FIA F3'}
              </span>
            </div>
          </div>
        </div>

        {/* Year Filter Pill Selector */}
        <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-white/[0.06] overflow-x-auto no-scrollbar select-none">
          <button
            type="button"
            onClick={() => setSelectedYear('all')}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all shrink-0 cursor-pointer ${
              selectedYear === 'all'
                ? 'bg-white text-black shadow-sm font-black'
                : 'bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            {lang === 'es' ? 'TODAS LAS TEMPORADAS' : 'ALL SEASONS'}
          </button>
          {availableYears.map((yr) => (
            <button
              key={yr}
              type="button"
              onClick={() => setSelectedYear(yr)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all shrink-0 cursor-pointer ${
                selectedYear === yr
                  ? 'bg-white text-black shadow-sm font-black'
                  : 'bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              {yr === 2026 ? `${yr} (${lang === 'es' ? 'Actual' : 'Live'})` : yr}
            </button>
          ))}
        </div>
      </div>

      {/* Season Cards Container */}
      <div className="flex flex-col gap-4">
        {displayedSeasons.map((season: SeasonHistory) => (
          <div
            key={season.year}
            className="bg-[#131722] border border-white/[0.08] rounded-xl overflow-hidden shadow-sm flex flex-col"
          >
            {/* Season Card Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#1A1F2C] border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <span
                  className="px-2.5 py-0.5 rounded text-xs font-mono font-black text-black shadow-xs"
                  style={{ backgroundColor: theme.primary }}
                >
                  {season.year}
                </span>
                <span className="font-bold text-white text-sm tracking-wide">
                  {series.toUpperCase()} {season.year} {season.year === 2026 ? (lang === 'es' ? '• Temporada en Curso' : '• Season In Progress') : 'World Championship'}
                </span>
              </div>
              <span className="text-[11px] text-zinc-400 font-mono hidden sm:inline">
                {season.year === 2026 ? (lang === 'es' ? 'Líderes de Campeonato' : 'Championship Leaders') : season.champion.team}
              </span>
            </div>

            {/* Podium Showcase (Top 3) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3 sm:p-4 bg-[#0B0E14]/60">
              {/* Champion Hero Card */}
              <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/30 flex flex-col justify-between relative overflow-hidden">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🏆</span>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 block">
                        {season.year === 2026
                          ? (lang === 'es' ? 'LÍDER PROVISIONAL (P1)' : 'PROVISIONAL LEADER (P1)')
                          : (lang === 'es' ? 'CAMPEÓN' : 'CHAMPION')}
                      </span>
                      <h3 className="text-base font-black text-white font-sans flex items-center gap-1.5">
                        <span>{season.champion.flag}</span>
                        <span>{season.champion.name}</span>
                      </h3>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-black bg-amber-400 text-black">
                    P1
                  </span>
                </div>

                <div className="mt-3 pt-2.5 border-t border-amber-500/20 flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400 truncate">{season.champion.team}</span>
                  <span className="font-bold text-amber-300">
                    {season.champion.points} pts • {season.champion.wins} wins
                  </span>
                </div>

                {season.champion.f1Destination && (
                  <div className="mt-2 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 shrink-0 text-emerald-400" />
                    <span className="truncate">
                      {lang === 'es' ? 'Salto / Vínculo F1: ' : 'F1 Link: '}
                      <strong>{season.champion.f1Destination}</strong>
                    </span>
                  </div>
                )}
              </div>

              {/* Runner Up */}
              <div className="p-3.5 rounded-xl bg-[#131722] border border-white/[0.08] flex flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 block">
                      {season.year === 2026
                        ? (lang === 'es' ? 'P2 PROVISIONAL' : 'PROVISIONAL P2')
                        : (lang === 'es' ? 'SUBCAMPEÓN (P2)' : 'RUNNER-UP (P2)')}
                    </span>
                    <h3 className="text-base font-bold text-white font-sans flex items-center gap-1.5 mt-0.5">
                      <span>{season.runnerUp.flag}</span>
                      <span>{season.runnerUp.name}</span>
                    </h3>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-xs font-mono font-bold bg-zinc-700 text-zinc-200">
                    P2
                  </span>
                </div>
                <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400 truncate">{season.runnerUp.team}</span>
                  <span className="font-bold text-zinc-300">{season.runnerUp.points} pts</span>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="p-3.5 rounded-xl bg-[#131722] border border-white/[0.08] flex flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700/80 block">
                      {season.year === 2026
                        ? (lang === 'es' ? 'P3 PROVISIONAL' : 'PROVISIONAL P3')
                        : (lang === 'es' ? '3º PUESTO (P3)' : '3RD PLACE (P3)')}
                    </span>
                    <h3 className="text-base font-bold text-white font-sans flex items-center gap-1.5 mt-0.5">
                      <span>{season.thirdPlace.flag}</span>
                      <span>{season.thirdPlace.name}</span>
                    </h3>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-xs font-mono font-bold bg-amber-900/60 text-amber-200">
                    P3
                  </span>
                </div>
                <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400 truncate">{season.thirdPlace.team}</span>
                  <span className="font-bold text-zinc-300">{season.thirdPlace.points} pts</span>
                </div>
              </div>
            </div>

            {/* Key Fact Note */}
            <div className="px-4 py-2.5 bg-[#131722] border-t border-white/[0.06] text-xs font-mono text-zinc-300 flex items-center gap-2">
              <span className="text-amber-400 font-bold shrink-0">💡 Hito:</span>
              <span className="text-zinc-400">
                {lang === 'es' ? season.keyFact : season.keyFactEn}
              </span>
            </div>

            {/* F1 Graduates Row (if available for this season) */}
            {season.graduatesToF1 && season.graduatesToF1.length > 0 && (
              <div className="p-3 sm:p-4 border-t border-white/[0.08] bg-[#0E121A]">
                <div className="flex items-center gap-2 mb-2.5">
                  <UserCheck className="w-4 h-4 text-[#27F4D2]" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                    {lang === 'es' ? 'Graduados Directos a Fórmula 1' : 'Direct Formula 1 Graduates'}
                  </span>
                  <span className="text-[10px] font-mono bg-[#27F4D2]/15 text-[#27F4D2] border border-[#27F4D2]/30 px-2 py-0.2 rounded-full font-bold">
                    {season.graduatesToF1.length} {lang === 'es' ? 'Pilotos' : 'Drivers'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {season.graduatesToF1.map((grad) => (
                    <div
                      key={grad.name}
                      onClick={() => onSelectDriver?.(grad.name)}
                      className="p-3 rounded-lg bg-[#131722] border border-white/[0.08] hover:border-[#27F4D2]/50 hover:bg-[#1A2232] transition-all flex flex-col justify-between gap-1.5 cursor-pointer group"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-base">{grad.flag}</span>
                          <span className="font-bold text-white text-xs truncate group-hover:text-[#27F4D2] transition-colors">
                            {grad.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-white/[0.05] text-zinc-300 shrink-0">
                          {grad.f2Result}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                        <span className="text-zinc-500">{grad.f2Team}</span>
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          ➔ {grad.f1Team}
                        </span>
                      </div>

                      <p className="text-[10px] text-zinc-500 leading-tight border-t border-white/[0.04] pt-1.5 mt-0.5 line-clamp-2">
                        {lang === 'es' ? grad.notes : grad.notesEn}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
