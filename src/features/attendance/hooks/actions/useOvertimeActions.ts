import { useCreateOvertimeAction } from "./overtime/useCreateOvertimeAction";
import type { OvertimeEntry } from "../../types/attendance.types";

export function useOvertimeActions(p: {
  user?: { id?: string; name?: string } | null;
  overtimeModal: { otHours: string; otMultiplier: string; otReason: string; setOtReason: (v: string) => void; setIsOvertimeModalOpen: (v: boolean) => void };
  addOvertime: (ot: OvertimeEntry) => void;
  updateOvertimeStatus: (id: string, status: string) => void;
}) {
  const handleCreateOvertime = useCreateOvertimeAction(p);
  return { handleCreateOvertime, updateOvertimeStatus: p.updateOvertimeStatus };
}
