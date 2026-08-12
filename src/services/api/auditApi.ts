import { baseApi } from "./baseApi";

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  ipAddress: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

export type AuditLogParams = { module?: string; userId?: string } | void;

export const auditApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAuditLogs: builder.query<AuditLog[], AuditLogParams>({
      query: (params) => {
        const p = params as { module?: string; userId?: string } | undefined;
        const search = new URLSearchParams();
        if (p?.module) search.append("module", p.module);
        if (p?.userId) search.append("userId", p.userId);
        const q = search.toString();
        return `/api/v1/audit/logs${q ? `?${q}` : ""}`;
      },
      providesTags: ["AuditLog"],
    }),
  }),
});

export const { useGetAuditLogsQuery } = auditApi;
