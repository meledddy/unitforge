"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { AUTH_SESSION_COOKIE_NAME } from "./constants";
import { authenticateUserByPassword, invalidateAuthSession } from "./service";
import {
  createAuthSessionCookie,
  createExpiredAuthSessionCookie,
  getAuthSessionTokenFromCookie,
} from "./session";
import type { SignInActionState } from "./sign-in-state";

const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
  next: z.string().optional(),
});

export async function signInAction(_previousState: SignInActionState, formData: FormData) {
  const parsedInput = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next") ?? undefined,
  });

  if (!parsedInput.success) {
    return {
      status: "error",
      message: "Check your email and password, then try again.",
      fieldErrors: getSignInFieldErrors(parsedInput.error),
    } satisfies SignInActionState;
  }

  try {
    const authenticatedUser = await authenticateUserByPassword(parsedInput.data);
    const cookieStore = await cookies();
    cookieStore.set(createAuthSessionCookie(authenticatedUser.sessionToken));
  } catch {
    return {
      status: "error",
      message: "Email or password is incorrect.",
      fieldErrors: {
        email: "Check the credentials and try again.",
        password: "Check the credentials and try again.",
      },
    } satisfies SignInActionState;
  }

  redirect(getSafePostLoginRedirect(parsedInput.data.next));
}

export async function signOutAction() {
  const cookieStore = await cookies();
  const sessionToken = getAuthSessionTokenFromCookie(cookieStore.get(AUTH_SESSION_COOKIE_NAME));

  if (sessionToken) {
    await invalidateAuthSession(sessionToken);
  }

  cookieStore.set(createExpiredAuthSessionCookie());

  redirect("/login");
}

function getSafePostLoginRedirect(nextPath: string | undefined) {
  if (nextPath && nextPath.startsWith("/app")) {
    return nextPath;
  }

  return "/app";
}

function getSignInFieldErrors(error: z.ZodError) {
  const fieldErrors: Record<string, string> = {};

  for (const issue of error.issues) {
    const path = issue.path.join(".");

    if (!fieldErrors[path]) {
      fieldErrors[path] = issue.message;
    }
  }

  return fieldErrors;
}
