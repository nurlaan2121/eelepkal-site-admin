import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';
import {
    ChevronLeft, Edit3, MapPin, Phone, Mail,
    Globe, Instagram, MessageCircle, Send, Facebook,
    Clock, UtensilsCrossed, ConciergeBell, FileText,
    UserCog, CreditCard, Star, Users, Wallet,
    Calendar, CheckCircle2, AlertCircle, Info
} from 'lucide-react';
import { motion } from 'framer-motion';
import { superAdminVenueService } from '../../api/venue/superAdminVenueService';
import { Button } from '../../components/ui/Button';
import {
    BasicInfoData,
    VenueDetailsData,
    VenueWorkingHours,
    VenueContactData
} from '../../types/venue';
import { VenueHero } from './components/VenueHero';
import { VenueInfoCard } from './components/VenueInfoCard';
import { VenueSkeleton } from './components/VenueSkeletons';
import { VenueAmenityChip } from './components/VenueAmenityChip';

export const VenueDetailPage: React.FC = () => {
    const { venueId } = useParams<{ venueId: string }>();
    const navigate = useNavigate();
    const id = Number(venueId);

    const results = useQueries({
        queries: [
            { queryKey: ['venue-basic', id], queryFn: () => superAdminVenueService.getBasicInfo(id) },
            { queryKey: ['venue-details', id], queryFn: () => superAdminVenueService.getVenueDetails(id) },
            { queryKey: ['venue-hours', id], queryFn: () => superAdminVenueService.getVenueHours(id) },
            { queryKey: ['venue-amenities', id], queryFn: () => superAdminVenueService.getVenueAmenities(id) },
            { queryKey: ['venue-contacts', id], queryFn: () => superAdminVenueService.getVenueContacts(id) },
            { queryKey: ['venue-public-admin', id], queryFn: () => superAdminVenueService.getVenuePublicAdmin(id) },
            { queryKey: ['venue-description', id], queryFn: () => superAdminVenueService.getVenueDescription(id) },
            { queryKey: ['all-amenities'], queryFn: () => superAdminVenueService.getAllAmenities() },
        ],
    });

    const [
        basic, details, hours, amenities, contacts, publicAdmin, description, allAmenities
    ] = results;

    const isLoading = results.some(r => r.isLoading);
    const isError = results.some(r => r.isError);

    if (isLoading) return <VenueSkeleton />;

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
                <div className="w-24 h-24 bg-red-50 rounded-[2.5rem] flex items-center justify-center text-red-500 shadow-xl shadow-red-500/10">
                    <AlertCircle size={40} />
                </div>
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Ошибка загрузки</h2>
                    <p className="text-slate-400 font-medium">Не удалось получить данные о заведении</p>
                </div>
                <Button onClick={() => navigate('/super-admin/venues')} variant="ghost" className="h-14 px-8 rounded-2xl font-black">
                    Вернуться к списку
                </Button>
            </div>
        );
    }

    const basicData = basic.data as BasicInfoData;
    const detailsData = details.data as VenueDetailsData;
    const hoursData = hours.data as VenueWorkingHours;
    const amenitiesData = amenities.data as number[];
    const contactsData = contacts.data as VenueContactData;
    const publicAdminData = publicAdmin.data as any;
    const descriptionData = description.data as { description: string };

    const getTodayStatus = () => {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayName = days[new Date().getDay()];
        const open = (hoursData as any)?.[`${dayName}Open`];
        const close = (hoursData as any)?.[`${dayName}Close`];
        const isOff = open === '00:00' && close === '00:00';
        return { isOff, hours: `${open} - ${close}`, dayName };
    };

    const today = getTodayStatus();

    return (
        <div className="pb-20 max-w-7xl mx-auto">
            {/* Premium Sticky Header */}
            <header className="fixed top-0 inset-x-0 z-[60] bg-white/80 backdrop-blur-xl border-b border-slate-100 px-4 md:px-8 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => navigate('/super-admin/venues')}
                            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all active:scale-95 border border-slate-200/50"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <div className="hidden sm:block">
                            <h2 className="text-xl font-black text-slate-900 leading-tight">
                                {basicData?.nameVenue || 'Заведение'}
                            </h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-600 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                                Панель управления
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                            <CheckCircle2 size={16} className="text-emerald-500" />
                            <span className="text-xs font-black text-slate-600 uppercase tracking-wider">Активно</span>
                        </div>
                        <Button className="h-12 px-6 rounded-2xl font-black text-sm bg-slate-900 border-0 shadow-lg shadow-slate-900/10">
                            Действия
                        </Button>
                    </div>
                </div>
            </header>

            <main className="pt-28 space-y-10">
                {/* Hero Section with Bento Gallery */}
                <VenueHero
                    images={Array.isArray(basicData?.imageUrls) ? basicData.imageUrls : []}
                    name={basicData?.nameVenue}
                    address={detailsData?.address}
                    avgCheck={detailsData?.averageCheck}
                    isTodayOpen={!today.isOff}
                    todayHours={today.hours}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                    {/* Left Column: Primary Content */}
                    <div className="lg:col-span-2 space-y-10">

                        {/* Description Section */}
                        <VenueInfoCard
                            title="Описание заведения"
                            icon={<FileText className="text-blue-500" />}
                            onEdit={() => console.log('Edit description')}
                        >
                            <div className="relative">
                                <p className="text-slate-600 text-lg leading-[1.8] font-medium whitespace-pre-wrap">
                                    {descriptionData?.description || basicData?.description || (
                                        <span className="text-slate-300 italic">Описание пока не заполнено владельцем</span>
                                    )}
                                </p>
                            </div>
                        </VenueInfoCard>

                        {/* Amenities Grid */}
                        <VenueInfoCard
                            title="Удобства и сервисы"
                            icon={<ConciergeBell className="text-brand-500" />}
                            onEdit={() => console.log('Edit amenities')}
                            description="Особенности вашего заведения"
                        >
                            <div className="flex flex-wrap gap-3">
                                {Array.isArray(amenitiesData) && amenitiesData.length > 0 ? (
                                    amenitiesData.map((aId) => {
                                        const found = (allAmenities.data as any[])?.find(a => a.id === aId);
                                        return <VenueAmenityChip key={aId} id={aId} name={found?.name || `Услуга ${aId}`} />;
                                    })
                                ) : (
                                    <div className="w-full p-8 rounded-3xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
                                        <Info size={24} className="mx-auto text-slate-300" />
                                        <p className="text-sm font-medium text-slate-400">Список услуг пуст</p>
                                    </div>
                                )}
                            </div>
                        </VenueInfoCard>

                        {/* Capacity Grid */}
                        <VenueInfoCard
                            title="Вместимость и залы"
                            icon={<Users className="text-purple-500" />}
                            onEdit={() => console.log('Edit capacity')}
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {Array.isArray(detailsData?.capacities) && detailsData.capacities.length > 0 ? (
                                    detailsData.capacities.map((cap, i) => (
                                        <motion.div
                                            key={i}
                                            whileHover={{ y: -5 }}
                                            className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm">
                                                    <Users size={20} />
                                                </div>
                                                <span className="font-black text-slate-700 uppercase text-[10px] tracking-widest">{cap.title}</span>
                                            </div>
                                            <span className="text-2xl font-black text-brand-600">{cap.value}</span>
                                        </motion.div>
                                    ))
                                ) : (
                                    <p className="text-slate-300 italic p-4 text-center col-span-2">Данные о вместимости не указаны</p>
                                )}
                            </div>
                        </VenueInfoCard>
                    </div>

                    {/* Right Column: Sidebar */}
                    <div className="space-y-10">

                        {/* Working Hours Sidebar */}
                        <VenueInfoCard
                            title="График работы"
                            icon={<Clock className="text-orange-500" />}
                            onEdit={() => console.log('Edit hours')}
                        >
                            <div className="space-y-1">
                                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                                    const open = (hoursData as any)?.[`${day}Open`];
                                    const close = (hoursData as any)?.[`${day}Close`];
                                    const labels: any = {
                                        monday: 'Понедельник', tuesday: 'Вторник', wednesday: 'Среда',
                                        thursday: 'Четверг', friday: 'Пятница', saturday: 'Суббота', sunday: 'Воскресенье'
                                    };
                                    const isDayOff = open === '00:00' && close === '00:00';
                                    const isToday = day === today.dayName;

                                    return (
                                        <div
                                            key={day}
                                            className={`flex items-center justify-between p-4 rounded-2xl transition-all ${isToday ? 'bg-orange-50/50 border border-orange-100/50 scale-[1.02]' : 'hover:bg-slate-50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={`text-sm font-bold ${isToday ? 'text-orange-600' : 'text-slate-500'}`}>
                                                    {labels[day]}
                                                </span>
                                                {isToday && (
                                                    <span className="px-2 py-0.5 bg-orange-600 text-white text-[8px] font-black uppercase rounded-md">
                                                        Сегодня
                                                    </span>
                                                )}
                                            </div>

                                            {isDayOff ? (
                                                <span className="text-xs font-black text-rose-500 uppercase tracking-widest bg-rose-50 px-2 py-1 rounded-lg">Выходной</span>
                                            ) : (
                                                <span className={`text-sm font-black ${isToday ? 'text-slate-900' : 'text-slate-700'}`}>
                                                    {open} — {close}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </VenueInfoCard>

                        {/* Contacts Sidebar */}
                        <VenueInfoCard
                            title="Контакты"
                            icon={<Phone className="text-emerald-500" />}
                            onEdit={() => console.log('Edit contacts')}
                        >
                            <div className="space-y-6">
                                {contactsData?.phoneNumber && (
                                    <div className="flex items-center gap-4 group cursor-pointer">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center transition-transform group-hover:scale-110">
                                            <Phone size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Телефон</p>
                                            <p className="font-black text-slate-900 text-lg group-hover:text-emerald-600 transition-colors">{contactsData.phoneNumber}</p>
                                        </div>
                                    </div>
                                )}

                                {contactsData?.email && contactsData.email.trim() !== "" && (
                                    <div className="flex items-center gap-4 group cursor-pointer">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center transition-transform group-hover:scale-110">
                                            <Mail size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email</p>
                                            <p className="font-black text-slate-900 group-hover:text-blue-600 transition-colors">{contactsData.email}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Premium Social Grid */}
                                <div className="grid grid-cols-4 gap-3 pt-4 border-t border-slate-50">
                                    {Object.entries(contactsData?.linksSocial || {}).map(([key, val]) => {
                                        if (!val || val.trim() === "") return null;
                                        const icons: any = {
                                            instagram: <Instagram size={20} />,
                                            whatsapp: <MessageCircle size={20} />,
                                            telegram: <Send size={20} />,
                                            facebook: <Facebook size={20} />,
                                            website: <Globe size={20} />
                                        };
                                        return (
                                            <a
                                                key={key}
                                                href={val.startsWith('http') ? val : `https://${val}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="w-full aspect-square rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all border border-slate-100 hover:shadow-lg hover:-translate-y-1"
                                                title={key}
                                            >
                                                {icons[key] || <Globe size={20} />}
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        </VenueInfoCard>

                        {/* Administrator Sidebar Card - High Contrast */}
                        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 blur-[60px] rounded-full -mr-16 -mt-16" />

                            <div className="relative z-10 space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center text-brand-400 border border-white/10 group-hover:rotate-6 transition-transform">
                                        <UserCog size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black">Администратор</h3>
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Персональный доступ</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {publicAdminData ? (
                                        <div className="p-5 bg-white/5 rounded-[1.5rem] border border-white/5 space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-black font-black text-sm shadow-lg shadow-brand-primary/20">
                                                    {(publicAdminData.fullName || 'A').charAt(0)}
                                                </div>
                                                <span className="font-bold text-slate-100">{publicAdminData.fullName || 'Имя не указано'}</span>
                                            </div>
                                            <p className="text-sm text-slate-400 pl-1">{publicAdminData.email}</p>
                                        </div>
                                    ) : (
                                        <div className="p-6 text-center border-2 border-dashed border-white/10 rounded-[1.5rem]">
                                            <p className="text-sm text-slate-500 font-medium italic">Администратор пока не назначен</p>
                                        </div>
                                    )}

                                    <Button className="w-full h-14 bg-brand-primary hover:bg-brand-400 text-black border-0 font-black rounded-2xl transition-all shadow-xl shadow-brand-primary/10">
                                        Назначить ответственного
                                    </Button>

                                    <button className="w-full h-12 text-rose-400 hover:text-rose-300 text-sm font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                                        Удалить заведение
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
