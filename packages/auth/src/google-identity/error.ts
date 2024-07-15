import type { AuthGoogleIdentifyErrorResponse } from "../types";

export class GoogleIdentityError extends Error {
  readonly errorResponse: AuthGoogleIdentifyErrorResponse;
  constructor(errorResponse: AuthGoogleIdentifyErrorResponse) {
    super();
    this.errorResponse = errorResponse;
  }

  getResponse(): Response {
    const { code, message, status } = this.errorResponse.error;
    return Response.json(
      {
        success: false,
        error: {
          message,
          status: code,
          statusCode: status,
        },
      },
      {
        status: code,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
