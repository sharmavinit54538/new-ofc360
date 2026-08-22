import type { Employee } from "@/types/hr";

export interface JobScheduleState {
  joiningDate: string;
  setJoiningDate: (v: string) => void;
  reportingManager: string;
  setReportingManager: (v: string) => void;
  shift: Employee["shift"];
  setShift: (v: Employee["shift"]) => void;
  team: string;
  setTeam: (v: string) => void;
  branchOffice: string;
  setBranchOffice: (v: string) => void;
  workLocation: Employee["workLocation"];
  setWorkLocation: (v: Employee["workLocation"]) => void;
}