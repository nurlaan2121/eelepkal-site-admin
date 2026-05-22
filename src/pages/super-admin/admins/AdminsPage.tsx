import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserPlus, Search, Shield, Building, Mail, MoreVertical, Clock } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';

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
                <div className="px-1 md:px-0">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Администраторы</h1>
                    <p className="text-gray-500 text-sm md:text-base">Управление учетными записями менеджеров ресторанов</p>
                </div>
                <Button className="flex items-center justify-center gap-2 h-12 md:h-11 px-6 w-full md:w-auto shadow-lg shadow-emerald-100">
                    <UserPlus size={20} />
                    <span>Создать админа</span>
                </Button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50/30">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                            placeholder="Поиск администратора..."
                            className="pl-10 h-11 bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-gray-100">
                    {filteredAdmins.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">Администраторы не найдены</div>
                    ) : (
                        filteredAdmins.map((admin) => (
                            <div key={admin.id} className="p-4 active:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-100">
                                            <Shield size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{admin.fullName}</h3>
                                            <div className="flex items-center gap-1 text-[11px] text-gray-400 uppercase font-bold tracking-wider">
                                                <Mail size={10} />
                                                {admin.email}
                                            </div>
                                        </div>
                                    </div>
                                    <button className="p-2 text-gray-400">
                                        <MoreVertical size={20} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Заведение</p>
                                        <p className="text-xs font-bold text-gray-700 flex items-center gap-1">
                                            <Building size={12} className="text-emerald-500" />
                                            {admin.venueName}
                                        </p>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Статус</p>
                                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${admin.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {admin.status === 'ACTIVE' ? 'Активен' : 'Отключен'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                                        <Clock size={12} />
                                        Входил {admin.lastLogin}
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold active:bg-slate-50">
                                            Профиль
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto text-sm">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-bold">
                                <th className="px-6 py-4">Администратор</th>
                                <th className="px-6 py-4">Доступ к заведению</th>
                                <th className="px-6 py-4">Статус</th>
                                <th className="px-6 py-4">Последний вход</th>
                                <th className="px-6 py-4 text-right">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-medium">
                            {filteredAdmins.map((admin) => (
                                <tr key={admin.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-100 group-hover:scale-110 transition-transform">
                                                <Shield size={20} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{admin.fullName}</p>
                                                <p className="text-xs text-gray-400">{admin.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-700 font-bold">
                                            <Building size={16} className="text-emerald-500" />
                                            {admin.venueName}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${admin.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {admin.status === 'ACTIVE' ? 'Активен' : 'Отключен'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-500 font-bold">
                                        {admin.lastLogin}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-gray-400 hover:text-emerald-600 transition-colors">
                                            <MoreVertical size={18} />
                                        </button>
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
