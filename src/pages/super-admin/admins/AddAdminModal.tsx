import React, {useState} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {X, User, Phone, Lock, Shield, CheckCircle} from "lucide-react";
import {toast} from "sonner";
import {
  superAdminService,
  AddPersonalRequest,
  VerifyPersonalOtpRequest,
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

    if (!formData.fullName || !formData.phoneNumber || !formData.password) {
      toast.error("Заполните все обязательные поля");
      return;
    }

    setIsSubmitting(true);
    try {
      await superAdminService.addPersonal(formData);
      toast.success("OTP отправлен на номер телефона");
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
      const verifyData: VerifyPersonalOtpRequest = {
        phoneNumber: formData.phoneNumber,
        otp,
      };
      await superAdminService.verifyPersonalOtp(verifyData);
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
      open={isOpen}
      onClose={handleClose}
      header={{
        title:
          step === "form" ? "Добавить администратора" : "Подтверждение номера",
        icon: <Shield size={20} className="text-brand-700" />,
      }}
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

            {/* Phone Number (required) */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Номер телефона <span className="text-red-500">*</span>
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
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      phoneNumber: e.target.value.replace(/\D/g, ""),
                    }))
                  }
                  placeholder="996700123456"
                  className="w-full h-12 pl-10 pr-4 bg-slate-50 rounded-xl text-sm font-medium border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                  inputMode="numeric"
                  maxLength={12}
                  required
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Формат: 996XXXXXXXXX (без + и пробелов)
              </p>
            </div>

            {/* Email (optional) */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Lock
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
                <Phone
                  size={20}
                  className="text-brand-700 flex-shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    OTP отправлен
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    Мы отправили код подтверждения на{" "}
                    <strong>{formData.phoneNumber}</strong>
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
              {isSubmitting ? "Проверка..." : "Подтвердить номер"}
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
