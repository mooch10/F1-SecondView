import React, { useEffect, useMemo, useState } from 'react';
import { Award, Calendar, GraduationCap, Medal, ShieldCheck, Trophy, Users, Wrench, Zap } from 'lucide-react';
import { fetchDriverChanges, fetchStandings } from '../../services/api';
import type { DriverChangeAlert, DriverLive, StandingsData } from '../../types/f1';
import { useLanguage } from '../../hooks/useLanguage';
import { useSeries } from '../../hooks/useSeries';
import { DriverChangesAlert } from './DriverChangesAlert';
import { DriverProfileModal } from '../drivers/DriverProfileModal';
import { getDriverProfile, enrichDriverProfileWithSeason, type F1DriverProfile } from '../../data/f1DriversData';
import { DRIVER_ACADEMY_MAP, F1_ACADEMIES } from '../../data/juniorGraduatesData';
import { JuniorGraduatesView } from './JuniorGraduatesView';
import { JuniorTechSpecsModal } from './JuniorTechSpecsModal';
import { PowerUnitTracker } from './PowerUnitTracker';

interface StandingsViewProps {
  liveDrivers?: DriverLive[];
  isLiveActive?: boolean;
  initialSeasonYear?: number;
}

const F1_POINTS_SYSTEM = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

const MIN_SEASON_YEAR: Record<string, number> = {
  f1: 1950,
  f2: 2017,
  f3: 2019,
};

const QUICK_PILL_SEASONS: Record<string, number[]> = {
  f1: [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014],
  f2: [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017],
  f3: [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019],
};

const matchConstructorTeam = (liveTeam: string, constrName: string): boolean => {
  const lt = (liveTeam || '').toLowerCase();
  const cn = (constrName || '').toLowerCase();
  if (!lt || !cn) return false;
  if (lt.includes(cn) || cn.includes(lt)) return true;
  if (cn.includes('red bull') && lt.includes('red bull')) return true;
  if (cn.includes('mercedes') && lt.includes('mercedes')) return true;
  if (cn.includes('ferrari') && lt.includes('ferrari')) return true;
  if (cn.includes('mclaren') && lt.includes('mclaren')) return true;
  if (cn.includes('aston martin') && lt.includes('aston')) return true;
  if (cn.includes('alpine') && lt.includes('alpine')) return true;
  if (cn.includes('williams') && lt.includes('williams')) return true;
  if (cn.includes('haas') && lt.includes('haas')) return true;
  if (cn.includes('sauber') && (lt.includes('sauber') || lt.includes('audi'))) return true;
  if (cn.includes('audi') && (lt.includes('audi') || lt.includes('sauber'))) return true;
  if (cn.includes('racing bulls') && (lt.includes('racing bulls') || lt.includes('rb'))) return true;
  if (cn.includes('rb') && (lt.includes('rb') || lt.includes('racing bulls'))) return true;
  return false;
};

