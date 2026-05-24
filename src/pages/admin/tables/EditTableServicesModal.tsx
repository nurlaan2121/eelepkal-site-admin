import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Loader2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminTableService, TableAmenity } from '../../../api/admin/adminTableService';
import { Button } from '../../../components/ui/Button';
import { toast } from 'sonner';

interface EditTableServicesModalProps {
    isOpen: boolean;
    onClose: () => void;
    tableId: number | null;
    currentAmenities: string[];
}

export const EditTableServicesModal: React.FC<EditTableServicesModalProps> = ({ isOpen, onClose, tableId, currentAmenities }) => {
    const queryClient = useQueryClient();
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const { data: amenities } = useQuery({
        queryKey: ['table-amenities'],
        queryFn: adminTableService.getTableAmenities,
        enabled: isOpen,
    });

    useEffect(() => {
        if (isOpen && amenities) {
            // Конвертируем названия в ID
            const ids = currentAmenities
                .map(name => amenities.find(a => a.title === name)?.id)
                .filter((id): id is number => id !== undefined);
            setSelectedIds(ids);
        }
    }, [isOpen, amenities, currentAmenities]);

    const toggleAmenity = (id: number) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const updateMutation = useMutation({
        mutationFn: () => {
            if (!tableId) return Promise.reject('No tableId');
            return adminTableService.updateTableServices(tableId, selectedIds);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-tables'] });
            toast.success('Услуги обновлены');
            onClose();
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || error?.message || 'Ошибка обновления';
            toast.error(errorMessage);
        },
    });

    const handleSave = () => {
        updateMutation.mutate();
    };

    if (!isOpen || !tableId) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", duration: 0.3, bounce: 0.3 }}
                        className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
                    >
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-black text-white">Услуги и удобства</h2>
                                        <p className="text-xs text-purple-100 font-bold mt-1">Выбрано: {selectedIds.length}</p>
                                    </div>
                                    <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                                        <X size={20} className="text-white" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-2 max-h-96 overflow-y-auto">
                                {amenities?.map((amenity: TableAmenity) => (
                                    <button
                                        key={amenity.id}
                                        onClick={() => toggleAmenity(amenity.id)}
                                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                                            selectedIds.includes(amenity.id)
                                                ? 'border-purple-500 bg-purple-50'
                                                : 'border-slate-200 hover:border-slate-300'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-slate-900">{amenity.title}</span>
                                            {selectedIds.includes(amenity.id) && (
                                                <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                                                    <Check size={16} className="text-white" />
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-3 p-6 border-t border-slate-100 bg-slate-50">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    className="flex-1 h-12 rounded-xl font-bold"
                                    disabled={updateMutation.isPending}
                                >
                                    Отмена
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={updateMutation.isPending}
                                    className="flex-1 h-12 rounded-xl font-bold disabled:opacity-50"
                                >
                                    {updateMutation.isPending ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 size={18} className="animate-spin" />
                                            <span>Сохранение...</span>
                                        </div>
                                    ) : (
                                        'Сохранить'
                                    )}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
