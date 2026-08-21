import { AddShiftDialog } from "./dialogs/AddShiftDialog";
import { AssignRosterDialog } from "./dialogs/AssignRosterDialog";
import { AddHolidayDialog } from "./dialogs/AddHolidayDialog";
import type { AttendanceDialogProps } from "../../types/dialogPropTypes";

export function AttendanceOrgDialogs({ modals, actions }: AttendanceDialogProps) {
  return (
    <>
      <AddShiftDialog isOpen={modals.isShiftModalOpen} onOpenChange={modals.setIsShiftModalOpen} shiftName={modals.shiftName} setShiftName={modals.setShiftName} shiftStart={modals.shiftStart} setShiftStart={modals.setShiftStart} shiftEnd={modals.shiftEnd} setShiftEnd={modals.setShiftEnd} shiftGrace={modals.shiftGrace} setShiftGrace={modals.setShiftGrace} shiftDept={modals.shiftDept} setShiftDept={modals.setShiftDept} onSubmit={actions.handleCreateShift} />
      <AssignRosterDialog isOpen={modals.isRosterModalOpen} onOpenChange={modals.setIsRosterModalOpen} rosterEmp={modals.rosterEmp} setRosterEmp={modals.setRosterEmp} rosterShift={modals.rosterShift} setRosterShift={modals.setRosterShift} rosterDay={modals.rosterDay} setRosterDay={modals.setRosterDay} onSubmit={actions.handleCreateRoster} />
      <AddHolidayDialog isOpen={modals.isHolidayModalOpen} onOpenChange={modals.setIsHolidayModalOpen} holidayTitle={modals.holidayTitle} setHolidayTitle={modals.setHolidayTitle} holidayDate={modals.holidayDate} setHolidayDate={modals.setHolidayDate} holidayType={modals.holidayType} setHolidayType={modals.setHolidayType} holidayBranch={modals.holidayBranch} setHolidayBranch={modals.setHolidayBranch} onSubmit={actions.handleCreateHoliday} />
    </>
  );
}
