import { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { FlagBanner } from './components/live/FlagBanner';
import { RaceControlFeed } from './components/live/RaceControlFeed';
import { SyncDelayBar } from './components/live/SyncDelayBar';
import { TimingTable } from './components/live/TimingTable';
import { ScheduleView } from './components/schedule/ScheduleView';
import { StandingsView } from './components/standings/StandingsView';
import { useLiveTelemetry } from './hooks/useLiveTelemetry';
import { useWakeLock } from './hooks/useWakeLock';
import type { ActiveTab } from './types/f1';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('live');

  const {
    snapshot,
    drivers,
    delaySeconds,
    setDelaySeconds,
    nudgeDelay,
    isLoading,
    isLiveConnected,
  } = useLiveTelemetry();

  const { isLocked, toggleWakeLock, supported: wakeLockSupported } = useWakeLock();

  const isLiveSessionActive =
    snapshot?.session.status === 'IN_PROGRESS' ||
    snapshot?.session.flag === 'GREEN' ||
    snapshot?.session.flag === 'YELLOW' ||
    snapshot?.session.flag === 'SC' ||
    snapshot?.session.flag === 'VSC';

  return (
    <div className="min-h-screen bg-[#0B0E14] text-zinc-100 flex flex-col">
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLiveActive={isLiveSessionActive}
        isLiveConnected={isLiveConnected}
        isWakeLocked={isLocked}
        onToggleWakeLock={toggleWakeLock}
        wakeLockSupported={wakeLockSupported}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-4 py-3 flex flex-col gap-3 pb-16">
        {activeTab === 'live' && (
          <>
            {/* Header with Circuit info & Track Flag */}
            <FlagBanner session={snapshot?.session || null} />

            {/* Anti-Spoilers Delay Bar */}
            <SyncDelayBar
              delaySeconds={delaySeconds}
              onDelayChange={setDelaySeconds}
              onNudge={nudgeDelay}
            />

            {/* FIA Race Control Official Ticker */}
            <RaceControlFeed messages={snapshot?.messages || []} />

            {/* 2-Tier Timing Table (Promiedos Style) */}
            {isLoading ? (
              <div className="bg-[#131722] border border-white/[0.08] rounded-xl p-12 text-center text-zinc-500">
                <span className="text-xs">Sintonizando telemetría en vivo...</span>
              </div>
            ) : (
              <TimingTable drivers={drivers} />
            )}
          </>
        )}

        {activeTab === 'schedule' && <ScheduleView />}

        {activeTab === 'standings' && <StandingsView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-4 px-4 text-center text-[11px] text-zinc-600 bg-[#0B0E14]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-zinc-400">
            <span className="text-[#E10600]">REBUFO</span> • El Promiedos de la Fórmula 1
          </div>
          <p className="text-[10px] text-zinc-600">
            Plataforma comunitaria independiente. Datos estadísticos y de cronometraje de dominio público.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
