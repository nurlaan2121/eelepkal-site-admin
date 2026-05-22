import React from 'react';
import { LayoutGrid, Calendar, Wallet, Star, ArrowUpRight, MessageSquare } from 'lucide-react';
import { AnalyticsCard } from '../../../components/ui/AnalyticsCard';
import { Button } from '../../../components/ui/Button';
import { motion } from 'framer-motion';

export const AdminDashboard: React.FC = () => {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Дашборд заведения</h1>
                    <p className="text-gray-500">Оперативная сводка на сегодня: {new Date().toLocaleDateString('ru-RU')}</p>
                </div>
                <div className="flex gap-2">
                    <span className="p-2 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold uppercase tracking-wider">Открыто</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnalyticsCard
                    title="Бронирований на сегодня"
                    value="24"
                    change="5 сегодня"
                    isPositive={true}
                    icon={Calendar}
                    color="emerald"
                />
                <AnalyticsCard
                    title="Занято столов"
                    value="8 / 15"
                    icon={LayoutGrid}
                    color="blue"
                />
                <AnalyticsCard
                    title="Выручка сегодня"
                    value="12,400 с"
                    change="15%"
                    isPositive={true}
                    icon={Wallet}
                    color="amber"
                />
                <AnalyticsCard
                    title="Средний чек"
                    value="1,200 с"
                    icon={Star}
                    color="purple"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upcoming Bookings */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Ближайшие бронирования</h3>
                        <button className="text-sm text-emerald-600 hover:underline font-medium">Весь график</button>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {[
                            { time: '18:30', name: 'Айбек Ж.', guests: 4, table: 'Стол 5' },
                            { time: '19:00', name: 'Елена К.', guests: 2, table: 'Стол 2' },
                            { time: '19:30', name: 'Марат С.', guests: 6, table: 'Кабинка 1' },
                            { time: '20:00', name: 'Данияр Т.', guests: 3, table: 'Стол 8' },
                            { time: '20:30', name: 'Нурбек М.', guests: 5, table: 'Стол 12' },
                        ].map((booking, i) => (
                            <div key={i} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-gray-50 flex flex-col items-center justify-center border border-gray-100">
                                        <span className="text-xs font-bold text-gray-900 leading-none">{booking.time}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{booking.name}</p>
                                        <p className="text-xs text-gray-500">{booking.guests} чел. • {booking.table}</p>
                                    </div>
                                </div>
                                <button className="p-2 text-gray-400 hover:text-emerald-600 transition-colors">
                                    <ArrowUpRight size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Review */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-semibold text-gray-900 mb-6 font-display">Последние отзывы</h3>
                    <div className="space-y-6">
                        {[1, 2].map((i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} className="fill-amber-400 text-amber-400" />)}
                                    </div>
                                    <span className="text-[10px] text-gray-400 uppercase font-bold">Вчера</span>
                                </div>
                                <p className="text-sm text-gray-700 italic">"Прекрасное обслуживание и вкусная еда. Очень уютная атмосфера!"</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-[10px] flex items-center justify-center font-bold text-emerald-700">AK</div>
                                    <span className="text-xs font-medium text-gray-500">Айсулуу К.</span>
                                </div>
                            </div>
                        ))}
                        <Button variant="outline" fullWidth className="gap-2">
                            <MessageSquare size={16} />
                            Все отзывы
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
