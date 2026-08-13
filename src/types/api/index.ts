// Centralized API Type Definitions

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface PaginatedQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: string;
  departmentId?: string;
  managerId?: string;
  startDate?: string;
  endDate?: string;
  [key: string]: any;
}

// Domain Types
export * from './auth';
export * from './employees';
export * from './payroll';
export * from './recruitment';
export * from './attendance';
export * from './leaves';
export * from './performance';
export * from './documents';
export * from './ai';
export * from './settings';
