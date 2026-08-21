import { baseApi } from "./baseApi";
import type { AuditLog, AuditLogParams } from "./audit/auditTypes";
export * from "./audit/auditTypes";

export const auditApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAuditLogs: builder.query<AuditLog[], AuditLogParams>({
      query: (params) => {
        const p = params as { module?: string; userId?: string } | undefined;
        const s = new URLSearchParams();
        if (p?.module) s.append("module", p.module);
        if (p?.userId) s.append("userId", p.userId);
        const q = s.toString();
        return `/api/v1/audit/logs${q ? `?${q}` : ""}`;
      },
      providesTags: ["AuditLog"],
    }),
  }),
});
export const { useGetAuditLogsQuery } = auditApi;