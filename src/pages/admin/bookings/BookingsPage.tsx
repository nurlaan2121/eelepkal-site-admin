import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, Search, Filter, Clock, User, Phone, Check, X, MoreHorizontal, MoreVertical, Hash, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';
import { adminBookingService, BookingResponse } from '../../../api/booking/adminBookingService';
import { toast } from 'sonner';

export const AdminBookingsPage: React.FC = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'ACTIVE' | 'HISTORY'>('ACTIVE');
    const [statusFilter, setStatusFilter] = useState<'WAITING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'NOT_PAID' | 'ALL'>('ALL');
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [selectedBooking, setSelectedBooking] = useState<BookingResponse | null>(null);

    // Fetch bookings with filters
    const { data: bookingsData, isLoading } = useQuery({
        queryKey: ['admin-bookings', activeTab, statusFilter, selectedDate, searchTerm],
        queryFn: () => adminBookingService.getAllBookings(
            {
                bookingKinds: activeTab,
                ...(statusFilter !== 'ALL' && { bookingStatus: statusFilter }),
                date: selectedDate,
                offset: 0,
                limit: 50,
            },
            {
                search: searchTerm,
            }
        ),
    });

    const bookings: BookingResponse[] = bookingsData || [];

    // Accept/Reject mutation
    const acceptRejectMutation = useMutation({
        mutationFn: ({ bookingId, accept }: { bookingId: number; accept: boolean }) => 
            adminBookingService.acceptOrReject(bookingId, accept),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
            toast.success('Бронирование обновлено');
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || error?.message || 'Ошибка обновления';
            toast.error(errorMessage);
        },
    });

    const handleAccept = (bookingId: number) => {
        acceptRejectMutation.mutate({ bookingId, accept: true });
    };

    const handleReject = (bookingId: number) => {
        acceptRejectMutation.mutate({ bookingId, accept: false });
    };

    // Format date for display
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Get status label and color
    const getStatusInfo = (status: string) => {
        const statusMap = {
            WAITING: { label: 'Ожидание', color: 'bg-amber-100 text-amber-700' },
            APPROVED: { label: 'Подтверждено', color: 'bg-brand-100 text-brand-700' },
            REJECTED: { label: 'Отклонено', color: 'bg-red-100 text-red-700' },
            COMPLETED: { label: 'Завершено', color: 'bg-blue-100 text-blue-700' },
            NOT_PAID: { label: 'Не оплачено', color: 'bg-orange-100 text-orange-700' },
        };
        return statusMap[status as keyof typeof statusMap] || { label: status, color: 'bg-gray-100 text-gray-700' };
    };

    return (
        <div className="space-y-6 pb-20 md:pb-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1 md:px-0">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Бронирования</h1>
                    <p className="text-gray-500 text-sm md:text-base">Управление резервами на сегодня</p>
                </div>
                <Button className="flex items-center justify-center gap-2 h-12 md:h-11 px-6 w-full md:w-auto shadow-lg shadow-brand-100">
                    <Calendar size={20} />
                    <span>Новая бронь</span>
                </Button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50/30">
                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
                        <button
                            onClick={() => setActiveTab('ACTIVE')}
                            className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all whitespace-nowrap ${
                                activeTab === 'ACTIVE'
                                    ? 'bg-slate-900 border-slate-900 text-white shadow-lg'
                                    : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
                            }`}
                        >
                            Активные
                        </button>
                        <button
                            onClick={() => setActiveTab('HISTORY')}
                            className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all whitespace-nowrap ${
                                activeTab === 'HISTORY'
                                    ? 'bg-slate-900 border-slate-900 text-white shadow-lg'
                                    : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
                            }`}
                        >
                            История
                        </button>
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

                {/* Status Filter */}
                {activeTab === 'ACTIVE' && (
                    <div className="p-3 border-b border-gray-100 flex gap-2 overflow-x-auto no-scrollbar bg-white">
                        {[
                            { key: 'ALL', label: 'Все' },
                            { key: 'WAITING', label: 'Ожидание' },
                            { key: 'APPROVED', label: 'Подтверждено' },
                            { key: 'NOT_PAID', label: 'Не оплачено' },
                        ].map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => setStatusFilter(key as any)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                                    statusFilter === key
                                        ? 'bg-brand-primary text-white shadow-md'
                                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Mobile View */}
                <div className="md:hidden divide-y divide-gray-100">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="p-4 animate-pulse">
                                <div className="h-6 bg-slate-200 rounded w-1/3 mb-2" />
                                <div className="h-4 bg-slate-200 rounded w-1/2 mb-4" />
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="h-16 bg-slate-200 rounded-2xl" />
                                    <div className="h-16 bg-slate-200 rounded-2xl" />
                                    <div className="h-16 bg-slate-200 rounded-2xl" />
                                </div>
                            </div>
                        ))
                    ) : bookings.length === 0 ? (
                        <div className="p-8 text-center">
                            <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
                            <p className="text-slate-500 font-bold">Нет бронирований</p>
                        </div>
                    ) : (
                        bookings.map((booking) => {
                            const statusInfo = getStatusInfo(booking.bookingStatus);
                            return (
                            <div key={booking.bookingId} className="p-4 active:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg leading-tight">{booking.clientFullName}</h3>
                                        <p className="text-xs text-gray-400 font-bold tracking-wide uppercase mt-0.5">
                                            {booking.typeClientResponse === 'NEW' ? '🆕 Новый клиент' : '⭐ Постоянный клиент'} • {booking.clientAge} лет
                                        </p>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusInfo.color}`}>
                                        {statusInfo.label}
                                    </span>
                                </div>

                                <div className="grid grid-cols-3 gap-3 mb-4">
                                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col items-center">
                                        <Hash size={14} className="text-brand-500 mb-1" />
                                        <p className="text-[10px] text-gray-400 uppercase font-bold">Стол</p>
                                        <p className="text-sm font-black text-gray-800">{booking.tableTitle || '-'}</p>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col items-center">
                                        <Clock size={14} className="text-brand-500 mb-1" />
                                        <p className="text-[10px] text-gray-400 uppercase font-bold">Время</p>
                                        <p className="text-sm font-black text-gray-800">{formatDate(booking.bookingFullVisitTime)}</p>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col items-center">
                                        <User size={14} className="text-brand-500 mb-1" />
                                        <p className="text-[10px] text-gray-400 uppercase font-bold">Гости</p>
                                        <p className="text-sm font-black text-gray-800">{booking.countOfGuests}</p>
                                    </div>
                                </div>

                                {booking.deposit && (
                                    <div className="mb-4 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                                        <p className="text-xs font-bold text-amber-900">💰 Депозит: {booking.deposit}</p>
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    {booking.bookingStatus === 'WAITING' ? (
                                        <>
                                            <button 
                                                onClick={() => handleAccept(booking.bookingId)}
                                                disabled={acceptRejectMutation.isPending}
                                                className="flex-1 py-3 bg-brand-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-brand-100 disabled:opacity-50"
                                            >
                                                {acceptRejectMutation.isPending ? (
                                                    <Loader2 size={16} className="animate-spin" />
                                                ) : (
                                                    <>
                                                        <Check size={16} />
                                                        Принять
                                                    </>
                                                )}
                                            </button>
                                            <button 
                                                onClick={() => handleReject(booking.bookingId)}
                                                disabled={acceptRejectMutation.isPending}
                                                className="w-14 items-center justify-center flex py-3 bg-red-50 text-red-500 rounded-2xl active:scale-95 transition-transform disabled:opacity-50"
                                            >
                                                <X size={20} />
                                            </button>
                                        </>
                                    ) : (
                                        <button 
                                            onClick={() => setSelectedBooking(booking)}
                                            className="flex-1 py-3 bg-slate-50 text-slate-700 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 active:bg-slate-100 transition-colors"
                                        >
                                            Подробнее
                                        </button>
                                    )}
                                </div>
                            </div>
                            );
                        })
                    )}
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
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-10 bg-slate-200 rounded" /></td>
                                        <td className="px-6 py-4"><div className="h-8 bg-slate-200 rounded w-20" /></td>
                                        <td className="px-6 py-4"><div className="h-6 bg-slate-200 rounded w-24" /></td>
                                        <td className="px-6 py-4"><div className="h-6 bg-slate-200 rounded w-16" /></td>
                                        <td className="px-6 py-4"><div className="h-6 bg-slate-200 rounded w-24" /></td>
                                        <td className="px-6 py-4"><div className="h-8 bg-slate-200 rounded w-20 ml-auto" /></td>
                                    </tr>
                                ))
                            ) : bookings.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center">
                                        <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
                                        <p className="text-slate-500 font-bold text-base">Нет бронирований</p>
                                    </td>
                                </tr>
                            ) : (
                                bookings.map((booking) => {
                                    const statusInfo = getStatusInfo(booking.bookingStatus);
                                    return (
                                    <tr key={booking.bookingId} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{booking.clientFullName}</p>
                                                <p className="text-xs text-gray-400">
                                                    {booking.typeClientResponse === 'NEW' ? '🆕 Новый' : '⭐ Постоянный'} • {booking.clientAge} лет
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-black text-brand-600 bg-brand-50 px-2.5 py-1.5 rounded-lg border border-brand-100">
                                                {booking.tableTitle || '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-900">
                                                <Clock size={16} className="text-brand-500" />
                                                {formatDate(booking.bookingFullVisitTime)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700 flex items-center gap-1.5 pt-6">
                                            <User size={16} className="text-brand-500" />
                                            {booking.countOfGuests} чел.
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${statusInfo.color}`}>
                                                {statusInfo.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {booking.bookingStatus === 'WAITING' && (
                                                    <>
                                                        <button 
                                                            onClick={() => handleAccept(booking.bookingId)}
                                                            disabled={acceptRejectMutation.isPending}
                                                            className="p-2 rounded-lg bg-brand-primary text-white hover:bg-brand-600 shadow-md disabled:opacity-50"
                                                        >
                                                            {acceptRejectMutation.isPending ? (
                                                                <Loader2 size={16} className="animate-spin" />
                                                            ) : (
                                                                <Check size={16} />
                                                            )}
                                                        </button>
                                                        <button 
                                                            onClick={() => handleReject(booking.bookingId)}
                                                            disabled={acceptRejectMutation.isPending}
                                                            className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </>
                                                )}
                                                <button 
                                                    onClick={() => setSelectedBooking(booking)}
                                                    className="p-2 text-gray-400 hover:text-gray-900"
                                                >
                                                    <MoreVertical size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
