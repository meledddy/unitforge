export type AccessRequestServiceErrorCode =
  | "DATABASE_NOT_CONFIGURED"
  | "NOT_FOUND"
  | "UNAVAILABLE";

export class AccessRequestServiceError extends Error {
  code: AccessRequestServiceErrorCode;

  constructor(code: AccessRequestServiceErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

export function isAccessRequestServiceError(
  error: unknown,
): error is AccessRequestServiceError {
  return error instanceof AccessRequestServiceError;
}
