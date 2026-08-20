export interface Employee {
  id: string; employeeId?: string; full_name?: string; name?: string; email: string;
  phone?: string; department: string; designation?: string; role?: string;
  joiningDate?: string; status: 'active' | 'inactive' | 'on-leave' | 'probation';
  salary?: { basic: number; hra: number; allowances: number; deductions: number; net: number; };
}
export interface CreateEmployeeRequest {
  name: string; email: string; phone?: string; department: string; designation?: string;
  role?: string; joiningDate?: string; salary?: { basic: number; hra: number; allowances: number; };
}
export type UpdateEmployeeRequest = Partial<CreateEmployeeRequest> & { status?: string; };