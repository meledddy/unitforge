export type PriceSheetLeadServiceErrorCode =
  | "DATABASE_NOT_CONFIGURED"
  | "NOT_FOUND"
  | "NOT_PUBLIC"
  | "INQUIRY_DISABLED"
  | "UNAVAILABLE";

export class PriceSheetLeadServiceError extends Error {
  code: PriceSheetLeadServiceErrorCode;

  constructor(code: PriceSheetLeadServiceErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

export function isPriceSheetLeadServiceError(error: unknown): error is PriceSheetLeadServiceError {
  return error instanceof PriceSheetLeadServiceError;
}
