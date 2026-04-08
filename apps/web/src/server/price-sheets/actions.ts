"use server";

import { redirect } from "next/navigation";

import {
  getPriceSheetFieldErrors,
  parsePriceSheetFormPayload,
  type PriceSheetStatus,
  toPriceSheetMutationInput,
} from "@/features/price-sheets/validation";
import { getCurrentAppShellSession } from "@/server/current-session";

import { isPriceSheetServiceError } from "./errors";
import {
  createWorkspacePriceSheet,
  deleteWorkspacePriceSheet,
  setWorkspacePriceSheetStatus,
  updateWorkspacePriceSheet,
} from "./service";

export interface PriceSheetFormActionState {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
}

export async function createPriceSheetAction(
  _previousState: PriceSheetFormActionState,
  formData: FormData,
) {
  const payload = formData.get("payload");

  if (typeof payload !== "string") {
    return {
      status: "error",
      message: "Form payload is missing.",
    } satisfies PriceSheetFormActionState;
  }

  const parsedPayload = parsePriceSheetFormPayload(payload);

  if (!parsedPayload.success) {
    return {
      status: "error",
      message: "Check the highlighted fields and try again.",
      fieldErrors: getPriceSheetFieldErrors(parsedPayload.error),
    } satisfies PriceSheetFormActionState;
  }

  const session = await getCurrentAppShellSession();

  try {
    const priceSheet = await createWorkspacePriceSheet(session, toPriceSheetMutationInput(parsedPayload.data));

    redirect(`/app/price-sheets/${priceSheet.id}`);
  } catch (error) {
    return actionErrorState(error, "Price Sheet could not be created.");
  }
}

export async function updatePriceSheetAction(
  priceSheetId: string,
  _previousState: PriceSheetFormActionState,
  formData: FormData,
) {
  const payload = formData.get("payload");

  if (typeof payload !== "string") {
    return {
      status: "error",
      message: "Form payload is missing.",
    } satisfies PriceSheetFormActionState;
  }

  const parsedPayload = parsePriceSheetFormPayload(payload);

  if (!parsedPayload.success) {
    return {
      status: "error",
      message: "Check the highlighted fields and try again.",
      fieldErrors: getPriceSheetFieldErrors(parsedPayload.error),
    } satisfies PriceSheetFormActionState;
  }

  const session = await getCurrentAppShellSession();

  try {
    await updateWorkspacePriceSheet(session, priceSheetId, toPriceSheetMutationInput(parsedPayload.data));

    redirect(`/app/price-sheets/${priceSheetId}`);
  } catch (error) {
    return actionErrorState(error, "Price Sheet could not be updated.");
  }
}

export async function setPriceSheetStatusAction(
  priceSheetId: string,
  status: PriceSheetStatus,
  redirectTo: string,
) {
  const session = await getCurrentAppShellSession();

  await setWorkspacePriceSheetStatus(session, priceSheetId, status);

  redirect(redirectTo);
}

export async function deletePriceSheetAction(priceSheetId: string, redirectTo = "/app/price-sheets") {
  const session = await getCurrentAppShellSession();

  await deleteWorkspacePriceSheet(session, priceSheetId);

  redirect(redirectTo);
}

function actionErrorState(error: unknown, fallbackMessage: string) {
  if (isPriceSheetServiceError(error)) {
    if (error.code === "SLUG_CONFLICT") {
      return {
        status: "error",
        message: "Choose a different slug.",
        fieldErrors: {
          slug: error.message,
        },
      } satisfies PriceSheetFormActionState;
    }

    return {
      status: "error",
      message: error.message,
    } satisfies PriceSheetFormActionState;
  }

  return {
    status: "error",
    message: fallbackMessage,
  } satisfies PriceSheetFormActionState;
}
