export interface ApiError {
  status: number | "FETCH_ERROR" | "PARSING_ERROR" | "TIMEOUT_ERROR" | "CUSTOM_ERROR";
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

const DEFAULT_ERROR_MESSAGES: Record<number, string> = {
  400: "Bad Request: The server could not understand the request.",
  401: "Unauthorized: Access credentials are missing or invalid.",
  403: "Forbidden: You do not have permission to perform this action.",
  404: "Not Found: The requested resource could not be found.",
  409: "Conflict: The request conflicts with current server state.",
  422: "Unprocessable Entity: Validation failed for the provided input.",
  429: "Too Many Requests: Rate limit exceeded. Please try again later.",
  500: "Internal Server Error: An unexpected server error occurred.",
  502: "Bad Gateway: Invalid response received from upstream server.",
  503: "Service Unavailable: Server is temporarily overloaded or down.",
  504: "Gateway Timeout: Upstream server failed to respond in time.",
};

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
      let details: Record<string, unknown> | undefined = undefined;

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

      // Check if server payload provided detail/message
      if (errObj.data && typeof errObj.data === "object") {
        const data = errObj.data as Record<string, unknown>;
        if (typeof data.message === "string" && data.message.trim().length > 0) {
          message = data.message;
        } else if (typeof data.error === "string" && data.error.trim().length > 0) {
          message = data.error;
        } else if (typeof data.detail === "string" && data.detail.trim().length > 0) {
          message = data.detail;
        } else if (Array.isArray(data.detail) && data.detail.length > 0) {
          message = data.detail
            .map((item: any) => {
              const field = Array.isArray(item?.loc) ? item.loc[item.loc.length - 1] : "";
              const msg = item?.msg || "invalid value";
              return field ? `${field}: ${msg}` : msg;
            })
            .join(" | ");
        }
        if (typeof data.code === "string") {
          code = data.code;
        }
        if (data.details && typeof data.details === "object") {
          details = data.details as Record<string, unknown>;
        }
      }

      return { status: statusCode, message, code, details };
    }

    // Generic JS Error object
    if ("message" in errObj && typeof errObj.message === "string") {
      return {
        status: "CUSTOM_ERROR",
        message: errObj.message,
      };
    }
  }

  if (typeof error === "string") {
    return {
      status: "CUSTOM_ERROR",
      message: error,
    };
  }

  return {
    status: "CUSTOM_ERROR",
    message: "An unexpected error occurred.",
  };
}
