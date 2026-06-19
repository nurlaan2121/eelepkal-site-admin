import React, {useState} from "react";
import {NavLink} from "react-router-dom";
import {cn} from "../../../shared/utils/cn";
import {
  LayoutDashboard,
  Store,
  Users,
  CalendarCheck,
  BarChart3,
  Settings,
  UserCircle,
  LogOut,
  ChevronLeft,
  X,
} from "lucide-react";
import {useAuthStore} from "../../../app/store/authStore";
import {useUIStore} from "../../../app/store/uiStore";
import {motion, AnimatePresence} from "framer-motion";
import {ConfirmDialog} from "../../../core/components/ui/ConfirmDialog";

const MENU_ITEMS = [
  {
    icon: LayoutDashboard,
    label: "Панель управления",
    path: "/super-admin/dashboard",
  },
  {icon: Store, label: "Заведения", path: "/super-admin/venues"},
  {icon: Users, label: "Администраторы", path: "/super-admin/admins"},
  {icon: CalendarCheck, label: "Бронирования", path: "/super-admin/bookings"},
  {icon: BarChart3, label: "Статистика", path: "/super-admin/statistics"},
  {icon: Settings, label: "Настройки", path: "/super-admin/settings"},
  {icon: UserCircle, label: "Профиль", path: "/super-admin/profile"},
];

export const SuperAdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const logout = useAuthStore((state) => state.logout);
  const {isMobileMenuOpen, closeMobileMenu} = useUIStore();
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const sidebarContent = (
    <aside
      className={cn(
        "bg-white border-r border-slate-100 h-full transition-all duration-300 flex flex-col z-40 relative shadow-2xl lg:shadow-none",
        isCollapsed ? "w-20" : "w-64",
        "lg:translate-x-0", // Always show on desktop
      )}
    >
      <div className="p-6 flex items-center justify-between">
        {(!isCollapsed || isMobileMenuOpen) && (
          <span className="text-xl font-bold text-brand-primary whitespace-nowrap">
            Ээлеп кал
          </span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 transition-colors hidden lg:block"
        >
          <ChevronLeft
            className={cn(
              "w-5 h-5 transition-transform",
              isCollapsed && "rotate-180",
            )}
          />
        </button>
        <button
          onClick={closeMobileMenu}
          className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 transition-colors lg:hidden"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto scrollbar-hide">
        {MENU_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => {
              if (window.innerWidth < 1024) closeMobileMenu();
            }}
            className={({isActive}) =>
              cn(
                "flex items-center px-3 py-3 rounded-xl transition-all group",
                isActive
                  ? "bg-brand-50 text-brand-primary font-semibold"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
              )
            }
          >
            <item.icon
              className={cn(
                "w-5 h-5",
                isCollapsed && !isMobileMenuOpen
                  ? "mx-auto"
                  : "mr-3 text-slate-400 group-hover:text-brand-primary transition-colors",
              )}
            />
            {(!isCollapsed || isMobileMenuOpen) && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-50">
        <button
          onClick={() => setIsLogoutConfirmOpen(true)}
          className={cn(
            "flex items-center w-full px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all group",
            isCollapsed && !isMobileMenuOpen ? "justify-center" : "",
          )}
        >
          <LogOut
            className={cn(
              "w-5 h-5",
              isCollapsed && !isMobileMenuOpen ? "" : "mr-3",
            )}
          />
          {(!isCollapsed || isMobileMenuOpen) && (
            <span className="font-medium">Выйти</span>
          )}
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-screen sticky top-0">
        {sidebarContent}
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              onClick={closeMobileMenu}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            {/* Drawer */}
            <motion.div
              initial={{x: "-100%"}}
              animate={{x: 0}}
              exit={{x: "-100%"}}
              transition={{type: "spring", damping: 25, stiffness: 200}}
              className="absolute left-0 top-0 bottom-0 w-64 bg-white"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={isLogoutConfirmOpen}
        onClose={() => setIsLogoutConfirmOpen(false)}
        onConfirm={logout}
        title="Выход из аккаунта"
        message="Вы действительно хотите выйти из системы? Вам придется снова войти, чтобы получить доступ к панели управления."
        confirmText="Выйти"
        cancelText="Отмена"
        danger
      />
    </>
  );
};
