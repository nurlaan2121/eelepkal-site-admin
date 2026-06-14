import {GetPaymentDetailResponse} from "@/features/super-admin/venue";
import {Input} from "@/shared/ui";
import {CreditCard, Key, Landmark, User} from "lucide-react";
import {SubmitEventHandler} from "react";

export const PaymentForm = ({
  editingPayment,
  handleFileChange,
  isUploading,
  qrPreview,
  onSubmit,
}: {
  editingPayment: GetPaymentDetailResponse | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
  qrPreview: string | null;
  onSubmit: SubmitEventHandler<HTMLFormElement>;
}) => {
  return (
    <form id="payment-form" onSubmit={onSubmit} className="space-y-4">
      <Input
        label="Название банка"
        icon={<Landmark size={18} />}
        required
        type="text"
        name="bankName"
        defaultValue={editingPayment?.bankName || ""}
        placeholder="Например: ОТП Банк"
      />

      <Input
        label="Номер счёта"
        icon={<Key size={18} />}
        required
        type="text"
        name="bankAccountNumber"
        defaultValue={editingPayment?.bankAccountNumber || ""}
        placeholder="0000 0000 0000 0000"
      />

      <Input
        label="ИНН"
        icon={<User size={18} />}
        required
        type="text"
        name="taxIdentificationNumber"
        defaultValue={editingPayment?.taxIdentificationNumber || ""}
        placeholder="0000000000"
      />

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">
          QR код для оплаты
        </label>
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-brand-primary/50 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="qr-upload"
            disabled={isUploading}
          />
          <label htmlFor="qr-upload" className="cursor-pointer">
            {qrPreview ? (
              <div className="space-y-3">
                <div className="relative p-4">
                  <img
                    src={qrPreview}
                    alt="Предпросмотр QR"
                    className="w-48 h-48 mx-auto object-cover rounded-lg box-content"
                  />
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {isUploading ? "Загрузка..." : "Нажмите для изменения"}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {isUploading ? (
                  <>
                    <div className="relative h-48">
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                      </div>
                    </div>
                    <p className="text-sm font-bold text-brand-600">
                      Загрузка QR кода...
                    </p>
                  </>
                ) : (
                  <>
                    <CreditCard size={32} className="mx-auto text-slate-300" />
                    <p className="text-sm font-bold text-slate-600">
                      Загрузить QR код
                    </p>
                    <p className="text-xs text-slate-400">PNG, JPG до 5MB</p>
                  </>
                )}
              </div>
            )}
          </label>
        </div>
      </div>
    </form>
  );
};
