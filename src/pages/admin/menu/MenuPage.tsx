import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, Filter, MoreVertical, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { motion } from 'framer-motion';

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
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-display">Меню заведения</h1>
                    <p className="text-gray-500">Управление блюдами, ценами и категориями вашего меню</p>
                </div>
                <Button className="gap-2 shadow-emerald-200/50 shadow-lg">
                    <Plus size={18} />
                    Добавить блюдо
                </Button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50/30">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                            placeholder="Поиск блюда..."
                            className="pl-10 h-11"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex overflow-x-auto gap-2 pb-2 md:pb-0 scrollbar-hide">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${activeCategory === cat
                                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-100'
                                        : 'bg-white border-gray-200 text-gray-500 hover:border-emerald-600 hover:text-emerald-600'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-wider font-bold">
                                <th className="px-6 py-4">Блюдо</th>
                                <th className="px-6 py-4">Категория</th>
                                <th className="px-6 py-4">Цена</th>
                                <th className="px-6 py-4">Статус</th>
                                <th className="px-6 py-4">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredItems.map((item) => (
                                <motion.tr
                                    key={item.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="hover:bg-slate-50/50 transition-colors group"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 overflow-hidden">
                                                {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <Plus size={20} />}
                                            </div>
                                            <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-gray-900">{item.price} {item.currency}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${item.isAvailable ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                            <span className={`text-xs font-medium ${item.isAvailable ? 'text-emerald-700' : 'text-red-700'}`}>
                                                {item.isAvailable ? 'В наличии' : 'Стоп-лист'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-gray-400 hover:text-emerald-600 transition-colors">
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                                                {item.isAvailable ? <Eye size={16} /> : <EyeOff size={16} />}
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                                                <Trash2 size={16} />
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
