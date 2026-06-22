import {Accordion, AccordionContent, AccordionTrigger} from "@/shared/ui";
import {ICON_MAP} from "@/features/venue-detail/model/amenity/consts";
import {ConciergeBell, Heart} from "lucide-react";
import {InitialSecitonCardProps, VenueSectionCard} from "./VenueSectionCard";
import {AmenitiesDataType} from "../model/types";

interface AmenitySectionCardProps extends InitialSecitonCardProps {
  amenities?: AmenitiesDataType;
}
export const AmenitySectionCard = ({
  amenities,
  className,
  variant,
  size,
  actions,
  delay,
}: AmenitySectionCardProps) => {
  if (!amenities) return null;
  const amenityEntries = Object.entries(amenities);

  if (amenityEntries.length === 0) {
    return (
      <p className="text-slate-400 text-sm italic">Удобства пока не указаны</p>
    );
  }

  return (
    <VenueSectionCard
      className={className}
      size={size}
      variant={variant}
      title="Удобства"
      icon={ConciergeBell}
      transition={{delay}}
      actions={actions}
    >
      <Accordion>
        <AccordionContent visibleCount={6} totalCount={amenityEntries.length}>
          {(isExpanded: boolean) => (
            <div className="grid grid-cols-3 gap-4">
              {amenityEntries
                .slice(0, isExpanded ? undefined : 6)
                .map(([id, name]) => (
                  <VenueAmenityChip key={id} name={name} />
                ))}
            </div>
          )}
        </AccordionContent>

        <AccordionTrigger total={amenityEntries.length} visible={6} />
      </Accordion>
    </VenueSectionCard>
  );
};

interface VenueAmenityChipProps {
  name: string;
}

const getAmenityConfig = (name: string) => {
  const n = name.toLowerCase();
  const match = ICON_MAP.find((item) =>
    item.keywords.some((keyword) => n.includes(keyword)),
  );

  return match
    ? {icon: <match.icon size={16} />, color: match.color}
    : {icon: <Heart size={16} />, color: "text-slate-400"};
};

const VenueAmenityChip: React.FC<VenueAmenityChipProps> = ({name}) => {
  const config = getAmenityConfig(name);

  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-slate-50 to-transparent rounded-2xl border border-slate-100 hover:border-brand-200 hover:from-brand-50 transition-all">
      <div className={`${config.color}`}>{config.icon}</div>
      <span className="text-sm font-bold text-slate-800 line-clamp-1">
        {name}
      </span>
    </div>
  );
};
