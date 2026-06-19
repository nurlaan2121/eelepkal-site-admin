import {InitialSecitonCardProps, VenueSectionCard} from "./VenueSectionCard";
import {Mail, Phone, MessageCircle, Globe} from "lucide-react";
import {type LucideIcon} from "lucide-react";
import {ContactsDataType} from "../model/contacts/types";
import {Facebook, Instagram, Telegram, Whatsapp} from "@/shared/assets";
import {FunctionComponent, ReactNode, SVGProps} from "react";

interface ContactItem {
  key: string;
  label: string;
  icon: LucideIcon | FunctionComponent<SVGProps<SVGSVGElement>>;
  bgColor: string;
  borderColor?: string;
  iconBg: string;
  iconColor: string;
  optional?: boolean;
  link?: string;
}

const CONTACT_ITEMS: ContactItem[] = [
  {
    key: "phone number",
    label: "Телефон",
    icon: Phone,
    bgColor: "bg-slate-50",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    link: "tel:",
  },
  {
    key: "email",
    label: "Email",
    icon: Mail,
    bgColor: "bg-slate-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    link: "mailto:",
  },
  {
    key: "instagram",
    label: "Instagram",
    icon: Instagram,
    bgColor: "bg-gradient-to-r from-purple-50 to-pink-50",
    borderColor: "border-purple-100",
    iconBg: "bg-gradient-to-br from-purple-500 to-pink-500",
    iconColor: "text-white size-[18px]",
    optional: true,
    link: "https://www.instagram.com/",
  },
  {
    key: "telegram",
    label: "Telegram",
    icon: Telegram,
    bgColor: "bg-blue-50",
    borderColor: "border-blue-100",
    iconBg: "bg-blue-500",
    iconColor: "text-white size-[18px]",
    optional: true,
    link: "https://t.me/",
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    icon: Whatsapp,
    bgColor: "bg-green-50",
    borderColor: "border-green-100",
    iconBg: "bg-green-500",
    iconColor: "text-white size-[18px]",
    optional: true,
    link: "https://wa.me/",
  },
  {
    key: "facebook",
    label: "Facebook",
    icon: Facebook,
    bgColor: "bg-blue-50",
    borderColor: "border-blue-100",
    iconBg: "bg-blue-600",
    iconColor: "text-white size-[18px]",
    optional: true,
    link: "https://facebook.com",
  },
  {
    key: "website",
    label: "Сайт",
    icon: Globe,
    bgColor: "bg-slate-50",
    iconBg: "bg-slate-600",
    iconColor: "text-white",
    optional: true,
  },
];

interface ContactsSectionCardProps extends InitialSecitonCardProps {
  contactsData?: ContactsDataType;
}

export const ContactsSectionCard = ({
  className,
  actions,
  variant,
  contactsData,
  delay,
}: ContactsSectionCardProps) => {
  if (!contactsData) return null;
  return (
    <VenueSectionCard
      className={className}
      actions={actions}
      variant={variant}
      title="Контакты"
      icon={Phone}
      transition={{delay}}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CONTACT_ITEMS.map((item) => {
          const value = contactsData[item.key];

          // Skip optional fields that are empty
          if (item.optional && !value) return null;
          if (!value) return null;

          const Icon = item.icon;

          return (
            <a
              href={item.link ? item.link + value : value}
              target={"_blank"}
              rel={"noreferrer noopener"}
              key={item.key}
              className={`flex items-center gap-3 p-4 ${item.bgColor} rounded-xl hover:scale-105 duration-150 ${item.borderColor ?? ""}`}
            >
              <span
                className={`w-10 h-10 rounded-lg ${item.iconBg} flex items-center justify-center`}
              >
                <Icon size={18} className={item.iconColor} />
              </span>
              <span className="flex flex-col">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {item.label}
                </span>
                <span className="text-sm font-black text-slate-900">
                  {value}
                </span>
              </span>
            </a>
          );
        })}
      </div>
    </VenueSectionCard>
  );
};
