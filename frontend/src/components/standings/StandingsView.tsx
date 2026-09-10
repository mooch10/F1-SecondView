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
      <div className="bg-[#14161A] border border-[#22262E] rounded-sm p-12 text-center text-[#8E929B] font-mono text-xs">
        <Trophy className="w-6 h-6 text-[#8E929B] mx-auto mb-2 animate-pulse" />
        <span>CARGANDO CLASIFICACIONES DE CAMPEONATO...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-[#14161A] border border-[#22262E] rounded-sm p-8 text-center text-[#8E929B] font-mono text-xs">
        SIN DATOS DE CAMPEONATO DISPONIBLES
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Broadcast Style Sub-Tabs */}
      <div className="flex gap-6 border-b border-[#22262E] px-1">
        <button
          type="button"
          onClick={() => setSubTab('drivers')}
          className={`flex items-center gap-2 py-2 text-xs font-mono uppercase tracking-wider font-semibold transition-all border-b-2 ${
            subTab === 'drivers'
              ? 'text-[#F5F5F7] border-[#E10600]'
              : 'text-[#8E929B] hover:text-[#F5F5F7] border-transparent'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-[#FFD800]" />
          <span>Campeonato de Pilotos</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('constructors')}
          className={`flex items-center gap-2 py-2 text-xs font-mono uppercase tracking-wider font-semibold transition-all border-b-2 ${
            subTab === 'constructors'
              ? 'text-[#F5F5F7] border-[#E10600]'
              : 'text-[#8E929B] hover:text-[#F5F5F7] border-transparent'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-[#27F4D2]" />
          <span>Campeonato de Constructores</span>
        </button>
      </div>

      {/* DRIVERS TABLE */}
      {subTab === 'drivers' && (
        <div className="bg-[#14161A] border border-[#22262E] rounded-sm overflow-hidden">
          <div className="grid grid-cols-12 gap-1 px-3 py-2 bg-[#14161A] border-b border-[#22262E] text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-[#8E929B] uppercase select-none">
            <div className="col-span-1 text-center">POS</div>
            <div className="col-span-6 sm:col-span-5">PILOTO</div>
            <div className="col-span-3 hidden sm:block">EQUIPO</div>
            <div className="col-span-3 sm:col-span-2 text-right">PTS</div>
            <div className="col-span-2 sm:col-span-1 text-right">W</div>
          </div>

          <div className="divide-y divide-[#22262E]">
            {data.drivers.map((d) => (
              <div
                key={d.code}
                className="grid grid-cols-12 gap-1 px-3 py-2.5 items-center hover:bg-white/[0.02] transition-colors"
              >
                {/* Pos */}
                <div className="col-span-1 text-center font-mono text-xs sm:text-sm font-black tabular-nums">
                  <span
                    className={
                      d.pos === 1
                        ? 'text-[#FFD800]'
                        : d.pos <= 3
                        ? 'text-[#F5F5F7]'
                        : 'text-[#8E929B]'
                    }
                  >
                    {d.pos}
                  </span>
                </div>

                {/* Driver */}
                <div className="col-span-6 sm:col-span-5 flex items-center gap-2 overflow-hidden">
                  <span
                    className="w-[3px] h-5 rounded-none flex-shrink-0"
                    style={{ backgroundColor: d.teamColor || '#8E929B' }}
                  />
                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs sm:text-sm font-black text-[#F5F5F7] tracking-tight uppercase">
                        {d.code}
                      </span>
                      <span className="text-xs text-[#8E929B] font-medium truncate hidden sm:inline">
                        {d.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#8E929B] font-mono sm:hidden block truncate">
                      {d.team}
                    </span>
                  </div>
                </div>

                {/* Team (Desktop) */}
                <div className="col-span-3 text-xs text-[#8E929B] font-mono truncate hidden sm:block">
                  {d.team}
                </div>

                {/* Points */}
                <div className="col-span-3 sm:col-span-2 text-right font-mono text-xs sm:text-sm font-bold text-[#FFD800] tabular-nums">
                  {d.points}
                </div>

                {/* Wins */}
                <div className="col-span-2 sm:col-span-1 text-right font-mono text-xs text-[#8E929B] tabular-nums">
                  {d.wins}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONSTRUCTORS TABLE */}
      {subTab === 'constructors' && (
        <div className="bg-[#14161A] border border-[#22262E] rounded-sm overflow-hidden">
          <div className="grid grid-cols-12 gap-1 px-3 py-2 bg-[#14161A] border-b border-[#22262E] text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-[#8E929B] uppercase select-none">
            <div className="col-span-2 sm:col-span-1 text-center">POS</div>
            <div className="col-span-6 sm:col-span-7">CONSTRUCTOR</div>
            <div className="col-span-2 text-right">PTS</div>
            <div className="col-span-2 text-right">W</div>
          </div>

          <div className="divide-y divide-[#22262E]">
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
                        ? 'text-[#FFD800]'
                        : c.pos <= 3
                        ? 'text-[#F5F5F7]'
                        : 'text-[#8E929B]'
                    }
                  >
                    {c.pos}
                  </span>
                </div>

                {/* Team Name with line indicator */}
                <div className="col-span-6 sm:col-span-7 flex items-center gap-2.5">
                  <span
                    className="w-[3px] h-5 rounded-none flex-shrink-0"
                    style={{ backgroundColor: c.teamColor || '#8E929B' }}
                  />
                  <span className="font-bold text-xs sm:text-sm text-[#F5F5F7] tracking-tight uppercase">
                    {c.name}
                  </span>
                </div>

                {/* Points */}
                <div className="col-span-2 text-right font-mono text-xs sm:text-sm font-bold text-[#FFD800] tabular-nums">
                  {c.points}
                </div>

                {/* Wins */}
                <div className="col-span-2 text-right font-mono text-xs text-[#8E929B] tabular-nums">
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
