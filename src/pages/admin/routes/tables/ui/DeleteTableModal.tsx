import {adminTableService} from "@/api/admin/table";
import {Button} from "@/shared/ui";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {AnimatePresence, motion} from "framer-motion";
import {AlertTriangle, Loader2, Trash2} from "lucide-react";
import {toast} from "sonner";

export const DeleteTableModal = ({
  isOpen,
  onClose,
  tableId,
}: {
  isOpen: boolean;
  onClose: () => void;
  tableId: number | null;
}) => {
  if (!tableId) return null;
  const queryClient = useQueryClient();

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => {
      return adminTableService.deleteTable(tableId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["admin-tables"]});
      toast.success("Столик удален");
      onClose();
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || error?.message || "Ошибка удаления";
      toast.error(errorMessage);
    },
  });
  const confirmDelete = () => {
    deleteMutation.mutate();
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
          />

          <motion.div
            initial={{opacity: 0, scale: 0.95}}
            animate={{opacity: 1, scale: 1}}
            exit={{opacity: 0, scale: 0.95}}
            transition={{type: "spring", duration: 0.3, bounce: 0.3}}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="bg-gradient-to-br from-red-500 to-red-600 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <AlertTriangle size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white">
                      Удалить столик?
                    </h2>
                    <p className="text-sm text-red-100 font-bold mt-1">
                      Это действие нельзя отменить
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                  <p className="text-sm font-bold text-red-900">
                    Вы собираетесь удалить столик #{tableId}. Все связанные
                    данные будут потеряны.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-6 border-t border-slate-100 bg-slate-50">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 h-12 rounded-xl font-bold"
                  disabled={deleteMutation.isPending}
                >
                  Отмена
                </Button>
                <Button
                  type="button"
                  onClick={confirmDelete}
                  disabled={deleteMutation.isPending}
                  className="flex-1 h-12 rounded-xl font-bold bg-red-500 hover:bg-red-600 disabled:opacity-50"
                >
                  {deleteMutation.isPending ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 size={18} className="animate-spin" />
                      <span>Удаление...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Trash2 size={18} />
                      <span>Удалить</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
