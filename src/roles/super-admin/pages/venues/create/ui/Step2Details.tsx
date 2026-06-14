import {useVenueCreationStore} from "@/app/store/venueCreationStore";
import {Input, Input2, Select} from "@/shared/ui";
import {superAdminVenueService} from "@/features/super-admin/venue";
import {Button} from "@/shared/ui";
import {useQuery} from "@tanstack/react-query";
import {DollarSign, Plus, Trash2, Users} from "lucide-react";

export const Step2Details: React.FC = () => {
  const {details, setDetails} = useVenueCreationStore();

  const {data: cities = [], isLoading} = useQuery({
    queryKey: ["cities"],
    queryFn: superAdminVenueService.getAllCities,
  });

  const capacities = details.capacities || [];

  const addCapacity = () => {
    setDetails({
      ...details,
      capacities: [...capacities, {title: "", value: 0}],
    });
  };

  const removeCapacity = (index: number) => {
    setDetails({
      ...details,
      capacities: capacities.filter((_, i) => i !== index),
    });
  };

  const updateCapacity = (
    index: number,
    field: "title" | "value",
    value: string | number,
  ) => {
    const newCapacities = [...capacities];
    newCapacities[index] = {...newCapacities[index], [field]: value};
    setDetails({...details, capacities: newCapacities});
  };

  return (
    <div className="space-y-6">
      <div>
        <Select
          label="Город"
          required
          value={details.cityId || ""}
          onChange={(e) =>
            setDetails({...details, cityId: Number(e.target.value)})
          }
          disabled={isLoading}
        >
          <option value="">Выберите город</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.title}
            </option>
          ))}
        </Select>
        {isLoading && (
          <p className="text-xs text-slate-400 mt-2">Загрузка городов...</p>
        )}
      </div>

      <Input
        label="Адрес"
        required
        value={details.address || ""}
        onChange={(e) => setDetails({...details, address: e.target.value})}
        placeholder="г. Бишкек, ул. Ибраимова 115"
        type="text"
        name="address"
      />
      <Input
        labelIcon={<DollarSign size={14} />}
        label="Средний чек (сом)"
        required
        placeholder="1500"
        type="number"
        value={details.averageCheck || ""}
        onChange={(e) =>
          setDetails({...details, averageCheck: Number(e.target.value)})
        }
        name="averageCheck"
      />

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-black text-slate-700 uppercase flex gap-2 tracking-wider ">
            <Users size={14} />
            Вместимость
          </label>
          <Button
            type="button"
            onClick={addCapacity}
            variant="secondary"
            size="sm"
            className="font-black gap-1"
          >
            <Plus size={14} />
            Добавить
          </Button>
        </div>
        <div className="space-y-3">
          {capacities.map((cap, idx) => (
            <div key={idx} className="flex gap-3">
              <Input
                size="sm"
                value={cap.title}
                onChange={(e) => updateCapacity(idx, "title", e.target.value)}
                placeholder="Тип (напр: Банкетный зал)"
                name={`${idx}-room-title`}
                className="flex-1"
              />
              <Input
                size="sm"
                type="number"
                value={cap.value}
                onChange={(e) =>
                  updateCapacity(idx, "value", Number(e.target.value))
                }
                placeholder="Кол-во"
                name={`${idx}-amount`}
                className="w-32"
              />
              <button
                onClick={() => removeCapacity(idx)}
                className="w-12 h-12 flex flex-shrink-0 items-center justify-center text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
