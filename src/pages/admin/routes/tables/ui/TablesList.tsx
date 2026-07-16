import {adminTableService, TableResponse} from "@/api/admin/table";
import {AnimatePresence, motion} from "framer-motion";
import {ActionMenu, ActionMenuItem} from "@/shared/ui";
import {
  Calendar,
  Edit2,
  LayoutGrid,
  Settings2,
  Trash2,
  Users,
} from "lucide-react";
import {EditTableModal} from "./EditTableModal";
import {EditTableTypeModal} from "./EditTableTypeModal";
import {EditTableServicesModal} from "./EditTableServicesModal";
import {EditTableEventsModal} from "./EditTableEventsModal";
import {useState} from "react";
import {DeleteTableModal} from "./DeleteTableModal";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import { cn } from "@/shared/utils/cn";

export const TablesList = ({
  tables,
  selectedDate,
}: {
  tables: TableResponse[];
  selectedDate: string;
}) => {
  const queryClient = useQueryClient();
  const [activeModal, setActiveModal] = useState<
    "type" | "services" | "events" | "edit" | "delete" | null
  >(null);
  const [activeTable, setActiveTable] = useState<TableResponse | null>(null);

  const statusStyles = {
    // OPEN: Оставляем приятный синий/брендовый — это нормальное состояние
    OPEN: "border-brand-200 bg-white text-brand-700 shadow-sm",

    // BUSY: Делаем акцентным. Красный/Розовый — лучший цвет для "Занято"
    BUSY: "border-rose-200 bg-rose-50 text-rose-700 shadow-sm",

    // RSVN: Оставляем янтарный — он отлично читается как "Ожидание/Бронь"
    RSVN: "border-amber-200 bg-amber-50 text-amber-700 shadow-sm",
  };

  const statusLabels = {
    OPEN: "Свободно",
    BUSY: "Занято",
    RSVN: "Зарезервировано",
  };

  const statusMutation = useMutation({
    mutationFn: ({
      tableId,
      action,
    }: {
      tableId: number;
      action: "OPEN" | "CLOSE";
    }) => {
      return adminTableService.updateTableStatus(tableId, selectedDate, action);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["admin-tables"]});
      toast.success("Статус столика обновлен");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Ошибка обновления статуса";
      toast.error(errorMessage);
    },
  });

  const getActionItems = (table: TableResponse): ActionMenuItem[] => [
    {
      id: "table-type",
      icon: <Settings2 size={16} />,
      label: "Тип столика",
      color: "text-blue-600",
      onClick: () => {
        setActiveModal("type");
        setActiveTable(table);
      },
    },
    {
      id: "table-services",
      icon: <LayoutGrid size={16} />,
      label: "Услуги и удобства",
      color: "text-purple-600",
      onClick: () => {
        setActiveModal("services");
        setActiveTable(table);
      },
    },
    {
      id: "conditions",
      icon: <Calendar size={16} />,
      label: "Типы мероприятий",
      color: "text-amber-600",
      onClick: () => {
        setActiveModal("events");
        setActiveTable(table);
      },
    },
  ];
  const closeHandler = () => {
    setActiveTable(null);
    setActiveModal(null);
  };
  const handleEdit = (table: TableResponse) => {
    setActiveTable(table);
    setActiveModal("edit");
  };
  const handleDeleteClick = (table: TableResponse) => {
    setActiveTable(table);
    setActiveModal("delete");
  };
  const handleStatusToggle = (tableId: number, currentStatus: string) => {
    const newAction = currentStatus === "OPEN" ? "CLOSE" : "OPEN";
    const actionLabel = newAction === "OPEN" ? "открыть" : "закрыть";

    toast.promise(statusMutation.mutateAsync({tableId, action: newAction}), {
      loading: `Обновление статуса...`,
      success: `Столик ${actionLabel}`,
      error: "Ошибка обновления статуса",
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        <AnimatePresence mode="wait">
          {tables.map((table: TableResponse) => {
            const primaryColor =
              table.tableStatus === "BUSY"
                ? "hover:bg-white/50"
                : "hover:bg-brand-100/20";
            return (
              <motion.div
                layout
                initial={{scale: 0.9, opacity: 0}}
                animate={{scale: 1, opacity: 1}}
                exit={{scale: 0.9, opacity: 0}}
                key={table.etableId}
                className={`relative p-6 md:p-8 rounded-2xl border transition-all touch-manipulation hover:shadow-lg hover:-translate-y-1 ${statusStyles[table.tableStatus as keyof typeof statusStyles]}`}
              >
                {/* Menu Button */}
                <div className="absolute top-4 right-4 z-10">
                  <ActionMenu
                    items={getActionItems(table)}
                    variant="light"
                    size="large"
                    triggerClassName={primaryColor}
                  />
                </div>

                <div className="flex flex-col items-center text-center space-y-4 pt-2">
                  <div className="border-3 border-current flex items-center justify-center font-black text-2xl md:text-3xl">
                    {table.tableTitle}
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-black uppercase tracking-widest opacity-70">
                      {
                        statusLabels[
                          table.tableStatus as keyof typeof statusLabels
                        ]
                      }
                    </p>
                    <div className="flex items-center justify-center gap-2 font-bold text-sm">
                      <Users size={16} strokeWidth={3} />
                      <span>{table.capacity} мест</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-current/10 flex items-center justify-around">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusToggle(table.etableId, table.tableStatus);
                    }}
                    className={cn(primaryColor, "p-3 rounded-xl transition-colors")}
                    title={
                      table.tableStatus === "OPEN"
                        ? "Закрыть столик"
                        : "Открыть столик"
                    }
                  >
                    <Settings2 size={20} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(table);
                    }}
                    className={cn(primaryColor, "p-3 rounded-xl transition-colors")}
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(table);
                    }}
                    className="p-3 rounded-xl hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      {/* Edit Table Modal */}
      <EditTableModal
        isOpen={activeModal === "edit"}
        onClose={closeHandler}
        tableId={activeTable?.etableId || null}
        selectedDate={selectedDate}
      />

      {/* Edit Table Type Modal */}
      <EditTableTypeModal
        isOpen={activeModal === "type"}
        onClose={closeHandler}
        tableId={activeTable?.etableId || null}
        currentType={activeTable?.tableType || ""}
      />

      {/* Edit Table Services Modal */}
      <EditTableServicesModal
        isOpen={activeModal === "services"}
        onClose={closeHandler}
        tableId={activeTable?.etableId || null}
        currentAmenities={[]}
      />

      {/* Edit Table Events Modal */}
      <EditTableEventsModal
        isOpen={activeModal === "events"}
        onClose={closeHandler}
        tableId={activeTable?.etableId || null}
        currentEvents={[]}
      />
      <DeleteTableModal
        isOpen={activeModal === "delete"}
        onClose={closeHandler}
        tableId={activeTable?.etableId || null}
      />
    </>
  );
};
