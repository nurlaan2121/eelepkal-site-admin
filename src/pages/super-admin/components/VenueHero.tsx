import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Maximize2, ChevronLeft, ChevronRight, X, Camera } from 'lucide-react';

interface VenueHeroProps {
    images: string[];
    onEdit?: () => void;
}

export const VenueHero: React.FC<VenueHeroProps> = ({ images, onEdit }) => {
    const [viewerOpen, setViewerOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);

    const safeImages = Array.isArray(images) && images.length > 0
        ? images
        : ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=800&fit=crop'];

    return (
        <section className="relative w-full overflow-hidden sm:rounded-[32px]">
            {/* Main Hero Image */}
            <div className="relative aspect-[4/3] sm:aspect-video w-full group cursor-zoom-in overflow-hidden">
                <motion.img
                    key={currentImage}
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 1 }}
                    src={safeImages[currentImage]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]"
                    alt="Hero"
                    onClick={() => setViewerOpen(true)}
                />

                {/* Floating Edit Button */}
                {onEdit && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(); }}
                        className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md text-slate-800 shadow-xl hover:bg-white hover:scale-110 active:scale-95 transition-all z-10 border border-white/50"
                    >
                        <Edit3 size={18} />
                    </button>
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
                {safeImages.map((img, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentImage(i)}
                        className={`relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 transition-all ${currentImage === i ? 'border-orange-500 scale-95 shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'
                            }`}
                    >
                        <img src={img} className="w-full h-full object-cover" alt="" />
                        {i === 3 && safeImages.length > 4 && currentImage !== 3 && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-black">
                                +{safeImages.length - 4}
                            </div>
                        )}
                    </button>
                ))}

                {safeImages.length < 4 && Array.from({ length: 4 - safeImages.length }).map((_, i) => (
                    <div key={`empty-${i}`} className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50 flex items-center justify-center text-slate-200">
                        <Camera size={24} />
                    </div>
                ))}
            </div>

            {/* Photo Viewer Modal */}
            <AnimatePresence>
                {viewerOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
                    >
                        <button
                            onClick={() => setViewerOpen(false)}
                            className="absolute top-10 right-10 w-14 h-14 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-xl transition-all"
                        >
                            <X size={28} />
                        </button>

                        <div className="relative max-w-6xl w-full aspect-[4/3] md:aspect-video rounded-[3rem] overflow-hidden shadow-2xl flex items-center justify-center">
                            <motion.img
                                key={currentImage}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                src={safeImages[currentImage]}
                                className="max-w-full max-h-full object-contain"
                                alt=""
                            />

                            <div className="absolute inset-y-0 left-6 flex items-center">
                                <button
                                    onClick={() => setCurrentImage(prev => (prev > 0 ? prev - 1 : safeImages.length - 1))}
                                    className="w-14 h-14 bg-white/10 hover:bg-white/20 text-white rounded-2xl flex items-center justify-center backdrop-blur-xl"
                                >
                                    <ChevronLeft size={28} />
                                </button>
                            </div>

                            <div className="absolute inset-y-0 right-6 flex items-center">
                                <button
                                    onClick={() => setCurrentImage(prev => (prev < safeImages.length - 1 ? prev + 1 : 0))}
                                    className="w-14 h-14 bg-white/10 hover:bg-white/20 text-white rounded-2xl flex items-center justify-center backdrop-blur-xl"
                                >
                                    <ChevronRight size={28} />
                                </button>
                            </div>

                            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-full text-white font-black text-xs uppercase tracking-widest border border-white/10">
                                {currentImage + 1} / {safeImages.length}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};
