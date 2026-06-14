import {AnimatePresence, motion} from "framer-motion";
import {X} from "lucide-react";
import {type ReactNode, useEffect} from "react";
import {tv} from "tailwind-variants";
import {Portal} from "./portal/Portal";
import {useLockScreen} from "../hooks/useLockScreen";
import {cn} from "@/shared/utils/cn";
import {useCloseOnEscape} from "../hooks/useCloseOnEscape";

const modal = tv({
  slots: {
    backdrop:
      "fixed inset-0 flex items-center justify-center h-screen w-full bg-black/40 backdrop-blur-sm z-50",
    panel: "bg-white shadow-2xl overflow-hidden flex flex-col",
    header: "flex items-start justify-between p-6 border-b border-slate-100",
    titleGroup: "flex items-center gap-3",
    icon: "w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-primary",
    title: "text-xl font-black text-slate-900",
    closeButton:
      "w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 transition-colors",
    content: "p-6 space-y-6 overflow-y-auto flex-1",
  },
  variants: {
    isShaded: {
      true: {
        backdrop: "items-end md:items-center",
        panel:
          "md:max-w-xl w-full rounded-t-3xl md:rounded-3xl max-h-[100vh] md:max-h-[90vh]",
      },
      false: {
        backdrop: "items-center p-4",
        panel: "max-w-xl rounded-3xl",
      },
    },
  },
});

export const Modal = ({
  className,
  open,
  header,
  isShaded,
  children,
  footer,
  onClose,
}: {
  className?: string;
  open: boolean;
  header: {
    title: string;
    icon: ReactNode;
    description?: ReactNode;
    iconClassName?: string;
  };
  isShaded?: boolean;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
}) => {
  const styles = modal();
  useLockScreen(open);

  useCloseOnEscape(open, onClose);

  return (
    <Portal>
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              onClick={onClose}
              className={styles.backdrop({isShaded})}
            >
              {/* Modal */}
              <motion.div
                initial={{y: "100%", opacity: 0}}
                animate={{y: 0, opacity: 1}}
                exit={{y: "100%", opacity: 0}}
                transition={{
                  y: {
                    type: "spring",
                    damping: 32,
                    stiffness: 250,
                    bounce: 0,
                  },
                  opacity: {duration: 0.08},
                }}
                className={cn(styles.panel({isShaded}), className)}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className={styles.header()}>
                  <div className={styles.titleGroup()}>
                    <div className={cn(styles.icon(), header.iconClassName)}>
                      {header.icon}
                    </div>
                    <div>
                      <h2 className={styles.title()}>{header.title}</h2>
                      {header.description && (
                        <p className="text-xs text-slate-500 font-medium">
                          {header.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <button onClick={onClose} className={styles.closeButton()}>
                    <X size={20} />
                  </button>
                </div>

                {/* Content */}
                <div className={styles.content()}>{children}</div>
                {footer && (
                  <div className="border-t border-slate-100 p-6">{footer}</div>
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Portal>
  );
};
