import { Radio, Tv } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { BetweenRacesView } from './components/live/BetweenRacesView';
import { CircuitMap } from './components/live/CircuitMap';
import { FlagBanner } from './components/live/FlagBanner';
import { RaceControlFeed } from './components/live/RaceControlFeed';
import { SyncDelayBar } from './components/live/SyncDelayBar';
import { TimingTable } from './components/live/TimingTable';
import { TrackWeatherBar } from './components/live/TrackWeatherBar';
import { QualifyingView } from './components/qualy/QualifyingView';
import { LastRaceView } from './components/race/LastRaceView';
import { ScheduleView } from './components/schedule/ScheduleView';
import { StandingsView } from './components/standings/StandingsView';
import { HeroView } from './components/hero/HeroView';
import { CommandPalette } from './components/common/CommandPalette';
import { DriverProfileModal } from './components/drivers/DriverProfileModal';
import { getDriverProfile, type F1DriverProfile } from './data/f1DriversData';
import { useLanguage } from './hooks/useLanguage';
import { useLiveTelemetry } from './hooks/useLiveTelemetry';
import { useSeries } from './hooks/useSeries';
import { useTheme } from './hooks/useTheme';
import { useWakeLock } from './hooks/useWakeLock';
import { useTimezone } from './hooks/useTimezone';
import type { ActiveTab } from './types/f1';

