import type { Role } from "../types/roles";

export function getDefaultDashboard(roles: Role[]) {
  const priority: Role[] = [
    "ADMIN",
    "ORGANIZER",
    "PANEL_EVALUATOR",
    "AUTHOR",
    "PARTICIPANT",
  ];
  const best = priority.find((r) => roles.includes(r));

  switch (best) {
    case "ADMIN":
      return "/admin";
    case "ORGANIZER":
      return "/organizer";
    case "PANEL_EVALUATOR":
      return "/panel";
    case "AUTHOR":
      return "/author";
    default:
      return "/participant";
  }
}
