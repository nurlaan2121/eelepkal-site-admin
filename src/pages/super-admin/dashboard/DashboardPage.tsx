import React from 'react';
import { Users, Store, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { AnalyticsCard } from '../../../components/ui/AnalyticsCard';
import { motion } from 'framer-motion';

export const SuperAdminDashboard: React.FC = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 font-display">Панель управления</h1>
                <p className="text-gray-500">Добро пожаловать в глобальную систему «Ээлеп кал»</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnalyticsCard
                    title="Всего заведений"
                    value="124"
                    change="12%"
                    isPositive={true}
                    icon={Store}
                    color="emerald"
                />
                <AnalyticsCard
                    title="Всего бронирований"
                    value="1,452"
                    change="8%"
                    isPositive={true}
                    icon={Calendar}
                    color="blue"
                />
                <AnalyticsCard
                    title="Активные пользователи"
                    value="8.4k"
                    change="24%"
                    isPositive={true}
                    icon={Users}
                    color="purple"
                />
                <AnalyticsCard
                    title="Глобальная выручка"
                    value="450k сом"
                    change="5%"
                    isPositive={false}
                    icon={TrendingUp}
                    color="amber"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Последние регистрации заведений</h3>
                        <button className="text-sm text-emerald-600 hover:underline font-medium">Смотреть все</button>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold uppercase text-xs">
                                        R{i}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Ресторан «Ала-Тоо {i}»</p>
                                        <p className="text-xs text-gray-500">Бишкек, пр. Чуй {i * 10}</p>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400">2 часа назад</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Notifications/Alerts */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Важные уведомления</h3>
                    <div className="space-y-4">
                        <div className="flex gap-3 p-3 rounded-lg bg-amber-50 border border-amber-100">
                            <AlertCircle className="text-amber-600 shrink-0" size={20} />
                            <div>
                                <p className="text-sm font-medium text-amber-900">Ошибка оплаты</p>
                                <p className="text-xs text-amber-700">3 транзакции требуют ручного подтверждения</p>
                            </div>
                        </div>
                        <div className="flex gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                            <AlertCircle className="text-emerald-600 shrink-0" size={20} />
                            <div>
                                <p className="text-sm font-medium text-emerald-900">Новые отзывы</p>
                                <p className="text-xs text-emerald-700">Получено 15 новых отзывов за последние 24ч</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
