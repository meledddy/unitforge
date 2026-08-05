import { getRuntimeEnvValue } from "@/server/runtime-env";

export const accessRequestStatuses = [
  "new",
  "contacted",
  "qualified",
  "closed",
] as const;

export type AccessRequestStatus = (typeof accessRequestStatuses)[number];

export function isUnitforgeAdminEmail(email: string | null | undefined) {
  if (!email) {
    return false;
  }

  return parseUnitforgeAdminEmails(
    getRuntimeEnvValue("UNITFORGE_ADMIN_EMAILS"),
  ).has(normalizeEmail(email));
}

export function parseUnitforgeAdminEmails(value: string | null | undefined) {
  return new Set((value ?? "").split(",").map(normalizeEmail).filter(Boolean));
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}
