/**
 * AppModal Component
 * Production-ready app-like modal with:
 * - Bottom sheet behavior on mobile
 * - Smooth animations
 * - Keyboard handling
 * - Safe area support
 * - Backdrop blur
 */

import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface AppModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    position?: 'center' | 'bottom';
    showCloseButton?: boolean;
    closeOnBackdropClick?: boolean;
    closeOnEscape?: boolean;
    className?: string;
}

export const AppModal: React.FC<AppModalProps> = ({
    isOpen,
    onClose,
    children,
    title,
    size = 'md',
    position = 'center',
    showCloseButton = true,
    closeOnBackdropClick = true,
    closeOnEscape = true,
    className = '',
}) => {
    // Handle escape key
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape' && closeOnEscape && isOpen) {
            onClose();
        }
    }, [isOpen, closeOnEscape, onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
            document.body.style.touchAction = 'none';
        } else {
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
        };
    }, [isOpen, handleKeyDown]);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (closeOnBackdropClick && e.target === e.currentTarget) {
            onClose();
        }
    };

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-full mx-0',
    };

    const isBottomSheet = position === 'bottom' || window.innerWidth < 768;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    onClick={handleBackdropClick}
                    className="fixed inset-0 z-[1000] flex items-center justify-center p-4 modal-backdrop"
                    style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        paddingTop: 'env(safe-area-inset-top)',
                        paddingBottom: 'env(safe-area-inset-bottom)',
                    }}
                >
                    <motion.div
                        initial={isBottomSheet ? { y: '100%', opacity: 1 } : { scale: 0.95, opacity: 0, y: 20 }}
                        animate={isBottomSheet ? { y: 0, opacity: 1 } : { scale: 1, opacity: 1, y: 0 }}
                        exit={isBottomSheet ? { y: '100%', opacity: 1 } : { scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ 
                            type: 'spring', 
                            damping: 25, 
                            stiffness: 300,
                            duration: 0.3 
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className={`
                            bg-white 
                            ${isBottomSheet ? 'w-full max-w-full rounded-t-3xl rounded-b-2xl max-h-[90vh] overflow-y-auto' : `${sizeClasses[size]} w-full rounded-3xl shadow-2xl overflow-hidden`}
                            ${className}
                        `}
                        style={{
                            maxHeight: isBottomSheet ? '90vh' : '85vh',
                            paddingBottom: 'env(safe-area-inset-bottom)',
                        }}
                    >
                        {/* Header */}
                        {title && (
                            <div className="sticky top-0 z-10 px-6 py-4 border-b border-slate-100 bg-white/95 backdrop-blur-sm">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                                    {showCloseButton && (
                                        <button
                                            onClick={onClose}
                                            className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors active:scale-95"
                                            aria-label="Закрыть"
                                        >
                                            <X size={20} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Content */}
                        <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

/**
 * AppConfirmModal Component
 * Simple confirmation modal with app-like UX
 */
interface AppConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmVariant?: 'primary' | 'danger';
    isConfirming?: boolean;
}

export const AppConfirmModal: React.FC<AppConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Подтвердить',
    cancelText = 'Отмена',
    confirmVariant = 'primary',
    isConfirming = false,
}) => {
    return (
        <AppModal
            isOpen={isOpen}
            onClose={onClose}
            size="sm"
            closeOnBackdropClick={false}
        >
            <div className="p-6">
                <h4 className="text-lg font-bold text-slate-900 mb-2">{title}</h4>
                <p className="text-sm text-slate-600 mb-6">{message}</p>
                
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isConfirming}
                        className="flex-1 py-3 px-4 rounded-2xl border-2 border-slate-200 text-slate-700 font-bold text-sm active:scale-95 transition-transform disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        disabled={isConfirming}
                        className={`
                            flex-1 py-3 px-4 rounded-2xl font-bold text-sm text-white active:scale-95 transition-transform disabled:opacity-50
                            ${confirmVariant === 'danger' 
                                ? 'bg-red-500 hover:bg-red-600' 
                                : 'bg-brand-primary hover:bg-brand-600'}
                        `}
                    >
                        {isConfirming ? 'Загрузка...' : confirmText}
                    </button>
                </div>
            </div>
        </AppModal>
    );
};
