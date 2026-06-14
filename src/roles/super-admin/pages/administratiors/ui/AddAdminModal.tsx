import React, {useState} from "react";
import {User, Phone, Lock, Shield, CheckCircle, Mail} from "lucide-react";
import {toast} from "sonner";
import {
  AddPersonalRequest,
  superAdminManageOfAdminsService,
  VerifyPersonalOtpRequest,
} from "@/features/super-admin/admin";
import {Button, Input} from "@/shared/ui";
import {Modal} from "@/shared/ui/Modal";
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
      await superAdminManageOfAdminsService.addPersonal(formData);
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
      await superAdminManageOfAdminsService.verifyPersonalOtp(verifyData);
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
      className=""
      open={isOpen}
      isShaded
      onClose={handleClose}
      header={{
        title:
          step === "form" ? "Добавить администратора" : "Подтверждение номера",
        icon: <Shield size={20} className="text-brand-700" />,
      }}
      footer={
        step === "form" ? (
          <Button
            form="add-admin-form"
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Отправка..." : "Добавить и получить OTP"}
          </Button>
        ) : (
          <div className="space-y-3">
            <Button
              form="otr-form"
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Проверка..." : "Подтвердить номер"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => setStep("form")}
              className="w-full "
            >
              Назад
            </Button>
          </div>
        )
      }
    >
      {step === "form" ? (
        <form
          id="add-admin-form"
          onSubmit={handleSubmitForm}
          className="space-y-5"
        >
          {/* Full Name */}
          <Input
            label="Полное имя"
            labelIcon={<User size={14} />}
            required
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Иван Иванов"
          />

          {/* Phone Number (required) */}
          <Input
            label="Номер телефона"
            description="Формат: 996XXXXXXXXX (без + и пробелов)"
            labelIcon={<Phone size={14} />}
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
            inputMode="numeric"
            maxLength={12}
            required
          />

          <Input
            label="Email"
            labelIcon={<Mail size={14} />}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="admin@venue.kg"
          />

          <Input
            label="Пароль"
            labelIcon={<Lock size={14} />}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Минимум 6 символов"
            required
            minLength={6}
          />
        </form>
      ) : (
        <form id="otr-form" onSubmit={handleVerifyOtp} className="space-y-6">
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
          <Input
            className="text-center"
            label="ОТР код"
            labelIcon={<CheckCircle size={14} />}
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="Введите 6-значный код"
            maxLength={6}
            required
          />
        </form>
      )}
    </Modal>
  );
};
