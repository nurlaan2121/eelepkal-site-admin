import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export const ProtectedRoute = ({
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
