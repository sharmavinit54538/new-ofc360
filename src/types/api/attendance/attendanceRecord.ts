export interface AttendanceRecord {
  id: string; employeeId: string; employeeName: string; date: string;
  checkIn?: string; checkOut?: string;
  status: 'present' | 'absent' | 'half-day' | 'late' | 'on-leave';
  workHours?: number; faceVerificationStatus?: 'verified' | 'failed' | 'pending'; location?: string;
}