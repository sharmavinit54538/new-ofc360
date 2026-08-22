import { useState } from "react";
import type { Employee } from "@/types/hr";
import type { SystemRole } from "@/features/auth/authTypes";
import type { JobMetaState } from "../types/jobMetaTypes";

export function useJobMetaState(): JobMetaState {
  const [probationPeriod, setProbationPeriod] = useState(3);
  const [capacity, setCapacity] = useState(100);
  const [costCenterId, setCostCenterId] = useState("CC-001");
  const [role, setRole] = useState<SystemRole>("employee");
  const [leaveGroup, setLeaveGroup] = useState("Standard India Policy");
  const [status, setStatus] = useState<Employee["status"]>("Active");

  return { probationPeriod, setProbationPeriod, capacity, setCapacity, costCenterId, setCostCenterId, role, setRole, leaveGroup, setLeaveGroup, status, setStatus };
}
