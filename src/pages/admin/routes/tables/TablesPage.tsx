import React, {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {Plus, LayoutGrid, Calendar} from "lucide-react";
import {adminTableService} from "@/api/admin/table";
import {AddTableModal} from "./ui/AddTableModal";
import {PageLayout} from "@/shared/layouts";
import {formatDateDisplay} from "@/shared/utils/functions";
import {TablesList} from "./ui/TablesList";
import {Button} from "@/shared/ui";
import {motion} from "framer-motion";

export const AdminTablesPage: React.FC = () => {
  const [filter, setFilter] = useState<"ALL" | "OPEN" | "BUSY" | "RSVN">("ALL");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [floor, setFloor] = useState<number>(1);
  const [page, setPage] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const limit = 20;

  // Fetch tables
  const {data: tablesData, isLoading} = useQuery({
    queryKey: ["admin-tables", selectedDate, floor, page],
    queryFn: () =>
      adminTableService.getAllTables({
        date: selectedDate,
        floor,
        offset: page * limit,
        limit,
      }),
  });

  const tables = tablesData?.tableGetAllResponses || [];
  const countOpen = tablesData?.countOpen || 0;
  const countBusy = tablesData?.countBusy || 0;
  const countWaiting = tablesData?.countWaiting || 0;

  const filteredTables =
    filter === "ALL" ? tables : tables.filter((t) => t.tableStatus === filter);

  // Status update mutation

  const typeLabels: Record<string, string> = {
    TABLE: "Стол",
    BOOTH: "Кабина",
    VIP: "VIP",
  };
  const tabs = [
    {key: "ALL", label: "Все"},
    {key: "OPEN", label: "Свободны"},
    {key: "BUSY", label: "Заняты"},
    {key: "RSVN", label: "Бронь"},
  ];
  motion;
  return (
    <PageLayout
      title=" Схема столов"
      description="Мониторинг залов в реальном времени"
      actions={
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="gap-2 rounded-2xl">
            <LayoutGrid size={20} />
            Схема зала
          </Button>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            variant="gradient"
            className="gap-2 rounded-2xl"
          >
            <Plus size={20} />
            <span>Добавить стол</span>
          </Button>
        </div>
      }
    >
      {/* Filters */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 px-1 md:px-0 pb-2">
        <div className="relative flex p-1 bg-slate-100 rounded-2xl w-fit">
          {tabs.map((tab) => (
            <button
              onClick={() => setFilter(tab.key as any)}
              key={tab.key}
              className="relative z-10 px-6 py-2 ..."
            >
              {filter === tab.key && (
                <motion.div
                  layoutId="tab-pill" // Главная магия Framer Motion
                  className="absolute inset-0 bg-white rounded-xl shadow-sm"
                />
              )}
              <span className="relative z-20">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Date Picker */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 flex-shrink-0">
            <Calendar size={20} className="text-brand-600" />
            <span className="text-sm font-black text-slate-700">Дата:</span>
          </div>
          <div className="flex-1 relative">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 cursor-pointer"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div className="flex-shrink-0 px-4 py-2 bg-brand-50 rounded-xl">
            <span className="text-xs font-bold text-brand-700">
              {formatDateDisplay(selectedDate)}
            </span>
          </div>
        </div>
      </div>

      {/* Tables Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-6">
          {Array.from({length: 12}).map((_, i) => (
            <div
              key={i}
              className="relative p-5 md:p-6 rounded-3xl border-2 border-slate-200 bg-slate-100 animate-pulse"
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-slate-200" />
                <div className="space-y-2 w-full">
                  <div className="h-3 bg-slate-200 rounded w-1/2 mx-auto" />
                  <div className="h-3 bg-slate-200 rounded w-2/3 mx-auto" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredTables.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <LayoutGrid size={32} className="text-slate-300" />
          </div>
          <h3 className="text-lg font-black text-slate-900 mb-2">
            Нет столиков
          </h3>
          <p className="text-sm text-slate-400 font-medium max-w-xs">
            На выбранную дату нет столиков или попробуйте изменить фильтры
          </p>
        </div>
      ) : (
        <TablesList tables={filteredTables} selectedDate={selectedDate} />
      )}

      {/* Add Table Modal */}
      <AddTableModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultFloor={floor}
      />
    </PageLayout>
  );
};
