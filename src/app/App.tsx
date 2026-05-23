import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAuthStore } from '../store/authStore';
import { LoginPage } from '../pages/auth/LoginPage';
import { SuperAdminLayout } from '../layouts/SuperAdminLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { SuperAdminDashboard } from '../pages/super-admin/dashboard/DashboardPage';
import { AdminDashboard } from '../pages/admin/dashboard/DashboardPage';
import { SuperAdminVenuesPage } from '../pages/super-admin/VenuesPage';
import { CreateVenuePage } from '../pages/super-admin/venues/CreateVenuePage';
import { SuperAdminAdminsPage } from '../pages/super-admin/admins/AdminsPage';
import { AdminTablesPage } from '../pages/admin/tables/TablesPage';
import { AdminMenuPage } from '../pages/admin/menu/MenuPage';
import { AdminBookingsPage } from '../pages/admin/bookings/BookingsPage';
import { CreateVenueWizard } from '../pages/super-admin/venues/CreateVenueWizard';
import { VenueDetailPage } from '../pages/super-admin/VenueDetailPage';

const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode, allowedRole: 'SUPER_ADMIN' | 'ADMIN' }) => {
    const { user } = useAuthStore();

    if (!user) return <Navigate to="/auth/login" replace />;
    if (user.role !== allowedRole) return <Navigate to={user.role === 'SUPER_ADMIN' ? '/super-admin/dashboard' : '/admin/dashboard'} replace />;

    return <>{children}</>;
};

export const App = () => {
    return (
        <>
            <Toaster position="top-right" richColors />
            <Routes>
                <Route path="/auth/login" element={<LoginPage />} />

                {/* Super Admin Routes */}
                <Route
                    path="/super-admin"
                    element={
                        <ProtectedRoute allowedRole="SUPER_ADMIN">
                            <SuperAdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<SuperAdminDashboard />} />
                    <Route path="venues">
                        <Route index element={<SuperAdminVenuesPage />} />
                        <Route path="create" element={<CreateVenueWizard />} />
                        <Route path=":venueId" element={<VenueDetailPage />} />
                    </Route>
                    <Route path="admins" element={<SuperAdminAdminsPage />} />
                    <Route path="bookings" element={<div>Все бронирования</div>} />
                    <Route path="statistics" element={<div>Общая статистика</div>} />
                    <Route path="settings" element={<div>Настройки системы</div>} />
                    <Route path="profile" element={<div>Профиль супер-админа</div>} />
                </Route>

                {/* Admin Routes */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRole="ADMIN">
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="my-venue" element={<div>Моё заведение</div>} />
                    <Route path="bookings" element={<div>Бронирования</div>} />
                    <Route path="tables" element={<div>Столы</div>} />
                    <Route path="menu" element={<div>Меню</div>} />
                    <Route path="customers" element={<div>Клиенты</div>} />
                    <Route path="analytics" element={<div>Аналитика заведения</div>} />
                    <Route path="profile" element={<div>Профиль админа</div>} />
                </Route>

                <Route path="/" element={<Navigate to="/auth/login" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
};
