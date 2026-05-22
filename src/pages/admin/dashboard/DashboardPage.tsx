import React from 'react';
import { LayoutGrid, Calendar, Wallet, Star, ArrowUpRight, MessageSquare, Clock, Users } from 'lucide-react';
import { AnalyticsCard } from '../../../components/ui/AnalyticsCard';
import { Button } from '../../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminDashboard: React.FC = () => {
    return (
        <div className="space-y-6 md:space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-3 px-1 md:px-0">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Дашборд</h1>
                    <p className="text-gray-500 text-sm md:text-base font-medium">Сводка на {new Date().toLocaleDateString('ru-RU')}</p>
                </div>
                <div className="flex items-center gap-2 self-start md:self-auto">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-200 shadow-sm shadow-emerald-50">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Открыто
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 px-1 md:px-0">
                <AnalyticsCard
                    title="Брони"
                    value="24"
                    change="+5"
                    isPositive={true}
                    icon={Calendar}
                    color="emerald"
                />
                <AnalyticsCard
                    title="Столы"
                    value="8 / 15"
                    icon={LayoutGrid}
                    color="blue"
                />
                <AnalyticsCard
                    title="Выручка"
                    value="12.4k"
                    change="15%"
                    isPositive={true}
                    icon={Wallet}
                    color="amber"
                />
                <AnalyticsCard
                    title="Ср. чек"
                    value="1.2k"
                    icon={Star}
                    color="purple"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upcoming Bookings */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
                        <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">Ближайшие брони</h3>
                        <button className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700">Весь график</button>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {[
                            { time: '18:30', name: 'Айбек Ж.', guests: 4, table: 'Стол 5' },
                            { time: '19:00', name: 'Елена К.', guests: 2, table: 'Стол 2' },
                            { time: '19:30', name: 'Марат С.', guests: 6, table: 'Кабинка 1' },
                            { time: '20:00', name: 'Данияр Т.', guests: 3, table: 'Стол 8' },
                            { time: '20:30', name: 'Нурбек М.', guests: 5, table: 'Стол 12' },
                        ].map((booking, i) => (
                            <div key={i} className="p-5 hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-50 flex flex-col items-center justify-center shadow-sm">
                                        <Clock size={12} className="text-emerald-500 mb-0.5" />
                                        <span className="text-sm font-black text-gray-900">{booking.time}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-gray-900">{booking.name}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                                <Users size={10} /> {booking.guests} чел.
                                            </span>
                                            <span className="text-[10px] font-bold text-emerald-600 uppercase bg-emerald-50 px-1.5 py-0.5 rounded-md">
                                                {booking.table}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <ArrowUpRight className="text-slate-300 group-hover:text-emerald-500" size={20} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Review */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
                    <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">Свежие отзывы</h3>
                    <div className="space-y-8">
                        {[1, 2].map((i) => (
                            <div key={i} className="space-y-3 relative pl-4 border-l-2 border-slate-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-0.5">
                                        {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} className="fill-amber-400 text-amber-400" />)}
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Вчера</span>
                                </div>
                                <p className="text-xs text-gray-600 leading-relaxed font-medium italic">"Прекрасное обслуживание и вкусная еда. Очень уютная атмосфера!"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-[10px] flex items-center justify-center font-black text-white shadow-lg shadow-emerald-100">AK</div>
                                    <span className="text-[11px] font-black text-gray-700 uppercase tracking-tight">Айсулуу К.</span>
                                </div>
                            </div>
                        ))}

                        <Button variant="outline" className="w-full h-14 rounded-2xl gap-2 font-black text-[10px] uppercase tracking-widest border-2">
                            <MessageSquare size={16} />
                            Все отзывы
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
