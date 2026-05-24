import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminMenuService, CreateMenuRequest, MenuStatus, MenuCategorySimple, MenuUnit } from '../../../api/admin/adminMenuService';
import { Button } from '../../../components/ui/Button';

interface AddMenuModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultStatus?: MenuStatus;
}

export const AddMenuModal: React.FC<AddMenuModalProps> = ({ isOpen, onClose, defaultStatus = 'INACTIVE' }) => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState<CreateMenuRequest>({
        imageUrl: '',
        categoryId: 0,
        title: '',
        description: '',
        price: 0,
        meaning: '',
        unitAsEnumId: 0,
    });

    const [status, setStatus] = useState<MenuStatus>(defaultStatus);
    const [errors, setErrors] = useState<Partial<Record<keyof CreateMenuRequest, string>>>({});

    // Fetch categories
    const { data: categories } = useQuery({
        queryKey: ['menu-categories-simple'],
        queryFn: adminMenuService.getCategoriesSimple,
        enabled: isOpen,
    });

    // Fetch units
    const { data: units } = useQuery({
        queryKey: ['menu-units'],
        queryFn: adminMenuService.getUnits,
        enabled: isOpen,
    });

    // Create mutation
    const createMutation = useMutation({
        mutationFn: (data: CreateMenuRequest) => adminMenuService.createMenu(data, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['menu-items'] });
            queryClient.invalidateQueries({ queryKey: ['menu-categories'] });
            onClose();
            resetForm();
        },
    });

    const resetForm = () => {
        setFormData({
            imageUrl: '',
            categoryId: 0,
            title: '',
            description: '',
            price: 0,
            meaning: '',
            unitAsEnumId: 0,
        });
        setErrors({});
    };

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof CreateMenuRequest, string>> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Название обязательно';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Описание обязательно';
        }

        if (formData.price <= 0) {
            newErrors.price = 'Цена должна быть больше 0';
        }

        if (formData.categoryId === 0) {
            newErrors.categoryId = 'Выберите категорию';
        }

        if (formData.unitAsEnumId === 0) {
            newErrors.unitAsEnumId = 'Выберите единицу измерения';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            createMutation.mutate(formData);
        }
    };

    const handleChange = (field: keyof CreateMenuRequest, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">Добавить блюдо</h2>
                                <p className="text-sm text-slate-400 mt-0.5">Заполните информацию о новом блюде</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                            {/* Status Toggle */}
                            <div className="bg-slate-50 rounded-xl p-1">
                                <div className="grid grid-cols-2 gap-1">
                                    <button
                                        type="button"
                                        onClick={() => setStatus('ACTIVE')}
                                        className={`py-2.5 px-4 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                                            status === 'ACTIVE'
                                                ? 'bg-brand-primary text-white shadow-md'
                                                : 'bg-transparent text-slate-500 hover:bg-white'
                                        }`}
                                    >
                                        Активное
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStatus('INACTIVE')}
                                        className={`py-2.5 px-4 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                                            status === 'INACTIVE'
                                                ? 'bg-brand-primary text-white shadow-md'
                                                : 'bg-transparent text-slate-500 hover:bg-white'
                                        }`}
                                    >
                                        Резервное
                                    </button>
                                </div>
                            </div>

                            {/* Image URL */}
                            <div>
                                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                                    URL изображения
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formData.imageUrl}
                                        onChange={(e) => handleChange('imageUrl', e.target.value)}
                                        placeholder="https://example.com/image.jpg"
                                        className={`w-full px-4 py-3 rounded-xl border-2 bg-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                                            errors.imageUrl ? 'border-red-300' : 'border-slate-200 focus:border-brand-500'
                                        }`}
                                    />
                                    <ImageIcon size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300" />
                                </div>
                                {errors.imageUrl && (
                                    <p className="mt-1.5 text-xs font-bold text-red-500">{errors.imageUrl}</p>
                                )}
                                {formData.imageUrl && (
                                    <div className="mt-3 rounded-xl overflow-hidden bg-slate-100 h-32">
                                        <img 
                                            src={formData.imageUrl} 
                                            alt="Preview" 
                                            className="w-full h-full object-cover"
                                            onError={(e) => (e.currentTarget.style.display = 'none')}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                                    Название блюда *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                    placeholder="например, Цезарь"
                                    className={`w-full px-4 py-3 rounded-xl border-2 bg-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                                        errors.title ? 'border-red-300' : 'border-slate-200 focus:border-brand-500'
                                    }`}
                                />
                                {errors.title && (
                                    <p className="mt-1.5 text-xs font-bold text-red-500">{errors.title}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                                    Описание / Ингредиенты *
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    placeholder="куриное филе, помидор, микс зелени, сыр пармезан, соус цезарь"
                                    rows={3}
                                    className={`w-full px-4 py-3 rounded-xl border-2 bg-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none ${
                                        errors.description ? 'border-red-300' : 'border-slate-200 focus:border-brand-500'
                                    }`}
                                />
                                {errors.description && (
                                    <p className="mt-1.5 text-xs font-bold text-red-500">{errors.description}</p>
                                )}
                            </div>

                            {/* Price and Meaning */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                                        Цена (сом) *
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.price || ''}
                                        onChange={(e) => handleChange('price', parseInt(e.target.value) || 0)}
                                        placeholder="170"
                                        min="0"
                                        className={`w-full px-4 py-3 rounded-xl border-2 bg-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                                            errors.price ? 'border-red-300' : 'border-slate-200 focus:border-brand-500'
                                        }`}
                                    />
                                    {errors.price && (
                                        <p className="mt-1.5 text-xs font-bold text-red-500">{errors.price}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                                        Значение
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.meaning}
                                        onChange={(e) => handleChange('meaning', e.target.value)}
                                        placeholder="например, 250"
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                                    />
                                </div>
                            </div>

                            {/* Category and Unit */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                                        Категория *
                                    </label>
                                    <select
                                        value={formData.categoryId}
                                        onChange={(e) => handleChange('categoryId', parseInt(e.target.value))}
                                        className={`w-full px-4 py-3 rounded-xl border-2 bg-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                                            errors.categoryId ? 'border-red-300' : 'border-slate-200 focus:border-brand-500'
                                        }`}
                                    >
                                        <option value={0}>Выберите категорию</option>
                                        {categories?.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.categoryId && (
                                        <p className="mt-1.5 text-xs font-bold text-red-500">{errors.categoryId}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                                        Единица измерения *
                                    </label>
                                    <select
                                        value={formData.unitAsEnumId}
                                        onChange={(e) => handleChange('unitAsEnumId', parseInt(e.target.value))}
                                        className={`w-full px-4 py-3 rounded-xl border-2 bg-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                                            errors.unitAsEnumId ? 'border-red-300' : 'border-slate-200 focus:border-brand-500'
                                        }`}
                                    >
                                        <option value={0}>Выберите единицу</option>
                                        {units?.map((unit) => (
                                            <option key={unit.id} value={unit.id}>
                                                {unit.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.unitAsEnumId && (
                                        <p className="mt-1.5 text-xs font-bold text-red-500">{errors.unitAsEnumId}</p>
                                    )}
                                </div>
                            </div>
                        </form>

                        {/* Footer */}
                        <div className="flex gap-3 p-6 border-t border-slate-100 bg-slate-50">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="flex-1 h-12 rounded-xl font-bold"
                                disabled={createMutation.isPending}
                            >
                                Отмена
                            </Button>
                            <Button
                                type="submit"
                                onClick={handleSubmit}
                                className="flex-1 h-12 rounded-xl font-bold uppercase tracking-wider"
                                isLoading={createMutation.isPending}
                            >
                                {status === 'ACTIVE' ? 'Добавить в активное' : 'Добавить в резервное'}
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
