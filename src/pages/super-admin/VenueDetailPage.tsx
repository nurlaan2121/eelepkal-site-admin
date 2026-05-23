import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueries, useQueryClient } from '@tanstack/react-query';
import {
    ChevronLeft, Edit3, MapPin, Phone, Mail,
    Globe, Instagram, MessageCircle, Send, Facebook,
    Clock, UtensilsCrossed, ConciergeBell, FileText,
    UserCog, CreditCard, Star, Users, Wallet,
    Calendar, CheckCircle2, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { superAdminVenueService } from '../../api/venue/superAdminVenueService';
import { Button } from '../../components/ui/Button';
import {
    BasicInfoData,
    VenueDetailsData,
    VenueWorkingHours,
    VenueContactData,
    VenueConditionsData
} from '../../types/venue';
import { VenueHero } from './components/VenueHero';
import { VenueInfoCard } from './components/VenueInfoCard';
import { VenueSkeleton } from './components/VenueSkeletons';

export const VenueDetailPage: React.FC = () => {
    const { venueId } = useParams<{ venueId: string }>();
    const navigate = useNavigate();
    const id = Number(venueId);

    // Parallel fetch for all 7 stages
    const results = useQueries({
        queries: [
            { queryKey: ['venue-basic', id], queryFn: () => superAdminVenueService.getBasicInfo(id) },
            { queryKey: ['venue-details', id], queryFn: () => superAdminVenueService.getVenueDetails(id) },
            { queryKey: ['venue-hours', id], queryFn: () => superAdminVenueService.getVenueHours(id) },
            { queryKey: ['venue-cuisines', id], queryFn: () => superAdminVenueService.getVenueCuisines(id) },
            { queryKey: ['venue-amenities', id], queryFn: () => superAdminVenueService.getVenueAmenities(id) },
            { queryKey: ['venue-contacts', id], queryFn: () => superAdminVenueService.getVenueContacts(id) },
            { queryKey: ['venue-conditions', id], queryFn: () => superAdminVenueService.getVenueConditions(id) },
            { queryKey: ['all-cuisines'], queryFn: () => superAdminVenueService.getAllCuisines() },
            { queryKey: ['all-amenities'], queryFn: () => superAdminVenueService.getAllAmenities() },
        ],
    });

    const [
        basic, details, hours, cuisines, amenities, contacts, conditions, allCuisines, allAmenities
    ] = results;

    const isLoading = results.some(r => r.isLoading);
    const isError = results.some(r => r.isError);

    if (isLoading) return <VenueSkeleton />;

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                    <AlertCircle size={32} />
                </div>
                <div>
                    <h2 className="text-xl font-black text-slate-900">Ошибка при загрузке</h2>
                    <p className="text-slate-500">Не удалось загрузить данные заведения</p>
                </div>
                <Button onClick={() => navigate('/super-admin/venues')} variant="ghost">
                    Вернуться к списку
                </Button>
            </div>
        );
    }

    const basicData = basic.data as BasicInfoData;
    const detailsData = details.data as VenueDetailsData;
    const hoursData = hours.data as VenueWorkingHours;
    const cuisinesData = cuisines.data as number[];
    const amenitiesData = amenities.data as number[];
    const contactsData = contacts.data as VenueContactData;
    const conditionsData = conditions.data as VenueConditionsData;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="pb-20"
        >
            {/* Sticky Header */}
            <div className="sticky top-0 z-30 bg-slate-50/80 backdrop-blur-md border-b border-slate-200 -mx-4 px-4 py-3 mb-6">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/super-admin/venues')}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-lg font-black text-slate-900 leading-tight truncate max-w-[200px] md:max-w-md">
                                {basicData?.nameVenue || 'Детали заведения'}
                            </h1>
                            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                                <span>ID: {id}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                <span className="text-brand-600">Super Admin View</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" className="h-10 px-4 hidden md:flex items-center gap-2 text-slate-600">
                            <CreditCard size={18} />
                            <span>Реквизиты</span>
                        </Button>
                        <Button className="h-10 px-4 flex items-center gap-2">
                            <CheckCircle2 size={18} />
                            <span>Активно</span>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Hero Section */}
                <VenueHero
                    images={basicData?.imageUrls || []}
                    name={basicData?.nameVenue}
                    address={detailsData?.address}
                    avgCheck={detailsData?.averageCheck}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Info Cards */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Info & Description */}
                        <VenueInfoCard
                            title="Описание и основная информация"
                            icon={<FileText className="text-blue-500" />}
                            onEdit={() => console.log('Edit basic')}
                        >
                            <div className="prose prose-slate max-w-none">
                                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                                    {basicData?.description || 'Описание отсутствует'}
                                </p>
                            </div>
                        </VenueInfoCard>

                        {/* Amenities & Cuisines */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <VenueInfoCard
                                title="Кухни"
                                icon={<UtensilsCrossed className="text-orange-500" />}
                                onEdit={() => console.log('Edit cuisines')}
                            >
                                <div className="flex flex-wrap gap-2">
                                    {(cuisinesData || []).map((cId, i) => {
                                        const name = (allCuisines.data as any[])?.find(c => c.id === cId)?.name || `Кухня #${cId}`;
                                        return (
                                            <span key={i} className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-xl text-xs font-black border border-orange-100 uppercase tracking-wider">
                                                {name}
                                            </span>
                                        );
                                    })}
                                    {(cuisinesData || []).length === 0 && (
                                        <p className="text-slate-400 text-sm italic">Кухни не указаны</p>
                                    )}
                                </div>
                            </VenueInfoCard>

                            <VenueInfoCard
                                title="Удобства"
                                icon={<ConciergeBell className="text-blue-500" />}
                                onEdit={() => console.log('Edit amenities')}
                            >
                                <div className="flex flex-wrap gap-2">
                                    {(amenitiesData || []).map((aId, i) => {
                                        const name = (allAmenities.data as any[])?.find(a => a.id === aId)?.name || `Удобство #${aId}`;
                                        return (
                                            <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-xs font-black border border-blue-100 uppercase tracking-wider">
                                                {name}
                                            </span>
                                        );
                                    })}
                                    {(amenitiesData || []).length === 0 && (
                                        <p className="text-slate-400 text-sm italic">Удобства не указаны</p>
                                    )}
                                </div>
                            </VenueInfoCard>
                        </div>

                        {/* Details & Capacity */}
                        <VenueInfoCard
                            title="Детали и вместимость"
                            icon={<Users className="text-brand-500" />}
                            onEdit={() => console.log('Edit details')}
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {detailsData?.capacities?.map((cap, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-500">
                                                <Users size={18} />
                                            </div>
                                            <span className="font-bold text-slate-700">{cap.title}</span>
                                        </div>
                                        <span className="text-lg font-black text-brand-600">{cap.value}</span>
                                    </div>
                                ))}
                            </div>
                        </VenueInfoCard>

                        {/* Working Hours */}
                        <VenueInfoCard
                            title="График работы"
                            icon={<Clock className="text-orange-500" />}
                            onEdit={() => console.log('Edit hours')}
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                                {Object.entries(hoursData || {}).filter(([k]) => k.includes('Open')).map(([key, open]) => {
                                    const day = key.replace('Open', '');
                                    const closeKey = `${day}Close`;
                                    const close = (hoursData as any)[closeKey];
                                    const labels: any = {
                                        monday: 'Понедельник', tuesday: 'Вторник', wednesday: 'Среда',
                                        thursday: 'Четверг', friday: 'Пятница', saturday: 'Суббота', sunday: 'Воскресенье'
                                    };
                                    const isDayOff = open === '00:00' && close === '00:00';

                                    return (
                                        <div key={day} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                                            <span className="text-sm font-bold text-slate-500">{labels[day]}</span>
                                            {isDayOff ? (
                                                <span className="text-xs font-black text-slate-300 uppercase">Выходной</span>
                                            ) : (
                                                <span className="text-sm font-black text-slate-900">{open} — {close}</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </VenueInfoCard>
                    </div>

                    {/* Right Column: Contacts, Conditions, etc. */}
                    <div className="space-y-6">
                        {/* Contacts Card */}
                        <VenueInfoCard
                            title="Контакты"
                            icon={<Phone className="text-green-500" />}
                            onEdit={() => console.log('Edit contacts')}
                        >
                            <div className="space-y-4">
                                {contactsData?.phoneNumber && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                                            <Phone size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Телефон</p>
                                            <p className="font-black text-slate-900">{contactsData.phoneNumber}</p>
                                        </div>
                                    </div>
                                )}
                                {contactsData?.email && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                            <Mail size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Email</p>
                                            <p className="font-black text-slate-900">{contactsData.email}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Social Grid */}
                                <div className="grid grid-cols-5 gap-2 pt-2">
                                    {Object.entries(contactsData?.linksSocial || {}).map(([key, val]) => {
                                        if (!val) return null;
                                        const icons: any = {
                                            instagram: <Instagram size={18} />,
                                            whatsapp: <MessageCircle size={18} />,
                                            telegram: <Send size={18} />,
                                            facebook: <Facebook size={18} />,
                                            website: <Globe size={18} />
                                        };
                                        return (
                                            <a
                                                key={key}
                                                href={val.startsWith('http') ? val : `https://${val}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-brand-50 hover:text-brand-600 transition-all border border-slate-100"
                                            >
                                                {icons[key]}
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        </VenueInfoCard>

                        {/* Booking Conditions */}
                        <VenueInfoCard
                            title="Условия"
                            icon={<Wallet className="text-purple-500" />}
                            onEdit={() => console.log('Edit conditions')}
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-2xl border border-purple-100">
                                    <div className="flex items-center gap-3">
                                        <Wallet size={20} className="text-purple-600" />
                                        <span className="font-bold text-purple-900">Депозит</span>
                                    </div>
                                    <span className="text-lg font-black text-purple-700">
                                        {conditionsData?.deposit ? `${conditionsData.deposit} сом` : 'Без депозита'}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium text-slate-500">Отмена бронирования</span>
                                        <span className="font-black text-slate-900">
                                            {conditionsData?.cancelAllowed ? `${conditionsData.cancellationDeadline}` : 'НЕТ'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium text-slate-500">Изменение бронирования</span>
                                        <span className="font-black text-slate-900">
                                            {conditionsData?.editAllowed ? `${conditionsData.editingDeadline}` : 'НЕТ'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </VenueInfoCard>

                        {/* Admin Action Card */}
                        <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-slate-900/20">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-brand-400">
                                    <UserCog size={24} />
                                </div>
                                <div>
                                    <h3 className="font-black text-lg">Администрирование</h3>
                                    <p className="text-slate-400 text-xs">Управление доступом</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Button className="w-full h-11 bg-brand-primary hover:bg-brand-600 text-black border-0 font-black">
                                    Сменить администратора
                                </Button>
                                <Button variant="ghost" className="w-full h-11 text-slate-300 hover:text-white border-slate-700 font-bold">
                                    Удалить заведение
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
