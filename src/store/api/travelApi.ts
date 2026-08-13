import { baseApi } from "./baseApi";

export interface TravelRequest {
  id: string;
  employee_id: string;
  employee_name?: string;
  type: "domestic" | "international";
  purpose: string;
  destination: string;
  travel_date: string;
  return_date: string;
  budget?: number;
  currency?: string;
  hotel?: string;
  transportation?: string;
  status: string;
  stage?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TravelRequestCreate {
  employee_id: string;
  type: "domestic" | "international";
  purpose: string;
  destination: string;
  travel_date: string;
  return_date: string;
  budget?: number;
  currency?: string;
  hotel?: string;
  transportation?: string;
}

export interface TravelRequestUpdate {
  employee_id?: string;
  type?: "domestic" | "international";
  purpose?: string;
  destination?: string;
  travel_date?: string;
  return_date?: string;
  budget?: number;
  currency?: string;
  hotel?: string;
  transportation?: string;
  status?: string;
}

export interface AdvanceRequest {
  stage: string;
  note?: string;
}

export interface TravelQueryParams {
  status?: string;
  employee_id?: string;
  page?: number;
  limit?: number;
}

export interface TravelStats {
  total_requests: number;
  pending_approval: number;
  approved: number;
  rejected: number;
  total_budget_allocated: number;
  domestic_count: number;
  international_count: number;
}

export interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

function transformApiResponse<T>(response: APIResponse<T> | T): T {
  if (response && typeof response === "object" && "data" in response && "success" in response) {
    return (response as APIResponse<T>).data;
  }
  return response as T;
}

export const travelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTravelRequests: builder.query<TravelRequest[], TravelQueryParams | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.status) searchParams.append("status", params.status);
        if (params?.employee_id) searchParams.append("employee_id", params.employee_id);
        if (params?.page) searchParams.append("page", params.page.toString());
        if (params?.limit) searchParams.append("limit", params.limit.toString());
        const q = searchParams.toString();
        return `/api/v2/travel${q ? `?${q}` : ""}`;
      },
      keepUnusedDataFor: 60,
      transformResponse: transformApiResponse,
      providesTags: (result) => {
        const items = Array.isArray(result) ? result : [];
        return [
          ...items.map(({ id }) => ({ type: "Travel" as const, id })),
          { type: "Travel", id: "LIST" },
        ];
      },
    }),

    getTravelStats: builder.query<TravelStats, void>({
      query: () => "/api/v2/travel/stats",
      transformResponse: transformApiResponse,
      providesTags: ["TravelStats"],
    }),

    createTravelRequest: builder.mutation<TravelRequest, TravelRequestCreate>({
      query: (body) => ({
        url: "/api/v2/travel",
        method: "POST",
        body,
      }),
      transformResponse: transformApiResponse,
      invalidatesTags: [{ type: "Travel", id: "LIST" }, "TravelStats"],
    }),

    updateTravelRequest: builder.mutation<TravelRequest, { id: string; data: TravelRequestUpdate }>({
      query: ({ id, data }) => ({
        url: `/api/v2/travel/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: transformApiResponse,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Travel", id },
        { type: "Travel", id: "LIST" },
        "TravelStats",
      ],
    }),

    advanceTravelRequest: builder.mutation<TravelRequest, { id: string; body: AdvanceRequest }>({
      query: ({ id, body }) => ({
        url: `/api/v2/travel/${id}/advance`,
        method: "POST",
        body,
      }),
      transformResponse: transformApiResponse,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Travel", id },
        { type: "Travel", id: "LIST" },
        "TravelStats",
      ],
    }),

    deleteTravelRequest: builder.mutation<{ success: boolean; message?: string }, string>({
      query: (id) => ({
        url: `/api/v2/travel/${id}`,
        method: "DELETE",
      }),
      transformResponse: transformApiResponse,
      invalidatesTags: (_result, _error, id) => [
        { type: "Travel", id },
        { type: "Travel", id: "LIST" },
        "TravelStats",
      ],
    }),
  }),
});

export const {
  useGetTravelRequestsQuery,
  useGetTravelStatsQuery,
  useCreateTravelRequestMutation,
  useUpdateTravelRequestMutation,
  useAdvanceTravelRequestMutation,
  useDeleteTravelRequestMutation,
} = travelApi;
