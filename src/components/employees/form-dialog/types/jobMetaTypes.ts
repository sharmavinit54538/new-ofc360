import type { Employee } from "@/types/hr";
import type { SystemRole } from "@/features/auth/authTypes";

export interface JobMetaState {
  probationPeriod: number;
  setProbationPeriod: (v: number) => void;
  capacity: number;
  setCapacity: (v: number) => void;
  costCenterId: string;
  setCostCenterId: (v: string) => void;
  role: SystemRole;
  setRole: (v: SystemRole) => void;
  leaveGroup: string;
  setLeaveGroup: (v: string) => void;
  status: Employee["status"];
  setStatus: (v: Employee["status"]) => void;
}
