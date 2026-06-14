import {useVenueCreationStore} from "@/app/store/venueCreationStore";
import {Input, Input2} from "@/shared/ui";

export const Step7Conditions: React.FC = () => {
  const {conditions, setConditions} = useVenueCreationStore();

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">
          Депозит (сом)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
          {[0, 500, 1000, 2000].map((amt) => (
            <button
              key={amt}
              onClick={() => setConditions({deposit: amt})}
              className={`flex-1 py-3.5 rounded-xl text-xs font-black border-2 transition-all ${
                conditions.deposit === amt
                  ? "bg-brand-primary text-white border-brand-primary"
                  : "bg-white text-slate-600 border-slate-200"
              }`}
            >
              {amt === 0 ? "Без депозита" : `${amt}`}
            </button>
          ))}
        </div>
        <Input
          type="number"
          value={conditions.deposit || ""}
          onChange={(e) => setConditions({deposit: Number(e.target.value)})}
          placeholder="Или введите сумму"
          name="deposit"
          className="border-2"
        />
      </div>

      <div className="bg-slate-50 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-slate-700">
            Можно отменить?
          </span>
          <button
            onClick={() =>
              setConditions({
                cancelAllowed: !conditions.cancelAllowed,
                cancellationDeadline: !conditions.cancelAllowed
                  ? "03:00"
                  : "00:00",
              })
            }
            className={`relative w-12 h-6 rounded-full transition-colors ${conditions.cancelAllowed ? "bg-brand-primary" : "bg-slate-300"}`}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${conditions.cancelAllowed ? "left-7" : "left-1"}`}
            />
          </button>
        </div>
        {conditions.cancelAllowed && (
          <div>
            <label className="text-xs text-slate-500 mb-1 block">
              За сколько часов до визита
            </label>
            <input
              type="time"
              value={conditions.cancellationDeadline || "03:00"}
              onChange={(e) =>
                setConditions({cancellationDeadline: e.target.value})
              }
              className="w-full h-11 border border-slate-200 rounded-xl px-3 text-sm font-bold focus:outline-none focus:border-brand-primary transition-colors"
            />
          </div>
        )}
      </div>

      <div className="bg-slate-50 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-slate-700">
            Можно редактировать?
          </span>
          <button
            onClick={() =>
              setConditions({
                editAllowed: !conditions.editAllowed,
                editingDeadline: !conditions.editAllowed ? "05:00" : "00:00",
              })
            }
            className={`relative w-12 h-6 rounded-full transition-colors ${conditions.editAllowed ? "bg-brand-primary" : "bg-slate-300"}`}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${conditions.editAllowed ? "left-7" : "left-1"}`}
            />
          </button>
        </div>
        {conditions.editAllowed && (
          <div>
            <label className="text-xs text-slate-500 mb-1 block">
              За сколько часов до визита
            </label>
            <input
              type="time"
              value={conditions.editingDeadline || "05:00"}
              onChange={(e) => setConditions({editingDeadline: e.target.value})}
              className="w-full h-11 border border-slate-200 rounded-xl px-3 text-sm font-bold focus:outline-none focus:border-brand-primary transition-colors"
            />
          </div>
        )}
      </div>
    </div>
  );
};
