import { baseApi } from "../baseApi";
import { store } from "@/app/store";
import { SuperAdminDashboardData } from "@/types/superAdmin.types";

export const superAdminDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSuperAdminDashboard: builder.query<SuperAdminDashboardData, void>({
      query: () => "/api/v1/super-admin/dashboard",
      providesTags: ["SuperAdminDashboard"],
    }),
    getSuperAdminStatistics: builder.query<SuperAdminDashboardData, void>({
      query: () => "/api/v1/super-admin/statistics",
      providesTags: ["SuperAdminDashboard"],
    }),
  }),
});
export const { useGetSuperAdminDashboardQuery, useGetSuperAdminStatisticsQuery } = superAdminDashboardApi;
export const getDashboard = async (): Promise<SuperAdminDashboardData> => store.dispatch(superAdminDashboardApi.endpoints.getSuperAdminDashboard.initiate()).unwrap();
export const getStatistics = async (): Promise<SuperAdminDashboardData> => store.dispatch(superAdminDashboardApi.endpoints.getSuperAdminStatistics.initiate()).unwrap();
