export interface EmployeeCompDetails {
  employmentType: "full-time" | "part-time" | "contract" | "intern" | "FULL_TIME" | string;
  status: "active" | "inactive" | "on_leave" | "probation" | "Active" | string;
  joiningDate?: string;
  joinedAt?: string;
  ctcAnnual?: number;
  ctc?: number;
  salary?: any;
  basicSalary?: number;
  hra?: number;
  bonus?: number;
  pfDeduction?: number;
  esiDeduction?: number;
  profTax?: number;
}
