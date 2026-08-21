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
    const personalRecords = personalFaceData?.data?.items || personalFaceData?.data?.records;
    if (Array.isArray(personalRecords) && personalRecords.length > 0) return personalRecords.map(mapLiveFaceRecord);
    return Array.isArray(punches) ? punches : [];
  }, [isHrOrAdmin, isManagerOrAbove, companyFaceData, teamFaceData, personalFaceData, punches]);
}
