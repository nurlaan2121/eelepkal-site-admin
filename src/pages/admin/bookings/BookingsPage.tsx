import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Search, Filter, Clock, User, Phone, Check, X, MoreHorizontal } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { motion } from 'framer-motion';

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

    const bookings: LocalBooking[] = [
        { id: 1, customerName: 'Азамат И.', customerPhone: '+996 700 11 22 33', tableNumber: '5', guestsCount: 4, bookingTime: '19:00', status: 'CONFIRMED' },
        { id: 2, customerName: 'Светлана К.', customerPhone: '+996 555 44 55 66', tableNumber: '2', guestsCount: 2, bookingTime: '18:30', status: 'PENDING' },
        { id: 3, customerName: 'Искандер М.', customerPhone: '+996 777 88 99 00', tableNumber: 'VIP1', guestsCount: 6, bookingTime: '20:00', status: 'CANCELLED' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-display">Бронирования</h1>
                    <p className="text-gray-500">Управление резервами столов на сегодня и ближайшие дни</p>
                </div>
                <Button className="gap-2">
                    <Calendar size={18} />
                    Новая бронь
                </Button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        {['Сегодня', 'Завтра', 'Неделя'].map((tab) => (
                            <button
                                key={tab}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${tab === 'Сегодня' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <Input
                            placeholder="Поиск по имени или телефону..."
                            className="pl-10 h-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
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
                        <tbody className="divide-y divide-gray-50">
                            {bookings.map((booking) => (
                                <motion.tr
                                    key={booking.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="hover:bg-slate-50/50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">{booking.customerName}</p>
                                            <p className="text-xs text-gray-400">{booking.customerPhone}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                                            №{booking.tableNumber}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
                                            <Clock size={14} className="text-gray-400" />
                                            {booking.bookingTime}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {booking.guestsCount} чел.
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight border ${booking.status === 'CONFIRMED'
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                : booking.status === 'PENDING'
                                                    ? 'bg-amber-50 text-amber-700 border-amber-100'
                                                    : 'bg-red-50 text-red-700 border-red-100'
                                            }`}>
                                            {booking.status === 'CONFIRMED' ? 'Подтвержден' : booking.status === 'PENDING' ? 'Ожидание' : 'Отменен'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {booking.status === 'PENDING' && (
                                                <>
                                                    <button className="p-1.5 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors">
                                                        <Check size={14} />
                                                    </button>
                                                    <button className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                                                        <X size={14} />
                                                    </button>
                                                </>
                                            )}
                                            <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
