export interface ManagerPermissions {
  canApproveLeave: boolean; canApproveAttendance: boolean; canApprovePayroll: boolean;
  canConductAppraisals: boolean; canInitiateRequisitions: boolean;
}

export interface Manager {
  id: string; employeeId: string; name: string; email: string; department: string;
  role: string; teamSize: number; directReportIds: string[]; permissions: ManagerPermissions;
}