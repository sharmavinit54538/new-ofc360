import { toast } from "sonner";
import {
  evaluateArrivalStatus,
  evaluateDepartureStatus,
  computeNetWorkHours,
} from "@/utils/attendanceCalculations";

export { evaluateArrivalStatus, evaluateDepartureStatus, computeNetWorkHours };

export function formatSecs(totalSecs: number): string {
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function exportMusterRollCsv(
  recordsToExport: Array<Record<string, unknown>>,
  user?: { id?: string; name?: string }
): void {
  if (!recordsToExport || recordsToExport.length === 0) {
    toast.info("No attendance punch records to export yet.");
    return;
  }

  const headers = [
    "Record ID",
    "Employee ID",
    "Employee Name",
    "Department",
    "Date",
    "Timestamp / Check-In",
    "Check-Out",
    "Punch Type",
    "Verification Method",
    "Location",
    "Work Hours",
    "Status",
  ];

  const rows = recordsToExport.map((p) => [
    p.id || "REC-" + Math.random().toString(36).slice(2, 7),
    p.employeeId || p.employee_id || user?.id || "EMP-001",
    `"${String(p.employeeName || p.name || user?.name || "Staff Member").replace(/"/g, '""')}"`,
    `"${String(p.department || "Engineering").replace(/"/g, '""')}"`,
    p.date || new Date().toISOString().split("T")[0],
    p.timestamp || p.checkIn || "09:00 AM",
    p.checkOut || "—",
    p.type || (p.checkOut ? "Check-Out" : "Check-In"),
    p.method || p.verificationMethod || "Selfie Camera",
    `"${String(p.location || "Main HQ Facial Station").replace(/"/g, '""')}"`,
    p.workHours || p.workingHours || "08:00:00",
    p.status || "Present",
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `OFC360_Attendance_Muster_Roll_${new Date().toISOString().split("T")[0]}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  toast.success("Downloaded Attendance Muster Roll (.csv)");
}
