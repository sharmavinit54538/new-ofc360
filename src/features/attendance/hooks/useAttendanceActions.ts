import { exportMusterRollCsv } from "../utils/attendance.utils";
import { usePunchActions } from "./actions/usePunchActions";
import { useShiftRosterActions } from "./actions/useShiftRosterActions";
import { useHolidayActions } from "./actions/useHolidayActions";
import { useRegularizationActions } from "./actions/useRegularizationActions";
import { useTimesheetActions } from "./actions/useTimesheetActions";
import { useLeaveActions } from "./actions/useLeaveActions";
import { useOvertimeActions } from "./actions/useOvertimeActions";
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
import type { useAttendanceModals } from "./useAttendanceModals";

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
  updateRegularizationStatus: (
    id: string,
    status: string,
    approverName?: string,
    reviewComment?: string
  ) => void;
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

  // Modals state
  modals: ReturnType<typeof useAttendanceModals>;
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
  const refetchFeeds = () => {
    refetchMyStatus();
    refetchAnalytics();
    if (isHrOrAdmin && refetchCompany) refetchCompany();
    else if (isManagerOrAbove && refetchTeam) refetchTeam();
    else if (refetchPersonal) refetchPersonal();
  };

  const { handleCheckIn, handleToggleBreak, handleCheckOut } = usePunchActions({
    user,
    shifts,
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
    faceCheckIn,
    faceCheckOut,
    refetchFeeds,
  });

  const { handleCreateShift, handleCreateRoster } = useShiftRosterActions({
    shiftModal: {
      shiftName: modals.shiftName,
      shiftStart: modals.shiftStart,
      shiftEnd: modals.shiftEnd,
      shiftGrace: modals.shiftGrace,
      shiftDept: modals.shiftDept,
      setShiftName: modals.setShiftName,
      setIsShiftModalOpen: modals.setIsShiftModalOpen,
    },
    rosterModal: {
      rosterEmp: modals.rosterEmp,
      rosterShift: modals.rosterShift,
      rosterDay: modals.rosterDay,
      setIsRosterModalOpen: modals.setIsRosterModalOpen,
    },
    addShift,
    addRoster,
    createShiftPlanApi,
  });

  const { handleCreateHoliday, handleDeleteHoliday } = useHolidayActions({
    holidayModal: {
      holidayTitle: modals.holidayTitle,
      holidayDate: modals.holidayDate,
      holidayType: modals.holidayType,
      holidayBranch: modals.holidayBranch,
      setHolidayTitle: modals.setHolidayTitle,
      setHolidayDate: modals.setHolidayDate,
      setIsHolidayModalOpen: modals.setIsHolidayModalOpen,
    },
    addLocalHoliday,
    deleteLocalHoliday,
    createHolidayApi,
    deleteHolidayApi,
    refetchHolidays,
  });

  const { handleCreateRegularization } = useRegularizationActions({
    user,
    regModal: {
      regDate: modals.regDate,
      regType: modals.regType,
      regTime: modals.regTime,
      regReason: modals.regReason,
      setRegReason: modals.setRegReason,
      setIsRegModalOpen: modals.setIsRegModalOpen,
    },
    addRegularization,
    updateRegularizationStatus,
  });

  const { handleCreateTimesheet, handleApproveTimesheet } = useTimesheetActions({
    user,
    timesheetModal: {
      tsProject: modals.tsProject,
      tsTask: modals.tsTask,
      tsHours: modals.tsHours,
      tsBillable: modals.tsBillable,
      setTsProject: modals.setTsProject,
      setTsTask: modals.setTsTask,
      setIsTimesheetModalOpen: modals.setIsTimesheetModalOpen,
    },
    addLocalTimesheet,
    updateLocalTimesheetStatus,
    createTimesheetApi,
    reviewTimesheetApi,
    refetchTimesheets,
  });

  const { handleApplyLeave, handleReviewLeave } = useLeaveActions({
    user,
    leaveModal: {
      leaveType: modals.leaveType,
      leaveStart: modals.leaveStart,
      leaveEnd: modals.leaveEnd,
      leaveReason: modals.leaveReason,
      setLeaveReason: modals.setLeaveReason,
      setIsLeaveModalOpen: modals.setIsLeaveModalOpen,
    },
    addLocalLeave,
    updateLocalLeaveStatus,
    applyLeaveApi,
    reviewLeaveApi,
    refetchLeaves,
  });

  const { handleCreateOvertime } = useOvertimeActions({
    user,
    overtimeModal: {
      otHours: modals.otHours,
      otMultiplier: modals.otMultiplier,
      otReason: modals.otReason,
      setOtReason: modals.setOtReason,
      setIsOvertimeModalOpen: modals.setIsOvertimeModalOpen,
    },
    addOvertime,
    updateOvertimeStatus,
  });

  const handleExportMusterRoll = async () => {
    try {
      await triggerAttendanceExport(undefined).unwrap().catch(() => {});
    } catch {
      // Fall through to CSV generator
    }
    const recordsToExport = (
      punches.length > 0 ? punches : liveAttendanceList
    ) as unknown as Array<Record<string, unknown>>;
    exportMusterRollCsv(recordsToExport, user || undefined);
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
