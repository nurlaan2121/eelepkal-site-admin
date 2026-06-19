import {DashboardCard} from "@/shared/ui";
import {ArrowUpRight} from "lucide-react";

export const NewRegistrationCard = () => {
  return (
    <DashboardCard
      className="lg:col-span-2"
      title="Новые регистрации"
      action="Все"
    >
      <div className="divide-y divide-gray-50">
        {[1, 2, 3, 4, 5].map((i) => (
          <NewUserCard key={i} i={i} />
        ))}
      </div>
    </DashboardCard>
  );
};

const NewUserCard = ({i}: {i: number}) => {
  return (
    <div className="p-5 hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 font-black uppercase text-sm">
          R{i}
        </div>
        <div>
          <p className="text-sm font-black text-gray-900">
            Ресторан «Ала-Тоо {i}»
          </p>
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tight">
            Бишкек • {i * 10} мин назад
          </p>
        </div>
      </div>
      <ArrowUpRight className="text-brand-500" size={20} />
    </div>
  );
};
