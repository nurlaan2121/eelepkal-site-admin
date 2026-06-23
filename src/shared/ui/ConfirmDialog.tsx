import React from "react";
import {motion, AnimatePresence} from "framer-motion";
import {AlertTriangle, X} from "lucide-react";
import {Button, Modal} from "@/shared/ui";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Подтвердить",
  cancelText = "Отмена",
  danger = false,
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      header={{title, icon: <AlertTriangle size={24} />}}
      open={isOpen}
      onClose={onClose}
      tone={danger ? "danger" : undefined}
      className="w-full max-w-md rounded-2xl"
    >
      <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
      <div className="grid grid-cols-2 gap-4">
        <Button onClick={onClose} variant="ghost">
          {cancelText}
        </Button>
        <Button onClick={handleConfirm} variant="danger">
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};
