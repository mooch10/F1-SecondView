import React, { useEffect, useState } from 'react';
import {
  X,
  ArrowLeftRight,
  Gauge,
  ChevronDown,
  Activity,
  BarChart2,
  LineChart,
  Swords,
  Zap,
} from 'lucide-react';
import type { DriverLive } from '../../types/f1';
import { useLanguage } from '../../hooks/useLanguage';
import { SectorPill } from '../qualy/SectorPill';
import { TyreBadge } from '../common/TyreBadge';
import { F1_DRIVERS_DATA } from '../../data/f1DriversData';
import { getDriverTelemetry } from '../../data/lastRaceAnalysisData';
import { SpeedTraceChart } from './SpeedTraceChart';

interface HeadToHeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  drivers: DriverLive[];
  driverAId: number | null;
  driverBId: number | null;
  onSelectDriverA: (id: number) => void;
  onSelectDriverB: (id: number) => void;
}

export const HeadToHeadModal: React.FC<HeadToHeadModalProps> = ({
  isOpen,
  onClose,
  drivers,
  driverAId,
  driverBId,
  onSelectDriverA,
  onSelectDriverB,
}) => {
  const { lang, t } = useLanguage();
  const [selectingTarget, setSelectingTarget] = useState<'A' | 'B' | null>(null);
  const [h2hTab, setH2hTab] = useState<'speedTrace' | 'stats'>('speedTrace');

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const effectiveDrivers: DriverLive[] =
    drivers && drivers.length > 0
      ? drivers
      : Object.values(F1_DRIVERS_DATA).map((p, idx) => ({
          pos: idx + 1,
          posChange: 0,
          driverNumber: p.number,
          code: p.code,
          fullName: p.fullName,
          teamName: p.team,
          teamColor: p.teamColor,
          gap: '+0.000',
          interval: '+0.000',
          isDrsZone: false,
          lastLapTime: '--:--.---',
          isFastestLap: false,
          tyre: { compound: 'MEDIUM', laps: 12 },
          pitStops: 1,
          inPit: false,
          status: 'ACTIVE' as const,
        }));

  const driverA = effectiveDrivers.find((d) => d.driverNumber === driverAId) || effectiveDrivers[0] || null;
  const driverB =
    (driverBId !== driverA?.driverNumber && effectiveDrivers.find((d) => d.driverNumber === driverBId)) ||
    effectiveDrivers.find((d) => d.driverNumber !== driverA?.driverNumber) ||
    null;

  const teammateOfA = driverA
    ? effectiveDrivers.find(
        (d) =>
          d.driverNumber !== driverA.driverNumber &&
          d.teamName &&
          driverA.teamName &&
          (d.teamName.toLowerCase() === driverA.teamName.toLowerCase() ||
            d.teamName.toLowerCase().includes(driverA.teamName.toLowerCase()) ||
            driverA.teamName.toLowerCase().includes(d.teamName.toLowerCase()))
      )
    : null;

  const handleSwap = () => {
    if (driverA && driverB) {
      const prevA = driverA.driverNumber;
      const prevB = driverB.driverNumber;
      onSelectDriverA(prevB);
      onSelectDriverB(prevA);
    }
  };

  const parseLapSeconds = (timeStr?: string): number | null => {
    if (!timeStr || timeStr === '--:--.---' || timeStr.includes('PIT')) return null;
    const parts = timeStr.split(':');
    if (parts.length === 2) {
      const mins = parseFloat(parts[0]);
      const secs = parseFloat(parts[1]);
      if (!isNaN(mins) && !isNaN(secs)) {
        return mins * 60 + secs;
      }
    } else {
      const secs = parseFloat(timeStr);
      if (!isNaN(secs)) return secs;
    }
    return null;
  };

  // Gap computation
  const isAdjacent = Math.abs((driverA?.pos ?? 0) - (driverB?.pos ?? 0)) === 1;
  const parseGapSeconds = (gapStr?: string): number | null => {
    if (!gapStr || gapStr === 'LEADER' || gapStr.includes('LAP') || gapStr === 'RET') return null;
    const num = parseFloat(gapStr.replace('+', '').replace('s', ''));
    return isNaN(num) ? null : num;
  };

  const gapA = parseGapSeconds(driverA?.gap);
  const gapB = parseGapSeconds(driverB?.gap);
  let directGap: string | null = null;
  let isCloseBattle = false;

  if (driverA && driverB) {
    if (driverA.pos === driverB.pos) {
      directGap = '0.000s';
    } else if (gapA !== null && gapB !== null) {
      const diff = Math.abs(gapA - gapB);
      directGap = `${diff.toFixed(3)}s`;
      isCloseBattle = diff < 1.0;
    } else if (isAdjacent) {
      const lowerDriver = driverA.pos > driverB.pos ? driverA : driverB;
      const intervalSec = parseGapSeconds(lowerDriver.interval);
      if (intervalSec !== null) {
        directGap = `${intervalSec.toFixed(3)}s`;
        isCloseBattle = intervalSec < 1.0;
      }
    }
  }

  // Lap time comparison
  const secLapA = parseLapSeconds(driverA?.lastLapTime);
  const secLapB = parseLapSeconds(driverB?.lastLapTime);
  let lapDelta: string | null = null;
  let fasterLastLap: 'A' | 'B' | null = null;

  if (secLapA !== null && secLapB !== null) {
    const diff = Math.abs(secLapA - secLapB);
    lapDelta = `${diff.toFixed(3)}s`;
    fasterLastLap = secLapA < secLapB ? 'A' : secLapB < secLapA ? 'B' : null;
  }

  // Tyre age comparison
  const lapsA = driverA?.tyre?.laps ?? 0;
  const lapsB = driverB?.tyre?.laps ?? 0;
  const tyreDiff = Math.abs(lapsA - lapsB);
  const fresherTyreDriver = lapsA < lapsB ? 'A' : lapsB < lapsA ? 'B' : null;

  // 2026 Telemetry & Season Analysis
  const telemA = driverA ? getDriverTelemetry(driverA.code || driverA.driverNumber) : null;
  const telemB = driverB ? getDriverTelemetry(driverB.code || driverB.driverNumber) : null;

  const speedA = driverA?.speedTrap || telemA?.topSpeedKmH || 0;
  const speedB = driverB?.speedTrap || telemB?.topSpeedKmH || 0;
  const speedDelta = Math.abs(speedA - speedB);
  const fasterSpeed = speedA > speedB ? 'A' : speedB > speedA ? 'B' : null;

  const s1A = telemA?.bestSectors.s1 ?? null;
  const s1B = telemB?.bestSectors.s1 ?? null;
  const deltaS1 = s1A !== null && s1B !== null ? s1A - s1B : null;

  const s2A = telemA?.bestSectors.s2 ?? null;
  const s2B = telemB?.bestSectors.s2 ?? null;
  const deltaS2 = s2A !== null && s2B !== null ? s2A - s2B : null;

  const s3A = telemA?.bestSectors.s3 ?? null;
  const s3B = telemB?.bestSectors.s3 ?? null;
  const deltaS3 = s3A !== null && s3B !== null ? s3A - s3B : null;

  const hasLiveSectors = Boolean(
    (driverA?.sectors?.s1 && driverA.sectors.s1 > 0) ||
    (driverB?.sectors?.s1 && driverB.sectors.s1 > 0)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full sm:max-w-lg bg-[#131722] border border-white/[0.12] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-zinc-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08] bg-[#171C28] shrink-0">
          <div className="flex items-center gap-2">
            <Swords className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <h2 className="text-xs font-mono font-black uppercase tracking-wider text-white">
                {t.live.h2h.title}
              </h2>
              <p className="text-[10px] text-zinc-400 font-mono">
                {t.live.h2h.subtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
            aria-label={t.live.h2h.close}
            title={t.live.h2h.close}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Driver Picker Overlay if active */}
        {selectingTarget && (
          <div className="p-3 bg-[#0E1118] border-b border-white/10 shrink-0 max-h-56 overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-bold text-amber-400 uppercase">
                {t.live.h2h.selectDriver} {selectingTarget}:
              </span>
              <button
                type="button"
                onClick={() => setSelectingTarget(null)}
                className="text-[10px] text-zinc-400 hover:text-white font-mono uppercase cursor-pointer"
              >
                ✕ Cancelar
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {effectiveDrivers
                .filter((d) =>
                  selectingTarget === 'A'
                    ? d.driverNumber !== driverB?.driverNumber
                    : d.driverNumber !== driverA?.driverNumber
                )
                .map((d) => (
                  <button
                    key={d.driverNumber}
                    type="button"
                    onClick={() => {
                      if (selectingTarget === 'A') {
                        onSelectDriverA(d.driverNumber);
                      } else {
                        onSelectDriverB(d.driverNumber);
                      }
                      setSelectingTarget(null);
                    }}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-colors cursor-pointer text-xs font-mono ${
                      (selectingTarget === 'A' ? driverA?.driverNumber : driverB?.driverNumber) ===
                      d.driverNumber
                        ? 'bg-white/10 border-white/30 text-white'
                        : 'bg-white/[0.02] border-white/[0.06] text-zinc-300 hover:bg-white/[0.06]'
                    }`}
                  >
                    <span
                      className="w-1.5 h-4 rounded-full shrink-0"
                      style={{ backgroundColor: d.teamColor || '#888' }}
                    />
                    <span className="font-black text-white">{d.pos ? `P${d.pos}` : ''}</span>
                    <span className="font-bold truncate">{d.code}</span>
                    <span className="text-[10px] text-zinc-500 ml-auto">#{d.driverNumber}</span>
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Main Content Area (Scrollable) */}
        <div className="p-4 pb-12 space-y-3.5 overflow-y-auto overscroll-contain">
          {/* Quick Teammate Duel Shortcut */}
          {teammateOfA && (
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-amber-400/10 border border-amber-400/25">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-amber-400 font-bold">
                  {lang === 'es' ? 'Compañero de equipo:' : 'Teammate:'}
                </span>
                <span className="text-white font-bold">
                  {teammateOfA.fullName || teammateOfA.code} (#{teammateOfA.driverNumber})
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onSelectDriverB(teammateOfA.driverNumber);
                  setSelectingTarget(null);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                  driverB?.driverNumber === teammateOfA.driverNumber
                    ? 'bg-amber-400 text-black shadow-sm font-black'
                    : 'bg-white/10 hover:bg-white/20 text-amber-300 border border-amber-400/30'
                }`}
              >
                <Swords className="w-3 h-3 text-amber-400 shrink-0" />
                <span>
                  {driverB?.driverNumber === teammateOfA.driverNumber
                    ? (lang === 'es' ? 'Duelo Activo' : 'Duel Active')
                    : (lang === 'es' ? 'Duelo vs Compañero' : 'Teammate Duel')}
                </span>
              </button>
            </div>
          )}

          {/* Driver Selector Row with Swap */}
          <div className="grid grid-cols-11 gap-1.5 items-center">
            {/* Driver A Card */}
            <div
              onClick={() => setSelectingTarget('A')}
              className="col-span-5 bg-[#171C28] hover:bg-[#1C2232] border border-white/[0.08] hover:border-white/20 rounded-xl p-2.5 cursor-pointer transition-colors relative flex flex-col justify-between min-h-[76px]"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                  {lang === 'es' ? 'PILOTO A' : 'DRIVER A'} <ChevronDown className="w-2.5 h-2.5 text-zinc-500" />
                </span>
                <span className="font-mono text-xs font-black text-amber-300">
                  {driverA ? `P${driverA.pos}` : '-'}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="w-1 h-7 rounded-full shrink-0"
                  style={{ backgroundColor: driverA?.teamColor || '#E10600' }}
                />
                <div className="truncate">
                  <div className="font-mono text-sm font-black text-white tracking-tight flex items-center gap-1">
                    <span>{driverA?.code || '---'}</span>
                    <span className="text-[10px] text-zinc-400 font-normal">
                      #{driverA?.driverNumber}
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-400 truncate">
                    {driverA?.fullName || '---'}
                  </div>
                </div>
              </div>
            </div>

            {/* Swap Button */}
            <div className="col-span-1 flex justify-center">
              <button
                type="button"
                onClick={handleSwap}
                title={t.live.h2h.swapDrivers}
                className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.14] border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Driver B Card */}
            <div
              onClick={() => setSelectingTarget('B')}
              className="col-span-5 bg-[#171C28] hover:bg-[#1C2232] border border-white/[0.08] hover:border-white/20 rounded-xl p-2.5 cursor-pointer transition-colors relative flex flex-col justify-between min-h-[76px]"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                  {lang === 'es' ? 'PILOTO B' : 'DRIVER B'} <ChevronDown className="w-2.5 h-2.5 text-zinc-500" />
                </span>
                <span className="font-mono text-xs font-black text-amber-300">
                  {driverB ? `P${driverB.pos}` : '-'}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="w-1 h-7 rounded-full shrink-0"
                  style={{ backgroundColor: driverB?.teamColor || '#3671C6' }}
                />
                <div className="truncate">
                  <div className="font-mono text-sm font-black text-white tracking-tight flex items-center gap-1">
                    <span>{driverB?.code || '---'}</span>
                    <span className="text-[10px] text-zinc-400 font-normal">
                      #{driverB?.driverNumber}
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-400 truncate">
                    {driverB?.fullName || '---'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gap / Interval Banner */}
          <div className="bg-[#171C28] border border-white/[0.08] rounded-xl p-3 text-center">
            <div className="text-[10px] font-mono uppercase font-bold text-zinc-400 tracking-wider">
              {t.live.h2h.gapBetween}
            </div>
            <div className="flex items-center justify-center gap-2 mt-1 font-mono">
              <span className="text-xl sm:text-2xl font-black text-white font-tabular">
                {directGap || '---'}
              </span>
              {driverA && driverB && driverA.pos !== driverB.pos && (
                <span className="text-xs font-bold text-zinc-400">
                  ({driverA.pos < driverB.pos ? driverA.code : driverB.code}{' '}
                  {t.live.h2h.ahead})
                </span>
              )}
            </div>

            {/* Close Battle Alert (< 1.0s) - Overtake Mode */}
            {isCloseBattle && (
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <Zap className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>{t.live.h2h.closeBattle}</span>
              </div>
            )}
          </div>

          {/* Tyre Strategy Comparison */}
          <div className="bg-[#171C28] border border-white/[0.08] rounded-xl p-3">
            <div className="text-[10px] font-mono uppercase font-bold text-zinc-400 tracking-wider mb-2">
              {t.live.h2h.tyresTitle}
            </div>
            <div className="grid grid-cols-2 gap-2 text-center items-center">
              <div className="bg-[#131722] border border-white/[0.04] rounded-lg p-2 flex flex-col items-center">
                <span className="text-[10px] font-mono text-zinc-400 mb-1">
                  {driverA?.code || 'A'}
                </span>
                <TyreBadge tyre={driverA?.tyre} lang={lang} />
              </div>
              <div className="bg-[#131722] border border-white/[0.04] rounded-lg p-2 flex flex-col items-center">
                <span className="text-[10px] font-mono text-zinc-400 mb-1">
                  {driverB?.code || 'B'}
                </span>
                <TyreBadge tyre={driverB?.tyre} lang={lang} />
              </div>
            </div>

            {/* Tyre Delta Explanation */}
            {driverA?.tyre && driverB?.tyre && (
              <div className="mt-2 text-center text-[10px] font-mono text-zinc-300 bg-white/[0.02] border border-white/[0.04] rounded-lg py-1 px-2">
                {tyreDiff > 0 && fresherTyreDriver ? (
                  <span>
                    <strong className="text-emerald-400">
                      {fresherTyreDriver === 'A' ? driverA.code : driverB.code}
                    </strong>{' '}
                    {lang === 'es' ? 'tiene neumáticos' : 'has tyres'}{' '}
                    <strong className="text-white">{tyreDiff}</strong>{' '}
                    {lang === 'es'
                      ? tyreDiff === 1
                        ? 'vuelta más nuevos'
                        : 'vueltas más nuevos'
                      : tyreDiff === 1
                      ? 'lap fresher'
                      : 'laps fresher'}
                  </span>
                ) : (
                  <span>{t.live.h2h.sameTyreAge}</span>
                )}
              </div>
            )}
          </div>

          {/* Lap Times Comparison */}
          <div className="bg-[#171C28] border border-white/[0.08] rounded-xl p-3">
            <div className="text-[10px] font-mono uppercase font-bold text-zinc-400 tracking-wider mb-2">
              {t.live.h2h.lastLap} & {t.live.h2h.bestLap}
            </div>
            <div className="space-y-2">
              {/* Last Lap Row */}
              <div className="grid grid-cols-2 gap-2 font-mono text-xs text-center">
                <div
                  className={`p-2 rounded-lg border ${
                    fasterLastLap === 'A'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-[#131722] border-white/[0.04] text-zinc-300'
                  }`}
                >
                  <div className="text-[9px] text-zinc-500 uppercase">{t.live.h2h.lastLap}</div>
                  <div className="font-bold text-sm font-tabular mt-0.5">
                    {driverA?.lastLapTime || '--:--.---'}
                  </div>
                  {fasterLastLap === 'A' && lapDelta && (
                    <div className="text-[9px] text-emerald-400 font-bold mt-0.5">
                      -{lapDelta} {t.live.h2h.fasterLap}
                    </div>
                  )}
                </div>

                <div
                  className={`p-2 rounded-lg border ${
                    fasterLastLap === 'B'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-[#131722] border-white/[0.04] text-zinc-300'
                  }`}
                >
                  <div className="text-[9px] text-zinc-500 uppercase">{t.live.h2h.lastLap}</div>
                  <div className="font-bold text-sm font-tabular mt-0.5">
                    {driverB?.lastLapTime || '--:--.---'}
                  </div>
                  {fasterLastLap === 'B' && lapDelta && (
                    <div className="text-[9px] text-emerald-400 font-bold mt-0.5">
                      -{lapDelta} {t.live.h2h.fasterLap}
                    </div>
                  )}
                </div>
              </div>

              {/* Best Lap Row */}
              <div className="grid grid-cols-2 gap-2 font-mono text-xs text-center">
                <div className="bg-[#131722] border border-white/[0.04] rounded-lg p-2">
                  <div className="text-[9px] text-zinc-500 uppercase">{t.live.h2h.bestLap}</div>
                  <div className="font-bold text-xs text-zinc-200 font-tabular mt-0.5">
                    {driverA?.bestLapTime || '--:--.---'}
                  </div>
                </div>

                <div className="bg-[#131722] border border-white/[0.04] rounded-lg p-2">
                  <div className="text-[9px] text-zinc-500 uppercase">{t.live.h2h.bestLap}</div>
                  <div className="font-bold text-xs text-zinc-200 font-tabular mt-0.5">
                    {driverB?.bestLapTime || '--:--.---'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Telemetría Delta & Rendimiento */}
          {telemA && telemB && (
            <div className="bg-[#171C28] border border-white/[0.08] rounded-xl p-3.5 space-y-3">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-amber-300 uppercase tracking-wider">
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.live.h2h.telemetryDeltaTitle}</span>
                </div>
                {/* Pill Switcher */}
                <div className="flex items-center bg-black/40 p-0.5 rounded-lg border border-white/[0.08] text-[10px] font-mono">
                  <button
                    type="button"
                    onClick={() => setH2hTab('speedTrace')}
                    className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      h2hTab === 'speedTrace'
                        ? 'bg-white/20 text-white shadow-xs'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <LineChart className="w-3 h-3 shrink-0" />
                    <span>Speed Trace</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setH2hTab('stats')}
                    className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      h2hTab === 'stats'
                        ? 'bg-white/20 text-white shadow-xs'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <BarChart2 className="w-3 h-3 shrink-0" />
                    <span>{lang === 'es' ? 'Sectores' : 'Sectors'}</span>
                  </button>
                </div>
              </div>

              {h2hTab === 'speedTrace' && driverA && driverB ? (
                <SpeedTraceChart
                  driverA={driverA}
                  driverB={driverB}
                  telemA={telemA}
                  telemB={telemB}
                />
              ) : (
                <>
                  {/* Speed Trap Delta Bar */}
              <div className="space-y-1.5 font-mono">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white">{speedA.toFixed(1)} km/h</span>
                    {fasterSpeed === 'A' && speedDelta > 0 && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        +{speedDelta.toFixed(1)}
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Gauge className="w-3 h-3 text-[#27F4D2]" /> {t.live.h2h.topSpeed}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {fasterSpeed === 'B' && speedDelta > 0 && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        +{speedDelta.toFixed(1)}
                      </span>
                    )}
                    <span className="font-bold text-white">{speedB.toFixed(1)} km/h</span>
                  </div>
                </div>

                {/* Progress proportion bar */}
                <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden flex">
                  <div
                    className="h-full transition-all duration-300 rounded-l-full"
                    style={{
                      width: `${(speedA / (speedA + speedB)) * 100}%`,
                      backgroundColor: driverA?.teamColor || '#E10600',
                    }}
                  />
                  <div
                    className="h-full transition-all duration-300 rounded-r-full"
                    style={{
                      width: `${(speedB / (speedA + speedB)) * 100}%`,
                      backgroundColor: driverB?.teamColor || '#3671C6',
                    }}
                  />
                </div>
              </div>

              {/* Sector Micro-Deltas */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-wider text-center">
                  {lang === 'es' ? 'Micro-Deltas por Sector (Mejor Vuelta)' : 'Sector Micro-Deltas (Best Lap)'}
                </div>
                <div className="grid grid-cols-3 gap-1.5 font-mono text-center">
                  {/* S1 */}
                  <div className="bg-[#131722] border border-white/[0.06] rounded-lg p-1.5">
                    <span className="text-[9px] text-zinc-500 block font-bold">S1</span>
                    <div className="flex items-center justify-between text-[11px] mt-0.5 text-zinc-300">
                      <span>{s1A?.toFixed(3)}</span>
                      <span>{s1B?.toFixed(3)}</span>
                    </div>
                    {deltaS1 !== null && (
                      <div className={`text-[9px] font-bold mt-1 px-1 py-0.5 rounded ${
                        deltaS1 < 0
                          ? 'text-emerald-400 bg-emerald-500/10'
                          : deltaS1 > 0
                          ? 'text-amber-400 bg-amber-500/10'
                          : 'text-zinc-400'
                      }`}>
                        {deltaS1 < 0
                          ? `◄ ${(Math.abs(deltaS1)).toFixed(3)}s`
                          : deltaS1 > 0
                          ? `${(Math.abs(deltaS1)).toFixed(3)}s ►`
                          : '= 0.000s'}
                      </div>
                    )}
                  </div>

                  {/* S2 */}
                  <div className="bg-[#131722] border border-white/[0.06] rounded-lg p-1.5">
                    <span className="text-[9px] text-zinc-500 block font-bold">S2</span>
                    <div className="flex items-center justify-between text-[11px] mt-0.5 text-zinc-300">
                      <span>{s2A?.toFixed(3)}</span>
                      <span>{s2B?.toFixed(3)}</span>
                    </div>
                    {deltaS2 !== null && (
                      <div className={`text-[9px] font-bold mt-1 px-1 py-0.5 rounded ${
                        deltaS2 < 0
                          ? 'text-emerald-400 bg-emerald-500/10'
                          : deltaS2 > 0
                          ? 'text-amber-400 bg-amber-500/10'
                          : 'text-zinc-400'
                      }`}>
                        {deltaS2 < 0
                          ? `◄ ${(Math.abs(deltaS2)).toFixed(3)}s`
                          : deltaS2 > 0
                          ? `${(Math.abs(deltaS2)).toFixed(3)}s ►`
                          : '= 0.000s'}
                      </div>
                    )}
                  </div>

                  {/* S3 */}
                  <div className="bg-[#131722] border border-white/[0.06] rounded-lg p-1.5">
                    <span className="text-[9px] text-zinc-500 block font-bold">S3</span>
                    <div className="flex items-center justify-between text-[11px] mt-0.5 text-zinc-300">
                      <span>{s3A?.toFixed(3)}</span>
                      <span>{s3B?.toFixed(3)}</span>
                    </div>
                    {deltaS3 !== null && (
                      <div className={`text-[9px] font-bold mt-1 px-1 py-0.5 rounded ${
                        deltaS3 < 0
                          ? 'text-emerald-400 bg-emerald-500/10'
                          : deltaS3 > 0
                          ? 'text-amber-400 bg-amber-500/10'
                          : 'text-zinc-400'
                      }`}>
                        {deltaS3 < 0
                          ? `◄ ${(Math.abs(deltaS3)).toFixed(3)}s`
                          : deltaS3 > 0
                          ? `${(Math.abs(deltaS3)).toFixed(3)}s ►`
                          : '= 0.000s'}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 2026 Championship Head-to-Head Grid */}
              <div className="pt-2 border-t border-white/[0.06] space-y-1 font-mono text-[11px]">
                {/* Laps Led */}
                <div className="flex items-center justify-between py-0.5 px-2 rounded bg-black/20">
                  <span className={`font-bold tabular-nums ${telemA.lapsLedSeason > telemB.lapsLedSeason ? 'text-amber-400' : 'text-zinc-300'}`}>
                    {telemA.lapsLedSeason}
                  </span>
                  <span className="text-[10px] text-zinc-400 uppercase font-medium">{t.live.h2h.lapsLed}</span>
                  <span className={`font-bold tabular-nums ${telemB.lapsLedSeason > telemA.lapsLedSeason ? 'text-amber-400' : 'text-zinc-300'}`}>
                    {telemB.lapsLedSeason}
                  </span>
                </div>

                {/* Podiums & Wins */}
                <div className="flex items-center justify-between py-0.5 px-2 rounded bg-black/20">
                  <span className="font-bold text-zinc-300 tabular-nums">
                    {telemA.podiumsSeason} <span className="text-[9px] text-zinc-500">({telemA.winsSeason} W)</span>
                  </span>
                  <span className="text-[10px] text-zinc-400 uppercase font-medium">
                    {t.live.h2h.podiums} / {t.live.h2h.wins}
                  </span>
                  <span className="font-bold text-zinc-300 tabular-nums">
                    {telemB.podiumsSeason} <span className="text-[9px] text-zinc-500">({telemB.winsSeason} W)</span>
                  </span>
                </div>

                {/* Qualy / Finish Avg */}
                <div className="flex items-center justify-between py-0.5 px-2 rounded bg-black/20">
                  <span className="font-bold text-zinc-300 tabular-nums">
                    P{telemA.avgQualyPos.toFixed(1)} / P{telemA.avgFinishPos.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-zinc-400 uppercase font-medium">
                    {t.live.h2h.avgQualy} / {t.live.h2h.avgFinish}
                  </span>
                  <span className="font-bold text-zinc-300 tabular-nums">
                    P{telemB.avgQualyPos.toFixed(1)} / P{telemB.avgFinishPos.toFixed(1)}
                  </span>
                </div>

                {/* Championship Points */}
                <div className="flex items-center justify-between py-0.5 px-2 rounded bg-black/20">
                  <span className={`font-bold tabular-nums ${telemA.pointsSeason > telemB.pointsSeason ? 'text-amber-400' : 'text-zinc-300'}`}>
                    {telemA.pointsSeason} pts
                  </span>
                  <span className="text-[10px] text-zinc-400 uppercase font-medium">{t.live.h2h.seasonPoints}</span>
                  <span className={`font-bold tabular-nums ${telemB.pointsSeason > telemA.pointsSeason ? 'text-amber-400' : 'text-zinc-300'}`}>
                    {telemB.pointsSeason} pts
                  </span>
                </div>
              </div>
                </>
              )}
            </div>
          )}

          {/* Sectors Comparison (Only if active live sectors available) */}
          {hasLiveSectors && (
            <div className="bg-[#171C28] border border-white/[0.08] rounded-xl p-3">
              <div className="text-[10px] font-mono uppercase font-bold text-zinc-400 tracking-wider mb-2">
                {t.live.h2h.sectorsTitle}
              </div>
              <div className="space-y-1.5">
                {/* Sector 1 */}
                <div className="grid grid-cols-7 gap-1 items-center font-mono text-xs text-center">
                  <div className="col-span-3">
                    <SectorPill
                      sectorNumber={1}
                      time={driverA?.sectors?.s1}
                      status={driverA?.sectors?.s1Status}
                      compact
                    />
                  </div>
                  <div className="col-span-1 text-[10px] font-bold text-zinc-400">S1</div>
                  <div className="col-span-3">
                    <SectorPill
                      sectorNumber={1}
                      time={driverB?.sectors?.s1}
                      status={driverB?.sectors?.s1Status}
                      compact
                    />
                  </div>
                </div>

                {/* Sector 2 */}
                <div className="grid grid-cols-7 gap-1 items-center font-mono text-xs text-center">
                  <div className="col-span-3">
                    <SectorPill
                      sectorNumber={2}
                      time={driverA?.sectors?.s2}
                      status={driverA?.sectors?.s2Status}
                      compact
                    />
                  </div>
                  <div className="col-span-1 text-[10px] font-bold text-zinc-400">S2</div>
                  <div className="col-span-3">
                    <SectorPill
                      sectorNumber={2}
                      time={driverB?.sectors?.s2}
                      status={driverB?.sectors?.s2Status}
                      compact
                    />
                  </div>
                </div>

                {/* Sector 3 */}
                <div className="grid grid-cols-7 gap-1 items-center font-mono text-xs text-center">
                  <div className="col-span-3">
                    <SectorPill
                      sectorNumber={3}
                      time={driverA?.sectors?.s3}
                      status={driverA?.sectors?.s3Status}
                      compact
                    />
                  </div>
                  <div className="col-span-1 text-[10px] font-bold text-zinc-400">S3</div>
                  <div className="col-span-3">
                    <SectorPill
                      sectorNumber={3}
                      time={driverB?.sectors?.s3}
                      status={driverB?.sectors?.s3Status}
                      compact
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pit Stops */}
          <div className="bg-[#171C28] border border-white/[0.08] rounded-xl p-3 text-center">
            <div className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
              {t.live.h2h.pitStops}
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-xs">
              <div>
                <span className="text-[10px] text-zinc-500">{driverA?.code}</span>
                <div className="font-bold text-zinc-200">
                  {driverA?.pitStops ?? 0} {driverA?.pitStops === 1 ? t.live.h2h.stop : t.live.h2h.stops}
                </div>
                {driverA?.lastPitStopDuration ? (
                  <div className="text-[10px] text-zinc-400 mt-0.5">
                    {lang === 'es' ? 'Última: ' : 'Last: '}
                    <span className="text-white font-bold">{driverA.lastPitStopDuration.toFixed(2)}s</span>
                    {driverA.lastPitLaneTime ? ` (${driverA.lastPitLaneTime.toFixed(1)}s)` : ''}
                  </div>
                ) : null}
              </div>
              <div>
                <span className="text-[10px] text-zinc-500">{driverB?.code}</span>
                <div className="font-bold text-zinc-200">
                  {driverB?.pitStops ?? 0} {driverB?.pitStops === 1 ? t.live.h2h.stop : t.live.h2h.stops}
                </div>
                {driverB?.lastPitStopDuration ? (
                  <div className="text-[10px] text-zinc-400 mt-0.5">
                    {lang === 'es' ? 'Última: ' : 'Last: '}
                    <span className="text-white font-bold">{driverB.lastPitStopDuration.toFixed(2)}s</span>
                    {driverB.lastPitLaneTime ? ` (${driverB.lastPitLaneTime.toFixed(1)}s)` : ''}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="p-3 border-t border-white/[0.08] bg-[#171C28] shrink-0 text-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-bold transition-colors cursor-pointer border border-white/10"
          >
            {t.live.h2h.close}
          </button>
        </div>
      </div>
    </div>
  );
};
