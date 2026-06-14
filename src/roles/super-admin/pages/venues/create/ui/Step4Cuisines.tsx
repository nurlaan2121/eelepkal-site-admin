import { useVenueCreationStore } from "@/app/store/venueCreationStore";
import { superAdminVenueService } from "@/features/super-admin/venue";
import { useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";

export const Step4Cuisines = () => {
  const {cuisines, setCuisines} = useVenueCreationStore();
  const selectedIds = cuisines.cuisinesIds || [];

  const {data: allCuisines = []} = useQuery({
    queryKey: ["cuisines"],
    queryFn: () => superAdminVenueService.getAllCuisines(0, 100),
  });

  const toggleCuisine = (id: number) => {
    const newIds = selectedIds.includes(id)
      ? selectedIds.filter((i) => i !== id)
      : [...selectedIds, id];
    setCuisines({cuisinesIds: newIds});
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-bold text-slate-700 mb-4">
        Выберите типы кухни
      </p>
      <div className="grid grid-cols-2 gap-3">
        {allCuisines.map((cuisine) => (
          <button
            key={cuisine.id}
            onClick={() => toggleCuisine(cuisine.id)}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              selectedIds.includes(cuisine.id)
                ? "border-brand-primary bg-brand-50"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${
                  selectedIds.includes(cuisine.id)
                    ? "border-brand-primary bg-brand-primary"
                    : "border-slate-300"
                }`}
              >
                {selectedIds.includes(cuisine.id) && (
                  <Check size={14} className="text-white" />
                )}
              </div>
              <span className="text-sm font-bold text-slate-700">
                {cuisine.name}
              </span>
            </div>
          </button>
        ))}
      </div>
      <p className="text-xs text-slate-500 mt-4">
        Выбрано: {selectedIds.length}
      </p>
    </div>
  );
};
