export * from "./faceAttendance/faceAttendanceTypes";
export * from "./faceAttendance/faceAttendanceParamsTypes";
export * from "./faceAttendance/normalizeFaceAttendance";
export * from "./faceAttendance/faceAttendancePunchHelper";
export * from "./faceAttendance/faceAttendancePunchEndpoints";
export * from "./faceAttendance/faceAttendanceHistoryEndpoints";

import { faceAttendancePunchApi } from "./faceAttendance/faceAttendancePunchEndpoints";
import { faceAttendanceHistoryApi } from "./faceAttendance/faceAttendanceHistoryEndpoints";

export const faceAttendanceApi = {
  ...faceAttendancePunchApi,
  ...faceAttendanceHistoryApi,
};