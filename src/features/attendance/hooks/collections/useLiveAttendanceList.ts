import { useMemo } from "react";
import { mapLiveFaceRecord } from "./mapLiveFaceRecord";
import type { FaceAttendanceRecord, APIResponse, AttendanceHistoryResponse, PunchRecord } from "../../types";

export function useLiveAttendanceList(
  isHrOrAdmin: boolean, isManagerOrAbove: boolean,
  companyFaceData?: APIResponse<FaceAttendanceRecord[]>, teamFaceData?: APIResponse<FaceAttendanceRecord[]>,
  personalFaceData?: APIResponse<AttendanceHistoryResponse>, punches: PunchRecord[] = []
): PunchRecord[] {
  return useMemo(() => {
    if (isHrOrAdmin && companyFaceData?.data?.length) return companyFaceData.data.map(mapLiveFaceRecord);
    if (isManagerOrAbove && teamFaceData?.data?.length) return teamFaceData.data.map(mapLiveFaceRecord);
    if (personalFaceData?.data?.records?.length) return personalFaceData.data.records.map(mapLiveFaceRecord);
    return punches;
  }, [isHrOrAdmin, isManagerOrAbove, companyFaceData, teamFaceData, personalFaceData, punches]);
}
