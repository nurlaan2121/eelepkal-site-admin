import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Users, LayoutGrid, Info, Trash2, Edit2, Settings2, Calendar, MoreVertical } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { adminTableService, TableResponse } from '../../../api/admin/adminTableService';
import { AddTableModal } from './AddTableModal';
import { EditTableModal } from './EditTableModal';
import { toast } from 'sonner';

export const AdminTablesPage: React.FC = () => {
    const [filter, setFilter] = useState<'ALL' | 'OPEN' | 'BUSY' | 'RSVN'>('ALL');
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [floor, setFloor] = useState<number>(1);
    const [page, setPage] = useState(0);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTableId, setEditingTableId] = useState<number | null>(null);
    const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
    const limit = 20;

    // Fetch tables
    const { data: tablesData, isLoading } = useQuery({
        queryKey: ['admin-tables', selectedDate, floor, page],
        queryFn: () => adminTableService.getAllTables({
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

    const filteredTables = filter === 'ALL' ? tables : tables.filter(t => t.tableStatus === filter);

    // Format date for display
    const formatDateDisplay = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) return 'Сегодня';
        if (date.toDateString() === tomorrow.toDateString()) return 'Завтра';
        
        return date.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'long' });
    };

    const handleEdit = (tableId: number) => {
        console.log('Card clicked, tableId:', tableId);
        setEditingTableId(tableId);
        setIsEditModalOpen(true);
    };

    const toggleMenu = (tableId: number) => {
        setActiveMenuId(activeMenuId === tableId ? null : tableId);
    };

    const statusStyles = {
        OPEN: 'border-brand-200 bg-gradient-to-br from-brand-50 to-brand-100/50 text-brand-700 shadow-lg shadow-brand-100/50',
        BUSY: 'border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 text-blue-700 shadow-lg shadow-blue-100/50',
        RSVN: 'border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100/50 text-amber-700 shadow-lg shadow-amber-100/50',
    };

    const statusLabels = {
        OPEN: 'FREE',
        BUSY: 'BUSY',
        RSVN: 'RSVN',
    };

    const typeLabels: Record<string, string> = {
        TABLE: 'Стол',
        BOOTH: 'Кабина',
        VIP: 'VIP',
    };

    return (
        <div className="space-y-6 pb-20 md:pb-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1 md:px-0">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Схема столов</h1>
                    <p className="text-gray-500 text-sm md:text-base">Мониторинг залов в реальном времени</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button variant="outline" className="flex-1 md:flex-none gap-2 h-12 md:h-11 rounded-xl font-bold">
                        <LayoutGrid size={20} />
                        <span className="hidden md:inline">Схема зала</span>
                    </Button>
                    <Button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex-1 md:flex-none gap-2 h-12 md:h-11 rounded-xl shadow-lg shadow-brand-100 font-bold uppercase tracking-wider text-xs"
                    >
                        <Plus size={20} />
                        <span>Добавить стол</span>
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex overflow-x-auto no-scrollbar gap-2 px-1 md:px-0 pb-2">
                {[
                    { key: 'ALL', label: 'Все' },
                    { key: 'OPEN', label: 'Свободны' },
                    { key: 'BUSY', label: 'Заняты' },
                    { key: 'RSVN', label: 'Бронь' },
                ].map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => setFilter(key as any)}
                        className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all whitespace-nowrap ${
                            filter === key
                                ? 'bg-slate-900 border-slate-900 text-white shadow-lg'
                                : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
                        }`}
                    >
                        {label}
                    </button>
                ))}
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
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-sm font-bold text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 cursor-pointer"
                            min={new Date().toISOString().split('T')[0]}
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
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6">
                    {Array.from({ length: 12 }).map((_, i) => (
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredTables.map((table: TableResponse) => {
                            console.log('Table object:', table);
                            return (
                        <motion.div
                            layout
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            key={table.etableId}
                            onClick={() => {
                                console.log('Clicked table.etableId:', table.etableId, 'full table:', table);
                                handleEdit(table.etableId);
                            }}
                            className={`relative p-6 md:p-8 rounded-3xl border-2 transition-all active:scale-95 touch-manipulation cursor-pointer hover:shadow-xl hover:-translate-y-1 ${statusStyles[table.tableStatus as keyof typeof statusStyles]}`}
                        >
                            {/* Menu Button */}
                            <div className="absolute top-4 right-4 z-10">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleMenu(table.etableId);
                                    }}
                                    className="p-2 rounded-xl bg-white/60 hover:bg-white transition-colors backdrop-blur-sm"
                                >
                                    <MoreVertical size={18} className="text-slate-600" />
                                </button>
                                
                                {/* Dropdown Menu */}
                                <AnimatePresence>
                                    {activeMenuId === table.etableId && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                            className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50"
                                        >
                                            <div className="p-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toast.info('Изменение типа столика');
                                                        setActiveMenuId(null);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors text-left"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                                        <Settings2 size={16} className="text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">Тип столика</p>
                                                        <p className="text-xs text-slate-500">{table.tableType}</p>
                                                    </div>
                                                </button>
                                                
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toast.info('Управление услугами');
                                                        setActiveMenuId(null);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors text-left"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                                                        <LayoutGrid size={16} className="text-purple-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">Услуги и удобства</p>
                                                        <p className="text-xs text-slate-500">Настроить</p>
                                                    </div>
                                                </button>
                                                
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toast.info('Типы мероприятий');
                                                        setActiveMenuId(null);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors text-left"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                                                        <Calendar size={16} className="text-amber-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">Типы мероприятий</p>
                                                        <p className="text-xs text-slate-500">Настроить</p>
                                                    </div>
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="flex flex-col items-center text-center space-y-4 pt-2">
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-3 border-current flex items-center justify-center font-black text-2xl md:text-3xl bg-white/40 backdrop-blur-sm">
                                    {table.tableTitle}
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs font-black uppercase tracking-widest opacity-70">
                                        {statusLabels[table.tableStatus as keyof typeof statusLabels]}
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
                                        toast.info('Настройки');
                                    }}
                                    className="p-3 rounded-xl hover:bg-white/50 transition-colors"
                                >
                                    <Settings2 size={20} />
                                </button>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit(table.etableId);
                                    }}
                                    className="p-3 rounded-xl hover:bg-white/50 transition-colors"
                                >
                                    <Edit2 size={20} />
                                </button>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toast.info('Удалить столик');
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
            )}

            {/* Add Table Modal */}
            <AddTableModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                defaultFloor={floor}
            />

            {/* Edit Table Modal */}
            <EditTableModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEditingTableId(null);
                }}
                tableId={editingTableId}
                selectedDate={selectedDate}
            />
        </div>
    );
};
