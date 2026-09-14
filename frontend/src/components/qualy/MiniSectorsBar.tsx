import React from 'react';
import type { MiniSectorStatus } from '../../types/f1';
import { useLanguage } from '../../hooks/useLanguage';

interface MiniSectorsBarProps {
  segments?: {
    s1?: MiniSectorStatus[];
    s2?: MiniSectorStatus[];
    s3?: MiniSectorStatus[];
  };
  detailed?: boolean;
}

const DEFAULT_S1_COUNT = 6;
const DEFAULT_S2_COUNT = 7;
const DEFAULT_S3_COUNT = 7;

export const MiniSectorsBar: React.FC<MiniSectorsBarProps> = ({
  segments,
  detailed = false,
}) => {
  const { t } = useLanguage();
  const getSegmentClass = (status: MiniSectorStatus) => {
    switch (status) {
      case 'purple':
        return 'bg-[#A855F7] shadow-[0_0_6px_rgba(168,85,247,0.8)]';
      case 'green':
        return 'bg-[#10B981] shadow-[0_0_6px_rgba(16,185,129,0.8)]';
      case 'yellow':
        return 'bg-[#F59E0B] shadow-[0_0_4px_rgba(245,158,11,0.4)]';
      case 'blue':
        return 'bg-[#38BDF8]';
      default:
        return 'bg-white/[0.08]';
    }
  };

  const getSectorSegments = (list?: MiniSectorStatus[], fallbackCount = 6) => {
    if (list && list.length > 0) return list;
    return Array<MiniSectorStatus>(fallbackCount).fill('none');
  };

  const s1List = getSectorSegments(segments?.s1, DEFAULT_S1_COUNT);
  const s2List = getSectorSegments(segments?.s2, DEFAULT_S2_COUNT);
  const s3List = getSectorSegments(segments?.s3, DEFAULT_S3_COUNT);

  if (!detailed) {
    return (
      <div
        className="flex items-center gap-1 sm:gap-1.5 w-full select-none py-0.5"
        title="Mini-sectores en tiempo real (S1 | S2 | S3)"
      >
        {/* Sector 1 Mini-Segments */}
        <div className="flex items-center gap-[2px] flex-1">
          {s1List.map((st, i) => (
            <span
              key={`s1-${i}-${st}`}
              className={`h-2.5 sm:h-2 flex-1 rounded-[1.5px] transition-colors ${getSegmentClass(st)}`}
            />
          ))}
        </div>

        <div className="w-[1.5px] h-3 bg-white/30 shrink-0" />

        {/* Sector 2 Mini-Segments */}
        <div className="flex items-center gap-[2px] flex-1">
          {s2List.map((st, i) => (
            <span
              key={`s2-${i}-${st}`}
              className={`h-2.5 sm:h-2 flex-1 rounded-[1.5px] transition-colors ${getSegmentClass(st)}`}
            />
          ))}
        </div>

        <div className="w-[1.5px] h-3 bg-white/30 shrink-0" />

        {/* Sector 3 Mini-Segments */}
        <div className="flex items-center gap-[2px] flex-1">
          {s3List.map((st, i) => (
            <span
              key={`s3-${i}-${st}`}
              className={`h-2.5 sm:h-2 flex-1 rounded-[1.5px] transition-colors ${getSegmentClass(st)}`}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5 w-full bg-[#131722] border border-white/[0.06] rounded-lg p-2.5">
      <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400 font-bold uppercase tracking-wider mb-0.5">
        <span>{t.live.miniSectors.title}</span>
        <div className="flex items-center gap-2 text-[8px]">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A855F7]" /> {t.live.miniSectors.sessionRecord}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> {t.live.miniSectors.personal}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" /> {t.live.miniSectors.noImprovement}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {/* Sector 1 */}
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-mono text-zinc-500 font-bold">SECTOR 1</span>
          <div className="flex items-center gap-[2px]">
            {s1List.map((st, i) => (
              <span
                key={`s1-det-${i}-${st}`}
                className={`h-2 flex-1 rounded-[2px] transition-colors ${getSegmentClass(st)}`}
              />
            ))}
          </div>
        </div>

        {/* Sector 2 */}
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-mono text-zinc-500 font-bold">SECTOR 2</span>
          <div className="flex items-center gap-[2px]">
            {s2List.map((st, i) => (
              <span
                key={`s2-det-${i}-${st}`}
                className={`h-2 flex-1 rounded-[2px] transition-colors ${getSegmentClass(st)}`}
              />
            ))}
          </div>
        </div>

        {/* Sector 3 */}
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-mono text-zinc-500 font-bold">SECTOR 3</span>
          <div className="flex items-center gap-[2px]">
            {s3List.map((st, i) => (
              <span
                key={`s3-det-${i}-${st}`}
                className={`h-2 flex-1 rounded-[2px] transition-colors ${getSegmentClass(st)}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
