import React from 'react';
import { Edit3 } from 'lucide-react';

interface VenueInfoCardProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    onEdit?: () => void;
}

export const VenueInfoCard: React.FC<VenueInfoCardProps> = ({ title, icon, children, onEdit }) => {
    return (
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-6 pb-2 border-b border-dashed border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                        {icon}
                    </div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">{title}</h3>
                </div>
                {onEdit && (
                    <button
                        onClick={onEdit}
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-brand-50 hover:text-brand-600 transition-all group"
                    >
                        <Edit3 size={18} className="group-hover:scale-110 transition-transform" />
                    </button>
                )}
            </div>
            <div className="p-6 pt-4 flex-1">
                {children}
            </div>
        </div>
    );
};
