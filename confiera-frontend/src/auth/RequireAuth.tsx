import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "./auth.store";

export function RequireAuth() {
  const user = useAuthStore((s) => s.user);
  const isBootstrapping = useAuthStore((s) => s.isBootstrapping);
  const location = useLocation();

  if (isBootstrapping) {
    return <div style={{ padding: 24 }}>Loading session...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
