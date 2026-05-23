import React from 'react';
import {
    Wifi, Car, UserCheck, ShieldCheck,
    Music, Tv, Baby, Cigarette,
    Wind, CreditCard, ParkingCircle,
    Volume2, Utensils, GlassWater,
    Camera, Briefcase, Heart, Star
} from 'lucide-react';

interface VenueAmenityChipProps {
    id: number;
    name: string;
}

const getAmenityConfig = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('wi-fi') || n.includes('вайфай') || n.includes('интернет')) return { icon: <Wifi size={14} />, color: 'bg-blue-50 text-blue-600 border-blue-100' };
    if (n.includes('парковка')) return { icon: <ParkingCircle size={14} />, color: 'bg-indigo-50 text-indigo-600 border-indigo-100' };
    if (n.includes('vip') || n.includes('вип')) return { icon: <Star size={14} />, color: 'bg-amber-50 text-amber-600 border-amber-100' };
    if (n.includes('детск') || n.includes('малыш')) return { icon: <Baby size={14} />, color: 'bg-pink-50 text-pink-600 border-pink-100' };
    if (n.includes('музык') || n.includes('диджей')) return { icon: <Music size={14} />, color: 'bg-purple-50 text-purple-600 border-purple-100' };
    if (n.includes('тв') || n.includes('телевизор')) return { icon: <Tv size={14} />, color: 'bg-slate-50 text-slate-600 border-slate-100' };
    if (n.includes('кондиционер') || n.includes('климат')) return { icon: <Wind size={14} />, color: 'bg-cyan-50 text-cyan-600 border-cyan-100' };
    if (n.includes('карт') || n.includes('безналич')) return { icon: <CreditCard size={14} />, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
    if (n.includes('охрана') || n.includes('безопасность')) return { icon: <ShieldCheck size={14} />, color: 'bg-red-50 text-red-600 border-red-100' };
    if (n.includes('кухня') || n.includes('еда')) return { icon: <Utensils size={14} />, color: 'bg-orange-50 text-orange-600 border-orange-100' };
    if (n.includes('бар') || n.includes('напитки')) return { icon: <GlassWater size={14} />, color: 'bg-sky-50 text-sky-600 border-sky-100' };
    if (n.includes('курение') || n.includes('кальян')) return { icon: <Cigarette size={14} />, color: 'bg-rose-50 text-rose-600 border-rose-100' };

    return { icon: <Heart size={14} />, color: 'bg-slate-50 text-slate-500 border-slate-100' };
};

export const VenueAmenityChip: React.FC<VenueAmenityChipProps> = ({ id, name }) => {
    const config = getAmenityConfig(name);

    return (
        <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs font-black uppercase tracking-wider transition-all hover:scale-105 cursor-default ${config.color}`}>
            {config.icon}
            <span>{name}</span>
        </div>
    );
};
