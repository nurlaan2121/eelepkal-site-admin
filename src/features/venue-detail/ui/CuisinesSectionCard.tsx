import {UtensilsCrossed} from "lucide-react";
import {InitialSecitonCardProps, VenueSectionCard} from "./VenueSectionCard";
import {VenueDetailsType} from "../model/types";

interface CuisinesSectionCardProps extends InitialSecitonCardProps {
  detailsData?: VenueDetailsType;
}

export const CuisinesSectionCard = ({
  className,
  delay,
  detailsData,
  actions,
  size,
  variant,
}: CuisinesSectionCardProps) => {
  if (!detailsData) return null;
  return (
    <VenueSectionCard
      title="Типы кухонь"
      icon={UtensilsCrossed}
      className={className}
      size={size}
      variant={variant}
      transition={{delay}}
      actions={actions}
    >
      <div className="flex flex-wrap gap-2">
        {detailsData.typesOfCuisines
          .split(",")
          .map((cuisine: string, idx: number) => (
            <span
              key={idx}
              className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-xl text-xs font-black border border-orange-100 uppercase tracking-wider"
            >
              {cuisine.trim()}
            </span>
          ))}
      </div>
    </VenueSectionCard>
  );
};
