import React, { useEffect, useState } from 'react';
import { Flame } from 'lucide-react';

interface ReactionItem {
  id: string;
  emoji: string;
  label: string;
  defaultCount: number;
  activeColor: string;
  borderColor: string;
}

const REACTIONS: ReactionItem[] = [
  {
    id: 'masterclass',
    emoji: '👑',
    label: 'MASTERCLASS',
    defaultCount: 142,
    activeColor: 'text-[#FFD800] bg-[#FFD800]/10',
    borderColor: 'border-[#FFD800]/30',
  },
  {
    id: 'almuro',
    emoji: '💥',
    label: 'AL MURO',
    defaultCount: 89,
    activeColor: 'text-[#E10600] bg-[#E10600]/10',
    borderColor: 'border-[#E10600]/30',
  },
  {
    id: 'tractor',
    emoji: '🚜',
    label: 'TRACTOR',
    defaultCount: 64,
    activeColor: 'text-[#39B54A] bg-[#39B54A]/10',
    borderColor: 'border-[#39B54A]/30',
  },
  {
    id: 'robo',
    emoji: '🚨',
    label: 'SANCIÓN / ROBO',
    defaultCount: 47,
    activeColor: 'text-[#FF9500] bg-[#FF9500]/10',
    borderColor: 'border-[#FF9500]/30',
  },
  {
    id: 'radiopicante',
    emoji: '🌶️',
    label: 'RADIO PICANTE',
    defaultCount: 118,
    activeColor: 'text-[#FF3B30] bg-[#FF3B30]/10',
    borderColor: 'border-[#FF3B30]/30',
  },
  {
    id: 'drs',
    emoji: '💨',
    label: 'DRS A FONDO',
    defaultCount: 205,
    activeColor: 'text-[#27F4D2] bg-[#27F4D2]/10',
    borderColor: 'border-[#27F4D2]/30',
  },
];

const STORAGE_KEY = 'rebufo_folklore_reactions_v1';

export const FolkloreReactions: React.FC = () => {
  const [counts, setCounts] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    const initial: Record<string, number> = {};
    for (const r of REACTIONS) {
      initial[r.id] = r.defaultCount;
    }
    return initial;
  });

  const [tappedId, setTappedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(counts));
    } catch {
      // ignore
    }
  }, [counts]);

  const handleTap = (id: string) => {
    setCounts((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
    setTappedId(id);
    setTimeout(() => setTappedId(null), 300);
  };

  return (
    <div className="bg-[#14161A] border border-[#22262E] rounded-xs px-3 py-2 flex flex-col gap-1.5 select-none font-mono">
      {/* Header title */}
      <div className="flex items-center justify-between text-[10px]">
        <div className="flex items-center gap-1.5 text-[#8E929B] font-bold uppercase tracking-wider">
          <Flame className="w-3.5 h-3.5 text-[#E10600]" />
          <span>FOLKLORE EN VIVO • REACCIONES DE CARRERA</span>
        </div>
        <span className="text-[9px] text-[#8E929B] hidden sm:inline">
          TAP PARA SUMAR
        </span>
      </div>

      {/* Buttons Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
        {REACTIONS.map((r) => {
          const count = counts[r.id] || r.defaultCount;
          const isTapped = tappedId === r.id;

          return (
            <button
              key={r.id}
              type="button"
              onClick={() => handleTap(r.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xs border text-[11px] font-bold whitespace-nowrap transition-all duration-150 cursor-pointer active:scale-95 ${
                r.activeColor
              } ${r.borderColor} ${
                isTapped ? 'scale-105 ring-1 ring-white/30 shadow-xs' : 'hover:brightness-110'
              }`}
            >
              <span>{r.emoji}</span>
              <span className="text-[10px] tracking-tight">{r.label}</span>
              <span className="text-[10px] font-mono tabular-nums opacity-85 ml-0.5 bg-black/30 px-1 py-0.2 rounded-xs border border-white/5">
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
