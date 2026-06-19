import React, {useState, useEffect} from "react";
import {FileText, PenLine, Type} from "lucide-react";
import {Button, Input, Modal, TextArea} from "@/shared/ui";

interface VenueDescModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialName: string;
  initialDescription: string;
  onSave: (data: {name: string; description: string}) => void;
  isSaving: boolean;
}

export const VenueDescriptionModal = ({
  isOpen,
  onClose,
  initialName,
  initialDescription,
  onSave,
  isSaving,
}: VenueDescModalProps) => {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setDescription(initialDescription);
    }
  }, [isOpen, initialName, initialDescription]);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave({name, description});
  };
  return (
    <Modal
      isShaded
      open={isOpen}
      onClose={onClose}
      header={{
        title: "Основная информация",
        description: "Название и описание заведения",
        icon: <FileText size={20} className="text-orange-600" />,
        iconClassName: "bg-orange-50",
      }}
      footer={
        <Button
          type="submit"
          disabled={isSaving || !name.trim()}
          size="lg"
          className="w-full rounded-2xl font-black uppercase tracking-widest"
          form="venue-description-form"
        >
          {isSaving ? "Сохранение..." : "Обновить информацию"}
        </Button>
      }
    >
      <form
        id="venue-description-form"
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Name */}
        <Input
          label="Название заведения"
          labelIcon={<Type size={14} />}
          type="text"
          value={name}
          name="venueName"
          onChange={(e) => setName(e.target.value)}
          placeholder="Введите название..."
        />
        {/* Description */}
        <TextArea
          className="min-h-[150px]"
          label="Описание"
          icon={<PenLine size={14} />}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={8}
          name="description"
          placeholder="Расскажите о заведении..."
        />
      </form>
    </Modal>
  );
};
