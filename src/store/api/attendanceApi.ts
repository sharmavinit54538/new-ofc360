import { baseApi } from './baseApi';
import { ApiResponse } from '@/types/api';

export const attendanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAttendanceStatus: builder.query<ApiResponse<any>, void>({
      query: () => '/api/v1/attendance/status',
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAttendanceStatusQuery,
} = attendanceApi;
