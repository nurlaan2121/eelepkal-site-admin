import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Search, Filter, Clock, User, Phone, Check, X, MoreHorizontal, MoreVertical, Hash } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';

interface LocalBooking {
    id: number;
    customerName: string;
    customerPhone: string;
    tableNumber: string | number;
    guestsCount: number;
    bookingTime: string;
    status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
}

export const AdminBookingsPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [activeTab, setActiveTab] = React.useState('Сегодня');

    const bookings: LocalBooking[] = [
        { id: 1, customerName: 'Азамат И.', customerPhone: '+996 700 11 22 33', tableNumber: '5', guestsCount: 4, bookingTime: '19:00', status: 'CONFIRMED' },
        { id: 2, customerName: 'Светлана К.', customerPhone: '+996 555 44 55 66', tableNumber: '2', guestsCount: 2, bookingTime: '18:30', status: 'PENDING' },
        { id: 3, customerName: 'Искандер М.', customerPhone: '+996 777 88 99 00', tableNumber: 'VIP1', guestsCount: 6, bookingTime: '20:00', status: 'CANCELLED' },
    ];

    return (
        <div className="space-y-6 pb-20 md:pb-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1 md:px-0">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Бронирования</h1>
                    <p className="text-gray-500 text-sm md:text-base">Управление резервами на сегодня</p>
                </div>
                <Button className="flex items-center justify-center gap-2 h-12 md:h-11 px-6 w-full md:w-auto shadow-lg shadow-emerald-100">
                    <Calendar size={20} />
                    <span>Новая бронь</span>
                </Button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50/30">
                    <div className="flex bg-white p-1 rounded-xl border border-gray-100 w-full md:w-auto overflow-x-auto no-scrollbar">
                        {['Сегодня', 'Завтра', 'Неделя'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === tab ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <Input
                            placeholder="Поиск клиента..."
                            className="pl-10 h-11 bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Mobile View */}
                <div className="md:hidden divide-y divide-gray-100">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="p-4 active:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg leading-tight">{booking.customerName}</h3>
                                    <p className="text-xs text-gray-400 font-bold tracking-wide uppercase mt-0.5">{booking.customerPhone}</p>
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${booking.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' :
                                        booking.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {booking.status === 'CONFIRMED' ? 'ОК' : booking.status === 'PENDING' ? 'WAIT' : 'CANCEL'}
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-3 mb-4">
                                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col items-center">
                                    <Hash size={14} className="text-emerald-500 mb-1" />
                                    <p className="text-[10px] text-gray-400 uppercase font-bold">Стол</p>
                                    <p className="text-sm font-black text-gray-800">№{booking.tableNumber}</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col items-center">
                                    <Clock size={14} className="text-emerald-500 mb-1" />
                                    <p className="text-[10px] text-gray-400 uppercase font-bold">Время</p>
                                    <p className="text-sm font-black text-gray-800">{booking.bookingTime}</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col items-center">
                                    <User size={14} className="text-emerald-500 mb-1" />
                                    <p className="text-[10px] text-gray-400 uppercase font-bold">Гости</p>
                                    <p className="text-sm font-black text-gray-800">{booking.guestsCount}</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                {booking.status === 'PENDING' ? (
                                    <>
                                        <button className="flex-1 py-3 bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-emerald-100">
                                            <Check size={16} />
                                            Принять
                                        </button>
                                        <button className="w-14 items-center justify-center flex py-3 bg-red-50 text-red-500 rounded-2xl active:scale-95 transition-transform">
                                            <X size={20} />
                                        </button>
                                    </>
                                ) : (
                                    <button className="flex-1 py-3 bg-slate-50 text-slate-700 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 active:bg-slate-100 transition-colors">
                                        Подробнее
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto text-sm">
                    <table className="w-full text-left font-medium">
                        <thead>
                            <tr className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-wider font-bold">
                                <th className="px-6 py-4">Клиент</th>
                                <th className="px-6 py-4">Стол</th>
                                <th className="px-6 py-4">Время</th>
                                <th className="px-6 py-4">Гости</th>
                                <th className="px-6 py-4">Статус</th>
                                <th className="px-6 py-4 text-right">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 font-bold">
                            {bookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{booking.customerName}</p>
                                            <p className="text-xs text-gray-400">{booking.customerPhone}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-100">
                                            №{booking.tableNumber}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-900">
                                            <Clock size={16} className="text-emerald-500" />
                                            {booking.bookingTime}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700 flex items-center gap-1.5 pt-6">
                                        <User size={16} className="text-emerald-500" />
                                        {booking.guestsCount} чел.
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${booking.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                booking.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-red-50 text-red-700 border-red-100'
                                            }`}>
                                            {booking.status === 'CONFIRMED' ? 'Подтвержден' : booking.status === 'PENDING' ? 'Ожидание' : 'Отменен'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {booking.status === 'PENDING' && (
                                                <>
                                                    <button className="p-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 shadow-md">
                                                        <Check size={16} />
                                                    </button>
                                                    <button className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                                                        <X size={16} />
                                                    </button>
                                                </>
                                            )}
                                            <button className="p-2 text-gray-400 hover:text-gray-900">
                                                <MoreVertical size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
