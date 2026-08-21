import { useCreateShiftAction } from "./shifts/useCreateShiftAction";
import { useCreateRosterAction } from "./shifts/useCreateRosterAction";
import type { ShiftTemplate, RosterItem } from "../../types/attendance.types";

export function useShiftRosterActions(p: {
  shiftModal: { shiftName: string; shiftStart: string; shiftEnd: string; shiftGrace: string; shiftDept: string; setShiftName: (v: string) => void; setIsShiftModalOpen: (v: boolean) => void };
  rosterModal: { rosterEmp: string; rosterShift: string; rosterDay: string; setIsRosterModalOpen: (v: boolean) => void };
  addShift: (shift: ShiftTemplate) => void; addRoster: (roster: RosterItem) => void;
  createShiftPlanApi: (args: Record<string, unknown>) => { unwrap: () => Promise<unknown> };
}) {
  const handleCreateShift = useCreateShiftAction({ shiftModal: p.shiftModal, addShift: p.addShift, createShiftPlanApi: p.createShiftPlanApi });
  const handleCreateRoster = useCreateRosterAction({ rosterModal: p.rosterModal, addRoster: p.addRoster, createShiftPlanApi: p.createShiftPlanApi });
  return { handleCreateShift, handleCreateRoster };
}
