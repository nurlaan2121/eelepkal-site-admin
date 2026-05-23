import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';
import {
    ChevronLeft, MapPin, Phone, Mail,
    Globe, Instagram, MessageCircle, Send, Facebook,
    Clock, ConciergeBell, FileText,
    UserCog, Star, Users, Wallet,
    CheckCircle2, AlertCircle, Info, Layers, Sofa, LayoutGrid, Utensils
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
import { VenueAmenityGrid } from './components/VenueAmenityGrid';

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
            { queryKey: ['all-cities'], queryFn: () => superAdminVenueService.getAllCities() },
        ],
    });

    const [
        basic, details, hours, amenities, contacts, publicAdmin, description, allAmenities, allCities
    ] = results;

    const isLoading = results.some(r => r.isLoading);
    const isError = results.some(r => r.isError);

    if (isLoading) return <div className="max-w-md mx-auto sm:max-w-7xl px-4 py-8"><VenueSkeleton /></div>;

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
                <Button onClick={() => navigate('/super-admin/venues')} variant="ghost" className="h-12 px-6 rounded-2xl font-black border border-slate-100">
                    Вернуться к списку
                </Button>
            </div>
        );
    }

    const basicData = basic.data as BasicInfoData;
    const detailsData = details.data as VenueDetailsData;
    const hoursDataRaw = hours.data as any;
    const amenitiesDataRaw = amenities.data as any;
    const contactsRaw = contacts.data as any;
    const publicAdminData = publicAdmin.data as any;
    const descriptionData = description.data as { description: string };

    // Parse working hours from API format {"MONDAY": "08:00 - 00:00"} to {mondayOpen: "08:00", mondayClose: "00:00"}
    const parseWorkingHours = (rawData: any): any => {
        if (!rawData || typeof rawData !== 'object') return {};
        
        const dayMapping: any = {
            'MONDAY': 'monday',
            'TUESDAY': 'tuesday',
            'WEDNESDAY': 'wednesday',
            'THURSDAY': 'thursday',
            'FRIDAY': 'friday',
            'SATURDAY': 'saturday',
            'SUNDAY': 'sunday'
        };

        const result: any = {};
        
        Object.entries(rawData).forEach(([key, value]) => {
            const dayKey = dayMapping[key.toUpperCase()];
            if (dayKey && typeof value === 'string') {
                // Parse "08:00 - 00:00" format
                const parts = value.split(' - ');
                if (parts.length === 2) {
                    result[`${dayKey}Open`] = parts[0].trim();
                    result[`${dayKey}Close`] = parts[1].trim();
                }
            }
        });
        
        return result;
    };

    const hoursData = parseWorkingHours(hoursDataRaw);

    // Parse amenities from API format {"5": "VIP кабины", "26": "Доставка"} to [5, 26]
    const parseAmenities = (rawData: any): number[] => {
        if (!rawData || typeof rawData !== 'object') return [];
        if (Array.isArray(rawData)) return rawData;
        
        // Extract keys (IDs) from the object and convert to numbers
        return Object.keys(rawData)
            .map(key => parseInt(key, 10))
            .filter(id => !isNaN(id));
    };

    const amenitiesData = parseAmenities(amenitiesDataRaw);

    // Parse contacts from API format to frontend format
    const parseContacts = (rawData: any): VenueContactData => {
        if (!rawData || typeof rawData !== 'object') {
            return { phoneNumber: '', email: '', linksSocial: {} };
        }

        // Map API keys to frontend keys
        const phoneNumber = rawData['phone number'] || rawData['phoneNumber'] || rawData['phone'] || '';
        const email = rawData['email'] || '';
        
        // Extract social links
        const linksSocial: any = {};
        
        Object.entries(rawData).forEach(([key, value]) => {
            if (typeof value !== 'string' || !value || value.trim() === '') return;
            
            const keyLower = key.toLowerCase();
            
            if (keyLower.includes('instagram')) {
                linksSocial.instagram = value;
            } else if (keyLower.includes('whatsapp') || keyLower.includes('whatsup') || keyLower === 'wa') {
                linksSocial.whatsapp = value;
            } else if (keyLower.includes('telegram') || keyLower === 'tg') {
                linksSocial.telegram = value;
            } else if (keyLower.includes('facebook') || keyLower === 'fb') {
                linksSocial.facebook = value;
            } else if (keyLower.includes('2gis') || keyLower.includes('2гис')) {
                linksSocial.website = value; // Map 2GIS to website
            } else if (keyLower.includes('website') || keyLower.includes('сайт') || keyLower.includes('site')) {
                linksSocial.website = value;
            }
        });

        return {
            phoneNumber: typeof phoneNumber === 'string' ? phoneNumber.trim() : '',
            email: typeof email === 'string' ? email.trim() : '',
            linksSocial
        };
    };

    const contactsData = parseContacts(contactsRaw);

    const getTodayStatus = () => {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayName = days[new Date().getDay()];
        const open = hoursData?.[`${dayName}Open`];
        const close = hoursData?.[`${dayName}Close`];
        const isOff = open === '00:00' && close === '00:00';
        return { isOff, hours: `${open || '—'} - ${close || '—'}`, dayName };
    };

    const today = getTodayStatus();

    const getImageUrls = (data: any): string[] => {
        if (!data) return [];
        if (Array.isArray(data.imageUrls)) return data.imageUrls;
        if (data.images && typeof data.images === 'object') return Object.values(data.images);
        return [];
    };

    const imageUrls = getImageUrls(basicData);

    return (
        <div className="pb-20 max-w-2xl mx-auto sm:px-4">
            {/* Minimal Mobile Header */}
            <header className="fixed top-0 inset-x-0 z-[60] bg-white/80 backdrop-blur-xl border-b border-slate-50 px-4 py-3 sm:hidden">
                <div className="flex items-center justify-between">
                    <button onClick={() => navigate('/super-admin/venues')} className="p-2 -ml-2 text-slate-600">
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-sm font-black text-slate-900 truncate px-4">
                        {(basicData as any)?.name || basicData?.nameVenue || 'Заведение'}
                    </h1>
                    <div className="w-10" />
                </div>
            </header>

            <main className="space-y-6 pt-14 sm:pt-8 overflow-x-hidden">
                {/* 1. Hero Gallery Section */}
                <VenueHero
                    images={imageUrls}
                    onEdit={() => console.log('Edit Hero')}
                />

                <div className="px-4 sm:px-0 space-y-6">
                    {/* 2. Main Basic Information Card */}
                    <VenueInfoCard onEdit={() => console.log('Edit Basic')} className="!p-0">
                        <div className="p-6 space-y-6">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                                    {(basicData as any)?.name || basicData?.nameVenue || 'Без названия'}
                                </h1>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-slate-600">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-orange-500">
                                        <Clock size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">График:</p>
                                        <p className="font-bold text-sm tracking-tight">{today.isOff ? 'Выходной' : today.hours}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-slate-600">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-orange-500">
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Адрес:</p>
                                        <p className="font-bold text-sm tracking-tight">
                                            {`${(allCities.data as any[])?.find(c => c.id === detailsData?.cityId)?.title || ''} ${(basicData as any)?.address || detailsData?.address || ''}`.trim() || 'Адрес не указан'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-slate-600">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-orange-500">
                                        <Wallet size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Средний чек:</p>
                                        <p className="font-bold text-sm tracking-tight">{(basicData as any)?.averageCheck || detailsData?.averageCheck || 0} сом</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-slate-600">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-orange-500">
                                        <Star size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Рейтинг:</p>
                                        <div className="flex items-center gap-1.5 font-bold text-sm">
                                            {(basicData as any)?.rating || 5.0} <Star size={14} className="fill-orange-500 text-orange-500" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </VenueInfoCard>

                    {/* 3. Promos Section (If any) */}
                    {Array.isArray((basicData as any)?.promosRes) && (basicData as any).promosRes.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-black text-slate-900 px-2">Акции и скидки</h3>
                            {(basicData as any).promosRes.map((promo: any, idx: number) => (
                                <VenueInfoCard key={idx} onEdit={() => console.log('Edit Promo')} noPadding className="border-orange-100 bg-orange-50/20">
                                    <div className="flex h-32">
                                        <div className="w-32 bg-slate-100 relative overflow-hidden">
                                            <img src={(basicData as any).images?.['1'] || imageUrls[0]} className="w-full h-full object-cover" alt="" />
                                            <div className="absolute top-2 left-2 px-2 py-1 bg-rose-500 text-white text-[10px] font-black rounded-lg">-{promo.discount || 20}%</div>
                                        </div>
                                        <div className="flex-1 p-4 flex flex-col justify-center">
                                            <h4 className="font-black text-slate-900 leading-tight mb-1">{promo.title || 'Специальное предложение'}</h4>
                                            <p className="text-xs text-slate-500 line-clamp-2">{promo.description || 'Успейте воспользоваться выгодным предложением от нашего заведения'}</p>
                                        </div>
                                    </div>
                                </VenueInfoCard>
                            ))}
                        </div>
                    )}

                    {/* 4. Details Section (Floor, Cabins, Kitchen, etc.) */}
                    <VenueInfoCard title="Детали заведения" icon={<LayoutGrid size={20} />} onEdit={() => console.log('Edit Details')}>
                        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><Layers size={20} /></div>
                                <div>
                                    <p className="text-[9px] font-black uppercase text-slate-400">Этаж</p>
                                    <p className="font-bold text-sm">1 этаж</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><Sofa size={20} /></div>
                                <div>
                                    <p className="text-[9px] font-black uppercase text-slate-400">Кабины</p>
                                    <p className="font-bold text-sm">Есть VIP</p>
                                </div>
                            </div>
                            {Array.isArray(detailsData?.capacities) && detailsData.capacities.map((cap, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><Users size={20} /></div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase text-slate-400">{cap.title}</p>
                                        <p className="font-bold text-sm">{cap.value} чел.</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </VenueInfoCard>

                    {/* 5. Working Hours List */}
                    <VenueInfoCard title="График работы" icon={<Clock size={20} />} onEdit={() => console.log('Edit Hours')}>
                        <div className="space-y-4">
                            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                                const open = hoursData?.[`${day}Open`];
                                const close = hoursData?.[`${day}Close`];
                                const labels: any = {
                                    monday: 'Понедельник', tuesday: 'Вторник', wednesday: 'Среда',
                                    thursday: 'Четверг', friday: 'Пятница', saturday: 'Суббота', sunday: 'Воскресенье'
                                };
                                const isDayOff = open === '00:00' && close === '00:00';
                                const isToday = day === today.dayName;
                                const hasData = open && close;

                                return (
                                    <div key={day} className={`flex items-center justify-between transition-all ${isToday ? 'text-orange-600' : 'text-slate-600'}`}>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm font-bold ${isToday ? 'font-black' : ''}`}>{labels[day]}</span>
                                            {isToday && <div className="w-1.5 h-1.5 rounded-full bg-orange-500 ml-1" />}
                                        </div>
                                        <span className={`text-sm font-bold ${isDayOff ? 'text-rose-500' : ''}`}>
                                            {!hasData ? 'Нет данных' : isDayOff ? 'Выходной' : `${open} — ${close}`}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </VenueInfoCard>

                    {/* 6. Amenities Section */}
                    <VenueInfoCard title="Удобства" icon={<ConciergeBell size={20} />} onEdit={() => console.log('Edit Amenities')}>
                        <VenueAmenityGrid
                            amenities={amenitiesData}
                            allAmenities={allAmenities.data as any[]}
                        />
                    </VenueInfoCard>

                    {/* 7. Contacts Section */}
                    <VenueInfoCard title="Контакты" icon={<Phone size={20} />} onEdit={() => console.log('Edit Contacts')}>
                        <div className="space-y-4">
                            {contactsData?.phoneNumber && (
                                <a href={`tel:${contactsData.phoneNumber}`} className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center transition-transform group-hover:scale-110">
                                        <Phone size={20} />
                                    </div>
                                    <span className="font-black text-slate-800 tracking-tight">{contactsData.phoneNumber}</span>
                                </a>
                            )}

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                                {Object.entries(contactsData?.linksSocial || {}).map(([key, val]) => {
                                    if (!val || val.trim() === "") return null;
                                    const icons: any = {
                                        instagram: <Instagram size={18} />,
                                        whatsapp: <MessageCircle size={18} />,
                                        telegram: <Send size={18} />,
                                        facebook: <Facebook size={18} />,
                                        website: <Globe size={18} />
                                    };
                                    const labels: any = {
                                        instagram: 'Instagram',
                                        whatsapp: 'WhatsApp',
                                        telegram: 'Telegram',
                                        facebook: 'Facebook',
                                        website: 'Сайт'
                                    };
                                    return (
                                        <a key={key} href={val.startsWith('http') ? val : `https://${val}`} target="_blank" rel="noreferrer"
                                            className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-slate-900 hover:text-white transition-all group"
                                        >
                                            <div className="text-slate-400 group-hover:text-white">{icons[key] || <Globe size={18} />}</div>
                                            <span className="text-xs font-black uppercase tracking-wider">{labels[key]}</span>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </VenueInfoCard>

                    {/* 8. Administrator Section */}
                    <VenueInfoCard title="Администратор" icon={<UserCog size={20} />} onEdit={() => console.log('Edit Admin')}>
                        {publicAdminData ? (
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-brand-primary flex items-center justify-center text-black font-black text-xl shadow-lg shadow-brand-primary/20">
                                    {(publicAdminData.fullName || 'A').charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900">{publicAdminData.fullName || 'Имя не указано'}</h4>
                                    <p className="text-xs text-slate-500 font-medium">{publicAdminData.email}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                                <p className="text-sm text-slate-400 font-medium italic">Администратор не назначен</p>
                            </div>
                        )}
                    </VenueInfoCard>

                    {/* 9. Description (Typography focused) */}
                    <div className="py-10 space-y-6 text-center">
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <div className="h-px w-12 bg-slate-100" />
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Описание</h3>
                            <div className="h-px w-12 bg-slate-100" />
                        </div>
                        <p className="text-slate-600 text-lg leading-[1.8] font-medium whitespace-pre-wrap max-w-xl mx-auto px-4">
                            {descriptionData?.description || basicData?.description || 'Описание пока не заполнено владельцем заведения'}
                        </p>
                        <Button variant="ghost" className="text-orange-500 font-black uppercase tracking-widest text-xs" onClick={() => console.log('Edit Desc')}>
                            Редактировать описание
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
};
