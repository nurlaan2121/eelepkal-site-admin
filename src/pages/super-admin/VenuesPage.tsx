import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Trash2, Edit2, Store } from 'lucide-react';
import { superAdminVenueService } from '../../api/venue/superAdminVenueService';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { motion } from 'framer-motion';
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
                    <h1 className="text-2xl font-bold text-gray-900">Управление заведениями</h1>
                    <p className="text-gray-500">Просмотр, создание и редактирование всех ресторанов в системе</p>
                </div>
                <Button
                    onClick={() => navigate('/super-admin/venues/create')}
                    className="flex items-center gap-2"
                >
                    <Plus size={18} />
                    Добавить заведение
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                            placeholder="Поиск по названию или адресу..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <select className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                            <option>Все статусы</option>
                            <option>Активные</option>
                            <option>Неактивные</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-medium">Заведение</th>
                                <th className="px-6 py-4 font-medium">Адрес</th>
                                <th className="px-6 py-4 font-medium">Статус</th>
                                <th className="px-6 py-4 font-medium">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-48" /></td>
                                        <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-16" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20" /></td>
                                    </tr>
                                ))
                            ) : filteredVenues?.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        Заведения не найдены
                                    </td>
                                </tr>
                            ) : (
                                filteredVenues?.map((venue) => (
                                    <motion.tr
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        key={venue.id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                                                    <Store size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{venue.name}</p>
                                                    <p className="text-xs text-gray-500 line-clamp-1">{venue.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {venue.address}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${venue.venueStatus === 'ACTIVE'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {venue.venueStatus === 'ACTIVE' ? 'Активен' : 'Неактивен'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button className="p-2 text-gray-400 hover:text-emerald-600 transition-colors">
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Вы уверены, что хотите удалить это заведение?')) {
                                                            deleteMutation.mutate(venue.id);
                                                        }
                                                    }}
                                                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
