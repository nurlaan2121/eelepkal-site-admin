import { useVenueCreationStore } from "@/app/store/venueCreationStore";
import { superAdminVenueService } from "@/features/super-admin/venue";
import { useQuery } from "@tanstack/react-query";

export const Step5Amenities: React.FC = () => {
  const {amenities, setAmenities} = useVenueCreationStore();
  const selectedIds = amenities.amenitiesId || [];

  const {data: allAmenities = []} = useQuery({
    queryKey: ["amenities"],
    queryFn: superAdminVenueService.getAllAmenities,
  });

  const toggleAmenity = (id: number) => {
    const newIds = selectedIds.includes(id)
      ? selectedIds.filter((i) => i !== id)
      : [...selectedIds, id];
    setAmenities({amenitiesId: newIds});
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-bold text-slate-700 mb-4">
        Выберите услуги и удобства
      </p>
      <div className="flex flex-wrap gap-3">
        {allAmenities.map((amenity) => (
          <button
            key={amenity.id}
            onClick={() => toggleAmenity(amenity.id)}
            className={`px-5 py-3 rounded-xl border-2 transition-all text-sm font-bold ${
              selectedIds.includes(amenity.id)
                ? "border-brand-primary bg-brand-50 text-brand-700"
                : "border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            {amenity.name}
          </button>
        ))}
      </div>
      <p className="text-xs text-slate-500 mt-4">
        Выбрано: {selectedIds.length}
      </p>
    </div>
  );
};