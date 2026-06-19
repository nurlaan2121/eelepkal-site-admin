import {Routes, Route, Navigate} from "react-router-dom";
import {Toaster} from "sonner";
import {LoginPage} from "@/pages/auth";
import {SuperAdminLayout} from "@/pages/super-admin/layouts";
import {AdminLayout} from "@/pages/admin/layouts";
import {
  AdminDashboard,
  AdminMyVenuePage,
  AdminBookingsPage,
  AdminMenuPage,
  AdminTablesPage,
} from "@/pages/admin/routes";
import {
  SuperAdminVenuesPage,
  SuperAdminAdminsPage,
  SuperAdminBookingsPage,
  SuperAdminDashboard,
  CreateVenueWizard,
  VenueDetailPage,
} from "@/pages/super-admin/routes";
import {ProtectedRoute} from "./router/ProtectedRoute";

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
