import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../utils/cn';
import {
    LayoutDashboard,
    Store,
    Users,
    CalendarCheck,
    BarChart3,
    Settings,
    UserCircle,
    LogOut,
    ChevronLeft
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const MENU_ITEMS = [
    { icon: LayoutDashboard, label: 'Панель управления', path: '/super-admin/dashboard' },
    { icon: Store, label: 'Заведения', path: '/super-admin/venues' },
    { icon: Users, label: 'Администраторы', path: '/super-admin/admins' },
    { icon: CalendarCheck, label: 'Бронирования', path: '/super-admin/bookings' },
    { icon: BarChart3, label: 'Статистика', path: '/super-admin/statistics' },
    { icon: Settings, label: 'Настройки', path: '/super-admin/settings' },
    { icon: UserCircle, label: 'Профиль', path: '/super-admin/profile' },
];

export const SuperAdminSidebar = () => {
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const logout = useAuthStore((state) => state.logout);

    return (
        <aside
            className={cn(
                "bg-white border-r border-slate-100 h-screen transition-all duration-300 flex flex-col",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            <div className="p-6 flex items-center justify-between">
                {!isCollapsed && <span className="text-xl font-bold text-brand-primary">Ээлеп кал</span>}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 transition-colors"
                >
                    <ChevronLeft className={cn("w-5 h-5 transition-transform", isCollapsed && "rotate-180")} />
                </button>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {MENU_ITEMS.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex items-center px-3 py-2.5 rounded-xl transition-all group",
                            isActive
                                ? "bg-brand-50 text-brand-primary font-semibold"
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        )}
                    >
                        <item.icon className={cn("w-5 h-5", isCollapsed ? "mx-auto" : "mr-3")} />
                        {!isCollapsed && <span>{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-50">
                <button
                    onClick={logout}
                    className={cn(
                        "flex items-center w-full px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-all",
                        isCollapsed ? "justify-center" : ""
                    )}
                >
                    <LogOut className={cn("w-5 h-5", isCollapsed ? "" : "mr-3")} />
                    {!isCollapsed && <span className="font-medium">Выйти</span>}
                </button>
            </div>
        </aside>
    );
};
