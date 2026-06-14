import {PaymentCard} from "./PaymentCard";
import {GetPaymentDetailResponse} from "@/features/super-admin/venue";

export const PaymentList = ({
  payments,
  isDeleting,
  onEdit,
  onDelete,
}: {
  payments: GetPaymentDetailResponse[];
  isDeleting: boolean;
  onEdit: (payment: GetPaymentDetailResponse) => void;
  onDelete: (paymentId: number) => void;
}) => {
  return (
    <>
      {payments.map((p) => (
        <PaymentCard
          key={p.id}
          payment={p}
          isDeleting={isDeleting}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </>
  );
};
