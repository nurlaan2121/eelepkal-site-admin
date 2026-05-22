import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, ChevronLeft, Store, Info, Share2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import {
    basicInfoSchema,
    detailsSchema,
    socialSchema,
    BasicInfoData,
    DetailsData,
    SocialData
} from '../../../schemas/venueSchema';

const STEPS = [
    { id: 1, title: 'Основная информация', icon: Store },
    { id: 2, title: 'Детали', icon: Info },
    { id: 3, title: 'Соцсети и Теги', icon: Share2 },
];

export const CreateVenuePage: React.FC = () => {
    const [currentStep, setCurrentStep] = React.useState(1);
    const navigate = useNavigate();

    // Form states for each step
    const basicForm = useForm<BasicInfoData>({ resolver: zodResolver(basicInfoSchema) });
    const detailsForm = useForm<DetailsData>({ resolver: zodResolver(detailsSchema) });
    const socialForm = useForm<SocialData>({
        resolver: zodResolver(socialSchema),
        defaultValues: { tags: [] }
    });

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

    const onSubmit = async () => {
        const allData = {
            ...basicForm.getValues(),
            ...detailsForm.getValues(),
            ...socialForm.getValues(),
        };
        console.log('Final Data:', allData);
        // Here we would call the multi-step API endpoints sequentially
        alert('Заведение успешно создано (имитация API)!');
        navigate('/super-admin/venues');
    };

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Создание заведения</h1>
                <p className="text-gray-500">Заполните данные для регистрации нового ресторана в системе</p>
            </div>

            {/* Stepper */}
            <div className="flex items-center gap-4 mb-12">
                {STEPS.map((step, i) => (
                    <React.Fragment key={step.id}>
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${currentStep >= step.id ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-400'
                                }`}>
                                {currentStep > step.id ? <Check size={20} /> : <step.icon size={20} />}
                            </div>
                            <div className="hidden md:block">
                                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Шаг {step.id}</p>
                                <p className={`text-sm font-semibold ${currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {step.title}
                                </p>
                            </div>
                        </div>
                        {i < STEPS.length - 1 && (
                            <div className={`flex-1 h-px ${currentStep > step.id ? 'bg-brand-600' : 'bg-gray-200'}`} />
                        )}
                    </React.Fragment>
                ))}
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden">
                <div className="p-8">
                    <AnimatePresence mode="wait">
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Название заведения</label>
                                        <Input {...basicForm.register('name')} placeholder="Напр: Bellagio" error={basicForm.formState.errors.name?.message} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Бренд</label>
                                        <Input {...basicForm.register('brandName')} placeholder="Напр: Bellagio Group" error={basicForm.formState.errors.brandName?.message} />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Адрес</label>
                                        <Input {...basicForm.register('address')} placeholder="г. Бишкек, ул. Ибраимова 115" error={basicForm.formState.errors.address?.message} />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Описание</label>
                                        <textarea
                                            {...basicForm.register('description')}
                                            className="w-full min-h-[120px] p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                                            placeholder="Опишите заведение, атмосферу, кухню..."
                                        />
                                        {basicForm.formState.errors.description && (
                                            <p className="text-xs text-red-500">{basicForm.formState.errors.description.message}</p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Телефон</label>
                                        <Input {...detailsForm.register('phone')} placeholder="+996 555 123 456" error={detailsForm.formState.errors.phone?.message} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Email</label>
                                        <Input {...detailsForm.register('email')} placeholder="office@venue.kg" error={detailsForm.formState.errors.email?.message} />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Ссылка на карту (2GIS/Google)</label>
                                        <Input {...detailsForm.register('location')} placeholder="https://2gis.kg/bishkek/..." error={detailsForm.formState.errors.location?.message} />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="space-y-6"
                            >
                                <div className="space-y-4">
                                    <label className="text-sm font-medium text-gray-700">Instagram Username</label>
                                    <Input {...socialForm.register('instagram')} placeholder="@bellagio_kg" />
                                </div>
                                {/* Simplified Tag selection for demo */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Теги (категории)</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['Ресторан', 'Кафе', 'Лаунж', 'Кальянная', 'Чайхана', 'Караоке'].map(tag => (
                                            <button
                                                key={tag}
                                                type="button"
                                                onClick={() => {
                                                    const current = socialForm.getValues('tags') || [];
                                                    if (current.includes(tag)) {
                                                        socialForm.setValue('tags', current.filter(t => t !== tag));
                                                    } else {
                                                        socialForm.setValue('tags', [...current, tag]);
                                                    }
                                                    socialForm.trigger('tags');
                                                }}
                                                className={`px-4 py-2 rounded-full text-sm border transition-all ${(socialForm.watch('tags') || []).includes(tag)
                                                    ? 'bg-brand-600 border-brand-600 text-white'
                                                    : 'bg-white border-gray-200 text-gray-600 hover:border-brand-600'
                                                    }`}
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                    {socialForm.formState.errors.tags && (
                                        <p className="text-xs text-red-500">{socialForm.formState.errors.tags.message}</p>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-between">
                    <Button
                        variant="ghost"
                        onClick={currentStep === 1 ? () => navigate('/super-admin/venues') : prevStep}
                        className="gap-2"
                    >
                        <ChevronLeft size={18} />
                        {currentStep === 1 ? 'Отмена' : 'Назад'}
                    </Button>

                    <Button
                        onClick={async () => {
                            let isValid = false;
                            if (currentStep === 1) isValid = await basicForm.trigger();
                            if (currentStep === 2) isValid = await detailsForm.trigger();
                            if (currentStep === 3) isValid = await socialForm.trigger();

                            if (isValid) {
                                if (currentStep < 3) nextStep();
                                else onSubmit();
                            }
                        }}
                        className="gap-2"
                    >
                        {currentStep === 3 ? 'Создать заведение' : 'Продолжить'}
                        {currentStep < 3 && <ChevronRight size={18} />}
                    </Button>
                </div>
            </div>
        </div>
    );
};
