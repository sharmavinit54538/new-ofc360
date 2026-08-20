import { baseApi } from "./baseApi";

// ==========================================
// Types & Interfaces
// ==========================================

/**
 * Enterprise Procurement Vendor Interface
 * Note: Stop condition — Do not attempt to auto-calculate renewal_risk or performance_score
 * with AI/ML in this pass — leave them as plain editable fields set by HR/admin.
 * AI-driven scoring is reserved for a future follow-up once base CRUD is working end-to-end.
 */
export interface EnterpriseVendor {
  id: string;
  name: string;
  category?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  status: string;
  contract_start_date?: string;
  contract_end_date?: string;
  contract_value?: number;
  auto_renew: boolean;
  sla_target_pct?: number;
  sla_actual_pct?: number;
  performance_score?: number;
  renewal_risk?: "low" | "medium" | "high";
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface VendorProcurementRequest {
  id: string;
  vendor_id?: string;
  item_description: string;
  requested_by?: string;
  estimated_value?: number;
  stage: "requested" | "quote_received" | "approved" | "ordered" | "delivered" | "rejected";
  created_at?: string;
  updated_at?: string;
}

export interface VendorQueryParams {
  status?: string;
  category?: string;
  renewal_risk?: string;
}

export interface VendorAnalyticsResponse {
  total_vendors: number;
  active_vendors: number;
  renewal_risk_breakdown: {
    low: number;
    medium: number;
    high: number;
  };
  average_performance_score: number;
}

export interface APIResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: unknown;
}

function transformApiResponse<T>(response: APIResponse<T> | T): T {
  if (response && typeof response === "object" && "data" in response && "success" in response) {
    return (response as APIResponse<T>).data;
  }
  return response as T;
}

// ==========================================
// Enterprise Vendors RTK Query Endpoints
// ==========================================

export const enterpriseVendorsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEnterpriseVendors: builder.query<EnterpriseVendor[], VendorQueryParams | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.status) searchParams.append("status", params.status);
        if (params?.category) searchParams.append("category", params.category);
        if (params?.renewal_risk) searchParams.append("renewal_risk", params.renewal_risk);
        const q = searchParams.toString();
        return `/api/v1/enterprise-vendors${q ? `?${q}` : ""}`;
      },
      transformResponse: transformApiResponse,
      providesTags: (result) => {
        const items = Array.isArray(result) ? result : [];
        return [
          ...items.map(({ id }) => ({ type: "EnterpriseVendor" as const, id })),
          { type: "EnterpriseVendor", id: "LIST" },
        ];
      },
    }),

    getVendorAnalytics: builder.query<VendorAnalyticsResponse, void>({
      query: () => "/api/v1/enterprise-vendors/analytics",
      transformResponse: transformApiResponse,
      providesTags: ["VendorAnalytics"],
    }),

    getEnterpriseVendorById: builder.query<EnterpriseVendor, string>({
      query: (id) => `/api/v1/enterprise-vendors/${id}`,
      transformResponse: transformApiResponse,
      providesTags: (_result, _error, id) => [{ type: "EnterpriseVendor", id }],
    }),

    createEnterpriseVendor: builder.mutation<EnterpriseVendor, Partial<EnterpriseVendor>>({
      query: (body) => ({
        url: "/api/v1/enterprise-vendors",
        method: "POST",
        body,
      }),
      transformResponse: transformApiResponse,
      invalidatesTags: [{ type: "EnterpriseVendor", id: "LIST" }, "VendorAnalytics"],
    }),

    updateEnterpriseVendor: builder.mutation<EnterpriseVendor, { id: string } & Partial<EnterpriseVendor>>({
      query: ({ id, ...body }) => ({
        url: `/api/v1/enterprise-vendors/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: transformApiResponse,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "EnterpriseVendor", id },
        { type: "EnterpriseVendor", id: "LIST" },
        "VendorAnalytics",
      ],
    }),

    deleteEnterpriseVendor: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/api/v1/enterprise-vendors/${id}`,
        method: "DELETE",
      }),
      transformResponse: transformApiResponse,
      invalidatesTags: (_result, _error, id) => [
        { type: "EnterpriseVendor", id },
        { type: "EnterpriseVendor", id: "LIST" },
        "VendorAnalytics",
      ],
    }),

    getProcurementPipeline: builder.query<VendorProcurementRequest[], { stage?: string } | void>({
      query: (params) => {
        const q = params?.stage ? `?stage=${encodeURIComponent(params.stage)}` : "";
        return `/api/v1/enterprise-vendors/procurement${q}`;
      },
      transformResponse: transformApiResponse,
      providesTags: (result) => {
        const items = Array.isArray(result) ? result : [];
        return [
          ...items.map(({ id }) => ({ type: "ProcurementRequest" as const, id })),
          { type: "ProcurementRequest", id: "LIST" },
        ];
      },
    }),

    createProcurementRequest: builder.mutation<VendorProcurementRequest, Partial<VendorProcurementRequest>>({
      query: (body) => ({
        url: "/api/v1/enterprise-vendors/procurement",
        method: "POST",
        body,
      }),
      transformResponse: transformApiResponse,
      invalidatesTags: [{ type: "ProcurementRequest", id: "LIST" }],
    }),

    updateProcurementStage: builder.mutation<VendorProcurementRequest, { id: string; stage: VendorProcurementRequest["stage"] }>({
      query: ({ id, stage }) => ({
        url: `/api/v1/enterprise-vendors/procurement/${id}/stage`,
        method: "PUT",
        body: { stage },
      }),
      transformResponse: transformApiResponse,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "ProcurementRequest", id },
        { type: "ProcurementRequest", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetEnterpriseVendorsQuery,
  useGetVendorAnalyticsQuery,
  useGetEnterpriseVendorByIdQuery,
  useCreateEnterpriseVendorMutation,
  useUpdateEnterpriseVendorMutation,
  useDeleteEnterpriseVendorMutation,
  useGetProcurementPipelineQuery,
  useCreateProcurementRequestMutation,
  useUpdateProcurementStageMutation,
} = enterpriseVendorsApi;