import {VenueListItem} from "@/features/super-admin/venue";
import {MapPin, Star, Store, User} from "lucide-react";
import {useState} from "react";
import {VenueActionMenu} from "./VenueActionMenu";
import {AnimatePresence} from "framer-motion";
import {ModalType} from "../../model/types";
import {ReplaceAdminModal} from "../ReplaceAdminModal";
import {CuisinesModal} from "../CuisinesModal";
import {BookingConditionsModal} from "../BookingConditionModal";
import {PaymentModal} from "../payment-details";

export const VenueCard = ({
  venue,
  onDelete,
  isDeleting,
  onClick,
}: {
  venue: VenueListItem;
  onDelete: (id: number) => void;
  isDeleting: boolean;
  onClick: () => void;
}) => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  return (
    <>
      <div
        onClick={onClick}
        className="p-5 bg-white hover:bg-gradient-to-br hover:from-brand-50/50 hover:to-white transition-all duration-300 cursor-pointer group active:scale-[0.995] border-b border-slate-100 last:border-b-0"
      >
        <div className="flex items-start gap-4">
          {/* Image */}
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-brand-100 to-brand-50 flex-shrink-0 shadow-lg shadow-brand-100/50 ring-2 ring-white group-hover:shadow-xl group-hover:shadow-brand-200/50 transition-all duration-300">
            {venue.firstImageUrl ? (
              <img
                src={venue.firstImageUrl}
                alt={venue.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-brand-400">
                <Store size={36} className="opacity-60" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="font-black text-slate-900 text-lg leading-tight line-clamp-2 group-hover:text-brand-700 transition-colors">
                {venue.name}
              </h3>
              <div className="flex-shrink-0 -mt-1">
                <VenueActionMenu
                  isDeleting={isDeleting}
                  venue={venue}
                  onDelete={onDelete}
                  setActiveModal={setActiveModal}
                />
              </div>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center gap-1.5 text-xs font-black text-amber-600 bg-gradient-to-r from-amber-50 to-amber-100/50 px-2.5 py-1 rounded-lg border border-amber-200/50 shadow-sm">
                <Star
                  size={12}
                  fill="currentColor"
                  className="text-amber-500"
                />
                {venue.rating}
              </span>
              <span className="text-xs font-bold text-slate-600 bg-gradient-to-r from-slate-50 to-slate-100/50 px-2.5 py-1 rounded-lg border border-slate-200/50 shadow-sm">
                ≈ {venue.averageCheck} сом
              </span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="mt-4 ml-28 space-y-2.5">
          {/* Address */}
          <div className="flex items-start gap-2.5 bg-gradient-to-r from-slate-50 to-transparent rounded-xl px-3.5 py-2.5 border border-slate-100">
            <div className="w-6 h-6 rounded-lg bg-brand-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <MapPin size={14} className="text-brand-600" />
            </div>
            <span className="text-sm font-semibold text-slate-700 line-clamp-2 leading-relaxed">
              {venue.address}
            </span>
          </div>

          {/* Admin */}
          <div className="flex items-center gap-2.5 px-1">
            <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
              <User size={13} className="text-slate-500" />
            </div>
            <span className="text-xs font-medium text-slate-500">
              Администратор:{" "}
              <span className="text-slate-800 font-black">
                {venue.adminFullName}
              </span>
            </span>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {activeModal === "replace-admin" && (
          <ReplaceAdminModal
            venue={venue}
            onClose={() => setActiveModal(null)}
          />
        )}
        {activeModal === "cuisines" && (
          <CuisinesModal venue={venue} onClose={() => setActiveModal(null)} />
        )}
        {activeModal === "conditions" && (
          <BookingConditionsModal
            venue={venue}
            onClose={() => setActiveModal(null)}
          />
        )}
        {activeModal === "payment" && (
          <PaymentModal venue={venue} onClose={() => setActiveModal(null)} />
        )}
      </AnimatePresence>
    </>
  );
};
