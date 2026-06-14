import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon, X } from 'lucide-react';

export interface ActionItem {
    icon: LucideIcon;
    label: string;
    description?: string;
    onClick: () => void;
    color?: string;
    danger?: boolean;
}

interface ActionSheetProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    subtitle?: string;
    actions: ActionItem[];
}

export const ActionSheet: React.FC<ActionSheetProps> = ({
    isOpen,
    onClose,
    title,
    subtitle,
    actions
}) => {
    // Stop propagation for interactions within the sheet
    const handleContentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-end justify-center">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                    />

                    {/* Sheet */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        onClick={handleContentClick}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="relative w-full max-w-lg bg-white rounded-t-[32px] shadow-2xl overflow-hidden pb-safe-area-inset-bottom"
                    >
                        {/* Pull Handle */}
                        <div className="flex justify-center pt-3 pb-1">
                            <div className="w-12 h-1.5 rounded-full bg-slate-200" />
                        </div>

                        {/* Header */}
                        {(title || subtitle) && (
                            <div className="px-6 py-4 border-b border-slate-50">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        {title && <h3 className="text-xl font-black text-slate-900 truncate">{title}</h3>}
                                        {subtitle && <p className="text-sm font-medium text-slate-400 mt-0.5 truncate">{subtitle}</p>}
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 transition-colors flex-shrink-0"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="px-3 py-3 space-y-1.5">
                            {actions.map((action, index) => (
                                <button
                                    key={action.label}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onClose();
                                        action.onClick();
                                    }}
                                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all active:scale-[0.98] ${action.danger
                                            ? 'hover:bg-red-50 text-red-600'
                                            : 'hover:bg-slate-50 text-slate-700'
                                        }`}
                                >
                                    <div className={`w-12 h-12 flex items-center justify-center rounded-2xl flex-shrink-0 ${action.danger
                                            ? 'bg-red-100/50'
                                            : 'bg-brand-50/50'
                                        }`}>
                                        <action.icon
                                            size={22}
                                            className={action.color || (action.danger ? 'text-red-500' : 'text-brand-600')}
                                        />
                                    </div>
                                    <div className="flex-1 text-left min-w-0">
                                        <p className="text-base font-black leading-tight">{action.label}</p>
                                        {action.description && (
                                            <p className="text-xs font-medium text-slate-400 mt-0.5">{action.description}</p>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Spacer for bottom safe area if needed */}
                        <div className="h-4" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
