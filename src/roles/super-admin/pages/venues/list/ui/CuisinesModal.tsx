import {
  superAdminVenueService,
  VenueListItem,
} from "@/features/super-admin/venue";
import {Button} from "@/shared/ui/Button";
import {useMutation, useQuery} from "@tanstack/react-query";
import {Plus, Search, UtensilsCrossed, X} from "lucide-react";
import {useState} from "react";
import {toast} from "sonner";
import {Input, Modal} from "@/shared/ui";

export const CuisinesModal = ({
  venue,
  onClose,
}: {
  venue: VenueListItem;
  onClose: () => void;
}) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [search, setSearch] = useState("");

  const {data: allCuisines, isLoading: isLoadingAll} = useQuery({
    queryKey: ["cuisines-all"],
    queryFn: () => superAdminVenueService.getAllCuisines(),
  });

  const {isLoading: isFetchingCurrent} = useQuery({
    queryKey: ["venue-cuisines", venue.venueId],
    queryFn: async () => {
      const data = await superAdminVenueService.getCuisines(venue.venueId);
      setSelectedIds(data || []);
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: () =>
      superAdminVenueService.addVenueCuisines(venue.venueId, {
        cuisinesIds: selectedIds,
      }),
    onSuccess: () => {
      toast.success("Типы кухни обновлены!");
      onClose();
    },
    onError: (e: any) =>
      toast.error(e?.response?.data?.message || "Ошибка сохранения"),
  });

  const filteredCuisines =
    allCuisines?.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase()),
    ) || [];

  const toggleCuisine = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  return (
    <Modal
      onClose={onClose}
      open={true}
      isShaded={true}
      header={{
        title: "Типы кухни",
        description: venue.name,
        icon: <UtensilsCrossed size={20} />,
      }}
      footer={
        <Button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending || isLoadingAll || isFetchingCurrent}
          className="w-full h-12 font-black text-sm"
        >
          {mutation.isPending
            ? "Сохранение..."
            : `Сохранить (${selectedIds.length})`}
        </Button>
      }
    >
      <Input
        variant="outline"
        size="sm"
        icon={<Search size={16} />}
        type="text"
        placeholder="Поиск кухни..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="flex-1 overflow-y-auto">
        {isLoadingAll || isFetchingCurrent ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-bold text-slate-400">
              Загрузка данных...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {filteredCuisines.map((cuisine) => {
              const isSelected = selectedIds.includes(cuisine.id);
              return (
                <button
                  key={cuisine.id}
                  onClick={() => toggleCuisine(cuisine.id)}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    isSelected
                      ? "bg-brand-50 border-brand-primary text-brand-700"
                      : "bg-white border-slate-100 text-slate-600 hover:border-slate-200"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-brand-primary border-brand-primary"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {isSelected && (
                      <Plus className="text-white rotate-45" size={12} />
                    )}
                  </div>
                  <span className="text-xs font-black truncate">
                    {cuisine.name}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
};
