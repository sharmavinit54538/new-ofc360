export interface GetEmployeesQueryParams {
  department?: string; status?: string; role?: string; search?: string; page?: number; limit?: number;
  employment_type?: string; designation?: string; shift?: string; sort?: string; order?: string;
}
export type GetEmployeesQueryArg = GetEmployeesQueryParams | void;
export interface EmployeeStats {
  totalEmployees: number; activeEmployees: number; onLeaveEmployees: number; probationEmployees: number; departmentCounts?: Record<string, number>;
}
export interface EmployeeDashboardData {
  totalCount: number; activeCount: number; newHiresThisMonth: number; turnoverRate: number;
  departmentDistribution: Array<{ department: string; count: number }>;
  recentActivities?: Array<{ id: string; type: string; description: string; timestamp: string }>;
}
export interface ImportResult { totalProcessed: number; successful: number; failed: number; errors?: Array<{ row: number; error: string }>; }
export interface OnboardingStatus { employeeId: string; status: "PENDING" | "IN_PROGRESS" | "APPROVED" | "REJECTED" | string; completedSteps: number; totalSteps: number; steps?: Array<{ id: string; name: string; isCompleted: boolean }>; }
export interface ActivateEmployeePayload { id?: string; employee_id?: string; token: string; new_password: string; confirm_password: string; }
export interface ActivateEmployeeResponse { success?: boolean; message?: string; data?: any; token?: string; access_token?: string; refreshToken?: string; user?: any; }
