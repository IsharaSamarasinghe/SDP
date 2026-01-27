import { useAuthStore } from "../../auth/auth.store";

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700 }}>Dashboard</h1>
      <p style={{ marginTop: 8 }}>
        Logged in as <b>{user?.email}</b>
      </p>
      <p>Roles: {user?.roles?.join(", ")}</p>
    </div>
  );
}
