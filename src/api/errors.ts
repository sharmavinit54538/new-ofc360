export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errors?: ValidationError[];
  public readonly originalError?: unknown;

  constructor(message: string, statusCode: number, errors?: ValidationError[], originalError?: unknown) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
    this.originalError = originalError;
  }

  static fromResponse(response: ApiErrorResponse, statusCode: number): ApiError {
    const errors = response.errors
      ? Object.entries(response.errors).flatMap(([field, messages]) =>
          messages.map((message) => ({ field, message }))
        )
      : undefined;
    return new ApiError(response.message, statusCode, errors);
  }

  static fromUnknown(error: unknown): ApiError {
    if (error instanceof ApiError) return error;
    if (error instanceof Error) return new ApiError(error.message, 500, undefined, error);
    return new ApiError("Unknown error", 500, undefined, error);
  }
}

export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof ApiError;
};

export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof TypeError && error.message.includes("fetch")) return true;
  if (error instanceof Error && error.name === "NetworkError") return true;
  return false;
};