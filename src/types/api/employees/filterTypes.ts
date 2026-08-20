export interface EmployeeFilters {
  department?: string; status?: string; role?: string; search?: string;
  page?: number; limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc';
}
export interface Department { id: string; name: string; description?: string; headId?: string; headName?: string; employeeCount?: number; }