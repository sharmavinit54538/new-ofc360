import { createApi, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { API_TAGS } from "./apiTags";
import { createAuthBaseQueryWithReauth } from "@/services/auth/authInterceptor";
import { baseQuery } from "./base/rawBaseQuery";

export { isPublicRequest, isValidToken, isValidUUID, needsCompanyId } from "@/services/auth/authStorage";
export { baseQuery } from "./base/rawBaseQuery";

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> =
  createAuthBaseQueryWithReauth(baseQuery);

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: API_TAGS,
  endpoints: () => ({}),
});