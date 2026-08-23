import { useGetEmployeesQuery } from "@/services/api/employeeApi";
import { useAttendanceStore } from "@/stores/attendanceStore";
import { usePayrollStore } from "@/stores/payrollStore";
import { useLeaveStore } from "@/stores/leaveStore";

export function useReportsPageStores() {
  const { data: rawEmployees = [] } = useGetEmployeesQuery();
  const employees = Array.isArray(rawEmployees) ? rawEmployees : Array.isArray((rawEmployees as any)?.items) ? (rawEmployees as any).items : Array.isArray((rawEmployees as any)?.data) ? (rawEmployees as any).data : [];
  const attendanceStore = useAttendanceStore();
  const punches = Array.isArray(attendanceStore.punches) ? attendanceStore.punches : [];
  const payrollStore = usePayrollStore();
  const runs = Array.isArray(payrollStore.payrollRuns) ? payrollStore.payrollRuns : Array.isArray((payrollStore as any).runs) ? (payrollStore as any).runs : [];
  const complianceFilings = Array.isArray(payrollStore.complianceFilings) ? payrollStore.complianceFilings : [];
  const leaveStore = useLeaveStore();
  const leaveRequests = Array.isArray(leaveStore.leaveRequests) ? leaveStore.leaveRequests : [];

  return { employees, punches, runs, complianceFilings, leaveRequests };
}
