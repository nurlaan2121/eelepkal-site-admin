import { AdminPersonal } from "@/features/super-admin/admin";
import { Mail, MapPin, Phone, Shield } from "lucide-react";
import { AdminActionMenu } from "./AdminActionMenu";

// ─── Admin Card ───
export const AdminCard = ({
  admin,
  onDelete,
  isDeleting,
}: {
  admin: AdminPersonal;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}) => {
  const initials = admin.fullName
    .split(" ")
    .map((n) => n.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const colors = [
    "from-brand-700 to-brand-950",
    "from-violet-600 to-purple-900",
    "from-emerald-600 to-teal-900",
    "from-amber-500 to-orange-800",
    "from-rose-600 to-pink-900",
  ];
  const colorClass = colors[admin.id % colors.length];

  return (
    <div className="p-4 bg-white">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorClass} flex items-center justify-center text-white font-black text-lg flex-shrink-0 shadow-sm`}
        >
          {initials || <Shield size={22} />}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-black text-slate-900 text-base leading-tight truncate">
                {admin.fullName}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[10px] font-black text-brand-700 bg-brand-50 px-2 py-0.5 rounded-lg border border-brand-100 uppercase tracking-widest">
                  Администратор
                </span>
              </div>
            </div>
            <AdminActionMenu
              admin={admin}
              onDelete={onDelete}
              isDeleting={isDeleting}
            />
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
          <Mail size={13} className="flex-shrink-0 text-brand-500" />
          <span className="text-xs font-semibold text-slate-600 truncate">
            {admin.email}
          </span>
        </div>
        {admin.phoneNumber && (
          <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
            <Phone size={13} className="flex-shrink-0 text-emerald-500" />
            <span className="text-xs font-semibold text-slate-600">
              {admin.phoneNumber}
            </span>
          </div>
        )}
        {admin.workAddress && (
          <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
            <MapPin size={13} className="flex-shrink-0 text-amber-500" />
            <span className="text-xs font-semibold text-slate-600 line-clamp-1">
              {admin.workAddress}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
