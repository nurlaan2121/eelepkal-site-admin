import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueries, useQueryClient, useMutation } from '@tanstack/react-query';
import {
    ChevronLeft, MapPin, Phone, Mail,
    Globe, Instagram, MessageCircle, Send, Facebook,
    Clock, ConciergeBell, FileText,
    UserCog, Star, Users, Wallet,
    CheckCircle2, AlertCircle, Info, Layers, Sofa, LayoutGrid, Utensils, UtensilsCrossed,
    Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
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
import { VenueHoursModal } from './components/VenueHoursModal';
import { VenueAmenitiesModal } from './components/VenueAmenitiesModal';
import { VenueContactsModal } from './components/VenueContactsModal';
import { VenueDescModal } from './components/VenueDescModal';

export const VenueDetailPage: React.FC = () => {
    const { venueId } = useParams<{ venueId: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const id = Number(venueId);

    const [deletedFeedbackIds, setDeletedFeedbackIds] = useState<Set<number>>(new Set());
    const [isHoursModalOpen, setIsHoursModalOpen] = useState(false);
    const [isAmenitiesModalOpen, setIsAmenitiesModalOpen] = useState(false);
    const [isContactsModalOpen, setIsContactsModalOpen] = useState(false);
    const [isDescModalOpen, setIsDescModalOpen] = useState(false);

    // Image mutations
    const addImageMutation = useMutation({
        mutationFn: async (file: File) => {
            const url = await superAdminVenueService.uploadFileToS3(file);
            return superAdminVenueService.addVenueImage(id, url);
        },
        onSuccess: () => {
            toast.success('Фотография добавлена');
            queryClient.invalidateQueries({ queryKey: ['venue-basic', id] });
        },
        onError: () => toast.error('Ошибка при загрузке фото')
    });

    const deleteImageMutation = useMutation({
        mutationFn: (imageId: number) => superAdminVenueService.deleteVenueImage(id, imageId),
        onSuccess: () => {
            toast.success('Фотография удалена');
            queryClient.invalidateQueries({ queryKey: ['venue-basic', id] });
        },
        onError: () => toast.error('Ошибка при удалении фото')
    });

    // Feedback mutation
    const deleteFeedbackMutation = useMutation({
        mutationFn: ({ feedbackId }: { feedbackId: number }) =>
            superAdminVenueService.deleteFeedback(id, feedbackId),
        onSuccess: (_, { feedbackId }) => {
            toast.success('Отзыв успешно удален');
            setDeletedFeedbackIds(prev => new Set(prev).add(feedbackId));
            queryClient.invalidateQueries({ queryKey: ['venue-feedbacks', id] });
        },
        onError: () => toast.error('Ошибка при удалении отзыва')
    });

    // Hours mutation
    const updateHoursMutation = useMutation({
        mutationFn: (hours: VenueWorkingHours) => superAdminVenueService.addVenueHours(id, hours),
        onSuccess: () => {
            toast.success('График работы обновлен');
            queryClient.invalidateQueries({ queryKey: ['venue-hours', id] });
            setIsHoursModalOpen(false);
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Ошибка при обновлении графика';
            toast.error(message);
        }
    });

    const updateAmenitiesMutation = useMutation({
        mutationFn: (amenitiesId: number[]) => superAdminVenueService.addVenueAmenities(id, { amenitiesId }),
        onSuccess: () => {
            toast.success('Удобства обновлены');
            queryClient.invalidateQueries({ queryKey: ['venue-amenities', id] });
            setIsAmenitiesModalOpen(false);
        },
        onError: () => toast.error('Ошибка при обновлении удобств')
    });

    const updateContactsMutation = useMutation({
        mutationFn: (data: VenueContactData) => superAdminVenueService.addVenueContacts(id, data),
        onSuccess: () => {
            toast.success('Контакты обновлены');
            queryClient.invalidateQueries({ queryKey: ['venue-contacts', id] });
            setIsContactsModalOpen(false);
        },
        onError: () => toast.error('Ошибка при обновлении контактов')
    });

    const updateDescMutation = useMutation({
        mutationFn: ({ name, description }: { name: string, description: string }) =>
            superAdminVenueService.updateNameAndDescription(id, name, description),
        onSuccess: () => {
            toast.success('Информация обновлена');
            queryClient.invalidateQueries({ queryKey: ['venue-basic', id] });
            queryClient.invalidateQueries({ queryKey: ['venue-description', id] });
            setIsDescModalOpen(false);
        },
        onError: () => toast.error('Ошибка при обновлении информации')
    });

    const results = useQueries({
        queries: [
            { queryKey: ['venue-basic', id], queryFn: () => superAdminVenueService.getBasicInfo(id) },
            { queryKey: ['venue-details', id], queryFn: () => superAdminVenueService.getVenueDetails(id) },
            { queryKey: ['venue-hours', id], queryFn: () => superAdminVenueService.getVenueHours(id) },
            { queryKey: ['venue-amenities', id], queryFn: () => superAdminVenueService.getVenueAmenities(id) },
            { queryKey: ['venue-contacts', id], queryFn: () => superAdminVenueService.getVenueContacts(id) },
            { queryKey: ['venue-public-admin', id], queryFn: () => superAdminVenueService.getVenuePublicAdmin(id) },
            { queryKey: ['venue-description', id], queryFn: () => superAdminVenueService.getVenueDescription(id) },
            { queryKey: ['venue-feedbacks', id], queryFn: () => superAdminVenueService.getVenueFeedbacks(id) },
            { queryKey: ['all-amenities'], queryFn: () => superAdminVenueService.getAllAmenities() },
            { queryKey: ['all-cities'], queryFn: () => superAdminVenueService.getAllCities() },
        ],
    });

    const [
        basic, details, hours, amenities, contacts, publicAdmin, description, feedbacks, allAmenities, allCities
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
    const descriptionRaw = description.data as any;
    const feedbacksData = feedbacks.data as any[];

    const visibleFeedbacks = feedbacksData?.filter((f: any) => !deletedFeedbackIds.has(f.id)) || [];

    const descriptionText = typeof descriptionRaw === 'string'
        ? descriptionRaw
        : descriptionRaw?.description || '';

    const parseWorkingHours = (rawData: any): VenueWorkingHours => {
        const defaultHours: VenueWorkingHours = {
            mondayOpen: '09:00', mondayClose: '23:00',
            tuesdayOpen: '09:00', tuesdayClose: '23:00',
            wednesdayOpen: '09:00', wednesdayClose: '23:00',
            thursdayOpen: '09:00', thursdayClose: '23:00',
            fridayOpen: '09:00', fridayClose: '23:00',
            saturdayOpen: '09:00', saturdayClose: '23:00',
            sundayOpen: '09:00', sundayClose: '23:00',
        };

        if (!rawData || typeof rawData !== 'object') return defaultHours;

        const dayMapping: any = { 'MONDAY': 'monday', 'TUESDAY': 'tuesday', 'WEDNESDAY': 'wednesday', 'THURSDAY': 'thursday', 'FRIDAY': 'friday', 'SATURDAY': 'saturday', 'SUNDAY': 'sunday' };

        const result: any = { ...defaultHours };
        Object.entries(rawData).forEach(([key, value]) => {
            const dayKey = dayMapping[key.toUpperCase()];
            if (dayKey && typeof value === 'string') {
                // Check if the day is closed ("Выходной" means closed/day off)
                if (value === 'Выходной') {
                    result[`${dayKey}Open`] = '00:00';
                    result[`${dayKey}Close`] = '00:00';
                } else {
                    // Try to parse time range format like "09:00 - 23:00"
                    const parts = value.split(' - ');
                    if (parts.length === 2) {
                        result[`${dayKey}Open`] = parts[0].trim();
                        result[`${dayKey}Close`] = parts[1].trim();
                    }
                }
            }
        });
        return result;
    };

    const venueHours = parseWorkingHours(hoursDataRaw);

    const parseAmenities = (rawData: any): number[] => {
        if (!rawData || typeof rawData !== 'object') return [];
        if (Array.isArray(rawData)) return rawData;
        return Object.keys(rawData).map(key => parseInt(key, 10)).filter(id => !isNaN(id));
    };

    const amenitiesData = parseAmenities(amenitiesDataRaw);

    const parseContacts = (rawData: any): VenueContactData => {
        if (!rawData || typeof rawData !== 'object') return { phoneNumber: '', email: '', linksSocial: {} };
        const phoneNumber = rawData['phone number'] || rawData['phoneNumber'] || rawData['phone'] || '';
        const email = rawData['email'] || '';
        const linksSocial: any = {};
        Object.entries(rawData).forEach(([key, value]) => {
            if (typeof value !== 'string' || !value || value.trim() === '') return;
            const keyLower = key.toLowerCase();
            if (keyLower.includes('instagram')) linksSocial.instagram = value;
            else if (keyLower.includes('whatsapp') || keyLower.includes('whatsup') || keyLower === 'wa') linksSocial.whatsapp = value;
            else if (keyLower.includes('telegram') || keyLower === 'tg') linksSocial.telegram = value;
            else if (keyLower.includes('facebook') || keyLower === 'fb') linksSocial.facebook = value;
            else if (keyLower.includes('2gis') || keyLower.includes('2гис')) linksSocial.website = value;
            else if (keyLower.includes('website') || keyLower.includes('сайт') || keyLower.includes('site')) linksSocial.website = value;
        });
        return { phoneNumber: typeof phoneNumber === 'string' ? phoneNumber.trim() : '', email: typeof email === 'string' ? email.trim() : '', linksSocial };
    };

    const contactsData = parseContacts(contactsRaw);

    const handleDeleteFeedback = (feedbackId: number, feedbackAuthor: string) => {
        if (window.confirm(`Вы уверены, что хотите удалить отзыв от "${feedbackAuthor}"?`)) {
            deleteFeedbackMutation.mutate({ feedbackId });
        }
    };

    const getTodayStatus = () => {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayName = days[new Date().getDay()];
        const open = (venueHours as any)[`${dayName}Open`];
        const close = (venueHours as any)[`${dayName}Close`];
        const isOff = open === '00:00' && close === '00:00';
        return { isOff, hours: `${open || '—'} - ${close || '—'}`, dayName };
    };

    const today = getTodayStatus();

    const getImageData = (data: any): { id: number, url: string }[] => {
        if (!data) return [];
        if (data.images && typeof data.images === 'object') {
            return Object.entries(data.images).map(([id, url]) => ({
                id: parseInt(id, 10),
                url: url as string
            }));
        }
        return [];
    };

    const imageData = getImageData(basicData);

    return (
        <div className="pb-20 max-w-2xl mx-auto sm:px-4">
            <header className="fixed top-0 inset-x-0 z-[60] bg-white/80 backdrop-blur-xl border-b border-slate-50 px-4 py-3 sm:hidden">
                <div className="flex items-center justify-between">
                    <button onClick={() => navigate('/super-admin/venues')} className="p-2 -ml-2 text-slate-600"><ChevronLeft size={24} /></button>
                    <h1 className="text-sm font-black text-slate-900 truncate px-4">{(basicData as any)?.name || basicData?.nameVenue || 'Заведение'}</h1>
                    <div className="w-10" />
                </div>
            </header>

            <main className="space-y-6 pt-14 sm:pt-8 overflow-x-hidden">
                <VenueHero
                    images={imageData}
                    onDeleteImage={id => deleteImageMutation.mutate(id)}
                    onAddImage={file => addImageMutation.mutate(file)}
                    isProcessing={addImageMutation.isPending || deleteImageMutation.isPending}
                />

                <div className="px-4 sm:px-0 space-y-6">
                    <VenueInfoCard onEdit={() => console.log('Edit Basic')} className="!p-0">
                        <div className="p-6 space-y-6">
                            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{(basicData as any)?.name || basicData?.nameVenue || 'Без названия'}</h1>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-slate-600">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-orange-500"><Clock size={18} /></div>
                                    <div><p className="text-[10px] font-black uppercase tracking-widest text-slate-400">График:</p><p className="font-bold text-sm tracking-tight">{today.isOff ? 'Выходной' : today.hours}</p></div>
                                </div>
                                <div className="flex items-center gap-4 text-slate-600">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-orange-500"><MapPin size={18} /></div>
                                    <div><p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Адрес:</p><p className="font-bold text-sm tracking-tight">{`${(allCities.data as any[])?.find(c => c.id === detailsData?.cityId)?.title || ''} ${(basicData as any)?.address || detailsData?.address || ''}`.trim() || 'Адрес не указан'}</p></div>
                                </div>
                                <div className="flex items-center gap-4 text-slate-600">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-orange-500"><Wallet size={18} /></div>
                                    <div><p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Средний чек:</p><p className="font-bold text-sm tracking-tight">{(basicData as any)?.averageCheck || detailsData?.averageCheck || 0} сом</p></div>
                                </div>
                                <div className="flex items-center gap-4 text-slate-600">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-orange-500"><Star size={18} /></div>
                                    <div><p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Рейтинг:</p><div className="flex items-center gap-1.5 font-bold text-sm">{(basicData as any)?.rating || 5.0} <Star size={14} className="fill-orange-500 text-orange-500" /></div></div>
                                </div>
                            </div>
                        </div>
                    </VenueInfoCard>

                    {Array.isArray((basicData as any)?.promosRes) && (basicData as any).promosRes.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-black text-slate-900 px-2">Акции и скидки</h3>
                            {(basicData as any).promosRes.map((promo: any, idx: number) => (
                                <VenueInfoCard key={idx} onEdit={() => console.log('Edit Promo')} noPadding className="border-orange-100 bg-orange-50/20">
                                    <div className="flex h-32">
                                        <div className="w-32 bg-slate-100 relative overflow-hidden"><img src={imageData[0]?.url} className="w-full h-full object-cover" alt="" /><div className="absolute top-2 left-2 px-2 py-1 bg-rose-500 text-white text-[10px] font-black rounded-lg">-{promo.discount || 20}%</div></div>
                                        <div className="flex-1 p-4 flex flex-col justify-center"><h4 className="font-black text-slate-900 leading-tight mb-1">{promo.title || 'Специальное предложение'}</h4><p className="text-xs text-slate-500 line-clamp-2">{promo.description || 'Успейте воспользоваться выгодным предложением от нашего заведения'}</p></div>
                                    </div>
                                </VenueInfoCard>
                            ))}
                        </div>
                    )}

                    <VenueInfoCard title="Детали заведения" icon={<LayoutGrid size={20} />} onEdit={() => console.log('Edit Details')}>
                        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><Layers size={20} /></div><div><p className="text-[9px] font-black uppercase text-slate-400">Этаж</p><p className="font-bold text-sm">1 этаж</p></div></div>
                            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><Sofa size={20} /></div><div><p className="text-[9px] font-black uppercase text-slate-400">Кабины</p><p className="font-bold text-sm">Есть VIP</p></div></div>
                            {detailsData?.capacities && typeof detailsData.capacities === 'object' && !Array.isArray(detailsData.capacities) && Object.entries(detailsData.capacities as Record<string, any>).map(([title, value], i) => (
                                <div key={i} className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><Users size={20} /></div><div><p className="text-[9px] font-black uppercase text-slate-400">{title}</p><p className="font-bold text-sm">{String(value)} чел.</p></div></div>
                            ))}
                        </div>
                    </VenueInfoCard>

                    {(detailsData as any)?.typesOfCuisines && (
                        <VenueInfoCard title="Типы кухни" icon={<UtensilsCrossed size={20} />} onEdit={() => console.log('Edit Cuisines')}>
                            <div className="flex flex-wrap gap-2">{(detailsData as any).typesOfCuisines.split(',').map((cuisine: string, idx: number) => (<span key={idx} className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-xl text-xs font-black border border-orange-100 uppercase tracking-wider">{cuisine.trim()}</span>))}</div>
                        </VenueInfoCard>
                    )}

                    <VenueInfoCard
                        title="График работы"
                        icon={<Clock size={20} />}
                        onEdit={() => setIsHoursModalOpen(true)}
                    >
                        <div className="space-y-4">
                            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                                const open = (venueHours as any)?.[`${day}Open`];
                                const close = (venueHours as any)?.[`${day}Close`];
                                const labels: any = { monday: 'Понедельник', tuesday: 'Вторник', wednesday: 'Среда', thursday: 'Четверг', friday: 'Пятница', saturday: 'Суббота', sunday: 'Воскресенье' };
                                const isDayOff = open === '00:00' && close === '00:00';
                                const isToday = day === today.dayName;
                                const hasData = open && close;
                                return (
                                    <div key={day} className={`flex items-center justify-between transition-all ${isToday ? 'text-orange-600' : 'text-slate-600'}`}>
                                        <div className="flex items-center gap-2"><span className={`text-sm font-bold ${isToday ? 'font-black' : ''}`}>{labels[day]}</span>{isToday && <div className="w-1.5 h-1.5 rounded-full bg-orange-500 ml-1" />}</div>
                                        <span className={`text-sm font-bold ${isDayOff ? 'text-rose-500' : ''}`}>{!hasData ? 'Нет данных' : isDayOff ? 'Выходной' : `${open} — ${close}`}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </VenueInfoCard>

                    <VenueInfoCard title="Удобства" icon={<ConciergeBell size={20} />} onEdit={() => setIsAmenitiesModalOpen(true)}>
                        <VenueAmenityGrid amenities={amenitiesData} allAmenities={allAmenities.data as any[]} />
                    </VenueInfoCard>

                    <VenueInfoCard title="Контакты" icon={<Phone size={20} />} onEdit={() => setIsContactsModalOpen(true)}>
                        <div className="space-y-4">
                            {contactsData?.phoneNumber && (<a href={`tel:${contactsData.phoneNumber}`} className="flex items-center gap-4 group"><div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center transition-transform group-hover:scale-110"><Phone size={20} /></div><span className="font-black text-slate-800 tracking-tight">{contactsData.phoneNumber}</span></a>)}
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                                {Object.entries(contactsData?.linksSocial || {}).map(([key, val]) => {
                                    if (!val || val.trim() === "") return null;
                                    const icons: any = { instagram: <Instagram size={18} />, whatsapp: <MessageCircle size={18} />, telegram: <Send size={18} />, facebook: <Facebook size={18} />, website: <Globe size={18} /> };
                                    const labels: any = { instagram: 'Instagram', whatsapp: 'WhatsApp', telegram: 'Telegram', facebook: 'Facebook', website: 'Сайт' };
                                    return (
                                        <a key={key} href={val.startsWith('http') ? val : `https://${val}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-slate-900 hover:text-white transition-all group">
                                            <div className="text-slate-400 group-hover:text-white">{icons[key] || <Globe size={18} />}</div><span className="text-xs font-black uppercase tracking-wider">{labels[key]}</span>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </VenueInfoCard>

                    <VenueInfoCard title="Администратор" icon={<UserCog size={20} />} onEdit={() => navigate('/super-admin/venues')}>
                        {publicAdminData ? (
                            <div className="flex items-center gap-4"><div className="w-14 h-14 rounded-2xl bg-brand-primary flex items-center justify-center text-black font-black text-xl shadow-lg shadow-brand-primary/20">{(publicAdminData.fullName || 'A').charAt(0)}</div><div><h4 className="font-black text-slate-900">{publicAdminData.fullName || 'Имя не указано'}</h4><p className="text-xs text-slate-500 font-medium">{publicAdminData.email}</p></div></div>
                        ) : (<div className="p-4 text-center border-2 border-dashed border-slate-100 rounded-2xl"><p className="text-sm text-slate-400 font-medium italic">Администратор не назначен</p></div>)}
                    </VenueInfoCard>

                    <VenueInfoCard title="Описание" icon={<FileText size={20} />} onEdit={() => setIsDescModalOpen(true)}>
                        <div className="prose prose-slate max-w-none"><p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{descriptionText || basicData?.description || 'Описание пока не заполнено владельцем заведения'}</p></div>
                    </VenueInfoCard>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-lg font-black text-slate-900">Отзывы ({visibleFeedbacks?.length || 0})</h3>
                            {visibleFeedbacks?.length > 0 && (<div className="flex items-center gap-1 text-orange-500 font-bold text-sm"><Star size={14} className="fill-orange-500" />{(visibleFeedbacks.reduce((acc, f) => acc + f.rating, 0) / visibleFeedbacks.length).toFixed(1)}</div>)}
                        </div>
                        {visibleFeedbacks && visibleFeedbacks.length > 0 ? (
                            <div className="space-y-4">
                                <AnimatePresence>
                                    {visibleFeedbacks.slice(0, 5).map((feedback: any) => (
                                        <motion.div key={feedback.id} layout initial={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
                                            <VenueInfoCard noPadding className="overflow-visible">
                                                <div className="p-5 space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">{feedback.client?.image ? (<img src={feedback.client.image} className="w-full h-full object-cover" alt="" />) : (<span className="text-sm font-black text-slate-400">{(feedback.client?.fullName || 'U').charAt(0).toUpperCase()}</span>)}</div>
                                                            <div><p className="text-sm font-black text-slate-800">{feedback.client?.fullName || 'Аноним'}</p><p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{feedback.createdAt}</p></div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex items-center gap-1 px-2.5 py-1 bg-orange-50 text-orange-600 rounded-lg text-xs font-black">{feedback.rating} <Star size={10} className="fill-orange-500" /></div>
                                                            <button onClick={() => handleDeleteFeedback(feedback.id, feedback.client?.fullName || 'Аноним')} disabled={deleteFeedbackMutation.isPending} className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" title="Удалить отзыв"><Trash2 size={16} /></button>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-slate-600 leading-relaxed font-medium">{feedback.text}</p>
                                                </div>
                                            </VenueInfoCard>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {visibleFeedbacks.length > 5 && (<Button variant="ghost" className="w-full h-14 rounded-[24px] border border-slate-100 font-black text-slate-500 hover:text-orange-500 uppercase tracking-widest text-xs">Смотреть все отзывы</Button>)}
                            </div>
                        ) : (<VenueInfoCard className="text-center py-10 opacity-60"><MessageCircle size={32} className="mx-auto text-slate-300 mb-3" /><p className="text-sm text-slate-400 font-medium italic">Отзывов пока нет</p></VenueInfoCard>)}
                    </div>
                </div>
            </main>

            <VenueHoursModal
                isOpen={isHoursModalOpen}
                onClose={() => setIsHoursModalOpen(false)}
                initialHours={venueHours}
                onSave={(hours) => updateHoursMutation.mutate(hours)}
                isSaving={updateHoursMutation.isPending}
            />

            <VenueAmenitiesModal
                isOpen={isAmenitiesModalOpen}
                onClose={() => setIsAmenitiesModalOpen(false)}
                initialAmenities={amenitiesData}
                allAmenities={allAmenities.data || []}
                onSave={(ids) => updateAmenitiesMutation.mutate(ids)}
                isSaving={updateAmenitiesMutation.isPending}
            />

            <VenueContactsModal
                isOpen={isContactsModalOpen}
                onClose={() => setIsContactsModalOpen(false)}
                initialContacts={contactsData}
                onSave={(data) => updateContactsMutation.mutate(data)}
                isSaving={updateContactsMutation.isPending}
            />

            <VenueDescModal
                isOpen={isDescModalOpen}
                onClose={() => setIsDescModalOpen(false)}
                initialName={(basicData as any)?.name || basicData?.nameVenue || ''}
                initialDescription={descriptionText}
                onSave={(data) => updateDescMutation.mutate(data)}
                isSaving={updateDescMutation.isPending}
            />
        </div>
    );
};
