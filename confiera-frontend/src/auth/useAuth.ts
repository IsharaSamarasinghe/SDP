import { useEffect } from "react";
import { api } from "../api/axios";
import { useAuthStore } from "./auth.store";
import type { AuthUser } from "./auth.types";

export function useBootstrapAuth() {
  const setUser = useAuthStore((s) => s.setUser);
  const setBootstrapping = useAuthStore((s) => s.setBootstrapping);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        // Backend should return current session user (or 401)
        const { data } = await api.get<AuthUser>("/auth/me");
        if (mounted) setUser(data);
      } catch {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setBootstrapping(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [setUser, setBootstrapping]);
}
