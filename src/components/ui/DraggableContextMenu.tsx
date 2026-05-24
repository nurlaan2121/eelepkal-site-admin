import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical, LucideIcon } from 'lucide-react';

export interface MenuItem {
    icon: LucideIcon;
    label: string;
    color: string;
    onClick: () => void;
    danger?: boolean;
}

interface DraggableMenuProps {
    items: MenuItem[];
    buttonClassName?: string;
    menuClassName?: string;
}

export const DraggableContextMenu: React.FC<DraggableMenuProps> = ({
    items,
    buttonClassName = '',
    menuClassName = ''
}) => {
    const [open, setOpen] = React.useState(false);
    const [position, setPosition] = React.useState({ top: 0, left: 0 });
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const menuRef = React.useRef<HTMLDivElement>(null);
    const isDragging = React.useRef(false);
    const dragOffset = React.useRef({ x: 0, y: 0 });

    const calculatePosition = React.useCallback(() => {
        if (!buttonRef.current) return;

        const buttonRect = buttonRef.current.getBoundingClientRect();
        const menuWidth = 240;
        const menuHeight = Math.min(items.length * 52 + 60, window.innerHeight * 0.7);
        const padding = 16;

        let top = buttonRect.bottom + padding;
        let left = buttonRect.right - menuWidth;

        // Adjust if menu goes off bottom
        if (top + menuHeight > window.innerHeight - padding) {
            top = buttonRect.top - menuHeight - padding;
            if (top < padding) top = padding;
        }

        // Adjust if menu goes off right
        if (left + menuWidth > window.innerWidth - padding) {
            left = window.innerWidth - menuWidth - padding;
        }

        // Adjust if menu goes off left
        if (left < padding) {
            left = padding;
        }

        setPosition({ top, left });
    }, [items.length]);

    const handleToggle = React.useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        const willOpen = !open;
        setOpen(willOpen);

        if (willOpen) {
            setTimeout(calculatePosition, 10);
        }
    }, [open, calculatePosition]);

    // Drag handlers
    const handleDragStart = React.useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (!menuRef.current) return;
        isDragging.current = true;

        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        const rect = menuRef.current.getBoundingClientRect();
        dragOffset.current = {
            x: clientX - rect.left,
            y: clientY - rect.top
        };

        menuRef.current.style.cursor = 'grabbing';
        document.body.style.userSelect = 'none';
    }, []);

    const handleDragMove = React.useCallback((e: MouseEvent | TouchEvent) => {
        if (!isDragging.current || !menuRef.current) return;

        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        const newX = clientX - dragOffset.current.x;
        const newY = clientY - dragOffset.current.y;

        // Keep within viewport
        const padding = 16;
        const menuRect = menuRef.current.getBoundingClientRect();
        const boundedX = Math.max(padding, Math.min(window.innerWidth - menuRect.width - padding, newX));
        const boundedY = Math.max(padding, Math.min(window.innerHeight - menuRect.height - padding, newY));

        menuRef.current.style.left = `${boundedX}px`;
        menuRef.current.style.top = `${boundedY}px`;
        menuRef.current.style.right = 'auto';

        if ('preventDefault' in e && e.cancelable) {
            e.preventDefault();
        }
    }, []);

    const handleDragEnd = React.useCallback(() => {
        if (!menuRef.current) return;
        isDragging.current = false;
        menuRef.current.style.cursor = '';
        document.body.style.userSelect = '';

        // Snap back with animation
        setTimeout(calculatePosition, 50);
    }, [calculatePosition]);

    // Event listeners
    React.useEffect(() => {
        if (!open) return;

        const handleOutsideClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node) &&
                buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };

        const handleScroll = () => setOpen(false);

        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('keydown', handleEscape);
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('keydown', handleEscape);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [open]);

    // Drag event listeners
    React.useEffect(() => {
        if (!open) return;

        document.addEventListener('mousemove', handleDragMove);
        document.addEventListener('mouseup', handleDragEnd);
        document.addEventListener('touchmove', handleDragMove, { passive: false });
        document.addEventListener('touchend', handleDragEnd);

        return () => {
            document.removeEventListener('mousemove', handleDragMove);
            document.removeEventListener('mouseup', handleDragEnd);
            document.removeEventListener('touchmove', handleDragMove);
            document.removeEventListener('touchend', handleDragEnd);
        };
    }, [open, handleDragMove, handleDragEnd]);

    return (
        <div className="relative inline-block">
            <button
                ref={buttonRef}
                onClick={handleToggle}
                className={`w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 active:bg-slate-200 transition-all duration-200 hover:scale-105 active:scale-95 ${buttonClassName}`}
            >
                <MoreVertical size={18} />
            </button>

            <AnimatePresence>
                {open && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-[199] bg-black/20 backdrop-blur-sm"
                            onClick={() => setOpen(false)}
                        />

                        {/* Menu */}
                        <motion.div
                            ref={menuRef}
                            initial={{ opacity: 0, scale: 0.92, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: -10 }}
                            transition={{
                                type: 'spring',
                                damping: 25,
                                stiffness: 300,
                                duration: 0.3
                            }}
                            className={`fixed z-[200] w-60 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/10 border border-white/50 overflow-hidden ${menuClassName}`}
                            style={{
                                top: `${position.top}px`,
                                left: `${position.left}px`
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Drag Handle */}
                            <div
                                className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing select-none"
                                onMouseDown={handleDragStart}
                                onTouchStart={handleDragStart}
                            >
                                <div className="w-10 h-1 rounded-full bg-slate-300/60 hover:bg-slate-400 transition-colors" />
                            </div>

                            {/* Menu Items */}
                            <div className="px-3 pb-3 space-y-1">
                                {items.map((item, index) => (
                                    <motion.button
                                        key={item.label}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpen(false);
                                            item.onClick();
                                        }}
                                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 text-left group hover:translate-x-[3px] ${item.danger
                                                ? 'hover:bg-red-50 active:bg-red-100'
                                                : 'hover:bg-black/[0.04] active:bg-black/[0.08]'
                                            }`}
                                    >
                                        <item.icon
                                            size={18}
                                            className={`${item.color} transition-transform group-hover:scale-110`}
                                        />
                                        <span className={`text-sm font-semibold ${item.danger ? 'text-red-500' : 'text-slate-700'
                                            }`}>
                                            {item.label}
                                        </span>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};
