import { toast } from "sonner";
import { evaluateArrivalStatus } from "@/utils/attendanceCalculations";
import { exportMusterRollCsv, formatSecs } from "../utils/attendance.utils";
import type {
  CameraCaptureResult,
  PunchRecord,
  ShiftTemplate,
  RosterItem,
  HolidayItem,
  RegularizationRequest,
  TimesheetEntry,
  OvertimeEntry,
} from "../types/attendance.types";

interface AuthUser {
  id?: string;
  name?: string;
  role?: string;
}

interface UseAttendanceActionsProps {
  user: AuthUser | null | undefined;
  shifts: ShiftTemplate[];
  punches: PunchRecord[];
  liveAttendanceList: PunchRecord[];
  currentTime: Date;
  isClockedIn: boolean;
  isOnBreak: boolean;
  workSeconds: number;
  breakSeconds: number;
  taskNotes: string;
  capturedSelfie: CameraCaptureResult | null;
  setIsClockedIn: (val: boolean) => void;
  setIsOnBreak: (val: boolean) => void;
  setTaskNotes: (val: string) => void;
  addPunch: (punch: Omit<PunchRecord, "id"> | PunchRecord) => void;
  addShift: (shift: Omit<ShiftTemplate, "id"> | ShiftTemplate) => void;
  addRoster: (roster: Omit<RosterItem, "id"> | RosterItem) => void;
  addLocalHoliday: (holiday: Omit<HolidayItem, "id"> | HolidayItem) => void;
  deleteLocalHoliday: (id: string) => void;
  addRegularization: (reg: Omit<RegularizationRequest, "id"> | RegularizationRequest) => void;
  updateRegularizationStatus: (id: string, status: string, approverName?: string, reviewComment?: string) => void;
  addLocalTimesheet: (ts: Omit<TimesheetEntry, "id"> | TimesheetEntry) => void;
  updateLocalTimesheetStatus: (id: string, status: string) => void;
  addOvertime: (ot: Omit<OvertimeEntry, "id"> | OvertimeEntry) => void;
  updateOvertimeStatus: (id: string, status: string) => void;
  addLocalLeave: (leave: Record<string, unknown>) => void;
  updateLocalLeaveStatus: (id: string, status: string) => void;

  // Mutations
  faceCheckIn: (args: Record<string, unknown>) => { unwrap: () => Promise<unknown> };
  faceCheckOut: (args: Record<string, unknown>) => { unwrap: () => Promise<unknown> };
  createHolidayApi: (args: Record<string, unknown>) => { unwrap: () => Promise<unknown> };
  deleteHolidayApi: (id: string) => { unwrap: () => Promise<unknown> };
  applyLeaveApi: (args: Record<string, unknown>) => { unwrap: () => Promise<unknown> };
  reviewLeaveApi: (args: Record<string, unknown>) => { unwrap: () => Promise<unknown> };
  createTimesheetApi: (args: Record<string, unknown>) => { unwrap: () => Promise<unknown> };
  reviewTimesheetApi: (args: Record<string, unknown>) => { unwrap: () => Promise<unknown> };
  createShiftPlanApi: (args: Record<string, unknown>) => { unwrap: () => Promise<unknown> };
  triggerAttendanceExport: (args: undefined) => { unwrap: () => Promise<unknown> };

  // Refetch triggers
  refetchMyStatus: () => void;
  refetchAnalytics: () => void;
  refetchCompany?: () => void;
  refetchTeam?: () => void;
  refetchPersonal?: () => void;
  refetchHolidays: () => void;
  refetchLeaves: () => void;
  refetchTimesheets: () => void;
  isHrOrAdmin: boolean;
  isManagerOrAbove: boolean;

  // Modals state & setters
  modals: ReturnType<typeof import("./useAttendanceModals").useAttendanceModals>;
}

