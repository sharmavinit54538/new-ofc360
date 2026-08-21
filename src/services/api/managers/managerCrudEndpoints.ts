import { baseApi } from "../baseApi";
import { Manager } from "@/types/hr";
import type { GetManagersQueryArg, GetManagersQueryParams } from "./managerApiTypes";
import { normalizeManager } from "./normalizeManager";
import { buildManagerCreatePayload } from "./buildManagerCreatePayload";
import { buildManagerUpdatePayload } from "./buildManagerUpdatePayload";

export const managerCrudApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getManagers: builder.query<Manager[], GetManagersQueryArg>({
      query: (params) => {
        const p = params as GetManagersQueryParams | undefined;
        const qp = new URLSearchParams();
        if (p?.department && p.department !== "ALL") qp.append("department", p.department);
        if (p?.status && p.status !== "ALL") qp.append("status", p.status);
        if (p?.search) qp.append("search", p.search);
        if (p?.page) qp.append("page", String(p.page));
        if (p?.limit) qp.append("limit", String(p.limit));
        const qs = qp.toString();
        return `/api/v1/managers${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (raw: any): Manager[] => {
        const payload = raw?.data !== undefined ? raw.data : raw;
        const list = Array.isArray(payload) ? payload : payload?.items || payload?.managers || payload?.data || [];
        return list.map(normalizeManager);
      },
      providesTags: (result) => Array.isArray(result) ? [...result.map(({ id }) => ({ type: "Manager" as const, id })), { type: "Manager", id: "LIST" }] : [{ type: "Manager", id: "LIST" }],
    }),
    getManagerById: builder.query<Manager, string>({
      query: (id) => `/api/v1/managers/${id}`,
      transformResponse: (raw: any): Manager => normalizeManager(raw?.data !== undefined ? raw.data : raw),
      providesTags: (_result, _error, id) => [{ type: "Manager", id }],
    }),
    createManager: builder.mutation<Manager, Omit<Manager, "id"> | Partial<Manager>>({
      query: (body) => ({ url: "/api/v1/managers", method: "POST", body: buildManagerCreatePayload(body) }),
      transformResponse: (raw: any): Manager => normalizeManager(raw?.data !== undefined ? raw.data : raw),
      invalidatesTags: [{ type: "Manager", id: "LIST" }],
    }),
    updateManager: builder.mutation<Manager, { id: string; manager: Partial<Manager> }>({
      query: ({ id, manager }) => ({ url: `/api/v1/managers/${id}`, method: "PUT", body: buildManagerUpdatePayload(manager) }),
      transformResponse: (raw: any): Manager => normalizeManager(raw?.data !== undefined ? raw.data : raw),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Manager", id }, { type: "Manager", id: "LIST" }],
    }),
    deleteManager: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({ url: `/api/v1/managers/${id}`, method: "DELETE" }),
      transformResponse: (raw: any, _m, arg) => raw?.data || (typeof raw === "object" && raw?.success !== undefined ? raw : { success: true, id: arg }),
      invalidatesTags: (_r, _e, id) => [{ type: "Manager", id }, { type: "Manager", id: "LIST" }],
    }),
  }),
});
export const { useGetManagersQuery, useLazyGetManagersQuery, useGetManagerByIdQuery, useCreateManagerMutation, useUpdateManagerMutation, useDeleteManagerMutation } = managerCrudApi;
