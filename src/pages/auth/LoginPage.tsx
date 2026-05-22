import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { LogIn, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { authService } from '../../api/auth/authService';
import { useAuthStore } from '../../store/authStore';

const loginSchema = z.object({
    email: z.string().email('Некорректный email'),
    password: z.string().min(1, 'Пароль обязателен'),
    rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage = () => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const setAuth = useAuthStore((state) => state.setAuth);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        try {
            const response = await authService.signIn({
                email: data.email,
                password: data.password,
            });

            setAuth({
                id: response.userId,
                email: response.email,
                role: response.role,
                venueId: response.venueId
            }, response.accessToken);

            toast.success('Успешный вход!');

            if (response.role === 'SUPER_ADMIN') {
                navigate('/super-admin/dashboard');
            } else {
                navigate('/admin/dashboard');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Ошибка при входе');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white md:bg-slate-50 p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-[400px]"
            >
                <div className="md:bg-white md:rounded-[32px] md:shadow-2xl md:p-10 md:border md:border-slate-100">
                    <div className="flex flex-col items-center mb-10 text-center">
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="w-20 h-20 bg-emerald-600 rounded-[24px] flex items-center justify-center mb-6 shadow-xl shadow-emerald-200"
                        >
                            <LogIn className="w-10 h-10 text-white" />
                        </motion.div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Ээлеп кал</h1>
                        <p className="text-slate-500 mt-2 font-medium">Админ-панель системы бронирования</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                                <input
                                    {...register('email')}
                                    type="email"
                                    placeholder="your@email.com"
                                    className={`w-full h-14 pl-12 pr-4 bg-slate-50 border-2 rounded-2xl text-base font-bold focus:bg-white focus:border-emerald-500 transition-all outline-none ${errors.email ? 'border-red-100 bg-red-50 text-red-900' : 'border-transparent'
                                        }`}
                                />
                            </div>
                            {errors.email && <p className="text-[10px] font-bold text-red-500 ml-1 mt-1">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Пароль</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                                <input
                                    {...register('password')}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    className={`w-full h-14 pl-12 pr-12 bg-slate-50 border-2 rounded-2xl text-base font-bold focus:bg-white focus:border-emerald-500 transition-all outline-none ${errors.password ? 'border-red-100 bg-red-50 text-red-900' : 'border-transparent'
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 active:text-emerald-500 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-[10px] font-bold text-red-500 ml-1 mt-1">{errors.password.message}</p>}
                        </div>

                        <div className="flex items-center justify-between px-1">
                            <label className="flex items-center space-x-2 cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        className="peer sr-only"
                                        {...register('rememberMe')}
                                    />
                                    <div className="w-5 h-5 border-2 border-slate-200 rounded-lg peer-checked:bg-emerald-600 peer-checked:border-emerald-600 transition-all" />
                                    <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 transition-opacity">
                                        <CheckIcon className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">Запомнить</span>
                            </label>
                            <button type="button" className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                                Сброс пароля
                            </button>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-14 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-emerald-100 active:scale-[0.98] transition-transform"
                            isLoading={isLoading}
                        >
                            Войти
                        </Button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

const CheckIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);
