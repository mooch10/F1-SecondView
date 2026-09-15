import React, { useEffect, useState } from 'react';
import { Award, Trophy, Users } from 'lucide-react';
import { fetchDriverChanges, fetchStandings } from '../../services/api';
import type { DriverChangeAlert, StandingsData } from '../../types/f1';
import { useLanguage } from '../../hooks/useLanguage';
import { useSeries } from '../../hooks/useSeries';
import { DriverChangesAlert } from './DriverChangesAlert';
import { DriverProfileModal } from '../drivers/DriverProfileModal';
import { getDriverProfile, enrichDriverProfileWithSeason, type F1DriverProfile } from '../../data/f1DriversData';

export const StandingsView: React.FC = () => {
  const { t, lang } = useLanguage();
  const { series, theme } = useSeries();
  const [data, setData] = useState<StandingsData | null>(null);
  const [driverChanges, setDriverChanges] = useState<DriverChangeAlert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [subTab, setSubTab] = useState<'drivers' | 'constructors'>('drivers');

  // 👤 Driver Profile Modal
  const [selectedProfile, setSelectedProfile] = useState<F1DriverProfile | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [pinnedDriverNumber, setPinnedDriverNumber] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem('f1_pinned_driver');
      return saved ? parseInt(saved, 10) : null;
    } catch {
      return null;
    }
  });

  const togglePin = (driverNumber: number) => {
    setPinnedDriverNumber((prev) => {
      const next = prev === driverNumber ? null : driverNumber;
      try {
        if (next === null) {
          localStorage.removeItem('f1_pinned_driver');
        } else {
          localStorage.setItem('f1_pinned_driver', String(next));
        }
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const handleDriverClick = (d: {
    code?: string;
    name?: string;
    pos?: number;
    points?: number;
    wins?: number;
    team?: string;
    teamColor?: string;
  }) => {
    const rawProfile = getDriverProfile(d.code, series) || getDriverProfile(d.name, series);
    if (rawProfile) {
      const enriched = enrichDriverProfileWithSeason(rawProfile, {
        pos: d.pos || 1,
        points: d.points || 0,
        wins: d.wins || 0,
        team: d.team,
        teamColor: d.teamColor,
      });
      setSelectedProfile(enriched);
      setIsProfileOpen(true);
    }
  };

  const renderPosBadge = (pos: number) => {
    if (pos === 1) {
      return (
        <span className="inline-flex items-center justify-center gap-1 px-1.5 py-0.5 rounded font-mono text-xs font-black bg-amber-400/20 text-amber-400 border border-amber-400/40 shadow-[0_0_8px_rgba(251,191,36,0.25)]">
          <span className="text-[11px]">🥇</span> <span>{pos}</span>
        </span>
      );
    }
    if (pos === 2) {
      return (
        <span className="inline-flex items-center justify-center gap-1 px-1.5 py-0.5 rounded font-mono text-xs font-black bg-slate-300/15 text-slate-200 border border-slate-300/30">
          <span className="text-[11px]">🥈</span> <span>{pos}</span>
        </span>
      );
    }
    if (pos === 3) {
      return (
        <span className="inline-flex items-center justify-center gap-1 px-1.5 py-0.5 rounded font-mono text-xs font-black bg-amber-700/15 text-amber-500 border border-amber-700/30">
          <span className="text-[11px]">🥉</span> <span>{pos}</span>
        </span>
      );
    }
    return <span className="text-zinc-400 font-bold">{pos}</span>;
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchStandings(series),
      series !== 'f1' ? fetchDriverChanges(series) : Promise.resolve([]),
    ]).then(([standingsRes, changesRes]) => {
      setData(standingsRes);
      setDriverChanges(changesRes);
      setLoading(false);
    });
  }, [series]);

  if (loading) {
    return (
      <div className="bg-[#131722] border border-white/[0.08] rounded-xl p-12 text-center text-zinc-400 font-mono text-xs">
        <Trophy
          className="w-6 h-6 mx-auto mb-2 animate-pulse"
          style={{ color: theme.primary }}
        />
        <span>{t.standings.loading}</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-[#131722] border border-white/[0.08] rounded-xl p-8 text-center text-zinc-400 font-mono text-xs">
        {t.standings.noData}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Broadcast Style Sub-Tabs */}
      <div className="flex gap-4 sm:gap-6 border-b border-white/[0.08] px-1 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setSubTab('drivers')}
          className={`flex items-center gap-1.5 sm:gap-2 py-2 text-xs font-mono uppercase tracking-wider font-semibold transition-all border-b-2 cursor-pointer shrink-0 whitespace-nowrap ${
            subTab === 'drivers'
              ? 'text-white'
              : 'text-zinc-400 hover:text-white border-transparent'
          }`}
          style={subTab === 'drivers' ? { borderColor: theme.primary } : undefined}
        >
          <Award className="w-3.5 h-3.5 shrink-0" style={{ color: theme.primary }} />
          <span className="sm:hidden">{lang === 'es' ? 'PILOTOS' : 'DRIVERS'}</span>
          <span className="hidden sm:inline">{t.standings.driversTab}</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('constructors')}
          className={`flex items-center gap-1.5 sm:gap-2 py-2 text-xs font-mono uppercase tracking-wider font-semibold transition-all border-b-2 cursor-pointer shrink-0 whitespace-nowrap ${
            subTab === 'constructors'
              ? 'text-white'
              : 'text-zinc-400 hover:text-white border-transparent'
          }`}
          style={subTab === 'constructors' ? { borderColor: theme.primary } : undefined}
        >
          <Users className="w-3.5 h-3.5 shrink-0" style={{ color: theme.primary }} />
          <span className="sm:hidden">{lang === 'es' ? 'CONSTRUCTORES' : 'CONSTRUCTORS'}</span>
          <span className="hidden sm:inline">{t.standings.constructorsTab}</span>
        </button>
      </div>

      {/* Driver Lineup Changes Notification for F2 / F3 */}
      {driverChanges.length > 0 && (
        <DriverChangesAlert
          changes={driverChanges}
          series={series}
          onSelectDriver={(name) => handleDriverClick({ name })}
        />
      )}

      {/* DRIVERS TABLE */}
      {subTab === 'drivers' && (
        <div className="bg-[#131722] border border-white/[0.08] rounded-xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-12 gap-1 px-3 py-2 bg-[#131722] border-b border-white/[0.08] text-[10px] sm:text-[11px] font-mono font-bold tracking-wider text-zinc-400 uppercase select-none">
            <div className="col-span-2 sm:col-span-1 text-center">{t.standings.headers.pos}</div>
            <div className="col-span-5 sm:col-span-5">{t.standings.headers.driver}</div>
            <div className="col-span-3 hidden sm:block">{t.standings.headers.team}</div>
            <div className="col-span-3 sm:col-span-2 text-right pr-2 sm:pr-3">{t.standings.headers.points}</div>
            <div className="col-span-2 sm:col-span-1 text-right">{t.standings.headers.wins}</div>
          </div>

          <div className="divide-y divide-white/[0.08]">
            {data.drivers.map((d) => (
              <div
                key={`${d.code}-${d.pos}`}
                className={`grid grid-cols-12 gap-1 px-3 py-2.5 items-center transition-colors ${
                  d.pos === 1
                    ? 'bg-amber-500/[0.04] hover:bg-amber-500/[0.08]'
                    : d.pos <= 3
                    ? 'bg-white/[0.015] hover:bg-white/[0.04]'
                    : 'hover:bg-white/[0.02]'
                }`}
              >
                {/* Pos */}
                <div className="col-span-2 sm:col-span-1 flex items-center justify-center font-mono tabular-nums">
                  {renderPosBadge(d.pos)}
                </div>

                {/* Driver */}
                <div className="col-span-5 sm:col-span-5 flex items-center gap-2 overflow-hidden">
                  <span
                    className="w-[3px] h-5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: d.teamColor || '#8E929B' }}
                  />
                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDriverClick(d);
                        }}
                        className="font-mono text-xs sm:text-sm font-black text-white tracking-tight uppercase hover:text-[#FFD60A] hover:underline cursor-pointer transition-colors"
                        title={lang === 'es' ? 'Ver ficha técnica del piloto' : 'View driver profile'}
                      >
                        {d.code}
                      </button>
                      <span className="text-xs text-zinc-400 font-medium truncate hidden sm:inline">
                        {d.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-mono sm:hidden block truncate">
                      {d.team}
                    </span>
                  </div>
                </div>

                {/* Team (Desktop) */}
                <div className="col-span-3 text-xs text-zinc-400 font-mono truncate hidden sm:block">
                  {d.team}
                </div>

                {/* Points */}
                <div className="col-span-3 sm:col-span-2 text-right pr-2 sm:pr-3 font-mono text-xs sm:text-sm font-bold text-[#FFD60A] tabular-nums">
                  {d.points}
                </div>

                {/* Wins */}
                <div className="col-span-2 sm:col-span-1 text-right font-mono text-xs text-zinc-400 tabular-nums">
                  {d.wins}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONSTRUCTORS TABLE */}
      {subTab === 'constructors' && (
        <div className="bg-[#131722] border border-white/[0.08] rounded-xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-12 gap-1 px-3 py-2 bg-[#131722] border-b border-white/[0.08] text-[10px] sm:text-[11px] font-mono font-bold tracking-wider text-zinc-400 uppercase select-none">
            <div className="col-span-2 sm:col-span-1 text-center">{t.standings.headers.pos}</div>
            <div className="col-span-6 sm:col-span-7">{t.standings.headers.team}</div>
            <div className="col-span-2 text-right pr-2 sm:pr-3">{t.standings.headers.points}</div>
            <div className="col-span-2 text-right">{t.standings.headers.wins}</div>
          </div>

          <div className="divide-y divide-white/[0.08]">
            {data.constructors.map((c) => (
              <div
                key={c.name}
                className={`grid grid-cols-12 gap-1 px-3 py-2.5 items-center transition-colors ${
                  c.pos === 1
                    ? 'bg-amber-500/[0.04] hover:bg-amber-500/[0.08]'
                    : c.pos <= 3
                    ? 'bg-white/[0.015] hover:bg-white/[0.04]'
                    : 'hover:bg-white/[0.02]'
                }`}
              >
                {/* Pos */}
                <div className="col-span-2 sm:col-span-1 flex items-center justify-center font-mono tabular-nums">
                  {renderPosBadge(c.pos)}
                </div>

                {/* Team Name with line indicator */}
                <div className="col-span-6 sm:col-span-7 flex items-center gap-2.5">
                  <span
                    className="w-[3px] h-5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: c.teamColor || '#8E929B' }}
                  />
                  <span className="font-bold text-xs sm:text-sm text-white tracking-tight uppercase">
                    {c.name}
                  </span>
                </div>

                {/* Points */}
                <div className="col-span-2 text-right pr-2 sm:pr-3 font-mono text-xs sm:text-sm font-bold text-[#FFD60A] tabular-nums">
                  {c.points}
                </div>

                {/* Wins */}
                <div className="col-span-2 text-right font-mono text-xs text-zinc-400 tabular-nums">
                  {c.wins}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Driver Profile Modal */}
      <DriverProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={selectedProfile}
        isPinned={selectedProfile ? pinnedDriverNumber === selectedProfile.number : false}
        onTogglePin={togglePin}
      />
    </div>
  );
};
