import { useMemo } from "react";
import type { PunchRecord } from "../types/attendance.types";
import type { FaceAttendanceRecord } from "../services/attendanceApi";

export function useLiveAttendanceList(
  isHrOrAdmin: boolean, isManagerOrAbove: boolean,
  companyFaceData?: { items?: FaceAttendanceRecord[] },
  teamFaceData?: { items?: FaceAttendanceRecord[] },
  personalFaceData?: { items?: FaceAttendanceRecord[] },
  punches: PunchRecord[] = []
) {
  return useMemo(() => {
    const raw = (isHrOrAdmin ? companyFaceData?.items : isManagerOrAbove ? teamFaceData?.items : personalFaceData?.items) || [];
    if (raw.length > 0) {
      return raw.map((item) => ({
        id: item.id, employeeName: item.employeeName || "Team Member", department: item.department || "Engineering",
        timestamp: item.checkIn || "09:15 AM", date: item.date, type: (item.checkOut ? "Check-Out" : "Check-In") as PunchRecord["type"],
        method: "Selfie Camera" as PunchRecord["method"], location: item.location || "Main HQ Office",
        status: (item.status || "Present") as PunchRecord["status"], workHours: item.workingHours ? String(item.workingHours) : undefined,
      }));
    }
    return punches;
  }, [companyFaceData, teamFaceData, personalFaceData, punches, isHrOrAdmin, isManagerOrAbove]);
}
