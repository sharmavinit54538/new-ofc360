import { baseApi } from "../baseApi";
import { RawEnvelope } from "../envelope";
import type { FaceAttendanceMeResponse } from "./faceAttendanceTypes";
import type { FacePunchPayload } from "./faceAttendanceParamsTypes";
import { normalizeMeResponse } from "./normalizeFaceAttendance";
import { buildFacePunchFormData } from "./faceAttendancePunchHelper";

const ATTENDANCE_TAGS = [
  { type: "Attendance" as const, id: "ME" }, { type: "Attendance" as const, id: "TODAY" }, { type: "Attendance" as const, id: "HISTORY" },
  { type: "Attendance" as const, id: "TEAM" }, { type: "Attendance" as const, id: "COMPANY" }, { type: "Attendance" as const, id: "ANALYTICS" },
  "Attendance" as const, "AttendanceAnalytics" as const,
];

export const faceAttendancePunchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    faceCheckIn: builder.mutation<FaceAttendanceMeResponse, FormData | FacePunchPayload>({
      query: (body) => ({ url: "/api/v1/attendance/face/check-in", method: "POST", body: buildFacePunchFormData(body, "face-checkin.jpg") }),
      transformResponse: (raw: RawEnvelope<FaceAttendanceMeResponse> | any) => normalizeMeResponse(raw),
      invalidatesTags: ATTENDANCE_TAGS,
    }),
    faceCheckOut: builder.mutation<FaceAttendanceMeResponse, FormData | FacePunchPayload>({
      query: (body) => ({ url: "/api/v1/attendance/face/check-out", method: "POST", body: buildFacePunchFormData(body, "face-checkout.jpg") }),
      transformResponse: (raw: RawEnvelope<FaceAttendanceMeResponse> | any) => normalizeMeResponse(raw),
      invalidatesTags: ATTENDANCE_TAGS,
    }),
    getMyFaceAttendance: builder.query<FaceAttendanceMeResponse, void>({
      query: () => "/api/v1/attendance/face/me",
      transformResponse: (raw: RawEnvelope<FaceAttendanceMeResponse> | any) => normalizeMeResponse(raw),
      providesTags: [{ type: "Attendance", id: "ME" }],
    }),
  }),
});
export const { useFaceCheckInMutation, useFaceCheckOutMutation, useGetMyFaceAttendanceQuery } = faceAttendancePunchApi;
