import React, {useState, useEffect} from "react";
import { Search, CheckCircle2, LayoutGrid} from "lucide-react";
import {Button, Modal} from "@/shared/ui";
import {Amenity} from "@/shared/types";

interface VenueAmenitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAmenities: number[];
  allAmenities: Amenity[];
  onSave: (amenitiesId: number[]) => void;
  isSaving: boolean;
}

export const VenueAmenitiesModal: React.FC<VenueAmenitiesModalProps> = ({
  isOpen,
  onClose,
  initialAmenities,
  allAmenities,
  onSave,
  isSaving,
}) => {
  const [selectedIds, setSelectedIds] = useState<number[]>(initialAmenities);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (isOpen) {
      setSelectedIds(initialAmenities);
    }
  }, [isOpen, initialAmenities]);

  const filteredAmenities =
    allAmenities?.filter((a) =>
      a.name.toLowerCase().includes(search.toLowerCase()),
    ) || [];

  const toggleAmenity = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  return (
    <Modal
      isShaded
      open={isOpen}
      onClose={onClose}
      header={{
        title: "Удобства и услуги",
        description: "Выберите всё, что есть в заведении",
        icon: <LayoutGrid size={20} />,
      }}
      footer={
        <Button
          onClick={() => onSave(selectedIds)}
          disabled={isSaving}
          size="lg"
          className="w-full rounded-2xl font-black uppercase tracking-widest"
        >
          {isSaving
            ? "Сохранение..."
            : `Сохранить изменения (${selectedIds.length})`}
        </Button>
      }
    >
      {/* Search */}
      <div className="pb-4 bg-slate-50/50 border-b border-slate-100">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Поиск по названию..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 pl-10 pr-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:border-brand-primary transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Amenities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredAmenities.map((amenity) => {
          const isSelected = selectedIds.includes(amenity.id);
          return (
            <button
              key={amenity.id}
              onClick={() => toggleAmenity(amenity.id)}
              className={`group flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                isSelected
                  ? "bg-brand-primary/5 border-brand-primary text-brand-primary shadow-lg shadow-brand-primary/5"
                  : "bg-white border-slate-100 text-slate-600 hover:border-slate-200 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3 text-left">
                <div
                  className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm ${isSelected ? "bg-brand-primary text-white font-black" : "bg-slate-100 text-slate-400 font-bold"}`}
                >
                  {amenity.name.charAt(0)}
                </div>
                <span className="text-sm font-black tracking-tight">
                  {amenity.name}
                </span>
              </div>
              <div
                className={`shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                  isSelected
                    ? "bg-brand-primary border-brand-primary"
                    : "border-slate-200 bg-white group-hover:border-slate-300"
                }`}
              >
                {isSelected && (
                  <CheckCircle2 size={12} className="text-white" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </Modal>
  );
};
