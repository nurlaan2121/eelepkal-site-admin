import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Type } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface VenueDescModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialName: string;
    initialDescription: string;
    onSave: (data: { name: string, description: string }) => void;
    isSaving: boolean;
}

export const VenueDescModal: React.FC<VenueDescModalProps> = ({
    isOpen,
    onClose,
    initialName,
    initialDescription,
    onSave,
    isSaving
}) => {
    const [name, setName] = useState(initialName);
    const [description, setDescription] = useState(initialDescription);

    useEffect(() => {
        if (isOpen) {
            setName(initialName);
            setDescription(initialDescription);
        }
    }, [isOpen, initialName, initialDescription]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ y: '100%', opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: '100%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 400 }}
                        className="relative bg-white rounded-t-3xl md:rounded-3xl w-full md:max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-slate-900">Основная информация</h2>
                                    <p className="text-xs text-slate-400 font-medium">Название и описание заведения</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 text-slate-400 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Name */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Название заведения</label>
                                <div className="relative">
                                    <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full h-14 pl-12 pr-4 bg-slate-50 border-2 border-transparent focus:border-brand-primary rounded-2xl text-sm font-bold transition-all outline-none"
                                        placeholder="Введите название..."
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Описание</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={8}
                                    className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-brand-primary rounded-2xl text-sm font-medium transition-all outline-none resize-none leading-relaxed"
                                    placeholder="Расскажите о заведении..."
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-5 border-t border-slate-100 bg-white">
                            <Button
                                onClick={() => onSave({ name, description })}
                                disabled={isSaving || !name.trim()}
                                className="w-full h-14 rounded-2xl font-black text-sm uppercase tracking-widest"
                            >
                                {isSaving ? 'Сохранение...' : 'Обновить информацию'}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
