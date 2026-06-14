import React, {useState, useEffect} from "react";
import {
  Instagram,
  Facebook,
  Phone,
  Mail,
  MessageCircle,
  Send,
  Globe,
} from "lucide-react";
import {Button, Input, Modal} from "@/shared/ui";
import {VenueContactData} from "@/features/super-admin/venue";
import {SocialLinks} from "@/shared/types";

interface VenueContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialContacts: VenueContactData;
  onSave: (data: VenueContactData) => void;
  isSaving: boolean;
}

export const VenueContactsModal = ({
  isOpen,
  onClose,
  initialContacts,
  onSave,
  isSaving,
}: VenueContactsModalProps) => {
  const [formData, setFormData] = useState<VenueContactData>(initialContacts);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialContacts);
    }
  }, [isOpen, initialContacts]);

  const updateSocial = (key: keyof SocialLinks, value: string) => {
    setFormData((prev) => ({
      ...prev,
      linksSocial: {
        ...prev.linksSocial,
        [key]: value,
      },
    }));
  };
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      isShaded
      open={isOpen}
      onClose={onClose}
      header={{
        title: "Контакты",
        description: "Связи и социальные сети",
        icon: <Phone size={20} />,
        iconClassName: "bg-emerald-50 text-emerald-600",
      }}
      footer={
        <Button
          type="submit"
          form="venue-contacts-form"
          disabled={isSaving}
          size="lg"
          className="w-full rounded-2xl font-black uppercase tracking-widest"
        >
          {isSaving ? "Сохранение..." : "Сохранить контакты"}
        </Button>
      }
    >
      {/* Content */}
      <form
        id="venue-contacts-form"
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {/* Basic Contacts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Телефон"
            labelIcon={<Phone size={14} />}
            type="tel"
            inputMode="numeric"
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData((p) => ({
                ...p,
                phoneNumber: e.target.value,
              }))
            }
            placeholder="+996 (---) --- ---"
            name="phoneNumber"
          />
          <Input
            label="Email"
            labelIcon={<Mail size={14} />}
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((p) => ({...p, email: e.target.value}))
            }
            placeholder="example@mail.kg"
            name="email"
          />
        </div>

        {/* Social Links */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest">
            Социальные сети
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {[
              {
                key: "instagram",
                icon: Instagram,
                color: "hover:border-pink-500",
                label: "Instagram",
              },
              {
                key: "whatsapp",
                icon: MessageCircle,
                color: "hover:border-emerald-500",
                label: "WhatsApp",
              },
              {
                key: "telegram",
                icon: Send,
                color: "hover:border-sky-500",
                label: "Telegram",
              },
              {
                key: "facebook",
                icon: Facebook,
                color: "hover:border-blue-700",
                label: "Facebook",
              },
              {
                key: "website",
                icon: Globe,
                color: "hover:border-slate-800",
                label: "Вебсайт (или 2GIS)",
              },
            ].map((social) => (
              <Input
                key={social.key}
                size="sm"
                name={social.key}
                icon={<social.icon size={18} />}
                type="text"
                value={(formData.linksSocial as any)[social.key] || ""}
                onChange={(e) =>
                  updateSocial(social.key as any, e.target.value)
                }
                className={social.color}
                placeholder={social.label}
              />
            ))}
          </div>
        </div>
      </form>
    </Modal>
  );
};
