import React from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { Plus, Search, Trash2, Edit2, Store, MapPin, MoreVertical, User } from 'lucide-react';
import { superAdminVenueService } from '../../api/venue/superAdminVenueService';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const SuperAdminVenuesPage: React.FC = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { ref, inView } = useInView();
    const [searchTerm, setSearchTerm] = React.useState('');

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading
    } = useInfiniteQuery({
        queryKey: ['super-admin-venues'],
        queryFn: ({ pageParam = 0 }) => superAdminVenueService.getAllVenues(pageParam, 10),
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === 10 ? allPages.length * 10 : undefined;
        },
        initialPageParam: 0,
    });

    const venues = data?.pages.flatMap((page) => page || []) || [];

    React.useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);

    const deleteMutation = useMutation({
        mutationFn: (id: number) => superAdminVenueService.deleteVenue(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['super-admin-venues'] });
        },
    });

    const filteredVenues = venues.filter((v) =>
        (v.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (v.address?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Управление заведениями</h1>
                    <p className="text-gray-500 text-sm md:text-base">Просмотр, создание и редактирование всех ресторанов в системе</p>
                </div>
                <Button
                    onClick={() => navigate('/super-admin/venues/create')}
                    className="flex items-center justify-center gap-2 h-12 md:h-11 px-6 w-full md:w-auto shadow-lg shadow-brand-100"
                >
                    <Plus size={20} />
                    <span>Добавить заведение</span>
                </Button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50/30">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                            placeholder="Поиск..."
                            className="pl-10 h-11 bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex w-full md:w-auto gap-2">
                        <select className="flex-1 md:flex-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all appearance-none">
                            <option>Все статусы</option>
                            <option>Активные</option>
                            <option>Неактивные</option>
                        </select>
                    </div>
                </div>

                {/* Mobile View (Cards) */}
                <div className="md:hidden divide-y divide-gray-100">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="p-4 animate-pulse space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                                        <div className="h-3 bg-gray-100 rounded w-3/4" />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : filteredVenues?.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">Заведения не найдены</div>
                    ) : (
                        filteredVenues?.map((venue) => (
                            <div key={venue.venueId} className="p-4 active:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-brand-50 border border-brand-100 flex-shrink-0">
                                            {venue.firstImageUrl ? (
                                                <img src={venue.firstImageUrl} alt={venue.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-brand-600">
                                                    <Store size={24} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-black text-slate-900 truncate">{venue.name}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="flex items-center gap-1 text-[10px] font-black text-amber-500 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                                                    ★ {venue.rating}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400">
                                                    {venue.averageCheck} сом
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="p-2 text-slate-400 active:bg-slate-100 rounded-xl transition-colors">
                                        <MoreVertical size={20} />
                                    </button>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-500 mb-4 bg-slate-50/50 p-2 rounded-xl border border-slate-100/50">
                                    <MapPin size={14} className="flex-shrink-0 text-brand-500" />
                                    <span className="line-clamp-1 font-medium">{venue.address}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-400 mb-4 px-1">
                                    <User size={12} className="text-slate-300" />
                                    <span>Админ: <span className="text-slate-600 font-bold">{venue.adminFullName}</span></span>
                                </div>
                                <div className="flex gap-2">
                                    <button className="flex-1 h-11 bg-white border-2 border-slate-100 text-slate-700 rounded-2xl text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all">
                                        <Edit2 size={16} />
                                        Изменить
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (confirm('Удалить заведение?')) deleteMutation.mutate(venue.venueId);
                                        }}
                                        className="w-12 h-11 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center active:scale-95 border border-red-100 transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Desktop View (Table) */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-bold">
                                <th className="px-6 py-4">Заведение</th>
                                <th className="px-6 py-4">Адрес</th>
                                <th className="px-6 py-4">Статус</th>
                                <th className="px-6 py-4 text-right">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-medium">
                            {filteredVenues.map((venue) => (
                                <tr key={venue.venueId} className="hover:bg-slate-50/50 transition-colors group border-b border-slate-100 last:border-0 font-medium">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-brand-50 flex items-center justify-center text-brand-600 border border-brand-100 group-hover:scale-105 transition-transform shadow-sm">
                                                {venue.firstImageUrl ? (
                                                    <img src={venue.firstImageUrl} alt={venue.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Store size={22} />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-slate-900 font-black">{venue.name}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] font-black text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                                                        ★ {venue.rating}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-slate-400">
                                                        {venue.averageCheck} сом
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <MapPin size={14} className="text-brand-500" />
                                                <span className="font-bold">{venue.address}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                                                <User size={16} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Админ</p>
                                                <p className="text-sm text-slate-800 font-black">{venue.adminFullName}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="w-10 h-10 flex items-center justify-center bg-white border-2 border-slate-100 text-slate-400 hover:text-brand-600 hover:border-brand-200 transition-all rounded-xl active:scale-90">
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (confirm('Вы уверены?')) deleteMutation.mutate(venue.venueId);
                                                }}
                                                className="w-10 h-10 flex items-center justify-center bg-white border-2 border-slate-100 text-slate-400 hover:text-red-600 hover:border-red-200 transition-all rounded-xl active:scale-90"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Load more sentinel */}
            <div ref={ref} className="py-8 flex justify-center">
                {isFetchingNextPage && (
                    <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-xs">
                        <div className="w-5 h-5 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
                        Загрузка...
                    </div>
                )}
                {!hasNextPage && venues.length > 0 && (
                    <p className="text-slate-300 text-xs font-bold uppercase tracking-widest">Это все заведения</p>
                )}
            </div>
        </div>
    );
};
