import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Wallet, Camera } from 'lucide-react';

interface VenueHeroProps {
    images: string[];
    name: string;
    address: string;
    avgCheck?: number;
    rating?: number;
}

export const VenueHero: React.FC<VenueHeroProps> = ({ images, name, address, avgCheck, rating = 5 }) => {
    const mainImage = images[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=600&fit=crop';
    const subImages = images.slice(1, 4);

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 aspect-[21/9] md:aspect-auto">
            {/* Main Image */}
            <div className="md:col-span-3 relative rounded-[2rem] overflow-hidden group border border-slate-200 shadow-sm">
                <img
                    src={mainImage}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-3"
                    >
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-brand-primary text-black text-[10px] font-black uppercase rounded-full">
                                Premium Venue
                            </span>
                            <div className="flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-[10px] font-black">
                                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                                <span>{rating}.0</span>
                            </div>
                        </div>
                        <h2 className="text-4xl font-black text-white">{name}</h2>
                        <div className="flex items-center gap-4 text-white/80">
                            <div className="flex items-center gap-1.5 text-sm font-bold">
                                <MapPin size={16} className="text-brand-400" />
                                <span>{address}</span>
                            </div>
                            {avgCheck && (
                                <div className="flex items-center gap-1.5 text-sm font-bold">
                                    <Wallet size={16} className="text-emerald-400" />
                                    <span>~ {avgCheck} сом</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                <button className="absolute top-6 right-6 p-3 bg-white/20 backdrop-blur-md hover:bg-white/40 rounded-2xl text-white transition-all">
                    <Camera size={20} />
                </button>
            </div>

            {/* Sidebar Images */}
            <div className="hidden md:flex flex-col gap-4">
                {subImages.length > 0 ? subImages.map((img, i) => (
                    <div key={i} className="flex-1 relative rounded-3xl overflow-hidden border border-slate-200">
                        <img src={img} alt="" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                    </div>
                )) : (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex-1 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-300">
                            <Camera size={24} />
                        </div>
                    ))
                )}
                {images.length > 4 && (
                    <div className="absolute bottom-6 right-6 md:static">
                        <button className="w-full h-12 bg-white rounded-2xl border border-slate-200 text-slate-900 font-bold text-sm hover:bg-slate-50 transition-colors shadow-sm">
                            +{images.length - 4} фото
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
