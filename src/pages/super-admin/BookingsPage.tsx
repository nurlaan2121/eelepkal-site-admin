import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Search, Filter, Clock, User, Phone, Building } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { motion } from 'framer-motion';

interface GlobalBooking {
    id: number;
    customerName: string;
    customerPhone: string;
    venueName: string;
    guestsCount: number;
    bookingDate: string;
    bookingTime: string;
    status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
}

export const SuperAdminBookingsPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = React.useState('');

    const bookings: GlobalBooking[] = [
        { id: 1, customerName: 'Азамат И.', customerPhone: '+996 700 11 22 33', venueName: 'Bellagio', guestsCount: 4, bookingDate: '2026-05-23', bookingTime: '19:00', status: 'CONFIRMED' },
        { id: 2, customerName: 'Светлана К.', customerPhone: '+996 555 44 55 66', venueName: 'Faiza', guestsCount: 2, bookingDate: '2026-05-23', bookingTime: '18:30', status: 'PENDING' },
        { id: 3, customerName: 'Искандер М.', customerPhone: '+996 777 88 99 00', venueName: 'Sky Lounge', guestsCount: 6, bookingDate: '2026-05-23', bookingTime: '20:00', status: 'CANCELLED' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 font-display">Все бронирования</h1>
                <p className="text-gray-500">Глобальный список резервов во всех заведениях системы</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                            placeholder="Поиск по клиенту или заведению..."
                            className="pl-10 h-11"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="gap-2">
                            <Filter size={18} />
                            Фильтры
                        </Button>
                        <Button variant="outline" className="gap-2">
                            <Calendar size={18} />
                            За все время
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                                <th className="px-6 py-4">Клиент</th>
                                <th className="px-6 py-4">Заведение</th>
                                <th className="px-6 py-4">Дата и Время</th>
                                <th className="px-6 py-4">Гости</th>
                                <th className="px-6 py-4">Статус</th>
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
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 text-xs font-bold">
                                                {booking.customerName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">{booking.customerName}</p>
                                                <p className="text-xs text-gray-400">{booking.customerPhone}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Building size={16} className="text-gray-400" />
                                            {booking.venueName}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5 text-sm text-gray-900 font-medium">
                                                <Calendar size={14} className="text-emerald-500" />
                                                {new Date(booking.bookingDate).toLocaleDateString('ru-RU')}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                <Clock size={14} />
                                                {booking.bookingTime}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
                                            <User size={16} className="text-emerald-500" />
                                            {booking.guestsCount}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${booking.status === 'CONFIRMED'
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                : booking.status === 'PENDING'
                                                    ? 'bg-amber-50 text-amber-700 border-amber-100'
                                                    : 'bg-red-50 text-red-700 border-red-100'
                                            }`}>
                                            {booking.status === 'CONFIRMED' ? 'Подтверждено' : booking.status === 'PENDING' ? 'Ожидает' : 'Отменено'}
                                        </span>
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
