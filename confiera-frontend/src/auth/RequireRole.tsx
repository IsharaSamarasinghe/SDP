import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "./auth.store";
import type { Role } from "../types/roles";

export function RequireRole({ anyOf }: { anyOf: Role[] }) {
  const user = useAuthStore((s) => s.user);
  const roles = user?.roles ?? [];

  const allowed = anyOf.some((r) => roles.includes(r));
  if (!allowed) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}
