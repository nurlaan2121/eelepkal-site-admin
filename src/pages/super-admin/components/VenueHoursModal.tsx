import React, { useState, useEffect } from 'react';
import { X, Clock, AlertCircle, Save, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../../components/ui/Button';
import { VenueWorkingHours } from '../../../types/venue';

interface VenueHoursModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialHours: VenueWorkingHours;
    onSave: (hours: VenueWorkingHours) => void;
    isSaving: boolean;
}

const DAYS = [
    { key: 'monday', label: 'Понедельник' },
    { key: 'tuesday', label: 'Вторник' },
    { key: 'wednesday', label: 'Среда' },
    { key: 'thursday', label: 'Четверг' },
    { key: 'friday', label: 'Пятница' },
    { key: 'saturday', label: 'Суббота' },
    { key: 'sunday', label: 'Воскресенье' },
];

export const VenueHoursModal: React.FC<VenueHoursModalProps> = ({
    isOpen,
    onClose,
    initialHours,
    onSave,
    isSaving
}) => {
    const [hours, setHours] = useState<VenueWorkingHours>(initialHours);
    const [dayOffs, setDayOffs] = useState<Record<string, boolean>>({});
    const [validationError, setValidationError] = useState<string>('');

    useEffect(() => {
        if (isOpen) {
            setHours(initialHours);
            const offs: Record<string, boolean> = {};
            DAYS.forEach(day => {
                const open = (initialHours as any)[`${day.key}Open`];
                const close = (initialHours as any)[`${day.key}Close`];
                if (open === '00:00' && close === '00:00') {
                    offs[day.key] = true;
                } else {
                    offs[day.key] = false;
                }
            });
            setDayOffs(offs);
        }
    }, [isOpen, initialHours]);

    const handleTimeChange = (day: string, type: 'Open' | 'Close', value: string) => {
        setHours(prev => ({
            ...prev,
            [`${day}${type}`]: value
        }));
    };

    const toggleDayOff = (day: string) => {
        setDayOffs(prev => {
            const newState = !prev[day];
            if (newState) {
                setHours(h => ({
                    ...h,
                    [`${day}Open`]: '00:00',
                    [`${day}Close`]: '00:00'
                }));
            } else {
                setHours(h => ({
                    ...h,
                    [`${day}Open`]: '09:00',
                    [`${day}Close`]: '23:00'
                }));
            }
            return { ...prev, [day]: newState };
        });
    };

    const validateHours = (): boolean => {
        for (const day of DAYS) {
            if (dayOffs[day.key]) continue;
            
            const open = (hours as any)[`${day.key}Open`];
            const close = (hours as any)[`${day.key}Close`];
            
            if (open && close) {
                // Compare times as strings (works for HH:MM format)
                if (open > close) {
                    setValidationError(`${day.label}: время открытия (${open}) не может быть позднее времени закрытия (${close})`);
                    return false;
                }
            }
        }
        setValidationError('');
        return true;
    };

    const handleSave = () => {
        if (validateHours()) {
            onSave(hours);
        }
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
                    className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                                <Clock size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900">График работы</h3>
                                <p className="text-xs text-slate-500 font-medium">Настройте время работы на каждый день</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Validation Error */}
                    {validationError && (
                        <div className="mx-6 mt-4 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
                            <AlertCircle size={20} className="text-rose-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm font-bold text-rose-700">{validationError}</p>
                        </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {DAYS.map((day) => {
                            const isOff = dayOffs[day.key];
                            return (
                                <div key={day.key} className={`p-4 rounded-2xl border transition-all ${isOff ? 'bg-slate-50 border-slate-100' : 'bg-white border-slate-100 shadow-sm'}`}>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className={`text-sm font-black ${isOff ? 'text-slate-400' : 'text-slate-800'}`}>{day.label}</span>
                                        <button
                                            onClick={() => toggleDayOff(day.key)}
                                            className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${isOff ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                        >
                                            {isOff ? 'Выходной' : 'Сделать выходным'}
                                        </button>
                                    </div>

                                    {!isOff && (
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1 space-y-1">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Открытие</label>
                                                <input
                                                    type="time"
                                                    value={(hours as any)[`${day.key}Open`]}
                                                    onChange={(e) => handleTimeChange(day.key, 'Open', e.target.value)}
                                                    className="w-full h-11 px-4 bg-slate-50 border-transparent rounded-xl text-sm font-bold focus:bg-white focus:border-orange-500 transition-all outline-none"
                                                />
                                            </div>
                                            <div className="h-4 w-4 border-b-2 border-slate-200 mt-5" />
                                            <div className="flex-1 space-y-1">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Закрытие</label>
                                                <input
                                                    type="time"
                                                    value={(hours as any)[`${day.key}Close`]}
                                                    onChange={(e) => handleTimeChange(day.key, 'Close', e.target.value)}
                                                    className="w-full h-11 px-4 bg-slate-50 border-transparent rounded-xl text-sm font-bold focus:bg-white focus:border-orange-500 transition-all outline-none"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
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
