import { baseApi } from "@/services/api/baseApi";
import {
  APIResponse,
  EmployeeProgressItem,
  EmployeeProgressFilters,
  VerifyDocumentPayload,
  EmployeeStep8Document,
} from "./types";

const BASE_PATH = "/api/v1/admin/employee-onboarding";

export const onboardingAdminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET / — list all employees' onboarding progress
    listEmployeeProgress: builder.query<
      APIResponse<EmployeeProgressItem[]>,
      EmployeeProgressFilters | void
    >({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.status) params.set("status", filters.status);
        if (filters?.department) params.set("department", filters.department);
        if (filters?.page) params.set("page", String(filters.page));
        if (filters?.limit) params.set("limit", String(filters.limit));
        if (filters?.search) params.set("search", filters.search);
        const queryString = params.toString();
        return `${BASE_PATH}${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ employee_id }) => ({
                type: "OnboardingAdmin" as const,
                id: employee_id,
              })),
              { type: "OnboardingAdmin", id: "LIST" },
            ]
          : [{ type: "OnboardingAdmin", id: "LIST" }],
    }),

    // GET /{employee_id} — detailed progress for one employee
    getEmployeeProgressDetail: builder.query<
      APIResponse<EmployeeProgressItem>,
      string
    >({
      query: (employeeId) => `${BASE_PATH}/${employeeId}`,
      providesTags: (_result, _error, id) => [{ type: "OnboardingAdmin", id }],
    }),

    // PUT /{employee_id}/document/{doc_id}/verify — verify/approve document
    verifyEmployeeDocument: builder.mutation<
      APIResponse<EmployeeStep8Document>,
      { employeeId: string; docId: string; body: VerifyDocumentPayload }
    >({
      query: ({ employeeId, docId, body }) => ({
        url: `${BASE_PATH}/${employeeId}/document/${docId}/verify`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { employeeId }) => [
        { type: "OnboardingAdmin", id: employeeId },
        { type: "OnboardingAdmin", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useListEmployeeProgressQuery,
  useGetEmployeeProgressDetailQuery,
  useVerifyEmployeeDocumentMutation,
} = onboardingAdminApi;