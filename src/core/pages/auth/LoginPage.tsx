import React from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {motion, AnimatePresence} from "framer-motion";
import {Eye, EyeOff, Lock, Phone, User, ArrowLeft} from "lucide-react";
import {toast} from "sonner";
import {useNavigate} from "react-router-dom";
import {Button} from "@/shared/ui";
import {authService} from "@/api/auth/authService";
import {useAuthStore} from "@/app/store/authStore";
import {updateSEO, PAGE_SEO} from "@/shared/utils/seo";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Strip everything except digits from a phone string */
const cleanPhone = (raw: string) => raw.replace(/\D/g, "");

// ─── Zod Schemas ─────────────────────────────────────────────────────────────

const phoneField = z
  .string()
  .transform(cleanPhone)
  .pipe(z.string().regex(/^996\d{9}$/, "Введите номер в формате 996XXXXXXXXX"));

const loginSchema = z.object({
  phoneNumber: phoneField,
  password: z.string().min(1, "Пароль обязателен"),
});

const registerPhoneSchema = z.object({
  phoneNumber: phoneField,
});

const registerFormSchema = z.object({
  fullName: z.string().min(2, "Минимум 2 символа"),
  email: z.string().email("Неверный формат email"),
  password: z.string().min(8, "Пароль должен быть не менее 8 символов"),
  phoneNumber: phoneField,
});

const registerVerifySchema = z.object({
  otpCode: z.string().length(4, "OTP должен состоять из 4 цифр"),
});

const forgotPhoneSchema = z.object({
  phoneNumber: phoneField,
});

