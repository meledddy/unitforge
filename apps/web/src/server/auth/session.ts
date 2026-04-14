import { createHash, randomBytes } from "node:crypto";

import { AUTH_SESSION_COOKIE_NAME, AUTH_SESSION_DURATION_DAYS } from "./constants";

const AUTH_SESSION_MAX_AGE_SECONDS = AUTH_SESSION_DURATION_DAYS * 24 * 60 * 60;

export function createAuthSessionToken() {
  return randomBytes(24).toString("base64url");
}

export function hashAuthSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function createAuthSessionCookie(token: string) {
  return {
    name: AUTH_SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    maxAge: AUTH_SESSION_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

export function createExpiredAuthSessionCookie() {
  return {
    ...createAuthSessionCookie(""),
    expires: new Date(0),
    maxAge: 0,
  };
}

export function getAuthSessionTokenFromCookie(cookie: { value?: string } | undefined) {
  const token = cookie?.value?.trim();

  return token ? token : null;
}

export function getAuthSessionExpiryDate() {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + AUTH_SESSION_DURATION_DAYS);

  return expiryDate;
}
