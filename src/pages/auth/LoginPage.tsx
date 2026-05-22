import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { LogIn, Eye, EyeOff } from 'lucide-react';
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
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mb-4">
                            <LogIn className="w-8 h-8 text-brand-primary" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">Вход в систему</h1>
                        <p className="text-slate-500 mt-1">Добро пожаловать в админ-панель Ээлеп кал</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <Input
                            label="Электронная почта"
                            placeholder="name@example.com"
                            type="email"
                            error={errors.email?.message}
                            {...register('email')}
                        />

                        <div className="relative">
                            <Input
                                label="Пароль"
                                placeholder="••••••••"
                                type={showPassword ? 'text' : 'password'}
                                error={errors.password?.message}
                                {...register('password')}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
                                    {...register('rememberMe')}
                                />
                                <span className="text-sm text-slate-600">Запомнить меня</span>
                            </label>
                            <button type="button" className="text-sm font-medium text-brand-primary hover:underline">
                                Забыли пароль?
                            </button>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
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
