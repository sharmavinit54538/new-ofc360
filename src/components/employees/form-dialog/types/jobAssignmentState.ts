import type { Employee } from "@/types/hr";

export interface JobAssignmentState {
  department: Employee["department"];
  setDepartment: (v: Employee["department"]) => void;
  designation: string;
  setDesignation: (v: string) => void;
  employmentType: Employee["employmentType"];
  setEmploymentType: (v: Employee["employmentType"]) => void;
}