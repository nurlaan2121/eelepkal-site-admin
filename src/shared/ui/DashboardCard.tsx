import {cn} from "@/shared/utils/cn";
import {type ReactNode} from "react";
import {tv} from "tailwind-variants";

const dashboardCard = tv({
  slots: {
    root: "bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden",
    header:
      "h-[74px] p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/30",
    title: "font-black text-gray-900 uppercase text-xs tracking-widest",
    action:
      "font-black uppercase tracking-widest text-brand-600 hover:text-brand-700",
    content: "",
  },
});

export const DashboardCard = ({
  className,
  title,
  children,
  action,
}: {
  className?: string;
  title: string;
  children: ReactNode;
  action?: string;
}) => {
  const styles = dashboardCard();

  return (
    <div className={cn(styles.root(), className)}>
      <div className={styles.header()}>
        <h3 className={styles.title()}>{title}</h3>
        {action && <button className={styles.action()}>{action}</button>}
      </div>
      <div className={styles.content()}>{children}</div>
    </div>
  );
};