const resetPasswordSchema = z.object({
  otpCode: z.string().length(4, "OTP должен состоять из 4 цифр"),
  newPassword: z.string().min(8, "Пароль должен быть не менее 8 символов"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerFormSchema>;
type RegisterVerifyFormValues = z.infer<typeof registerVerifySchema>;
type ForgotPhoneFormValues = z.infer<typeof forgotPhoneSchema>;
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

// ─── Screen discriminator ─────────────────────────────────────────────────────

type Screen =
  | {kind: "login"}
  | {kind: "register-phone"}
  | {kind: "register-verify"; phone: string}
  | {kind: "forgot-phone"}
  | {kind: "forgot-reset"; phone: string};

// ─── Component ───────────────────────────────────────────────────────────────

export const LoginPage = () => {
  const [screen, setScreen] = React.useState<Screen>({kind: "login"});
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [cooldownTimer, setCooldownTimer] = React.useState(0);
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  React.useEffect(() => {
    updateSEO(PAGE_SEO.login);
  }, []);

  // Cooldown countdown
  React.useEffect(() => {
    if (cooldownTimer <= 0) return;
    const id = setInterval(() => setCooldownTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [cooldownTimer]);

  const formatCooldown = () =>
    `${Math.floor(cooldownTimer / 60)}:${(cooldownTimer % 60).toString().padStart(2, "0")}`;

  // ── Login ──────────────────────────────────────────────────────────────

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await authService.signIn({
        phoneNumber: data.phoneNumber,
        password: data.password,
      });
      setAuth(
        {
          id: response.userId,
          phoneNumber: response.phoneNumber,
          email: response.email,
          role: response.role,
          venueId: response.venueId,
        },
        response.token,
      );
      toast.success("Успешный вход!");
      navigate(
        response.role === "SUPER_ADMIN"
          ? "/super-admin/dashboard"
          : "/admin/dashboard",
      );
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Ошибка при входе");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Register – step 1 (send OTP) ────────────────────────────────────────

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
  });

  const onRegisterSendOtp = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const res = await authService.sendOtpSms({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        phoneNumber: data.phoneNumber,
      });
      const isError =
        res?.status === "BAD_REQUEST" || res?.httpStatus === "BAD_REQUEST";
      if (!isError) {
        toast.success(res?.message || "OTP отправлен на ваш номер");
        setScreen({kind: "register-verify", phone: data.phoneNumber});
      } else {
        toast.error(res?.message || "Ошибка при отправке OTP");
      }
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Ошибка при отправке OTP";
      toast.error(msg);
      // cooldown error – lock the button
      // if (error.response?.status === 429) setCooldownTimer(300);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Register – step 2 (verify + create account) ─────────────────────────

  const regVerifyForm = useForm<RegisterVerifyFormValues>({
    resolver: zodResolver(registerVerifySchema),
  });

  const onRegisterVerify = async (data: RegisterVerifyFormValues) => {
    if (screen.kind !== "register-verify") return;
    setIsLoading(true);
    try {
      const response = await authService.verifyOtp({
        phoneNumber: screen.phone,
        otp: data.otpCode,
      });
      setAuth(
        {
          id: response.userId,
          phoneNumber: response.phoneNumber,
          email: response.email,
          role: response.role,
          venueId: response.venueId,
        },
        response.token,
      );
      toast.success("Регистрация успешно завершена!");
      navigate("/super-admin/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Неверный OTP код");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Forgot password – step 1 ────────────────────────────────────────────

  const forgotPhoneForm = useForm<ForgotPhoneFormValues>({
    resolver: zodResolver(forgotPhoneSchema),
  });

  const onForgotSendOtp = async (data: ForgotPhoneFormValues) => {
    setIsLoading(true);
    try {
      const res = await authService.forgotPassword({
        phoneNumber: data.phoneNumber,
      });
      toast.success(res?.message || "OTP отправлен на ваш номер");
      setScreen({kind: "forgot-reset", phone: data.phoneNumber});
      // setCooldownTimer(300);
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Ошибка при отправке OTP";
      toast.error(msg);
      // if (error.response?.status === 429) setCooldownTimer(300);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Forgot password – step 2 ────────────────────────────────────────────

  const resetForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onResetPassword = async (data: ResetPasswordFormValues) => {
    if (screen.kind !== "forgot-reset") return;
    setIsLoading(true);
    try {
      const res = await authService.resetPassword({
        phoneNumber: screen.phone,
        otpCode: data.otpCode,
        newPassword: data.newPassword,
      });
      toast.success(res?.message || "Пароль успешно сброшен!");
      setScreen({kind: "login"});
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Ошибка при сбросе пароля");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Resend OTP (re-use step 1 for current screen) ───────────────────────

  const handleResendOtp = async () => {
    if (cooldownTimer > 0) return;
    if (screen.kind === "register-verify") {
      setIsLoading(true);
      try {
        // Resend OTP using stored registration data
        const formData = registerForm.getValues();
        await authService.sendOtpSms({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          phoneNumber: screen.phone,
        });
        toast.success("OTP отправлен повторно");
        setCooldownTimer(300);
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Ошибка при повторной отправке",
        );
        if (error.response?.status === 429) setCooldownTimer(300);
      } finally {
        setIsLoading(false);
      }
    } else if (screen.kind === "forgot-reset") {
      setIsLoading(true);
      try {
        await authService.forgotPassword({phoneNumber: screen.phone});
        toast.success("OTP отправлен повторно");
        setCooldownTimer(300);
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Ошибка при повторной отправке",
        );
        if (error.response?.status === 429) setCooldownTimer(300);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // ── Phone input handler (digits only) ───────────────────────────────────

  const phoneInputProps = (fieldName: string) => ({
    type: "tel" as const,
    inputMode: "numeric" as const,
    placeholder: "996700123456",
    onInput: (e: React.FormEvent<HTMLInputElement>) => {
      e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
    },
    maxLength: 12,
  });

  // ── Render ──────────────────────────────────────────────────────────────

  const screenTitle = () => {
    switch (screen.kind) {
      case "login":
        return "Админ-панель системы бронирования";
      case "register-phone":
        return "Регистрация нового супер-админа";
      case "register-verify":
        return "Подтверждение номера";
      case "forgot-phone":
        return "Восстановление пароля";
      case "forgot-reset":
        return "Сброс пароля";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white md:bg-slate-50 p-6">
      <motion.div
        initial={{opacity: 0, scale: 0.95}}
        animate={{opacity: 1, scale: 1}}
        transition={{duration: 0.5, ease: "easeOut"}}
        className="w-full max-w-[440px]"
      >
        <div className="md:bg-white md:rounded-[32px] md:shadow-2xl md:p-10 md:border md:border-slate-100">
          {/* Logo */}
          <div className="flex flex-col items-center mb-10 text-center">
            <motion.div
              initial={{y: -20, opacity: 0}}
              animate={{y: 0, opacity: 1}}
              transition={{delay: 0.2}}
              className="w-16 h-16 mb-4"
            >
              <img
                src="/logo.png"
                alt="Логотип"
                className="w-full h-full object-contain"
              />
            </motion.div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Ээлеп кал
            </h1>
            <p className="text-slate-500 mt-2 font-medium">{screenTitle()}</p>
          </div>

          {/* Tab bar – only on login / register-phone */}
          {(screen.kind === "login" || screen.kind === "register-phone") && (
            <div className="flex p-1 bg-slate-100 rounded-2xl mb-8">
              <button
                onClick={() => setScreen({kind: "login"})}
                className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${screen.kind === "login" ? "bg-white text-brand-primary shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
              >
                Вход
              </button>
              <button
                onClick={() => setScreen({kind: "register-phone"})}
                className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${screen.kind === "register-phone" ? "bg-white text-brand-primary shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
              >
                Регистрация
              </button>
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* ── LOGIN ─────────────────────────────────────────────────── */}
            {screen.kind === "login" && (
              <motion.form
                key="login"
                initial={{opacity: 0, x: -20}}
                animate={{opacity: 1, x: 0}}
                exit={{opacity: 0, x: 20}}
                onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                className="space-y-6"
              >
                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Номер телефона
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <input
                      {...loginForm.register("phoneNumber")}
                      {...phoneInputProps("phoneNumber")}
                      className={`w-full h-14 pl-12 pr-4 bg-slate-50 border-2 rounded-2xl text-base font-bold focus:bg-white focus:border-brand-primary transition-all outline-none ${loginForm.formState.errors.phoneNumber ? "border-red-100 bg-red-50 text-red-900" : "border-transparent"}`}
                    />
                  </div>
                  {loginForm.formState.errors.phoneNumber && (
                    <p className="text-[10px] font-bold text-red-500 ml-1 mt-1">
                      {loginForm.formState.errors.phoneNumber.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Пароль
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <input
                      {...loginForm.register("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={`w-full h-14 pl-12 pr-12 bg-slate-50 border-2 rounded-2xl text-base font-bold focus:bg-white focus:border-brand-primary transition-all outline-none ${loginForm.formState.errors.password ? "border-red-100 bg-red-50 text-red-900" : "border-transparent"}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 active:text-brand-primary transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-[10px] font-bold text-red-500 ml-1 mt-1">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-brand-100 active:scale-[0.98] transition-transform"
                  isLoading={isLoading}
                >
                  Войти
                </Button>

                {/* Forgot password link */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setScreen({kind: "forgot-phone"})}
                    className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-brand-primary transition-colors"
                  >
                    Забыли пароль?
                  </button>
                </div>
              </motion.form>
            )}

            {/* ── REGISTER STEP 1: full form ───────────────────────────────── */}
            {screen.kind === "register-phone" && (
              <motion.form
                key="register-phone"
                initial={{opacity: 0, x: 20}}
                animate={{opacity: 1, x: 0}}
                exit={{opacity: 0, x: -20}}
                onSubmit={registerForm.handleSubmit(onRegisterSendOtp)}
                className="space-y-6"
              >
                {/* Full name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    ФИО
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <input
                      {...registerForm.register("fullName")}
                      type="text"
                      placeholder="Асан Асанов"
                      className={`w-full h-14 pl-12 pr-4 bg-slate-50 border-2 rounded-2xl text-base font-bold focus:bg-white focus:border-brand-primary transition-all outline-none ${registerForm.formState.errors.fullName ? "border-red-100 bg-red-50 text-red-900" : "border-transparent"}`}
                    />
                  </div>
                  {registerForm.formState.errors.fullName && (
                    <p className="text-[10px] font-bold text-red-500 ml-1 mt-1">
                      {registerForm.formState.errors.fullName.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      {...registerForm.register("email")}
                      type="email"
                      placeholder="example@mail.com"
                      className={`w-full h-14 pl-4 pr-4 bg-slate-50 border-2 rounded-2xl text-base font-bold focus:bg-white focus:border-brand-primary transition-all outline-none ${registerForm.formState.errors.email ? "border-red-100 bg-red-50 text-red-900" : "border-transparent"}`}
                    />
                  </div>
                  {registerForm.formState.errors.email && (
                    <p className="text-[10px] font-bold text-red-500 ml-1 mt-1">
                      {registerForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Пароль
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <input
                      {...registerForm.register("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="Минимум 8 символов"
                      className={`w-full h-14 pl-12 pr-12 bg-slate-50 border-2 rounded-2xl text-base font-bold focus:bg-white focus:border-brand-primary transition-all outline-none ${registerForm.formState.errors.password ? "border-red-100 bg-red-50 text-red-900" : "border-transparent"}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 active:text-brand-primary transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {registerForm.formState.errors.password && (
                    <p className="text-[10px] font-bold text-red-500 ml-1 mt-1">
                      {registerForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Номер телефона
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <input
                      {...registerForm.register("phoneNumber")}
                      {...phoneInputProps("phoneNumber")}
                      className={`w-full h-14 pl-12 pr-4 bg-slate-50 border-2 rounded-2xl text-base font-bold focus:bg-white focus:border-brand-primary transition-all outline-none ${registerForm.formState.errors.phoneNumber ? "border-red-100 bg-red-50 text-red-900" : "border-transparent"}`}
                    />
                  </div>
                  {registerForm.formState.errors.phoneNumber && (
                    <p className="text-[10px] font-bold text-red-500 ml-1 mt-1">
                      {registerForm.formState.errors.phoneNumber.message}
                    </p>
                  )}
                  <p className="text-[10px] text-slate-400 ml-1 mt-1">
                    Формат: 996XXXXXXXXX (без + и пробелов)
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-brand-100 active:scale-[0.98] transition-transform"
                  isLoading={isLoading}
                  disabled={cooldownTimer > 0}
                >
                  {cooldownTimer > 0
                    ? `Подождите ${formatCooldown()}`
                    : "Получить код"}
                </Button>
              </motion.form>
            )}

            {/* ── REGISTER STEP 2: OTP only ───────────────────────────────── */}
            {screen.kind === "register-verify" && (
              <motion.form
                key="register-verify"
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -20}}
                onSubmit={regVerifyForm.handleSubmit(onRegisterVerify)}
                className="space-y-5"
              >
                <div className="text-center mb-4">
                  <p className="text-sm text-slate-500 font-medium">
                    Мы отправили 4-значный SMS-код на <br />
                    <span className="font-bold text-slate-900">
                      {screen.phone}
                    </span>
                  </p>
                </div>

                {/* OTP */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Код из СМС
                  </label>
                  <input
                    {...regVerifyForm.register("otpCode")}
                    type="text"
                    inputMode="numeric"
                    onInput={(e) => {
                      e.currentTarget.value = e.currentTarget.value.replace(
                        /\D/g,
                        "",
                      );
                    }}
                    maxLength={4}
                    placeholder="0000"
                    className="w-full h-16 text-center text-3xl font-black tracking-[0.5em] bg-slate-50 border-2 border-transparent focus:bg-white focus:border-brand-primary rounded-2xl transition-all outline-none"
                  />
                  {regVerifyForm.formState.errors.otpCode && (
                    <p className="text-[10px] font-bold text-red-500 text-center mt-1">
                      {regVerifyForm.formState.errors.otpCode.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-brand-100"
                  isLoading={isLoading}
                >
                  Подтвердить
                </Button>

                {/* Resend */}
                <div className="text-center">
                  <button
                    type="button"
                    disabled={cooldownTimer > 0 || isLoading}
                    onClick={handleResendOtp}
                    className={`text-xs font-black uppercase tracking-widest transition-colors ${cooldownTimer > 0 || isLoading ? "text-slate-300" : "text-brand-primary hover:text-brand-700"}`}
                  >
                    Отправить код повторно{" "}
                    {cooldownTimer > 0 && `(${formatCooldown()})`}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setScreen({kind: "register-phone"})}
                  className="w-full flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest"
                >
                  <ArrowLeft size={12} /> Назад к вводу номера
                </button>
              </motion.form>
            )}

            {/* ── FORGOT PASSWORD STEP 1: phone ─────────────────────────── */}
            {screen.kind === "forgot-phone" && (
              <motion.form
                key="forgot-phone"
                initial={{opacity: 0, x: -20}}
                animate={{opacity: 1, x: 0}}
                exit={{opacity: 0, x: 20}}
                onSubmit={forgotPhoneForm.handleSubmit(onForgotSendOtp)}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Номер телефона
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <input
                      {...forgotPhoneForm.register("phoneNumber")}
                      {...phoneInputProps("phoneNumber")}
                      className={`w-full h-14 pl-12 pr-4 bg-slate-50 border-2 rounded-2xl text-base font-bold focus:bg-white focus:border-brand-primary transition-all outline-none ${forgotPhoneForm.formState.errors.phoneNumber ? "border-red-100 bg-red-50 text-red-900" : "border-transparent"}`}
                    />
                  </div>
                  {forgotPhoneForm.formState.errors.phoneNumber && (
                    <p className="text-[10px] font-bold text-red-500 ml-1 mt-1">
                      {forgotPhoneForm.formState.errors.phoneNumber.message}
                    </p>
                  )}
                  <p className="text-[10px] text-slate-400 ml-1 mt-1">
                    Введите номер, привязанный к вашему аккаунту
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-brand-100 active:scale-[0.98] transition-transform"
                  isLoading={isLoading}
                >
                  Получить код
                </Button>

                <button
                  type="button"
                  onClick={() => setScreen({kind: "login"})}
                  className="w-full flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest"
                >
                  <ArrowLeft size={12} /> Назад ко входу
                </button>
              </motion.form>
            )}

            {/* ── FORGOT PASSWORD STEP 2: OTP + new password ────────────── */}
            {screen.kind === "forgot-reset" && (
              <motion.form
                key="forgot-reset"
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -20}}
                onSubmit={resetForm.handleSubmit(onResetPassword)}
                className="space-y-6"
              >
                <div className="text-center mb-4">
                  <p className="text-sm text-slate-500 font-medium">
                    Мы отправили 4-значный SMS-код на <br />
                    <span className="font-bold text-slate-900">
                      {screen.phone}
                    </span>
                  </p>
                </div>

                {/* OTP */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Код из СМС
                  </label>
                  <input
                    {...resetForm.register("otpCode")}
                    type="text"
                    inputMode="numeric"
                    onInput={(e) => {
                      e.currentTarget.value = e.currentTarget.value.replace(
                        /\D/g,
                        "",
                      );
                    }}
                    maxLength={4}
                    placeholder="0000"
                    className="w-full h-16 text-center text-3xl font-black tracking-[0.5em] bg-slate-50 border-2 border-transparent focus:bg-white focus:border-brand-primary rounded-2xl transition-all outline-none"
                  />
                  {resetForm.formState.errors.otpCode && (
                    <p className="text-[10px] font-bold text-red-500 text-center mt-1">
                      {resetForm.formState.errors.otpCode.message}
                    </p>
                  )}
                </div>

                {/* New password */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Новый пароль
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <input
                      {...resetForm.register("newPassword")}
                      type={showPassword ? "text" : "password"}
                      placeholder="Минимум 8 символов"
                      className={`w-full h-14 pl-12 pr-12 bg-slate-50 border-2 rounded-2xl text-base font-bold focus:bg-white focus:border-brand-primary transition-all outline-none ${resetForm.formState.errors.newPassword ? "border-red-100 bg-red-50 text-red-900" : "border-transparent"}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 active:text-brand-primary transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {resetForm.formState.errors.newPassword && (
                    <p className="text-[10px] font-bold text-red-500 ml-1 mt-1">
                      {resetForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-brand-100"
                  isLoading={isLoading}
                >
                  Сбросить пароль
                </Button>

                {/* Resend */}
                <div className="text-center">
                  <button
                    type="button"
                    disabled={cooldownTimer > 0 || isLoading}
                    onClick={handleResendOtp}
                    className={`text-xs font-black uppercase tracking-widest transition-colors ${cooldownTimer > 0 || isLoading ? "text-slate-300" : "text-brand-primary hover:text-brand-700"}`}
                  >
                    Отправить код повторно{" "}
                    {cooldownTimer > 0 && `(${formatCooldown()})`}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setScreen({kind: "login"})}
                  className="w-full flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest"
                >
                  <ArrowLeft size={12} /> Назад ко входу
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
