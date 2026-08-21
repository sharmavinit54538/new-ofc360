import { api } from "../client";

export interface Company {
  id: string;
  name: string;
  legal_name?: string;
  registration_number?: string;
  tax_id?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo_url?: string;
  industry?: string;
  size?: string;
  founded_year?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CompanySettings {
  id: string;
  company_id: string;
  timezone: string;
  date_format: string;
  time_format: string;
  currency: string;
  language: string;
  fiscal_year_start: number;
  leave_policy_id?: string;
  attendance_policy_id?: string;
  payroll_policy_id?: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  manager_id?: string;
  parent_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Designation {
  id: string;
  title: string;
  department_id?: string;
  level?: number;
  min_salary?: number;
  max_salary?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Branch {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  phone?: string;
  email?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  type?: string;
  branch_id?: string;
  is_recurring: boolean;
  created_at: string;
  updated_at: string;
}

export const companyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCompany: builder.query<Company, void>({
      query: () => "/api/v1/company",
      providesTags: ["Company"],
    }),

    updateCompany: builder.mutation<Company, Partial<Company>>({
      query: (body) => ({
        url: "/api/v1/company",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Company"],
    }),

    getCompanySettings: builder.query<CompanySettings, void>({
      query: () => "/api/v1/company/settings",
      providesTags: ["Company", "Settings"],
    }),

    updateCompanySettings: builder.mutation<CompanySettings, Partial<CompanySettings>>({
      query: (body) => ({
        url: "/api/v1/company/settings",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Company", "Settings"],
    }),

    getDepartments: builder.query<Department[], void>({
      query: () => "/api/v1/company/departments",
      providesTags: ["Department"],
    }),

    getDepartmentById: builder.query<Department, string>({
      query: (id) => `/api/v1/company/departments/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Department", id }],
    }),

    createDepartment: builder.mutation<Department, Partial<Department>>({
      query: (body) => ({
        url: "/api/v1/company/departments",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Department"],
    }),

    updateDepartment: builder.mutation<Department, { id: string; data: Partial<Department> }>({
      query: ({ id, data }) => ({
        url: `/api/v1/company/departments/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Department", id }, { type: "Department", id: "LIST" }],
    }),

    deleteDepartment: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/api/v1/company/departments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Department"],
    }),

    getDesignations: builder.query<Designation[], { departmentId?: string }>({
      query: (params) => {
        const p = params as { departmentId?: string } | undefined;
        const queryParams = new URLSearchParams();
        if (p?.departmentId) queryParams.append("department_id", p.departmentId);
        const queryString = queryParams.toString();
        return `/api/v1/company/designations${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["Department"],
    }),

    createDesignation: builder.mutation<Designation, Partial<Designation>>({
      query: (body) => ({
        url: "/api/v1/company/designations",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Department"],
    }),

    updateDesignation: builder.mutation<Designation, { id: string; data: Partial<Designation> }>({
      query: ({ id, data }) => ({
        url: `/api/v1/company/designations/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Department"],
    }),

    deleteDesignation: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/api/v1/company/designations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Department"],
    }),

    getBranches: builder.query<Branch[], void>({
      query: () => "/api/v1/company/branches",
      providesTags: ["Company"],
    }),

    createBranch: builder.mutation<Branch, Partial<Branch>>({
      query: (body) => ({
        url: "/api/v1/company/branches",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Company"],
    }),

    getHolidays: builder.query<Holiday[], { year?: number }>({
      query: (params) => `/api/v1/company/holidays${params?.year ? `?year=${params.year}` : ""}`,
      providesTags: ["Company"],
    }),

    createHoliday: builder.mutation<Holiday, Partial<Holiday>>({
      query: (body) => ({
        url: "/api/v1/company/holidays",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Company"],
    }),

    deleteHoliday: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/api/v1/company/holidays/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Company"],
    }),
  }),
});

export const {
  useGetCompanyQuery,
  useUpdateCompanyMutation,
  useGetCompanySettingsQuery,
  useUpdateCompanySettingsMutation,
  useGetDepartmentsQuery,
  useGetDepartmentByIdQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  useGetDesignationsQuery,
  useCreateDesignationMutation,
  useUpdateDesignationMutation,
  useDeleteDesignationMutation,
  useGetBranchesQuery,
  useCreateBranchMutation,
  useGetHolidaysQuery,
  useCreateHolidayMutation,
  useDeleteHolidayMutation,
} = companyApi;