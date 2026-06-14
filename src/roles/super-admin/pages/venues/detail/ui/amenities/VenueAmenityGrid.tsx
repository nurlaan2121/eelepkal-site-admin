import React, {useState} from "react";
import {ChevronDown, ChevronUp} from "lucide-react";
import {VenueAmenityChip} from "./VenueAmenityChip";

interface VenueAmenityGridProps {
  amenities: number[];
  allAmenities: any[];
}

export const VenueAmenityGrid: React.FC<VenueAmenityGridProps> = ({
  amenities,
  allAmenities,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const safeAmenities = Array.isArray(amenities) ? amenities : [];

  if (safeAmenities.length === 0) {
    return (
      <p className="text-slate-400 text-sm italic">Удобства пока не указаны</p>
    );
  }

  const displayedAmenities = isExpanded
    ? safeAmenities
    : safeAmenities.slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {displayedAmenities.map((aId) => {
          const found = allAmenities?.find((a) => a.id === aId);
          return (
            <div
              key={aId}
              className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/50 border border-slate-100/50 transition-all hover:bg-white hover:shadow-md group"
            >
              <VenueAmenityChip
                id={aId}
                name={found?.name || `Услуга ${aId}`}
                minimized
              />
            </div>
          );
        })}
      </div>

      {safeAmenities.length > 4 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full h-12 flex items-center justify-center gap-2 text-sm font-black text-slate-500 uppercase tracking-widest hover:text-orange-500 transition-colors"
        >
          {isExpanded ? (
            <>
              Скрыть <ChevronUp size={16} />
            </>
          ) : (
            <>
              Ещё {safeAmenities.length - 4} <ChevronDown size={16} />
            </>
          )}
        </button>
      )}
    </div>
  );
};
