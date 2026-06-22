import {UserCog} from "lucide-react";
import {InitialSecitonCardProps, VenueSectionCard} from "./VenueSectionCard";
import {GetAdminForVenue} from "../model/types";

interface Props extends InitialSecitonCardProps {
  adminData?: GetAdminForVenue;
}

export const VenueAdminCard = ({size, actions, adminData, variant}: Props) => {
  if (!adminData) return null;
  if (Object.keys(adminData).length === 0) {
    return (
      <div className="p-4 text-center border-2 border-dashed border-slate-100 rounded-2xl">
        <p className="text-sm text-slate-400 font-medium italic">
          Администратор не назначен
        </p>
      </div>
    );
  }
  return (
    <VenueSectionCard
      size={size}
      title="Администратор"
      icon={UserCog}
      variant={variant}
      actions={actions}
    >
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-brand-primary flex items-center justify-center text-white font-black text-xl shadow-lg shadow-brand-primary/20">
          {(adminData.fullName || "A").charAt(0)}
        </div>
        <div>
          <h4 className="font-black text-slate-900">
            {adminData.fullName || "Имя не указано"}
          </h4>
        </div>
      </div>
    </VenueSectionCard>
  );
};