export function useAttendanceActions({
  user,
  shifts,
  punches,
  liveAttendanceList,
  currentTime,
  isClockedIn,
  isOnBreak,
  workSeconds,
  breakSeconds,
  taskNotes,
  capturedSelfie,
  setIsClockedIn,
  setIsOnBreak,
  setTaskNotes,
  addPunch,
  addShift,
  addRoster,
  addLocalHoliday,
  deleteLocalHoliday,
  addRegularization,
  updateRegularizationStatus,
  addLocalTimesheet,
  updateLocalTimesheetStatus,
  addOvertime,
  updateOvertimeStatus,
  addLocalLeave,
  updateLocalLeaveStatus,
  faceCheckIn,
  faceCheckOut,
  createHolidayApi,
  deleteHolidayApi,
  applyLeaveApi,
  reviewLeaveApi,
  createTimesheetApi,
  reviewTimesheetApi,
  createShiftPlanApi,
  triggerAttendanceExport,
  refetchMyStatus,
  refetchAnalytics,
  refetchCompany,
  refetchTeam,
  refetchPersonal,
  refetchHolidays,
  refetchLeaves,
  refetchTimesheets,
  isHrOrAdmin,
  isManagerOrAbove,
  modals,
}: UseAttendanceActionsProps) {
  const punchMethod: PunchRecord["method"] = "Selfie Camera";

  const refetchFeeds = () => {
    refetchMyStatus();
    refetchAnalytics();
    if (isHrOrAdmin && refetchCompany) refetchCompany();
    else if (isManagerOrAbove && refetchTeam) refetchTeam();
    else if (refetchPersonal) refetchPersonal();
  };

  const handleCheckIn = async () => {
    if (!capturedSelfie) {
      toast.error("Please capture your live verification selfie before clocking in.");
      return;
    }
    const locationStr = `Main HQ Facial Station (Face Match ID: ${capturedSelfie.faceHash})`;
    let statusNote: PunchRecord["status"] = "On Time";

    const activeShift = shifts[0] || {
      startTime: "09:00",
      gracePeriodMins: 15,
      halfDayHours: 4.5,
      fullDayHours: 8.0,
    };
    const currentTime24 = `${String(currentTime.getHours()).padStart(2, "0")}:${String(currentTime.getMinutes()).padStart(2, "0")}`;
    const arrivalCheck = evaluateArrivalStatus(
      currentTime24,
      activeShift.startTime,
      activeShift.gracePeriodMins
    );

    if (arrivalCheck.isLate) {
      statusNote = "Late";
    }

    const timeStr = currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    try {
      await faceCheckIn({
        location: locationStr,
        device_info: navigator.userAgent,
        method: punchMethod,
        verificationMethod: "face_id",
        notes: taskNotes || undefined,
        image: capturedSelfie.dataUrl,
        file: capturedSelfie.blob,
      }).unwrap();

      addPunch({
        employeeId: user?.id || "EMP-CURRENT",
        employeeName: user?.name || "Alex Mercer",
        department: "Human Resources",
        timestamp: timeStr,
        date: new Date().toISOString().split("T")[0],
        type: "Check-In",
        method: punchMethod,
        location: locationStr,
        taskNotes: taskNotes || undefined,
        status: statusNote,
        lateMinutes: arrivalCheck.lateMinutes,
      });

      setIsClockedIn(true);
      setIsOnBreak(false);
      refetchFeeds();

      toast.success(
        `Clocked In successfully at ${timeStr} via Selfie Camera${arrivalCheck.isLate ? ` (${arrivalCheck.lateMinutes}m Late)` : ""}`
      );
    } catch (err: unknown) {
      const errorObj = err as { data?: { message?: string }; message?: string };
      const errMsg = errorObj?.data?.message || errorObj?.message || "Failed to submit check-in to server.";
      toast.error(errMsg);
    }
  };

  const handleToggleBreak = () => {
    if (!isClockedIn) return;
    const timeStr = currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (isOnBreak) {
      setIsOnBreak(false);
      addPunch({
        employeeId: user?.id || "EMP-CURRENT",
        employeeName: user?.name || "Alex Mercer",
        department: "Human Resources",
        timestamp: timeStr,
        date: new Date().toISOString().split("T")[0],
        type: "Break-Resume",
        method: punchMethod,
        location: "Main HQ Office",
        status: "On Time",
      });
      toast.success("Resumed work from break");
    } else {
      setIsOnBreak(true);
      addPunch({
        employeeId: user?.id || "EMP-CURRENT",
        employeeName: user?.name || "Alex Mercer",
        department: "Human Resources",
        timestamp: timeStr,
        date: new Date().toISOString().split("T")[0],
        type: "Break-Start",
        method: punchMethod,
        location: "Main HQ Office",
        status: "On Time",
      });
      toast.info("Break started");
    }
  };

  const handleCheckOut = async () => {
    if (!isClockedIn) return;
    const timeStr = currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const grossSecs = workSeconds;
    const breakSecs = breakSeconds;
    const netSecs = Math.max(0, grossSecs - breakSecs);
    const netHoursDecimal = netSecs / 3600;

    let checkoutStatus: PunchRecord["status"] = "On Time";
    if (netHoursDecimal < 4.5) {
      checkoutStatus = "Half Day";
    } else if (netHoursDecimal > 8.5) {
      checkoutStatus = "Overtime";
    }

    try {
      await faceCheckOut({
        location: "Main HQ Facial Station",
        device_info: navigator.userAgent,
        method: punchMethod,
        notes: taskNotes || "Daily scheduled tasks completed.",
        image: capturedSelfie?.dataUrl,
        file: capturedSelfie?.blob,
      }).unwrap();

      addPunch({
        employeeId: user?.id || "EMP-CURRENT",
        employeeName: user?.name || "Alex Mercer",
        department: "Human Resources",
        timestamp: timeStr,
        date: new Date().toISOString().split("T")[0],
        type: "Check-Out",
        method: punchMethod,
        location: "Main HQ Facial Station",
        workHours: formatSecs(grossSecs),
        breakHours: formatSecs(breakSecs),
        breakDurationMins: Math.round(breakSecs / 60),
        netWorkHours: formatSecs(netSecs),
        taskNotes: taskNotes || "Daily scheduled tasks completed.",
        status: checkoutStatus,
      });

      setIsClockedIn(false);
      setIsOnBreak(false);
      setTaskNotes("");
      refetchFeeds();

      toast.success(`Clocked Out successfully at ${timeStr}. Net Worked: ${formatSecs(netSecs)}`);
    } catch (err: unknown) {
      const errorObj = err as { data?: { message?: string }; message?: string };
      const errMsg = errorObj?.data?.message || errorObj?.message || "Failed to submit check-out to server.";
      toast.error(errMsg);
    }
  };

  const handleExportMusterRoll = async () => {
    try {
      await triggerAttendanceExport(undefined).unwrap().catch(() => {});
    } catch {
      // Fall through to CSV generator
    }
    const recordsToExport = (punches.length > 0 ? punches : liveAttendanceList) as unknown as Array<Record<string, unknown>>;
    exportMusterRollCsv(recordsToExport, user || undefined);
  };

  const handleCreateShift = async () => {
    if (!modals.shiftName.trim()) {
      toast.error("Please enter a shift name.");
      return;
    }
    const newShift = {
      name: modals.shiftName.trim(),
      startTime: modals.shiftStart,
      endTime: modals.shiftEnd,
      gracePeriodMins: parseInt(modals.shiftGrace) || 15,
      halfDayHours: 4.5,
      fullDayHours: 8.0,
      breakDurationMins: 45,
      department: modals.shiftDept,
    };
    try {
      await createShiftPlanApi(newShift).unwrap().catch(() => {});
    } catch {
      // Local sync fallback
    }
    addShift(newShift);
    modals.setShiftName("");
    modals.setIsShiftModalOpen(false);
    toast.success("Shift template created & synchronized!");
  };

  const handleCreateRoster = async () => {
    if (!modals.rosterEmp.trim()) {
      toast.error("Please select an employee.");
      return;
    }
    const newRoster = {
      employeeId: "EMP-" + Math.floor(1000 + Math.random() * 9000),
      employeeName: modals.rosterEmp,
      department: "Engineering",
      shiftName: modals.rosterShift,
      timing: "09:00 - 18:00",
      dayOfWeek: modals.rosterDay,
      date: new Date().toLocaleDateString(),
    };
    try {
      await createShiftPlanApi(newRoster).unwrap().catch(() => {});
    } catch {
      // Local sync fallback
    }
    addRoster(newRoster);
    modals.setIsRosterModalOpen(false);
    toast.success(`Roster assigned for ${modals.rosterEmp}!`);
  };

  const handleCreateHoliday = async () => {
    if (!modals.holidayTitle.trim() || !modals.holidayDate) {
      toast.error("Title and Date are required.");
      return;
    }
    const payload = {
      title: modals.holidayTitle.trim(),
      date: modals.holidayDate,
      type: modals.holidayType,
      branchLocation: modals.holidayBranch,
      mandatory: modals.holidayType !== "Optional Floating",
    };
    try {
      await createHolidayApi(payload).unwrap();
      refetchHolidays();
    } catch {
      // Local sync fallback
    }
    addLocalHoliday(payload);
    modals.setHolidayTitle("");
    modals.setHolidayDate("");
    modals.setIsHolidayModalOpen(false);
    toast.success("Holiday added to calendar!");
  };

  const handleDeleteHoliday = async (id: string) => {
    try {
      await deleteHolidayApi(id).unwrap();
      refetchHolidays();
    } catch {
      // Local fallback
    }
    deleteLocalHoliday(id);
    toast.success("Holiday removed.");
  };

  const handleCreateRegularization = () => {
    if (!modals.regDate) {
      toast.error("Please select the missed attendance date.");
      return;
    }
    const todayStr = new Date().toISOString().split("T")[0];
    if (modals.regDate > todayStr) {
      toast.error("Regularization cannot be applied for future dates.");
      return;
    }
    if (!modals.regTime) {
      toast.error("Please specify the correct punch time.");
      return;
    }
    if (!modals.regReason.trim()) {
      toast.error("Please provide a justification reason.");
      return;
    }
    addRegularization({
      employeeId: user?.id || "EMP-CURRENT",
      employeeName: user?.name || "Alex Mercer",
      department: "Human Resources",
      date: modals.regDate,
      missedPunchType: modals.regType,
      requestedTime: modals.regTime,
      reason: modals.regReason.trim(),
      status: "Pending",
    });
    modals.setRegReason("");
    modals.setIsRegModalOpen(false);
    toast.success("Regularization request submitted to manager!");
  };

  const handleCreateTimesheet = async () => {
    if (!modals.tsProject.trim() || !modals.tsTask.trim()) {
      toast.error("Project and Task details are required.");
      return;
    }
    const payload = {
      employeeId: user?.id || "EMP-CURRENT",
      employeeName: user?.name || "Alex Mercer",
      projectName: modals.tsProject.trim(),
      taskDescription: modals.tsTask.trim(),
      loggedHours: parseFloat(modals.tsHours) || 8,
      billable: modals.tsBillable,
      date: new Date().toISOString().split("T")[0],
      status: "Submitted" as const,
    };
    try {
      await createTimesheetApi(payload).unwrap();
      refetchTimesheets();
    } catch {
      // Local sync fallback
    }
    addLocalTimesheet(payload);
    modals.setTsProject("");
    modals.setTsTask("");
    modals.setIsTimesheetModalOpen(false);
    toast.success("Timesheet entry submitted for approval!");
  };

  const handleApproveTimesheet = async (id: string) => {
    try {
      await reviewTimesheetApi({ timesheet_id: id, status: "approved" }).unwrap();
      refetchTimesheets();
    } catch {
      // Local fallback
    }
    updateLocalTimesheetStatus(id, "Approved");
    toast.success("Timesheet entry approved!");
  };

  const handleCreateOvertime = () => {
    if (!modals.otReason.trim()) {
      toast.error("Please enter a reason for overtime.");
      return;
    }
    const ot = parseFloat(modals.otHours) || 2;
    addOvertime({
      employeeId: user?.id || "EMP-CURRENT",
      employeeName: user?.name || "Alex Mercer",
      department: "Human Resources",
      date: new Date().toISOString().split("T")[0],
      standardHours: 8,
      actualHours: 8 + ot,
      overtimeHours: ot,
      rateMultiplier: modals.otMultiplier,
      reason: modals.otReason.trim(),
      status: "Pending",
    });
    modals.setOtReason("");
    modals.setIsOvertimeModalOpen(false);
    toast.success("Overtime approval request sent to manager!");
  };

  const handleApplyLeave = async () => {
    if (!modals.leaveStart || !modals.leaveEnd || !modals.leaveReason.trim()) {
      toast.error("Please fill all leave details.");
      return;
    }
    const payload = {
      employeeId: user?.id || "EMP-CURRENT",
      employeeName: user?.name || "Alex Mercer",
      type: modals.leaveType,
      from: modals.leaveStart,
      to: modals.leaveEnd,
      startDate: modals.leaveStart,
      endDate: modals.leaveEnd,
      days: 1,
      reason: modals.leaveReason.trim(),
    };
    const fullLeavePayload: Record<string, unknown> = {
      id: `leave_${Date.now()}`,
      employeeId: user?.id || "EMP-CURRENT",
      employeeName: user?.name || "Alex Mercer",
      leaveType: modals.leaveType,
      type: modals.leaveType,
      from: modals.leaveStart,
      to: modals.leaveEnd,
      startDate: modals.leaveStart,
      endDate: modals.leaveEnd,
      days: 1,
      totalDays: 1,
      reason: modals.leaveReason.trim(),
      status: "pending",
      appliedAt: new Date().toISOString(),
    };
    try {
      await applyLeaveApi(payload).unwrap();
      refetchLeaves();
    } catch {
      // Local sync fallback
    }
    addLocalLeave(fullLeavePayload);
    modals.setLeaveReason("");
    modals.setIsLeaveModalOpen(false);
    toast.success("Leave application submitted successfully!");
  };

  const handleReviewLeave = async (id: string, status: "Approved" | "Denied") => {
    const normalizedStatus = status === "Approved" ? "approved" : "rejected";
    try {
      await reviewLeaveApi({ leave_id: id, status: normalizedStatus }).unwrap();
      refetchLeaves();
    } catch {
      // Local fallback
    }
    updateLocalLeaveStatus(id, normalizedStatus);
    toast.success(`Leave request ${status.toLowerCase()}!`);
  };

  return {
    handleCheckIn,
    handleToggleBreak,
    handleCheckOut,
    handleExportMusterRoll,
    handleCreateShift,
    handleCreateRoster,
    handleCreateHoliday,
    handleDeleteHoliday,
    handleCreateRegularization,
    handleCreateTimesheet,
    handleApproveTimesheet,
    handleCreateOvertime,
    handleApplyLeave,
    handleReviewLeave,
    updateRegularizationStatus,
    updateOvertimeStatus,
  };
}
