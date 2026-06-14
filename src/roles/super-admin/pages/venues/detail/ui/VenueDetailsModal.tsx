import React, {useState, useEffect} from "react";
import {
  MapPin,
  DollarSign,
  Users,
  Save,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import {Button, Input, Select} from "@/shared/ui";
import {Modal} from "@/shared/ui";
import {VenueDetailsData} from "@/features/super-admin/venue";
import {Capacity, City} from "@/shared/types";

interface VenueDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDetails: VenueDetailsData;
  basicInfo: {
    address?: string;
    averageCheck?: number;
  };
  cities: City[];
  onSave: (details: VenueDetailsData) => void;
  isSaving: boolean;
}

export const VenueDetailsModal = ({
  isOpen,
  onClose,
  initialDetails,
  basicInfo,
  cities,
  onSave,
  isSaving,
}: VenueDetailsModalProps) => {
  const [cityId, setCityId] = useState<number>(0);
  const [address, setAddress] = useState("");
  const [averageCheck, setAverageCheck] = useState<number>(0);
  const [capacities, setCapacities] = useState<Capacity[]>([]);

  useEffect(() => {
    if (isOpen) {
      // address and averageCheck come from basicInfo API
      // cityId and capacities come from details API
      setCityId(initialDetails?.cityId || 0);
      setAddress(basicInfo?.address || initialDetails?.address || "");
      setAverageCheck(
        basicInfo?.averageCheck || initialDetails?.averageCheck || 0,
      );
      console.log(initialDetails);

      // Handle capacities - could be array or object
      const capacitiesData = initialDetails?.capacities;
      if (Array.isArray(capacitiesData)) {
        setCapacities(capacitiesData);
      } else if (capacitiesData && typeof capacitiesData === "object") {
        // Convert object format { "Кабина": 10, "Стол": 100 } to array
        const capacitiesArray = Object.entries(capacitiesData).map(
          ([title, value]) => ({
            title,
            value: Number(value),
          }),
        );
        setCapacities(capacitiesArray);
      } else {
        setCapacities([]);
      }
    }
  }, [isOpen, initialDetails, basicInfo]);

  const addCapacity = () => {
    setCapacities([...capacities, {title: "", value: 0}]);
  };

  const removeCapacity = (index: number) => {
    setCapacities(capacities.filter((_, i) => i !== index));
  };

  const updateCapacity = (
    index: number,
    field: "title" | "value",
    value: string | number,
  ) => {
    const newCapacities = [...capacities];
    newCapacities[index] = {...newCapacities[index], [field]: value};
    setCapacities(newCapacities);
  };

  const handleSave = () => {
    onSave({
      cityId,
      address,
      averageCheck,
      capacities,
    });
  };

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSave();
  };
  console.log(cityId);

  return (
    <Modal
      isShaded
      className="md:max-w-xl w-full"
      open={isOpen}
      onClose={onClose}
      header={{
        title: "Детали заведения",
        icon: <MapPin size={20} />,
        description: "Город, адрес, средний чек и вместимость",
      }}
      footer={
        <div className="flex gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="flex-1 rounded-2xl"
          >
            Отмена
          </Button>
          <Button
            type="submit"
            disabled={isSaving}
            className="flex-[2] rounded-2xl"
            form="venue-details-form"
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
      <form
        id="venue-details-form"
        className="space-y-6"
        onSubmit={handleSubmit}
      >
        <Select
          className="font-bold"
          label="Город"
          value={cityId}
          onChange={(e) => setCityId(Number(e.target.value))}
        >
          <option value={0}>Выберите город</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.title}
            </option>
          ))}
        </Select>

        {/* Address */}
        <Input
          className="font-bold"
          label="Адрес"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Введите адрес заведения"
          name="address"
        />

        {/* Average Check */}
        <Input
          icon={<DollarSign size={14} />}
          className="font-bold"
          label="Средний чек (сом)"
          type="number"
          value={averageCheck}
          onChange={(e) => setAverageCheck(Number(e.target.value))}
          min={0}
          name="averageCheck"
        />

        {/* Capacities */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
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
            {capacities.map((capacity, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl"
              >
                <input
                  type="text"
                  value={capacity.title}
                  onChange={(e) =>
                    updateCapacity(index, "title", e.target.value)
                  }
                  placeholder="Название (напр. Кабина)"
                  className="flex-1 h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm font-bold focus:border-orange-500 transition-all outline-none"
                />
                <input
                  type="number"
                  value={capacity.value}
                  onChange={(e) =>
                    updateCapacity(index, "value", Number(e.target.value))
                  }
                  placeholder="Кол-во"
                  min={0}
                  className="w-24 h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm font-bold focus:border-orange-500 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeCapacity(index)}
                  className="w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            {capacities.length === 0 && (
              <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl">
                <p className="text-sm text-slate-400 font-medium">
                  Нет данных о вместимости
                </p>
              </div>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
};
