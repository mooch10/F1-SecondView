import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Calendar,
  Flag,
  Flame,
  Globe,
  History,
  Search,
  Sun,
  Trophy,
  Tv,
  User,
  Users,
  X,
  Zap,
} from 'lucide-react';
import type { ActiveTab, SeriesCategory } from '../../types/f1';
import { useLanguage } from '../../hooks/useLanguage';
import { useSeries } from '../../hooks/useSeries';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDriver: (driverNameOrCode: string) => void;
  onSelectTab: (tab: ActiveTab) => void;
  onSelectSeries: (series: SeriesCategory) => void;
  onSelectHistoricalYear: (year: number) => void;
  onToggleTheme: () => void;
  onToggleTvMode: () => void;
}

interface PaletteItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'driver' | 'team' | 'circuit' | 'view' | 'command' | 'history';
  categoryLabel: string;
  categoryLabelEs: string;
  icon: React.ReactNode;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectDriver,
  onSelectTab,
  onSelectSeries,
  onSelectHistoricalYear,
  onToggleTheme,
  onToggleTvMode,
}) => {
  const { lang } = useLanguage();
  const { series } = useSeries();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Master Items Catalogue
  const allItems: PaletteItem[] = useMemo(() => {
    const items: PaletteItem[] = [
      // Quick Navigation Views
      {
        id: 'view-live',
        title: lang === 'es' ? 'En Vivo • Telemetría Oficial' : 'Live Timing & Telemetry',
        subtitle: 'F1 2026 Live Session',
        category: 'view',
        categoryLabel: 'VIEW',
        categoryLabelEs: 'VISTA',
        icon: <Zap className="w-4 h-4 text-amber-500" />,
        action: () => {
          onSelectSeries('f1');
          onSelectTab('live');
        },
      },
      {
        id: 'view-standings',
        title: lang === 'es' ? 'Tabla de Posiciones' : 'Championship Standings',
        subtitle: `${series.toUpperCase()} Drivers & Constructors`,
        category: 'view',
        categoryLabel: 'VIEW',
        categoryLabelEs: 'VISTA',
        icon: <Trophy className="w-4 h-4 text-yellow-500" />,
        action: () => onSelectTab('standings'),
      },
      {
        id: 'view-schedule',
        title: lang === 'es' ? 'Calendario y Horarios' : 'Season Calendar & Schedule',
        subtitle: `${series.toUpperCase()} 2026 Season`,
        category: 'view',
        categoryLabel: 'VIEW',
        categoryLabelEs: 'VISTA',
        icon: <Calendar className="w-4 h-4 text-sky-500" />,
        action: () => onSelectTab('schedule'),
      },
      {
        id: 'view-qualy',
        title: lang === 'es' ? 'Clasificación (Qualy Q1/Q2/Q3)' : 'Qualifying Breakdown',
        subtitle: 'F1 Starting Grid & Delta',
        category: 'view',
        categoryLabel: 'VIEW',
        categoryLabelEs: 'VISTA',
        icon: <Flame className="w-4 h-4 text-orange-500" />,
        action: () => {
          onSelectSeries('f1');
          onSelectTab('qualy');
        },
      },
      {
        id: 'view-last-race',
        title: lang === 'es' ? 'Último Gran Premio' : 'Last Grand Prix Results',
        subtitle: 'Race Results & Lap Times',
        category: 'view',
        categoryLabel: 'VIEW',
        categoryLabelEs: 'VISTA',
        icon: <Flag className="w-4 h-4 text-emerald-500" />,
        action: () => onSelectTab('last-race'),
      },

      // Quick Commands
      {
        id: 'cmd-tv',
        title: lang === 'es' ? 'Modo TV Companion (Pantalla Completa)' : 'TV Focus Mode (Fullscreen)',
        subtitle: lang === 'es' ? 'Segunda pantalla sin distracciones' : 'Second screen without distractions',
        category: 'command',
        categoryLabel: 'COMMAND',
        categoryLabelEs: 'COMANDO',
        icon: <Tv className="w-4 h-4 text-indigo-400" />,
        action: onToggleTvMode,
      },
      {
        id: 'cmd-theme',
        title: lang === 'es' ? 'Cambiar Tema (Claro / Oscuro)' : 'Toggle Theme (Light / Dark)',
        subtitle: 'Daytime / Night Mode',
        category: 'command',
        categoryLabel: 'COMMAND',
        categoryLabelEs: 'COMANDO',
        icon: <Sun className="w-4 h-4 text-amber-400" />,
        action: onToggleTheme,
      },
      {
        id: 'cmd-series-f1',
        title: 'Formula 1',
        subtitle: 'F1 World Championship',
        category: 'command',
        categoryLabel: 'SERIES',
        categoryLabelEs: 'CATEGORÍA',
        icon: <div className="w-4 h-4 rounded bg-[#E10600] text-white text-[9px] font-black flex items-center justify-center keep-white">F1</div>,
        action: () => onSelectSeries('f1'),
      },
      {
        id: 'cmd-series-f2',
        title: 'FIA Formula 2',
        subtitle: 'F2 Championship & Graduates',
        category: 'command',
        categoryLabel: 'SERIES',
        categoryLabelEs: 'CATEGORÍA',
        icon: <div className="w-4 h-4 rounded bg-[#009CDE] text-white text-[9px] font-black flex items-center justify-center keep-white">F2</div>,
        action: () => {
          onSelectSeries('f2');
          onSelectTab('standings');
        },
      },
      {
        id: 'cmd-series-f3',
        title: 'FIA Formula 3',
        subtitle: 'F3 Championship & Hall of Fame',
        category: 'command',
        categoryLabel: 'SERIES',
        categoryLabelEs: 'CATEGORÍA',
        icon: <div className="w-4 h-4 rounded bg-[#E35205] text-white text-[9px] font-black flex items-center justify-center keep-white">F3</div>,
        action: () => {
          onSelectSeries('f3');
          onSelectTab('standings');
        },
      },

      // F1 Drivers
      {
        id: 'driver-col',
        title: 'Franco Colapinto',
        subtitle: 'Alpine F1 Team • #43 🇦🇷',
        category: 'driver',
        categoryLabel: 'DRIVER',
        categoryLabelEs: 'PILOTO',
        icon: <User className="w-4 h-4 text-[#00A1E8]" />,
        action: () => onSelectDriver('Franco Colapinto'),
      },
      {
        id: 'driver-ver',
        title: 'Max Verstappen',
        subtitle: 'Red Bull Racing • #1 🇳🇱',
        category: 'driver',
        categoryLabel: 'DRIVER',
        categoryLabelEs: 'PILOTO',
        icon: <User className="w-4 h-4 text-[#3671C6]" />,
        action: () => onSelectDriver('Max Verstappen'),
      },
      {
        id: 'driver-nor',
        title: 'Lando Norris',
        subtitle: 'McLaren F1 Team • #4 🇬🇧',
        category: 'driver',
        categoryLabel: 'DRIVER',
        categoryLabelEs: 'PILOTO',
        icon: <User className="w-4 h-4 text-[#FF8000]" />,
        action: () => onSelectDriver('Lando Norris'),
      },
      {
        id: 'driver-pia',
        title: 'Oscar Piastri',
        subtitle: 'McLaren F1 Team • #81 🇦🇺',
        category: 'driver',
        categoryLabel: 'DRIVER',
        categoryLabelEs: 'PILOTO',
        icon: <User className="w-4 h-4 text-[#FF8000]" />,
        action: () => onSelectDriver('Oscar Piastri'),
      },
      {
        id: 'driver-lec',
        title: 'Charles Leclerc',
        subtitle: 'Scuderia Ferrari • #16 🇲🇨',
        category: 'driver',
        categoryLabel: 'DRIVER',
        categoryLabelEs: 'PILOTO',
        icon: <User className="w-4 h-4 text-[#E8002D]" />,
        action: () => onSelectDriver('Charles Leclerc'),
      },
      {
        id: 'driver-ham',
        title: 'Lewis Hamilton',
        subtitle: 'Scuderia Ferrari • #44 🇬🇧',
        category: 'driver',
        categoryLabel: 'DRIVER',
        categoryLabelEs: 'PILOTO',
        icon: <User className="w-4 h-4 text-[#E8002D]" />,
        action: () => onSelectDriver('Lewis Hamilton'),
      },
      {
        id: 'driver-alo',
        title: 'Fernando Alonso',
        subtitle: 'Aston Martin F1 • #14 🇪🇸',
        category: 'driver',
        categoryLabel: 'DRIVER',
        categoryLabelEs: 'PILOTO',
        icon: <User className="w-4 h-4 text-[#229971]" />,
        action: () => onSelectDriver('Fernando Alonso'),
      },
      {
        id: 'driver-rus',
        title: 'George Russell',
        subtitle: 'Mercedes-AMG F1 • #63 🇬🇧',
        category: 'driver',
        categoryLabel: 'DRIVER',
        categoryLabelEs: 'PILOTO',
        icon: <User className="w-4 h-4 text-[#27F4D2]" />,
        action: () => onSelectDriver('George Russell'),
      },
      {
        id: 'driver-sai',
        title: 'Carlos Sainz',
        subtitle: 'Williams Racing • #55 🇪🇸',
        category: 'driver',
        categoryLabel: 'DRIVER',
        categoryLabelEs: 'PILOTO',
        icon: <User className="w-4 h-4 text-[#64C4FF]" />,
        action: () => onSelectDriver('Carlos Sainz'),
      },
      {
        id: 'driver-ant',
        title: 'Kimi Antonelli',
        subtitle: 'Mercedes-AMG F1 • #12 🇮🇹',
        category: 'driver',
        categoryLabel: 'DRIVER',
        categoryLabelEs: 'PILOTO',
        icon: <User className="w-4 h-4 text-[#27F4D2]" />,
        action: () => onSelectDriver('Kimi Antonelli'),
      },

      // F1 Teams
      {
        id: 'team-ferrari',
        title: 'Scuderia Ferrari',
        subtitle: 'Maranello • Hamilton / Leclerc',
        category: 'team',
        categoryLabel: 'TEAM',
        categoryLabelEs: 'EQUIPO',
        icon: <Users className="w-4 h-4 text-[#E8002D]" />,
        action: () => {
          onSelectSeries('f1');
          onSelectTab('standings');
        },
      },
      {
        id: 'team-mclaren',
        title: 'McLaren Formula 1 Team',
        subtitle: 'Woking • Norris / Piastri',
        category: 'team',
        categoryLabel: 'TEAM',
        categoryLabelEs: 'EQUIPO',
        icon: <Users className="w-4 h-4 text-[#FF8000]" />,
        action: () => {
          onSelectSeries('f1');
          onSelectTab('standings');
        },
      },
      {
        id: 'team-alpine',
        title: 'Alpine F1 Team',
        subtitle: 'Enstone • Colapinto / Gasly',
        category: 'team',
        categoryLabel: 'TEAM',
        categoryLabelEs: 'EQUIPO',
        icon: <Users className="w-4 h-4 text-[#00A1E8]" />,
        action: () => {
          onSelectSeries('f1');
          onSelectTab('standings');
        },
      },
      {
        id: 'team-redbull',
        title: 'Red Bull Racing',
        subtitle: 'Milton Keynes • Verstappen / Tsunoda',
        category: 'team',
        categoryLabel: 'TEAM',
        categoryLabelEs: 'EQUIPO',
        icon: <Users className="w-4 h-4 text-[#3671C6]" />,
        action: () => {
          onSelectSeries('f1');
          onSelectTab('standings');
        },
      },
      {
        id: 'team-mercedes',
        title: 'Mercedes-AMG Petronas F1',
        subtitle: 'Brackley • Russell / Antonelli',
        category: 'team',
        categoryLabel: 'TEAM',
        categoryLabelEs: 'EQUIPO',
        icon: <Users className="w-4 h-4 text-[#27F4D2]" />,
        action: () => {
          onSelectSeries('f1');
          onSelectTab('standings');
        },
      },

      // Iconic Circuits
      {
        id: 'circuit-madring',
        title: 'Madring (Gran Premio de España)',
        subtitle: 'Circuito Madring • Madrid 🇪🇸',
        category: 'circuit',
        categoryLabel: 'CIRCUIT',
        categoryLabelEs: 'CIRCUITO',
        icon: <Globe className="w-4 h-4 text-amber-500" />,
        action: () => onSelectTab('schedule'),
      },
      {
        id: 'circuit-monza',
        title: 'Autodromo Nazionale Monza',
        subtitle: 'Gran Premio d\'Italia • Monza 🇮🇹',
        category: 'circuit',
        categoryLabel: 'CIRCUIT',
        categoryLabelEs: 'CIRCUITO',
        icon: <Globe className="w-4 h-4 text-emerald-500" />,
        action: () => onSelectTab('schedule'),
      },
      {
        id: 'circuit-silverstone',
        title: 'Silverstone Circuit',
        subtitle: 'British Grand Prix • Silverstone 🇬🇧',
        category: 'circuit',
        categoryLabel: 'CIRCUIT',
        categoryLabelEs: 'CIRCUITO',
        icon: <Globe className="w-4 h-4 text-sky-500" />,
        action: () => onSelectTab('schedule'),
      },
      {
        id: 'circuit-spa',
        title: 'Circuit de Spa-Francorchamps',
        subtitle: 'Belgian Grand Prix • Spa 🇧🇪',
        category: 'circuit',
        categoryLabel: 'CIRCUIT',
        categoryLabelEs: 'CIRCUITO',
        icon: <Globe className="w-4 h-4 text-yellow-500" />,
        action: () => onSelectTab('schedule'),
      },
      {
        id: 'circuit-interlagos',
        title: 'Autódromo José Carlos Pace (Interlagos)',
        subtitle: 'Grande Prêmio de São Paulo • Brasil 🇧🇷',
        category: 'circuit',
        categoryLabel: 'CIRCUIT',
        categoryLabelEs: 'CIRCUITO',
        icon: <Globe className="w-4 h-4 text-emerald-400" />,
        action: () => onSelectTab('schedule'),
      },

      // Historical Seasons
      {
        id: 'hist-1950',
        title: 'Temporada Histórica 1950',
        subtitle: 'Nino Farina & Alfa Romeo • Inaugural F1 Season',
        category: 'history',
        categoryLabel: 'HISTORY',
        categoryLabelEs: 'HISTORIA',
        icon: <History className="w-4 h-4 text-amber-600" />,
        action: () => {
          onSelectSeries('f1');
          onSelectHistoricalYear(1950);
          onSelectTab('standings');
        },
      },
      {
        id: 'hist-2024',
        title: 'Temporada Histórica 2024',
        subtitle: 'Max Verstappen & McLaren Champions',
        category: 'history',
        categoryLabel: 'HISTORY',
        categoryLabelEs: 'HISTORIA',
        icon: <History className="w-4 h-4 text-amber-500" />,
        action: () => {
          onSelectSeries('f1');
          onSelectHistoricalYear(2024);
          onSelectTab('standings');
        },
      },
      {
        id: 'hist-2021',
        title: 'Temporada Histórica 2021',
        subtitle: 'Verstappen vs Hamilton Yas Marina Thriller',
        category: 'history',
        categoryLabel: 'HISTORY',
        categoryLabelEs: 'HISTORIA',
        icon: <History className="w-4 h-4 text-amber-500" />,
        action: () => {
          onSelectSeries('f1');
          onSelectHistoricalYear(2021);
          onSelectTab('standings');
        },
      },
    ];

    return items;
  }, [lang, series, onSelectDriver, onSelectHistoricalYear, onSelectSeries, onSelectTab, onToggleTheme, onToggleTvMode]);

  // Filter items by query
  const filteredItems = useMemo(() => {
    if (!query.trim()) return allItems;
    const q = query.toLowerCase().trim();
    return allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle?.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [allItems, query]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-3 sm:px-4 select-none animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      {/* Command Box */}
      <div className="relative z-10 w-full max-w-xl bg-white dark:bg-[#10141E] border border-zinc-200 dark:border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col font-sans animate-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-zinc-200 dark:border-white/[0.08] gap-3">
          <Search className="w-5 h-5 text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={
              lang === 'es'
                ? 'Buscar piloto, equipo, circuito, año (1950-2026) o comando...'
                : 'Search driver, team, circuit, year (1950-2026) or command...'
            }
            className="flex-1 bg-transparent text-sm sm:text-base text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none font-mono"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-zinc-100 dark:bg-white/[0.06] border border-zinc-200 dark:border-white/[0.08] text-[10px] font-mono text-zinc-500 dark:text-zinc-400 font-bold">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="max-h-[60vh] overflow-y-auto divide-y divide-zinc-100 dark:divide-white/[0.04] p-1.5"
        >
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 font-mono text-xs">
              {lang === 'es'
                ? `No se encontraron resultados para "${query}".`
                : `No results found for "${query}".`}
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = selectedIndex === index;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-colors gap-3 ${
                    isSelected
                      ? 'bg-zinc-100 dark:bg-white/[0.08] text-zinc-900 dark:text-white'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200/80 dark:border-white/[0.06] shrink-0">
                      {item.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-xs sm:text-sm block truncate">
                        {item.title}
                      </span>
                      {item.subtitle && (
                        <span className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate block font-mono">
                          {item.subtitle}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-100 dark:bg-white/[0.05] text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-white/[0.06] shrink-0">
                    {lang === 'es' ? item.categoryLabelEs : item.categoryLabel}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-zinc-50 dark:bg-[#0B0E14] border-t border-zinc-200 dark:border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-zinc-500 dark:text-zinc-400 select-none">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-white/10 text-zinc-700 dark:text-zinc-300 text-[10px] font-bold">↑↓</kbd>{' '}
              {lang === 'es' ? 'Navegar' : 'Navigate'}
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-white/10 text-zinc-700 dark:text-zinc-300 text-[10px] font-bold">↵</kbd>{' '}
              {lang === 'es' ? 'Seleccionar' : 'Select'}
            </span>
          </div>
          <span className="font-bold text-zinc-400 text-[10px]">DELTA SEARCH</span>
        </div>
      </div>
    </div>
  );
};
