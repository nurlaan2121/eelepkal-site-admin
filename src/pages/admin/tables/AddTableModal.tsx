import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminTableService, CreateTableRequest, TableType, TableAmenity, EventType } from '../../../api/admin/adminTableService';
import { Button } from '../../../components/ui/Button';
import { toast } from 'sonner';

interface AddTableModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultFloor?: number;
}

export const AddTableModal: React.FC<AddTableModalProps> = ({ isOpen, onClose, defaultFloor = 1 }) => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState<CreateTableRequest>({
        inFloor: defaultFloor,
        tableTypeId: 0,
        imageUrls: [],
        title: '',
        capacityMin: 1,
        capacityMax: 1,
        deposit: '',
        description: '',
        tableAmenitiesIds: [],
        eventTypeIds: [],
    });

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    // Fetch table types
    const { data: tableTypes } = useQuery({
        queryKey: ['table-types'],
        queryFn: adminTableService.getTableTypes,
        enabled: isOpen,
    });

    // Fetch amenities
    const { data: amenities } = useQuery({
        queryKey: ['table-amenities'],
        queryFn: adminTableService.getTableAmenities,
        enabled: isOpen,
    });

    // Fetch event types
    const { data: eventTypes } = useQuery({
        queryKey: ['event-types'],
        queryFn: adminTableService.getEventTypes,
        enabled: isOpen,
    });

    const addMutation = useMutation({
        mutationFn: (data: CreateTableRequest) => adminTableService.addTable(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-tables'] });
            toast.success('Столик успешно добавлен');
            onClose();
            resetForm();
        },
        onError: (error: any) => {
            console.error('Add table error:', error);
            const errorMessage = error?.response?.data?.message || error?.message || 'Ошибка добавления';
            toast.error(errorMessage);
        },
    });

    const resetForm = () => {
        setFormData({
            inFloor: defaultFloor,
            tableTypeId: 0,
            imageUrls: [],
            title: '',
            capacityMin: 1,
            capacityMax: 1,
            deposit: '',
            description: '',
            tableAmenitiesIds: [],
            eventTypeIds: [],
        });
        setSelectedFiles([]);
        setImagePreviews([]);
        setIsUploading(false);
    };

    const validate = (): boolean => {
        const errors: string[] = [];

        if (!formData.title.trim()) {
            errors.push('Название обязательно');
        }

        if (formData.tableTypeId === 0) {
            errors.push('Выберите тип стола');
        }

        if (formData.capacityMin < 1 || formData.capacityMax < formData.capacityMin) {
            errors.push('Проверьте вместимость');
        }

        if (formData.imageUrls.length === 0) {
            errors.push('Добавьте хотя бы одно фото');
        }

        if (errors.length > 0) {
            toast.error(errors[0]);
        }

        return errors.length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            addMutation.mutate(formData);
        }
    };

    const handleChange = (field: keyof CreateTableRequest, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        // Validate files
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
        
        // Create previews
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

        // Auto upload to S3
        setIsUploading(true);
        try {
            const uploadPromises = files.map(file => adminTableService.uploadImageToS3(file));
            const imageUrls = await Promise.all(uploadPromises);
            setFormData(prev => ({
                ...prev,
                imageUrls: [...prev.imageUrls, ...imageUrls],
            }));
            toast.success(`Загружено ${files.length} фото`);
        } catch (error: any) {
            console.error('Upload error:', error);
            const errorMessage = error?.response?.data?.message || error?.message || 'Ошибка загрузки изображений';
            toast.error(errorMessage);
        } finally {
            setIsUploading(false);
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            imageUrls: prev.imageUrls.filter((_, i) => i !== index),
        }));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const toggleAmenity = (amenityId: number) => {
        setFormData(prev => ({
            ...prev,
            tableAmenitiesIds: prev.tableAmenitiesIds.includes(amenityId)
                ? prev.tableAmenitiesIds.filter(id => id !== amenityId)
                : [...prev.tableAmenitiesIds, amenityId],
        }));
    };

    const toggleEventType = (eventTypeId: number) => {
        setFormData(prev => ({
            ...prev,
            eventTypeIds: prev.eventTypeIds.includes(eventTypeId)
                ? prev.eventTypeIds.filter(id => id !== eventTypeId)
                : [...prev.eventTypeIds, eventTypeId],
        }));
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
                            <div className="bg-gradient-to-br from-brand-500 to-brand-600 p-5 flex-shrink-0">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-black text-white">
                                        Добавить столик
                                    </h2>
                                    <button
                                        onClick={onClose}
                                        className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                                    >
                                        <X size={20} className="text-white" />
                                    </button>
                                </div>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                                {/* Images */}
                                <div>
                                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                                        Фотографии *
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {imagePreviews.map((preview, index) => (
                                            <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                                                <img src={preview} alt="" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                        <label className="aspect-square rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:border-brand-400 hover:bg-brand-50 transition-colors">
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
                                        Название *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => handleChange('title', e.target.value)}
                                        placeholder="например, Стол №1"
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                                    />
                                </div>

                                {/* Floor and Type */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                                            Этаж *
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.inFloor}
                                            onChange={(e) => handleChange('inFloor', parseInt(e.target.value))}
                                            min={1}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                                            Тип стола *
                                        </label>
                                        <select
                                            value={formData.tableTypeId}
                                            onChange={(e) => handleChange('tableTypeId', parseInt(e.target.value))}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                                        >
                                            <option value={0}>Выберите тип</option>
                                            {tableTypes && Object.entries(tableTypes).map(([name, id]) => (
                                                <option key={id} value={id}>{name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Capacity */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                                            Мин. вместимость *
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.capacityMin}
                                            onChange={(e) => handleChange('capacityMin', parseInt(e.target.value))}
                                            min={1}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                                            Макс. вместимость *
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.capacityMax}
                                            onChange={(e) => handleChange('capacityMax', parseInt(e.target.value))}
                                            min={formData.capacityMin}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                                        />
                                    </div>
                                </div>

                                {/* Deposit */}
                                <div>
                                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                                        Депозит
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.deposit}
                                        onChange={(e) => handleChange('deposit', e.target.value)}
                                        placeholder="например, 5000 сом"
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                                        Описание
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => handleChange('description', e.target.value)}
                                        placeholder="Описание столика..."
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-none"
                                    />
                                </div>

                                {/* Amenities */}
                                <div>
                                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                                        Удобства
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {amenities?.map((amenity) => (
                                            <button
                                                key={amenity.id}
                                                type="button"
                                                onClick={() => toggleAmenity(amenity.id)}
                                                className={`p-3 rounded-xl border-2 text-sm font-bold transition-all ${
                                                    formData.tableAmenitiesIds.includes(amenity.id)
                                                        ? 'border-brand-500 bg-brand-50 text-brand-700'
                                                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                                }`}
                                            >
                                                {amenity.title}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Event Types */}
                                <div>
                                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                                        Типы мероприятий
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {eventTypes && Object.entries(eventTypes).map(([name, id]) => (
                                            <button
                                                key={id}
                                                type="button"
                                                onClick={() => toggleEventType(id)}
                                                className={`p-3 rounded-xl border-2 text-sm font-bold transition-all ${
                                                    formData.eventTypeIds.includes(id)
                                                        ? 'border-brand-500 bg-brand-50 text-brand-700'
                                                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                                }`}
                                            >
                                                {name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </form>

                            {/* Footer */}
                            <div className="flex gap-3 p-6 border-t border-slate-100 bg-slate-50 flex-shrink-0">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    className="flex-1 h-12 rounded-xl font-bold"
                                    disabled={addMutation.isPending}
                                >
                                    Отмена
                                </Button>
                                <Button
                                    type="submit"
                                    onClick={handleSubmit}
                                    className="flex-1 h-12 rounded-xl font-bold uppercase tracking-wider"
                                    isLoading={addMutation.isPending}
                                >
                                    Добавить столик
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
