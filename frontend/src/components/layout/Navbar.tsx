import React from 'react';
import { Moon, Sun } from 'lucide-react';
import type { ActiveTab } from '../../types/f1';
import { useLanguage } from '../../hooks/useLanguage';
import { useSeries, SERIES_THEMES } from '../../hooks/useSeries';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isLiveActive: boolean;
  isLiveConnected: boolean;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isLiveActive,
  isLiveConnected,
  isDarkMode,
  onToggleTheme,
}) => {
  const { lang, toggleLang, t } = useLanguage();
  const { series, setSeries, theme } = useSeries();

  return (
    <header className="sticky top-0 z-50 bg-[#0B0E14]/95 backdrop-blur-md border-b border-white/[0.08]">
      <div className="max-w-4xl mx-auto px-3 sm:px-4">
        {/* Top Brand, Series Switcher & Telemetry Status */}
        <div className="flex items-center justify-between h-12 gap-2">
          {/* Logo & Racing Identity */}
          <button
            type="button"
            onClick={() => setActiveTab('live')}
            className="flex items-center gap-2 group cursor-pointer text-left focus:outline-none shrink-0"
            title="Inicio DELTA"
          >
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center font-black text-white text-xs tracking-tighter italic shadow-sm transition-all active:scale-95"
              style={{ backgroundColor: theme.primary }}
            >
              {theme.shortName.charAt(0)}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-zinc-100 group-hover:text-white text-base uppercase italic font-sans transition-colors">
                DELTA
              </span>
              <span className="text-[9px] font-mono tracking-widest px-1.5 py-0.5 rounded-md bg-[#131722] text-zinc-400 group-hover:text-zinc-200 uppercase border border-white/[0.08] hidden md:inline-block transition-colors">
                {theme.badge}
              </span>
            </div>
          </button>

          {/* Series Switcher Pill Group: [ F1 | F2 | F3 ] */}
          <div className="flex items-center bg-[#131722] p-0.5 rounded-lg border border-white/[0.08] text-xs font-mono">
            {(['f1', 'f2', 'f3'] as const).map((s) => {
              const isSelected = series === s;
              const sTheme = SERIES_THEMES[s];
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setSeries(s);
                    if (s !== 'f1' && (activeTab === 'qualy' || activeTab === 'live')) {
                      setActiveTab('standings');
                    }
                  }}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-black uppercase transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'text-white shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                  style={isSelected ? { backgroundColor: sTheme.primary } : undefined}
                >
                  {s.toUpperCase()}
                </button>
              );
            })}
          </div>

          {/* Right Status Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Live Feed Status (Only shown for F1 live tracking) */}
            {series === 'f1' && (
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-400 tracking-tight select-none">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isLiveActive && isLiveConnected
                      ? 'bg-[#39B54A] animate-pulse'
                      : isLiveConnected
                      ? 'bg-zinc-500'
                      : 'bg-[#E10600]'
                  }`}
                />
                <span className="hidden sm:inline">
                  {isLiveActive && isLiveConnected
                    ? t.nav.liveFeed
                    : isLiveConnected
                    ? t.nav.standby
                    : t.nav.offline}
                </span>
                <span className="sm:hidden">
                  {isLiveActive && isLiveConnected ? 'LIVE' : t.nav.standby}
                </span>
              </div>
            )}

            {/* Language Switcher Button: [ ES | EN ] */}
            <button
              type="button"
              onClick={toggleLang}
              title={t.nav.langTitle}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-mono font-bold tracking-wider bg-[#131722] hover:bg-[#1a202c] border border-white/[0.08] transition-colors cursor-pointer select-none"
            >
              <span
                className="font-black"
                style={{ color: lang === 'es' ? theme.primary : '#71717A' }}
              >
                ES
              </span>
              <span className="text-zinc-600">/</span>
              <span
                className="font-black"
                style={{ color: lang === 'en' ? theme.primary : '#71717A' }}
              >
                EN
              </span>
            </button>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={onToggleTheme}
              title={isDarkMode ? t.nav.themeLight : t.nav.themeDark}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-[#131722] border border-transparent hover:border-white/[0.08] transition-colors cursor-pointer"
            >
              {isDarkMode ? (
                <Moon className="w-4 h-4 text-zinc-300 hover:text-white transition-colors" />
              ) : (
                <Sun className="w-4 h-4 text-[#FFD60A] hover:text-amber-300 transition-colors" />
              )}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1 sm:gap-6 md:gap-8 border-t border-white/[0.08] -mx-3 px-3 sm:mx-0 sm:px-1 overflow-x-auto no-scrollbar scroll-smooth touch-pan-x">
          {/* Live telemetry only for F1 */}
          {series === 'f1' && (
            <button
              type="button"
              onClick={() => setActiveTab('live')}
              className={`px-2 sm:px-3 py-2 text-[11px] sm:text-xs font-mono uppercase tracking-wider font-semibold transition-all border-b-2 flex items-center gap-1.5 shrink-0 ${
                activeTab === 'live'
                  ? 'text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-100 border-transparent'
              }`}
              style={activeTab === 'live' ? { borderColor: theme.primary } : undefined}
            >
              <span>{t.nav.live}</span>
              {isLiveActive && (
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: theme.primary }}
                />
              )}
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('last-race')}
            className={`px-2 sm:px-3 py-2 text-[11px] sm:text-xs font-mono uppercase tracking-wider font-semibold transition-all border-b-2 shrink-0 ${
              activeTab === 'last-race'
                ? 'text-zinc-100'
                : 'text-zinc-400 hover:text-zinc-100 border-transparent'
            }`}
            style={activeTab === 'last-race' ? { borderColor: theme.primary } : undefined}
          >
            <span>{t.nav.lastRace}</span>
          </button>

          {/* Qualy tab (F1 only) */}
          {series === 'f1' && (
            <button
              type="button"
              onClick={() => setActiveTab('qualy')}
              className={`px-2 sm:px-3 py-2 text-[11px] sm:text-xs font-mono uppercase tracking-wider font-semibold transition-all border-b-2 shrink-0 ${
                activeTab === 'qualy'
                  ? 'text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-100 border-transparent'
              }`}
              style={activeTab === 'qualy' ? { borderColor: theme.primary } : undefined}
            >
              <span className="sm:hidden">{t.nav.qualyShort}</span>
              <span className="hidden sm:inline">{t.nav.qualy}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            className={`px-2 sm:px-3 py-2 text-[11px] sm:text-xs font-mono uppercase tracking-wider font-semibold transition-all border-b-2 shrink-0 ${
              activeTab === 'schedule'
                ? 'text-zinc-100'
                : 'text-zinc-400 hover:text-zinc-100 border-transparent'
            }`}
            style={activeTab === 'schedule' ? { borderColor: theme.primary } : undefined}
          >
            <span>{t.nav.schedule}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('standings')}
            className={`px-2 sm:px-3 py-2 text-[11px] sm:text-xs font-mono uppercase tracking-wider font-semibold transition-all border-b-2 shrink-0 ${
              activeTab === 'standings'
                ? 'text-zinc-100'
                : 'text-zinc-400 hover:text-zinc-100 border-transparent'
            }`}
            style={activeTab === 'standings' ? { borderColor: theme.primary } : undefined}
          >
            <span>{t.nav.standings}</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
