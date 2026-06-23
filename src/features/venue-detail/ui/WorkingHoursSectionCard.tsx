import {Clock} from "lucide-react";
import {InitialSecitonCardProps, VenueSectionCard} from "./VenueSectionCard";
import {getTodayStatus} from "../utils/venueParsers";
import {DAYS} from "../model/hours/consts";
import {VenueWorkingHoursType} from "../model/types";

interface WorkingHoursSecitonCardProps extends InitialSecitonCardProps {
  hours?: VenueWorkingHoursType;
}

export const WorkingHoursSectionCard = ({
  className,
  variant,
  size,
  hours,
  actions,
  delay,
}: WorkingHoursSecitonCardProps) => {
  if (!hours) return null;

  const today = getTodayStatus(hours);
  return (
    <VenueSectionCard
      className={className}
      variant={variant}
      size={size}
      title="График работы"
      icon={Clock}
      transition={{delay}}
      actions={actions}
    >
      <div className="space-y-4">
        {DAYS.map((day) => {
          const {open, close, isOff} = hours[day.key];

          const isToday = day.key === today.dayName;
          const hasData = open && close;
          return (
            <div
              key={day.key}
              className={`flex items-center justify-between transition-all ${isToday ? "text-orange-600" : "text-slate-600"}`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-bold ${isToday ? "font-black" : ""}`}
                >
                  {day.label}
                </span>
                {isToday && (
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500 ml-1" />
                )}
              </div>
              <span
                className={`text-sm font-bold ${isOff ? "text-rose-500" : ""}`}
              >
                {!hasData
                  ? "Нет данных"
                  : isOff
                    ? "Выходной"
                    : `${open} — ${close}`}
              </span>
            </div>
          );
        })}
      </div>
    </VenueSectionCard>
  );
};
