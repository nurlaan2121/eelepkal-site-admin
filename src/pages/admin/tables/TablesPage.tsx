import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Users, LayoutGrid, Info, Trash2, Edit2, Settings2, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { adminTableService, TableResponse } from '../../../api/admin/adminTableService';
import { AddTableModal } from './AddTableModal';

export const AdminTablesPage: React.FC = () => {
    const [filter, setFilter] = useState<'ALL' | 'AVAILABLE' | 'OCCUPIED' | 'RESERVED'>('ALL');
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [floor, setFloor] = useState<number>(1);
    const [page, setPage] = useState(0);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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

    const filteredTables = filter === 'ALL' ? tables : tables.filter(t => t.status === filter);

    // Date navigation
    const changeDate = (days: number) => {
        const date = new Date(selectedDate);
        date.setDate(date.getDate() + days);
        setSelectedDate(date.toISOString().split('T')[0]);
    };

    // Format date for display
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) return 'Сегодня';
        if (date.toDateString() === tomorrow.toDateString()) return 'Завтра';
        
        return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    };

    const statusStyles = {
        AVAILABLE: 'border-brand-200 bg-gradient-to-br from-brand-50 to-brand-100/50 text-brand-700 shadow-lg shadow-brand-100/50',
        OCCUPIED: 'border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 text-blue-700 shadow-lg shadow-blue-100/50',
        RESERVED: 'border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100/50 text-amber-700 shadow-lg shadow-amber-100/50',
    };

    const statusLabels = {
        AVAILABLE: 'FREE',
        OCCUPIED: 'BUSY',
        RESERVED: 'RSVN',
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
                    { key: 'AVAILABLE', label: 'Свободны' },
                    { key: 'OCCUPIED', label: 'Заняты' },
                    { key: 'RESERVED', label: 'Бронь' },
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
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredTables.map((table: TableResponse) => (
                        <motion.div
                            layout
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            key={table.id}
                            className={`relative p-5 md:p-6 rounded-3xl border-2 transition-all active:scale-95 touch-manipulation ${statusStyles[table.status as keyof typeof statusStyles]}`}
                        >
                            <div className="absolute top-3 right-3 text-[9px] font-black uppercase opacity-40">
                                {table.type ? typeLabels[table.type] || table.type : ''}
                            </div>

                            <div className="flex flex-col items-center text-center space-y-3">
                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-current flex items-center justify-center font-black text-xl md:text-2xl bg-white/40 backdrop-blur-sm">
                                    {table.number}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-70">
                                        {statusLabels[table.status as keyof typeof statusLabels]}
                                    </p>
                                    <div className="flex items-center justify-center gap-1.5 font-bold text-xs">
                                        <Users size={12} strokeWidth={3} />
                                        <span>{table.capacity} мест</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 pt-4 border-t border-current/10 flex items-center justify-around">
                                <button className="p-2 rounded-xl hover:bg-white/50 transition-colors">
                                    <Settings2 size={18} />
                                </button>
                                <button className="p-2 rounded-xl hover:bg-white/50 transition-colors">
                                    <Edit2 size={18} />
                                </button>
                                <button className="p-2 rounded-xl hover:bg-red-500 hover:text-white transition-colors">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Add Table Modal */}
            <AddTableModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                defaultFloor={floor}
            />
        </div>
    );
};
