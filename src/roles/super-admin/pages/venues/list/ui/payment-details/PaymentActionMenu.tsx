import {GetPaymentDetailResponse} from "@/features/super-admin/venue";
import {ActionMenu, type ActionMenuItem} from "@/shared/ui";
import {Settings2, Trash2} from "lucide-react";

export const PaymentActionMenu = ({
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
  const items: ActionMenuItem[] = [
    {
      id: "edit",
      icon: <Settings2 size={16} />,
      label: "Изменить",
      color: "text-amber-600",
      onClick: () => onEdit(payment),
    },
    {
      id: "delete",
      icon: <Trash2 size={16} />,
      label: "Удалить",
      danger: true,
      disabled: isDeleting,
      color: 'text-red-600',
      onClick: () => onDelete(payment.id),
    },
  ];

  return <ActionMenu items={items} variant="dark" />;
};
