import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Users, LayoutGrid, Info, Trash2, Edit2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { motion } from 'framer-motion';

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
        AVAILABLE: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        OCCUPIED: 'border-blue-200 bg-blue-50 text-blue-700',
        RESERVED: 'border-amber-200 bg-amber-50 text-amber-700',
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-display">Управление столами</h1>
                    <p className="text-gray-500">Настройка схемы зала и статусов столов в реальном времени</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <LayoutGrid size={18} />
                        Схема зала
                    </Button>
                    <Button className="gap-2">
                        <Plus size={18} />
                        Добавить стол
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
                {['ALL', 'AVAILABLE', 'OCCUPIED', 'RESERVED'].map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilter(s as any)}
                        className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${filter === s
                                ? 'bg-slate-900 border-slate-900 text-white'
                                : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                            }`}
                    >
                        {s === 'ALL' ? 'Все' : s === 'AVAILABLE' ? 'Свободны' : s === 'OCCUPIED' ? 'Заняты' : 'Бронь'}
                    </button>
                ))}
            </div>

            {/* Tables Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {filteredTables.map((table) => (
                    <motion.div
                        layout
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        key={table.id}
                        className={`relative p-6 rounded-2xl border-2 transition-shadow hover:shadow-lg ${statusStyles[table.status]}`}
                    >
                        <div className="absolute top-3 right-3 text-[10px] font-bold uppercase opacity-60">
                            {table.type}
                        </div>

                        <div className="flex flex-col items-center text-center space-y-3">
                            <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center font-bold text-xl">
                                {table.number}
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase opacity-80 mb-1">
                                    {table.status === 'AVAILABLE' ? 'Свободен' : table.status === 'OCCUPIED' ? 'Занят' : 'Забронирован'}
                                </p>
                                <div className="flex items-center justify-center gap-1.5 font-medium">
                                    <Users size={14} />
                                    <span>{table.capacity} мест</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-center gap-2 pt-4 border-t border-current/10">
                            <button className="p-1.5 rounded-lg hover:bg-white/50 transition-colors">
                                <Edit2 size={16} />
                            </button>
                            <button className="p-1.5 rounded-lg hover:bg-white/50 transition-colors">
                                <Info size={16} />
                            </button>
                            <button className="p-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
