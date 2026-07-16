import React, {useState, useEffect} from "react";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {X, Loader2, Check, Settings2} from "lucide-react";
import {motion, AnimatePresence} from "framer-motion";
import {adminTableService} from "@/api/admin/table";
import {Button, Modal} from "@/shared/ui";
import {toast} from "sonner";
import {devService} from "@/api/dev";

interface EditTableTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableId: number | null;
  currentType: string;
}

export const EditTableTypeModal: React.FC<EditTableTypeModalProps> = ({
  isOpen,
  onClose,
  tableId,
  currentType,
}) => {
  const queryClient = useQueryClient();
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
  const [selectedTypeName, setSelectedTypeName] = useState<string>(currentType);

  const {data: tableTypes} = useQuery({
    queryKey: ["table-types"],
    queryFn: devService.getTableTypes,
    enabled: isOpen,
  });

  useEffect(() => {
    if (isOpen) {
      setSelectedTypeName(currentType);
      if (tableTypes) {
        setSelectedTypeId(tableTypes[currentType] || null);
      }
    }
  }, [isOpen, currentType, tableTypes]);

  const updateMutation = useMutation({
    mutationFn: () => {
      if (!tableId || selectedTypeId === null) return Promise.reject("No data");
      return adminTableService.updateTableType(tableId, selectedTypeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["admin-tables"]});
      toast.success("Тип столика обновлен");
      onClose();
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || error?.message || "Ошибка обновления";
      toast.error(errorMessage);
    },
  });

  const handleSave = () => {
    if (selectedTypeId === null) {
      toast.error("Выберите тип столика");
      return;
    }
    updateMutation.mutate();
  };

  if (!isOpen || !tableId) return null;
  return (
    <Modal
      header={{
        icon: <Settings2 />,
        title: "Тип столика",
        description: `Текущий: ${currentType}`,
      }}
      onClose={onClose}
      open={isOpen}
      isShaded
      tone="blue"
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
            disabled={updateMutation.isPending || selectedTypeId === null}
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
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {tableTypes &&
          Object.entries(tableTypes).map(([name, id]) => (
            <button
              key={id}
              onClick={() => {
                setSelectedTypeId(id);
                setSelectedTypeName(name);
              }}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                selectedTypeId === id
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{name}</span>
                {selectedTypeId === id && (
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
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
