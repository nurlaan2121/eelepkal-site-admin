import {PaymentActionMenu} from "./PaymentActionMenu";
import {GetPaymentDetailResponse} from "@/features/super-admin/venue";
import {CreditCard} from "lucide-react";

export const PaymentCard = ({
  payment,
  onEdit,
  onDelete,
  isDeleting,
}: {
  payment: GetPaymentDetailResponse;
  onEdit: (payment: GetPaymentDetailResponse) => void;
  onDelete: (paymentId: number) => void;
  isDeleting: boolean;
}) => {
  return (
    <div className="relative bg-gradient-to-br from-brand-950 to-brand-700 rounded-2xl p-5 text-white space-y-4">
      <div className="absolute top-4 right-4">
        <PaymentActionMenu
          payment={payment}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      </div>

      <div className="flex items-center justify-between pr-10">
        <p className="text-xs font-black uppercase tracking-widest text-white/60">
          Реквизиты банка
        </p>
        <CreditCard size={20} className="text-white/60" />
      </div>
      <div className="space-y-2">
        <div>
          <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">
            Банк
          </p>
          <p className="font-black text-white">{payment.bankName || "—"}</p>
        </div>
        <div>
          <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">
            Счёт
          </p>
          <p className="font-black text-white tracking-widest">
            {payment.bankAccountNumber || "—"}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">
            ИНН
          </p>
          <p className="font-black text-white">
            {payment.taxIdentificationNumber || "—"}
          </p>
        </div>
      </div>
      {payment.qrcodeUrl && (
        <div className="bg-white rounded-xl p-3 flex justify-center">
          <img
            src={payment.qrcodeUrl}
            alt="QR код"
            className="w-48 h-48 object-cover"
          />
        </div>
      )}
    </div>
  );
};
