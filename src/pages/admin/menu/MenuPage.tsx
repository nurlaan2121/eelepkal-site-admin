import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, Filter, MoreVertical, Edit2, Trash2, Eye, EyeOff, Utensils } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuItem {
    id: number;
    name: string;
    category: string;
    price: number;
    currency: string;
    isAvailable: boolean;
    image?: string;
}

export const AdminMenuPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [activeCategory, setActiveCategory] = React.useState('Все');

    const menuItems: MenuItem[] = [
        { id: 1, name: 'Стейк Рибай', category: 'Горячее', price: 1200, currency: 'сом', isAvailable: true },
        { id: 2, name: 'Цезарь с курицей', category: 'Салаты', price: 450, currency: 'сом', isAvailable: true },
        { id: 3, name: 'Лимонад Классический', category: 'Напитки', price: 250, currency: 'сом', isAvailable: false },
        { id: 4, name: 'Паста Карбонара', category: 'Горячее', price: 550, currency: 'сом', isAvailable: true },
        { id: 5, name: 'Чизкейк Нью-Йорк', category: 'Десерты', price: 350, currency: 'сом', isAvailable: true },
    ];

    const categories = ['Все', 'Горячее', 'Салаты', 'Напитки', 'Десерты', 'Закуски'];

    const filteredItems = menuItems.filter(item =>
        (activeCategory === 'Все' || item.category === activeCategory) &&
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 pb-20 md:pb-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1 md:px-0">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Меню</h1>
                    <p className="text-gray-500 text-sm md:text-base">Управление блюдами и стоп-листами</p>
                </div>
                <Button className="flex items-center justify-center gap-2 h-12 md:h-11 px-6 w-full md:w-auto shadow-lg shadow-brand-100 font-bold uppercase tracking-widest text-xs">
                    <Plus size={20} />
                    <span>Добавить блюдо</span>
                </Button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 space-y-4 bg-gray-50/30">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                            placeholder="Поиск по меню..."
                            className="pl-10 h-11 bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 whitespace-nowrap ${activeCategory === cat
                                    ? 'bg-brand-primary border-brand-primary text-white shadow-lg'
                                    : 'bg-white border-gray-100 text-gray-500 hover:border-brand-200'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Mobile View */}
                <div className="md:hidden divide-y divide-gray-100">
                    {filteredItems.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 font-bold">Ничего не найдено</div>
                    ) : (
                        filteredItems.map((item) => (
                            <div key={item.id} className="p-4 active:bg-gray-50 transition-colors">
                                <div className="flex gap-4">
                                    <div className="w-20 h-20 rounded-2xl bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-300 border border-slate-100 overflow-hidden">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <Utensils size={32} />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                        <div>
                                            <div className="flex items-start justify-between">
                                                <h3 className="font-black text-gray-900 text-base line-clamp-1">{item.name}</h3>
                                                <button className="p-1 px-2 text-gray-400">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">
                                                    {item.category}
                                                </span>
                                                <span className={`w-1.5 h-1.5 rounded-full ${item.isAvailable ? 'bg-brand-500' : 'bg-red-500'}`} />
                                            </div>
                                        </div>
                                        <div className="flex items-end justify-between">
                                            <p className="text-lg font-black text-brand-primary">
                                                {item.price} <span className="text-[10px] uppercase">{item.currency}</span>
                                            </p>
                                            <div className="flex gap-1.5">
                                                <button className={`p-2 rounded-xl border ${item.isAvailable ? 'bg-white border-slate-200 text-slate-400' : 'bg-red-50 bg-red-100 border-red-500 text-red-500'}`}>
                                                    {item.isAvailable ? <Eye size={16} /> : <EyeOff size={16} />}
                                                </button>
                                                <button className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400">
                                                    <Edit2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left font-bold">
                        <thead>
                            <tr className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-wider font-black">
                                <th className="px-6 py-4">Блюдо</th>
                                <th className="px-6 py-4">Категория</th>
                                <th className="px-6 py-4">Цена</th>
                                <th className="px-6 py-4">Статус</th>
                                <th className="px-6 py-4 text-right">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredItems.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-300 overflow-hidden border border-slate-200 group-hover:scale-110 transition-transform">
                                                {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <Utensils size={18} />}
                                            </div>
                                            <p className="text-sm font-bold text-gray-900">{item.name}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-900">
                                        {item.price} <span className="text-[10px] uppercase text-gray-400">{item.currency}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${item.isAvailable ? 'bg-brand-500' : 'bg-red-500'}`} />
                                            <span className={`text-[10px] font-black uppercase tracking-tight ${item.isAvailable ? 'text-brand-700' : 'text-red-700'}`}>
                                                {item.isAvailable ? 'В наличии' : 'Стоп-лист'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-gray-400 hover:text-brand-600">
                                                <Edit2 size={18} />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-red-600">
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
