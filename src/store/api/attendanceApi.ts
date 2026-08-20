import { baseApi } from './baseApi';
import { ApiResponse } from '@/types/api';

export const attendanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAttendanceStatus: builder.query<ApiResponse<any>, void>({
      query: () => '/api/v1/attendance/status',
      providesTags: [{ type: 'Attendance', id: 'STATUS' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAttendanceStatusQuery,
} = attendanceApi;

// Re-export hooks from faceAttendanceApi and feature attendanceApi
export * from '@/services/api/faceAttendanceApi';
export * from '@/features/attendance/attendanceApi';