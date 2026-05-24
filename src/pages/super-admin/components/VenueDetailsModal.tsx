import React, { useState, useEffect } from 'react';
import { X, MapPin, DollarSign, Users, Save, Loader2, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../../components/ui/Button';
import { VenueDetailsData, City, Capacity } from '../../../types/venue';

interface VenueDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialDetails: VenueDetailsData;
    basicInfo: {
        address?: string;
        averageCheck?: number;
    };
    cities: City[];
    onSave: (details: VenueDetailsData) => void;
    isSaving: boolean;
}

export const VenueDetailsModal: React.FC<VenueDetailsModalProps> = ({
    isOpen,
    onClose,
    initialDetails,
    basicInfo,
    cities,
    onSave,
    isSaving
}) => {
    const [cityId, setCityId] = useState<number>(0);
    const [address, setAddress] = useState('');
    const [averageCheck, setAverageCheck] = useState<number>(0);
    const [capacities, setCapacities] = useState<Capacity[]>([]);

    useEffect(() => {
        if (isOpen) {
            // address and averageCheck come from basicInfo API
            // cityId and capacities come from details API
            setCityId(initialDetails?.cityId || 0);
            setAddress(basicInfo?.address || initialDetails?.address || '');
            setAverageCheck(basicInfo?.averageCheck || initialDetails?.averageCheck || 0);
            
            // Handle capacities - could be array or object
            const capacitiesData = initialDetails?.capacities;
            if (Array.isArray(capacitiesData)) {
                setCapacities(capacitiesData);
            } else if (capacitiesData && typeof capacitiesData === 'object') {
                // Convert object format { "Кабина": 10, "Стол": 100 } to array
                const capacitiesArray = Object.entries(capacitiesData).map(([title, value]) => ({
                    title,
                    value: Number(value)
                }));
                setCapacities(capacitiesArray);
            } else {
                setCapacities([]);
            }
        }
    }, [isOpen, initialDetails, basicInfo]);

    const addCapacity = () => {
        setCapacities([...capacities, { title: '', value: 0 }]);
    };

    const removeCapacity = (index: number) => {
        setCapacities(capacities.filter((_, i) => i !== index));
    };

    const updateCapacity = (index: number, field: 'title' | 'value', value: string | number) => {
        const newCapacities = [...capacities];
        newCapacities[index] = { ...newCapacities[index], [field]: value };
        setCapacities(newCapacities);
    };

    const handleSave = () => {
        onSave({
            cityId,
            address,
            averageCheck,
            capacities
        });
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900">Детали заведения</h3>
                                <p className="text-xs text-slate-500 font-medium">Город, адрес, средний чек и вместимость</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* City */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Город</label>
                            <select
                                value={cityId}
                                onChange={(e) => setCityId(Number(e.target.value))}
                                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white focus:border-orange-500 transition-all outline-none"
                            >
                                <option value={0}>Выберите город</option>
                                {cities.map(city => (
                                    <option key={city.id} value={city.id}>{city.title}</option>
                                ))}
                            </select>
                        </div>

                        {/* Address */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Адрес</label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Введите адрес заведения"
                                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white focus:border-orange-500 transition-all outline-none"
                            />
                        </div>

                        {/* Average Check */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                                <DollarSign size={14} />
                                Средний чек (сом)
                            </label>
                            <input
                                type="number"
                                value={averageCheck}
                                onChange={(e) => setAverageCheck(Number(e.target.value))}
                                min={0}
                                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white focus:border-orange-500 transition-all outline-none"
                            />
                        </div>

                        {/* Capacities */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                                    <Users size={14} />
                                    Вместимость
                                </label>
                                <button
                                    onClick={addCapacity}
                                    className="px-3 py-1.5 bg-orange-100 text-orange-600 rounded-lg text-xs font-black hover:bg-orange-200 transition-colors flex items-center gap-1"
                                >
                                    <Plus size={14} />
                                    Добавить
                                </button>
                            </div>

                            <div className="space-y-3">
                                {capacities.map((capacity, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                        <input
                                            type="text"
                                            value={capacity.title}
                                            onChange={(e) => updateCapacity(index, 'title', e.target.value)}
                                            placeholder="Название (напр. Кабина)"
                                            className="flex-1 h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm font-bold focus:border-orange-500 transition-all outline-none"
                                        />
                                        <input
                                            type="number"
                                            value={capacity.value}
                                            onChange={(e) => updateCapacity(index, 'value', Number(e.target.value))}
                                            placeholder="Кол-во"
                                            min={0}
                                            className="w-24 h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm font-bold focus:border-orange-500 transition-all outline-none"
                                        />
                                        <button
                                            onClick={() => removeCapacity(index)}
                                            className="w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}

                                {capacities.length === 0 && (
                                    <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl">
                                        <p className="text-sm text-slate-400 font-medium">Нет данных о вместимости</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-slate-50 bg-slate-50/50 flex gap-3">
                        <Button variant="ghost" onClick={onClose} className="flex-1 h-12 rounded-2xl font-black text-slate-500 border border-slate-200">
                            Отмена
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex-[2] h-12 rounded-2xl font-black bg-slate-900 text-brand-primary hover:bg-black shadow-xl shadow-slate-900/10"
                        >
                            {isSaving ? <Loader2 className="animate-spin mr-2" /> : <Save size={18} className="mr-2" />}
                            Сохранить изменения
                        </Button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
