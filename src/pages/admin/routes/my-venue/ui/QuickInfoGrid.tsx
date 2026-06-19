import {MapPin, Star, User, Wallet} from "lucide-react";
import {VenueSectionCard} from "../../../../../features/venue/ui/VenueSectionCard";
import {AdminVenueBasic, AdminVenuePublicAdmin} from "@/api/admin/venue";
import {ReactNode} from "react";
import {cn} from "@/shared/utils/cn";

const QuickInfoCard = ({
  delay,
  iconContainer,
  icon,
  children,
}: {
  delay: number;
  icon: ReactNode;
  iconContainer?: string;
  children: ReactNode;
}) => {
  return (
    <VenueSectionCard transition={{delay}}>
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-xl  flex items-center justify-center flex-shrink-0",
            iconContainer,
          )}
        >
          {icon}
        </div>
        <div>{children}</div>
      </div>
    </VenueSectionCard>
  );
};

export const QuickInfoGrid = ({
  basicData,
  publicAdminData,
}: {
  basicData?: AdminVenueBasic;
  publicAdminData?: AdminVenuePublicAdmin;
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Address */}
      <QuickInfoCard
        delay={0.1}
        icon={<MapPin size={20} className="text-brand-600" />}
        iconContainer="bg-brand-100"
      >
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
          Адрес
        </p>
        <p className="text-sm font-bold text-slate-900">{basicData?.address}</p>
      </QuickInfoCard>
      <QuickInfoCard
        delay={0.15}
        icon={<User size={20} className="text-blue-600" />}
        iconContainer="bg-brand-100"
      >
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
          Администратор
        </p>
        <p className="text-sm font-black text-slate-900">
          {publicAdminData?.fullName}
        </p>
        <p className="text-xs text-slate-500 mt-0.5">
          {publicAdminData?.phoneNumber}
        </p>
      </QuickInfoCard>
      <QuickInfoCard
        delay={0.2}
        icon={<Star size={20} className="text-amber-600" fill="currentColor" />}
        iconContainer="bg-amber-100"
      >
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
          Рейтинг
        </p>
        <p className="text-2xl font-black text-slate-900">
          {basicData?.rating.toFixed(2)}
        </p>
      </QuickInfoCard>
      <QuickInfoCard
        delay={0.25}
        icon={<Wallet size={20} className="text-emerald-600" />}
        iconContainer="bg-emerald-100"
      >
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
          Средний чек
        </p>
        <p className="text-2xl font-black text-slate-900">
          {basicData?.averageCheck}{" "}
          <span className="text-sm font-bold text-slate-400">сом</span>
        </p>
      </QuickInfoCard>
    </div>
  );
};
