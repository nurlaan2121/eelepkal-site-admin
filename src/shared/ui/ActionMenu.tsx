import {AnimatePresence, motion} from "framer-motion";
import {MoreVertical} from "lucide-react";
import {useEffect, useRef, useState, type ReactNode} from "react";
import {tv} from "tailwind-variants";
import {Portal} from "./portal/Portal";
import {cn} from "@/shared/utils/cn";

const actionMenu = tv({
  slots: {
    trigger:
      "w-9 h-9 flex items-center justify-center rounded-xl transition-colors",
    triggerLight: "text-slate-400 hover:bg-slate-100 active:bg-slate-200",
    triggerDark: "text-white/60 hover:bg-white/10 active:bg-white/20",
    // menuContainer intentionally has no positioning classes - position is applied inline
    menuContainer:
      "z-[60] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden",
    menuContent: "p-1.5 space-y-0.5",
    menuItem:
      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left",
    menuItemDanger:
      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 transition-colors text-left disabled:opacity-50",
    divider: "border-t border-slate-100 my-1",
  },
  variants: {
    variant: {
      light: {trigger: "text-slate-400 hover:bg-slate-100 active:bg-slate-200"},
      dark: {trigger: "text-white/60 hover:bg-white/10 active:bg-white/20"},
    },
  },
  defaultVariants: {
    variant: "light",
  },
});

export interface ActionMenuItem {
  id: string;
  icon: ReactNode;
  label: string;
  color?: string;
  danger?: boolean;
  disabled?: boolean;
  onClick: () => void;
  divider?: boolean;
}

export const ActionMenu = ({
  items,
  className,
  variant = "light",
  triggerIcon,
  triggerClassName,
}: {
  items: ActionMenuItem[];
  className?: string;
  variant?: "light" | "dark";
  triggerIcon?: ReactNode;
  triggerClassName?: string;
}) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [coords, setCoords] = useState<{top: number; right: number} | null>(
    null,
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // compute position of the menu relative to viewport using trigger element
  useEffect(() => {
    const update = () => {
      const el = triggerRef.current;
      if (!el) return setCoords(null);
      const rect = el.getBoundingClientRect();
      // position menu so its right edge aligns with trigger's right edge
      setCoords({
        top: rect.bottom + window.scrollY,
        right: Math.max(8, window.innerWidth - rect.right),
      });
    };

    if (open) {
      update();
      window.addEventListener("resize", update);
      window.addEventListener("scroll", update, true);
    }

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open]);

  const styles = actionMenu();

  return (
    <div
      ref={menuRef}
      className="relative"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        ref={triggerRef}
        className={cn(
          styles.trigger(),
          variant === "dark" ? styles.triggerDark() : styles.triggerLight(),
          triggerClassName,
        )}
      >
        {triggerIcon || <MoreVertical size={16} />}
      </button>

      <Portal>
        <AnimatePresence>
          {open && coords && (
            <motion.div
              initial={{opacity: 0, scale: 0.95, y: -8}}
              animate={{opacity: 1, scale: 1, y: 0}}
              exit={{opacity: 0, scale: 0.95, y: -8}}
              transition={{duration: 0.12}}
              className={cn(styles.menuContainer(), className)}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "absolute",
                top: coords.top,
                right: coords.right,
              }}
            >
              <div className={styles.menuContent()}>
                {items.map((item, index) => (
                  <div key={item.id}>
                    {item.divider && index > 0 && (
                      <div className={styles.divider()} />
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpen(false);
                        item.onClick();
                      }}
                      disabled={item.disabled}
                      className={cn(
                        item.danger
                          ? styles.menuItemDanger()
                          : styles.menuItem(),
                        item.color,
                      )}
                    >
                      <span className={item.color}>{item.icon}</span>
                      <span
                        className={cn(
                          "text-sm font-bold",
                          item.danger ? "text-red-500" : "text-slate-700",
                        )}
                      >
                        {item.label}
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Portal>
    </div>
  );
};
