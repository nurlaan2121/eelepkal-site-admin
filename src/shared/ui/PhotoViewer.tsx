import {AnimatePresence, motion} from "framer-motion";
import {ChevronLeft, ChevronRight, X} from "lucide-react";
import {useEffect} from "react";
import {useCloseOnEscape} from "../hooks/useCloseOnEscape";

export const PhotoViewer = ({
  open,
  onClose,
  currentIndex,
  totalLength,
  currentImage,
  onNext,
  onPrevious,
}: {
  open: boolean;
  onClose: () => void;
  totalLength: number;
  currentImage: string;
  currentIndex: number;
  onNext: () => void;
  onPrevious: () => void;
}) => {
  useCloseOnEscape(open, onClose);

  useEffect(() => {
    if (!open) return;

    const handleArrowKeys = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        onNext();
      } else if (e.key === "ArrowLeft") {
        onPrevious();
      }
    };

    document.addEventListener("keydown", handleArrowKeys);
    return () => document.removeEventListener("keydown", handleArrowKeys);
  }, [open, onNext, onPrevious]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
        >
          <button
            onClick={onClose}
            className="absolute top-10 right-10 w-14 h-14 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-xl transition-all"
          >
            <X size={28} />
          </button>

          <div className="relative max-w-6xl w-full aspect-[4/3] md:aspect-video rounded-[3rem] overflow-hidden shadow-2xl flex items-center justify-center">
            <motion.img
              key={currentImage}
              initial={{opacity: 0, scale: 0.95}}
              animate={{opacity: 1, scale: 1}}
              src={currentImage}
              className="max-w-full max-h-full object-contain"
              alt=""
            />

            <div className="absolute inset-y-0 left-6 flex items-center">
              <button
                onClick={onPrevious}
                className="w-14 h-14 bg-white/10 hover:bg-white/20 text-white rounded-2xl flex items-center justify-center backdrop-blur-xl"
              >
                <ChevronLeft size={28} />
              </button>
            </div>

            <div className="absolute inset-y-0 right-6 flex items-center">
              <button
                onClick={onNext}
                className="w-14 h-14 bg-white/10 hover:bg-white/20 text-white rounded-2xl flex items-center justify-center backdrop-blur-xl"
              >
                <ChevronRight size={28} />
              </button>
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-full text-white font-black text-xs uppercase tracking-widest border border-white/10">
              {currentIndex + 1} / {totalLength}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
