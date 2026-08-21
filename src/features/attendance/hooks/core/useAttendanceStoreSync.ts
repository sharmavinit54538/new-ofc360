import { useLeaveStore } from "@/stores/leaveStore";
import { useAttendanceStore } from "@/stores/attendanceStore";

export function useAttendanceStoreSync() {
  const { leaveRequests: localLeaves, addLeaveRequest: addLocalLeave, updateLeaveStatus: updateLocalLeaveStatus } = useLeaveStore();
  const attStore = useAttendanceStore();
  return {
    localLeaves, addLocalLeave, updateLocalLeaveStatus,
    punches: attStore.punches, shifts: attStore.shifts, rosters: attStore.rosters,
    localHolidays: attStore.holidays, regularizations: attStore.regularizations,
    localTimesheets: attStore.timesheets, overtimes: attStore.overtimes,
    addPunch: attStore.addPunch, addShift: attStore.addShift, deleteShift: attStore.deleteShift,
    addRoster: attStore.addRoster, deleteRoster: attStore.deleteRoster,
    addLocalHoliday: attStore.addHoliday, deleteLocalHoliday: attStore.deleteHoliday,
    addRegularization: attStore.addRegularization, updateRegularizationStatus: attStore.updateRegularizationStatus,
    addLocalTimesheet: attStore.addTimesheet, updateLocalTimesheetStatus: attStore.updateTimesheetStatus,
    addOvertime: attStore.addOvertime, updateOvertimeStatus: attStore.updateOvertimeStatus,
  };
}
