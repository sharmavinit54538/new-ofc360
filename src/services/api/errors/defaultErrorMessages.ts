export const DEFAULT_ERROR_MESSAGES: Record<number, string> = {
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
