import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Star, Wallet, Camera, Maximize2, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface VenueHeroProps {
    images: string[];
    name: string;
    address: string;
    avgCheck?: number;
    rating?: number;
    isTodayOpen?: boolean;
    todayHours?: string;
}

export const VenueHero: React.FC<VenueHeroProps> = ({
    images, name, address, avgCheck, rating = 5,
    isTodayOpen = true,
    todayHours = "09:00 - 23:00"
}) => {
    const [viewerOpen, setViewerOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);

    const safeImages = Array.isArray(images) && images.length > 0
        ? images
        : ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=600&fit=crop'];

    const displayImages = safeImages.slice(0, 5);

    return (
        <section className="space-y-6">
            {/* Gallery Grid (Bento) */}
            <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[500px] md:h-[600px]">
                {/* Main Image */}
                <div
                    className="md:col-span-2 md:row-span-2 relative rounded-[3rem] overflow-hidden group cursor-zoom-in border border-slate-100 shadow-xl"
                    onClick={() => { setViewerOpen(true); setCurrentImage(0); }}
                >
                    <img
                        src={safeImages[0]}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent p-10 flex flex-col justify-end">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-3">
                                <div className="px-4 py-1.5 bg-brand-primary rounded-full text-black text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-primary/20">
                                    Premium
                                </div>
                                <div className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-white text-[10px] font-black flex items-center gap-1.5">
                                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                                    <span>{rating}.0</span>
                                </div>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight drop-shadow-lg">
                                {name}
                            </h1>
                        </motion.div>
                    </div>
                </div>

                {/* Sub Images Grid */}
                {displayImages.slice(1).map((img, i) => (
                    <div
                        key={i}
                        className="relative rounded-[2.5rem] overflow-hidden group cursor-zoom-in border border-slate-100 shadow-sm"
                        onClick={() => { setViewerOpen(true); setCurrentImage(i + 1); }}
                    >
                        <img
                            src={img}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                        {i === 3 && safeImages.length > 5 && (
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center text-white flex-col gap-1">
                                <span className="text-2xl font-black">+{safeImages.length - 5}</span>
                                <span className="text-[10px] font-black uppercase tracking-widest">фотографий</span>
                            </div>
                        )}
                    </div>
                ))}

                {/* Empty placeholders if needed */}
                {displayImages.length < 5 && Array.from({ length: 5 - displayImages.length }).map((_, i) => (
                    <div key={`empty-${i}`} className="bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-100 flex items-center justify-center text-slate-300">
                        <Camera size={32} opacity={0.3} />
                    </div>
                ))}
            </div>

            {/* Quick Info Bar */}
            <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden relative">
                <div className="flex flex-wrap items-center gap-8 pl-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600">
                            <MapPin size={22} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">Расположение</p>
                            <p className="font-black text-slate-900 line-clamp-1">{address || 'Адрес не указан'}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <Wallet size={22} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">Средний чек</p>
                            <p className="font-black text-slate-900">{avgCheck ? `${avgCheck} сом` : '—'}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isTodayOpen ? 'bg-orange-50 text-orange-600' : 'bg-slate-50 text-slate-400'}`}>
                            <Star size={22} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">Сегодня работает</p>
                            <p className="font-black text-slate-900 flex items-center gap-2">
                                {isTodayOpen ? todayHours : 'Выходной'}
                                {isTodayOpen && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 pr-4">
                    <button className="h-14 px-8 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-900/10">
                        Связаться
                    </button>
                    <button
                        onClick={() => setViewerOpen(true)}
                        className="w-14 h-14 bg-white border border-slate-200 text-slate-600 rounded-2xl flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <Maximize2 size={20} />
                    </button>
                </div>
            </div>

            {/* Photo Viewer Modal (Simplified Concept) */}
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

                        <div className="relative max-w-6xl w-full aspect-video rounded-[3rem] overflow-hidden shadow-2xl">
                            <img
                                src={safeImages[currentImage]}
                                className="w-full h-full object-contain"
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
