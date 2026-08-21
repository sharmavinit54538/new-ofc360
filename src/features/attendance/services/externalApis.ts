export {
  useFaceCheckInMutation, useFaceCheckOutMutation, useGetMyFaceAttendanceQuery,
  useGetPersonalFaceHistoryQuery, useGetTeamFaceAttendanceQuery, useGetCompanyFaceAttendanceQuery,
  useGetFaceAttendanceAnalyticsQuery, type FaceAttendanceRecord,
} from "@/services/api/faceAttendanceApi";
export {
  useGetCalendarHolidaysQuery, useGetCalendarHolidaysQuery as useGetHolidaysQuery,
  useCreateCalendarHolidaysMutation, useCreateCalendarHolidaysMutation as useCreateHolidayMutation,
  useDeleteCalendarHolidaysIdMutation, useDeleteCalendarHolidaysIdMutation as useDeleteHolidayMutation,
} from "@/store/api/calendarApi";
