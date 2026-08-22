import type { Employee } from "@/types/hr";
import type { SystemRole } from "@/features/auth/authTypes";

export interface JobDetailsState {
  department: Employee["department"];
  setDepartment: (v: Employee["department"]) => void;
  designation: string;
  setDesignation: (v: string) => void;
  employmentType: Employee["employmentType"];
  setEmploymentType: (v: Employee["employmentType"]) => void;
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
