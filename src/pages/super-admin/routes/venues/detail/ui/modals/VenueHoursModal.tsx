import {useState, useEffect} from "react";
import {Clock, AlertCircle, Save, Loader2} from "lucide-react";
import {Button, Modal} from "@/shared/ui";
import {VenueWorkingHoursType, DAYS} from "@/features/venue";

interface VenueHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialHours: VenueWorkingHoursType;
  onSave: (hours: VenueWorkingHoursType) => void;
  isSaving: boolean;
}
export const VenueHoursModal = ({
  isOpen,
  onClose,
  initialHours,
  onSave,
  isSaving,
}: VenueHoursModalProps) => {
  const [hours, setHours] = useState<VenueWorkingHoursType>(initialHours);
  const [dayOffs, setDayOffs] = useState<Record<string, boolean>>({});
  const [validationError, setValidationError] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      setHours(initialHours);
      const offs: Record<string, boolean> = {};
      DAYS.forEach((day) => {
        console.log(initialHours);

        const open = initialHours[day.key].open;
        const close = initialHours[day.key].close;
        if (open === "00:00" && close === "00:00") {
          offs[day.key] = true;
        } else {
          offs[day.key] = false;
        }
      });

      setDayOffs(offs);
    }
  }, [isOpen, initialHours]);

  const handleTimeChange = (
    day: keyof VenueWorkingHoursType,
    type: "open" | "close",
    value: string,
  ) => {
    setHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [type]: value,
      },
    }));
  };

  const toggleDayOff = (day: keyof VenueWorkingHoursType) => {
    setDayOffs((prev) => ({...prev, [day]: !prev[day]}));
    setHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        isOff: !prev[day].isOff,
        open: !prev[day].isOff ? "00:00" : "09:00",
        close: !prev[day].isOff ? "00:00" : "23:00",
      },
    }));
  };

  const validateHours = (): boolean => {
    for (const day of DAYS) {
      if (dayOffs[day.key]) continue;

      const open = (hours as any)[`${day.key}Open`];
      const close = (hours as any)[`${day.key}Close`];

      if (open && close) {
        // Compare times as strings (works for HH:MM format)
        if (open > close) {
          setValidationError(
            `${day.label}: время открытия (${open}) не может быть позднее времени закрытия (${close})`,
          );
          return false;
        }
      }
    }
    setValidationError("");
    return true;
  };

  const handleSave = () => {
    if (validateHours()) {
      onSave(hours);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isShaded
      open={isOpen}
      onClose={onClose}
      header={{
        title: "График работы",
        description: "Настройте время работы на каждый день",
        icon: <Clock size={20} className="text-orange-600" />,
        iconClassName: "bg-orange-50",
      }}
      footer={
        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex-1 rounded-2xl "
          >
            Отмена
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-[2] rounded-2xl"
          >
            {isSaving ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              <Save size={18} className="mr-2" />
            )}
            Сохранить изменения
          </Button>
        </div>
      }
    >
      {/* Validation Error */}
      {validationError && (
        <div className="mx-6 mt-4 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
          <AlertCircle
            size={20}
            className="text-rose-500 flex-shrink-0 mt-0.5"
          />
          <p className="text-sm font-bold text-rose-700">{validationError}</p>
        </div>
      )}
      {DAYS.map((day) => {
        const isOff = dayOffs[day.key];
        return (
          <div
            key={day.key}
            className={`p-4 rounded-2xl border transition-all ${isOff ? "bg-slate-50 border-slate-100" : "bg-white border-slate-100 shadow-sm"}`}
          >
            <div className="flex items-center justify-between flex-wrap mb-3">
              <span
                className={`text-sm font-black ${isOff ? "text-slate-400" : "text-slate-800"}`}
              >
                {day.label}
              </span>
              <button
                onClick={() => toggleDayOff(day.key)}
                className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${isOff ? "bg-rose-100 text-rose-600" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
              >
                {isOff ? "Выходной" : "Сделать выходным"}
              </button>
            </div>

            {!isOff && (
              <div className="flex items-center gap-4">
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                    Открытие
                  </label>
                  <input
                    type="time"
                    value={hours[day.key].open}
                    onChange={(e) =>
                      handleTimeChange(day.key, "open", e.target.value)
                    }
                    className="w-full h-11 px-4 bg-slate-50 border-transparent rounded-xl text-sm font-bold focus:bg-white focus:border-orange-500 transition-all outline-none"
                  />
                </div>
                <div className="h-4 w-4 border-b-2 border-slate-200 mt-5" />
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                    Закрытие
                  </label>
                  <input
                    type="time"
                    value={hours[day.key].close}
                    onChange={(e) =>
                      handleTimeChange(day.key, "close", e.target.value)
                    }
                    className="w-full h-11 px-4 bg-slate-50 border-transparent rounded-xl text-sm font-bold focus:bg-white focus:border-orange-500 transition-all outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </Modal>
  );
};
