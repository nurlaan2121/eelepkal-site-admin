import React from 'react';
import { Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';

interface VenueInfoCardProps {
    title?: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    onEdit?: () => void;
    className?: string;
    noPadding?: boolean;
}

export const VenueInfoCard: React.FC<VenueInfoCardProps> = ({
    title,
    icon,
    children,
    onEdit,
    className = '',
    noPadding = false
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`bg-white rounded-[24px] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative overflow-hidden transition-all duration-300 ${className}`}
        >
            <div className={`relative ${noPadding ? '' : 'p-6 sm:p-8'}`}>
                {(title || onEdit) && (
                    <div className="flex items-center justify-between mb-6">
                        {title ? (
                            <div className="flex items-center gap-3">
                                {icon && <div className="text-orange-500">{icon}</div>}
                                <h3 className="text-lg font-black text-slate-900 tracking-tight">{title}</h3>
                            </div>
                        ) : <div />}

                        {onEdit && (
                            <button
                                onClick={onEdit}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-slate-400 shadow-[0_2px_10px_rgba(0,0,0,0.08)] border border-slate-50 hover:text-orange-500 hover:scale-110 active:scale-95 transition-all"
                            >
                                <Edit3 size={16} />
                            </button>
                        )}
                    </div>
                )}

                <div className="relative">
                    {children}
                </div>
            </div>
        </motion.div>
    );
};
