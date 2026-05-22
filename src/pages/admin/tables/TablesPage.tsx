import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Users, LayoutGrid, Info, Trash2, Edit2, Settings2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

interface Table {
    id: number;
    number: string | number;
    capacity: number;
    status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED';
    type: 'TABLE' | 'BOOTH' | 'VIP';
}

export const AdminTablesPage: React.FC = () => {
    const [filter, setFilter] = React.useState<'ALL' | 'AVAILABLE' | 'OCCUPIED' | 'RESERVED'>('ALL');

    const tables: Table[] = [
        { id: 1, number: 1, capacity: 4, status: 'AVAILABLE', type: 'TABLE' },
        { id: 2, number: 2, capacity: 2, status: 'OCCUPIED', type: 'TABLE' },
        { id: 3, number: 3, capacity: 4, status: 'RESERVED', type: 'TABLE' },
        { id: 4, number: 'C1', capacity: 8, status: 'AVAILABLE', type: 'BOOTH' },
        { id: 5, number: 'VIP1', capacity: 10, status: 'OCCUPIED', type: 'VIP' },
        { id: 6, number: 4, capacity: 4, status: 'AVAILABLE', type: 'TABLE' },
        { id: 7, number: 5, capacity: 2, status: 'AVAILABLE', type: 'TABLE' },
        { id: 8, number: 6, capacity: 4, status: 'RESERVED', type: 'TABLE' },
    ];

    const filteredTables = filter === 'ALL' ? tables : tables.filter(t => t.status === filter);

    const statusStyles = {
        AVAILABLE: 'border-emerald-200 bg-emerald-50 text-emerald-700 shadow-emerald-50',
        OCCUPIED: 'border-blue-200 bg-blue-50 text-blue-700 shadow-blue-50',
        RESERVED: 'border-amber-200 bg-amber-50 text-amber-700 shadow-amber-50',
    };

    return (
        <div className="space-y-6 pb-20 md:pb-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1 md:px-0">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Схема столов</h1>
                    <p className="text-gray-500 text-sm md:text-base">Мониторинг залов в реальном времени</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button variant="outline" className="flex-1 md:flex-none gap-2 h-12 md:h-11 rounded-xl">
                        <LayoutGrid size={20} />
                        <span className="hidden md:inline">Схема зала</span>
                    </Button>
                    <Button className="flex-1 md:flex-none gap-2 h-12 md:h-11 rounded-xl shadow-lg shadow-emerald-100">
                        <Plus size={20} />
                        <span>Добавить стол</span>
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex overflow-x-auto no-scrollbar gap-2 px-1 md:px-0 pb-2">
                {['ALL', 'AVAILABLE', 'OCCUPIED', 'RESERVED'].map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilter(s as any)}
                        className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all whitespace-nowrap ${filter === s
                                ? 'bg-slate-900 border-slate-900 text-white shadow-lg'
                                : 'bg-white border-gray-100 text-gray-500 hover:border-gray-300'
                            }`}
                    >
                        {s === 'ALL' ? 'Все' : s === 'AVAILABLE' ? 'Свободны' : s === 'OCCUPIED' ? 'Заняты' : 'Бронь'}
                    </button>
                ))}
            </div>

            {/* Tables Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredTables.map((table) => (
                        <motion.div
                            layout
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            key={table.id}
                            className={`relative p-5 md:p-6 rounded-3xl border-2 transition-all active:scale-95 touch-manipulation shadow-sm ${statusStyles[table.status]}`}
                        >
                            <div className="absolute top-3 right-3 text-[9px] font-black uppercase opacity-40">
                                {table.type}
                            </div>

                            <div className="flex flex-col items-center text-center space-y-3">
                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-current flex items-center justify-center font-black text-xl md:text-2xl bg-white/40 backdrop-blur-sm">
                                    {table.number}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-70">
                                        {table.status === 'AVAILABLE' ? 'FREE' : table.status === 'OCCUPIED' ? 'BUSY' : 'RSVN'}
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
        </div>
    );
};
