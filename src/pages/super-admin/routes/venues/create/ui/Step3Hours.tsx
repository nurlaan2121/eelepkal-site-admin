import {useVenueCreationStore} from "@/app/store/venueCreationStore";
import {VenueWorkingHoursType, DAYS} from "@/features/venue-detail";

export const Step3Hours = () => {
  const {hours, setHours} = useVenueCreationStore();

  const toggleDayOff = (day: keyof VenueWorkingHoursType) => {
    const currentDay = hours[day];
    setHours({
      ...hours,
      [day]: {
        ...currentDay,
        isOff: !currentDay.isOff,
        open: !currentDay.isOff ? "00:00" : "09:00",
        close: !currentDay.isOff ? "00:00" : "23:00",
      },
    });
  };

  const updateHour = (
    day: keyof VenueWorkingHoursType,
    field: "open" | "close",
    value: string,
  ) => {
    setHours({
      ...hours,
      [day]: {...hours[day], [field]: value},
    });
  };

  return (
    <div className="space-y-4">
      {DAYS.map(({key, label}) => {
        const dayData = hours[key];
        return (
          <div key={key} className="bg-slate-50 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700">{label}</span>
              <button
                onClick={() => toggleDayOff(key)}
                className={`relative w-12 h-6 rounded-full transition-colors ${dayData.isOff ? "bg-slate-300" : "bg-brand-primary"}`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${dayData.isOff ? "left-1" : "left-7"}`}
                />
              </button>
            </div>
            {!dayData.isOff && (
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs text-slate-500 mb-1 block">
                    Открытие
                  </label>
                  <input
                    type="time"
                    value={dayData.open || "09:00"}
                    onChange={(e) => updateHour(key, "open", e.target.value)}
                    className="w-full h-11 border border-slate-200 rounded-xl px-3 text-sm font-bold focus:outline-none focus:border-brand-primary transition-colors"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-slate-500 mb-1 block">
                    Закрытие
                  </label>
                  <input
                    type="time"
                    value={dayData.close || "23:00"}
                    onChange={(e) => updateHour(key, "close", e.target.value)}
                    className="w-full h-11 border border-slate-200 rounded-xl px-3 text-sm font-bold focus:outline-none focus:border-brand-primary transition-colors"
                  />
                </div>
              </div>
            )}
            {dayData.isOff && (
              <p className="text-xs text-slate-400 font-medium">
                Выходной день
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};
