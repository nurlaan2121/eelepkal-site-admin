import React from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck, Users, Utensils, MessageSquare } from 'lucide-react';
import { cn } from '../../../utils/cn';

const STATS = [
    { label: 'Новые бронирования', value: '12', icon: CalendarCheck, color: 'bg-blue-500' },
    { label: 'Постоянные клиенты', value: '84', icon: Users, color: 'bg-emerald-500' },
    { label: 'Популярное блюдо', value: 'Плов', icon: Utensils, color: 'bg-orange-500' },
    { label: 'Новые отзывы', value: '5', icon: MessageSquare, color: 'bg-purple-500' },
];

export const AdminDashboard = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Ваше заведение</h1>
                <p className="text-slate-500">Управление бронированиями и клиентами</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {STATS.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4"
                    >
                        <div className={cn("p-3 rounded-xl text-white", stat.color)}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-96 flex items-center justify-center text-slate-400">
                    Таблица текущих бронирований (в разработке)
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-96 flex items-center justify-center text-slate-400">
                    Сводка по столикам (в разработке)
                </div>
            </div>
        </div>
    );
};
