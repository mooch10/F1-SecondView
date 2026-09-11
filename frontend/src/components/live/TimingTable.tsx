import { useState } from 'react';
import { ChevronDown, ChevronUp, Gauge, Zap } from 'lucide-react';
import type { DriverLive, TyreCompound } from '../../types/f1';

interface TimingTableProps {
  drivers: DriverLive[];
}

export const TimingTable: React.FC<TimingTableProps> = ({ drivers }) => {
  const [expandedDriver, setExpandedDriver] = useState<number | null>(null);

  const toggleExpand = (driverNumber: number) => {
    setExpandedDriver((prev) => (prev === driverNumber ? null : driverNumber));
  };

  const getTyreBadge = (tyre: { compound: TyreCompound; laps: number } | null) => {
    if (!tyre) return null;
    const compound = tyre.compound.toUpperCase();
    let letter = 'H';
    let colorClass = 'border-white text-white bg-white/10';

    if (compound.includes('SOFT')) {
      letter = 'S';
      colorClass = 'border-red-500 text-red-400 bg-red-500/10';
    } else if (compound.includes('MEDIUM')) {
      letter = 'M';
      colorClass = 'border-amber-400 text-amber-300 bg-amber-400/10';
    } else if (compound.includes('HARD')) {
      letter = 'H';
      colorClass = 'border-zinc-200 text-zinc-100 bg-white/10';
    } else if (compound.includes('INTER')) {
      letter = 'I';
      colorClass = 'border-emerald-400 text-emerald-300 bg-emerald-400/10';
    } else if (compound.includes('WET')) {
      letter = 'W';
      colorClass = 'border-blue-500 text-blue-400 bg-blue-500/10';
    }

    return (
      <span
        className={`inline-flex items-center justify-center font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border ${colorClass}`}
        title={`Neumático ${tyre.compound} (${tyre.laps} vueltas)`}
      >
        <span className="font-extrabold">{letter}</span>
        <span className="text-[8px] opacity-70 ml-0.5 font-tabular">{tyre.laps}v</span>
      </span>
    );
  };

  const isDrsDanger = (interval: string, isDrsZone: boolean) => {
    if (isDrsZone) return true;
    if (!interval || interval === 'LEADER' || interval.includes('LAP')) return false;
    const num = parseFloat(interval.replace('+', '').replace('s', ''));
    return !isNaN(num) && num > 0 && num < 1.0;
  };

  if (!drivers || drivers.length === 0) {
    return (
      <div className="bg-[#131722] border border-white/[0.08] rounded-xl p-8 text-center text-zinc-500 text-sm">
        No hay datos de telemetría disponibles en este momento.
      </div>
    );
  }

  const isDriverRetired = (d: DriverLive) =>
    d.status === 'DNF' ||
    d.status === 'DNS' ||
    d.status === 'DSQ' ||
    d.gap === 'RET' ||
    d.interval === 'RET' ||
    d.pos >= 90;

  const activeDrivers = drivers.filter((d) => !isDriverRetired(d));
  const retiredDrivers = drivers.filter((d) => isDriverRetired(d));

  return (
    <div className="bg-[#131722] border border-white/[0.08] rounded-xl shadow-lg overflow-hidden">
      {/* Table Header (Promiedos Style) */}
      <div className="grid grid-cols-12 gap-1 px-3 py-2 bg-[#1C2230] border-b border-white/[0.08] text-[10px] font-bold tracking-wider uppercase text-zinc-400 font-mono select-none">
        <div className="col-span-1 text-center">POS</div>
        <div className="col-span-4 sm:col-span-3">PILOTO</div>
        <div className="col-span-2 text-center">GOMA / PIT</div>
        <div className="col-span-3 text-right">GAP / INT</div>
        <div className="col-span-2 sm:col-span-3 text-right">VUELTA</div>
      </div>

      {/* Active Driver Rows (P1..P19) */}
      <div className="divide-y divide-white/[0.04]">
        {activeDrivers.map((d) => {
          const isExpanded = expandedDriver === d.driverNumber;
          const drsActive = isDrsDanger(d.interval, d.isDrsZone);

          return (
            <div key={d.driverNumber} className="flex flex-col">
              {/* Level 1: Main Row (Tap to expand) */}
              <button
                type="button"
                onClick={() => toggleExpand(d.driverNumber)}
                className={`w-full text-left grid grid-cols-12 gap-1 px-3 py-2.5 items-center transition-colors select-none ${
                  isExpanded ? 'bg-white/[0.05]' : 'hover:bg-white/[0.02]'
                } ${drsActive ? 'bg-emerald-950/10' : ''}`}
              >
                {/* Pos & Movement */}
                <div className="col-span-1 flex items-center justify-center gap-0.5">
                  <span
                    className={`font-mono text-sm font-black font-tabular ${
                      d.pos === 1
                        ? 'text-[#FFD60A]'
                        : d.pos <= 3
                        ? 'text-white'
                        : 'text-zinc-300'
                    }`}
                  >
                    {d.pos}
                  </span>
                  {d.posChange > 0 && (
                    <span className="text-[9px] text-emerald-400 font-bold font-mono leading-none">
                      ▲{d.posChange}
                    </span>
                  )}
                  {d.posChange < 0 && (
                    <span className="text-[9px] text-rose-400 font-bold font-mono leading-none">
                      ▼{Math.abs(d.posChange)}
                    </span>
                  )}
                </div>

                {/* Team stripe + Code & Number */}
                <div className="col-span-4 sm:col-span-3 flex items-center gap-2 overflow-hidden">
                  <span
                    className="w-1 h-6 rounded-full flex-shrink-0"
                    style={{ backgroundColor: d.teamColor || '#E10600' }}
                  />
                  <div className="flex flex-col leading-tight truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-sm font-bold text-white tracking-tight">
                        {d.code}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        #{d.driverNumber}
                      </span>
                      {d.inPit && (
                        <span className="px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold border border-amber-500/30">
                          PIT
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-zinc-400 truncate hidden sm:block">
                      {d.fullName}
                    </span>
                  </div>
                </div>

                {/* Tyre Compound Badge + Pit Stops Count Badge (1P, 2P) */}
                <div className="col-span-2 flex items-center justify-center gap-1.5">
                  {getTyreBadge(d.tyre) || (
                    <span className="text-[10px] text-zinc-600 font-mono">-</span>
                  )}
                  <span
                    className={`inline-flex items-center justify-center font-mono text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                      d.inPit
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse'
                        : (d.pitStops ?? 0) > 0
                          ? 'bg-[#1C2230] text-zinc-200 border-white/[0.12] shadow-xs'
                          : 'bg-[#0B0E14] text-zinc-500 border-white/[0.05]'
                    }`}
                    title={
                      d.inPit
                        ? 'En calle de boxes'
                        : `${d.pitStops ?? 0} ${d.pitStops === 1 ? 'parada' : 'paradas'} en boxes`
                    }
                  >
                    {d.inPit ? 'BOX' : `${d.pitStops ?? 0}P`}
                  </span>
                </div>

                {/* Gap & Interval (DRS highlight) */}
                <div className="col-span-3 text-right flex flex-col justify-center leading-tight">
                  <span className="font-mono text-xs font-semibold text-zinc-200 font-tabular truncate">
                    {d.gap}
                  </span>
                  {d.interval && d.interval !== 'LEADER' && (
                    <span
                      className={`font-mono text-[10px] font-tabular flex items-center justify-end gap-0.5 ${
                        drsActive
                          ? 'text-[#27F4D2] font-extrabold animate-pulse'
                          : 'text-zinc-500'
                      }`}
                    >
                      {drsActive && <Zap className="w-2.5 h-2.5 fill-[#27F4D2]" />}
                      {d.interval}
                    </span>
                  )}
                </div>

                {/* Last Lap & Fastest Lap Badge */}
                <div className="col-span-2 sm:col-span-3 text-right flex items-center justify-end gap-1.5">
                  <div className="flex flex-col leading-tight">
                    <span
                      className={`font-mono text-xs font-tabular ${
                        d.isFastestLap
                          ? 'text-purple-400 font-extrabold'
                          : 'text-zinc-300'
                      }`}
                    >
                      {d.lastLapTime || '--:--.---'}
                    </span>
                    {d.isFastestLap && (
                      <span className="text-[9px] font-bold text-purple-400 uppercase tracking-tighter">
                        V. Rápida 🟣
                      </span>
                    )}
                  </div>
                  <div className="text-zinc-500 hidden sm:block">
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </div>
                </div>
              </button>

              {/* Level 2: Expanded Micro-Sectors & Details */}
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
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-zinc-400">
                        Paradas: <strong className="text-white">{d.pitStops ?? 0}</strong>
                      </span>
                      {d.status !== 'ACTIVE' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          {d.status}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Sectors and Speed Trap Grid */}
                  <div className="grid grid-cols-4 gap-2 text-center font-mono">
                    <div className="bg-[#131722] border border-white/[0.06] rounded-lg p-2">
                      <span className="text-[10px] text-zinc-500 block uppercase font-sans">
                        Sector 1
                      </span>
                      <span className="font-bold text-zinc-200 text-xs font-tabular">
                        {d.sectors?.s1 ? `${d.sectors.s1}s` : '--.---'}
                      </span>
                    </div>

                    <div className="bg-[#131722] border border-white/[0.06] rounded-lg p-2">
                      <span className="text-[10px] text-zinc-500 block uppercase font-sans">
                        Sector 2
                      </span>
                      <span className="font-bold text-zinc-200 text-xs font-tabular">
                        {d.sectors?.s2 ? `${d.sectors.s2}s` : '--.---'}
                      </span>
                    </div>

                    <div className="bg-[#131722] border border-white/[0.06] rounded-lg p-2">
                      <span className="text-[10px] text-zinc-500 block uppercase font-sans">
                        Sector 3
                      </span>
                      <span className="font-bold text-zinc-200 text-xs font-tabular">
                        {d.sectors?.s3 ? `${d.sectors.s3}s` : '--.---'}
                      </span>
                    </div>

                    <div className="bg-[#131722] border border-white/[0.06] rounded-lg p-2 flex flex-col items-center justify-center">
                      <span className="text-[10px] text-zinc-500 block uppercase font-sans flex items-center gap-1">
                        <Gauge className="w-2.5 h-2.5 text-[#27F4D2]" /> Trap
                      </span>
                      <span className="font-bold text-[#27F4D2] text-xs font-tabular">
                        {d.speedTrap ? `${d.speedTrap} km/h` : '---'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Abandonos / DNF Segregated Section */}
      {retiredDrivers.length > 0 && (
        <div className="border-t-2 border-white/[0.1] bg-[#0E1118]">
          {/* Section Header */}
          <div className="flex items-center justify-between px-3 py-2 bg-[#171B26] border-b border-white/[0.08] select-none">
            <div className="flex items-center gap-2 font-mono text-[10px] font-bold tracking-wider text-rose-400 uppercase">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>Abandonos / DNF</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30 tracking-widest uppercase">
              {retiredDrivers.length} {retiredDrivers.length === 1 ? 'PILOTO' : 'PILOTOS'}
            </span>
          </div>

          {/* Retired Driver Rows */}
          <div className="divide-y divide-white/[0.04]">
            {retiredDrivers.map((d) => {
              const isExpanded = expandedDriver === d.driverNumber;

              return (
                <div
                  key={d.driverNumber}
                  className="flex flex-col opacity-85 hover:opacity-100 transition-opacity"
                >
                  <button
                    type="button"
                    onClick={() => toggleExpand(d.driverNumber)}
                    className={`w-full text-left grid grid-cols-12 gap-1 px-3 py-2.5 items-center transition-colors select-none ${
                      isExpanded ? 'bg-white/[0.05]' : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    {/* DNF Badge in Position column */}
                    <div className="col-span-1 flex items-center justify-center">
                      <span className="font-mono text-[10px] font-black text-rose-400 bg-rose-500/15 px-1 py-0.5 rounded border border-rose-500/30">
                        DNF
                      </span>
                    </div>

                    {/* Team stripe + Code & Number */}
                    <div className="col-span-4 sm:col-span-3 flex items-center gap-2 overflow-hidden">
                      <span
                        className="w-1 h-6 rounded-full flex-shrink-0"
                        style={{ backgroundColor: d.teamColor || '#71717A' }}
                      />
                      <div className="flex flex-col leading-tight truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-sm font-bold text-zinc-300 tracking-tight">
                            {d.code}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            #{d.driverNumber}
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-400 truncate hidden sm:block">
                          {d.fullName}
                        </span>
                      </div>
                    </div>

                    {/* Tyre Compound Badge + Pit */}
                    <div className="col-span-2 flex items-center justify-center gap-1.5">
                      {getTyreBadge(d.tyre) || (
                        <span className="text-[10px] text-zinc-600 font-mono">-</span>
                      )}
                      <span className="inline-flex items-center justify-center font-mono text-[9px] font-bold px-1.5 py-0.5 rounded border bg-[#0B0E14] text-zinc-500 border-white/[0.05]">
                        {d.pitStops ?? 0}P
                      </span>
                    </div>

                    {/* Retired Lap / Status */}
                    <div className="col-span-2 text-right flex flex-col justify-center leading-tight">
                      <span className="font-mono text-xs font-semibold text-zinc-300">
                        {d.retiredLap ? `Vta ${d.retiredLap}` : 'RET'}
                      </span>
                      <span className="text-[9px] text-zinc-500 font-mono">
                        RETIRO
                      </span>
                    </div>

                    {/* Retirement Cause Badge */}
                    <div className="col-span-3 text-right flex items-center justify-end gap-1.5">
                      <span
                        className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium text-rose-300 bg-rose-500/10 border border-rose-500/20 truncate max-w-[130px] sm:max-w-[180px]"
                        title={d.retirementReason || 'Abandono'}
                      >
                        {d.retirementReason || 'Abandono'}
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

                  {/* Level 2: Expanded Details for Retired Driver */}
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
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          {d.retirementReason ? `DNF • ${d.retirementReason}` : 'DNF'}
                        </span>
                      </div>
                      <div className="text-zinc-400 text-xs font-mono">
                        Cese de telemetría registrado en la vuelta{' '}
                        <strong className="text-white">{d.retiredLap || '--'}</strong>. Motivo:{' '}
                        <span className="text-rose-300 font-semibold">
                          {d.retirementReason || 'Abandono'}
                        </span>
                        .
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
