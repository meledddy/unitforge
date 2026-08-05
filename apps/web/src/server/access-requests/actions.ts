"use server";

import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { z } from "zod";

import {
  type AccessRequestActionState,
  type AccessRequestSource,
  getAccessRequestCopy,
  getAccessRequestFieldErrors,
  isAccessRequestHoneypotFilled,
  parseAccessRequestFormData,
  toAccessRequestSubmissionInput,
} from "@/features/access-requests/access-request-form";
import type { InterfaceLocale } from "@/i18n/interface-locale";
import { requireAuthenticatedAppShellSession } from "@/server/current-session";
import {
  consumeRateLimit,
  getRateLimitClientIp,
  type RateLimitResult,
} from "@/server/rate-limit";

import { accessRequestStatuses, isUnitforgeAdminEmail } from "./admin";
import { isAccessRequestServiceError } from "./errors";
import { createAccessRequest, updateAccessRequestStatus } from "./service";

const ACCESS_REQUEST_IP_RATE_LIMIT = {
  limit: 8,
  windowMs: 15 * 60 * 1000,
};

const ACCESS_REQUEST_EMAIL_RATE_LIMIT = {
  limit: 3,
  windowMs: 60 * 60 * 1000,
};

const accessRequestStatusMutationSchema = z.object({
  accessRequestId: z.string().uuid(),
  status: z.enum(accessRequestStatuses),
});

export async function submitAccessRequestAction(
  _previousState: AccessRequestActionState,
  formData: FormData,
): Promise<AccessRequestActionState> {
  const locale = normalizeLocale(formData.get("locale"));
  const source = normalizeSource(formData.get("source"));
  const copy = getAccessRequestCopy(locale);

  if (isAccessRequestHoneypotFilled(formData)) {
    return {
      status: "success",
    };
  }

  const parsedFormData = parseAccessRequestFormData(formData, locale, source);

  if (!parsedFormData.success) {
    return {
      status: "error",
      message: copy.validationMessage,
      fieldErrors: getAccessRequestFieldErrors(parsedFormData.error),
    };
  }

  const clientIp = await getRateLimitClientIp();
  const ipLimit = clientIp
    ? consumeRateLimit({
        namespace: "access-request:ip",
        identityParts: [clientIp],
        ...ACCESS_REQUEST_IP_RATE_LIMIT,
      })
    : null;

  if (ipLimit && !ipLimit.allowed) {
    return getRateLimitedState(ipLimit, locale);
  }

  const emailLimit = consumeRateLimit({
    namespace: "access-request:email",
    identityParts: [parsedFormData.data.email],
    ...ACCESS_REQUEST_EMAIL_RATE_LIMIT,
  });

  if (!emailLimit.allowed) {
    return getRateLimitedState(emailLimit, locale);
  }

  try {
    await createAccessRequest({
      ...toAccessRequestSubmissionInput(parsedFormData.data),
      source,
    });

    return {
      status: "success",
    };
  } catch {
    return {
      status: "error",
      message: copy.unavailableMessage,
    };
  }
}

export async function updateAccessRequestStatusAction(formData: FormData) {
  const session = await requireAuthenticatedAppShellSession();

  if (!isUnitforgeAdminEmail(session.currentUser.email)) {
    notFound();
  }

  const parsedInput = accessRequestStatusMutationSchema.safeParse({
    accessRequestId: getFormString(formData, "accessRequestId"),
    status: getFormString(formData, "status"),
  });

  if (!parsedInput.success) {
    notFound();
  }

  try {
    await updateAccessRequestStatus(
      parsedInput.data.accessRequestId,
      parsedInput.data.status,
    );
  } catch (error) {
    if (isAccessRequestServiceError(error) && error.code === "NOT_FOUND") {
      notFound();
    }

    throw error;
  }

  revalidatePath("/app/access-requests");
}

function normalizeLocale(value: FormDataEntryValue | null): InterfaceLocale {
  return value === "ru" ? "ru" : "en";
}

function normalizeSource(
  value: FormDataEntryValue | null,
): AccessRequestSource {
  return value === "contact" ? "contact" : "request-access";
}

function getRateLimitedState(
  rateLimit: RateLimitResult,
  locale: InterfaceLocale,
): AccessRequestActionState {
  const retryMinutes = Math.max(1, Math.ceil(rateLimit.retryAfterSeconds / 60));

  return {
    status: "error",
    message: getAccessRequestCopy(locale).rateLimitMessage(retryMinutes),
  };
}

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}
