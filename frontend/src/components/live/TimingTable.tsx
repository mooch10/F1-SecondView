import { useState } from 'react';
import { ChevronDown, ChevronUp, Gauge, Zap } from 'lucide-react';
import type { DriverLive, SessionType, TyreCompound } from '../../types/f1';
import { useLanguage } from '../../hooks/useLanguage';
import { MiniSectorsBar } from '../qualy/MiniSectorsBar';
import { SectorPill } from '../qualy/SectorPill';

interface TimingTableProps {
  drivers: DriverLive[];
  sessionType?: SessionType;
}

const F1_POINTS: Record<number, number> = {
  1: 25,
  2: 18,
  3: 15,
  4: 12,
  5: 10,
  6: 8,
  7: 6,
  8: 4,
  9: 2,
  10: 1,
};

export const TimingTable: React.FC<TimingTableProps> = ({
  drivers,
  sessionType = 'Race',
}) => {
  const { lang, t } = useLanguage();
  const [expandedDriver, setExpandedDriver] = useState<number | null>(null);

  const isQualy = sessionType === 'Qualifying';
  const isRace = sessionType !== 'Qualifying' && sessionType !== 'Practice';

  const toggleExpand = (driverNumber: number) => {
    setExpandedDriver((prev) => (prev === driverNumber ? null : driverNumber));
  };

  const getTyreBadge = (tyre: { compound: TyreCompound; laps: number } | null) => {
    if (!tyre) return null;
    const compound = tyre.compound.toUpperCase();
    let letter = 'H';
    let ringClass = 'border-white text-white bg-white/10';

    if (compound.includes('SOFT')) {
      letter = 'S';
      ringClass = 'border-[#FF3B30] text-[#FF3B30] bg-[#FF3B30]/10';
    } else if (compound.includes('MEDIUM')) {
      letter = 'M';
      ringClass = 'border-[#FFD60A] text-[#FFD60A] bg-[#FFD60A]/10';
    } else if (compound.includes('HARD')) {
      letter = 'H';
      ringClass = 'border-white text-white bg-white/10';
    } else if (compound.includes('INTER')) {
      letter = 'I';
      ringClass = 'border-[#34C759] text-[#34C759] bg-[#34C759]/10';
    } else if (compound.includes('WET')) {
      letter = 'W';
      ringClass = 'border-[#007AFF] text-[#007AFF] bg-[#007AFF]/10';
    }

    return (
      <div
        className="inline-flex items-center gap-1.5 select-none"
        title={
          lang === 'es'
            ? `Compuesto Pirelli ${tyre.compound} (${tyre.laps} vueltas)`
            : `Pirelli compound ${tyre.compound} (${tyre.laps} laps)`
        }
      >
        {/* Círculo oficial Pirelli con la letra S / M / H / I / W */}
        <span
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center font-mono font-black text-[11px] leading-none shrink-0 ${ringClass}`}
        >
          {letter}
        </span>
        {/* Vueltas al costado, bien legible (ej: 38v / 38l) */}
        <span className="font-mono text-xs font-bold text-zinc-300 tabular-nums">
          {tyre.laps}{lang === 'es' ? 'v' : 'l'}
        </span>
      </div>
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
        {lang === 'es'
          ? 'No hay datos de telemetría disponibles en este momento.'
          : 'No telemetry data available at this moment.'}
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
      {/* Table Header (Polymorphic: Qualy vs Race) */}
      {isQualy ? (
        <div className="grid grid-cols-12 gap-1 px-3 py-2 bg-[#1C2230] border-b border-white/[0.08] text-[10px] font-bold tracking-wider uppercase text-zinc-400 font-mono select-none items-center">
          <div className="col-span-1 text-center">{t.live.table.pos}</div>
          <div className="col-span-3 sm:col-span-3">{t.live.table.driver}</div>
          <div className="col-span-5 sm:col-span-5 text-center">
            <span className="hidden sm:inline">SECTORES & MINI-SECTORES</span>
            <span className="sm:hidden">SECTORES</span>
          </div>
          <div className="col-span-3 sm:col-span-3 text-right">{lang === 'es' ? 'TIEMPO / GAP' : 'TIME / GAP'}</div>
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-1 px-3 py-2 bg-[#1C2230] border-b border-white/[0.08] text-[10px] font-bold tracking-wider uppercase text-zinc-400 font-mono select-none">
          <div className="col-span-1 text-center">{t.live.table.pos}</div>
          <div className="col-span-4 sm:col-span-3">{t.live.table.driver}</div>
          <div className="col-span-2 sm:col-span-2 text-center">{t.live.table.tyre}</div>
          <div className="col-span-1 sm:col-span-1 text-center">{t.live.table.pit}</div>
          <div className="col-span-2 sm:col-span-3 text-right">GAP / INT</div>
          <div className="col-span-2 sm:col-span-2 text-right">{t.live.table.lastLap}</div>
        </div>
      )}

      {/* Active Driver Rows (P1..P19) */}
      <div className="divide-y divide-white/[0.04]">
        {activeDrivers.map((d, index) => {
          const isExpanded = expandedDriver === d.driverNumber;
          const drsActive = !isQualy && isDrsDanger(d.interval, d.isDrsZone);
          const prevDriver = index > 0 ? activeDrivers[index - 1] : null;
          const isPointsZone = isRace && d.pos <= 10;
          const basePoints = isRace ? F1_POINTS[d.pos] || 0 : 0;
          const hasFastestLapBonus = isRace && d.isFastestLap && d.pos <= 10;
          const totalPoints = basePoints + (hasFastestLapBonus ? 1 : 0);
          const showPointsCutoff = isRace && d.pos > 10 && (!prevDriver || prevDriver.pos <= 10);
          const showQ2Cutoff = isQualy && d.pos > 10 && (!prevDriver || prevDriver.pos <= 10);
          const showQ1Cutoff = isQualy && d.pos > 15 && (!prevDriver || prevDriver.pos <= 15);

          return (
            <div key={d.driverNumber} className="flex flex-col">
              {/* Reborde verde divisorio que delimita la zona de puntos (Top 10) */}
              {showPointsCutoff && (
                <div className="h-[2px] bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.5)] my-0" />
              )}

              {/* Línea divisoria de corte Q2 (eliminación P11 a P15) */}
              {showQ2Cutoff && (
                <div className="h-[2px] bg-rose-500/80 shadow-[0_0_8px_rgba(244,63,94,0.5)] my-0" />
              )}

              {/* Línea divisoria de corte Q1 (eliminación P16 a P20) */}
              {showQ1Cutoff && (
                <div className="h-[2px] bg-rose-500/80 shadow-[0_0_8px_rgba(244,63,94,0.5)] my-0" />
              )}

              {/* Level 1: Main Row (Tap to expand) */}
              <button
                type="button"
                onClick={() => toggleExpand(d.driverNumber)}
                className={`w-full text-left grid grid-cols-12 gap-1 px-3 py-2.5 items-center transition-colors select-none ${
                  isExpanded ? 'bg-white/[0.05]' : 'hover:bg-white/[0.02]'
                } ${drsActive ? 'bg-emerald-950/10' : ''} ${
                  isPointsZone ? 'border-l-2 border-emerald-500/60' : 'border-l-2 border-transparent'
                }`}
              >
                {/* Pos & Movement (Posición fija e inmutable; badge flotante sin desplazamiento) */}
                <div className="col-span-1 flex items-center justify-center">
                  <div className="relative flex items-center justify-center w-5">
                    <span
                      className={`font-mono text-sm font-black font-tabular text-center ${
                        d.pos === 1
                          ? 'text-[#FFD60A]'
                          : d.pos <= 3
                          ? 'text-white'
                          : isPointsZone
                          ? 'text-emerald-300'
                          : 'text-zinc-400'
                      }`}
                    >
                      {d.pos}
                    </span>
                    {!isQualy && d.posChange > 0 && (
                      <span
                        className="absolute left-full ml-0.5 top-1/2 -translate-y-1/2 text-[9px] text-emerald-400 font-bold font-mono leading-none whitespace-nowrap select-none"
                        title={lang === 'es' ? `Largó P${d.gridPosition ?? d.pos}` : `Started P${d.gridPosition ?? d.pos}`}
                      >
                        ▲{d.posChange}
                      </span>
                    )}
                    {!isQualy && d.posChange < 0 && (
                      <span
                        className="absolute left-full ml-0.5 top-1/2 -translate-y-1/2 text-[9px] text-rose-400 font-bold font-mono leading-none whitespace-nowrap select-none"
                        title={lang === 'es' ? `Largó P${d.gridPosition ?? d.pos}` : `Started P${d.gridPosition ?? d.pos}`}
                      >
                        ▼{Math.abs(d.posChange)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Team stripe + Code & Number */}
                <div
                  className={`${
                    isQualy ? 'col-span-3 sm:col-span-3' : 'col-span-4 sm:col-span-3'
                  } flex items-center gap-1.5 sm:gap-2 overflow-hidden`}
                >
                  <span
                    className="w-1 h-6 rounded-full flex-shrink-0"
                    style={{ backgroundColor: d.teamColor || '#E10600' }}
                  />
                  <div className="flex flex-col leading-tight truncate">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono text-sm font-bold text-white tracking-tight">
                        {d.code}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        #{d.driverNumber}
                      </span>
                      {/* Official Championship Points Badge in Race (incluye punto de Vuelta Rápida en Top 10) */}
                      {isRace && totalPoints > 0 && (
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-black border tracking-tight shrink-0 select-none shadow-xs ${
                            hasFastestLapBonus
                              ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                              : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          }`}
                          title={
                            hasFastestLapBonus
                              ? lang === 'es'
                                ? `Zona de puntos: +${basePoints} pts (P${d.pos}) + 1 pt (Vuelta Rápida) = +${totalPoints} pts`
                                : `Points zone: +${basePoints} pts (P${d.pos}) + 1 pt (Fastest Lap) = +${totalPoints} pts`
                              : lang === 'es'
                              ? `Zona de puntos: +${basePoints} pts para el Campeonato Mundial`
                              : `Points zone: +${basePoints} pts for World Championship`
                          }
                        >
                          +{totalPoints} PTS
                        </span>
                      )}
                      {/* Active FIA Penalty Badge in Race (En rojo oficial de sanción) */}
                      {!isQualy && d.penaltySeconds && d.penaltySeconds > 0 && (
                        <span
                          className="px-1.5 py-0.5 rounded text-[9px] font-mono font-black bg-rose-500/20 text-rose-400 border border-rose-500/40 tracking-tight shrink-0 select-none shadow-xs"
                          title={lang === 'es' ? `Penalización oficial FIA: +${d.penaltySeconds}s` : `Official FIA penalty: +${d.penaltySeconds}s`}
                        >
                          +{d.penaltySeconds}s {t.live.table.penalty}
                        </span>
                      )}
                      {/* Elimination Phase Tag in Qualy */}
                      {isQualy && d.eliminatedPhase && (
                        <span className="px-1 py-0.2 rounded text-[8px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          {d.eliminatedPhase}
                        </span>
                      )}
                      {d.inPit && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-zinc-800 text-zinc-400 border border-white/10 shrink-0">
                          PIT
                        </span>
                      )}
                      {/* DRS Activated Pill Badge in Race */}
                      {drsActive && (
                        <span
                          className="px-1.5 py-0.5 rounded text-[9px] font-mono font-black bg-emerald-500/25 text-emerald-300 border border-emerald-500/50 animate-pulse tracking-widest shrink-0 shadow-xs"
                          title={
                            lang === 'es'
                              ? 'Zona DRS activa (< 1.0s del auto de adelante)'
                              : 'Active DRS zone (< 1.0s from car ahead)'
                          }
                        >
                          DRS
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-zinc-400 truncate hidden sm:block">
                      {d.fullName}
                    </span>
                  </div>
                </div>

                {isQualy ? (
                  <>
                    {/* Qualy Sectors & Mini-Sectors Center Column */}
                    <div className="col-span-5 sm:col-span-5 flex flex-col items-center justify-center gap-1 px-0.5 sm:px-1">
                      <div className="flex items-center justify-center gap-0.5 sm:gap-1 w-full flex-nowrap">
                        <SectorPill
                          sectorNumber={1}
                          time={d.sectors?.s1}
                          status={d.sectors?.s1Status}
                          compact
                        />
                        <SectorPill
                          sectorNumber={2}
                          time={d.sectors?.s2}
                          status={d.sectors?.s2Status}
                          compact
                        />
                        <SectorPill
                          sectorNumber={3}
                          time={d.sectors?.s3}
                          status={d.sectors?.s3Status}
                          compact
                        />
                      </div>
                      <div className="w-full max-w-[240px]">
                        <MiniSectorsBar segments={d.sectors?.segments} />
                      </div>
                    </div>

                    {/* Qualy MEJOR TIEMPO / GAP */}
                    <div className="col-span-3 sm:col-span-3 text-right flex items-center justify-end gap-1.5">
                      <div className="flex flex-col leading-tight">
                        <span
                          className={`font-mono text-xs font-tabular ${
                            d.isPole
                              ? 'text-[#FFD60A] font-black'
                              : 'text-zinc-100 font-bold'
                          }`}
                        >
                          {d.bestLapTime || d.lastLapTime || '--:--.---'}
                        </span>
                        <span
                          className={`font-mono text-[10px] font-tabular ${
                            d.isPole ? 'text-[#FFD60A] font-bold' : 'text-zinc-400'
                          }`}
                        >
                          {d.gap}
                        </span>
                      </div>
                      <div className="text-zinc-500">
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Columna GOMA: Círculo Oficial Pirelli (letra S/M/H/I/W) + xxV al costado */}
                    <div className="col-span-2 sm:col-span-2 flex items-center justify-center">
                      {getTyreBadge(d.tyre) || (
                        <span className="text-[10px] text-zinc-600 font-mono">-</span>
                      )}
                    </div>

                    {/* Race PIT Stop Counter */}
                    <div className="col-span-1 sm:col-span-1 flex items-center justify-center">
                      {d.inPit ? (
                        <span
                          className="px-1.5 py-0.5 rounded text-[9px] font-mono font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse"
                          title={lang === 'es' ? 'En calle de boxes' : 'In pit lane'}
                        >
                          {lang === 'es' ? 'BOX' : 'PIT'}
                        </span>
                      ) : (
                        <span
                          className={`inline-flex items-center justify-center font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${
                            (d.pitStops ?? 0) > 0
                              ? 'bg-[#1C2230] text-zinc-200 border-white/[0.12] shadow-xs'
                              : 'bg-[#0B0E14] text-zinc-500 border-white/[0.05]'
                          }`}
                          title={
                            lang === 'es'
                              ? `${d.pitStops ?? 0} ${d.pitStops === 1 ? 'parada' : 'paradas'} en boxes`
                              : `${d.pitStops ?? 0} pit ${d.pitStops === 1 ? 'stop' : 'stops'}`
                          }
                        >
                          {d.pitStops ?? 0}P
                        </span>
                      )}
                    </div>

                    {/* Race Gap & Interval (DRS highlight) */}
                    <div className="col-span-2 sm:col-span-3 text-right flex flex-col justify-center leading-tight">
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

                    {/* Race Last Lap & Fastest Lap Badge */}
                    <div className="col-span-2 sm:col-span-2 text-right flex items-center justify-end gap-1.5">
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
                            {t.live.table.fastestLap}
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
                  </>
                )}
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
                    <div className="flex items-center gap-2 flex-wrap">
                      {isRace && (
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                            totalPoints > 0
                              ? hasFastestLapBonus
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                                : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                              : 'bg-white/[0.04] text-zinc-500 border border-white/[0.06]'
                          }`}
                        >
                          {totalPoints > 0
                            ? hasFastestLapBonus
                              ? `+${basePoints} PTS (P${d.pos}) + 1 PT (${lang === 'es' ? 'V. RÁPIDA' : 'FASTEST LAP'}) = ${totalPoints} PTS`
                              : `+${totalPoints} ${t.live.table.pointsChampionship}`
                            : d.isFastestLap
                            ? lang === 'es'
                              ? 'V. RÁPIDA (0 PTS · FUERA DEL TOP 10)'
                              : 'FASTEST LAP (0 PTS · OUT OF TOP 10)'
                            : t.live.table.outOfPoints}
                        </span>
                      )}
                      {!isQualy && d.penaltySeconds && d.penaltySeconds > 0 && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-rose-500/20 text-rose-400 border border-rose-500/40">
                          {lang === 'es' ? 'PENALIZACIÓN' : 'PENALTY'}: +{d.penaltySeconds}s
                        </span>
                      )}
                      <span className="font-mono text-[10px] text-zinc-400">
                        {t.live.table.pitStops} <strong className="text-white">{d.pitStops ?? 0}</strong>
                      </span>
                      {d.status !== 'ACTIVE' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          {d.status}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Detailed Mini-Sectors Bar */}
                  <MiniSectorsBar segments={d.sectors?.segments} detailed />

                  {/* Sectors and Speed Trap Grid with SectorPill */}
                  <div className="grid grid-cols-3 gap-2">
                    <SectorPill
                      sectorNumber={1}
                      time={d.sectors?.s1}
                      status={d.sectors?.s1Status}
                    />
                    <SectorPill
                      sectorNumber={2}
                      time={d.sectors?.s2}
                      status={d.sectors?.s2Status}
                    />
                    <SectorPill
                      sectorNumber={3}
                      time={d.sectors?.s3}
                      status={d.sectors?.s3Status}
                    />
                  </div>

                  {/* Speed Traps & Telemetry Grid */}
                  <div className="grid grid-cols-3 gap-2 font-mono text-center">
                    <div className="bg-[#131722] border border-white/[0.06] rounded-lg p-2 flex flex-col items-center justify-center">
                      <span className="text-[10px] text-zinc-500 uppercase flex items-center gap-1">
                        <Gauge className="w-2.5 h-2.5 text-[#27F4D2]" /> Speed Trap
                      </span>
                      <span className="font-bold text-[#27F4D2] text-xs font-tabular mt-0.5">
                        {d.speedTrap ? `${d.speedTrap} km/h` : '---'}
                      </span>
                    </div>

                    <div className="bg-[#131722] border border-white/[0.06] rounded-lg p-2 flex flex-col items-center justify-center">
                      <span className="text-[10px] text-zinc-500 uppercase">
                        Trap Sector 1 (I1)
                      </span>
                      <span className="font-bold text-zinc-300 text-xs font-tabular mt-0.5">
                        {d.i1Speed ? `${d.i1Speed} km/h` : '---'}
                      </span>
                    </div>

                    <div className="bg-[#131722] border border-white/[0.06] rounded-lg p-2 flex flex-col items-center justify-center">
                      <span className="text-[10px] text-zinc-500 uppercase">
                        Trap Sector 2 (I2)
                      </span>
                      <span className="font-bold text-zinc-300 text-xs font-tabular mt-0.5">
                        {d.i2Speed ? `${d.i2Speed} km/h` : '---'}
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
              <span>{lang === 'es' ? 'Abandonos / DNF' : 'Retirements / DNF'}</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30 tracking-widest uppercase">
              {retiredDrivers.length} {retiredDrivers.length === 1 ? (lang === 'es' ? 'PILOTO' : 'DRIVER') : (lang === 'es' ? 'PILOTOS' : 'DRIVERS')}
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

                    {/* Columna GOMA: Círculo Oficial Pirelli + Vueltas */}
                    <div className="col-span-2 sm:col-span-2 flex items-center justify-center">
                      {getTyreBadge(d.tyre) || (
                        <span className="text-[10px] text-zinc-600 font-mono">-</span>
                      )}
                    </div>

                    {/* Columna PIT: Separada, conteo de paradas */}
                    <div className="col-span-1 sm:col-span-1 flex items-center justify-center">
                      <span className="inline-flex items-center justify-center font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-md border bg-[#0B0E14] text-zinc-500 border-white/[0.05]">
                        {d.pitStops ?? 0}P
                      </span>
                    </div>

                    {/* Retired Lap / Status */}
                    <div className="col-span-2 sm:col-span-2 text-right flex flex-col justify-center leading-tight">
                      <span className="font-mono text-xs font-semibold text-zinc-300">
                        {d.retiredLap ? `${lang === 'es' ? 'Vta' : 'Lap'} ${d.retiredLap}` : 'RET'}
                      </span>
                      <span className="text-[9px] text-zinc-500 font-mono">
                        {lang === 'es' ? 'RETIRO' : 'RETIRED'}
                      </span>
                    </div>

                    {/* Retirement Cause Badge */}
                    <div className="col-span-2 sm:col-span-3 text-right flex items-center justify-end gap-1.5">
                      <span
                        className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium text-rose-300 bg-rose-500/10 border border-rose-500/20 truncate max-w-[120px] sm:max-w-[170px]"
                        title={d.retirementReason || (lang === 'es' ? 'Abandono' : 'Retired')}
                      >
                        {d.retirementReason || (lang === 'es' ? 'Abandono' : 'Retired')}
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
                        {lang === 'es' ? (
                          <>
                            Cese de telemetría registrado en la vuelta{' '}
                            <strong className="text-white">{d.retiredLap || '--'}</strong>. Motivo:{' '}
                            <span className="text-rose-300 font-semibold">
                              {d.retirementReason || 'Abandono'}
                            </span>
                            .
                          </>
                        ) : (
                          <>
                            Telemetry loss recorded on lap{' '}
                            <strong className="text-white">{d.retiredLap || '--'}</strong>. Reason:{' '}
                            <span className="text-rose-300 font-semibold">
                              {d.retirementReason || 'Retired'}
                            </span>
                            .
                          </>
                        )}
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
