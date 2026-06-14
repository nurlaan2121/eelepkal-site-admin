import React, {useState, useRef} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X,
  Camera,
  Trash2,
  Plus,
  Loader2,
} from "lucide-react";
import {PhotoViewer} from "@/shared/ui";

interface VenueHeroProps {
  images: {id: number; url: string}[];
  onDeleteImage?: (id: number) => void;
  onAddImage?: (file: File) => void;
  isProcessing?: boolean;
}

export const VenueHero = ({
  images,
  onDeleteImage,
  onAddImage,
  isProcessing = false,
}: VenueHeroProps) => {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const safeImages =
    Array.isArray(images) && images.length > 0
      ? images
      : [
          {
            id: 0,
            url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=800&fit=crop",
          },
        ];

  const currentImage = safeImages[currentImageIdx] || safeImages[0];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onAddImage) {
      onAddImage(file);
    }
  };

  return (
    <section className="relative w-full overflow-hidden rounded-2xl sm:rounded-[32px]">
      {/* Main Hero Image */}
      <div className="relative aspect-[4/3] sm:aspect-video w-full group cursor-zoom-in overflow-hidden bg-slate-100">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImage.url}
            initial={{opacity: 0.8}}
            animate={{opacity: 1}}
            src={currentImage.url}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]"
            alt="Главное изображение"
            onClick={() => setViewerOpen(true)}
          />
        </AnimatePresence>

        {/* Delete Button for current image */}
        {onDeleteImage && currentImage.id !== 0 && !isProcessing && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm("Удалить эту фотографию?")) {
                onDeleteImage(currentImage.id);
                if (currentImageIdx > 0) setCurrentImageIdx((prev) => prev - 1);
              }
            }}
            className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-rose-500 text-white shadow-xl hover:bg-rose-600 hover:scale-110 active:scale-95 transition-all z-10 border border-white/20"
            title="Удалить это фото"
          >
            <Trash2 size={18} />
          </button>
        )}

        {isProcessing && (
          <div className="absolute inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-20">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
          </div>
        )}

        {/* Bottom Overlay Info */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6 md:p-10">
          <button
            onClick={() => setViewerOpen(true)}
            className="bg-black/20 hover:bg-black/40 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all flex items-center gap-2"
          >
            <Maximize2 size={12} />
            Развернуть галерею
          </button>
        </div>
      </div>

      {/* Thumbnail Gallery (Horizontal Scroll) */}
      <div className="bg-white p-4 sm:p-6 overflow-x-auto no-scrollbar flex items-center gap-4">
        {/* Add Photo Button */}
        {onAddImage && (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-1 text-slate-400 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={24} />
            <span className="text-[10px] font-black uppercase tracking-wider">
              Добавить
            </span>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </button>
        )}

        {safeImages.map((img, i) => (
          <button
            key={img.id || i}
            onClick={() => setCurrentImageIdx(i)}
            className={`relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 transition-all ${
              currentImageIdx === i
                ? "border-orange-500 scale-95 shadow-lg"
                : "border-transparent opacity-70 hover:opacity-100"
            }`}
          >
            <img src={img.url} className="w-full h-full object-cover" alt="" />
          </button>
        ))}

        {safeImages.length === 0 &&
          Array.from({length: 3}).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50 flex items-center justify-center text-slate-200"
            >
              <Camera size={24} />
            </div>
          ))}
      </div>

      <PhotoViewer
        open={viewerOpen}
        totalLength={safeImages.length}
        currentImage={currentImage.url}
        currentIndex={currentImageIdx}
        onClose={() => setViewerOpen(false)}
        onPrevious={() =>
          setCurrentImageIdx((prev) =>
            prev > 0 ? prev - 1 : safeImages.length - 1,
          )
        }
        onNext={() =>
          setCurrentImageIdx((prev) =>
            prev < safeImages.length - 1 ? prev + 1 : 0,
          )
        }
      />
    </section>
  );
};
