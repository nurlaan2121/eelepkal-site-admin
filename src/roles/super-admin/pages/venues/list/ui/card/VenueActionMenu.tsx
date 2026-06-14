import {VenueListItem} from "@/features/super-admin/venue";
import {CreditCard, Settings2, Trash2, UserCog, Utensils} from "lucide-react";
import {ActionMenu, type ActionMenuItem} from "@/shared/ui";
import {ModalType} from "../../model/types";

export const VenueActionMenu = ({
  venue,
  onDelete,
  isDeleting,
  setActiveModal,
}: {
  venue: VenueListItem;
  onDelete: (id: number) => void;
  isDeleting: boolean;
  setActiveModal: (modal: ModalType) => void;
}) => {
  const items: ActionMenuItem[] = [
    {
      id: "replace-admin",
      icon: <UserCog size={16} />,
      label: "Заменить администратора",
      color: "text-brand-600",
      onClick: () => setActiveModal("replace-admin"),
    },
    {
      id: "cuisines",
      icon: <Utensils size={16} />,
      label: "Тип кухни",
      color: "text-orange-600",
      onClick: () => setActiveModal("cuisines"),
    },
    {
      id: "conditions",
      icon: <Settings2 size={16} />,
      label: "Условия бронирования",
      color: "text-amber-600",
      onClick: () => setActiveModal("conditions"),
    },
    {
      id: "payment",
      icon: <CreditCard size={16} />,
      label: "Реквизиты оплаты",
      color: "text-emerald-600",
      onClick: () => setActiveModal("payment"),
    },
    {
      id: "delete",
      icon: <Trash2 size={16} />,
      label: "Удалить заведение",
      color: "text-red-500",
      danger: true,
      disabled: isDeleting,
      divider: true,
      onClick: () => {
        if (confirm("Удалить заведение?")) onDelete(venue.venueId);
      },
    },
  ];

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      className="flex-shrink-0"
    >
      <ActionMenu items={items} variant="light" />
    </div>
  );
};
