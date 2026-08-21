import { baseApi } from "@/services/api/baseApi";
import { toFormData } from "./toFormData";
import type { APIResponse, AttendanceRecord, FacePunchRequest } from "../types";

export const punchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    checkIn: builder.mutation<APIResponse<AttendanceRecord>, FormData | FacePunchRequest>({
      query: (body) => ({ url: "/api/v1/attendance/face/check-in", method: "POST", body: toFormData(body) }),
      invalidatesTags: ["Attendance", "AttendanceAnalytics"],
    }),
    checkOut: builder.mutation<APIResponse<AttendanceRecord>, FormData | FacePunchRequest>({
      query: (body) => ({ url: "/api/v1/attendance/face/check-out", method: "POST", body: toFormData(body) }),
      invalidatesTags: ["Attendance", "AttendanceAnalytics"],
    }),
  }),
});

export const { useCheckInMutation, useCheckOutMutation } = punchApi;
