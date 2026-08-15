export interface ApiError {
  status: number | "FETCH_ERROR" | "PARSING_ERROR" | "TIMEOUT_ERROR" | "CUSTOM_ERROR";
  message: string;
  code?: string;
  details?: Record<string, unknown> | Array<unknown>;
}

const DEFAULT_ERROR_MESSAGES: Record<number, string> = {
  400: "Bad Request: The server could not understand the request.",
  401: "Unauthorized: Access credentials are missing or invalid.",
  403: "Forbidden: You do not have permission to perform this action.",
  404: "Not Found: The requested resource could not be found.",
  409: "Conflict: The request conflicts with current server state.",
  410: "Gone: The verification link or code has expired.",
  422: "Validation Error: Validation failed for the provided input.",
  429: "Too Many Requests: Rate limit exceeded. Please try again later.",
  500: "Internal Server Error: An unexpected server error occurred.",
  502: "Bad Gateway: Invalid response received from upstream server.",
  503: "Service Unavailable: Server is temporarily overloaded or down.",
  504: "Gateway Timeout: Upstream server failed to respond in time.",
};

function sanitizeMessage(msg: string): string {
  if (!msg) return "";
  // Strip raw HTML tags if server returned HTML error page
  const clean = msg.replace(/<[^>]*>?/gm, "").trim();
  // If message looks like a raw python/node traceback, return friendly server message
  if (clean.includes("Traceback (most recent call last)") || clean.includes("at Object.") || clean.includes("Internal Server Error")) {
    return DEFAULT_ERROR_MESSAGES[500];
  }
  return clean;
}

function extractErrorMessage(
  data: Record<string, unknown>,
  fallbackMessage: string
): { message: string; details?: Record<string, unknown> | Array<unknown> } {
  let details: Record<string, unknown> | Array<unknown> | undefined = undefined;

  if (data.details && typeof data.details === "object") {
    details = data.details as Record<string, unknown> | Array<unknown>;
  }

  // 1. Array or object of validation errors in data.errors (e.g. Laravel / Express / Zod)
  if (data.errors) {
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      const msgs = data.errors.map((e: any) => {
        if (typeof e === "string") return e;
        if (e && typeof e === "object") {
          return e.message || e.msg || (e.field ? `${e.field}: ${e.message || "invalid"}` : JSON.stringify(e));
        }
        return String(e);
      });
      return { message: msgs.join(". "), details: details || (data.errors as any) };
    } else if (typeof data.errors === "object" && Object.keys(data.errors).length > 0) {
      const errObj = data.errors as Record<string, any>;
      const fieldMsgs = Object.entries(errObj).map(([field, val]) => {
        const valText = Array.isArray(val)
          ? val.join(", ")
          : typeof val === "object"
          ? JSON.stringify(val)
          : String(val);
        return `${field}: ${valText}`;
      });
      return { message: fieldMsgs.join(". "), details: details || errObj };
    }
  }

  // 2. data.detail (FastAPI / DRF format)
  if (Array.isArray(data.detail) && data.detail.length > 0) {
    const detailMsgs = data.detail.map((item: any) => {
      if (typeof item === "string") return item;
      const field = Array.isArray(item?.loc) ? item.loc[item.loc.length - 1] : item?.field || "";
      const msg = item?.msg || item?.message || "invalid value";
      return field && field !== "body" ? `${field}: ${msg}` : msg;
    });
    return { message: detailMsgs.join(". "), details: details || (data.detail as any) };
  } else if (typeof data.detail === "string" && data.detail.trim().length > 0) {
    return { message: sanitizeMessage(data.detail), details };
  }

  // 3. OAuth2 error_description
  if (typeof data.error_description === "string" && data.error_description.trim().length > 0) {
    return { message: sanitizeMessage(data.error_description), details };
  }

  // 4. data.message as Array (NestJS class-validator format)
  if (Array.isArray(data.message) && data.message.length > 0) {
    return { message: data.message.join(". "), details };
  }

  // 5. data.message as string
  if (typeof data.message === "string" && data.message.trim().length > 0) {
    return { message: sanitizeMessage(data.message), details };
  }

  // 6. data.non_field_errors (Django format)
  if (Array.isArray(data.non_field_errors) && data.non_field_errors.length > 0) {
    return { message: data.non_field_errors.join(". "), details };
  }

  // 7. data.error as string
  if (typeof data.error === "string" && data.error.trim().length > 0) {
    return { message: sanitizeMessage(data.error), details };
  }

  return { message: fallbackMessage, details };
}

export function normalizeError(error: unknown): ApiError {
  if (!error) {
    return {
      status: "CUSTOM_ERROR",
      message: "An unknown error occurred.",
    };
  }

  if (typeof error === "object" && error !== null) {
    const errObj = error as Record<string, unknown>;

    // Handle FetchBaseQueryError format from RTK Query
    if ("status" in errObj) {
      const rawStatus = errObj.status;
      let statusCode: number | "FETCH_ERROR" | "PARSING_ERROR" | "TIMEOUT_ERROR" | "CUSTOM_ERROR" = "CUSTOM_ERROR";
      let message = "";
      let code: string | undefined = undefined;
      let details: Record<string, unknown> | Array<unknown> | undefined = undefined;

      if (typeof rawStatus === "number") {
        statusCode = rawStatus;
        message = DEFAULT_ERROR_MESSAGES[rawStatus] || `HTTP Error ${rawStatus}`;
      } else if (rawStatus === "FETCH_ERROR") {
        statusCode = "FETCH_ERROR";
        message = "Network Error: Unable to reach the server. Please check your network connection.";
      } else if (rawStatus === "PARSING_ERROR") {
        statusCode = "PARSING_ERROR";
        message = "Data Format Error: Unable to parse response from server.";
      } else if (rawStatus === "TIMEOUT_ERROR") {
        statusCode = "TIMEOUT_ERROR";
        message = "Request Timeout: Server took too long to respond.";
      }

      // Check if server payload provided detail/message/errors
      if (errObj.data && typeof errObj.data === "object") {
        const data = errObj.data as Record<string, unknown>;
        const extracted = extractErrorMessage(data, message);
        message = extracted.message;
        details = extracted.details;

        if (typeof data.code === "string") {
          code = data.code;
        }
      }

      return { status: statusCode, message, code, details };
    }

    // Generic JS Error object
    if ("message" in errObj && typeof errObj.message === "string") {
      return {
        status: "CUSTOM_ERROR",
        message: sanitizeMessage(errObj.message),
      };
    }
  }

  if (typeof error === "string") {
    return {
      status: "CUSTOM_ERROR",
      message: sanitizeMessage(error),
    };
  }

  return {
    status: "CUSTOM_ERROR",
    message: "An unexpected error occurred.",
  };
}

