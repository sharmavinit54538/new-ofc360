export interface PunchRecord {
  id: string; employeeId: string; employeeName: string; department: string;
  timestamp: string; date?: string; companyId?: string;
  type: "Check-In" | "Check-Out" | "Break-Start" | "Break-Resume";
  method: "Selfie Camera"; location: string;
  workHours?: string; breakHours?: string; breakDurationMins?: number;
  netWorkHours?: string; lateMinutes?: number; earlyMinutes?: number;
  overtimeHours?: string; taskNotes?: string; regularized?: boolean;
  status: "On Time" | "Late" | "Overtime" | "Half Day" | "Early Departure" | "Regularized" | "Missing Punch" | "On Leave" | "Holiday" | "Week Off";
}