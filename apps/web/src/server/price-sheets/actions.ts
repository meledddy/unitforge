"use server";

import { revalidatePath } from "next/cache";
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
  getWorkspacePriceSheetForEdit,
  setWorkspacePriceSheetStatus,
  updateWorkspacePriceSheet,
} from "./service";

export interface PriceSheetFormActionState {
  status: "idle" | "error" | "success";
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
  let priceSheet;

  try {
    priceSheet = await createWorkspacePriceSheet(session, toPriceSheetMutationInput(parsedPayload.data));
  } catch (error) {
    return actionErrorState(error, "Price Sheet could not be created.");
  }

  revalidatePriceSheetPaths({
    priceSheetId: priceSheet.id,
    slug: priceSheet.slug,
  });

  redirect("/app/price-sheets");
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
  const saveIntent = getSaveIntent(formData);
  let existingPriceSheet;
  let priceSheet;

  try {
    existingPriceSheet = await getWorkspacePriceSheetForEdit(session, priceSheetId);
    priceSheet = await updateWorkspacePriceSheet(session, priceSheetId, toPriceSheetMutationInput(parsedPayload.data));
  } catch (error) {
    return actionErrorState(error, "Price Sheet could not be updated.");
  }

  revalidatePriceSheetPaths({
    priceSheetId,
    slug: priceSheet.slug,
  });

  if (existingPriceSheet.slug !== priceSheet.slug) {
    revalidatePath(`/price-sheets/${existingPriceSheet.slug}`);
  }

  if (saveIntent === "return") {
    redirect("/app/price-sheets");
  }

  return {
    status: "success",
    message: "Changes saved. Continue editing or publish when ready.",
  } satisfies PriceSheetFormActionState;
}

export async function setPriceSheetStatusAction(
  priceSheetId: string,
  status: PriceSheetStatus,
  redirectTo: string,
) {
  const session = await getCurrentAppShellSession();
  const priceSheet = await setWorkspacePriceSheetStatus(session, priceSheetId, status);
  revalidatePriceSheetPaths({
    priceSheetId,
    slug: priceSheet.slug,
  });
  revalidatePath(redirectTo);

  redirect(redirectTo);
}

export async function deletePriceSheetAction(priceSheetId: string, redirectTo = "/app/price-sheets") {
  const session = await getCurrentAppShellSession();
  const deletedPriceSheet = await deleteWorkspacePriceSheet(session, priceSheetId);
  revalidatePriceSheetPaths({
    priceSheetId: deletedPriceSheet.id,
    slug: deletedPriceSheet.slug,
  });
  revalidatePath(redirectTo);

  redirect(redirectTo);
}

function revalidatePriceSheetPaths(input: {
  priceSheetId: string;
  slug: string;
}) {
  revalidatePath("/app/price-sheets");
  revalidatePath(`/app/price-sheets/${input.priceSheetId}`);
  revalidatePath(`/price-sheets/${input.slug}`);
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

function getSaveIntent(formData: FormData) {
  const intent = formData.get("intent");

  return intent === "return" ? "return" : "continue";
}
