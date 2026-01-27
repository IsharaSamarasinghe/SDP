import type { Role } from "../types/roles";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  roles: Role[];
};
