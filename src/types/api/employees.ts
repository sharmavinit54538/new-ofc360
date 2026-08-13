export interface Employee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  designation: string;
  departmentId: string;
  departmentName?: string;
  managerId?: string;
  managerName?: string;
  joiningDate: string;
  status: 'active' | 'inactive' | 'pending' | 'onboarding' | 'exited';
  avatar?: string;
  salary?: number;
  role: string;
  location?: string;
  employmentType?: string;
  companyId?: string;
}

export interface CreateEmployeeRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  designation: string;
  departmentId: string;
  managerId?: string;
  joiningDate: string;
  salary?: number;
  role?: string;
  employmentType?: string;
}

export interface UpdateEmployeeRequest extends Partial<CreateEmployeeRequest> {
  status?: 'active' | 'inactive' | 'pending' | 'onboarding' | 'exited';
}

export interface Manager {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  departmentId: string;
  departmentName?: string;
  directReportsCount: number;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  managerId?: string;
  managerName?: string;
  employeeCount: number;
  status: 'active' | 'inactive';
}
