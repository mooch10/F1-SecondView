import React, { useEffect } from 'react';
import { X, AlertTriangle, Flag, Volume2, VolumeX, Radio, Trophy, Disc } from 'lucide-react';
import type { LiveAlert } from '../../hooks/useLiveAlerts';

interface LiveAlertToastProps {
  alerts: LiveAlert[];
  onDismiss: (id: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const LiveAlertToast: React.FC<LiveAlertToastProps> = ({
  alerts,
  onDismiss,
  soundEnabled,
  onToggleSound,
}) => {
  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-14 right-3 sm:right-5 z-50 flex flex-col gap-2 max-w-sm w-[calc(100vw-24px)] pointer-events-none">
      {alerts.map((alert) => (
        <AlertToastItem
          key={alert.id}
          alert={alert}
          onDismiss={onDismiss}
          soundEnabled={soundEnabled}
          onToggleSound={onToggleSound}
        />
      ))}
    </div>
  );
};

interface AlertToastItemProps {
  alert: LiveAlert;
  onDismiss: (id: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

const AlertToastItem: React.FC<AlertToastItemProps> = ({
  alert,
  onDismiss,
  soundEnabled,
  onToggleSound,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(alert.id);
    }, 6000);
    return () => clearTimeout(timer);
  }, [alert.id, onDismiss]);

  const getIcon = () => {
    switch (alert.type) {
      case 'SC':
      case 'VSC':
        return <AlertTriangle className="w-4 h-4 text-amber-400 animate-bounce" />;
      case 'RED':
        return <Flag className="w-4 h-4 text-rose-500 animate-pulse" />;
      case 'CHEQUERED':
        return <Disc className="w-4 h-4 text-white animate-spin" />;
      case 'PIT':
        return <Radio className="w-4 h-4 text-sky-400 animate-pulse" />;
      case 'LEADER':
        return <Trophy className="w-4 h-4 text-amber-300" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div
      className="pointer-events-auto relative overflow-hidden bg-[#131722]/95 backdrop-blur-md border border-white/[0.15] rounded-xl shadow-2xl p-3 text-zinc-100 flex items-start gap-3 transition-all animate-in slide-in-from-top-3 duration-200"
      style={{
        borderLeftWidth: '4px',
        borderLeftColor: alert.color || '#FFD60A',
      }}
      role="alert"
    >
      <div className="shrink-0 p-1.5 rounded-lg bg-black/40 border border-white/[0.08] mt-0.5">
        {getIcon()}
      </div>

      <div className="flex-1 min-w-0 pr-6">
        <h4 className="text-xs font-mono font-black uppercase tracking-wider text-white leading-tight">
          {alert.title}
        </h4>
        <p className="text-[11px] font-sans text-zinc-300 mt-0.5 leading-snug">
          {alert.subtitle}
        </p>
      </div>

      {/* Top-Right action controls */}
      <div className="absolute top-2 right-2 flex items-center gap-1">
        <button
          type="button"
          onClick={onToggleSound}
          className="w-6 h-6 rounded-md bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
          title={soundEnabled ? 'Silenciar sonidos' : 'Activar sonidos'}
        >
          {soundEnabled ? (
            <Volume2 className="w-3 h-3 text-emerald-400" />
          ) : (
            <VolumeX className="w-3 h-3 text-zinc-500" />
          )}
        </button>

        <button
          type="button"
          onClick={() => onDismiss(alert.id)}
          className="w-6 h-6 rounded-md bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
          title="Cerrar notificación"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 6s Countdown Progress line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] opacity-75 animate-[progress_6s_linear]"
        style={{ backgroundColor: alert.color || '#FFD60A' }}
      />
    </div>
  );
};
