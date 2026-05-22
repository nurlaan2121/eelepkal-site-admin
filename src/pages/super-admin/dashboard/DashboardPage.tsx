import React from 'react';
import { motion } from 'framer-motion';
import { Store, Users, CalendarCheck, TrendingUp } from 'lucide-react';

const STATS = [
    { label: 'Всего заведений', value: '24', icon: Store, color: 'bg-blue-500' },
    { label: 'Активных админов', value: '18', icon: Users, color: 'bg-emerald-500' },
    { label: 'Бронирований сегодня', value: '142', icon: CalendarCheck, color: 'bg-orange-500' },
    { label: 'Выручка платформы', value: '₸ 450к', icon: TrendingUp, color: 'bg-purple-500' },
];

export const SuperAdminDashboard = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Панель управления</h1>
                <p className="text-slate-500">Обзор всей платформы Ээлеп кал</p>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-80 flex items-center justify-center text-slate-400">
                    График активности (в разработке)
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-80 flex items-center justify-center text-slate-400">
                    Последние регистрации (в разработке)
                </div>
            </div>
        </div>
    );
};

// Helper inside file for simplicity since cn is used
import { cn } from '../../../utils/cn';
