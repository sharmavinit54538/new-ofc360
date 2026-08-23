import { baseQueryWithReauth } from "./client";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";

export type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";

export const createApiWithInterceptors = <T>(
  baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
  endpoints: (builder: any) => T
) => {
  return { baseQuery, endpoints };
};

export { baseQueryWithReauth };