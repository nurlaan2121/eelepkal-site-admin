import {Users} from "lucide-react";
import {InitialSecitonCardProps, VenueSectionCard} from "./VenueSectionCard";

interface Props extends InitialSecitonCardProps {
  capacities?: [string, number][];
}

export const CapacitiesSectionCard = ({
  size,
  variant,
  delay,
  capacities,
}: Props) => {
  if (!capacities) return null;
  if (capacities.length === 0) {
    return (
      <p className="text-slate-400 text-sm italic">
        Вместимость пока не указана
      </p>
    );
  }
  return (
    <VenueSectionCard
      size={size}
      variant={variant}
       title="Вместимость"
      icon={Users}
      transition={{delay}}
    >
      <div className="grid grid-cols-2 gap-3">
        {capacities.map(([title, value]) => (
          <div
            key={title}
            className="bg-gradient-to-br from-brand-50 to-white rounded-xl p-4 border border-brand-100"
          >
            <p className="text-xs font-bold text-slate-500 mb-1">{title}</p>
            <p className="text-2xl font-black text-brand-700">
              {String(value)}{" "}
              <span className="text-sm font-bold text-slate-400">мест</span>
            </p>
          </div>
        ))}
      </div>
    </VenueSectionCard>
  );
};
