import React, {useState, useEffect} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {X, Search, CheckCircle2, ChevronRight, LayoutGrid} from "lucide-react";
import {Button} from "@/components/ui/Button";
import {Amenity} from "@/types/venue";

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
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{y: "100%", opacity: 0}}
            animate={{y: 0, opacity: 1}}
            exit={{y: "100%", opacity: 0}}
            transition={{type: "spring", damping: 25, stiffness: 400}}
            className="relative bg-white rounded-t-3xl md:rounded-3xl w-full md:max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                  <LayoutGrid size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    Удобства и услуги
                  </h2>
                  <p className="text-xs text-slate-400 font-medium">
                    Выберите всё, что есть в заведении
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search */}
            <div className="p-5 bg-slate-50/50 border-b border-slate-100">
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
            <div className="flex-1 overflow-y-auto p-4 md:p-5">
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
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-slate-100 bg-white">
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
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
