import { ApiError } from "./errorTypes";
import { DEFAULT_ERROR_MESSAGES } from "./defaultErrorMessages";
import { extractErrorMessage } from "./extractErrorMessage";

export function parseFetchBaseQueryError(errObj: Record<string, unknown>): ApiError {
  const rawStatus = errObj.status;
  let statusCode: number | "FETCH_ERROR" | "PARSING_ERROR" | "TIMEOUT_ERROR" | "CUSTOM_ERROR" = "CUSTOM_ERROR";
  let message = "";
  if (typeof rawStatus === "number") { statusCode = rawStatus; message = DEFAULT_ERROR_MESSAGES[rawStatus] || `HTTP Error ${rawStatus}`; }
  else if (rawStatus === "FETCH_ERROR") { statusCode = "FETCH_ERROR"; message = "Network Error: Unable to reach the server. Please check your network connection."; }
  else if (rawStatus === "PARSING_ERROR") { statusCode = "PARSING_ERROR"; message = "Data Format Error: Unable to parse response from server."; }
  else if (rawStatus === "TIMEOUT_ERROR") { statusCode = "TIMEOUT_ERROR"; message = "Request Timeout: Server took too long to respond."; }
  let code: string | undefined = undefined;
  let details: any = undefined;
  if (errObj.data && typeof errObj.data === "object") {
    const data = errObj.data as Record<string, unknown>;
    const extracted = extractErrorMessage(data, message);
    message = extracted.message; details = extracted.details;
    if (typeof data.code === "string") code = data.code;
  }
  return { status: statusCode, message, code, details };
}
