import "server-only";

export type PriceSheetServiceErrorCode =
  | "DATABASE_NOT_CONFIGURED"
  | "NOT_FOUND"
  | "SLUG_CONFLICT"
  | "UNAVAILABLE";

export class PriceSheetServiceError extends Error {
  constructor(
    public readonly code: PriceSheetServiceErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "PriceSheetServiceError";
  }
}

export function isPriceSheetServiceError(error: unknown): error is PriceSheetServiceError {
  return error instanceof PriceSheetServiceError;
}
