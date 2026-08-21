import { useMemo } from "react";
import { mapLiveFaceRecord } from "./mapLiveFaceRecord";
import type { PunchRecord } from "../../types/attendance.types";
import type { FaceAttendanceRecord } from "../../services/attendanceApi";

export function useLiveAttendanceList(
  isHrOrAdmin: boolean, isManagerOrAbove: boolean,
  companyFaceData?: { items?: FaceAttendanceRecord[] },
  teamFaceData?: { items?: FaceAttendanceRecord[] },
  personalFaceData?: { items?: FaceAttendanceRecord[] },
  punches: PunchRecord[] = []
) {
  return useMemo(() => {
    const raw = (isHrOrAdmin ? companyFaceData?.items : isManagerOrAbove ? teamFaceData?.items : personalFaceData?.items) || [];
    return raw.length > 0 ? raw.map(mapLiveFaceRecord) : punches;
  }, [companyFaceData, teamFaceData, personalFaceData, punches, isHrOrAdmin, isManagerOrAbove]);
}
