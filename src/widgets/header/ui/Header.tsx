import {useState} from "react";
import {Bell, User, Search, Menu, X} from "lucide-react";
import {useAuthStore} from "../../../app/store/authStore";
import {useUIStore} from "../../../app/store/uiStore";
import {Input} from "@/shared/ui";
import {NotificationModal} from "./NotificationModal";

export const Header = () => {
  const {user} = useAuthStore();
  const {isMobileMenuOpen, toggleMobileMenu} = useUIStore();
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  return (
    <>
      <header className="h-16 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMobileMenu}
            className="p-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-lg lg:hidden transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="flex items-center gap-2 mr-4 min-w-0 flex-shrink-0">
            <img
              src="/logo.png"
              alt="Ээлеп кал"
              className="w-8 h-8 rounded-lg object-contain"
            />
            <span className="font-black text-brand-primary text-lg md:text-xl tracking-tighter truncate">
              Ээлеп кал
            </span>
          </div>
        </div>
        <div className="flex-1 hidden lg:block">
          <Input
            size="sm"
            icon={<Search size={16} />}
            variant="outline"
            placeholder="Поиск..."
            name="search"
          />
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsNotificationModalOpen(true)}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all relative"
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-brand-primary rounded-full border-2 border-white" />
          </button>

          <div className="h-8 w-[1px] bg-slate-100 mx-2" />

          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-900">
                {user?.phoneNumber || user?.email || "—"}
              </p>
              <p className="text-xs text-slate-500 capitalize">
                {user?.role === "SUPER_ADMIN" ? "Супер Админ" : "Менеджер"}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-primary">
              <User size={20} />
            </div>
          </div>
        </div>
      </header>

      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />
    </>
  );
};
