import { useState } from "react";
import type { HolidayItem, RegularizationRequest } from "../types/attendance.types";

export function useAttendanceModals() {
  // 1. Shift Modal
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [shiftName, setShiftName] = useState("");
  const [shiftStart, setShiftStart] = useState("09:00");
  const [shiftEnd, setShiftEnd] = useState("18:00");
  const [shiftGrace, setShiftGrace] = useState("15");
  const [shiftDept, setShiftDept] = useState("Engineering");

  // 2. Roster Modal
  const [isRosterModalOpen, setIsRosterModalOpen] = useState(false);
  const [rosterEmp, setRosterEmp] = useState("");
  const [rosterShift, setRosterShift] = useState("General Shift [9AM - 6PM]");
  const [rosterDay, setRosterDay] = useState("Monday");

  // 3. Holiday Modal
  const [isHolidayModalOpen, setIsHolidayModalOpen] = useState(false);
  const [holidayTitle, setHolidayTitle] = useState("");
  const [holidayDate, setHolidayDate] = useState("");
  const [holidayType, setHolidayType] = useState<HolidayItem["type"]>("National");
  const [holidayBranch, setHolidayBranch] = useState("Headquarters (HQ)");

  // 4. Regularization Modal
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [regDate, setRegDate] = useState(new Date().toISOString().split("T")[0]);
  const [regType, setRegType] = useState<RegularizationRequest["missedPunchType"]>("Check-In");
  const [regTime, setRegTime] = useState("09:30");
  const [regReason, setRegReason] = useState("");

  // 5. Timesheet Modal
  const [isTimesheetModalOpen, setIsTimesheetModalOpen] = useState(false);
  const [tsProject, setTsProject] = useState("");
  const [tsTask, setTsTask] = useState("");
  const [tsHours, setTsHours] = useState("8");
  const [tsBillable, setTsBillable] = useState(true);

  // 6. Overtime Modal
  const [isOvertimeModalOpen, setIsOvertimeModalOpen] = useState(false);
  const [otHours, setOtHours] = useState("2.5");
  const [otMultiplier, setOtMultiplier] = useState<string>("1.5x (Weekday)");
  const [otReason, setOtReason] = useState("");

  // 7. Leave Modal
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveType, setLeaveType] = useState("Casual Leave (CL)");
  const [leaveStart, setLeaveStart] = useState("");
  const [leaveEnd, setLeaveEnd] = useState("");
  const [leaveReason, setLeaveReason] = useState("");

  return {
    // Shift
    isShiftModalOpen,
    setIsShiftModalOpen,
    shiftName,
    setShiftName,
    shiftStart,
    setShiftStart,
    shiftEnd,
    setShiftEnd,
    shiftGrace,
    setShiftGrace,
    shiftDept,
    setShiftDept,

    // Roster
    isRosterModalOpen,
    setIsRosterModalOpen,
    rosterEmp,
    setRosterEmp,
    rosterShift,
    setRosterShift,
    rosterDay,
    setRosterDay,

    // Holiday
    isHolidayModalOpen,
    setIsHolidayModalOpen,
    holidayTitle,
    setHolidayTitle,
    holidayDate,
    setHolidayDate,
    holidayType,
    setHolidayType,
    holidayBranch,
    setHolidayBranch,

    // Regularization
    isRegModalOpen,
    setIsRegModalOpen,
    regDate,
    setRegDate,
    regType,
    setRegType,
    regTime,
    setRegTime,
    regReason,
    setRegReason,

    // Timesheet
    isTimesheetModalOpen,
    setIsTimesheetModalOpen,
    tsProject,
    setTsProject,
    tsTask,
    setTsTask,
    tsHours,
    setTsHours,
    tsBillable,
    setTsBillable,

    // Overtime
    isOvertimeModalOpen,
    setIsOvertimeModalOpen,
    otHours,
    setOtHours,
    otMultiplier,
    setOtMultiplier,
    otReason,
    setOtReason,

    // Leave
    isLeaveModalOpen,
    setIsLeaveModalOpen,
    leaveType,
    setLeaveType,
    leaveStart,
    setLeaveStart,
    leaveEnd,
    setLeaveEnd,
    leaveReason,
    setLeaveReason,
  };
}
