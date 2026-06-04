import React from 'react';
import { Calendar, Search, Filter, Clock, User, Phone, Building, Info } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

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
            <div className="px-1 md:px-0">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Все бронирования</h1>
                <p className="text-gray-500 text-sm md:text-base">Глобальный список резервов во всех заведениях системы</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50/30">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                            placeholder="Поиск по клиенту или заведению..."
                            className="pl-10 h-11 bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex w-full md:w-auto gap-2">
                        <Button variant="outline" className="flex-1 md:flex-none gap-2 h-11 rounded-xl font-bold text-xs uppercase tracking-wider">
                            <Filter size={16} />
                            Фильтры
                        </Button>
                        <Button variant="outline" className="flex-1 md:flex-none gap-2 h-11 rounded-xl font-bold text-xs uppercase tracking-wider">
                            <Calendar size={16} />
                            Сегодня
                        </Button>
                    </div>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-gray-100">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="p-4 active:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 font-bold text-sm">
                                        {booking.customerName.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{booking.customerName}</h3>
                                        <p className="text-[11px] text-gray-400 font-bold">{booking.customerPhone}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${booking.status === 'CONFIRMED' ? 'bg-brand-100 text-brand-700' :
                                    booking.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {booking.status === 'CONFIRMED' ? 'ОК' : booking.status === 'PENDING' ? 'Ждет' : 'Отмена'}
                                </span>
                            </div>

                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 grid grid-cols-2 gap-4 mb-3">
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Заведение</p>
                                    <p className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                                        <Building size={12} className="text-brand-500" />
                                        {booking.venueName}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Гости</p>
                                    <p className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                                        <User size={12} className="text-brand-500" />
                                        {booking.guestsCount} чел.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-[11px]">
                                <div className="flex items-center gap-3 font-bold text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <Calendar size={12} className="text-brand-500" />
                                        {new Date(booking.bookingDate).toLocaleDateString('ru-RU')}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock size={12} className="text-brand-500" />
                                        {booking.bookingTime}
                                    </div>
                                </div>
                                <button className="p-2 text-slate-400">
                                    <Info size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left font-medium">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider font-bold">
                                <th className="px-6 py-4">Клиент</th>
                                <th className="px-6 py-4">Заведение</th>
                                <th className="px-6 py-4">Дата и Время</th>
                                <th className="px-6 py-4">Гости</th>
                                <th className="px-6 py-4">Статус</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-medium">
                            {bookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 text-xs font-bold group-hover:scale-110 transition-transform">
                                                {booking.customerName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{booking.customerName}</p>
                                                <p className="text-[11px] text-gray-400">{booking.customerPhone}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-700 font-bold">
                                            <Building size={16} className="text-gray-400 group-hover:text-brand-500 transition-colors" />
                                            {booking.venueName}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-0.5">
                                            <div className="flex items-center gap-1.5 text-sm text-gray-900 font-bold">
                                                <Calendar size={14} className="text-brand-500" />
                                                {new Date(booking.bookingDate).toLocaleDateString('ru-RU')}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold">
                                                <Clock size={14} />
                                                {booking.bookingTime}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-700">
                                        <div className="flex items-center gap-1.5">
                                            <User size={16} className="text-brand-500" />
                                            {booking.guestsCount}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight border ${booking.status === 'CONFIRMED'
                                            ? 'bg-brand-50 text-brand-700 border-brand-100'
                                            : booking.status === 'PENDING'
                                                ? 'bg-amber-50 text-amber-700 border-amber-100'
                                                : 'bg-red-50 text-red-700 border-red-100'
                                            }`}>
                                            {booking.status === 'CONFIRMED' ? 'Подтверждено' : booking.status === 'PENDING' ? 'Ожидает' : 'Отменено'}
                                        </span>
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
