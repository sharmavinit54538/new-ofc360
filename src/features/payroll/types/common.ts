export interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors: { field?: string; message: string }[] | null;
}

export interface PaginationQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  [key: string]: any;
}
