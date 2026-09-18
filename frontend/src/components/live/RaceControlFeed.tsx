import { useState } from 'react';
import { ChevronDown, ChevronUp, Radio } from 'lucide-react';
import type { DriverLive, RaceControlMessage } from '../../types/f1';
import {
  formatMessageTime,
  getFlagBadgeConfig,
  translateFIAMessage,
} from '../../utils/fiaTranslation';
import { useLanguage } from '../../hooks/useLanguage';

interface RaceControlFeedProps {
  messages: RaceControlMessage[];
  drivers?: DriverLive[];
}

export const RaceControlFeed: React.FC<RaceControlFeedProps> = ({ messages, drivers }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { lang, t } = useLanguage();

  if (!messages || messages.length === 0) return null;

  const latestMessage = messages[0];
  const latestFlagBadge = getFlagBadgeConfig(latestMessage.flag, lang);

  return (
    <div className="bg-[#131722] border border-white/[0.08] rounded-xl overflow-hidden shadow-sm">
      {/* Feed Header / Summary Bar */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2.5 flex items-center justify-between gap-2 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2 overflow-hidden flex-1">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
          <Radio className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <span className="sm:hidden text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex-shrink-0">
            FIA:
          </span>
          <span className="hidden sm:inline text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex-shrink-0">
            {t.live.raceControl.title}:
          </span>
          <span className="text-xs text-zinc-200 font-mono truncate">
            {translateFIAMessage(latestMessage.text, drivers, lang)}
          </span>
          {latestFlagBadge && (
            <span
              className={`hidden sm:inline-block text-[9px] font-bold uppercase px-1.5 py-0.5 rounded font-mono ${latestFlagBadge.badgeClass}`}
            >
              {latestFlagBadge.text}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/[0.06] text-zinc-400">
            {messages.length}
          </span>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-zinc-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-zinc-400" />
          )}
        </div>
      </button>

      {/* Expanded Feed */}
      {isOpen && (
        <div className="max-h-56 overflow-y-auto divide-y divide-white/[0.04] bg-[#0B0E14] border-t border-white/[0.06]">
          {messages.map((m) => {
            const flagBadge = getFlagBadgeConfig(m.flag, lang);
            return (
              <div key={m.id || m.time} className="px-3 py-2 flex items-start gap-2.5 text-xs">
                <span className="font-mono text-[10px] text-zinc-500 font-tabular flex-shrink-0 mt-0.5">
                  {formatMessageTime(m.time)}
                </span>
                <div className="flex-1 flex items-center justify-between gap-2">
                  <span className="font-mono text-zinc-300 text-xs leading-relaxed">
                    {translateFIAMessage(m.text, drivers, lang)}
                  </span>
                  {flagBadge && (
                    <span
                      className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded font-mono flex-shrink-0 ${flagBadge.badgeClass}`}
                    >
                      {flagBadge.text}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
