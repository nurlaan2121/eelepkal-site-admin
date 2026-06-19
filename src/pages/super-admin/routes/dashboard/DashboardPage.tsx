import React, {useEffect} from "react";
import {Users, Store, Calendar, TrendingUp} from "lucide-react";
import {AnalyticsCard} from "@/shared/ui";
import {updateSEO, PAGE_SEO} from "@/shared/utils/seo";
import {AttentionCard} from "./ui/AttentionCard";
import {NewRegistrationCard} from "./ui/NewRegistrationCard";
import {PageLayout} from "@/shared/layouts";

export const SuperAdminDashboard: React.FC = () => {
  // Prevent indexing of admin pages
  useEffect(() => {
    updateSEO(PAGE_SEO.superAdminDashboard);
  }, []);

  return (
    <PageLayout
      title="Панель управления"
      description="Глобальный мониторинг системы «Ээлеп кал»"
    >
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 px-1 md:px-0">
        <AnalyticsCard
          title="Заведения"
          value="124"
          change="12%"
          isPositive={true}
          icon={Store}
          color="brand"
        />
        <AnalyticsCard
          title="Брони"
          value="1,452"
          change="8%"
          isPositive={true}
          icon={Calendar}
          color="blue"
        />
        <AnalyticsCard
          title="Юзеры"
          value="8.4k"
          change="24%"
          isPositive={true}
          icon={Users}
          color="purple"
        />
        <AnalyticsCard
          title="Выручка"
          value="450k"
          change="5%"
          isPositive={false}
          icon={TrendingUp}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <NewRegistrationCard />
        <AttentionCard />
      </div>
    </PageLayout>
  );
};
