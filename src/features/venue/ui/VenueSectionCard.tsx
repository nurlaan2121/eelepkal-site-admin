import {type ReactNode} from "react";
import {motion, type HTMLMotionProps} from "framer-motion";
import {type LucideIcon} from "lucide-react";
import {tv} from "tailwind-variants";
import {cn} from "@/shared/utils/cn";

const venueSectionCard = tv({
  slots: {
    root: "bg-white rounded-3xl p-6 border border-slate-100 shadow-sm transition-shadow",
    header: "flex justify-between items-center pb-4",
    titleGroup: "flex items-center gap-2",
    icon: "text-brand-600",
    title: "text-lg font-black text-slate-900",
  },
  variants: {
    variant: {
      brand: {
        icon: "text-brand-600",
      },
      orange: {
        icon: "text-orange-600",
      },
    },
  },
  defaultVariants: {
    variant: "brand",
  },
});

type SectionCardProps = HTMLMotionProps<"div"> & {
  title?: string;
  icon?: LucideIcon;
  iconClassName?: string;
  variant?: "brand" | "orange";
  actions?: ReactNode;
  children: ReactNode;
};

export const VenueSectionCard = ({
  title,
  icon: Icon,
  iconClassName,
  variant,
  actions,
  className,
  children,
  ...props
}: SectionCardProps) => {
  const styles = venueSectionCard({variant});

  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      className={cn(styles.root(), className)}
      {...props}
    >
      {title && (
        <div className={styles.header()}>
          <div className={styles.titleGroup()}>
            {Icon && (
              <Icon size={20} className={cn(styles.icon(), iconClassName)} />
            )}
            <h3 className={styles.title()}>{title}</h3>
          </div>
          {actions && actions}
        </div>
      )}
      {children}
    </motion.div>
  );
};

export interface InitialSecitonCardProps {
  className?: string;
  variant?: "brand" | "orange";
  actions?: ReactNode;
  delay: number;
}
