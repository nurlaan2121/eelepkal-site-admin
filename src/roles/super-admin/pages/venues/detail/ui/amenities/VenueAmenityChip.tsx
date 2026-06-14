import React from "react";
import {
  Wifi,
  Car,
  UserCheck,
  ShieldCheck,
  Music,
  Tv,
  Baby,
  Cigarette,
  Wind,
  CreditCard,
  ParkingCircle,
  Utensils,
  GlassWater,
  Heart,
  Star,
} from "lucide-react";

interface VenueAmenityChipProps {
  id: number;
  name: string;
  minimized?: boolean;
}

const getAmenityConfig = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("wi-fi") || n.includes("вайфай") || n.includes("интернет"))
    return {icon: <Wifi size={16} />, color: "text-blue-500"};
  if (n.includes("парковка"))
    return {icon: <ParkingCircle size={16} />, color: "text-indigo-500"};
  if (n.includes("vip") || n.includes("вип"))
    return {icon: <Star size={16} />, color: "text-amber-500"};
  if (n.includes("детск") || n.includes("малыш"))
    return {icon: <Baby size={16} />, color: "text-pink-500"};
  if (n.includes("намаз") || n.includes("мечеть"))
    return {icon: <UserCheck size={16} />, color: "text-emerald-500"};
  if (n.includes("доставка"))
    return {icon: <Car size={16} />, color: "text-orange-500"};
  if (n.includes("музык") || n.includes("диджей"))
    return {icon: <Music size={16} />, color: "text-purple-500"};
  if (n.includes("тв") || n.includes("телевизор"))
    return {icon: <Tv size={16} />, color: "text-slate-500"};
  if (n.includes("кондиционер") || n.includes("климат"))
    return {icon: <Wind size={16} />, color: "text-cyan-500"};
  if (n.includes("карт") || n.includes("безналич"))
    return {icon: <CreditCard size={16} />, color: "text-emerald-500"};
  if (n.includes("охрана") || n.includes("безопасность"))
    return {icon: <ShieldCheck size={16} />, color: "text-red-500"};
  if (n.includes("кухня") || n.includes("еда"))
    return {icon: <Utensils size={16} />, color: "text-orange-500"};
  if (n.includes("бар") || n.includes("напитки"))
    return {icon: <GlassWater size={16} />, color: "text-sky-500"};
  if (n.includes("кальян") || n.includes("smoking"))
    return {icon: <Cigarette size={16} />, color: "text-rose-500"};

  return {icon: <Heart size={16} />, color: "text-slate-400"};
};

export const VenueAmenityChip: React.FC<VenueAmenityChipProps> = ({
  id,
  name,
  minimized,
}) => {
  const config = getAmenityConfig(name);

  if (minimized) {
    return (
      <div className="flex items-center gap-3">
        <div className={`${config.color}`}>{config.icon}</div>
        <span className="text-sm font-bold text-slate-800 line-clamp-1">
          {name}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs font-black uppercase tracking-wider transition-all hover:scale-105 cursor-default bg-slate-50 border-slate-100 ${config.color}`}
    >
      {config.icon}
      <span>{name}</span>
    </div>
  );
};
