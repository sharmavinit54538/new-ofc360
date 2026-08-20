export interface PaginationParams { page?: number; pageSize?: number; sortBy?: string; sortOrder?: 'asc' | 'desc'; search?: string; }
export interface DateRangeParams { startDate?: string; endDate?: string; }
export interface FilterParams extends PaginationParams, DateRangeParams { status?: string; department?: string; [key: string]: any; }