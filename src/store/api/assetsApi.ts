import { baseApi } from "./baseApi";

// ==========================================
// Types & Interfaces
// ==========================================

/**
 * Physical Hardware Asset Interface
 * Note: Software license tracking / license optimization is NOT covered by this backend API.
 * This API strictly covers physical hardware assets (laptops, monitors, mobile devices, etc.).
 * Do not build license-specific UI against this slice.
 */
export interface Asset {
  id: string;
  tag: string;
  name: string;
  category: string; // default "laptop"
  serial?: string;
  vendor?: string;
  purchase_date?: string;
  warranty_until?: string;
  status: string; // available | assigned | lost | retired | maintenance
  employee_id?: string;
  assigned_at?: string;
  next_maintenance?: string;
  notes?: string;
  brand?: string;
  model?: string;
  purchase_cost?: number;
  location?: string;
  description?: string;
  image_url?: string;
  timeline?: Array<{ id: string; event: string; performedBy: string; timestamp: string; notes?: string }>;
}

export interface AssetAssignmentHistory {
  id: string;
  employee: string;
  department: string;
  assignDate: string;
  expectedReturnDate?: string;
  actualReturnDate?: string;
  notes?: string;
}

export interface AssetMaintenanceRecord {
  id: string;
  requestDate: string;
  serviceDate?: string;
  vendor: string;
  cost: number;
  notes?: string;
}

export interface AssetQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category?: string;
  vendor?: string;
  employee_id?: string;
}

export interface AssetListResponse {
  items: Asset[];
  total: number;
  page?: number;
  limit?: number;
}

export interface AssetAnalyticsResponse {
  total_assets: number;
  available: number;
  assigned: number;
  maintenance: number;
  lost: number;
  retired: number;
  total_value?: number;
  category_breakdown?: Record<string, number>;
  status_breakdown?: Record<string, number>;
}

