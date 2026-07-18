import React, {useState, useEffect} from "react";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {X, Loader2, Check, Settings2} from "lucide-react";
import {motion, AnimatePresence} from "framer-motion";
import {adminTableService} from "@/api/admin/table";
import {Button, Modal} from "@/shared/ui";
import {toast} from "sonner";
import {devService} from "@/api/dev";

interface EditTableServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableId: number | null;
  currentAmenities: string[];
}

export const EditTableServicesModal: React.FC<EditTableServicesModalProps> = ({
  isOpen,
  onClose,
  tableId,
  currentAmenities,
}) => {
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Загружаем ВСЕ доступные услуги
  const {data: amenities} = useQuery({
    queryKey: ["table-amenities"],
    queryFn: devService.getTableAmenities,
    enabled: isOpen,
  });

  // Загружаем ТЕКУЩИЕ услуги стола
  const {data: currentServiceIds} = useQuery({
    queryKey: ["table-services", tableId],
    queryFn: () => adminTableService.getTableServices(tableId!),
    enabled: isOpen && !!tableId,
  });

  useEffect(() => {
    if (isOpen && currentServiceIds) {
      // Конвертируем объект {"2": "Детские зоны"} в массив ID [2]
      const ids = Object.keys(currentServiceIds).map((key) => parseInt(key));
      setSelectedIds(ids);
    }
  }, [isOpen, currentServiceIds]);

  const toggleAmenity = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const updateMutation = useMutation({
    mutationFn: () => {
      if (!tableId) return Promise.reject("No tableId");
      return adminTableService.updateTableServices(tableId, selectedIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["admin-tables"]});
      toast.success("Услуги обновлены");
      onClose();
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || error?.message || "Ошибка обновления";
      toast.error(errorMessage);
    },
  });

  const handleSave = () => {
    updateMutation.mutate();
  };

  if (!isOpen || !tableId) return null;

  return (
    <Modal
      header={{
        icon: <Settings2 />,
        title: "Услуги и удобства",
        description: `Выбрано: ${selectedIds.length}`,
      }}
      onClose={onClose}
      open={isOpen}
      isShaded
      tone="purple"
      footer={
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 h-12 rounded-xl font-bold"
            disabled={updateMutation.isPending}
          >
            Отмена
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="flex-1 h-12 rounded-xl font-bold disabled:opacity-50"
          >
            {updateMutation.isPending ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 size={18} className="animate-spin" />
                <span>Сохранение...</span>
              </div>
            ) : (
              "Сохранить"
            )}
          </Button>
        </div>
      }
    >
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {amenities?.map((amenity) => (
          <button
            key={amenity.id}
            onClick={() => toggleAmenity(amenity.id)}
            className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
              selectedIds.includes(amenity.id)
                ? "border-purple-500 bg-purple-50"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">{amenity.title}</span>
              {selectedIds.includes(amenity.id) && (
                <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                  <Check size={16} className="text-white" />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </Modal>
  );
};
