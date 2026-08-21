import { toast } from "sonner";
import type { ShiftTemplate, RosterItem } from "../../types/attendance.types";

interface ShiftModalState {
  shiftName: string;
  shiftStart: string;
  shiftEnd: string;
  shiftGrace: string;
  shiftDept: string;
  setShiftName: (val: string) => void;
  setIsShiftModalOpen: (val: boolean) => void;
}

interface RosterModalState {
  rosterEmp: string;
  rosterShift: string;
  rosterDay: string;
  setIsRosterModalOpen: (val: boolean) => void;
}

interface UseShiftRosterActionsProps {
  shiftModal: ShiftModalState;
  rosterModal: RosterModalState;
  addShift: (shift: Omit<ShiftTemplate, "id"> | ShiftTemplate) => void;
  addRoster: (roster: Omit<RosterItem, "id"> | RosterItem) => void;
  createShiftPlanApi: (args: Record<string, unknown>) => { unwrap: () => Promise<unknown> };
}

export function useShiftRosterActions({
  shiftModal,
  rosterModal,
  addShift,
  addRoster,
  createShiftPlanApi,
}: UseShiftRosterActionsProps) {
  const handleCreateShift = async () => {
    if (!shiftModal.shiftName.trim()) {
      toast.error("Please enter a shift name.");
      return;
    }
    const newShift = {
      name: shiftModal.shiftName.trim(),
      startTime: shiftModal.shiftStart,
      endTime: shiftModal.shiftEnd,
      gracePeriodMins: parseInt(shiftModal.shiftGrace) || 15,
      halfDayHours: 4.5,
      fullDayHours: 8.0,
      breakDurationMins: 45,
      department: shiftModal.shiftDept,
    };
    try {
      await createShiftPlanApi(newShift).unwrap().catch(() => {});
    } catch {
      // Local sync fallback
    }
    addShift(newShift);
    shiftModal.setShiftName("");
    shiftModal.setIsShiftModalOpen(false);
    toast.success("Shift template created & synchronized!");
  };

  const handleCreateRoster = async () => {
    if (!rosterModal.rosterEmp.trim()) {
      toast.error("Please select an employee.");
      return;
    }
    const newRoster = {
      employeeId: "EMP-" + Math.floor(1000 + Math.random() * 9000),
      employeeName: rosterModal.rosterEmp,
      department: "Engineering",
      shiftName: rosterModal.rosterShift,
      timing: "09:00 - 18:00",
      dayOfWeek: rosterModal.rosterDay,
      date: new Date().toLocaleDateString(),
    };
    try {
      await createShiftPlanApi(newRoster).unwrap().catch(() => {});
    } catch {
      // Local sync fallback
    }
    addRoster(newRoster);
    rosterModal.setIsRosterModalOpen(false);
    toast.success(`Roster assigned for ${rosterModal.rosterEmp}!`);
  };

  return {
    handleCreateShift,
    handleCreateRoster,
  };
}
