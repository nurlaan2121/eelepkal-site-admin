import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminTableService, TableDetail, TableType, TableAmenity, EventType } from '../../../api/admin/adminTableService';
import { Button } from '../../../components/ui/Button';
import { toast } from 'sonner';

interface EditTableModalProps {
    isOpen: boolean;
    onClose: () => void;
    tableId: number | null;
    selectedDate: string;
}

export const EditTableModal: React.FC<EditTableModalProps> = ({ isOpen, onClose, tableId, selectedDate }) => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState<TableDetail | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    // Fetch table details
    const { data: tableDetail, isLoading: isLoadingTable } = useQuery({
        queryKey: ['table-detail', tableId],
        queryFn: () => adminTableService.getTableById(tableId!),
        enabled: isOpen && !!tableId,
    });

    // Fetch helper data
    const { data: tableTypes } = useQuery({
        queryKey: ['table-types'],
        queryFn: adminTableService.getTableTypes,
        enabled: isOpen,
    });

    const { data: amenities } = useQuery({
        queryKey: ['table-amenities'],
        queryFn: adminTableService.getTableAmenities,
        enabled: isOpen,
    });

    const { data: eventTypes } = useQuery({
        queryKey: ['event-types'],
        queryFn: adminTableService.getEventTypes,
        enabled: isOpen,
    });

    // Initialize form when tableDetail is loaded
    useEffect(() => {
        if (tableDetail) {
            setFormData(tableDetail);
            const images = Object.values(tableDetail.images);
            setImagePreviews(images);
        }
    }, [tableDetail]);

    const updateMutation = useMutation({
        mutationFn: (data: any) => {
            // TODO: Implement update API when available
            return Promise.resolve();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-tables'] });
            toast.success('Столик успешно обновлен');
            onClose();
        },
        onError: (error: any) => {
            console.error('Update error:', error);
            const errorMessage = error?.response?.data?.message || error?.message || 'Ошибка обновления';
            toast.error(errorMessage);
        },
    });

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        for (const file of files) {
            if (!file.type.startsWith('image/')) {
                toast.error('Можно загружать только изображения');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Размер файла не должен превышать 5MB');
                return;
            }
        }

        setSelectedFiles(prev => [...prev, ...files]);
        
        const newPreviews: string[] = [];
        for (const file of files) {
            const reader = new FileReader();
            reader.onloadend = () => {
                newPreviews.push(reader.result as string);
                if (newPreviews.length === files.length) {
                    setImagePreviews(prev => [...prev, ...newPreviews]);
                }
            };
            reader.readAsDataURL(file);
        }

        setIsUploading(true);
        try {
            const uploadPromises = files.map(file => adminTableService.uploadImageToS3(file));
            const imageUrls = await Promise.all(uploadPromises);
            if (formData) {
                setFormData({
                    ...formData,
                    images: {
                        ...formData.images,
                        ...imageUrls.reduce((acc, url, idx) => ({
                            ...acc,
                            [`image${Date.now() + idx}`]: url,
                        }), {}),
                    },
                });
            }
            toast.success(`Загружено ${files.length} фото`);
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Ошибка загрузки изображений';
            toast.error(errorMessage);
        } finally {
            setIsUploading(false);
        }
    };

    const removeImage = (key: string) => {
        if (formData) {
            const newImages = { ...formData.images };
            delete newImages[key];
            setFormData({ ...formData, images: newImages });
            setImagePreviews(Object.values(newImages));
        }
    };

    if (!isOpen || !tableId) return null;

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
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", duration: 0.3, bounce: 0.3 }}
                        className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
                    >
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                            {/* Header */}
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 flex-shrink-0">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-black text-white">
                                            Редактировать столик
                                        </h2>
                                        <p className="text-xs text-blue-100 font-bold mt-1">
                                            Дата: {new Date(selectedDate).toLocaleDateString('ru-RU')}
                                        </p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                                    >
                                        <X size={20} className="text-white" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            {isLoadingTable ? (
                                <div className="flex-1 flex items-center justify-center p-12">
                                    <div className="flex items-center gap-3">
                                        <Loader2 size={24} className="text-blue-600 animate-spin" />
                                        <span className="text-sm font-bold text-slate-600">Загрузка данных...</span>
                                    </div>
                                </div>
                            ) : formData ? (
                                <>
                                    {/* Form */}
                                    <div className="flex-1 overflow-y-auto p-6 space-y-5">
                                        {/* Images */}
                                        <div>
                                            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                                                Фотографии
                                            </label>
                                            <div className="grid grid-cols-3 gap-3">
                                                {Object.entries(formData.images).map(([key, url]) => (
                                                    <div key={key} className="relative aspect-square rounded-xl overflow-hidden group">
                                                        <img src={url} alt="" className="w-full h-full object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(key)}
                                                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                                <label className="aspect-square rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                                                    {isUploading ? (
                                                        <Loader2 size={24} className="text-slate-400 animate-spin" />
                                                    ) : (
                                                        <>
                                                            <Upload size={24} className="text-slate-400 mb-1" />
                                                            <span className="text-xs font-bold text-slate-500">Добавить</span>
                                                        </>
                                                    )}
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        onChange={handleFileSelect}
                                                        className="hidden"
                                                        disabled={isUploading}
                                                    />
                                                </label>
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <div>
                                            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                                                Название
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>

                                        {/* Floor and Type */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                                                    Этаж
                                                </label>
                                                <input
                                                    type="number"
                                                    value={formData.inFloor}
                                                    onChange={(e) => setFormData({ ...formData, inFloor: parseInt(e.target.value) })}
                                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                                                    Тип стола
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.etableType}
                                                    readOnly
                                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-sm font-medium text-slate-500"
                                                />
                                            </div>
                                        </div>

                                        {/* Capacity and Price */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                                                    Вместимость
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.capacity}
                                                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                                                    Цена
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.price}
                                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                                                Описание
                                            </label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                rows={3}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                            />
                                        </div>

                                        {/* Amenities */}
                                        <div>
                                            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                                                Удобства
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {formData.amenities.map((amenity, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-xl text-xs font-bold text-blue-700"
                                                    >
                                                        {amenity}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Event Types */}
                                        <div>
                                            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                                                Типы мероприятий
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {formData.eventTypes.map((eventType, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="px-3 py-2 bg-purple-50 border border-purple-200 rounded-xl text-xs font-bold text-purple-700"
                                                    >
                                                        {eventType}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex gap-3 p-6 border-t border-slate-100 bg-slate-50 flex-shrink-0">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={onClose}
                                            className="flex-1 h-12 rounded-xl font-bold"
                                        >
                                            Закрыть
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                toast.info('Функция обновления будет добавлена позже');
                                            }}
                                            className="flex-1 h-12 rounded-xl font-bold uppercase tracking-wider"
                                        >
                                            Сохранить изменения
                                        </Button>
                                    </div>
                                </>
                            ) : null}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
