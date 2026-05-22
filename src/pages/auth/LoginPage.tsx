import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, User, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { authService } from '../../api/auth/authService';
import { useAuthStore } from '../../store/authStore';

const loginSchema = z.object({
    email: z.string().email('Некорректный email'),
    password: z.string().min(1, 'Пароль обязателен'),
    rememberMe: z.boolean().optional(),
});

const registerSchema = z.object({
    fullName: z.string().min(2, 'Минимум 2 символа'),
    email: z.string().email('Некорректный email'),
    password: z.string().min(8, 'Пароль должен быть не менее 8 символов'),
    phoneNumber: z.string().regex(/^\d{9}$/, 'Введите 9 цифр номера (напр: 705123456)'),
});

const otpSchema = z.object({
    otp: z.string().length(4, 'OTP должен состоять из 4 цифр'),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;

export const LoginPage = () => {
    const [isLogin, setIsLogin] = React.useState(true);
    const [isVerifying, setIsVerifying] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [showRegisterPassword, setShowRegisterPassword] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [resendTimer, setResendTimer] = React.useState(0);
    const setAuth = useAuthStore((state) => state.setAuth);
    const navigate = useNavigate();

    const {
        register: registerLogin,
        handleSubmit: handleSubmitLogin,
        formState: { errors: loginErrors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const {
        register: registerSignup,
        handleSubmit: handleSubmitSignup,
        formState: { errors: registerErrors },
        getValues: getSignupValues,
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const {
        register: registerOtp,
        handleSubmit: handleSubmitOtp,
        formState: { errors: otpErrors },
    } = useForm<OtpFormValues>({
        resolver: zodResolver(otpSchema),
    });

    // Handle resend timer
    React.useEffect(() => {
        let interval: any;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    const onLoginSubmit = async (data: LoginFormValues) => {
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
            }, response.token);

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

    const startResendTimer = () => setResendTimer(90);

    const onRegisterSubmit = async (data: RegisterFormValues) => {
        setIsLoading(true);
        try {
            const formattedData = {
                ...data,
                phoneNumber: `+996${data.phoneNumber}`
            };
            const response = await authService.signUpSuperAdmin(formattedData);

            if (response?.httpStatus === 'OK') {
                toast.success(response?.message || 'Код подтверждения отправлен на вашу почту!');
                setIsVerifying(true);
                startResendTimer();
            } else {
                toast.error(response?.message || 'Ошибка при регистрации');
            }
        } catch (error: any) {
            console.error('Registration error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Ошибка при регистрации';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (resendTimer > 0) return;
        const data = getSignupValues();
        await onRegisterSubmit(data);
    };

    const onOtpSubmit = async (data: OtpFormValues) => {
        setIsLoading(true);
        try {
            const signupData = getSignupValues();
            const response = await authService.verifyEmail({
                email: signupData.email,
                otp: data.otp
            });

            setAuth({
                id: response.userId,
                email: response.email,
                role: response.role,
                venueId: response.venueId
            }, response.token);

            toast.success('Регистрация успешно завершена!');
            navigate('/super-admin/dashboard');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Неверный OTP код');
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
                className="w-full max-w-[440px]"
            >
                <div className="md:bg-white md:rounded-[32px] md:shadow-2xl md:p-10 md:border md:border-slate-100">
                    <div className="flex flex-col items-center mb-10 text-center">
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="w-16 h-16 mb-4"
                        >
                            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                        </motion.div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Ээлеп кал</h1>
                        <p className="text-slate-500 mt-2 font-medium">
                            {isVerifying ? 'Подтверждение почты' : isLogin ? 'Админ-панель системы бронирования' : 'Регистрация нового супер-админа'}
                        </p>
                    </div>

                    {!isVerifying && (
                        <div className="flex p-1 bg-slate-100 rounded-2xl mb-8">
                            <button
                                onClick={() => setIsLogin(true)}
                                className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${isLogin ? 'bg-white text-brand-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Вход
                            </button>
                            <button
                                onClick={() => setIsLogin(false)}
                                className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${!isLogin ? 'bg-white text-brand-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Регистрация
                            </button>
                        </div>
                    )}

                    <AnimatePresence mode="wait">
                        {isVerifying ? (
                            <motion.form
                                key="otp"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                onSubmit={handleSubmitOtp(onOtpSubmit)}
                                className="space-y-6"
                            >
                                <div className="text-center mb-6">
                                    <p className="text-sm text-slate-500 font-medium">Мы отправили 4-значный код на <br /> <span className="font-bold text-slate-900">{getSignupValues().email}</span></p>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Код из письма</label>
                                    <input
                                        {...registerOtp('otp')}
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        onInput={(e) => {
                                            e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
                                        }}
                                        maxLength={4}
                                        placeholder="0000"
                                        className="w-full h-16 text-center text-3xl font-black tracking-[0.5em] bg-slate-50 border-2 border-transparent focus:bg-white focus:border-brand-primary rounded-2xl transition-all outline-none"
                                    />
                                    {otpErrors.otp && <p className="text-[10px] font-bold text-red-500 text-center mt-1">{otpErrors.otp.message}</p>}
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-14 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-brand-100"
                                    isLoading={isLoading}
                                >
                                    Подтвердить
                                </Button>

                                <div className="text-center">
                                    <button
                                        type="button"
                                        disabled={resendTimer > 0}
                                        onClick={handleResendOtp}
                                        className={`text-xs font-black uppercase tracking-widest transition-colors ${resendTimer > 0 ? 'text-slate-300' : 'text-brand-primary hover:text-brand-700'}`}
                                    >
                                        Отправить код повторно {resendTimer > 0 && `(${Math.floor(resendTimer / 60)}:${(resendTimer % 60).toString().padStart(2, '0')})`}
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setIsVerifying(false)}
                                    className="w-full text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest"
                                >
                                    Назад к регистрации
                                </button>
                            </motion.form>
                        ) : isLogin ? (
                            <motion.form
                                key="login"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onSubmit={handleSubmitLogin(onLoginSubmit)}
                                className="space-y-6"
                            >
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                                        <input
                                            {...registerLogin('email')}
                                            type="email"
                                            placeholder="your@email.com"
                                            className={`w-full h-14 pl-12 pr-4 bg-slate-50 border-2 rounded-2xl text-base font-bold focus:bg-white focus:border-brand-primary transition-all outline-none ${loginErrors.email ? 'border-red-100 bg-red-50 text-red-900' : 'border-transparent'}`}
                                        />
                                    </div>
                                    {loginErrors.email && <p className="text-[10px] font-bold text-red-500 ml-1 mt-1">{loginErrors.email.message}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Пароль</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                                        <input
                                            {...registerLogin('password')}
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            className={`w-full h-14 pl-12 pr-12 bg-slate-50 border-2 rounded-2xl text-base font-bold focus:bg-white focus:border-brand-primary transition-all outline-none ${loginErrors.password ? 'border-red-100 bg-red-50 text-red-900' : 'border-transparent'}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 active:text-brand-primary transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    {loginErrors.password && <p className="text-[10px] font-bold text-red-500 ml-1 mt-1">{loginErrors.password.message}</p>}
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-14 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-brand-100 active:scale-[0.98] transition-transform"
                                    isLoading={isLoading}
                                >
                                    Войти
                                </Button>
                            </motion.form>
                        ) : (
                            <motion.form
                                key="register"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleSubmitSignup(onRegisterSubmit)}
                                className="space-y-5"
                            >
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">ФИО</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                                        <input
                                            {...registerSignup('fullName')}
                                            type="text"
                                            placeholder="Асан Асанов"
                                            className={`w-full h-14 pl-12 pr-4 bg-slate-50 border-2 rounded-2xl text-base font-bold focus:bg-white focus:border-brand-primary transition-all outline-none ${registerErrors.fullName ? 'border-red-100 bg-red-50 text-red-900' : 'border-transparent'}`}
                                        />
                                    </div>
                                    {registerErrors.fullName && <p className="text-[10px] font-bold text-red-500 ml-1 mt-1">{registerErrors.fullName.message}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                                        <input
                                            {...registerSignup('email')}
                                            type="email"
                                            placeholder="your@email.com"
                                            className={`w-full h-14 pl-12 pr-4 bg-slate-50 border-2 rounded-2xl text-base font-bold focus:bg-white focus:border-brand-primary transition-all outline-none ${registerErrors.email ? 'border-red-100 bg-red-50 text-red-900' : 'border-transparent'}`}
                                        />
                                    </div>
                                    {registerErrors.email && <p className="text-[10px] font-bold text-red-500 ml-1 mt-1">{registerErrors.email.message}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Телефон</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                                            <Phone className="w-5 h-5 text-slate-400" />
                                            <span className="text-base font-bold text-slate-900 border-r border-slate-200 pr-2">+996</span>
                                        </div>
                                        <input
                                            {...registerSignup('phoneNumber')}
                                            type="tel"
                                            placeholder="770123456"
                                            className={`w-full h-14 pl-24 pr-4 bg-slate-50 border-2 rounded-2xl text-base font-bold focus:bg-white focus:border-brand-primary transition-all outline-none ${registerErrors.phoneNumber ? 'border-red-100 bg-red-50 text-red-900' : 'border-transparent'}`}
                                        />
                                    </div>
                                    {registerErrors.phoneNumber && <p className="text-[10px] font-bold text-red-500 ml-1 mt-1">{registerErrors.phoneNumber.message}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Пароль</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                                        <input
                                            {...registerSignup('password')}
                                            type={showRegisterPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            className={`w-full h-14 pl-12 pr-12 bg-slate-50 border-2 rounded-2xl text-base font-bold focus:bg-white focus:border-brand-primary transition-all outline-none ${registerErrors.password ? 'border-red-100 bg-red-50 text-red-900' : 'border-transparent'}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 active:text-brand-primary transition-colors"
                                        >
                                            {showRegisterPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    {registerErrors.password && <p className="text-[10px] font-bold text-red-500 ml-1 mt-1">{registerErrors.password.message}</p>}
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-14 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-brand-100 active:scale-[0.98] transition-transform"
                                    isLoading={isLoading}
                                >
                                    Зарегистрироваться
                                </Button>
                            </motion.form>
                        )}
                    </AnimatePresence>
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
