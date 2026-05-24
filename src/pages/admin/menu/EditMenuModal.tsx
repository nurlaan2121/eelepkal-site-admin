import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X, Upload, Image as ImageIcon, Loader2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminMenuService, CreateMenuRequest, MenuCategorySimple, MenuUnit, MenuItemFull, MenuStatus } from '../../../api/admin/adminMenuService';
import { Button } from '../../../components/ui/Button';
import { toast } from 'sonner';

interface EditMenuModalProps {
    isOpen: boolean;
    onClose: () => void;
    menuId: number | null;
    menuStatus?: MenuStatus;
}

export const EditMenuModal: React.FC<EditMenuModalProps> = ({ isOpen, onClose, menuId, menuStatus }) => {
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

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Fetch menu item data
    const { data: menuItem, isLoading: isLoadingMenuItem } = useQuery({
        queryKey: ['menu-item', menuId],
        queryFn: () => adminMenuService.getMenuItem(menuId!),
        enabled: isOpen && !!menuId,
    });

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

    // Initialize form when menuItem is loaded
    useEffect(() => {
        if (menuItem) {
            setFormData({
                imageUrl: menuItem.imageUrl || '',
                categoryId: 0, // Will be set if categories are loaded
                title: menuItem.name || '',
                description: menuItem.description || '',
                price: menuItem.price || 0,
                meaning: menuItem.value || '',
                unitAsEnumId: 0, // Will be set if units are loaded
            });
            setImagePreview(menuItem.imageUrl || null);
        }
    }, [menuItem]);

    // Auto-match category and unit when data is loaded
    useEffect(() => {
        if (menuItem && categories && units) {
            // Try to match category by name or keep as 0
            // Try to match unit by name
            const matchedUnit = units.find(u => u.name === menuItem.unit);
            if (matchedUnit) {
                setFormData(prev => ({ ...prev, unitAsEnumId: matchedUnit.id }));
            }
        }
    }, [menuItem, categories, units]);

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: (data: CreateMenuRequest) => adminMenuService.updateMenu(menuId!, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['menu-items'] });
            toast.success('Блюдо успешно обновлено');
            onClose();
            resetForm();
        },
        onError: (error: any) => {
            console.error('Update error:', error);
            const errorMessage = error?.response?.data?.message || error?.message || 'Ошибка обновления';
            toast.error(errorMessage);
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
        setSelectedFile(null);
        setImagePreview(null);
        setIsUploading(false);
    };

    const validate = (): boolean => {
        const errors: Partial<Record<keyof CreateMenuRequest, string>> = {};

        if (!formData.title.trim()) {
            errors.title = 'Название обязательно';
        }

        if (!formData.description.trim()) {
            errors.description = 'Описание обязательно';
        }

        if (formData.price <= 0) {
            errors.price = 'Цена должна быть больше 0';
        }

        if (formData.categoryId === 0) {
            errors.categoryId = 'Выберите категорию';
        }

        if (formData.unitAsEnumId === 0) {
            errors.unitAsEnumId = 'Выберите единицу измерения';
        }

        if (Object.keys(errors).length > 0) {
            toast.error('Пожалуйста, заполните все обязательные поля');
        }

        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate() && menuId) {
            updateMutation.mutate(formData);
        }
    };

    const handleChange = (field: keyof CreateMenuRequest, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Пожалуйста, выберите изображение');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Размер файла не должен превышать 5MB');
            return;
        }

        setSelectedFile(file);
        
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Auto upload to S3
        setIsUploading(true);
        try {
            const imageUrl = await adminMenuService.uploadImageToS3(file);
            setFormData(prev => ({ ...prev, imageUrl }));
            toast.success('Изображение загружено');
        } catch (error: any) {
            console.error('Upload error:', error);
            const errorMessage = error?.response?.data?.message || error?.message || 'Ошибка загрузки изображения';
            toast.error(errorMessage);
        } finally {
            setIsUploading(false);
        }
    };

    if (!isOpen || !menuId) return null;

    const isInactive = menuStatus === 'INACTIVE';

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
                                <h2 className="text-2xl font-black text-slate-900">Редактировать блюдо</h2>
                                <p className="text-sm text-slate-400 mt-0.5">Обновите информацию о блюде</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Form */}
                        {isLoadingMenuItem ? (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 border-3 border-brand-primary border-t-transparent rounded-full animate-spin" />
                                    <span className="text-sm font-bold text-slate-600">Загрузка данных...</span>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Warning for inactive menu */}
                                {isInactive && (
                                    <div className="p-4 bg-amber-50 border-b border-amber-200">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                                                <AlertTriangle size={20} className="text-amber-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-black text-amber-900 mb-1">
                                                    Блюдо в резерве
                                                </p>
                                                <p className="text-xs font-bold text-amber-700">
                                                    Чтобы изменить сначала сделайте меню активным!
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                                {/* Image Upload */}
                                <div>
                                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                                        Изображение блюда
                                    </label>
                                    
                                    {!imagePreview ? (
                                        <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-brand-500 hover:bg-brand-50/30 transition-all">
                                            <ImageIcon size={32} className="text-slate-300 mb-2" />
                                            <p className="text-sm font-bold text-slate-400">Нажмите для выбора изображения</p>
                                            <p className="text-xs text-slate-300 mt-1">JPG, PNG до 5MB • Загрузка автоматически</p>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileSelect}
                                                className="hidden"
                                            />
                                        </label>
                                    ) : (
                                        <div className="relative rounded-xl overflow-hidden bg-slate-100">
                                            <img 
                                                src={imagePreview} 
                                                alt="Preview" 
                                                className="w-full h-48 object-cover"
                                            />
                                            {isUploading && (
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-lg">
                                                        <Loader2 size={20} className="animate-spin text-brand-primary" />
                                                        <span className="text-sm font-bold text-slate-700">Загрузка...</span>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="absolute top-2 right-2 flex gap-2">
                                                {formData.imageUrl && (
                                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-lg shadow-lg">
                                                        <div className="w-2 h-2 bg-white rounded-full" />
                                                        Загружено в S3
                                                    </div>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedFile(null);
                                                        setImagePreview(null);
                                                        setFormData(prev => ({ ...prev, imageUrl: '' }));
                                                    }}
                                                    disabled={isUploading}
                                                    className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg disabled:opacity-50"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
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
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                                    />
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
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-none"
                                    />
                                </div>

                                {/* Price and Weight/Portion */}
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
                                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                                            Порция / Вес
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.meaning}
                                            onChange={(e) => handleChange('meaning', e.target.value)}
                                            placeholder="например, 200 гр, 1 литр, 6 персон"
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
                                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                                        >
                                            <option value={0}>Выберите категорию</option>
                                            {categories?.map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                                            Единица измерения *
                                        </label>
                                        <select
                                            value={formData.unitAsEnumId}
                                            onChange={(e) => handleChange('unitAsEnumId', parseInt(e.target.value))}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                                        >
                                            <option value={0}>Выберите единицу</option>
                                            {units?.map((unit) => (
                                                <option key={unit.id} value={unit.id}>
                                                    {unit.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </form>
                            </>
                        )}

                        {/* Footer */}
                        <div className="flex gap-3 p-6 border-t border-slate-100 bg-slate-50">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="flex-1 h-12 rounded-xl font-bold"
                                disabled={updateMutation.isPending || isLoadingMenuItem}
                            >
                                Отмена
                            </Button>
                            <Button
                                type="submit"
                                onClick={handleSubmit}
                                className="flex-1 h-12 rounded-xl font-bold uppercase tracking-wider"
                                isLoading={updateMutation.isPending || isLoadingMenuItem}
                                disabled={isInactive}
                            >
                                {isInactive ? 'Сначала сделайте активным' : 'Сохранить изменения'}
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
