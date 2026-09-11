import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Flag, MapPin, Sparkles, Timer } from 'lucide-react';
import { fetchQualifying } from '../../services/api';
import type { JolpicaQualifyingResult, JolpicaQualifyingSession } from '../../types/f1';
import { useLanguage } from '../../hooks/useLanguage';

export const QualifyingView: React.FC = () => {
  const { lang: _lang, t } = useLanguage();
  const [session, setSession] = useState<JolpicaQualifyingSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [phaseFilter, setPhaseFilter] = useState<'ALL' | 'Q3' | 'Q2' | 'Q1'>('ALL');
  const [expandedDriver, setExpandedDriver] = useState<number | null>(null);

  useEffect(() => {
    fetchQualifying().then((data) => {
      setSession(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="bg-[#131722] border border-white/[0.08] rounded-xl p-12 text-center text-zinc-400 font-mono text-xs">
        <Timer className="w-6 h-6 text-zinc-400 mx-auto mb-2 animate-pulse" />
        <span>{t.qualy.loading}</span>
      </div>
    );
  }

  if (!session || !session.results || session.results.length === 0) {
    return (
      <div className="bg-[#131722] border border-white/[0.08] rounded-xl p-8 text-center text-zinc-400 font-mono text-xs">
        <Flag className="w-6 h-6 text-zinc-500 mx-auto mb-2" />
        <span>{t.qualy.noData}</span>
      </div>
    );
  }

  const poleDriver = session.results[0];

  // Filtering based on active phase tab
  const filteredResults: JolpicaQualifyingResult[] = session.results.filter((d) => {
    if (phaseFilter === 'ALL') return true;
    if (phaseFilter === 'Q3') return d.pos <= 10 && !!d.q3;
    if (phaseFilter === 'Q2') return d.pos <= 15 && !!d.q2;
    if (phaseFilter === 'Q1') return !!d.q1;
    return true;
  });

  const toggleExpand = (driverNumber: number) => {
    setExpandedDriver((prev) => (prev === driverNumber ? null : driverNumber));
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Grand Prix & Poleman Hero Showcase */}
      <div className="bg-[#131722] border border-white/[0.08] border-t-2 border-t-[#FFD60A] rounded-xl p-4 sm:p-5 relative shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#FFD60A]/15 text-[#FFD60A] border border-[#FFD60A]/30 tracking-widest">
                {t.qualy.round} {session.round} • {t.qualy.qualyTitle}
              </span>
              <span className="text-[11px] text-zinc-400 font-mono">
                {session.date}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
              {session.raceName}
            </h2>
            <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5 font-mono">
              <MapPin className="w-3.5 h-3.5 text-[#E10600]" />
              <span>{session.circuitName}</span>
            </div>
          </div>

          {/* Pole Position Winner Pill Card */}
          {poleDriver && (
            <div className="bg-[#0B0E14] border border-amber-500/30 rounded-xl p-3 sm:min-w-[240px] flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-lg text-black font-mono shadow-sm shrink-0"
                style={{ backgroundColor: poleDriver.teamColor || '#FFD60A' }}
              >
                1
              </div>
              <div className="flex flex-col leading-tight min-w-0">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> {t.qualy.poleBadge}
                </span>
                <span className="text-sm font-bold text-white truncate font-sans">
                  {poleDriver.fullName}
                </span>
                <div className="flex items-center gap-2 text-[11px] font-mono mt-0.5">
                  <span className="text-zinc-400 truncate">{poleDriver.teamName}</span>
                  <span className="text-white font-bold bg-white/[0.08] px-1.5 py-0.2 rounded">
                    {poleDriver.q3 || poleDriver.bestLap}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Phase Selector Tabs (Adaptive to Q1, Q2, Q3) */}
        <div className="flex items-center gap-1.5 border-t border-white/[0.08] pt-3 overflow-x-auto select-none">
          <button
            type="button"
            onClick={() => setPhaseFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              phaseFilter === 'ALL'
                ? 'bg-white/10 text-white border border-white/20 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200 bg-transparent'
            }`}
          >
            {t.qualy.filters.all}
          </button>
          <button
            type="button"
            onClick={() => setPhaseFilter('Q3')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
              phaseFilter === 'Q3'
                ? 'bg-[#FFD60A]/20 text-[#FFD60A] border border-[#FFD60A]/40 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200 bg-transparent'
            }`}
          >
            <span>{t.qualy.filters.q3}</span>
          </button>
          <button
            type="button"
            onClick={() => setPhaseFilter('Q2')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              phaseFilter === 'Q2'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200 bg-transparent'
            }`}
          >
            {t.qualy.filters.q2}
          </button>
          <button
            type="button"
            onClick={() => setPhaseFilter('Q1')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              phaseFilter === 'Q1'
                ? 'bg-rose-900/30 text-rose-300 border border-rose-700/40 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200 bg-transparent'
            }`}
          >
            {t.qualy.filters.q1}
          </button>
        </div>
      </div>

      {/* Main Qualifying Table */}
      <div className="bg-[#131722] border border-white/[0.08] rounded-xl shadow-lg overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-1 px-3 py-2 bg-[#1C2230] border-b border-white/[0.08] text-[10px] font-bold tracking-wider uppercase text-zinc-400 font-mono select-none">
          <div className="col-span-1 text-center">{t.qualy.headers.pos}</div>
          <div className="col-span-4 sm:col-span-3">{t.qualy.headers.driver}</div>
          <div className="col-span-2 text-center">{t.qualy.headers.q1}</div>
          <div className="col-span-2 text-center">{t.qualy.headers.q2}</div>
          <div className="col-span-2 text-center">{t.qualy.headers.q3}</div>
          <div className="col-span-1 sm:col-span-1 text-right">{t.qualy.headers.gap}</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-white/[0.04]">
          {filteredResults.map((d, index) => {
            const isExpanded = expandedDriver === d.driverNumber;
            const prevDriver = index > 0 ? filteredResults[index - 1] : null;

            // Cutoffs only show when viewing ALL
            const showQ2Cutoff = phaseFilter === 'ALL' && d.pos > 10 && (!prevDriver || prevDriver.pos <= 10);
            const showQ1Cutoff = phaseFilter === 'ALL' && d.pos > 15 && (!prevDriver || prevDriver.pos <= 15);

            return (
              <div key={d.driverNumber} className="flex flex-col">
                {/* Línea divisoria de corte Q2 (eliminación P11 a P15) */}
                {showQ2Cutoff && (
                  <div className="h-[2px] bg-rose-500/80 shadow-[0_0_8px_rgba(244,63,94,0.5)] my-0" />
                )}

                {/* Línea divisoria de corte Q1 (eliminación P16 a P20) */}
                {showQ1Cutoff && (
                  <div className="h-[2px] bg-rose-500/80 shadow-[0_0_8px_rgba(244,63,94,0.5)] my-0" />
                )}

                {/* Main Row */}
                <button
                  type="button"
                  onClick={() => toggleExpand(d.driverNumber)}
                  className={`w-full text-left grid grid-cols-12 gap-1 px-3 py-2.5 items-center transition-colors select-none ${
                    isExpanded ? 'bg-white/[0.05]' : 'hover:bg-white/[0.02]'
                  } ${d.isPole ? 'bg-[#FFD60A]/[0.03]' : ''}`}
                >
                  {/* Position */}
                  <div className="col-span-1 flex items-center justify-center">
                    <span
                      className={`font-mono text-sm font-black font-tabular text-center ${
                        d.isPole
                          ? 'text-[#FFD60A]'
                          : d.pos <= 3
                          ? 'text-white'
                          : d.pos <= 10
                          ? 'text-zinc-200'
                          : 'text-zinc-400'
                      }`}
                    >
                      {d.pos}
                    </span>
                  </div>

                  {/* Driver & Team */}
                  <div className="col-span-4 sm:col-span-3 flex items-center gap-2 overflow-hidden">
                    <span
                      className="w-1 h-6 rounded-full flex-shrink-0"
                      style={{ backgroundColor: d.teamColor || '#71717A' }}
                    />
                    <div className="flex flex-col leading-tight truncate">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono text-sm font-bold text-white tracking-tight">
                          {d.code}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          #{d.driverNumber}
                        </span>
                        {d.isPole && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 tracking-tight">
                            POLE 🥇
                          </span>
                        )}
                        {d.eliminatedPhase && (
                          <span className="px-1 py-0.2 rounded text-[8px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            {d.eliminatedPhase}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-400 truncate hidden sm:block">
                        {d.fullName}
                      </span>
                    </div>
                  </div>

                  {/* Q1 Lap Time */}
                  <div className="col-span-2 text-center font-mono text-xs font-tabular">
                    <span className={d.q1 ? 'text-zinc-300' : 'text-zinc-600'}>
                      {d.q1 || '-'}
                    </span>
                  </div>

                  {/* Q2 Lap Time */}
                  <div className="col-span-2 text-center font-mono text-xs font-tabular">
                    <span
                      className={
                        d.q2
                          ? d.eliminatedPhase === 'Q2'
                            ? 'text-rose-300 font-semibold'
                            : 'text-zinc-300'
                          : 'text-zinc-600'
                      }
                    >
                      {d.q2 || '-'}
                    </span>
                  </div>

                  {/* Q3 Lap Time */}
                  <div className="col-span-2 text-center font-mono text-xs font-tabular">
                    <span
                      className={
                        d.q3
                          ? d.isPole
                            ? 'text-[#FFD60A] font-black'
                            : 'text-white font-bold'
                          : 'text-zinc-600'
                      }
                    >
                      {d.q3 || '-'}
                    </span>
                  </div>

                  {/* Gap to Pole */}
                  <div className="col-span-1 sm:col-span-1 text-right flex items-center justify-end gap-1 font-mono text-xs font-tabular">
                    <span
                      className={
                        d.isPole ? 'text-[#FFD60A] font-bold text-[11px]' : 'text-zinc-400'
                      }
                    >
                      {d.gap}
                    </span>
                    <div className="text-zinc-500 hidden sm:block">
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanded Driver Details */}
                {isExpanded && (
                  <div className="bg-[#0B0E14] border-t border-b border-white/[0.06] px-4 py-3 text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: d.teamColor }}
                        />
                        <span className="font-bold text-white text-sm">
                          {d.fullName}
                        </span>
                        <span className="text-zinc-400 text-xs">
                          ({d.teamName})
                        </span>
                      </div>
                      <span className="text-zinc-400 font-mono text-[10px]">
                        {t.qualy.provisionalGrid} <strong className="text-white">P{d.pos}</strong>
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center font-mono mt-2">
                      <div className="bg-[#131722] border border-white/[0.06] rounded-lg p-2">
                        <span className="text-[10px] text-zinc-500 block uppercase font-sans">
                          {t.qualy.q1Run}
                        </span>
                        <span className="font-bold text-zinc-200 text-xs font-tabular">
                          {d.q1 || t.qualy.noTime}
                        </span>
                      </div>
                      <div className="bg-[#131722] border border-white/[0.06] rounded-lg p-2">
                        <span className="text-[10px] text-zinc-500 block uppercase font-sans">
                          {t.qualy.q2Run}
                        </span>
                        <span className="font-bold text-zinc-200 text-xs font-tabular">
                          {d.q2 || (d.pos >= 16 ? t.qualy.noQ2 : '-')}
                        </span>
                      </div>
                      <div className="bg-[#131722] border border-white/[0.06] rounded-lg p-2">
                        <span className="text-[10px] text-zinc-500 block uppercase font-sans">
                          {t.qualy.q3Run}
                        </span>
                        <span className="font-bold text-zinc-200 text-xs font-tabular">
                          {d.q3 || (d.pos >= 11 ? t.qualy.noQ3 : '-')}
                        </span>
                      </div>
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
