import { baseApi } from "../baseApi";
import { GlobalSearchParams, GlobalSearchResponse } from "@/types/connect";
import { normalizeConnectUser } from "./normalizeConnectUser";

export const connectSearchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    globalSearch: builder.query<GlobalSearchResponse, GlobalSearchParams>({
      query: (params) => ({ url: "/api/v1/connect/search", params }),
      transformResponse: (raw: any): GlobalSearchResponse => ({
        messages: raw?.messages || raw?.data?.messages || [], channels: raw?.channels || raw?.data?.channels || [],
        colleagues: (raw?.colleagues || raw?.data?.colleagues || []).map(normalizeConnectUser), files: raw?.files || raw?.data?.files || [],
      }),
    }),
  }),
});
export const { useGlobalSearchQuery, useLazyGlobalSearchQuery } = connectSearchApi;
