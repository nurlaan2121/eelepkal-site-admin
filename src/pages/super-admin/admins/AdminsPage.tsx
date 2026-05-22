import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserPlus, Search, Shield, Building, Mail, MoreVertical } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { motion } from 'framer-motion';

// Mock types for now - these should come from your API types
interface AdminUser {
    id: number;
    fullName: string;
    email: string;
    venueName: string;
    status: 'ACTIVE' | 'INACTIVE';
    lastLogin: string;
}

export const SuperAdminAdminsPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = React.useState('');

    // Example mock data
    const admins: AdminUser[] = [
        { id: 1, fullName: 'Данияр Ахметов', email: 'daniyar@venue.kg', venueName: 'Bellagio', status: 'ACTIVE', lastLogin: '10 мин назад' },
        { id: 2, fullName: 'Айзада Бекбоева', email: 'aizada@cafe.kg', venueName: 'Faiza', status: 'ACTIVE', lastLogin: '2 часа назад' },
        { id: 3, fullName: 'Нурбек Усенов', email: 'nurbek@lounge.kg', venueName: 'Sky Lounge', status: 'INACTIVE', lastLogin: '3 дня назад' },
    ];

    const filteredAdmins = admins.filter(a =>
        a.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.venueName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-display">Администраторы заведений</h1>
                    <p className="text-gray-500">Управление учетными записями администраторов ресторанов</p>
                </div>
                <Button className="flex items-center gap-2 shadow-emerald-200/50 shadow-lg">
                    <UserPlus size={18} />
                    Создать админа
                </Button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                            placeholder="Поиск по имени, email или заведению..."
                            className="pl-10 h-11"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                                <th className="px-6 py-4">Администратор</th>
                                <th className="px-6 py-4">Доступ к заведению</th>
                                <th className="px-6 py-4">Статус</th>
                                <th className="px-6 py-4">Последний вход</th>
                                <th className="px-6 py-4">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredAdmins.map((admin) => (
                                <motion.tr
                                    key={admin.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="hover:bg-slate-50/50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                                                <Shield size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">{admin.fullName}</p>
                                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                                    <Mail size={12} />
                                                    {admin.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                            <Building size={16} className="text-emerald-500" />
                                            {admin.venueName}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${admin.status === 'ACTIVE'
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                : 'bg-gray-50 text-gray-600 border-gray-100'
                                            }`}>
                                            {admin.status === 'ACTIVE' ? 'Активен' : 'Отключен'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-500 font-medium">
                                        {admin.lastLogin}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                            <MoreVertical size={18} />
                                        </button>
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
