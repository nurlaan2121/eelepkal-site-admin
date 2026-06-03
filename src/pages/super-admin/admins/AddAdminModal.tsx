import React, {useState} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {X, Mail, User, Phone, Lock, Shield, CheckCircle} from "lucide-react";
import {toast} from "sonner";
import {
  superAdminService,
  AddPersonalRequest,
  VerifyPersonalEmailRequest,
} from "../../../api/admin/superAdminService";
import {Modal} from "../../../components/ui/Modal";

interface AddAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddAdminModal: React.FC<AddAdminModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<"form" | "otp">("form");
  const [formData, setFormData] = useState<AddPersonalRequest>({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData((prev) => ({...prev, [name]: value}));
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.password) {
      toast.error("Заполните все обязательные поля");
      return;
    }

    setIsSubmitting(true);
    try {
      await superAdminService.addPersonal(formData);
      toast.success("OTP отправлен на email");
      setStep("otp");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Ошибка при отправке OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Введите OTP код");
      return;
    }

    setIsSubmitting(true);
    try {
      const verifyData: VerifyPersonalEmailRequest = {
        email: formData.email,
        otp,
      };
      await superAdminService.verifyPersonalEmail(verifyData);
      toast.success("Администратор успешно добавлен");
      onSuccess();
      handleClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Ошибка подтверждения OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep("form");
    setFormData({fullName: "", phoneNumber: "", email: "", password: ""});
    setOtp("");
    onClose();
  };

  return (
    <Modal
      header={{
        title:
          step === "form" ? "Добавить администратора" : "Подтверждение email",
        icon: <Shield size={20} className="text-brand-700" />,
      }}
      open={isOpen}
      onClose={handleClose}
      content={
        step === "form" ? (
          <form onSubmit={handleSubmitForm} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Полное имя <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Иван Иванов"
                  className="w-full h-12 pl-10 pr-4 bg-slate-50 rounded-xl text-sm font-medium border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="admin@venue.kg"
                  className="w-full h-12 pl-10 pr-4 bg-slate-50 rounded-xl text-sm font-medium border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                  required
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Телефон
              </label>
              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="+998 90 123 45 67"
                  className="w-full h-12 pl-10 pr-4 bg-slate-50 rounded-xl text-sm font-medium border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Пароль <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Минимум 6 символов"
                  className="w-full h-12 pl-10 pr-4 bg-slate-50 rounded-xl text-sm font-medium border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-brand-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-100 hover:bg-brand-800 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isSubmitting ? "Отправка..." : "Добавить и получить OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            {/* Info */}
            <div className="bg-brand-50 border border-brand-100 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <Mail
                  size={20}
                  className="text-brand-700 flex-shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    OTP отправлен
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    Мы отправили код подтверждения на{" "}
                    <strong>{formData.email}</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* OTP Input */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                OTP код <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <CheckCircle
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="Введите 6-значный код"
                  className="w-full h-12 pl-10 pr-4 bg-slate-50 rounded-xl text-sm font-medium border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-center tracking-widest"
                  maxLength={6}
                  required
                />
              </div>
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-brand-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-100 hover:bg-brand-800 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Проверка..." : "Подтвердить email"}
            </button>

            {/* Back Button */}
            <button
              type="button"
              onClick={() => setStep("form")}
              className="w-full h-12 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 active:scale-95 transition-all"
            >
              Назад
            </button>
          </form>
        )
      }
    />
  );
};
