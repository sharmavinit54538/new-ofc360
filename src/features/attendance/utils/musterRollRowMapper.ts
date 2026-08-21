export function mapRecordToMusterRow(
  p: Record<string, unknown>,
  user?: { id?: string; name?: string }
): (string | number)[] {
  return [
    String(p.id || "REC-" + Math.random().toString(36).slice(2, 7)),
    String(p.employeeId || p.employee_id || user?.id || "EMP-001"),
    `"${String(p.employeeName || p.name || user?.name || "Staff Member").replace(/"/g, '""')}"`,
    `"${String(p.department || "Engineering").replace(/"/g, '""')}"`,
    String(p.date || new Date().toISOString().split("T")[0]),
    String(p.timestamp || p.checkIn || "09:00 AM"),
    String(p.checkOut || "—"),
    String(p.type || (p.checkOut ? "Check-Out" : "Check-In")),
    String(p.method || p.verificationMethod || "Selfie Camera"),
    `"${String(p.location || "Main HQ Facial Station").replace(/"/g, '""')}"`,
    String(p.workHours || p.workingHours || "08:00:00"),
    String(p.status || "Present"),
  ];
}
