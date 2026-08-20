export interface ApiResponse<T = any> { data: T; message?: string; success: boolean; error?: string; }
export interface PaginatedResponse<T = any> { items: T[]; total: number; page: number; pageSize: number; totalPages: number; hasNext: boolean; hasPrev: boolean; }
export interface ApiError { message: string; code?: string; status?: number; errors?: Record<string, string[]>; }