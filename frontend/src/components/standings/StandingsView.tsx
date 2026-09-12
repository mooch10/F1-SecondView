import React, { useEffect, useState } from 'react';
import { Award, Trophy, Users } from 'lucide-react';
import { fetchDriverChanges, fetchStandings } from '../../services/api';
import type { DriverChangeAlert, StandingsData } from '../../types/f1';
import { useLanguage } from '../../hooks/useLanguage';
import { useSeries } from '../../hooks/useSeries';
import { DriverChangesAlert } from './DriverChangesAlert';

export const StandingsView: React.FC = () => {
  const { t } = useLanguage();
  const { series, theme } = useSeries();
  const [data, setData] = useState<StandingsData | null>(null);
  const [driverChanges, setDriverChanges] = useState<DriverChangeAlert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [subTab, setSubTab] = useState<'drivers' | 'constructors'>('drivers');

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
      <div className="flex gap-6 border-b border-white/[0.08] px-1">
        <button
          type="button"
          onClick={() => setSubTab('drivers')}
          className={`flex items-center gap-2 py-2 text-xs font-mono uppercase tracking-wider font-semibold transition-all border-b-2 cursor-pointer ${
            subTab === 'drivers'
              ? 'text-white'
              : 'text-zinc-400 hover:text-white border-transparent'
          }`}
          style={subTab === 'drivers' ? { borderColor: theme.primary } : undefined}
        >
          <Award className="w-3.5 h-3.5 text-[#FFD60A]" />
          <span>{t.standings.driversTab}</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('constructors')}
          className={`flex items-center gap-2 py-2 text-xs font-mono uppercase tracking-wider font-semibold transition-all border-b-2 cursor-pointer ${
            subTab === 'constructors'
              ? 'text-white'
              : 'text-zinc-400 hover:text-white border-transparent'
          }`}
          style={subTab === 'constructors' ? { borderColor: theme.primary } : undefined}
        >
          <Users className="w-3.5 h-3.5 text-[#27F4D2]" />
          <span>{t.standings.constructorsTab}</span>
        </button>
      </div>

      {/* Driver Lineup Changes Notification for F2 / F3 */}
      {driverChanges.length > 0 && (
        <DriverChangesAlert changes={driverChanges} series={series} />
      )}

      {/* DRIVERS TABLE */}
      {subTab === 'drivers' && (
        <div className="bg-[#131722] border border-white/[0.08] rounded-xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-12 gap-1 px-3 py-2 bg-[#131722] border-b border-white/[0.08] text-[10px] sm:text-[11px] font-mono font-bold tracking-wider text-zinc-400 uppercase select-none">
            <div className="col-span-1 text-center">{t.standings.headers.pos}</div>
            <div className="col-span-6 sm:col-span-5">{t.standings.headers.driver}</div>
            <div className="col-span-3 hidden sm:block">{t.standings.headers.team}</div>
            <div className="col-span-3 sm:col-span-2 text-right pr-2 sm:pr-3">{t.standings.headers.points}</div>
            <div className="col-span-2 sm:col-span-1 text-right">{t.standings.headers.wins}</div>
          </div>

          <div className="divide-y divide-white/[0.08]">
            {data.drivers.map((d) => (
              <div
                key={`${d.code}-${d.pos}`}
                className="grid grid-cols-12 gap-1 px-3 py-2.5 items-center hover:bg-white/[0.02] transition-colors"
              >
                {/* Pos */}
                <div className="col-span-1 text-center font-mono text-xs sm:text-sm font-black tabular-nums">
                  <span
                    className={
                      d.pos === 1
                        ? 'text-[#FFD60A]'
                        : d.pos <= 3
                        ? 'text-white'
                        : 'text-zinc-400'
                    }
                  >
                    {d.pos}
                  </span>
                </div>

                {/* Driver */}
                <div className="col-span-6 sm:col-span-5 flex items-center gap-2 overflow-hidden">
                  <span
                    className="w-[3px] h-5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: d.teamColor || '#8E929B' }}
                  />
                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs sm:text-sm font-black text-white tracking-tight uppercase">
                        {d.code}
                      </span>
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
                className="grid grid-cols-12 gap-1 px-3 py-2.5 items-center hover:bg-white/[0.02] transition-colors"
              >
                {/* Pos */}
                <div className="col-span-2 sm:col-span-1 text-center font-mono text-xs sm:text-sm font-black tabular-nums">
                  <span
                    className={
                      c.pos === 1
                        ? 'text-[#FFD60A]'
                        : c.pos <= 3
                        ? 'text-white'
                        : 'text-zinc-400'
                    }
                  >
                    {c.pos}
                  </span>
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
    </div>
  );
};
