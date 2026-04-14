export class AuthServiceError extends Error {
  constructor(
    readonly code: "CONFIGURATION" | "INVALID_CREDENTIALS" | "SESSION_NOT_FOUND" | "WORKSPACE_NOT_FOUND",
    message: string,
  ) {
    super(message);
    this.name = "AuthServiceError";
  }
}

export function isAuthServiceError(error: unknown): error is AuthServiceError {
  return error instanceof AuthServiceError;
}
