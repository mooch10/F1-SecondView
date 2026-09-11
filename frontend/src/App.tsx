import { useEffect, useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { BetweenRacesView } from './components/live/BetweenRacesView';
import { FlagBanner } from './components/live/FlagBanner';
import { FolkloreReactions } from './components/live/FolkloreReactions';
import { RaceControlFeed } from './components/live/RaceControlFeed';
import { RaceSimulatorBar } from './components/live/RaceSimulatorBar';
import { SyncDelayBar } from './components/live/SyncDelayBar';
import { TimingTable } from './components/live/TimingTable';
import { TrackWeatherBar } from './components/live/TrackWeatherBar';
import { ScheduleView } from './components/schedule/ScheduleView';
import { StandingsView } from './components/standings/StandingsView';
import { useLiveTelemetry } from './hooks/useLiveTelemetry';
import { useRaceSimulation } from './hooks/useRaceSimulation';
import { useTheme } from './hooks/useTheme';
import { useWakeLock } from './hooks/useWakeLock';
import type { ActiveTab } from './types/f1';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('live');
  const [liveSubView, setLiveSubView] = useState<'timing' | 'simulator' | 'betweenRaces'>('timing');
  const { isDarkMode, toggleTheme } = useTheme();

  const {
    snapshot,
    drivers,
    delaySeconds,
    setDelaySeconds,
    nudgeDelay,
    isLoading,
    isLiveConnected,
  } = useLiveTelemetry();

  const {
    isLocked: isWakeLocked,
    toggleWakeLock,
    supported: isWakeLockSupported,
    requestLock,
  } = useWakeLock();

  // Auto-acquire wake lock on live tab so phone screen doesn't sleep while watching TV
  useEffect(() => {
    if (activeTab === 'live') {
      requestLock();
    }
  }, [activeTab, requestLock]);

  // Race Simulation Engine
  const {
    isPlaying: isSimPlaying,
    simLap,
    simSpeed,
    simSnapshot,
    toggleSimulation,
    play: playSim,
    pause: pauseSim,
    reset: resetSim,
    setLap: setSimLap,
    setSpeed: setSimSpeed,
  } = useRaceSimulation(snapshot);

  const isSimulating = liveSubView === 'simulator';
  const effectiveSnapshot = isSimulating && simSnapshot ? simSnapshot : snapshot;
  const effectiveDrivers = isSimulating && simSnapshot ? simSnapshot.drivers : drivers;

  const isLiveSessionActive =
    effectiveSnapshot?.session.status === 'IN_PROGRESS' ||
    effectiveSnapshot?.session.flag === 'GREEN' ||
    effectiveSnapshot?.session.flag === 'YELLOW' ||
    effectiveSnapshot?.session.flag === 'SC' ||
    effectiveSnapshot?.session.flag === 'VSC';

  return (
    <div className="min-h-screen bg-[#0B0E14] text-zinc-100 flex flex-col font-chakra antialiased">
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLiveActive={isLiveSessionActive}
        isLiveConnected={isLiveConnected}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        isWakeLocked={isWakeLocked}
        onToggleWakeLock={toggleWakeLock}
        isWakeLockSupported={isWakeLockSupported}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-4 py-3 flex flex-col gap-3 pb-16">
        {activeTab === 'live' && (
          <>
            {/* Live Subview Mode Switcher */}
            <div className="flex items-center justify-between bg-[#131722] border border-white/[0.08] rounded-xl p-1 select-none text-xs font-mono gap-1">
              <button
                type="button"
                onClick={() => {
                  if (isSimulating) toggleSimulation();
                  setLiveSubView('timing');
                }}
                className={`flex-1 py-1.5 px-2.5 rounded-lg font-bold text-center transition-colors cursor-pointer truncate ${
                  liveSubView === 'timing'
                    ? 'bg-[#1C2230] text-white shadow-sm border border-white/10'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                TELEMETRÍA EN VIVO
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!isSimulating) toggleSimulation();
                  setLiveSubView('simulator');
                }}
                className={`flex-1 py-1.5 px-2.5 rounded-lg font-bold text-center transition-colors cursor-pointer truncate ${
                  liveSubView === 'simulator'
                    ? 'bg-[#27F4D2]/20 text-[#27F4D2] border border-[#27F4D2]/40 shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                SIMULADOR DEMO
              </button>

              <button
                type="button"
                onClick={() => {
                  if (isSimulating) toggleSimulation();
                  setLiveSubView('betweenRaces');
                }}
                className={`flex-1 py-1.5 px-2.5 rounded-lg font-bold text-center transition-colors cursor-pointer truncate ${
                  liveSubView === 'betweenRaces'
                    ? 'bg-[#1C2230] text-white shadow-sm border border-white/10'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                ENTRE CARRERAS
              </button>
            </div>

            {liveSubView === 'betweenRaces' ? (
              <BetweenRacesView onSwitchToLiveTiming={() => setLiveSubView('timing')} />
            ) : (
              <>
                {/* Simulation Control Bar (when in simulator mode) */}
                {isSimulating && (
                  <RaceSimulatorBar
                    isPlaying={isSimPlaying}
                    simLap={simLap}
                    totalLaps={53}
                    simSpeed={simSpeed}
                    onPlay={playSim}
                    onPause={pauseSim}
                    onReset={resetSim}
                    onLapChange={setSimLap}
                    onSpeedChange={setSimSpeed}
                    onExit={() => {
                      toggleSimulation();
                      setLiveSubView('timing');
                    }}
                  />
                )}

                {/* Header with Circuit info & Track Flag & Progress Bar */}
                <FlagBanner session={effectiveSnapshot?.session || null} />

                {/* Live Track Weather Telemetry */}
                <TrackWeatherBar weather={effectiveSnapshot?.weather} />

                {/* Anti-Spoilers Delay Bar (only in live mode) */}
                {!isSimulating && (
                  <SyncDelayBar
                    delaySeconds={delaySeconds}
                    onDelayChange={setDelaySeconds}
                    onNudge={nudgeDelay}
                  />
                )}

                {/* FIA Race Control Official Ticker */}
                <RaceControlFeed messages={effectiveSnapshot?.messages || []} />

                {/* Live Folklore Reactions (Promiedos Style) */}
                <FolkloreReactions />

                {/* 2-Tier Timing Table (Promiedos Style) with Pit Stops & DNF */}
                {isLoading && !isSimulating ? (
                  <div className="bg-[#131722] border border-white/[0.08] rounded-xl p-12 text-center text-zinc-500 font-mono text-xs">
                    <span>SINTONIZANDO TELEMETRÍA EN VIVO...</span>
                  </div>
                ) : (
                  <TimingTable drivers={effectiveDrivers} />
                )}
              </>
            )}
          </>
        )}

        {activeTab === 'schedule' && <ScheduleView />}

        {activeTab === 'standings' && <StandingsView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-4 px-4 text-center text-[10px] text-zinc-500 font-mono bg-[#0B0E14]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-zinc-300">
            <span className="text-[#E10600]">REBUFO</span> • El Promiedos de la Fórmula 1
          </div>
          <p className="text-[10px] text-zinc-500">
            Plataforma comunitaria independiente. Datos estadísticos y de cronometraje de dominio público.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
