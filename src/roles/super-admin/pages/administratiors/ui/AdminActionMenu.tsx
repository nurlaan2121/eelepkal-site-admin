import {AdminPersonal} from "@/features/super-admin/admin";
import {ActionMenu, ActionMenuItem} from "@/shared/ui";
import {AnimatePresence, motion} from "framer-motion";
import {MoreVertical, Trash2} from "lucide-react";
import {useEffect, useRef, useState} from "react";

// ─── Admin Action Menu ───
export const AdminActionMenu = ({
  admin,
  onDelete,
  isDeleting,
}: {
  admin: AdminPersonal;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}) => {
  const items: ActionMenuItem[] = [{
    id: "delete",
    icon: <Trash2 size={16} />,
    label: "Удалить",
    color: "text-red-500",
    danger: true,
    onClick: () => {
      if (confirm(`Удалить администратора ${admin.fullName}?`))
        onDelete(admin.id);
    },
    disabled: isDeleting,
  }];

  return <ActionMenu items={items} variant="light" />;
};
