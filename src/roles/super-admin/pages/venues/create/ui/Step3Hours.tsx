import { useVenueCreationStore } from "@/app/store/venueCreationStore";
import { DayOfWeek, VenueWorkingHours } from "@/features/super-admin/venue";

export const Step3Hours = () => {
  const {hours, setHours} = useVenueCreationStore();
  const defaultWorkingHours: VenueWorkingHours = {
    mondayOpen: "09:00",
    mondayClose: "23:00",
    tuesdayOpen: "09:00",
    tuesdayClose: "23:00",
    wednesdayOpen: "09:00",
    wednesdayClose: "23:00",
    thursdayOpen: "09:00",
    thursdayClose: "23:00",
    fridayOpen: "09:00",
    fridayClose: "23:00",
    saturdayOpen: "09:00",
    saturdayClose: "23:00",
    sundayOpen: "09:00",
    sundayClose: "23:00",
  };
  const hoursData = hours.hours || defaultWorkingHours;
  const isDayOff = hours.isDayOff || {
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  };

  const days: {
    key: DayOfWeek;
    label: string;
    openField: keyof VenueWorkingHours;
    closeField: keyof VenueWorkingHours;
  }[] = [
    {
      key: "monday",
      label: "Понедельник",
      openField: "mondayOpen",
      closeField: "mondayClose",
    },
    {
      key: "tuesday",
      label: "Вторник",
      openField: "tuesdayOpen",
      closeField: "tuesdayClose",
    },
    {
      key: "wednesday",
      label: "Среда",
      openField: "wednesdayOpen",
      closeField: "wednesdayClose",
    },
    {
      key: "thursday",
      label: "Четверг",
      openField: "thursdayOpen",
      closeField: "thursdayClose",
    },
    {
      key: "friday",
      label: "Пятница",
      openField: "fridayOpen",
      closeField: "fridayClose",
    },
    {
      key: "saturday",
      label: "Суббота",
      openField: "saturdayOpen",
      closeField: "saturdayClose",
    },
    {
      key: "sunday",
      label: "Воскресенье",
      openField: "sundayOpen",
      closeField: "sundayClose",
    },
  ];

  const toggleDayOff = (day: DayOfWeek) => {
    const newIsDayOff = {...isDayOff, [day]: !isDayOff[day]};
    setHours({isDayOff: newIsDayOff});

    const dayConfig = days.find((d) => d.key === day)!;
    if (!newIsDayOff[day]) {
      setHours({
        hours: {
          ...hoursData,
          [dayConfig.openField]: "09:00",
          [dayConfig.closeField]: "23:00",
        },
      });
    } else {
      setHours({
        hours: {
          ...hoursData,
          [dayConfig.openField]: "00:00",
          [dayConfig.closeField]: "00:00",
        },
      });
    }
  };

  const updateHour = (field: keyof VenueWorkingHours, value: string) => {
    setHours({hours: {...hoursData, [field]: value}});
  };

  return (
    <div className="space-y-4">
      {days.map(({key, label, openField, closeField}) => (
        <div key={key} className="bg-slate-50 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-700">{label}</span>
            <button
              onClick={() => toggleDayOff(key)}
              className={`relative w-12 h-6 rounded-full transition-colors ${isDayOff[key] ? "bg-slate-300" : "bg-brand-primary"}`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${isDayOff[key] ? "left-1" : "left-7"}`}
              />
            </button>
          </div>
          {!isDayOff[key] && (
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-slate-500 mb-1 block">
                  Открытие
                </label>
                <input
                  type="time"
                  value={hoursData[openField] || "09:00"}
                  onChange={(e) => updateHour(openField, e.target.value)}
                  className="w-full h-11 border border-slate-200 rounded-xl px-3 text-sm font-bold focus:outline-none focus:border-brand-primary transition-colors"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-slate-500 mb-1 block">
                  Закрытие
                </label>
                <input
                  type="time"
                  value={hoursData[closeField] || "23:00"}
                  onChange={(e) => updateHour(closeField, e.target.value)}
                  className="w-full h-11 border border-slate-200 rounded-xl px-3 text-sm font-bold focus:outline-none focus:border-brand-primary transition-colors"
                />
              </div>
            </div>
          )}
          {isDayOff[key] && (
            <p className="text-xs text-slate-400 font-medium">Выходной день</p>
          )}
        </div>
      ))}
    </div>
  );
};
