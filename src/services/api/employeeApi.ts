import { baseApi } from "./baseApi";
import { Employee } from "@/types/hr";

export interface GetEmployeesQueryParams {
  department?: string;
  status?: string;
  search?: string;
}

export type GetEmployeesQueryArg = GetEmployeesQueryParams | void;

export const employeeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query<Employee[], GetEmployeesQueryArg>({
      query: (params) => {
        const p = params as GetEmployeesQueryParams | undefined;
        const queryParams = new URLSearchParams();
        if (p?.department && p.department !== "ALL") {
          queryParams.append("department", p.department);
        }
        if (p?.status && p.status !== "ALL") {
          queryParams.append("status", p.status);
        }
        if (p?.search) {
          queryParams.append("search", p.search);
        }
        const queryString = queryParams.toString();
        return `/api/v1/employees${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Employee" as const, id })),
              { type: "Employee", id: "LIST" },
            ]
          : [{ type: "Employee", id: "LIST" }],
    }),

    getEmployeeById: builder.query<Employee, string>({
      query: (id) => `/api/v1/employees/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Employee", id }],
    }),

    createEmployee: builder.mutation<Employee, Omit<Employee, "id">>({
      query: (body) => ({
        url: "/api/v1/employees",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Employee", id: "LIST" }],
    }),

    updateEmployee: builder.mutation<Employee, { id: string; changes: Partial<Employee> }>({
      query: ({ id, changes }) => ({
        url: `/api/v1/employees/${id}`,
        method: "PATCH",
        body: changes,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Employee", id },
        { type: "Employee", id: "LIST" },
        "Timeline",
      ],
    }),

    deleteEmployee: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/api/v1/employees/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Employee", id },
        { type: "Employee", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useGetEmployeeByIdQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = employeeApi;
