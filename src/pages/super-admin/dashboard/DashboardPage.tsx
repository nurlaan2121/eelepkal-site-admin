import React from 'react';
import { Users, Store, Calendar, TrendingUp, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AnalyticsCard } from '../../../components/ui/AnalyticsCard';
import { motion, AnimatePresence } from 'framer-motion';

export const SuperAdminDashboard: React.FC = () => {
    return (
        <div className="space-y-6 md:space-y-8 pb-10">
            <div className="px-1 md:px-0">
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Панель управления</h1>
                <p className="text-gray-500 text-sm md:text-base font-medium">Глобальный мониторинг системы «Ээлеп кал»</p>
            </div>

            {/* Stats Grid - Optimized for 2 columns on mobile */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 px-1 md:px-0">
                <AnalyticsCard
                    title="Заведения"
                    value="124"
                    change="12%"
                    isPositive={true}
                    icon={Store}
                    color="brand"
                />
                <AnalyticsCard
                    title="Брони"
                    value="1,452"
                    change="8%"
                    isPositive={true}
                    icon={Calendar}
                    color="blue"
                />
                <AnalyticsCard
                    title="Юзеры"
                    value="8.4k"
                    change="24%"
                    isPositive={true}
                    icon={Users}
                    color="purple"
                />
                <AnalyticsCard
                    title="Выручка"
                    value="450k"
                    change="5%"
                    isPositive={false}
                    icon={TrendingUp}
                    color="amber"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
                        <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">Новые регистрации</h3>
                        <button className="text-[10px] font-black uppercase tracking-widest text-brand-600 hover:text-brand-700">Все</button>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="p-5 hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 font-black uppercase text-sm">
                                        R{i}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-gray-900">Ресторан «Ала-Тоо {i}»</p>
                                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tight">Бишкек • {i * 10} мин назад</p>
                                    </div>
                                </div>
                                <ArrowUpRight className="text-brand-500" size={20} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Notifications/Alerts */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
                    <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">Внимание</h3>
                    <div className="space-y-4">
                        <motion.div
                            whileTap={{ scale: 0.98 }}
                            className="flex gap-4 p-4 rounded-2xl bg-amber-50 border-2 border-amber-100/50"
                        >
                            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                                <AlertCircle size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-black text-amber-900 uppercase tracking-tight">Ошибки оплаты</p>
                                <p className="text-xs text-amber-700 mt-0.5 leading-relaxed font-medium">3 транзакции требуют ручного подтверждения</p>
                            </div>
                        </motion.div>

                        <motion.div
                            whileTap={{ scale: 0.98 }}
                            className="flex gap-4 p-4 rounded-2xl bg-brand-50 border-2 border-brand-100/50"
                        >
                            <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-brand-600 shrink-0">
                                <Users size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-black text-brand-900 uppercase tracking-tight">Новые отзывы</p>
                                <p className="text-xs text-brand-700 mt-0.5 leading-relaxed font-medium">Получено 15 новых отзывов за последние 24ч</p>
                            </div>
                        </motion.div>
                    </div>

                    <button className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-transform shadow-xl shadow-slate-200">
                        Открыть центр поддержки
                    </button>
                </div>
            </div>
        </div>
    );
};
