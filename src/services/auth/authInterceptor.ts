import { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { validateCompanyHeader } from "./interceptor/companyHeaderGuard";
import { handleRateLimitRetry } from "./interceptor/rateLimitHandler";
import { handle401Error } from "./interceptor/auth401Handler";

export { registerTokenUpdateListener, notifyTokenUpdated } from "./interceptor/tokenListeners";

export const createAuthBaseQueryWithReauth = (
  rawBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>
): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> => {
  return async (args, api, extraOptions) => {
    const requestUrl = typeof args === "string" ? args : args.url || "";
    const isValidHeader = await validateCompanyHeader(requestUrl, api);
    if (!isValidHeader) {
      return { error: { status: 400, statusText: "Bad Request", data: { message: "Request blocked: A valid Company ID (UUID) is required but was not found." } } as FetchBaseQueryError };
    }
    let result = await rawBaseQuery(args, api, extraOptions);
    result = await handleRateLimitRetry(result, rawBaseQuery, args, api, extraOptions);
    return await handle401Error(result, rawBaseQuery, args, api, extraOptions);
  };
};
