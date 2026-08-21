export interface GetDepartmentsQueryParams {
  status?: string;
  location?: string;
  hiring?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export type GetDepartmentsQueryArg = GetDepartmentsQueryParams | void;
