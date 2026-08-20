export interface LeaveRequest {
  id: string; employeeId: string; employeeName: string;
  leaveType: 'sick' | 'casual' | 'earned' | 'maternity' | 'paternity' | 'unpaid';
  startDate: string; endDate: string; totalDays: number; reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  appliedOn: string; reviewedBy?: string; reviewedAt?: string;
}

export interface LeaveBalance {
  employeeId: string;
  sickLeave: { total: number; used: number; remaining: number };
  casualLeave: { total: number; used: number; remaining: number };
  earnedLeave: { total: number; used: number; remaining: number };
}