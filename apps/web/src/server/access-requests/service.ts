import type { AccessRequestLocale } from "@unitforge/db";

import type { AccessRequestSource } from "@/features/access-requests/access-request-form";

import type { AccessRequestStatus } from "./admin";
import { traceAccessRequestCreated } from "./notifications";
import {
  createAccessRequestRecord,
  listAccessRequestRecords,
  updateAccessRequestStatusRecord,
} from "./repository";

export { isAccessRequestServiceError } from "./errors";

export async function createAccessRequest(input: {
  businessName: string;
  contactName: string;
  email: string;
  phone: string | null;
  note: string | null;
  locale: AccessRequestLocale;
  source: AccessRequestSource;
}) {
  const request = await createAccessRequestRecord(input);

  await traceAccessRequestCreated({
    ...request,
    locale: input.locale,
    source: input.source,
  });

  return request;
}

export async function listAccessRequests(limit = 100) {
  return listAccessRequestRecords(limit);
}

export async function updateAccessRequestStatus(
  accessRequestId: string,
  status: AccessRequestStatus,
) {
  return updateAccessRequestStatusRecord(accessRequestId, status);
}
