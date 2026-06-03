import {AnimatePresence, motion} from "framer-motion";
import {useLockScreen} from "../../hooks/useLockScreen";
import {Portal} from "./portal/Portal";
import {ReactNode} from "react";

export const Sidebar = ({
  open,
  content,
  onClose,
}: {
  open: boolean;
  content: ReactNode;
  onClose: () => void;
}) => {
  useLockScreen(open);

  return (
    <Portal>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              onClick={onClose}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            {/* Drawer */}
            <motion.div
              initial={{x: "-100%"}}
              animate={{x: 0}}
              exit={{x: "-100%"}}
              transition={{type: "spring", damping: 25, stiffness: 200}}
              className="absolute left-0 top-0 bottom-0 w-64 bg-white"
            >
              {content}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Portal>
  );
};
