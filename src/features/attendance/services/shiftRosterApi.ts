import { baseApi } from "@/services/api/baseApi";

export const shiftRosterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShifts: builder.query<any[], void>({
      query: () => "/api/v1/attendance/shifts",
      transformResponse: (r: any) => r?.data || r || [],
      providesTags: ["Attendance"],
    }),
    getRosters: builder.query<any[], void>({
      query: () => "/api/v1/attendance/rosters",
      transformResponse: (r: any) => r?.data || r || [],
      providesTags: ["Attendance"],
    }),
  }),
});
export const { useGetShiftsQuery, useGetRostersQuery } = shiftRosterApi;