function App() {
  const [showHero, setShowHero] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('live');
  const [userSubView, setUserSubView] = useState<'timing' | 'betweenRaces' | null>(null);
  const [isTvMode, setIsTvMode] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [selectedProfile, setSelectedProfile] = useState<F1DriverProfile | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [historicalYear, setHistoricalYear] = useState<number>(2026);
  const { isDarkMode, toggleTheme } = useTheme();
  const { lang, t } = useLanguage();
  const { series, setSeries } = useSeries();
  const { setTrackCircuit } = useTimezone();

  const handleEnter = () => {
    setSeries('f1');
    setActiveTab('live');
    setShowHero(false);
  };

  const {
    snapshot,
    drivers,
    delaySeconds,
    setDelaySeconds,
    nudgeDelay,
    isLoading,
    isLiveConnected,
  } = useLiveTelemetry();

  // Sync active track timezone from live snapshot session
  useEffect(() => {
    if (snapshot?.session?.circuit || snapshot?.session?.country) {
      setTrackCircuit(
        snapshot.session.circuit,
        snapshot.session.location,
        snapshot.session.country
      );
    }
  }, [snapshot?.session?.circuit, snapshot?.session?.location, snapshot?.session?.country, setTrackCircuit]);

  const { requestLock } = useWakeLock();

  // Auto-acquire wake lock on live tab or TV mode so screen doesn't sleep
  useEffect(() => {
    if (activeTab === 'live' || isTvMode) {
      requestLock();
    }
  }, [activeTab, isTvMode, requestLock]);

  // Global Keyboard Shortcuts (Ctrl+K for Search, F for TV Mode, Esc to exit TV)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);

      // Ctrl+K / Cmd+K -> Command Palette
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      // F key -> TV Companion Mode
      if (!isTyping && (e.key === 'f' || e.key === 'F') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (isCommandPaletteOpen || isProfileOpen) return;
        e.preventDefault();
        setIsTvMode((prev) => {
          const next = !prev;
          if (next) {
            setActiveTab('live');
            setUserSubView('timing');
          }
          return next;
        });
        return;
      }

      // Escape -> exit TV Mode if open
      if (e.key === 'Escape' && isTvMode && !isCommandPaletteOpen && !isProfileOpen) {
        e.preventDefault();
        setIsTvMode(false);
        return;
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isCommandPaletteOpen, isProfileOpen, isTvMode]);

  const handleSelectDriver = (driverNameOrCode: string) => {
    const prof = getDriverProfile(driverNameOrCode, 'f1') || getDriverProfile(driverNameOrCode);
    if (prof) {
      setSelectedProfile(prof);
      setIsProfileOpen(true);
    }
  };

  const handleSelectHistoricalYear = (year: number) => {
    setHistoricalYear(year);
    setActiveTab('standings');
  };

  const isLiveSessionActive =
    Boolean(
      snapshot?.session.status === 'IN_PROGRESS' ||
        snapshot?.session.flag === 'GREEN' ||
        snapshot?.session.flag === 'YELLOW' ||
        snapshot?.session.flag === 'SC' ||
        snapshot?.session.flag === 'VSC',
    ) && drivers.length > 0;

  // Only an active Grand Prix Race session awards championship points
  const isLiveRaceActive =
    series === 'f1' &&
    snapshot?.session?.sessionType === 'Race' &&
    isLiveSessionActive;

  // Auto-focus timing when cars are on track, otherwise default to between-races
  const liveSubView = userSubView ?? (isLiveSessionActive ? 'timing' : 'betweenRaces');

  return (
    <div className="min-h-screen bg-[#0B0E14] text-zinc-100 flex flex-col font-chakra antialiased">
      {/* Hero Welcome Screen with Franco Colapinto */}
      {!isTvMode && showHero && <HeroView onEnter={handleEnter} />}

      {/* Top Navigation Bar */}
      {!isTvMode && (
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isLiveActive={isLiveSessionActive}
          isLiveConnected={isLiveConnected}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
          onReturnToHero={() => setShowHero(true)}
          onOpenSearch={() => setIsCommandPaletteOpen(true)}
          onToggleTvMode={() => {
            setIsTvMode((prev) => {
              const next = !prev;
              if (next) {
                setActiveTab('live');
                setUserSubView('timing');
              }
              return next;
            });
          }}
          isTvMode={isTvMode}
        />
      )}

      {/* TV Mode Floating Exit Button */}
      {isTvMode && (
        <button
          type="button"
          onClick={() => setIsTvMode(false)}
          className="fixed top-3 right-3 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/90 hover:bg-black text-amber-400 hover:text-amber-300 border border-amber-400/40 shadow-xl backdrop-blur-md text-xs font-mono font-bold uppercase transition-all cursor-pointer select-none group active:scale-95"
          title={lang === 'es' ? 'Salir del modo TV (F o ESC)' : 'Exit TV Mode (F or ESC)'}
        >
          <Tv className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span>{lang === 'es' ? 'Salir TV' : 'Exit TV'}</span>
          <kbd className="hidden sm:inline-block px-1 py-0.2 rounded bg-white/10 text-[9px] text-zinc-300">
            ESC
          </kbd>
        </button>
      )}

      {/* Main Content Area */}
      <main
        className={
          isTvMode
            ? 'flex-1 w-full px-2 sm:px-4 py-2 flex flex-col gap-2'
            : 'flex-1 max-w-5xl w-full mx-auto px-3 sm:px-4 py-3 flex flex-col gap-3 pb-16'
        }
      >
            {activeTab === 'live' && (
              <>
                {/* Live Subview Mode Switcher (Telemetría / Entre Carreras) */}
                <div className="flex items-center justify-between bg-[#131722] border border-white/[0.08] rounded-xl p-1 select-none text-xs font-mono gap-1">
                  <button
                    type="button"
                    onClick={() => setUserSubView('timing')}
                    className={`flex-1 py-1.5 px-2.5 rounded-lg font-bold text-center transition-colors cursor-pointer truncate ${
                      liveSubView === 'timing'
                        ? 'bg-[#1C2230] text-white shadow-sm border border-white/10'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {t.live.telemetryTab}
                  </button>

                  <button
                    type="button"
                    onClick={() => setUserSubView('betweenRaces')}
                    className={`flex-1 py-1.5 px-2.5 rounded-lg font-bold text-center transition-colors cursor-pointer truncate ${
                      liveSubView === 'betweenRaces'
                        ? 'bg-[#1C2230] text-white shadow-sm border border-white/10'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {t.live.betweenRacesTab}
                  </button>
                </div>

                {liveSubView === 'betweenRaces' ? (
                  <BetweenRacesView onSwitchToLiveTiming={() => setUserSubView('timing')} />
                ) : isLoading ? (
                  <div className="bg-[#131722] border border-white/[0.08] rounded-xl p-12 text-center text-zinc-500 font-mono text-xs">
                    <span>{t.live.loadingTelemetry}</span>
                  </div>
                ) : drivers.length > 0 ? (
                  <>
                    {/* Header with Circuit info & Track Flag & Progress Bar */}
                    <FlagBanner session={snapshot?.session || null} />

                    {/* Live Track Weather Telemetry */}
                    <TrackWeatherBar weather={snapshot?.weather} />

                    {/* Anti-Spoilers Delay Bar */}
                    <SyncDelayBar
                      delaySeconds={delaySeconds}
                      onDelayChange={setDelaySeconds}
                      onNudge={nudgeDelay}
                    />

                    {/* FIA Race Control Official Ticker */}
                    <RaceControlFeed
                      messages={snapshot?.messages || []}
                      drivers={drivers}
                    />

                    {/* Real-time 2D Interactive Circuit Map (Durante Qualy o Carrera EN VIVO o Replay de telemetría) */}
                    {(isLiveSessionActive || liveSubView === 'timing') &&
                      (snapshot?.session.sessionType === 'Qualifying' ||
                        snapshot?.session.sessionType === 'Race') && (
                        <CircuitMap
                          circuitTrack={snapshot?.circuitTrack}
                          drivers={drivers}
                          sessionName={snapshot?.session.sessionName}
                          circuitName={snapshot?.session.circuit}
                          sessionStatus={snapshot?.session.status}
                        />
                      )}

                    {/* 2-Tier Timing Table with Pit Stops & DNF */}
                    <TimingTable
                      drivers={drivers}
                      sessionType={snapshot?.session.sessionType}
                    />
                  </>
                ) : (
                  /* Standby state when user explicitly opens Telemetry while no cars on track */
                  <div className="bg-[#131722] border border-white/[0.08] rounded-xl p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-4 shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-400">
                      <Radio className="w-6 h-6 text-zinc-400 animate-pulse" />
                    </div>
                    <div className="max-w-md">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#FFD60A] px-2.5 py-0.5 rounded-full bg-[#FFD60A]/10 border border-[#FFD60A]/20">
                        {t.live.standbyBadge}
                      </span>
                      <h3 className="text-lg font-bold text-white uppercase tracking-tight mt-2 font-sans">
                        {t.live.standbyTitle}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1.5 font-mono leading-relaxed">
                        {t.live.standbyDesc}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => setUserSubView('betweenRaces')}
                        className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-bold uppercase transition-colors cursor-pointer border border-white/10"
                      >
                        {t.live.nextScheduleBtn}
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('qualy')}
                        className="px-3.5 py-2 rounded-lg bg-[#FFD60A]/15 hover:bg-[#FFD60A]/25 text-[#FFD60A] font-mono text-xs font-bold uppercase transition-colors cursor-pointer border border-[#FFD60A]/30"
                      >
                        {t.live.qualyResultsBtn}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'last-race' && <LastRaceView key={series} />}

            {activeTab === 'qualy' && (
              <QualifyingView liveSnapshot={snapshot} liveDrivers={drivers} />
            )}

            {activeTab === 'schedule' && <ScheduleView key={series} />}

            {activeTab === 'standings' && (
              <StandingsView
                key={`${series}-${historicalYear}`}
                liveDrivers={drivers}
                isLiveActive={isLiveRaceActive}
                initialSeasonYear={historicalYear}
              />
            )}
          </main>

          {/* Footer */}
          {!isTvMode && (
            <footer className="border-t border-white/[0.06] py-3.5 px-4 text-[10px] text-zinc-500 font-mono bg-[#0B0E14]">
              <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-zinc-300 whitespace-nowrap">
                  <span className="text-[#E10600]">DELTA</span> • {t.footer.subtitle}
                </div>
                <p className="text-[10px] text-zinc-500 whitespace-nowrap">
                  {t.footer.disclaimer}
                </p>
              </div>
            </footer>
          )}

          {/* Global Command Palette (Ctrl+K) */}
          <CommandPalette
            isOpen={isCommandPaletteOpen}
            onClose={() => setIsCommandPaletteOpen(false)}
            onSelectDriver={handleSelectDriver}
            onSelectTab={setActiveTab}
            onSelectSeries={setSeries}
            onSelectHistoricalYear={handleSelectHistoricalYear}
            onToggleTheme={toggleTheme}
            onToggleTvMode={() => {
              setIsTvMode((prev) => {
                const next = !prev;
                if (next) {
                  setActiveTab('live');
                  setUserSubView('timing');
                }
                return next;
              });
            }}
          />

          {/* Driver Profile Modal */}
          <DriverProfileModal
            isOpen={isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
            profile={selectedProfile}
          />
    </div>
  );
}

export default App;
