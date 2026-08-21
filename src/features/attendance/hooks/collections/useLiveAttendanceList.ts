import { useMemo } from "react";
import { mapLiveFaceRecord } from "./mapLiveFaceRecord";
import type { FaceAttendanceRecord, APIResponse, AttendanceHistoryResponse, PunchRecord } from "../../types";

export function useLiveAttendanceList(
  isHrOrAdmin: boolean, isManagerOrAbove: boolean,
  companyFaceData?: APIResponse<FaceAttendanceRecord[]>, teamFaceData?: APIResponse<FaceAttendanceRecord[]>,
  personalFaceData?: APIResponse<AttendanceHistoryResponse>, punches: PunchRecord[] = []
): PunchRecord[] {
  return useMemo(() => {
    if (isHrOrAdmin && Array.isArray(companyFaceData?.data) && companyFaceData.data.length > 0) return companyFaceData.data.map(mapLiveFaceRecord);
    if (isManagerOrAbove && Array.isArray(teamFaceData?.data) && teamFaceData.data.length > 0) return teamFaceData.data.map(mapLiveFaceRecord);
    if (Array.isArray(personalFaceData?.data?.records) && personalFaceData.data.records.length > 0) return personalFaceData.data.records.map(mapLiveFaceRecord);
    return Array.isArray(punches) ? punches : [];
  }, [isHrOrAdmin, isManagerOrAbove, companyFaceData, teamFaceData, personalFaceData, punches]);
}
