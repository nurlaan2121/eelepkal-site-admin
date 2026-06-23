import {tv} from "tailwind-variants";
import {
  VenueSectionCard,
  InitialSecitonCardProps,
  VenueDetailsType,
  GetBasicInfoData,
} from "@/features/venue-detail";
import {
  Layers,
  LayoutGrid,
  MapPin,
  Sofa,
  Users,
  Wallet,
  LucideIcon,
  Star,
} from "lucide-react";
import {ReactNode} from "react";
import {cn} from "@/shared/utils/cn";

interface Props extends InitialSecitonCardProps {
  basicData?: GetBasicInfoData;
  capacities?: [string, number][];
}

// Tailwind variants for detail items
const detailItemStyles = tv({
  slots: {
    container: "flex gap-3",
    iconBox: "w-10 h-10 rounded-xl flex items-center justify-center",
    label: "text-xs font-bold uppercase text-slate-400",
    content: "font-bold text-sm",
  },
});

interface DetailItemProps extends InitialSecitonCardProps {
  icon: ReactNode;
  label: string;
  children: ReactNode;
  iconClassName?: string;
}

const DetailItem = ({
  icon,
  iconClassName,
  label,
  delay,
  children,
}: DetailItemProps) => {
  const {container, iconBox, label: labelStyles} = detailItemStyles();
  return (
    <VenueSectionCard className={container()} transition={{delay}}>
      <div className={cn(iconBox(), iconClassName)}>{icon}</div>
      <div className="space-y-1">
        <p className={labelStyles()}>{label}</p>
        {children}
      </div>
    </VenueSectionCard>
  );
};

export const VenueDetailsSectionCard = ({delay, basicData, actions}: Props) => {
  const details: DetailItemProps[] = [
    {
      icon: <Wallet size={20} />,
      label: "Средний чек:",
      children: (
        <p className="text-2xl font-black text-slate-900">
          {basicData?.averageCheck || 0}
          <span className="text-sm font-bold text-slate-400"> сом</span>
        </p>
      ),
      iconClassName: "text-emerald-600 bg-emerald-100",
      delay,
    },
    {
      icon: <MapPin size={20} />,
      label: "Адрес:",
      children: (
        <p className="font-semibold">
          {basicData?.address || "Адрес не указан"}
        </p>
      ),
      iconClassName: "bg-orange-50 text-orange-400 orange",
      delay,
    },
    // {
    //   icon: <Layers,
    //   label: "Этаж",
    //   children: <p className="font-semibold">1 этаж</p>,
    //   iconClassName: "bg-orange-50 text-orange-400 orange",
    // },
    {
      icon: <Star fill="currentColor" size={20} />,
      iconClassName: "text-amber-600 bg-amber-100",
      label: "Рейтинг",
      children: (
        <p className="text-2xl font-black text-slate-900">
          {basicData?.rating.toFixed(2)}
        </p>
      ),
      delay,
    },
    {
      icon: <Sofa size={20} />,
      label: "Кабины",
      children: (
        <p className="font-semibold">
          Есть <strong>VIP</strong>
        </p>
      ),
      iconClassName: "bg-brand-50 text-brand-400 orange",
      delay,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-8">
        <div className="flex items-center gap-2 mb-2">
          <LayoutGrid size={20} className={"text-orange-600"} />
          <h1 className="text-lg font-black text-slate-900">
            Детали заведения
          </h1>
        </div>
        {actions}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-y-4 gap-x-4">
        {details.map((detail, idx) => (
          <DetailItem key={idx} {...detail} />
        ))}
      </div>
    </div>
  );
};
