import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Trash2, Edit2, Store, MapPin, MoreVertical } from 'lucide-react';
import { superAdminVenueService } from '../../api/venue/superAdminVenueService';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const SuperAdminVenuesPage: React.FC = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = React.useState('');

    const { data: venues, isLoading } = useQuery({
        queryKey: ['super-admin-venues'],
        queryFn: () => superAdminVenueService.getAllVenues(),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => superAdminVenueService.deleteVenue(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['super-admin-venues'] });
        },
    });

    const filteredVenues = venues?.filter((v) =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.address.toLowerCase().includes(searchTerm.toLowerCase())
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
                            <div key={venue.id} className="p-4 active:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 border border-brand-100">
                                            <Store size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{venue.name}</h3>
                                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${venue.venueStatus === 'ACTIVE' ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {venue.venueStatus === 'ACTIVE' ? 'Активен' : 'Неактивен'}
                                            </span>
                                        </div>
                                    </div>
                                    <button className="p-2 text-gray-400">
                                        <MoreVertical size={20} />
                                    </button>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                    <MapPin size={14} className="flex-shrink-0" />
                                    <span className="line-clamp-1">{venue.address}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button className="flex-1 py-2.5 bg-slate-50 text-slate-700 rounded-xl text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform">
                                        <Edit2 size={16} />
                                        Изменить
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (confirm('Удалить заведение?')) deleteMutation.mutate(venue.id);
                                        }}
                                        className="w-12 h-11 bg-red-50 text-red-500 rounded-xl flex items-center justify-center active:scale-95 transition-transform"
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
                            {filteredVenues?.map((venue) => (
                                <tr key={venue.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 border border-brand-100 group-hover:scale-110 transition-transform">
                                                <Store size={20} />
                                            </div>
                                            <div>
                                                <p className="text-gray-900 font-bold">{venue.name}</p>
                                                <p className="text-xs text-gray-400 line-clamp-1">{venue.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {venue.address}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${venue.venueStatus === 'ACTIVE'
                                            ? 'bg-brand-100 text-brand-700'
                                            : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {venue.venueStatus === 'ACTIVE' ? 'Активен' : 'Неактивен'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button className="p-2 text-gray-400 hover:text-brand-600 transition-colors">
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (confirm('Вы уверены?')) deleteMutation.mutate(venue.id);
                                                }}
                                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
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
        </div>
    );
};
