import React, {useEffect} from "react";
import {LayoutGrid, Calendar, Wallet, Star} from "lucide-react";
import {AnalyticsCard} from "@/shared/ui";
import {updateSEO, PAGE_SEO} from "@/shared/utils/seo";
import {UpcomingBookings} from "./ui/UpcomingBookings";
import {Reviews} from "./ui/ReviewsCard";

export const AdminDashboard: React.FC = () => {
  // Prevent indexing of admin pages
  useEffect(() => {
    updateSEO(PAGE_SEO.adminDashboard);
  }, []);

  return (
    <div className="space-y-6 md:space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-3 px-1 md:px-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            Дашборд
          </h1>
          <p className="text-gray-500 text-sm md:text-base font-medium">
            Сводка на {new Date().toLocaleDateString("ru-RU")}
          </p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-100 text-brand-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-brand-200 shadow-sm shadow-brand-50">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
            Открыто
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 px-1 md:px-0">
        <AnalyticsCard
          title="Брони"
          value="24"
          change="+5"
          isPositive={true}
          icon={Calendar}
          color="brand"
        />
        <AnalyticsCard
          title="Столы"
          value="8 / 15"
          icon={LayoutGrid}
          color="blue"
        />
        <AnalyticsCard
          title="Выручка"
          value="12.4k"
          change="15%"
          isPositive={true}
          icon={Wallet}
          color="amber"
        />
        <AnalyticsCard
          title="Ср. чек"
          value="1.2k"
          icon={Star}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Bookings */}
        <UpcomingBookings />

        {/* Quick Review */}
        <Reviews />
      </div>
    </div>
  );
};
