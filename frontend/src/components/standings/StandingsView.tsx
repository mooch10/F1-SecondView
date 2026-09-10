import React, { useEffect, useState } from 'react';
import { Award, Trophy, Users } from 'lucide-react';
import { fetchStandings } from '../../services/api';
import type { StandingsData } from '../../types/f1';

export const StandingsView: React.FC = () => {
  const [data, setData] = useState<StandingsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [subTab, setSubTab] = useState<'drivers' | 'constructors'>('drivers');

  useEffect(() => {
    fetchStandings().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="bg-[#131722] border border-white/[0.08] rounded-xl p-12 text-center text-zinc-500">
        <Trophy className="w-8 h-8 text-zinc-600 mx-auto mb-2 animate-spin" />
        <span className="text-xs">Cargando clasificaciones del campeonato...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-[#131722] border border-white/[0.08] rounded-xl p-8 text-center text-zinc-500 text-sm">
        No hay datos de campeonato disponibles.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Sub-tab Selector */}
      <div className="flex bg-[#131722] border border-white/[0.08] p-1 rounded-xl shadow-sm gap-1">
        <button
          type="button"
          onClick={() => setSubTab('drivers')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
            subTab === 'drivers'
              ? 'bg-[#1C2230] text-white border border-white/[0.12] shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Award className="w-4 h-4 text-[#FFD60A]" />
          <span>Campeonato de Pilotos</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('constructors')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
            subTab === 'constructors'
              ? 'bg-[#1C2230] text-white border border-white/[0.12] shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Users className="w-4 h-4 text-[#27F4D2]" />
          <span>Campeonato de Constructores</span>
        </button>
      </div>

      {/* DRIVERS TABLE (Promiedos Style) */}
      {subTab === 'drivers' && (
        <div className="bg-[#131722] border border-white/[0.08] rounded-xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-12 gap-1 px-3 py-2 bg-[#1C2230] border-b border-white/[0.08] text-[10px] font-bold tracking-wider uppercase text-zinc-400 font-mono select-none">
            <div className="col-span-1 text-center">POS</div>
            <div className="col-span-6 sm:col-span-5">PILOTO</div>
            <div className="col-span-3 hidden sm:block">EQUIPO</div>
            <div className="col-span-3 sm:col-span-2 text-right">PTS</div>
            <div className="col-span-2 sm:col-span-1 text-right">W</div>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {data.drivers.map((d) => (
              <div
                key={d.code}
                className="grid grid-cols-12 gap-1 px-3 py-2.5 items-center hover:bg-white/[0.02] transition-colors"
              >
                {/* Pos */}
                <div className="col-span-1 text-center font-mono text-sm font-black font-tabular">
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

                {/* Driver with team color indicator */}
                <div className="col-span-6 sm:col-span-5 flex items-center gap-2 overflow-hidden">
                  <span
                    className="w-1 h-6 rounded-full flex-shrink-0"
                    style={{ backgroundColor: d.teamColor || '#71717A' }}
                  />
                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-sm font-bold text-white tracking-tight">
                        {d.code}
                      </span>
                      <span className="text-xs text-zinc-300 font-medium truncate hidden sm:inline">
                        {d.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400 sm:hidden block truncate">
                      {d.team}
                    </span>
                  </div>
                </div>

                {/* Team (Desktop) */}
                <div className="col-span-3 text-xs text-zinc-300 truncate hidden sm:block">
                  {d.team}
                </div>

                {/* Points */}
                <div className="col-span-3 sm:col-span-2 text-right font-mono text-sm font-black text-[#FFD60A] font-tabular">
                  {d.points}
                </div>

                {/* Wins */}
                <div className="col-span-2 sm:col-span-1 text-right font-mono text-xs text-zinc-400 font-tabular">
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
          <div className="grid grid-cols-12 gap-1 px-3 py-2 bg-[#1C2230] border-b border-white/[0.08] text-[10px] font-bold tracking-wider uppercase text-zinc-400 font-mono select-none">
            <div className="col-span-2 sm:col-span-1 text-center">POS</div>
            <div className="col-span-6 sm:col-span-7">CONSTRUCTOR</div>
            <div className="col-span-2 text-right">PTS</div>
            <div className="col-span-2 text-right">W</div>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {data.constructors.map((c) => (
              <div
                key={c.name}
                className="grid grid-cols-12 gap-1 px-3 py-3 items-center hover:bg-white/[0.02] transition-colors"
              >
                {/* Pos */}
                <div className="col-span-2 sm:col-span-1 text-center font-mono text-sm font-black font-tabular">
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

                {/* Constructor Name with color bar */}
                <div className="col-span-6 sm:col-span-7 flex items-center gap-2.5">
                  <span
                    className="w-1.5 h-6 rounded-full flex-shrink-0"
                    style={{ backgroundColor: c.teamColor || '#71717A' }}
                  />
                  <span className="font-bold text-sm text-white tracking-tight">
                    {c.name}
                  </span>
                </div>

                {/* Points */}
                <div className="col-span-2 text-right font-mono text-sm font-black text-[#FFD60A] font-tabular">
                  {c.points}
                </div>

                {/* Wins */}
                <div className="col-span-2 text-right font-mono text-xs text-zinc-400 font-tabular">
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
