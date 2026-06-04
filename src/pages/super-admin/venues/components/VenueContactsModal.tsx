import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Mail, Instagram, MessageCircle, Send, Facebook, Globe, Laptop } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { VenueContactData, SocialLinks } from '@/types/venue';

interface VenueContactsModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialContacts: VenueContactData;
    onSave: (data: VenueContactData) => void;
    isSaving: boolean;
}

export const VenueContactsModal: React.FC<VenueContactsModalProps> = ({
    isOpen,
    onClose,
    initialContacts,
    onSave,
    isSaving
}) => {
    const [formData, setFormData] = useState<VenueContactData>(initialContacts);

    useEffect(() => {
        if (isOpen) {
            setFormData(initialContacts);
        }
    }, [isOpen, initialContacts]);

    const updateSocial = (key: keyof SocialLinks, value: string) => {
        setFormData(prev => ({
            ...prev,
            linksSocial: {
                ...prev.linksSocial,
                [key]: value
            }
        }));
    };

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
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-slate-900">Контакты</h2>
                                    <p className="text-xs text-slate-400 font-medium">Связи и социальные сети</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 text-slate-400 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Basic Contacts */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Телефон</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            type="tel"
                                            value={formData.phoneNumber}
                                            onChange={(e) => setFormData(p => ({ ...p, phoneNumber: e.target.value }))}
                                            className="w-full h-14 pl-12 pr-4 bg-slate-50 border-2 border-transparent focus:border-brand-primary rounded-2xl text-sm font-bold transition-all outline-none"
                                            placeholder="+996 (---) --- ---"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                                            className="w-full h-14 pl-12 pr-4 bg-slate-50 border-2 border-transparent focus:border-brand-primary rounded-2xl text-sm font-bold transition-all outline-none"
                                            placeholder="example@mail.kg"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Социальные сети</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {[
                                        { key: 'instagram', icon: Instagram, color: 'hover:border-pink-500', label: 'Instagram' },
                                        { key: 'whatsapp', icon: MessageCircle, color: 'hover:border-emerald-500', label: 'WhatsApp' },
                                        { key: 'telegram', icon: Send, color: 'hover:border-sky-500', label: 'Telegram' },
                                        { key: 'facebook', icon: Facebook, color: 'hover:border-blue-700', label: 'Facebook' },
                                        { key: 'website', icon: Globe, color: 'hover:border-slate-800', label: 'Вебсайт (или 2GIS)' }
                                    ].map((social) => (
                                        <div key={social.key} className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors">
                                                <social.icon size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                value={(formData.linksSocial as any)[social.key] || ''}
                                                onChange={(e) => updateSocial(social.key as any, e.target.value)}
                                                className={`w-full h-14 pl-12 pr-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold transition-all outline-none ${social.color} focus:bg-white`}
                                                placeholder={social.label}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-5 border-t border-slate-100 bg-white">
                            <Button
                                onClick={() => onSave(formData)}
                                disabled={isSaving}
                                size="lg"
                                className="w-full rounded-2xl font-black uppercase tracking-widest"
                            >
                                {isSaving ? 'Сохранение...' : 'Сохранить контакты'}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
