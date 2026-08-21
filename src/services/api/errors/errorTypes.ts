export interface ApiError {
  status: number | "FETCH_ERROR" | "PARSING_ERROR" | "TIMEOUT_ERROR" | "CUSTOM_ERROR";
  message: string;
  code?: string;
  details?: Record<string, unknown> | Array<unknown>;
}
