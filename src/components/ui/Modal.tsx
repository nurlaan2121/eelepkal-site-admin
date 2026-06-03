import {AnimatePresence, motion} from "framer-motion";
import {X} from "lucide-react";
import {useEffect, useState, type ReactNode} from "react";
import {createPortal} from "react-dom";
import {tv} from "tailwind-variants";
import {useLockScreen} from "../../hooks/useLockScreen";
import {Portal} from "./portal/Portal";

const modal = tv({
  slots: {
    backdrop:
      "fixed inset-0 flex items-center justify-center h-screen w-full bg-black/40 backdrop-blur-sm z-50 p-4",
    panel: "bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden",
    header: "flex items-center justify-between p-6 border-b border-slate-100",
    titleGroup: "flex items-center gap-3",
    icon: "w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center",
    title: "text-lg font-black text-slate-900",
    closeButton:
      "w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 transition-colors",
    content: "p-6 space-y-4",
  },
});

export const Modal = ({
  open,
  header,
  content,
  onClose,
}: {
  open: boolean;
  header: {title: string; icon: ReactNode; description?: string};
  content: ReactNode;
  onClose: () => void;
}) => {
  const styles = modal();
  useLockScreen(open);

  return (
    <Portal>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            onClick={onClose}
            className={styles.backdrop()}
          >
            {/* Modal */}
            <motion.div
              initial={{opacity: 0, scale: 0.95, y: 20}}
              animate={{opacity: 1, scale: 1, y: 0}}
              exit={{opacity: 0, scale: 0.95, y: 20}}
              className={styles.panel()}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={styles.header()}>
                <div className={styles.titleGroup()}>
                  <div className={styles.icon()}>{header.icon}</div>
                  <div>
                    <h2 className={styles.title()}>{header.title}</h2>
                    {header.description && (
                      <p className="text-xs text-slate-400 font-medium">
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
              <div className={styles.content()}>{content}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
};
