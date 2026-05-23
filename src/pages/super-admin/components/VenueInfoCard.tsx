import React from 'react';
import { Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';

interface VenueInfoCardProps {
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    onEdit?: () => void;
    className?: string;
    description?: string;
}

export const VenueInfoCard: React.FC<VenueInfoCardProps> = ({
    title,
    icon,
    children,
    onEdit,
    className = '',
    description
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] transition-all duration-500 relative group ${className}`}
        >
            <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-5">
                    {icon && (
                        <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-500 transition-colors group-hover:bg-slate-100">
                            {React.cloneElement(icon as React.ReactElement, { size: 24 })}
                        </div>
                    )}
                    <div>
                        <h3 className="text-xl font-black text-slate-900 leading-none">{title}</h3>
                        {description && <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">{description}</p>}
                    </div>
                </div>

                {onEdit && (
                    <button
                        onClick={onEdit}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-brand-50 hover:text-brand-600 border border-transparent hover:border-brand-100 scale-90 group-hover:scale-100"
                        title="Редактировать"
                    >
                        <Edit3 size={18} />
                    </button>
                )}
            </div>

            <div className="relative">
                {children}
            </div>
        </motion.div>
    );
};