export interface AssetFilterOptionsResponse {
  categories: string[];
  statuses: string[];
  vendors: string[];
  locations: string[];
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
// Asset Intelligence RTK Query Endpoints
// ==========================================

export const assetsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAssets: builder.query<Asset[] | AssetListResponse, AssetQueryParams | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.append("page", params.page.toString());
        if (params?.limit) searchParams.append("limit", params.limit.toString());
        if (params?.search) searchParams.append("search", params.search);
        if (params?.status) searchParams.append("status", params.status);
        if (params?.category) searchParams.append("category", params.category);
        if (params?.vendor) searchParams.append("vendor", params.vendor);
        if (params?.employee_id) searchParams.append("employee_id", params.employee_id);
        const q = searchParams.toString();
        return `/api/v1/assets${q ? `?${q}` : ""}`;
      },
      transformResponse: transformApiResponse,
      providesTags: (result) => {
        const items = Array.isArray(result) ? result : result?.items || [];
        return [
          ...items.map(({ id }) => ({ type: "Asset" as const, id })),
          { type: "Asset", id: "LIST" },
        ];
      },
    }),

    getAssetAnalytics: builder.query<AssetAnalyticsResponse, void>({
      query: () => "/api/v1/assets/analytics",
      transformResponse: transformApiResponse,
      providesTags: ["AssetAnalytics"],
    }),

    getAssetFilterOptions: builder.query<AssetFilterOptionsResponse, void>({
      query: () => "/api/v1/assets/filter-options",
      keepUnusedDataFor: 600,
      transformResponse: transformApiResponse,
      providesTags: ["AssetFilterOptions"],
    }),

    uploadAssetImage: builder.mutation<{ image_url: string }, FormData>({
      query: (body) => ({
        url: "/api/v1/assets/upload-image",
        method: "POST",
        body,
      }),
      transformResponse: transformApiResponse,
      invalidatesTags: [{ type: "Asset", id: "LIST" }],
    }),

    createAsset: builder.mutation<Asset, Partial<Asset>>({
      query: (body) => ({
        url: "/api/v1/assets",
        method: "POST",
        body,
      }),
      transformResponse: transformApiResponse,
      invalidatesTags: [{ type: "Asset", id: "LIST" }, "AssetAnalytics"],
    }),

    getAssetById: builder.query<Asset, string>({
      query: (id) => `/api/v1/assets/${id}`,
      transformResponse: transformApiResponse,
      providesTags: (_result, _error, id) => [{ type: "Asset", id }],
    }),

    getPublicAssetById: builder.query<Asset, string>({
      query: (id) => `/api/v1/assets/public/${id}`,
      transformResponse: transformApiResponse,
      providesTags: (_result, _error, id) => [{ type: "Asset", id }],
    }),

    updateAsset: builder.mutation<Asset, { id: string } & Partial<Asset>>({
      query: ({ id, ...body }) => ({
        url: `/api/v1/assets/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: transformApiResponse,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Asset", id },
        { type: "Asset", id: "LIST" },
        "AssetAnalytics",
      ],
    }),

    deleteAsset: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/api/v1/assets/${id}`,
        method: "DELETE",
      }),
      transformResponse: transformApiResponse,
      invalidatesTags: (_result, _error, id) => [
        { type: "Asset", id },
        { type: "Asset", id: "LIST" },
        "AssetAnalytics",
      ],
    }),

    assignAsset: builder.mutation<Asset, { id: string; employee_id: string; notes?: string }>({
      query: ({ id, ...body }) => ({
        url: `/api/v1/assets/${id}/assign`,
        method: "POST",
        body,
      }),
      transformResponse: transformApiResponse,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Asset", id },
        { type: "Asset", id: "LIST" },
        "AssetAnalytics",
      ],
    }),

    returnAsset: builder.mutation<Asset, { id: string; notes?: string }>({
      query: ({ id, ...body }) => ({
        url: `/api/v1/assets/${id}/return`,
        method: "POST",
        body,
      }),
      transformResponse: transformApiResponse,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Asset", id },
        { type: "Asset", id: "LIST" },
        "AssetAnalytics",
      ],
    }),

    transferAsset: builder.mutation<Asset, { id: string; target_employee_id: string; notes?: string }>({
      query: ({ id, ...body }) => ({
        url: `/api/v1/assets/${id}/transfer`,
        method: "POST",
        body,
      }),
      transformResponse: transformApiResponse,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Asset", id },
        { type: "Asset", id: "LIST" },
        "AssetAnalytics",
      ],
    }),

    markAssetLost: builder.mutation<Asset, { id: string; notes?: string }>({
      query: ({ id, ...body }) => ({
        url: `/api/v1/assets/${id}/lost`,
        method: "POST",
        body,
      }),
      transformResponse: transformApiResponse,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Asset", id },
        { type: "Asset", id: "LIST" },
        "AssetAnalytics",
      ],
    }),

    retireAsset: builder.mutation<Asset, { id: string; notes?: string }>({
      query: ({ id, ...body }) => ({
        url: `/api/v1/assets/${id}/retired`,
        method: "POST",
        body,
      }),
      transformResponse: transformApiResponse,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Asset", id },
        { type: "Asset", id: "LIST" },
        "AssetAnalytics",
      ],
    }),

    logAssetMaintenance: builder.mutation<Asset, { id: string; serviceDate?: string; vendor?: string; cost?: number; notes?: string }>({
      query: ({ id, ...body }) => ({
        url: `/api/v1/assets/${id}/maintenance`,
        method: "POST",
        body,
      }),
      transformResponse: transformApiResponse,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Asset", id },
        { type: "Asset", id: "LIST" },
        "AssetAnalytics",
      ],
    }),
  }),
});

export const {
  useGetAssetsQuery,
  useGetAssetAnalyticsQuery,
  useGetAssetFilterOptionsQuery,
  useUploadAssetImageMutation,
  useCreateAssetMutation,
  useGetAssetByIdQuery,
  useGetPublicAssetByIdQuery,
  useUpdateAssetMutation,
  useDeleteAssetMutation,
  useAssignAssetMutation,
  useReturnAssetMutation,
  useTransferAssetMutation,
  useMarkAssetLostMutation,
  useRetireAssetMutation,
  useLogAssetMaintenanceMutation,
} = assetsApi;
