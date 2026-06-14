import {useVenueCreationStore} from "@/app/store/venueCreationStore";
import {Input, Input2} from "@/shared/ui";
import {
  Facebook,
  Globe,
  Instagram,
  Mail,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";

export const Step6Contacts = () => {
  const {contacts, setContacts} = useVenueCreationStore();
  const social = contacts.linksSocial || {};

  return (
    <div className="space-y-6">
      <Input
        label="Телефон"
        required
        labelIcon={<Phone size={14} />}
        type="tel"
        inputMode="numeric"
        value={contacts.phoneNumber || ""}
        onChange={(e) => setContacts({phoneNumber: e.target.value})}
        placeholder="+996 555 01 23 45"
        name="phoneNumber"
      />
      <Input
        label="Email"
        labelIcon={<Mail size={14} />}
        required
        type="email"
        value={contacts.email || ""}
        onChange={(e) => setContacts({email: e.target.value})}
        placeholder="info@venue.ru"
        name="email"
      />

      <div className="space-y-4">
        <label className="block text-sm font-bold text-slate-700">
          Социальные сети
        </label>
        <Input
          size="sm"
          icon={<Instagram size={18} />}
          value={social.instagram || ""}
          onChange={(e) =>
            setContacts({linksSocial: {...social, instagram: e.target.value}})
          }
          placeholder="@venue_ru"
          name="instagram"
        />
        <Input
          size="sm"
          icon={<MessageCircle size={18} />}
          value={social.whatsapp || ""}
          onChange={(e) =>
            setContacts({linksSocial: {...social, whatsapp: e.target.value}})
          }
          placeholder="+996 555 01 23 45"
          name="whatsapp"
        />
        <Input
          size="sm"
          icon={<Send size={18} />}
          value={social.telegram || ""}
          onChange={(e) =>
            setContacts({linksSocial: {...social, telegram: e.target.value}})
          }
          placeholder="@venue_ru"
          name="telegram"
        />
        <Input
          size="sm"
          icon={<Facebook size={18} />}
          value={social.facebook || ""}
          onChange={(e) =>
            setContacts({linksSocial: {...social, facebook: e.target.value}})
          }
          placeholder="https://facebook.com/venue.ru"
          name="faceboook"
        />

        <Input
          size="sm"
          icon={<Globe size={18} />}
          value={social.website || ""}
          onChange={(e) =>
            setContacts({linksSocial: {...social, website: e.target.value}})
          }
          placeholder="https://venue.ru"
          name="website"
        />
      </div>
    </div>
  );
};
