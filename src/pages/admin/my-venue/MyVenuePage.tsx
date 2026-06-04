import React, { useState } from 'react';
import { useQueries, useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import {
    MapPin, Phone, Mail, Globe, Instagram, MessageCircle,
    Facebook, Clock, Star, Wallet, Users, Utensils,
    User, Building2, AlertCircle, Layers, MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';
import { adminVenueService, AdminVenueBasic, AdminVenueDetails, AdminVenueWorkingHours, AdminVenueAmenities, AdminVenueContacts, AdminVenuePublicAdmin, AdminVenueFeedback } from '@/api/admin/adminVenueService';
import { Button } from '@/components/ui/Button';


// ─────────── Skeleton Loader ───────────
const VenueSkeleton: React.FC = () => (
    <div className="space-y-6 animate-pulse">
        {/* Hero skeleton */}
        <div className="h-64 bg-slate-100 rounded-3xl" />
        
        {/* Info cards skeleton */}
        <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 bg-slate-100 rounded-2xl" />
            ))}
        </div>
        
        {/* Details skeleton */}
        <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-32 bg-slate-100 rounded-2xl" />
            ))}
        </div>
    </div>
);

// ─────────── Main Page ───────────
export const AdminMyVenuePage: React.FC = () => {
    const [deletedFeedbackIds, setDeletedFeedbackIds] = useState<Set<number>>(new Set());
    const { ref, inView } = useInView({ threshold: 0.1 });

    const results = useQueries({
        queries: [
            { queryKey: ['admin-venue-basic'], queryFn: adminVenueService.getBasic },
            { queryKey: ['admin-venue-details'], queryFn: adminVenueService.getDetails },
            { queryKey: ['admin-venue-hours'], queryFn: adminVenueService.getHours },
            { queryKey: ['admin-venue-amenities'], queryFn: adminVenueService.getAmenities },
            { queryKey: ['admin-venue-contacts'], queryFn: adminVenueService.getContacts },
            { queryKey: ['admin-venue-public-admin'], queryFn: adminVenueService.getPublicAdmin },
            { queryKey: ['admin-venue-description'], queryFn: adminVenueService.getDescription },
        ],
    });

    const [basic, details, hours, amenities, contacts, publicAdmin, description] = results;
    const isLoading = results.some(r => r.isLoading);
    const isError = results.some(r => r.isError);

    const basicData = basic.data as AdminVenueBasic | undefined;
    const venueId = basicData?.venueId;

    const {
        data: feedbacksData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: isLoadingFeedbacks
    } = useInfiniteQuery({
        queryKey: ['admin-venue-feedbacks', venueId],
        queryFn: ({ pageParam = 0 }) => adminVenueService.getFeedbacks(venueId!, pageParam, 12),
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === 12 ? allPages.length * 12 : undefined;
        },
        initialPageParam: 0,
        enabled: !!venueId,
    });

    const allFeedbacks = feedbacksData?.pages.flatMap((page) => page || []) || [];
    const visibleFeedbacks = allFeedbacks.filter((f) => !deletedFeedbackIds.has(f.id));

    React.useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);

    if (isLoading) {
        return <VenueSkeleton />;
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 px-6">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 shadow-xl shadow-red-500/10">
                    <AlertCircle size={32} />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Ошибка загрузки</h2>
                    <p className="text-slate-500 font-medium">Не удалось получить данные о заведении</p>
                </div>
                <Button variant="outline" className="h-12 px-6 rounded-2xl font-black">
                    Обновить страницу
                </Button>
            </div>
        );
    }

    const basicDataSafe = basicData!;
    const detailsData = details.data as AdminVenueDetails;
    const hoursData = hours.data as AdminVenueWorkingHours;
    const amenitiesData = amenities.data as AdminVenueAmenities;
    const contactsData = contacts.data as AdminVenueContacts;
    const publicAdminData = publicAdmin.data as AdminVenuePublicAdmin;
    const descriptionText = (description.data as string) || '';

    const images = Object.values(basicDataSafe.images) as string[];
    const mainImage = images[0] || '';
    const amenitiesList = Object.entries(amenitiesData) as [string, string][];
    const capacitiesList = Object.entries(detailsData.capacities) as [string, number][];

    const formatHours = (hours: AdminVenueWorkingHours) => {
        return Object.entries(hours).map(([day, time]) => ({
            day: day.charAt(0) + day.slice(1).toLowerCase(),
            time,
            isDayOff: time === 'Выходной'
        }));
    };

    const formattedHours = formatHours(hoursData);

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Моё заведение</h1>
                    <p className="text-slate-400 text-sm mt-0.5">Управление информацией о заведении</p>
                </div>
            </div>

            {/* Hero Image */}
            {mainImage && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative h-64 md:h-80 rounded-3xl overflow-hidden shadow-2xl shadow-brand-100"
                >
                    <img
                        src={mainImage}
                        alt={basicDataSafe.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h2 className="text-3xl md:text-4xl font-black mb-2">{basicDataSafe.name}</h2>
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1.5 text-sm font-bold bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl">
                                <Star size={16} fill="currentColor" className="text-amber-400" />
                                {basicDataSafe.rating.toFixed(1)}
                            </span>
                            <span className="flex items-center gap-1.5 text-sm font-bold bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl">
                                <Wallet size={16} />
                                ≈ {basicDataSafe.averageCheck} сом
                            </span>
                            <span className="flex items-center gap-1.5 text-sm font-bold bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl">
                                <Clock size={16} />
                                {basicDataSafe.todayWorkingHours}
                            </span>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Quick Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Address */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                >
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center flex-shrink-0">
                            <MapPin size={20} className="text-brand-600" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Адрес</p>
                            <p className="text-sm font-bold text-slate-900">{basicDataSafe.address}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Admin */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                >
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <User size={20} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Администратор</p>
                            <p className="text-sm font-black text-slate-900">{publicAdminData.fullName}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{publicAdminData.phoneNumber}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Rating */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                >
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                            <Star size={20} className="text-amber-600" fill="currentColor" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Рейтинг</p>
                            <p className="text-2xl font-black text-slate-900">{basicDataSafe.rating.toFixed(2)}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Average Check */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                >
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <Wallet size={20} className="text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Средний чек</p>
                            <p className="text-2xl font-black text-slate-900">{basicDataSafe.averageCheck} <span className="text-sm font-bold text-slate-400">сом</span></p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Description */}
            {descriptionText && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Building2 size={20} className="text-brand-600" />
                        <h3 className="text-lg font-black text-slate-900">О заведении</h3>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{descriptionText}</p>
                </motion.div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Working Hours */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Clock size={20} className="text-brand-600" />
                        <h3 className="text-lg font-black text-slate-900">Часы работы</h3>
                    </div>
                    <div className="space-y-2">
                        {formattedHours.map(({ day, time, isDayOff }) => (
                            <div
                                key={day}
                                className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-slate-50 transition-colors"
                            >
                                <span className="text-sm font-bold text-slate-700 capitalize">{day}</span>
                                <span className={`text-sm font-black ${isDayOff ? 'text-red-500' : 'text-slate-900'}`}>
                                    {time}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Capacities & Cuisines */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6"
                >
                    {/* Capacities */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Users size={20} className="text-brand-600" />
                            <h3 className="text-lg font-black text-slate-900">Вместимость</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {capacitiesList.map(([title, value]) => (
                                <div
                                    key={title}
                                    className="bg-gradient-to-br from-brand-50 to-white rounded-xl p-4 border border-brand-100"
                                >
                                    <p className="text-xs font-bold text-slate-500 mb-1">{title}</p>
                                    <p className="text-2xl font-black text-brand-700">{String(value)} <span className="text-sm font-bold text-slate-400">мест</span></p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Cuisines */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Utensils size={20} className="text-brand-600" />
                            <h3 className="text-lg font-black text-slate-900">Тип кухни</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {detailsData.typesOfCuisines.split(', ').map((cuisine: string) => (
                                <span
                                    key={cuisine}
                                    className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-sm font-bold border border-orange-200"
                                >
                                    {cuisine}
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Amenities */}
            {amenitiesList.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Layers size={20} className="text-brand-600" />
                        <h3 className="text-lg font-black text-slate-900">Удобства</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {amenitiesList.map(([id, name]) => (
                            <div
                                key={id}
                                className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-slate-50 to-transparent rounded-xl border border-slate-100 hover:border-brand-200 hover:from-brand-50 transition-all"
                            >
                                <div className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0" />
                                <span className="text-sm font-bold text-slate-700">{String(name)}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Contacts */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
            >
                <div className="flex items-center gap-2 mb-4">
                    <Phone size={20} className="text-brand-600" />
                    <h3 className="text-lg font-black text-slate-900">Контакты</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Phone */}
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                            <Phone size={18} className="text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Телефон</p>
                            <p className="text-sm font-black text-slate-900">{contactsData['phone number']}</p>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Mail size={18} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email</p>
                            <p className="text-sm font-bold text-slate-900">{contactsData.email}</p>
                        </div>
                    </div>

                    {/* Instagram */}
                    {contactsData.instagram && (
                        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                <Instagram size={18} className="text-white" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Instagram</p>
                                <p className="text-sm font-bold text-slate-900">{contactsData.instagram}</p>
                            </div>
                        </div>
                    )}

                    {/* Telegram */}
                    {contactsData.telegram && (
                        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                            <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                                <MessageCircle size={18} className="text-white" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Telegram</p>
                                <p className="text-sm font-bold text-slate-900">{contactsData.telegram}</p>
                            </div>
                        </div>
                    )}

                    {/* WhatsApp */}
                    {contactsData.whatsapp && (
                        <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                            <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                                <MessageCircle size={18} className="text-white" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">WhatsApp</p>
                                <p className="text-sm font-bold text-slate-900">{contactsData.whatsapp}</p>
                            </div>
                        </div>
                    )}

                    {/* Facebook */}
                    {contactsData.facebook && (
                        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                                <Facebook size={18} className="text-white" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Facebook</p>
                                <p className="text-sm font-bold text-slate-900">{contactsData.facebook}</p>
                            </div>
                        </div>
                    )}

                    {/* Website */}
                    {contactsData.website && (
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                            <div className="w-10 h-10 rounded-lg bg-slate-600 flex items-center justify-center">
                                <Globe size={18} className="text-white" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Сайт</p>
                                <p className="text-sm font-bold text-slate-900">{contactsData.website}</p>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Image Gallery */}
            {images.length > 1 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                    className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Building2 size={20} className="text-brand-600" />
                        <h3 className="text-lg font-black text-slate-900">Фотогалерея</h3>
                        <span className="ml-auto text-sm font-bold text-slate-400">{images.length} фото</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {images.slice(1).map((img, index) => (
                            <div
                                key={index}
                                className="aspect-square rounded-xl overflow-hidden bg-slate-100 hover:shadow-lg transition-shadow cursor-pointer group"
                            >
                                <img
                                    src={img}
                                    alt={`Фото ${index + 2}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Feedbacks Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
            >
                <div className="flex items-center gap-2 mb-6">
                    <MessageSquare size={20} className="text-brand-600" />
                    <h3 className="text-lg font-black text-slate-900">Отзывы клиентов</h3>
                    <span className="ml-auto text-sm font-bold text-slate-400">{visibleFeedbacks.length} отзывов</span>
                </div>

                {isLoadingFeedbacks ? (
                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="p-4 bg-slate-50 rounded-xl animate-pulse">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-slate-200 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-slate-200 rounded w-1/3" />
                                        <div className="h-3 bg-slate-200 rounded w-1/4" />
                                        <div className="h-3 bg-slate-200 rounded w-full mt-3" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : visibleFeedbacks.length === 0 ? (
                    <div className="text-center py-12">
                        <MessageSquare size={48} className="text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-400 font-bold">Отзывов пока нет</p>
                        <p className="text-xs text-slate-300 mt-1">Отзывы клиентов появятся здесь</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {visibleFeedbacks.map((feedback: AdminVenueFeedback) => (
                            <div
                                key={feedback.id}
                                className="p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-100 hover:border-brand-200 transition-colors"
                            >
                                <div className="flex items-start gap-3">
                                    {/* Client Avatar */}
                                    <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                                        {feedback.client.image ? (
                                            <img 
                                                src={feedback.client.image} 
                                                alt={feedback.client.fullName || 'Клиент'}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            <User size={18} className="text-brand-600" />
                                        )}
                                    </div>

                                    {/* Feedback Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-sm font-black text-slate-900">
                                                {feedback.client.fullName || 'Анонимный клиент'}
                                            </p>
                                            <span className="text-xs text-slate-400">{feedback.createdAt}</span>
                                        </div>
                                        
                                        {/* Rating Stars */}
                                        <div className="flex items-center gap-0.5 mb-2">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={14}
                                                    className={i < feedback.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}
                                                />
                                            ))}
                                        </div>

                                        {/* Feedback Text */}
                                        <p className="text-sm text-slate-700 leading-relaxed">{feedback.text}</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Infinite Scroll Sentinel */}
                        <div ref={ref} className="py-6 flex justify-center">
                            {isFetchingNextPage && (
                                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                                    <div className="w-4 h-4 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
                                    Загрузка...
                                </div>
                            )}
                            {!hasNextPage && visibleFeedbacks.length > 0 && (
                                <p className="text-slate-200 text-xs font-bold uppercase tracking-widest">Все отзывы загружены</p>
                            )}
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};
