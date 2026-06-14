import {Routes, Route, Navigate} from "react-router-dom";
import {Toaster} from "sonner";
import {useAuthStore} from "./store/authStore";
import {LoginPage} from "../core/pages/auth/LoginPage";
import {SuperAdminLayout} from "../roles/super-admin/layouts/SuperAdminLayout";
import {AdminLayout} from "../roles/admin/layouts/AdminLayout";
import {SuperAdminDashboard} from "@/roles/super-admin/pages/dashboard";
import {AdminDashboard} from "@/roles/admin/pages/dashboard";
import {SuperAdminVenuesPage} from "@/roles/super-admin/pages/venues/list";
import {AdminTablesPage} from "../core/pages/admin/tables/TablesPage";
import {AdminMenuPage} from "../core/pages/admin/menu/MenuPage";
import {AdminBookingsPage} from "../core/pages/admin/bookings/BookingsPage";
import {CreateVenueWizard} from "../roles/super-admin/pages/venues/create/CreateVenueWizard";
import {AdminMyVenuePage} from "../core/pages/admin/my-venue/MyVenuePage";
import {VenueDetailPage} from "@/roles/super-admin/pages/venues/detail";
import {SuperAdminBookingsPage} from "@/roles/super-admin/pages/booking/BookingsPage";
import { SuperAdminAdminsPage } from "@/roles/super-admin/pages/administratiors";

const ProtectedRoute = ({
  children,
  allowedRole,
}: {
  children: React.ReactNode;
  allowedRole: "SUPER_ADMIN" | "ADMIN";
}) => {
  const {user} = useAuthStore();

  if (!user) return <Navigate to="/auth/login" replace />;
  if (user.role !== allowedRole)
    return (
      <Navigate
        to={
          user.role === "SUPER_ADMIN"
            ? "/super-admin/dashboard"
            : "/admin/dashboard"
        }
        replace
      />
    );

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
          <Route path="bookings" element={<SuperAdminBookingsPage />} />
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
          <Route path="my-venue" element={<AdminMyVenuePage />} />
          <Route path="bookings" element={<AdminBookingsPage />} />
          <Route path="tables" element={<AdminTablesPage />} />
          <Route path="menu" element={<AdminMenuPage />} />
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