export const StandingsView: React.FC<StandingsViewProps> = ({
  liveDrivers = [],
  isLiveActive = false,
  initialSeasonYear,
}) => {
  const { t, lang } = useLanguage();
  const { series, theme } = useSeries();
  const [data, setData] = useState<StandingsData | null>(null);
  const [driverChanges, setDriverChanges] = useState<DriverChangeAlert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [subTab, setSubTab] = useState<'drivers' | 'constructors' | 'pu-tracker'>('drivers');
  const [juniorTab, setJuniorTab] = useState<'standings' | 'graduates'>('standings');
  const [selectedSeasonYear, setSelectedSeasonYear] = useState<number>(initialSeasonYear || 2026);
  const [selectedAcademyFilter, setSelectedAcademyFilter] = useState<string>('all');
  const [isTechSpecsOpen, setIsTechSpecsOpen] = useState<boolean>(false);
  const [isLiveVirtual, setIsLiveVirtual] = useState<boolean>(false);

  const minYear = MIN_SEASON_YEAR[series] || 2026;
  const activeYear =
    selectedSeasonYear >= minYear && selectedSeasonYear <= 2026 ? selectedSeasonYear : 2026;

  // Power Unit Tracker is strictly available for 2026 season. Derive effective subtab directly without cascading render.
  const effectiveSubTab = activeYear !== 2026 && subTab === 'pu-tracker' ? 'drivers' : subTab;

  // Generate list of all supported years for current series (descending)
  const allSeriesYears = useMemo(() => {
    const list: number[] = [];
    for (let y = 2026; y >= minYear; y--) {
      list.push(y);
    }
    return list;
  }, [minYear]);

  // Quick pills to display: base pills plus the activeYear if user picked an older year from the dropdown
  const pillsToRender = useMemo(() => {
    const base = QUICK_PILL_SEASONS[series] || [2026];
    if (!base.includes(activeYear)) {
      return [activeYear, ...base];
    }
    return base;
  }, [series, activeYear]);

  const isVirtualActive = series === 'f1' && activeYear === 2026 && isLiveActive && isLiveVirtual;

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

  const renderPosBadge = (pos: number | null | undefined, fallbackIndex?: number) => {
    const displayPos = (typeof pos === 'number' && pos > 0) ? pos : (fallbackIndex || '-');
    if (displayPos === 1) {
      return (
        <span className="inline-flex items-center justify-center gap-0.5 sm:gap-1 px-1 py-0.5 sm:px-1.5 sm:py-0.5 rounded font-mono text-[10px] sm:text-xs font-black bg-amber-400/20 text-amber-400 border border-amber-400/40 shadow-[0_0_8px_rgba(251,191,36,0.25)]">
          <Trophy className="w-2.5 h-2.5 text-amber-400 shrink-0" /> <span>{displayPos}</span>
        </span>
      );
    }
    if (displayPos === 2) {
      return (
        <span className="inline-flex items-center justify-center gap-0.5 sm:gap-1 px-1 py-0.5 sm:px-1.5 sm:py-0.5 rounded font-mono text-[10px] sm:text-xs font-black bg-slate-300/15 text-slate-200 border border-slate-300/30">
          <Medal className="w-2.5 h-2.5 text-slate-300 shrink-0" /> <span>{displayPos}</span>
        </span>
      );
    }
    if (displayPos === 3) {
      return (
        <span className="inline-flex items-center justify-center gap-0.5 sm:gap-1 px-1 py-0.5 sm:px-1.5 sm:py-0.5 rounded font-mono text-[10px] sm:text-xs font-black bg-amber-700/15 text-amber-500 border border-amber-700/30">
          <Medal className="w-2.5 h-2.5 text-amber-600 shrink-0" /> <span>{displayPos}</span>
        </span>
      );
    }
    return <span className="text-[10px] sm:text-xs text-zinc-600 dark:text-zinc-400 font-bold">{displayPos}</span>;
  };

  const renderRankDiff = (diff: number) => {
    if (diff > 0) {
      return (
        <span className="inline-flex items-center text-[10px] font-mono font-black text-emerald-400">
          ▲{diff}
        </span>
      );
    }
    if (diff < 0) {
      return (
        <span className="inline-flex items-center text-[10px] font-mono font-black text-rose-400">
          ▼{Math.abs(diff)}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center text-[10px] font-mono text-zinc-500">
        =
      </span>
    );
  };

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setLoading(true);
    });
    const targetYear = activeYear;
    Promise.all([
      fetchStandings(series, targetYear),
      series !== 'f1' ? fetchDriverChanges(series) : Promise.resolve([]),
    ]).then(([standingsRes, changesRes]) => {
      if (!cancelled) {
        setData(standingsRes);
        setDriverChanges(changesRes);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [series, activeYear]);

  // Virtual points calculation for Drivers
  const processedDrivers = useMemo(() => {
    if (!data?.drivers) return [];
    if (!isVirtualActive || !liveDrivers || liveDrivers.length === 0) {
      return data.drivers.map((d, index) => ({
        ...d,
        virtualPos: (typeof d.pos === 'number' && d.pos > 0) ? d.pos : (index + 1),
        provisionalPoints: 0,
        totalPoints: d.points,
        rankDiff: 0,
        liveTrackPos: undefined as number | undefined,
      }));
    }

    const calculated = data.drivers.map((d, index) => {
      const ld = liveDrivers.find(
        (l) =>
          (l.code && d.code && l.code.toUpperCase() === d.code.toUpperCase()) ||
          (d.name && l.fullName && l.fullName.toLowerCase().includes(d.name.toLowerCase()))
      );

      let provisionalPoints = 0;
      let liveTrackPos: number | undefined = undefined;

      if (ld && ld.status !== 'DNF' && ld.status !== 'DNS' && ld.status !== 'DSQ') {
        liveTrackPos = ld.pos;
        if (ld.pos >= 1 && ld.pos <= 10) {
          provisionalPoints = F1_POINTS_SYSTEM[ld.pos - 1] || 0;
        }
      }

      const basePos = (typeof d.pos === 'number' && d.pos > 0) ? d.pos : (index + 1);

      return {
        ...d,
        pos: basePos,
        provisionalPoints,
        totalPoints: d.points + provisionalPoints,
        liveTrackPos,
      };
    });

    calculated.sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) {
        return b.totalPoints - a.totalPoints;
      }
      if (b.wins !== a.wins) {
        return b.wins - a.wins;
      }
      return a.pos - b.pos;
    });

    return calculated.map((d, index) => {
      const virtualPos = index + 1;
      const rankDiff = d.pos - virtualPos;
      return {
        ...d,
        virtualPos,
        rankDiff,
      };
    });
  }, [data, isVirtualActive, liveDrivers]);

  // Filtered Drivers based on Academy filter (for F2 / F3)
  const filteredDrivers = useMemo(() => {
    if (series === 'f1' || selectedAcademyFilter === 'all') {
      return processedDrivers;
    }
    return processedDrivers.filter((d) => {
      const acadId = DRIVER_ACADEMY_MAP[d.code?.toUpperCase() || ''] || 'independent';
      return acadId === selectedAcademyFilter;
    });
  }, [processedDrivers, series, selectedAcademyFilter]);

  // Virtual points calculation for Constructors
  const processedConstructors = useMemo(() => {
    if (!data?.constructors) return [];
    if (!isVirtualActive || !liveDrivers || liveDrivers.length === 0) {
      return data.constructors.map((c, index) => ({
        ...c,
        virtualPos: (typeof c.pos === 'number' && c.pos > 0) ? c.pos : (index + 1),
        provisionalPoints: 0,
        totalPoints: c.points,
        rankDiff: 0,
      }));
    }

    const calculated = data.constructors.map((c, index) => {
      const teamDrivers = liveDrivers.filter(
        (ld) =>
          ld.status !== 'DNF' &&
          ld.status !== 'DNS' &&
          ld.status !== 'DSQ' &&
          matchConstructorTeam(ld.teamName, c.name)
      );

      const provisionalPoints = teamDrivers.reduce((acc, ld) => {
        if (ld.pos >= 1 && ld.pos <= 10) {
          return acc + (F1_POINTS_SYSTEM[ld.pos - 1] || 0);
        }
        return acc;
      }, 0);

      const basePos = (typeof c.pos === 'number' && c.pos > 0) ? c.pos : (index + 1);

      return {
        ...c,
        pos: basePos,
        provisionalPoints,
        totalPoints: c.points + provisionalPoints,
      };
    });

    calculated.sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) {
        return b.totalPoints - a.totalPoints;
      }
      if (b.wins !== a.wins) {
        return b.wins - a.wins;
      }
      return a.pos - b.pos;
    });

    return calculated.map((c, index) => {
      const virtualPos = index + 1;
      const rankDiff = c.pos - virtualPos;
      return {
        ...c,
        virtualPos,
        rankDiff,
      };
    });
  }, [data, isVirtualActive, liveDrivers]);

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
      {/* Historical Seasons Selector (F1, F2 & F3) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1.5 border-b border-zinc-200 dark:border-white/[0.06]">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 min-w-0 flex-1">
          <span className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400 font-bold uppercase flex items-center gap-1.5 shrink-0 mr-1">
            <Calendar className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
            {t.standings.historicalSeason}:
          </span>
          {pillsToRender.map((year) => {
            const isSelected = activeYear === year;
            return (
              <button
                key={year}
                type="button"
                onClick={() => setSelectedSeasonYear(year)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer shrink-0 border ${
                  isSelected
                    ? 'text-white shadow-sm font-black keep-white'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 border-zinc-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] dark:text-zinc-400 dark:hover:text-white dark:border-white/[0.08]'
                }`}
                style={
                  isSelected
                    ? { backgroundColor: theme.primary, borderColor: theme.primary }
                    : undefined
                }
              >
                {year === 2026 ? `${year} (${lang === 'es' ? 'Actual' : 'Live'})` : year}
              </button>
            );
          })}
        </div>

        {/* Dropdown selector for all historical seasons */}
        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto sm:pl-2 sm:border-l border-zinc-200 dark:border-white/[0.08]">
          <label htmlFor="season-year-select" className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400 hidden xl:inline shrink-0 font-medium">
            {t.standings.allEras}:
          </label>
          <select
            id="season-year-select"
            aria-label={t.standings.historicalSeason}
            value={activeYear}
            onChange={(e) => setSelectedSeasonYear(Number(e.target.value))}
            className="bg-white text-zinc-800 border-zinc-300 hover:border-zinc-400 dark:bg-[#181C28] dark:text-zinc-200 dark:border-white/[0.14] dark:hover:border-white/30 text-xs font-mono font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-400 shadow-sm"
          >
            {allSeriesYears.map((year) => (
              <option key={year} value={year} className="bg-white text-zinc-800 dark:bg-[#131722] dark:text-zinc-200">
                {year === 2026
                  ? `2026 (${lang === 'es' ? 'Actual' : 'Live'})`
                  : `${year} ${series.toUpperCase()}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* F2 & F3: Junior Hub Controls (Standings vs Graduates & Tech Specs) */}
      {series !== 'f1' && (
        <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-zinc-200 dark:border-white/[0.06]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setJuniorTab('standings')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                juniorTab === 'standings'
                  ? 'text-white border-transparent shadow-sm keep-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 border-zinc-200 dark:bg-white/[0.03] dark:text-zinc-400 dark:hover:text-white dark:border-transparent'
              }`}
              style={
                juniorTab === 'standings'
                  ? { backgroundColor: theme.primary, borderColor: theme.primary, color: '#FFFFFF' }
                  : undefined
              }
            >
              <Trophy className="w-3.5 h-3.5" style={{ color: juniorTab === 'standings' ? '#FFFFFF' : theme.primary }} />
              <span>{lang === 'es' ? `Clasificación ${activeYear}` : `${activeYear} Standings`}</span>
            </button>

            <button
              type="button"
              onClick={() => setJuniorTab('graduates')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                juniorTab === 'graduates'
                  ? 'text-white border-transparent shadow-sm keep-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 border-zinc-200 dark:bg-white/[0.03] dark:text-zinc-400 dark:hover:text-white dark:border-transparent'
              }`}
              style={
                juniorTab === 'graduates'
                  ? { backgroundColor: theme.primary, borderColor: theme.primary, color: '#FFFFFF' }
                  : undefined
              }
            >
              <GraduationCap className="w-3.5 h-3.5" style={{ color: juniorTab === 'graduates' ? '#FFFFFF' : theme.primary }} />
              <span>{t.standings.graduatesTab}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsTechSpecsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-900 border border-zinc-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] dark:text-zinc-300 dark:hover:text-white dark:border-white/[0.08] transition-all cursor-pointer shadow-xs"
          >
            <Wrench className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span>{t.standings.techSpecsBtn}</span>
          </button>
        </div>
      )}

      {/* Junior Graduates / Hall of Fame View */}
      {series !== 'f1' && juniorTab === 'graduates' ? (
        <JuniorGraduatesView onSelectDriver={(name) => handleDriverClick({ name })} />
      ) : (
        <>
          {/* Historical Season Banner (F1, F2 & F3) */}
          {activeYear < 2026 && (
            <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/30 text-amber-900 dark:text-amber-300 font-mono text-xs animate-fadeIn">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>
                  <strong className="uppercase">
                    {t.standings.historicalSeason} {series.toUpperCase()} {activeYear}
                  </strong>
                  {data.drivers?.[0] && (
                    <span className="text-zinc-700 dark:text-zinc-300 ml-1.5">
                      • {lang === 'es' ? 'Campeón' : 'Champion'}: <span className="text-zinc-900 dark:text-white font-bold">{data.drivers[0].name} ({data.drivers[0].points} PTS)</span>
                    </span>
                  )}
                  {data.constructors?.[0] && (
                    <span className="text-zinc-600 dark:text-zinc-400 ml-1.5 hidden md:inline">
                      • {lang === 'es' ? 'Constructores' : 'Constructors'}: <span className="text-zinc-900 dark:text-white font-bold">{data.constructors[0].name}</span>
                      {series === 'f1' && activeYear >= 1950 && activeYear <= 1957 && (
                        <span className="text-[10px] text-amber-700 dark:text-amber-300 font-semibold ml-1" title={lang === 'es' ? 'Campeonato de Constructores oficial de la FIA creado en 1958; tabla calculada según puntos de escudería' : 'Official FIA Constructors Championship created in 1958; table calculated from team points'}>
                          ({lang === 'es' ? 'calculado' : 'calculated'})*
                        </span>
                      )}
                    </span>
                  )}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSeasonYear(2026)}
                className="px-2.5 py-1 rounded bg-amber-200 hover:bg-amber-300 text-amber-950 dark:bg-amber-400/20 dark:hover:bg-amber-400/30 dark:text-amber-300 text-[11px] font-bold uppercase transition-colors cursor-pointer"
              >
                {lang === 'es' ? 'Volver a 2026' : 'Back to 2026'}
              </button>
            </div>
          )}

          {/* Broadcast Style Sub-Tabs with Live Virtual Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 dark:border-white/[0.08] pb-1 px-1">
            <div className="flex gap-3 sm:gap-6 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setSubTab('drivers')}
                className={`flex items-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 text-[11px] sm:text-xs font-mono uppercase tracking-wider font-semibold transition-all border-b-2 cursor-pointer shrink-0 whitespace-nowrap ${
                  effectiveSubTab === 'drivers'
                    ? 'text-zinc-900 dark:text-white'
                    : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white border-transparent'
                }`}
                style={effectiveSubTab === 'drivers' ? { borderColor: theme.primary } : undefined}
              >
                <Award className="w-3.5 h-3.5 shrink-0" style={{ color: theme.primary }} />
                <span className="sm:hidden">{lang === 'es' ? 'PILOTOS' : 'DRIVERS'}</span>
                <span className="hidden sm:inline">{t.standings.driversTab}</span>
              </button>

              <button
                type="button"
                onClick={() => setSubTab('constructors')}
                className={`flex items-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 text-[11px] sm:text-xs font-mono uppercase tracking-wider font-semibold transition-all border-b-2 cursor-pointer shrink-0 whitespace-nowrap ${
                  effectiveSubTab === 'constructors'
                    ? 'text-zinc-900 dark:text-white'
                    : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white border-transparent'
                }`}
                style={effectiveSubTab === 'constructors' ? { borderColor: theme.primary } : undefined}
              >
                <Users className="w-3.5 h-3.5 shrink-0" style={{ color: theme.primary }} />
                <span className="sm:hidden">{lang === 'es' ? 'CONSTRUCTORES' : 'CONSTRUCTORS'}</span>
                <span className="hidden sm:inline">{t.standings.constructorsTab}</span>
              </button>

              {series === 'f1' && activeYear === 2026 && (
                <button
                  type="button"
                  onClick={() => setSubTab('pu-tracker')}
                  className={`flex items-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 text-[11px] sm:text-xs font-mono uppercase tracking-wider font-semibold transition-all border-b-2 cursor-pointer shrink-0 whitespace-nowrap ${
                    effectiveSubTab === 'pu-tracker'
                      ? 'text-zinc-900 dark:text-white'
                      : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white border-transparent'
                  }`}
                  style={effectiveSubTab === 'pu-tracker' ? { borderColor: theme.primary } : undefined}
                >
                  <Zap className="w-3.5 h-3.5 shrink-0" style={{ color: theme.primary }} />
                  <span className="sm:hidden">{lang === 'es' ? 'MOTORES' : 'PU'}</span>
                  <span className="hidden sm:inline">{lang === 'es' ? 'Motores & Sanciones' : 'Power Unit Tracker'}</span>
                </button>
              )}
            </div>

            {series === 'f1' && selectedSeasonYear === 2026 && isLiveActive && liveDrivers && liveDrivers.length > 0 && (
              <button
                type="button"
                onClick={() => setIsLiveVirtual((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                  isVirtualActive
                    ? 'bg-amber-400 text-black border-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.35)]'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 border-white/[0.08]'
                }`}
              >
                <Zap className={`w-3.5 h-3.5 ${isVirtualActive ? 'fill-black text-black' : 'text-amber-400'}`} />
                <span>{t.standings.liveVirtualToggle}</span>
                {isVirtualActive && (
                  <span className="text-[9px] px-1 py-0.5 rounded bg-black/20 text-black font-black">
                    ON
                  </span>
                )}
              </button>
            )}
          </div>

          {/* Live Virtual Standings Notice Banner */}
          {isVirtualActive && (
            <div className="flex items-center justify-between gap-2 px-3.5 py-2 rounded-lg bg-amber-400/10 border border-amber-400/25 text-amber-300 font-mono text-xs animate-fadeIn">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
                </span>
                <span className="font-bold uppercase tracking-wide">
                  {t.standings.liveVirtualActiveDesc}
                </span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold uppercase tracking-wider hidden sm:inline">
                F1 2026
              </span>
            </div>
          )}

          {/* Driver Lineup Changes Notification for F2 / F3 */}
          {activeYear === 2026 && driverChanges.length > 0 && (
            <DriverChangesAlert
              changes={driverChanges}
              series={series}
              onSelectDriver={(name) => handleDriverClick({ name })}
            />
          )}

          {/* Academy Filter Pills for F2 / F3 in Drivers Tab */}
          {series !== 'f1' && effectiveSubTab === 'drivers' && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-xs font-mono">
              <span className="text-zinc-500 text-[11px] uppercase font-bold shrink-0 mr-1">
                {t.standings.academiesFilter}:
              </span>
              <button
                type="button"
                onClick={() => setSelectedAcademyFilter('all')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all shrink-0 cursor-pointer border ${
                  selectedAcademyFilter === 'all'
                    ? 'text-white border-transparent shadow-sm keep-white font-bold'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 border-zinc-200 dark:bg-white/[0.04] dark:text-zinc-400 dark:hover:text-white dark:border-transparent'
                }`}
                style={
                  selectedAcademyFilter === 'all'
                    ? { backgroundColor: theme.primary, borderColor: theme.primary, color: '#FFFFFF' }
                    : undefined
                }
              >
                {t.standings.allAcademies} ({processedDrivers.length})
              </button>
              {Object.values(F1_ACADEMIES).map((acad) => {
                const isAcadSelected = selectedAcademyFilter === acad.id;
                const count = processedDrivers.filter(
                  (d) => (DRIVER_ACADEMY_MAP[d.code?.toUpperCase() || ''] || 'independent') === acad.id
                ).length;
                if (count === 0 && !isAcadSelected) {
                  return null;
                }
                return (
                  <button
                    key={acad.id}
                    type="button"
                    onClick={() => setSelectedAcademyFilter(acad.id)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all shrink-0 cursor-pointer border flex items-center gap-1.5 ${
                      isAcadSelected
                        ? 'text-white shadow-sm keep-white'
                        : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border-zinc-200 dark:bg-white/[0.03] dark:text-zinc-400 dark:hover:text-white dark:border-white/[0.05]'
                    }`}
                    style={
                      isAcadSelected
                        ? { backgroundColor: acad.color, borderColor: acad.color }
                        : undefined
                    }
                  >
                    <span>{acad.badge}</span>
                    <span className="text-[10px] font-bold opacity-90">({count})</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* DRIVERS TABLE */}
          {effectiveSubTab === 'drivers' && (
            <div className="bg-white dark:bg-[#131722] border border-zinc-200 dark:border-white/[0.08] rounded-xl overflow-hidden shadow-sm">
              <div className="grid grid-cols-12 gap-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-zinc-50 dark:bg-[#131722] border-b border-zinc-200 dark:border-white/[0.08] text-[9px] sm:text-[11px] font-mono font-bold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase select-none">
                <div className="col-span-2 sm:col-span-1 text-center">{t.standings.headers.pos}</div>
                <div className="col-span-5 sm:col-span-5">{t.standings.headers.driver}</div>
                <div className="col-span-3 hidden sm:block">{t.standings.headers.team}</div>
                <div className="col-span-3 sm:col-span-2 text-right pr-2 sm:pr-3">{t.standings.headers.points}</div>
                <div className="col-span-2 sm:col-span-1 text-right">{t.standings.headers.wins}</div>
              </div>

              <div className="divide-y divide-zinc-200 dark:divide-white/[0.08]">
                {filteredDrivers.length === 0 ? (
                  <div className="p-8 text-center text-zinc-400 font-mono text-xs">
                    {lang === 'es'
                      ? `No hay pilotos de ${F1_ACADEMIES[selectedAcademyFilter]?.name || 'esta academia'} compitiendo en ${series.toUpperCase()} ${activeYear}.`
                      : `No drivers from ${F1_ACADEMIES[selectedAcademyFilter]?.name || 'this academy'} competing in ${series.toUpperCase()} ${activeYear}.`}
                  </div>
                ) : (
                  filteredDrivers.map((d, index) => {
                  const acadId = DRIVER_ACADEMY_MAP[d.code?.toUpperCase() || ''] || 'independent';
                  const acad = F1_ACADEMIES[acadId];

                  return (
                    <div
                      key={`${d.code}-${d.virtualPos}`}
                      className={`grid grid-cols-12 gap-1 px-1.5 sm:px-3 py-1 sm:py-2.5 items-center transition-colors ${
                        d.virtualPos === 1
                          ? 'bg-amber-500/[0.04] hover:bg-amber-500/[0.08]'
                          : d.virtualPos <= 3
                          ? 'bg-zinc-50/60 dark:bg-white/[0.015] hover:bg-zinc-100/80 dark:hover:bg-white/[0.04]'
                          : 'hover:bg-zinc-50 dark:hover:bg-white/[0.02]'
                      }`}
                    >
                      {/* Pos */}
                      <div className="col-span-2 sm:col-span-1 flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1 font-mono tabular-nums">
                        {renderPosBadge(d.virtualPos, index + 1)}
                        {isVirtualActive && renderRankDiff(d.rankDiff)}
                      </div>

                      {/* Driver */}
                      <div className="col-span-5 sm:col-span-5 flex items-center gap-2 overflow-hidden">
                        <span
                          className="w-[3px] h-5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: d.teamColor || '#8E929B' }}
                        />
                        <div className="truncate">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDriverClick({
                                  ...d,
                                  pos: d.virtualPos,
                                  points: d.totalPoints,
                                });
                              }}
                              className="font-mono text-[11px] sm:text-sm font-black text-zinc-900 dark:text-white tracking-tight uppercase hover:text-amber-500 dark:hover:text-[#FFD60A] hover:underline cursor-pointer transition-colors"
                              title={lang === 'es' ? 'Ver ficha técnica del piloto' : 'View driver profile'}
                            >
                              {d.code}
                            </button>
                            <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium truncate hidden sm:inline">
                              {d.name}
                            </span>

                            {/* Junior Series: Academy Badge */}
                            {series !== 'f1' && acad && (
                              <span
                                className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-mono font-bold shrink-0 border"
                                style={{
                                  backgroundColor: `${acad.color}15`,
                                  borderColor: `${acad.color}35`,
                                  color: acad.color,
                                }}
                                title={acad.name}
                              >
                                {acad.badge}
                              </span>
                            )}

                            {/* Junior Series: Super License Indicator */}
                            {series === 'f2' && d.virtualPos <= 3 && (
                              <span
                                className="hidden md:inline-flex items-center gap-0.5 px-1 py-0.2 rounded text-[9px] font-mono font-black bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shrink-0"
                                title={lang === 'es' ? 'Top 3 F2: Otorga 40 puntos de Superlicencia FIA (Acceso F1)' : 'Top 3 F2: Grants 40 FIA Super License pts (Direct F1 ticket)'}
                              >
                                <ShieldCheck className="w-2.5 h-2.5" />
                                SL 40
                              </span>
                            )}
                            {series === 'f3' && d.virtualPos === 1 && (
                              <span
                                className="hidden md:inline-flex items-center gap-0.5 px-1 py-0.2 rounded text-[9px] font-mono font-black bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shrink-0"
                                title={lang === 'es' ? 'Campeón F3: Otorga 30 puntos de Superlicencia FIA' : 'F3 Champion: Grants 30 FIA Super License pts'}
                              >
                                <ShieldCheck className="w-2.5 h-2.5" />
                                SL 30
                              </span>
                            )}
                          </div>
                          <span className="text-[9px] text-zinc-600 dark:text-zinc-400 font-mono sm:hidden block break-words leading-tight">
                            {d.team}
                          </span>
                        </div>
                      </div>

                      {/* Team (Desktop) */}
                      <div className="col-span-3 text-xs text-zinc-600 dark:text-zinc-400 font-mono truncate hidden sm:block">
                        {d.team}
                      </div>

                      {/* Points */}
                      <div className="col-span-3 sm:col-span-2 text-right pr-2 sm:pr-3 flex flex-col items-end justify-center font-mono tabular-nums">
                        <span className="text-[11px] sm:text-sm font-bold text-amber-600 dark:text-[#FFD60A]">
                          {d.totalPoints}
                        </span>
                        {isVirtualActive && (
                          <span className={`text-[10px] font-bold leading-tight ${d.provisionalPoints > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-500'}`}>
                            +{d.provisionalPoints} {d.liveTrackPos ? `(P${d.liveTrackPos})` : ''}
                          </span>
                        )}
                      </div>

                      {/* Wins */}
                      <div className="col-span-2 sm:col-span-1 text-right font-mono text-xs text-zinc-600 dark:text-zinc-400 tabular-nums">
                        {d.wins}
                      </div>
                    </div>
                  );
                }))}
              </div>
            </div>
          )}

          {/* CONSTRUCTORS TABLE */}
          {effectiveSubTab === 'constructors' && (
            <div className="space-y-3">
              {series === 'f1' && activeYear >= 1950 && activeYear <= 1957 && (
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-mono">
                  <span className="font-bold uppercase tracking-wider text-[10px] bg-amber-200 dark:bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-950 dark:text-amber-300 shrink-0">
                    {lang === 'es' ? 'Nota Histórica' : 'Historical Note'}
                  </span>
                  <span>
                    {lang === 'es'
                      ? `El Campeonato Mundial de Constructores de la FIA fue inaugurado formalmente en 1958. La tabla de ${activeYear} ha sido calculada retrospectivamente sumando puntos y victorias de pilotos por escudería.`
                      : `The official FIA Constructors' World Championship began in 1958. Standings for ${activeYear} are retrospectively calculated based on team driver points and victories.`}
                  </span>
                </div>
              )}

              <div className="bg-white dark:bg-[#131722] border border-zinc-200 dark:border-white/[0.08] rounded-xl overflow-hidden shadow-sm">
                <div className="grid grid-cols-12 gap-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-zinc-50 dark:bg-[#131722] border-b border-zinc-200 dark:border-white/[0.08] text-[9px] sm:text-[11px] font-mono font-bold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase select-none">
                  <div className="col-span-2 sm:col-span-1 text-center">{t.standings.headers.pos}</div>
                  <div className="col-span-6 sm:col-span-7">{t.standings.headers.team}</div>
                  <div className="col-span-2 text-right pr-2 sm:pr-3">{t.standings.headers.points}</div>
                  <div className="col-span-2 text-right">{t.standings.headers.wins}</div>
                </div>

                <div className="divide-y divide-zinc-200 dark:divide-white/[0.08]">
                  {processedConstructors.map((c, index) => (
                    <div
                      key={c.name}
                      className={`grid grid-cols-12 gap-1 px-1.5 sm:px-3 py-1 sm:py-2.5 items-center transition-colors ${
                        c.virtualPos === 1
                          ? 'bg-amber-500/[0.04] hover:bg-amber-500/[0.08]'
                          : c.virtualPos <= 3
                          ? 'bg-zinc-50/60 dark:bg-white/[0.015] hover:bg-zinc-100/80 dark:hover:bg-white/[0.04]'
                          : 'hover:bg-zinc-50 dark:hover:bg-white/[0.02]'
                      }`}
                    >
                      {/* Pos */}
                      <div className="col-span-2 sm:col-span-1 flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1 font-mono tabular-nums">
                        {renderPosBadge(c.virtualPos, index + 1)}
                        {isVirtualActive && renderRankDiff(c.rankDiff)}
                      </div>

                      {/* Team Name with line indicator */}
                      <div className="col-span-6 sm:col-span-7 flex items-center gap-2.5">
                        <span
                          className="w-[3px] h-5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: c.teamColor || '#8E929B' }}
                        />
                        <span className="font-bold text-[11px] sm:text-sm text-zinc-900 dark:text-white tracking-tight uppercase">
                          {c.name}
                        </span>
                      </div>

                      {/* Points */}
                      <div className="col-span-2 text-right pr-2 sm:pr-3 flex flex-col items-end justify-center font-mono tabular-nums">
                        <span className="text-[11px] sm:text-sm font-bold text-amber-600 dark:text-[#FFD60A]">
                          {c.totalPoints}
                        </span>
                        {isVirtualActive && (
                          <span className={`text-[10px] font-bold leading-tight ${c.provisionalPoints > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-500'}`}>
                            +{c.provisionalPoints}
                          </span>
                        )}
                      </div>

                      {/* Wins */}
                      <div className="col-span-2 text-right font-mono text-xs text-zinc-600 dark:text-zinc-400 tabular-nums">
                        {c.wins}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* POWER UNIT TRACKER (F1 2026 Only) */}
          {series === 'f1' && activeYear === 2026 && effectiveSubTab === 'pu-tracker' && (
            <PowerUnitTracker onSelectDriver={(code) => handleDriverClick({ code })} />
          )}
        </>
      )}

      {/* Driver Profile Modal */}
      <DriverProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={selectedProfile}
        isPinned={selectedProfile ? pinnedDriverNumber === selectedProfile.number : false}
        onTogglePin={togglePin}
      />

      {/* Junior Tech Specs Modal */}
      <JuniorTechSpecsModal
        isOpen={isTechSpecsOpen}
        onClose={() => setIsTechSpecsOpen(false)}
      />
    </div>
  );
};
